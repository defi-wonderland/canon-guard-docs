---
sidebar_position: 6
title: Action Hubs
---

## What is an Action Hub?

An Action Hub is a small onchain contract that defines a rule once (for example, a per‑token monthly budget) and then creates many Action Builders that follow that rule. The hub is the policy parent and the builders as the concrete “do this now” children.

Pre‑approving a hub in Canon Guard means every builder it creates can use the short delay. You don’t need to pre‑approve each child.

## When to use a hub

You should consider using a hub when you find yourself repeating the same action pattern with only minor changes, such as varying the token or amount, and you want a single place to enforce limits or policies. Hubs are also valuable if you need provenance, meaning you want to be able to prove that a specific builder was genuinely created by your hub. Additionally, if you want to pre-approve an entire group of related actions so they all benefit from the short delay in Canon Guard, a hub is the right tool.

## What you get

By using a hub, you define one policy that governs many compliant builders, ensuring consistency and simplifying management. The hub maintains a built-in registry, so it can always prove which builders are its legitimate children. This setup also streamlines pre-approval: you only need to approve the hub once, and all its children automatically inherit the short delay, making operations more efficient and secure.

## How it works

- The hub creates children (builders) that encode exactly what to run
- Each child remembers who created it (its parent hub)
- When you queue a child in Canon Guard, Canon Guard checks the parent; if it’s an approved hub, the short delay applies

## Example: capped token transfers

You want to cap token outflows per month and keep routine transfers fast.

- Deploy a Capped Token Transfers Hub configured with your Safe, recipient, allowed tokens, per‑token caps, and a monthly epoch
- Pre‑approve the hub in Canon Guard for a time window
- When you need a transfer, ask the hub to create a child for “send X of token T to recipient”
- Queue the child in Canon Guard, owners approve onchain, and after the short delay the transfer executes

What actually runs under the hood:
- First, the child asks the hub to update internal accounting and will revert if the monthly cap would be exceeded
- Then it transfers the tokens to the recipient
- On a new month, the hub resets usage so the budget starts fresh

## Operations checklist

- Deploy the hub with the relevant factory (see Factories)
- Pre‑approve the hub in Canon Guard (short delay applies to children)
- For each payment: mint a child builder from the hub → queue → approve onchain → execute
- Monitor hub usage (e.g., “cap left”) to spot unusual spend quickly

## Risks and guardrails

- Only pre‑approve hubs you trust; their children inherit the short path
- A spoofed builder is rejected: Canon Guard checks the hub’s registry to verify “is this really your child?”
- The child’s first step is the hub accounting; if that fails, the transfer does not run

## Technical reference

Base hub (ActionHub):
- Immutable `PARENT` (deployer, usually a factory)
- Child registry and `isHubChild(child)` to prove provenance
- Deterministic child deployment (CREATE3) via `_createNewActionsBuilder(initCode, salt)` and `NewActionsBuilderCreated`

CappedTokenTransfersHub specifics:
- Policy/state: recipient, epoch length/starting timestamp/current epoch; per‑token cap and total spent
- Child mint: `createNewActionsBuilder(token, amount)` → returns a child that encodes `[hub.updateState(token, amount), token.transfer(recipient, amount)]`
- Helpers: `tokens()` and `capLeft(token)`

Canon Guard integration:
- On queue, Canon Guard looks up the child’s parent and, if it’s an approved hub and `isHubChild(child)` is true, applies the short delay

For full function signatures, see `contracts/action-hubs/` and `contracts/actions-builders/`. Terms are defined in the Glossary.