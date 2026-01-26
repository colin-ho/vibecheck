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
import sys
from pathlib import Path

import pytest

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from bundle_types import AnonymousBundle, Quirks, Stats, TokenCounts
from vibes import (
    build_bundle,
    calculate_quirks,
    encode_bundle,
    extract_tools,
    extract_user_prompts_by_project,
    iter_jsonl_records,
    load_stats_cache,
    longest_streak,
    weekend_percentage,
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
    def _make_minimal_bundle(self, funFacts: list[str] | None = None) -> AnonymousBundle:
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
