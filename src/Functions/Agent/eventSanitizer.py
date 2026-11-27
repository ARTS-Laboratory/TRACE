from copy import deepcopy

from Functions.Model.config import REDACT


def sanitize_events(events):
    new_events = deepcopy(events)

    new_events = _sanitize_events(new_events=new_events)

    return new_events


def _sanitize_events(new_events):
    if isinstance(new_events, dict):
        for key, value in new_events.items():
            if key.strip().lower().replace("-", "_") in REDACT:
                new_events[key] = "[REDACTED]"

            elif isinstance(value, (dict, list)):
                new_events[key] = _sanitize_events(value)

    elif isinstance(new_events, list):
        for index, item in enumerate(new_events):
            new_events[index] = _sanitize_events(item)

    return new_events
