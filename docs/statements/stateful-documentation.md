# Statement: Stateful Documentation

Status: Active
Date: 2026-05-22

## Perspective

AURA-Sense contains tactical doctrine, telemetry boundaries, renderer constraints, network behavior, and uncertainty semantics.

The risk is not only that code breaks. The larger risk is that code technically works while violating the project boundary or tactical meaning.

## Guidance

Stateful documentation should preserve:

- product boundaries
- telemetry ownership
- uncertainty language
- renderer constraints
- failure lessons
- API doctrine
- operational budgets

These documents are not commit logs. They are architectural memory.

## Non-Goals

Do not document every small code change. Add durable docs when direction, contracts, schemas, terms, or lessons change.

