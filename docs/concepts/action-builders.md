---
sidebar_position: 5
title: Action Builders
---

## What is an Action Builder?

An Action Builder is a small onchain contract that describes exactly what to do when a queued transaction executes. Instead of hand‑crafting calldata each time, you point Canon Guard at a builder. The builder returns a list of atomic steps (targets, data, and value) and Canon Guard takes care of running them in order.

Think of a builder as a template filled with concrete details (for example, “send 1,000 USDC to payroll”). Builders are easy to review once and then reuse safely.

They matter because:

- They replace ad‑hoc calldata with readable intent
- They make repeatable flows safer and less error‑prone
- They are immutably snapshotted when queued, so what you simulate is exactly what will run later

You will choose to use a builder when:

- You want repeatable transactions with clear, immutable payloads
- You want to reduce manual calldata assembly and review fatigue
- You want to pair with an Action Hub that mints compliant builders under a policy (budgets, allowlists)

And in that way, you get: 

- Clear intent: each step specifies a target, function/data, and ETH value (if any)
- Reusability: once reviewed, the same builder can be queued again
- Auditability: Canon Guard snapshots the builder’s steps when queued, what you simulate is what runs

## How it works

When you interact with an Action Builder, the process unfolds in the following stages:

- First, the Action Builder contract is called to produce a detailed list of steps. Each step specifies a target contract address, the calldata to send, and the amount of ETH (if any) to include. This list defines the exact sequence of actions to be performed, such as “call contract A with these parameters, then call contract B,” and so on.

- When you queue a transaction using Canon Guard, it immediately queries the builder for this list of steps. These steps are stored immutably.

- Next, Safe owners must approve the transaction. This is done by approving the precise Safe transaction hash onchain, which Canon Guard computes based on the steps. Only when the required owners have approved this hash does the transaction become eligible for execution.

- After a mandatory waiting period (the delay), Canon Guard is able to execute the transaction. It does this by sending the entire batch of steps through the Safe in a single operation, using the `MultiSendCallOnly` contract. 

Examples in this repo include generic call builders ([SimpleActions](https://github.com/defi-wonderland/canon-guard/blob/dev/src/contracts/actions-builders/SimpleActions.sol)), ERC‑20 transfers ([SimpleTransfers](https://github.com/defi-wonderland/canon-guard/blob/dev/src/contracts/actions-builders/SimpleTransfers.sol)), and others. Hub‑minted builders (for example, Capped Token Transfers) encode policy enforcement before acting.

For implementation details, see [`contracts/actions-builders/`](https://github.com/defi-wonderland/canon-guard/tree/dev/src/contracts/actions-builders).
