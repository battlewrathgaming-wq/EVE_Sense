# Failure Record: Local Metadata SDE Boundary Hardening

Date: 2026-05-24
Status: Fixed and covered

## Symptom

During the HS02 metadata bug-hunt pass, the local SDE JSONL ZIP path had insufficient adversarial coverage for unsafe ZIP entry names, oversized entries, unsupported compression, malformed archives, malformed JSONL, and malformed compact metadata artifacts.

## Impact

The builder is an explicit operator tool, not runtime HUD logic, but broad or malformed source payloads could still make local metadata refresh behavior noisy, memory-heavy, or ambiguous before a full SDE refresh is accepted.

## Handling

- ZIP entry names are rejected if they are empty, absolute, drive-qualified, contain null bytes, or traverse with `..`.
- ZIP entries are bounded by a maximum uncompressed byte limit before parsing.
- Unsupported compression, malformed ZIP payloads, and malformed JSONL fail the build.
- Failed builds clean staged source work directories.
- Compact lookup ignores malformed artifact records and keeps unresolved IDs visible.
- `npm.cmd run verify:local-type-metadata` covers the failure class with deterministic fixture ZIPs only.

## Open Risk

Real SDE downloads and large generated metadata artifacts remain explicit operator actions. They should not be staged by default or treated as product truth without a recorded source/checksum/provenance trail.
