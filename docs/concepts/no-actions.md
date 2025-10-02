---
sidebar_position: 8
title: No actions (spend nonce)
---

## What is a no‑action transaction?

A no‑action is a special transaction that deliberately does nothing but spends the Safe’s next nonce. It’s used to invalidate signatures that are already collected for a queued item when you decide you no longer want to execute that item.

This is useful when:
- A queued transaction got approved but you changed your mind and need to clear signatures quickly
- You want to scrub stale signatures across signers without touching any assets or contracts

## How it works

- Canon Guard builds an empty batch (no steps) and computes the Safe transaction hash
- Owners approve that empty hash onchain
- Execution (via `executeNoActionTransaction`) consumes the nonce and makes signatures for the old item useless
- In emergency mode, only the emergency caller can execute the no‑action

## When to use it vs cancel

- Cancel removes a queued item but only if no owner has approved its hash
- If approvals exist, cancel is blocked. And you should use no‑action to spend the nonce and invalidate the approvals.