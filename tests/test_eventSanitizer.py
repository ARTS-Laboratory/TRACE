import unittest
from copy import deepcopy

from Functions.Agent.eventSanitizer import sanitize_events


class TestEventSanitizer(unittest.TestCase):
    def setUp(self):
        self.event = {
            "type": "tool_started",
            "data": {
                "arguments": {
                    "API_KEY": "secret123",
                    "query": "weather",
                    "results": [{"password": "secret456"}, {"limit": 5}],
                }
            },
        }

        self.sanitized_event = {
            "type": "tool_started",
            "data": {
                "arguments": {
                    "API_KEY": "[REDACTED]",
                    "query": "weather",
                    "results": [{"password": "[REDACTED]"}, {"limit": 5}],
                }
            },
        }

        self.original_event = {
            "data": {
                "authorization": {"token": "secret123", "method": "Bearer"},
                "arguments": [{"API_KEY": "secret456"}, {"query": "weather"}],
            }
        }
        self.sanitized_original_event = {
            "data": {
                "authorization": "[REDACTED]",
                "arguments": [{"API_KEY": "[REDACTED]"}, {"query": "weather"}],
            }
        }

        self.normalize_event = {
            "API-KEY": "secret123",
            " Access_Token ": "secret456",
            "query": "weather",
        }

        self.sanitized_normalize_event = {
            "API-KEY": "[REDACTED]",
            " Access_Token ": "[REDACTED]",
            "query": "weather",
        }

    def test_nested_credentials_are_redacted(self):
        event_1 = deepcopy(self.event)

        self.assertEqual(sanitize_events(events=event_1), self.sanitized_event)
        self.assertEqual(event_1, self.event)

    def test_sensitive_containers_are_redacted(self):
        event_2 = deepcopy(self.original_event)

        self.assertEqual(sanitize_events(events=event_2), self.sanitized_original_event)
        self.assertEqual(event_2, self.original_event)

    def test_idempotence_for_already_redacted_events(self):
        event_3 = deepcopy(self.event)

        first = sanitize_events(events=event_3)
        second = sanitize_events(first)

        self.assertEqual(first, second)

    def test_normalized_containers_are_redacted(self):
        event_4 = deepcopy(self.normalize_event)

        self.assertEqual(
            sanitize_events(events=event_4), self.sanitized_normalize_event
        )
        self.assertEqual(event_4, self.normalize_event)


if __name__ == "__main__":
    unittest.main()
