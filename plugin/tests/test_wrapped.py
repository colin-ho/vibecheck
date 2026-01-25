#!/usr/bin/env python3
"""Tests for vibes.py"""

import base64
import gzip
import json
import os
import sys
from datetime import date
from pathlib import Path

import pytest

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from vibes import (
    analyze_prompts,
    build_bundle,
    calculate_quirks,
    encode_bundle,
    extract_tools,
    extract_user_prompts,
    is_all_caps,
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


class TestExtractUserPrompts:
    def test_extracts_string_prompts(self):
        prompts = extract_user_prompts(PROJECTS_DIR)
        assert len(prompts) > 0
        assert all(isinstance(p, str) for p in prompts)

    def test_excludes_tool_results(self):
        prompts = extract_user_prompts(PROJECTS_DIR)
        # Tool results are arrays, not strings
        for p in prompts:
            assert not p.startswith("[{")

    def test_contains_expected_prompts(self):
        prompts = extract_user_prompts(PROJECTS_DIR)
        texts = " ".join(prompts)
        assert "fix" in texts.lower()
        assert "help" in texts.lower()


class TestIsAllCaps:
    def test_detects_all_caps(self):
        assert is_all_caps("WHY IS THIS NOT WORKING??? FIX IT NOW!!!")

    def test_rejects_lowercase(self):
        assert not is_all_caps("this is lowercase text")

    def test_rejects_mixed_case(self):
        assert not is_all_caps("This Is Mixed Case")

    def test_rejects_short_text(self):
        assert not is_all_caps("SHORT")  # Less than 10 chars


class TestAnalyzePrompts:
    def test_empty_prompts(self):
        samples, stats, words, topics = analyze_prompts([])
        assert stats["totalPrompts"] == 0
        assert samples["first"] == ""
        assert words["topWords"] == []

    def test_calculates_stats(self):
        prompts = extract_user_prompts(PROJECTS_DIR)
        samples, stats, words, topics = analyze_prompts(prompts)

        assert stats["totalPrompts"] == len(prompts)
        assert stats["averageLength"] > 0
        assert stats["shortestLength"] > 0
        assert stats["longestLength"] >= stats["shortestLength"]

    def test_extracts_samples(self):
        prompts = extract_user_prompts(PROJECTS_DIR)
        samples, _, _, _ = analyze_prompts(prompts)

        assert samples["first"] != ""
        assert samples["shortest"] != ""
        assert samples["longest"] != ""
        assert len(samples["samples"]) > 0

    def test_word_analysis(self):
        prompts = extract_user_prompts(PROJECTS_DIR)
        _, _, words, _ = analyze_prompts(prompts)

        assert isinstance(words["topWords"], list)
        assert words["politenessScore"] >= 0
        assert words["politenessScore"] <= 100

    def test_topic_detection(self):
        prompts = extract_user_prompts(PROJECTS_DIR)
        _, _, _, topics = analyze_prompts(prompts)

        assert "debugging" in topics
        assert "frontend" in topics
        assert "backend" in topics
        # Test fixtures have debugging keywords
        assert topics["debugging"] > 0

    def test_detects_polite_words(self):
        prompts = ["Please help me", "Thank you so much", "Can you fix this?"]
        _, _, words, _ = analyze_prompts(prompts)
        assert words["pleaseCount"] == 1
        assert words["thanksCount"] == 1

    def test_detects_command_words(self):
        prompts = ["fix the bug", "help me debug", "write a function"]
        _, _, words, _ = analyze_prompts(prompts)
        assert words["commandCounts"]["fix"] == 1
        assert words["commandCounts"]["help"] == 1
        assert words["commandCounts"]["write"] == 1


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
        assert quirks["lateNightSessions"] == 10

    def test_calculates_early_morning(self):
        stats = {"hourCounts": {"5": 1, "6": 2, "7": 3, "8": 4}}
        quirks = calculate_quirks(stats, PROJECTS_DIR)
        assert quirks["earlyMorningSessions"] == 10

    def test_calculates_streak(self):
        stats = load_stats_cache(STATS_DIR / "complete.json")
        quirks = calculate_quirks(stats, PROJECTS_DIR)
        assert quirks["longestStreakDays"] == 4  # 4 consecutive days in fixture


class TestBuildBundle:
    def test_builds_valid_bundle(self):
        base_stats = load_stats_cache(STATS_DIR / "minimal.json")
        tools = extract_tools(PROJECTS_DIR)
        prompts = extract_user_prompts(PROJECTS_DIR)
        samples, stats, words, topics = analyze_prompts(prompts)
        quirks = calculate_quirks(base_stats, PROJECTS_DIR)

        bundle = build_bundle(base_stats, tools, samples, stats, words, topics, quirks, PROJECTS_DIR)

        assert "stats" in bundle
        assert "promptSamples" in bundle
        assert "promptStats" in bundle
        assert "wordAnalysis" in bundle
        assert "topics" in bundle
        assert "quirks" in bundle
        assert "generatedAt" in bundle

    def test_stats_structure(self):
        base_stats = load_stats_cache(STATS_DIR / "complete.json")
        tools = extract_tools(PROJECTS_DIR)
        prompts = extract_user_prompts(PROJECTS_DIR)
        samples, stats, words, topics = analyze_prompts(prompts)
        quirks = calculate_quirks(base_stats, PROJECTS_DIR)

        bundle = build_bundle(base_stats, tools, samples, stats, words, topics, quirks, PROJECTS_DIR)

        assert bundle["stats"]["totalSessions"] == 144
        assert bundle["stats"]["totalMessages"] == 22639
        assert "totalTokens" in bundle["stats"]
        assert bundle["stats"]["totalTokens"]["input"] > 0
        assert bundle["stats"]["totalTokens"]["output"] > 0
        assert bundle["stats"]["totalTokens"]["cached"] > 0

    def test_model_usage_normalization(self):
        base_stats = load_stats_cache(STATS_DIR / "complete.json")
        tools = {}
        samples, stats, words, topics = analyze_prompts([])
        quirks = {"interruptCount": 0, "abandonedSessions": 0, "lateNightSessions": 0,
                  "earlyMorningSessions": 0, "weekendPercentage": 0,
                  "shortestSessionSeconds": 60, "longestStreakDays": 1}

        bundle = build_bundle(base_stats, tools, samples, stats, words, topics, quirks, PROJECTS_DIR)

        # Model names should be normalized
        assert "opus" in bundle["stats"]["modelUsage"]
        assert "sonnet" in bundle["stats"]["modelUsage"]
        assert "haiku" in bundle["stats"]["modelUsage"]

    def test_hour_counts_array(self):
        base_stats = load_stats_cache(STATS_DIR / "minimal.json")
        tools = {}
        samples, stats, words, topics = analyze_prompts([])
        quirks = {"interruptCount": 0, "abandonedSessions": 0, "lateNightSessions": 0,
                  "earlyMorningSessions": 0, "weekendPercentage": 0,
                  "shortestSessionSeconds": 60, "longestStreakDays": 1}

        bundle = build_bundle(base_stats, tools, samples, stats, words, topics, quirks, PROJECTS_DIR)

        # hourCounts should be array of 24 elements
        assert len(bundle["stats"]["hourCounts"]) == 24
        assert bundle["stats"]["hourCounts"][9] == 1
        assert bundle["stats"]["hourCounts"][10] == 2


class TestEncodeBundle:
    def test_encodes_and_decodes(self):
        bundle = {"test": "data", "number": 42}
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

        assert decoded == bundle

    def test_compression_works(self):
        bundle = {"data": "x" * 1000}
        encoded = encode_bundle(bundle)

        # Encoded should be smaller than raw JSON
        raw_len = len(json.dumps(bundle))
        assert len(encoded) < raw_len


class TestIntegration:
    def test_full_pipeline(self):
        """Test the complete pipeline from stats to encoded URL."""
        base_stats = load_stats_cache(STATS_DIR / "complete.json")
        tools = extract_tools(PROJECTS_DIR)
        prompts = extract_user_prompts(PROJECTS_DIR)
        samples, stats, words, topics = analyze_prompts(prompts)
        quirks = calculate_quirks(base_stats, PROJECTS_DIR)
        bundle = build_bundle(base_stats, tools, samples, stats, words, topics, quirks, PROJECTS_DIR)
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
        assert decoded["promptStats"]["totalPrompts"] > 0


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
        prompts = extract_user_prompts(self.REAL_PROJECTS)
        assert len(prompts) > 0

    def test_full_pipeline_with_real_data(self):
        base_stats = load_stats_cache(self.REAL_STATS)
        tools = extract_tools(self.REAL_PROJECTS)
        prompts = extract_user_prompts(self.REAL_PROJECTS)
        samples, stats, words, topics = analyze_prompts(prompts)
        quirks = calculate_quirks(base_stats, self.REAL_PROJECTS)
        bundle = build_bundle(base_stats, tools, samples, stats, words, topics, quirks, self.REAL_PROJECTS)
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
