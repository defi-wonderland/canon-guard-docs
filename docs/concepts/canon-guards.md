---
sidebar_position: 3
title: Canon Guards
---

## Overview

`CanonGuard` is the Safe’s transaction entrypoint. It enqueues transactions produced by action builders, persists the payload (ABI‑encoded actions), computes the exact Safe transaction hash to approve, verifies which owners have onchain‑approved that hash via `approvedHashes`, and executes through `MultiSendCallOnly` once within the allowed window. The Safe’s guard is set to the `CanonGuard` contract (via the `OnlyCanonGuard` base), so the Safe rejects any execution not initiated by `CanonGuard`.

:::note Reference
A Safe guard is a hook contract the Safe calls before (and after) every execution. It can allow or reject a transaction based on arbitrary logic.
:::

Canon Guard stores the queued actions immutably at enqueue time; approvals are onchain via `SAFE.approveHash(getSafeTransactionHash(...))`; and execution is gated by `executableAt`/`expiresAt` (short path for pre‑approved builders/hubs; long path otherwise). When emergency mode is enabled, only the configured emergency caller may execute while owners can still propose/approve.

## At a glance 

- You put transactions in a queue, and they stay exactly as written.
- Owners approve the transaction onchain (no offchain signatures).
- There is a wait: short for pre‑approved things, longer for new things.
- After the wait, anyone can execute through Canon Guard. If emergency mode is on, only the emergency caller can execute.

See the [Glossary](./glossary.md) for definitions of Safe, guard, action, action builder, action hub, pre‑approval, timelock, and emergency mode.

## In general terms, the flow is...

1) Propose: put a transaction into the queue using an action builder.
2) Approve: owners approve the exact transaction hash onchain.
3) Execute: after the wait (and before expiry), execute through Canon Guard.

## Breakdown

### Roles and responsibilities

- `CanonGuard.sol` (entrypoint): queue, compute Safe tx hash, collect approved owners, execute via `MultiSendCallOnly`.
- `OnlyCanonGuard.sol` (Safe guard, inherited): enforces “execution only via Canon Guard” by rejecting checks where `_msgSender != address(this)` (the Canon Guard contract).
- `Approver.sol` (helper): standardizes `SAFE.approveHash(hash)` if approvals are driven via contracts/scripts.

### Setup

1) Set the Safe’s guard to your deployed `CanonGuard` address.
2) Configure delays and emergency roles in `CanonGuard`.
3) Optionally pre‑approve specific action builders or hubs for a duration.

:::note Reference
For a step‑by‑step guide, see [Getting Started](../getting-started/getting-started.md).
:::

### Lifecycle (happy path)

1) Propose: Safe owner calls `queueTransaction(actionsBuilder)` → Canon Guard snapshots `Action[]` and sets `executableAt`/`expiresAt`.
2) Approve: owners approve `getSafeTransactionHash(actionsBuilder[, nonce])` via `SAFE.approveHash(hash)`.
3) Execute: after `executableAt` and before `expiresAt`, call `executeTransaction(actionsBuilder)` (or `executeTransactions([...])`). Canon Guard builds approved‑hash signatures and executes the multisend batch.

If circumstances change:
- No‑op: `executeNoActionTransaction()` spends a Safe nonce to invalidate stale signatures.
- Cancel: `cancelEnqueuedTransaction(actionsBuilder)` by the proposer if no approvals exist.

### What the Safe guard checks

At `checkTransaction(...)`, `OnlyCanonGuard` rejects unless `_msgSender == address(this)` (i.e., the caller seen by Safe is the Canon Guard contract). This closes ad‑hoc or offchain‑driven execution paths.

### Emergency mode

With emergency mode set, owners can still queue and approve, but only the configured emergency caller may execute. This adds an additional key for execution under duress.

### Reference (selected functions)

- Pre‑approve: `approveActionsBuilderOrHub(address builderOrHub, uint256 duration)` (Safe only)
- Propose: `queueTransaction(address actionsBuilder)` (Safe owner)
- Hash: `getSafeTransactionHash(address actionsBuilder[, uint256 safeNonce])` (view)
- Approvals: `getApprovedHashSigners(address actionsBuilder, uint256 safeNonce)` (view)
- Execute: `executeTransaction(address actionsBuilder)` / `executeTransactions(address[] actionsBuilders)`
- No‑op: `executeNoActionTransaction()`
- Cancel: `cancelEnqueuedTransaction(address actionsBuilder)` (proposer; only if no approvals)

That’s the whole flow. 