---
sidebar_position: 9
title: Signers and proposers
---

## Roles at a glance

- Proposers (Safe owners): queue transactions in Canon Guard using action builders
- Signers (Safe owners): approve the exact Safe transaction hash onchain (Safe `approveHash`)
- Executors: any Safe Owner in normal mode; only the emergency caller in emergency mode

## The normal flow

1) A Safe owner proposes by queuing an action builder (Canon Guard checks ownership via the Safe)
2) Safe owners approve the Safe transaction hash onchain (Canon Guard later reads these approvals from the Safe)
3) After the delay (and before expiry), anyone can execute; Canon Guard sorts approved owners and builds approved‑hash signatures for the Safe

## The emergency flow

- Queuing and approving remain the same (Safe owners)
- Execution is restricted: only the emergency caller can execute (including no‑action and cancel)

## Permissions

- Queue: Safe owner (`isSafeOwner`)
- Approve: Safe owner onchain (`approveHash` on the Safe)
- Execute: anyone (normal) / emergency caller (emergency)
- Cancel: proposer (normal, no approvals present) / emergency caller (emergency)

For reference, see [`contracts/CanonGuard.sol`](https://github.com/defi-wonderland/canon-guard/blob/dev/src/contracts/CanonGuard.sol) and [`contracts/EmergencyModeHook.sol`](https://github.com/defi-wonderland/canon-guard/blob/dev/src/contracts/EmergencyModeHook.sol).
