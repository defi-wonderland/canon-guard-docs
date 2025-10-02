---
sidebar_position: 7
title: Emergency paths
---

## What is Emergency mode?

Emergency mode is a controlled switch that narrows who can execute queued transactions. Owners can still propose (queue) and approve onchain as usual, but while emergency mode is ON, only a designated emergency caller can execute (or perform the no‑op/cancel) through Canon Guard.

This lets you keep operations visible and progressing (proposals/approvals continue), while putting actual execution behind a higher‑security key until the situation is resolved.

## Why it exists

- Coercion or compromise: If multiple owners are pressured or keys are suspected to be leaked, execution is temporarily centralized to a safer group.
- Time to react: Queued payloads remain immutable and simulatable, execution is paused except for the emergency caller.
- Continuity: governance and operations (proposals/approvals) don’t freeze, the backlog is preserved until it is safe to execute.

## Who does what (normal vs emergency)

- Queue (propose): Safe owners. Same in normal and emergency.
- Approve onchain: Safe owners. Same in normal and emergency.
- Execute:
  - Normal: Anyone
  - Emergency: Only emergency caller
- Execute “no‑action”:
  - Normal: Anyone
  - Emergency: Only emergency caller
- Cancel enqueued tx:
  - Normal: Original proposer only
  - Emergency: Only emergency caller
- Toggle emergency mode:
  - Set ON: Emergency trigger
  - Set OFF: The Safe (owners via the Safe)
- Update roles (emergency trigger/caller): the Safe

For reference, see [`EmergencyModeHook.sol`](https://github.com/defi-wonderland/canon-guard/blob/dev/src/contracts/EmergencyModeHook.sol).