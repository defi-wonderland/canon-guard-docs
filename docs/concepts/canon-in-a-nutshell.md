---
sidebar_position: 1
title: In a nutshell
---

# Canon Guard in a Nutshell

## Context

For most organizations, Safe is the right choice and works beautifully. But when you're moving millions of dollars regularly, your risk profile changes dramatically. What works perfectly for a small DAO suddenly becomes a nerve-wracking dependency when managing institutional-scale treasuries.

Canon Guard addresses scenarios where offchain dependencies pose unacceptable risks. If you're running a major protocol or managing substantial funds, relying on external services for critical transaction flows isn't just uncomfortable, it's a vulnerability you can't afford.

### Off‑chain dependencies

Safe’s standard flow uses off‑chain infrastructure (a backend DB and indexers) to coordinate signature collection and surface transaction state to signers. That design yields a great UX, but for high‑value operations it also creates **single points of failure**: signatures and status can be **coordinated and presented off‑chain**, and if the coordination layer is compromised, attackers can obscure signer visibility or push a transaction through once they’ve reached threshold approvals. The Bybit incident illustrates how compromised frontends and off‑chain coordination can be abused.

### Physical security at scale

The **“five‑dollar wrench”** scenario is mostly theoretical for small multisigs. It becomes a **credible operational risk** for large treasuries. Traditional multisig assumptions (independent, freely acting signers) break down if multiple signers are simultaneously coerced. 

### The human factor

**Review fatigue** is real: after dozens of routine operations, even careful signers skim. That’s a manageable nuisance at small scale and a high‑severity risk when transaction **volume** and **value** increase. Canon Guard introduces structures that reduce repetitive cognitive load without sacrificing security. :contentReference[oaicite:3]{index=3}

## Canon Guard

**Canon Guard is an on‑chain execution gate** that sits between your signers and your Safe. It separates **who can approve** from **who can execute**, and it enforces **on‑chain approvals**, **immutable queued transaction data**, and **timelocks**, with an **Emergency Mode** that routes execution through a higher‑security multisig when the situation demands it.