# Term: Event Stream

## Plain Meaning

An event stream is a sequence of newly observed tactical events.

Examples:

- EWAR observed
- alpha spike observed
- new combat edge observed

## Product Rule

Event stream items should trigger once, age visually, and expire. They must not repeatedly re-alert from rolling-cache rereads.

