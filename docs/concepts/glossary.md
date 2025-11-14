---
sidebar_position: 10
---

# Glossary


#### Canon Guard
The entrypoint contract that queues actions, computes the Safe transaction hash, checks approved owners, and executes via MultiSendCallOnly.

#### Safe
A multisig wallet that holds funds and executes transactions.

#### Guard (Safe guard)
A hook contract the Safe calls before/after execution to allow or reject transactions. `OnlyCanonGuard` enforces execution only via Canon Guard.

#### Action
An onchain call (target, data, value) to execute through Canon Guard.

#### Action builder
A contract that returns a list of actions (`getActions()`) to queue and execute.

#### Factory
A contract that deploys known contract types (Canon Guard, hubs, builders) and tracks children (provenance).

#### Parent / Child
Parent is the creator contract (`PARENT`), which can be a factory or hub. Child is the created contract (hub or builder).

#### Hub (Action hub)
A policy parent that creates builders and tracks them. Hubs expose `isHubChild(child)` to prove provenance.

#### Approved hash (Safe)
The Safe’s onchain approval record: `approvedHashes(owner, safeTxHash) == 1` when an owner approved the hash.

#### MultiSendCallOnly
Safe library used by Canon Guard to batch and execute actions in a single Safe transaction.

#### Short execution delay
Timelock for pre‑approved actions (pre‑approved via `approveActionsBuilderOrHub`).

#### Long execution delay
Timelock for actions that were not pre‑approved.

#### Transaction expiry delay
Time window after `executableAt` during which a queued action can be executed.

#### Maximum approval duration
Maximum time a builder or hub can be pre‑approved.

#### Approve an action builder or hub
Pre‑approve a builder or hub so its queued actions use the short delay. If approving a hub, all hub children inherit the approved status.

#### Queue a transaction
Add actions to the queue, making them available to approve, and start the timelock.

#### Execute a transaction
If the actions have required onchain approvals and have not expired, anyone can execute (emergency mode restricts to the emergency caller).

#### Cancel enqueued transaction
Remove a queued item if there are no approved hashes. In emergency mode, only the emergency caller may cancel.

#### Execute no‑action transaction (no‑op)
Execute an empty batch to spend the Safe’s nonce and invalidate existing approvals. Used to clear signatures without side effects. 
