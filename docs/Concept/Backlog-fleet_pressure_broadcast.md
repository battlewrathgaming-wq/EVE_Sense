# BACKLOG — Fleet Pressure Broadcast

Status:
```text
Backlog / Future Exploration
```

Priority:
```text
Low current priority
```

Dependency:
- Combat Witness stabilization
- Pressure interpretation maturity
- Local telemetry trustworthiness
- Stable event pipeline

---

# Purpose

Allow AURA-Sense clients to broadcast lightweight tactical pressure telemetry to a centralized fleet console.

Primary intended consumers:
- Fleet Commander (FC)
- Logistics / healing lead
- Tactical support roles

This is NOT intended to become:
- full fleet telemetry streaming
- remote control infrastructure
- combat log sharing
- persistent fleet surveillance

The goal is lightweight operational awareness only.

---

# Core Concept

AURA-Sense clients may periodically broadcast:

```text
[Name][Location][Prs-s][DPSrT]
```

Example:

```text
[Battlewrath][Jita][0.72][1843]
```

Meaning:
- Pilot name
- Current system
- Pressure state
- DPS received total

This supports:
- pressure awareness
- target-switch visibility
- collapse detection
- logistics prioritization
- fleet pressure topology awareness

---

# Intended Data Model

Potential fields:

```text
Client name
Current location
Pressure state
DPS received total
Timestamp
Session code
Sequence number
```

Suggested future structure:

```json
{
  "fleet": "A7-X4K9",
  "name": "Battlewrath",
  "location": "Jita",
  "pressure": 0.72,
  "dpsReceived": 1843,
  "ts": 1747952200,
  "seq": 128
}
```

---

# Networking Philosophy

The system should avoid:
- peer-to-peer networking
- direct client exposure
- inbound ports
- NAT traversal
- arbitrary inbound connections

Preferred architecture:

```text
AURA-Sense Client
    ↓ outbound only
Relay Service
    ↓ outbound only
FC / Logi Console
```

Clients connect to:
- centralized lightweight relay

Using:
- temporary shared fleet/session code

---

# Shared Fleet Code

Users manually share:
```text
Fleet session code
```

Example:

```text
A7-X4K9
```

The code acts as:
- room identifier
- lightweight access key

Potential future behavior:
- derive room ID
- derive packet signing key
- support temporary session grouping

---

# Security Philosophy

This feature should remain:
- outbound-only
- telemetry-only
- low-trust
- bounded

The system must never:
- execute remote commands
- expose local filesystem access
- expose Electron internals
- allow arbitrary packet behavior

Packets should be:
- schema validated
- length limited
- type validated
- range checked
- rate limited

Regex validation alone is insufficient security.

Recommended protections:
- timestamp validation
- sequence numbers
- room/session verification
- optional packet signatures
- packet expiry
- rate limiting

---

# Relay Philosophy

The relay service should remain:
- lightweight
- stateless where possible
- non-authoritative
- ephemeral

The relay should:
- route telemetry
- validate packets
- group sessions
- forward updates

The relay should not:
- persist long-term combat history
- become intelligence storage
- perform tactical analysis

---

# Update Philosophy

Broadcasts should remain:
- low frequency
- event-driven
- bounded

Examples:
- every 1–2 seconds during combat
- on meaningful pressure change
- during active engagement only

Avoid:
- constant high-frequency streaming
- raw combat log transmission
- unnecessary telemetry spam

---

# Product Alignment

This feature aligns with:
- combat pressure interpretation
- transient telemetry
- tactical cognition support
- observational operational awareness

This does NOT attempt to create:
- omniscient battlefield intelligence
- perfect fleet awareness
- authoritative combat state

The goal is:
```text
lightweight fleet pressure awareness
```

only.

---

# Important Scope Constraint

This feature should remain:
```text
future extensibility
```

not:
```text
current core scope
```

The local tactical experience should stabilize before introducing:
- distributed telemetry
- networking infrastructure
- relay services
- fleet synchronization