---
sidebar_position: 4
title: Factories
---

## Overview

Factories deploy known contract types in a repeatable way and stamp provenance so Canon Guard can reason about who created what. A factory:

- Deploys a new instance with the right constructor parameters
- Records the new instance as its child
- Exposes a lightweight `isChild(address)` view for verification

In practice, this gives you a clean way to produce approved patterns (for example, a hub with caps, or a simple action builder) and later prove a given address really was produced by the expected factory or hub.

But, why factories?

- Provenance: every child records its factory as `PARENT` (via constructor arg), and factories keep a registry of their children. Canon Guard can use this to accept a builder because it belongs to an allow‑listed hub/factory.
- Repeatability: avoid re‑entering long constructor parameter lists, so it reduces human error.
- Policy: pre‑approve a whole hub (or all its children) for the short path. Keep everything else on the long path.

## Flow

1) Use a factory to deploy a hub or builder with the right parameters
2) (Optional) Pre‑approve that hub in Canon Guard for a time window
3) Create builders (children) from the hub as needed
4) Queue a builder in Canon Guard → owners approve onchain → execute after the delay

## How Canon Guard uses provenance

When you queue a transaction with an actions builder:

- If the builder’s parent implements the Hub interface, Canon Guard asks that parent `isHubChild(builder)`
- Otherwise (no hub parent or EOA), Canon Guard treats the builder directly (and may use its `PARENT` for pre‑approval lookups)

This lets you pre‑approve a hub once and have all its children use the short timelock without pre‑approving each child individually.

## Common factories in [the repo](https://github.com/defi-wonderland/canon-guard/tree/dev/src/contracts/factories)

- `CanonGuardFactory` → `CanonGuard` (entrypoint contract)
- `CappedTokenTransfersHubFactory` → `CappedTokenTransfersHub` (policy hub with per‑token caps per epoch)
- `SimpleActionsFactory` → `SimpleActions` (generic call + value actions)
- `SimpleTransfersFactory` → `SimpleTransfers` (ERC‑20 transfer actions)
- `ApproveActionFactory` / DisapproveActionFactory → `ApproveAction` / `DisapproveAction` (admin actions for pre‑approval windows)
- `ChangeSafeGuardActionFactory` / `SetEmergencyCallerActionFactory` / `SetEmergencyTriggerActionFactory` → admin actions to update Canon Guard / Safe settings
- `AllowanceClaimorFactory` → `AllowanceClaimor` (claims ERC‑20 allowance to the Safe)
- `EverclearTokenConversionFactory` / `EverclearTokenStakeFactory` → Everclear‑specific actions

Hubs (e.g. `CappedTokenTransfersHub`) then mint their own children (builders) and keep a child registry as well. Hubs use deterministic deployment (`CREATE3`) for children, while simple factories in this repo use `new` and track children in a mapping.

## Data model and guarantees

The core data model for factories centers around tracking which contracts they have created, ensuring provenance and easy verification. At the heart, there is the base `Factory.sol` contract, which maintains a mapping called `_children`. This mapping associates each deployed child contract’s address with a boolean value, indicating whether that address is indeed a child of the factory. After deploying a new contract, the factory will immediately update this mapping by setting `_children[newChild] = true`. This allows anyone to call the `isChild(address)` view function to quickly check if a given address was created by that factory.

When a factory deploys a child contract, the child will usually record its parent factory’s address in a variable called `PARENT` during its constructor. This value is set immutably, meaning it cannot be changed after deployment. By storing the parent address in this way, provenance checks become very efficient. There’s no need for additional storage reads or complex lookups to determine which factory created a given contract.

For hubs, which are a special kind of parent contract that can create multiple **action builders** (children), the pattern is similar but with a slight variation. Each hub maintains its own registry of children, typically through a function like `isHubChild(address)`. When Canon Guard needs to verify the provenance of a builder, it will check if the builder’s declared `PARENT` is a hub, and if so, it will call `isHubChild(builder)` on that hub. This mechanism allows Canon Guard to confirm that a builder was indeed created by an approved hub, supporting more granular policy enforcement and provenance tracking across the system.

See the individual factory files under [`contracts/factories/`](https://github.com/defi-wonderland/canon-guard/tree/dev/src/contracts/factories) for specific constructor parameters and the child types they deploy.
