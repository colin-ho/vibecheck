#!/usr/bin/env python3
"""Tests for vibes.py

After moving text analysis to Claude, Python now only handles:
- Loading stats from stats-cache.json
- Extracting tool usage from JSONL files
- Extracting user prompts for Claude to analyze
- Calculating time-based quirks
- Building the base bundle with numeric stats
- Encoding for URL transport
"""

import base64
import gzip
import json
import shutil
import sys
import tempfile
from pathlib import Path
from typing import List, Optional

import pytest

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from bundle_types import AnonymousBundle, Quirks, Stats, TokenCounts
from vibes import (
    PROMPTS_DIR,
    build_bundle,
    calculate_quirks,
    compute_top_words,
    encode_bundle,
    extract_tools,
    extract_user_prompts_by_project,
    iter_jsonl_files,
    iter_jsonl_records,
    load_stats_cache,
    longest_streak,
    merge_batch_results,
    weekend_percentage,
    write_prompts_to_files,
)

FIXTURES_DIR = Path(__file__).parent / "fixtures"
STATS_DIR = FIXTURES_DIR / "stats-cache"
PROJECTS_DIR = FIXTURES_DIR / "projects"


class TestLoadStatsCache:
    def test_loads_minimal_stats(self):
        stats = load_stats_cache(STATS_DIR / "minimal.json")
        assert stats["totalSessions"] == 5
        assert stats["totalMessages"] == 100

    def test_loads_complete_stats(self):
        stats = load_stats_cache(STATS_DIR / "complete.json")
        assert stats["totalSessions"] == 144
        assert stats["totalMessages"] == 22639
        assert "modelUsage" in stats
        assert "claude-opus-4-5-20251101" in stats["modelUsage"]

    def test_fails_on_missing_file(self):
        with pytest.raises(SystemExit):
            load_stats_cache(STATS_DIR / "nonexistent.json")


class TestIterJsonlRecords:
    def test_yields_all_records(self):
        records = list(iter_jsonl_records(PROJECTS_DIR))
        assert len(records) > 0

    def test_yields_dict_records(self):
        for record in iter_jsonl_records(PROJECTS_DIR):
            assert isinstance(record, dict)

    def test_empty_for_missing_dir(self):
        records = list(iter_jsonl_records(Path("/nonexistent")))
        assert records == []

    def test_filters_file_history_snapshot(self):
        """file-history-snapshot records should be filtered out."""
        records = list(iter_jsonl_records(PROJECTS_DIR))
        for record in records:
            assert record.get("type") != "file-history-snapshot"


class TestExtractTools:
    def test_counts_tool_usage(self):
        tools = extract_tools(PROJECTS_DIR)
        assert isinstance(tools, dict)
        assert "Read" in tools
        assert "Edit" in tools
        assert tools["Read"] >= 4  # Multiple sessions have Read

    def test_returns_sorted_by_count(self):
        tools = extract_tools(PROJECTS_DIR)
        counts = list(tools.values())
        assert counts == sorted(counts, reverse=True)


class TestExtractUserPromptsByProject:
    def test_extracts_project_and_prompts(self):
        prompts = list(extract_user_prompts_by_project(PROJECTS_DIR))
        assert len(prompts) > 0
        # Each item is (project_name, prompt_text)
        for project_name, prompt_text in prompts:
            assert isinstance(project_name, str)
            assert isinstance(prompt_text, str)
            assert len(project_name) > 0
            assert len(prompt_text) > 0

    def test_excludes_tool_results(self):
        prompts = list(extract_user_prompts_by_project(PROJECTS_DIR))
        # Tool results are arrays, not strings
        for _, p in prompts:
            assert not p.startswith("[{")

    def test_filters_system_messages(self):
        prompts = list(extract_user_prompts_by_project(PROJECTS_DIR))
        for _, p in prompts:
            assert not p.startswith("<local-command-caveat>")
            assert not p.startswith("<command-name>")
            assert not p.startswith("<system-reminder>")
            assert not p.startswith("<task-notification>")

    def test_filters_isMeta_records(self):
        prompts = list(extract_user_prompts_by_project(PROJECTS_DIR))
        # The isMeta content should not appear
        for _, p in prompts:
            assert "meta content that should be filtered" not in p


class TestLongestStreak:
    def test_single_day(self):
        assert longest_streak(["2026-01-20"]) == 1

    def test_consecutive_days(self):
        dates = ["2026-01-20", "2026-01-21", "2026-01-22"]
        assert longest_streak(dates) == 3

    def test_gap_in_dates(self):
        dates = ["2026-01-20", "2026-01-21", "2026-01-25", "2026-01-26"]
        assert longest_streak(dates) == 2

    def test_empty_dates(self):
        assert longest_streak([]) == 1

    def test_unordered_dates(self):
        dates = ["2026-01-22", "2026-01-20", "2026-01-21"]
        assert longest_streak(dates) == 3

    def test_duplicate_dates(self):
        dates = ["2026-01-20", "2026-01-20", "2026-01-21"]
        assert longest_streak(dates) == 2


class TestWeekendPercentage:
    def test_all_weekdays(self):
        # Jan 20-23 2026 are Mon-Thu
        dates = ["2026-01-20", "2026-01-21", "2026-01-22", "2026-01-23"]
        assert weekend_percentage(dates) == 0

    def test_all_weekends(self):
        # Jan 24-25 2026 are Sat-Sun
        dates = ["2026-01-24", "2026-01-25"]
        assert weekend_percentage(dates) == 100

    def test_mixed_days(self):
        # 2 weekdays + 2 weekend days = 50%
        dates = ["2026-01-20", "2026-01-21", "2026-01-24", "2026-01-25"]
        assert weekend_percentage(dates) == 50

    def test_empty_dates(self):
        assert weekend_percentage([]) == 0


class TestCalculateQuirks:
    def test_calculates_late_night(self):
        stats = {"hourCounts": {"22": 5, "23": 3, "0": 2}}
        quirks = calculate_quirks(stats, PROJECTS_DIR)
        assert quirks.lateNightSessions == 10

    def test_calculates_early_morning(self):
        stats = {"hourCounts": {"5": 1, "6": 2, "7": 3, "8": 4}}
        quirks = calculate_quirks(stats, PROJECTS_DIR)
        assert quirks.earlyMorningSessions == 10

    def test_calculates_streak(self):
        stats = load_stats_cache(STATS_DIR / "complete.json")
        quirks = calculate_quirks(stats, PROJECTS_DIR)
        assert quirks.longestStreakDays == 4  # 4 consecutive days in fixture


class TestBuildBundle:
    def test_builds_valid_bundle(self):
        base_stats = load_stats_cache(STATS_DIR / "minimal.json")
        tools = extract_tools(PROJECTS_DIR)
        quirks = calculate_quirks(base_stats, PROJECTS_DIR)

        bundle = build_bundle(base_stats, tools, quirks, PROJECTS_DIR)

        assert hasattr(bundle, "stats")
        assert hasattr(bundle, "quirks")
        assert hasattr(bundle, "generatedAt")
        # insights will be None until Claude enriches it
        assert bundle.insights is None
        # personaId starts empty, Claude fills it
        assert bundle.personaId == ""

    def test_stats_structure(self):
        base_stats = load_stats_cache(STATS_DIR / "complete.json")
        tools = extract_tools(PROJECTS_DIR)
        quirks = calculate_quirks(base_stats, PROJECTS_DIR)

        bundle = build_bundle(base_stats, tools, quirks, PROJECTS_DIR)

        assert bundle.stats.totalSessions == 144
        assert bundle.stats.totalMessages == 22639
        assert hasattr(bundle.stats, "totalTokens")
        assert bundle.stats.totalTokens.input > 0
        assert bundle.stats.totalTokens.output > 0
        assert bundle.stats.totalTokens.cached > 0

    def test_model_usage_normalization(self):
        base_stats = load_stats_cache(STATS_DIR / "complete.json")
        tools = {}
        quirks = Quirks(
            interruptCount=0,
            abandonedSessions=0,
            lateNightSessions=0,
            earlyMorningSessions=0,
            weekendPercentage=0,
            shortestSessionSeconds=60,
            longestStreakDays=1,
        )

        bundle = build_bundle(base_stats, tools, quirks, PROJECTS_DIR)

        # Model names should be normalized
        assert "opus" in bundle.stats.modelUsage
        assert "sonnet" in bundle.stats.modelUsage
        assert "haiku" in bundle.stats.modelUsage

    def test_hour_counts_array(self):
        base_stats = load_stats_cache(STATS_DIR / "minimal.json")
        tools = {}
        quirks = Quirks(
            interruptCount=0,
            abandonedSessions=0,
            lateNightSessions=0,
            earlyMorningSessions=0,
            weekendPercentage=0,
            shortestSessionSeconds=60,
            longestStreakDays=1,
        )

        bundle = build_bundle(base_stats, tools, quirks, PROJECTS_DIR)

        # hourCounts should be array of 24 elements
        assert len(bundle.stats.hourCounts) == 24
        assert bundle.stats.hourCounts[9] == 1
        assert bundle.stats.hourCounts[10] == 2


class TestEncodeBundle:
    def _make_minimal_bundle(self, funFacts: Optional[List[str]] = None) -> AnonymousBundle:
        """Create a minimal valid bundle for testing."""
        from datetime import datetime, timezone

        return AnonymousBundle(
            stats=Stats(
                totalSessions=1,
                totalMessages=1,
                totalTokens=TokenCounts(input=100, output=50, cached=10),
                totalToolCalls=1,
                toolUsage={"Read": 1},
                modelUsage={"sonnet": 150},
                hourCounts=[0] * 24,
                peakHour=12,
                longestSessionMinutes=10,
                projectCount=1,
                daysActive=1,
                activeDates=None,
            ),
            personaId="test",
            traits=["trait1"],
            promptingStyle="direct",
            communicationTone="friendly",
            funFacts=funFacts or ["fact1"],
            generatedAt=datetime.now(timezone.utc),
        )

    def test_encodes_and_decodes(self):
        bundle = self._make_minimal_bundle()
        encoded = encode_bundle(bundle)

        # Should be base64url encoded
        assert isinstance(encoded, str)
        assert "+" not in encoded
        assert "/" not in encoded

        # Should decode back
        padded = encoded + "=" * (4 - len(encoded) % 4)
        compressed = base64.urlsafe_b64decode(padded)
        json_bytes = gzip.decompress(compressed)
        decoded = json.loads(json_bytes)

        assert decoded["stats"]["totalSessions"] == 1
        assert decoded["personaId"] == "test"

    def test_compression_works(self):
        # Create bundle with large funFacts to test compression
        bundle = self._make_minimal_bundle(funFacts=["x" * 1000])
        encoded = encode_bundle(bundle)

        # Encoded should be smaller than raw JSON
        raw_len = len(bundle.model_dump_json())
        assert len(encoded) < raw_len


class TestIntegration:
    def test_full_pipeline(self):
        """Test the complete pipeline from stats to encoded URL."""
        base_stats = load_stats_cache(STATS_DIR / "complete.json")
        tools = extract_tools(PROJECTS_DIR)
        quirks = calculate_quirks(base_stats, PROJECTS_DIR)
        bundle = build_bundle(base_stats, tools, quirks, PROJECTS_DIR)
        encoded = encode_bundle(bundle)

        # Verify we can decode it back
        padded = encoded + "=" * (4 - len(encoded) % 4)
        compressed = base64.urlsafe_b64decode(padded)
        json_bytes = gzip.decompress(compressed)
        decoded = json.loads(json_bytes)

        # Check key fields survived roundtrip
        assert decoded["stats"]["totalSessions"] == 144
        assert decoded["stats"]["totalMessages"] == 22639
        assert len(decoded["stats"]["hourCounts"]) == 24


class TestRealUserFixture:
    """Tests using real (trimmed) user data."""

    REAL_STATS = STATS_DIR / "real-user.json"
    REAL_PROJECTS = FIXTURES_DIR / "projects" / "real-user"

    @pytest.fixture(autouse=True)
    def skip_if_missing(self):
        if not self.REAL_STATS.exists() or not self.REAL_PROJECTS.exists():
            pytest.skip("Real user fixtures not available")

    def test_loads_real_stats(self):
        stats = load_stats_cache(self.REAL_STATS)
        assert stats["totalSessions"] > 0
        assert stats["totalMessages"] > 0

    def test_extracts_tools_from_real_data(self):
        tools = extract_tools(self.REAL_PROJECTS)
        assert len(tools) > 0
        # Real data should have common tools
        assert any(t in tools for t in ["Read", "Edit", "Bash", "Write"])

    def test_extracts_prompts_from_real_data(self):
        prompts = list(extract_user_prompts_by_project(self.REAL_PROJECTS))
        assert len(prompts) > 0

    def test_full_pipeline_with_real_data(self):
        base_stats = load_stats_cache(self.REAL_STATS)
        tools = extract_tools(self.REAL_PROJECTS)
        quirks = calculate_quirks(base_stats, self.REAL_PROJECTS)
        bundle = build_bundle(base_stats, tools, quirks, self.REAL_PROJECTS)
        encoded = encode_bundle(bundle)

        # Should produce valid URL
        assert len(encoded) > 100

        # Verify roundtrip
        padded = encoded + "=" * (4 - len(encoded) % 4)
        compressed = base64.urlsafe_b64decode(padded)
        json_bytes = gzip.decompress(compressed)
        decoded = json.loads(json_bytes)

        assert decoded["stats"]["totalSessions"] == base_stats["totalSessions"]
        assert len(decoded["stats"]["toolUsage"]) > 0


class TestIterJsonlFiles:
    def test_yields_jsonl_files(self):
        files = list(iter_jsonl_files(PROJECTS_DIR))
        assert len(files) > 0
        for f in files:
            assert f.suffix == ".jsonl"

    def test_excludes_subagents(self):
        """Files in subagents directories should be excluded."""
        files = list(iter_jsonl_files(PROJECTS_DIR))
        for f in files:
            assert "subagents" not in f.parts

    def test_empty_for_missing_dir(self):
        files = list(iter_jsonl_files(Path("/nonexistent")))
        assert files == []


class TestComputeTopWords:
    def test_returns_word_counts(self):
        top_words = compute_top_words(PROJECTS_DIR, top_n=10)
        assert isinstance(top_words, list)
        for word, count in top_words:
            assert isinstance(word, str)
            assert isinstance(count, int)
            assert count > 0

    def test_excludes_stopwords(self):
        top_words = compute_top_words(PROJECTS_DIR, top_n=50)
        words = [w for w, _ in top_words]
        # Common stopwords should not appear
        stopwords = ["the", "a", "an", "is", "are", "and", "or", "to", "of"]
        for sw in stopwords:
            assert sw not in words

    def test_sorted_by_count_descending(self):
        top_words = compute_top_words(PROJECTS_DIR, top_n=20)
        counts = [c for _, c in top_words]
        assert counts == sorted(counts, reverse=True)

    def test_respects_top_n(self):
        top_5 = compute_top_words(PROJECTS_DIR, top_n=5)
        top_10 = compute_top_words(PROJECTS_DIR, top_n=10)
        assert len(top_5) <= 5
        assert len(top_10) <= 10

    def test_empty_for_missing_dir(self):
        top_words = compute_top_words(Path("/nonexistent"), top_n=10)
        assert top_words == []


class TestWritePromptsToFiles:
    def test_writes_prompts_to_temp_dir(self):
        try:
            total_prompts, total_files = write_prompts_to_files(PROJECTS_DIR, show_progress=False)
            assert total_prompts > 0
            assert total_files > 0
            assert PROMPTS_DIR.exists()
            # Check files were created
            files = list(PROMPTS_DIR.glob("*.txt"))
            assert len(files) == total_files
        finally:
            if PROMPTS_DIR.exists():
                shutil.rmtree(PROMPTS_DIR)

    def test_file_naming_convention(self):
        try:
            write_prompts_to_files(PROJECTS_DIR, show_progress=False)
            files = list(PROMPTS_DIR.glob("*.txt"))
            for f in files:
                # Files should match pattern: project-{hash}-chunk-{n}.txt
                assert f.name.startswith("project-")
                assert "-chunk-" in f.name
        finally:
            if PROMPTS_DIR.exists():
                shutil.rmtree(PROMPTS_DIR)

    def test_prompts_separated_by_delimiter(self):
        try:
            write_prompts_to_files(PROJECTS_DIR, show_progress=False)
            files = list(PROMPTS_DIR.glob("*.txt"))
            if files:
                content = files[0].read_text()
                # Multiple prompts should be separated by ---
                if "\n\n---\n\n" in content:
                    parts = content.split("\n\n---\n\n")
                    assert len(parts) >= 1
        finally:
            if PROMPTS_DIR.exists():
                shutil.rmtree(PROMPTS_DIR)

    def test_empty_for_missing_dir(self):
        try:
            total_prompts, total_files = write_prompts_to_files(Path("/nonexistent"), show_progress=False)
            assert total_prompts == 0
            assert total_files == 0
        finally:
            if PROMPTS_DIR.exists():
                shutil.rmtree(PROMPTS_DIR)


class TestMergeBatchResults:
    def test_merges_batch_a_keys(self):
        results = [
            {
                "memorablePrompts": {"funniest": {"prompt": "lol", "context": "funny"}},
                "contrasts": {"shortestEffective": "fix"},
            },
            None,
            None,
        ]
        merged = merge_batch_results(results)
        assert "insights" in merged
        assert merged["insights"]["memorablePrompts"]["funniest"]["prompt"] == "lol"
        assert merged["insights"]["contrasts"]["shortestEffective"] == "fix"

    def test_merges_batch_b_keys(self):
        results = [
            None,
            {
                "communicationStyle": {"catchphrases": ["just fix it"]},
                "topPhrases": [{"phrase": "fix bug", "count": 5}],
                "dominantTopics": ["debugging", "frontend"],
                "obsessions": {"topics": ["python"]},
            },
            None,
        ]
        merged = merge_batch_results(results)
        assert merged["insights"]["communicationStyle"]["catchphrases"] == ["just fix it"]
        assert merged["insights"]["topPhrases"][0]["phrase"] == "fix bug"
        assert merged["insights"]["dominantTopics"] == ["debugging", "frontend"]
        assert merged["insights"]["obsessions"]["topics"] == ["python"]

    def test_merges_batch_c_keys(self):
        results = [
            None,
            None,
            {
                "persona": "debug-demon",
                "traits": ["persistent", "curious"],
                "promptingStyle": "terse",
                "communicationTone": "direct",
                "funFacts": ["You debugged 100 times"],
            },
        ]
        merged = merge_batch_results(results)
        assert merged["persona"] == "debug-demon"
        assert merged["traits"] == ["persistent", "curious"]
        assert merged["promptingStyle"] == "terse"
        assert merged["communicationTone"] == "direct"
        assert "You debugged 100 times" in merged["funFacts"]

    def test_merges_all_batches(self):
        results = [
            {"memorablePrompts": {"funniest": {"prompt": "haha", "context": "joke"}}},
            {"communicationStyle": {"catchphrases": ["please"]}},
            {"persona": "squirrel-brain", "traits": ["chaotic"]},
        ]
        merged = merge_batch_results(results)
        assert merged["insights"]["memorablePrompts"]["funniest"]["prompt"] == "haha"
        assert merged["insights"]["communicationStyle"]["catchphrases"] == ["please"]
        assert merged["persona"] == "squirrel-brain"

    def test_handles_all_none(self):
        results = [None, None, None]
        merged = merge_batch_results(results)
        assert merged == {"insights": {}}

    def test_handles_empty_list(self):
        merged = merge_batch_results([])
        assert merged == {"insights": {}}


class TestLongestStreakEdgeCases:
    def test_invalid_date_format(self):
        # Invalid dates should return default streak of 1
        assert longest_streak(["not-a-date"]) == 1
        assert longest_streak(["2026/01/20"]) == 1

    def test_very_long_streak(self):
        # 30 consecutive days
        dates = [f"2026-01-{d:02d}" for d in range(1, 31)]
        assert longest_streak(dates) == 30

    def test_multiple_streaks_returns_longest(self):
        # Two streaks: 3 days and 5 days
        dates = [
            "2026-01-01",
            "2026-01-02",
            "2026-01-03",  # 3-day streak
            "2026-01-10",
            "2026-01-11",
            "2026-01-12",
            "2026-01-13",
            "2026-01-14",
        ]  # 5-day streak
        assert longest_streak(dates) == 5


class TestWeekendPercentageEdgeCases:
    def test_invalid_date_format(self):
        assert weekend_percentage(["not-a-date"]) == 0

    def test_rounding(self):
        # 1 weekend out of 3 = 33.33...% -> rounds to 33
        dates = ["2026-01-20", "2026-01-21", "2026-01-24"]  # Mon, Tue, Sat
        assert weekend_percentage(dates) == 33


class TestCalculateQuirksEdgeCases:
    def test_empty_hour_counts(self):
        stats = {"hourCounts": {}}
        quirks = calculate_quirks(stats, PROJECTS_DIR)
        assert quirks.lateNightSessions == 0
        assert quirks.earlyMorningSessions == 0

    def test_missing_hour_counts(self):
        stats = {}
        quirks = calculate_quirks(stats, PROJECTS_DIR)
        assert quirks.lateNightSessions == 0
        assert quirks.earlyMorningSessions == 0

    def test_missing_daily_activity(self):
        stats = {"hourCounts": {"12": 5}}
        quirks = calculate_quirks(stats, PROJECTS_DIR)
        assert quirks.longestStreakDays == 1
        assert quirks.weekendPercentage == 0


class TestBuildBundleEdgeCases:
    def test_zero_sessions(self):
        base_stats = {
            "totalSessions": 0,
            "totalMessages": 0,
            "modelUsage": {},
            "hourCounts": {},
            "dailyActivity": [],
        }
        tools = {}
        quirks = Quirks(
            interruptCount=0,
            abandonedSessions=0,
            lateNightSessions=0,
            earlyMorningSessions=0,
            weekendPercentage=0,
            shortestSessionSeconds=0,
            longestStreakDays=0,
        )
        bundle = build_bundle(base_stats, tools, quirks, Path("/nonexistent"))
        assert bundle.stats.totalSessions == 0
        assert bundle.stats.totalTokens.input == 0
        assert bundle.stats.projectCount == 0

    def test_unknown_model_not_normalized(self):
        base_stats = {
            "totalSessions": 1,
            "totalMessages": 1,
            "modelUsage": {
                "custom-model-v1": {"inputTokens": 100, "outputTokens": 50},
            },
            "hourCounts": {},
            "dailyActivity": [],
        }
        tools = {}
        quirks = Quirks(
            interruptCount=0,
            abandonedSessions=0,
            lateNightSessions=0,
            earlyMorningSessions=0,
            weekendPercentage=0,
            shortestSessionSeconds=60,
            longestStreakDays=1,
        )
        bundle = build_bundle(base_stats, tools, quirks, Path("/nonexistent"))
        # Unknown model should be kept as-is
        assert "custom-model-v1" in bundle.stats.modelUsage

    def test_peak_hour_calculation(self):
        base_stats = {
            "totalSessions": 10,
            "totalMessages": 100,
            "modelUsage": {},
            "hourCounts": {"9": 5, "14": 20, "22": 10},
            "dailyActivity": [],
        }
        tools = {}
        quirks = Quirks(
            interruptCount=0,
            abandonedSessions=0,
            lateNightSessions=0,
            earlyMorningSessions=0,
            weekendPercentage=0,
            shortestSessionSeconds=60,
            longestStreakDays=1,
        )
        bundle = build_bundle(base_stats, tools, quirks, Path("/nonexistent"))
        assert bundle.stats.peakHour == 14  # Hour with most activity

    def test_empty_hour_counts_defaults_peak_to_12(self):
        base_stats = {
            "totalSessions": 1,
            "totalMessages": 1,
            "modelUsage": {},
            "hourCounts": {},
            "dailyActivity": [],
        }
        tools = {}
        quirks = Quirks(
            interruptCount=0,
            abandonedSessions=0,
            lateNightSessions=0,
            earlyMorningSessions=0,
            weekendPercentage=0,
            shortestSessionSeconds=60,
            longestStreakDays=1,
        )
        bundle = build_bundle(base_stats, tools, quirks, Path("/nonexistent"))
        assert bundle.stats.peakHour == 12  # Default


class TestExtractToolsEdgeCases:
    def test_empty_projects_dir(self):
        tools = extract_tools(Path("/nonexistent"))
        assert tools == {}

    def test_no_tool_use_records(self):
        # Create a temp dir with a JSONL file that has no tool_use records
        with tempfile.TemporaryDirectory() as tmpdir:
            project_dir = Path(tmpdir) / "project"
            project_dir.mkdir()
            jsonl_file = project_dir / "session.jsonl"
            jsonl_file.write_text('{"message": {"role": "user", "content": "hello"}}\n')
            tools = extract_tools(Path(tmpdir))
            assert tools == {}


class TestExtractUserPromptsEdgeCases:
    def test_empty_projects_dir(self):
        prompts = list(extract_user_prompts_by_project(Path("/nonexistent")))
        assert prompts == []

    def test_handles_empty_content(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            project_dir = Path(tmpdir) / "project"
            project_dir.mkdir()
            jsonl_file = project_dir / "session.jsonl"
            # Empty content should be skipped
            jsonl_file.write_text('{"message": {"role": "user", "content": ""}}\n')
            prompts = list(extract_user_prompts_by_project(Path(tmpdir)))
            assert prompts == []

    def test_handles_whitespace_only_content(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            project_dir = Path(tmpdir) / "project"
            project_dir.mkdir()
            jsonl_file = project_dir / "session.jsonl"
            jsonl_file.write_text('{"message": {"role": "user", "content": "   "}}\n')
            prompts = list(extract_user_prompts_by_project(Path(tmpdir)))
            assert prompts == []


class TestEncodeBundleEdgeCases:
    def _make_bundle_with_special_chars(self) -> AnonymousBundle:
        from datetime import datetime, timezone

        return AnonymousBundle(
            stats=Stats(
                totalSessions=1,
                totalMessages=1,
                totalTokens=TokenCounts(input=100, output=50, cached=10),
                totalToolCalls=1,
                toolUsage={"Read": 1},
                modelUsage={"sonnet": 150},
                hourCounts=[0] * 24,
                peakHour=12,
                longestSessionMinutes=10,
                projectCount=1,
                daysActive=1,
                activeDates=None,
            ),
            personaId="test",
            traits=["emoji: 🔥", "special: <>&\"'"],
            promptingStyle="direct",
            communicationTone="friendly",
            funFacts=["Unicode: 日本語", "Emoji: 🚀"],
            generatedAt=datetime.now(timezone.utc),
        )

    def test_handles_unicode_and_special_chars(self):
        bundle = self._make_bundle_with_special_chars()
        encoded = encode_bundle(bundle)

        # Should decode back correctly
        padded = encoded + "=" * (4 - len(encoded) % 4)
        compressed = base64.urlsafe_b64decode(padded)
        json_bytes = gzip.decompress(compressed)
        decoded = json.loads(json_bytes)

        assert "🔥" in decoded["traits"][0]
        assert "日本語" in decoded["funFacts"][0]
