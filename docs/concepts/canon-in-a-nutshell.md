---
sidebar_position: 1
title: In a nutshell
---

# The system explained in a nutshell

## Assumptions

Canon starts from certain assumptions: as we have seen before, external UIs and coordination layers are trust dependencies that can be compromised; even cautious multisig signers can lose keys or devices; coercion is a real risk and should be assumed possible; and reviewer fatigue accumulates over time, making repeated checks a poor line of defense. TL;DR: **the mindset should be that the worst-case scenario will probably happen.**

## Core principles

To reduce avoidable risk without breaking existing workflows, Canon Guard enforces a few simple rules.
- Routine operations get vetted once and reused, instead of demanding the same deep review every time. 
- All transactions are subject to timelocks: short delays for pre‑approved or routine flows, longer delays for new, unusual, or higher‑risk proposals so there is time to react or cancel. 
- Dangerous delegation is curtailed by blocking `DELEGATECALL` except for the multisend plumbing, and all coordination happens onchain, removing offchain blind spots. 

The model is explicitly resilient to coercion because even with multiple compromised signers, instant drains do not happen. An emergency mode allows a designated trigger to narrow execution authority to a higher‑security caller, supporting safe owner rotation while under duress.

## A safer execution model for multisigs

Multisigs routinely perform recurring operations. Each fresh proposal and signature is an opening for mistakes or abuse. Canon Guard makes these flows repeatable, visible, and time‑bounded without sacrificing ad‑hoc flexibility. The design borrows from the [“spells”](https://github.com/sky-ecosystem/spells-mainnet) pattern (Sky/MakerDAO, Spark) while explicitly avoiding unsafe storage mutation via `DELEGATECALL`.

At the core are **onchain Actions**: small contracts that fully specify the transaction batch to run. **Actions** are simple, immutable, and independent, and they live onchain for transparency and auditability. They should be reviewed or audited before inclusion in routine flows. Deploying an Action for a recurring task means you review it once; after it is vetted, you can safely reuse and queue it in the Safe without re‑doing the deep review each time.

### Components and roles

Canon Guard is the entrypoint that queues, prepares, and executes via the Safe. [`OnlyCanonGuard.sol`](https://github.com/defi-wonderland/canon-guard/blob/dev/src/contracts/OnlyCanonGuard.sol) is the Safe guard that restricts execution to Canon Guard and effectively blocks offchain signature routes.

[`EmergencyModeHook.sol`](https://github.com/defi-wonderland/canon-guard/blob/dev/src/contracts/EmergencyModeHook.sol) gates execution while emergency mode is set; [`ActionsBuilder`](https://github.com/defi-wonderland/canon-guard/tree/dev/src/contracts/actions-builders) contracts return concrete `Action[]` via `getActions()`; [`ActionHub`](https://github.com/defi-wonderland/canon-guard/tree/dev/src/contracts/action-hubs) contracts act as factories/registries that mint specialized builders (for example, [`CappedTokenTransfersHub`](https://github.com/defi-wonderland/canon-guard/blob/dev/src/contracts/action-hubs/CappedTokenTransfersHub.sol) → [`CappedTokenTransfers`](https://github.com/defi-wonderland/canon-guard/blob/dev/src/contracts/actions-builders/CappedTokenTransfers.sol)); and `MultiSendCallOnly` batches calls into a single Safe transaction via delegatecall.

### Key functions and lifecycle

A typical lifecycle is straightforward. Optionally, the Safe opens a pre‑approval window by calling `approveActionsBuilderOrHub(address, duration)` on Canon Guard. A **signer** then proposes by calling `queueTransaction(actionsBuilder)`, at which point Canon Guard snapshots the `Action[]` and sets `executableAt`/`expiresAt`. Owners approve the exact Safe transaction hash onchain using `SAFE.approveHash(...)`, obtained via `getSafeTransactionHash(actionsBuilder[, nonce])`. After the delay and before expiry, anyone can execute with `executeTransaction(actionsBuilder)` (or the batch variant). There is a no‑op escape hatch, `executeNoActionTransaction()`, to spend a nonce and invalidate stale signatures, and the proposer can cancel an enqueued item with `cancelEnqueuedTransaction(actionsBuilder)` as long as there are no approved hashes.

### Data model

Canon Guard maintains an internal set of enqueued builders and a `transactionsInfo[builder]` record with `proposer`, `actionsData` (ABI‑encoded `Action[]`), `executableAt`, `expiresAt`, and `isPreApproved`.

### Timings

Delays are explicit constants: `SHORT_TX_EXECUTION_DELAY` for pre‑approved items, `LONG_TX_EXECUTION_DELAY` for non‑pre‑approved, and `TX_EXPIRY_DELAY` defining the execution window after a transaction becomes eligible.

### Signature model

Approvals are the Safe’s onchain `approvedHashes(owner, safeTxHash) == 1`. For execution, Canon Guard composes approved‑hash signatures with `(r=owner, s=0, v=1)` and submits the multisend batch through the Safe.

### Enforcing boundaries with the Safe guard

Installing `OnlyCanonGuard` on the Safe makes the execution path explicit: approvals happen onchain; execution goes through Canon Guard; and arbitrary `DELEGATECALL` is rejected, with the exception of the controlled multisend.

### Transparent and simulatable

Because both Actions and the queue live onchain, tools like Tenderly can simulate behavior without offchain inputs. Signers can preview exactly what will execute. A Canon Guard setup does not eliminate the need for caution: irregular transactions remain a critical risk vector and should be handled with rigorous procedures and thorough reviews.