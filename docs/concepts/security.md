---
sidebar_position: 10
title: Compromise Analysis
---
# Compromise Analysis

In this page we explain how CanonGuard and a Safe behave under different compromise scenarios. It's a summary of each role’s capabilities in normal and emergency modes, how approvals and cancellations interact, and the trade‑offs of the optional approval check, so operators can choose safe, practical responses during incidents.

## What owners and roles can do

- Owners, normal mode:
    - Queue a transaction: must be a Safe owner.
    - Execute a transaction: requires timelock elapsed, not expired, and threshold approvals on the current Safe tx hash.
    - Cancel an enqueued transaction: caller must be the proposer; the builder must still be queued. With the approval-check present, if any approval exists for the current-nonce hash, cancel reverts.
    - Burn a nonce via `NoAction`: requires threshold approvals; skips queue.
    - Approve a Safe tx hash: must be a Safe owner. Non-sequential approvals are allowed (owners can approve future nonces).
- Owners, emergency mode:
    - Can queue and approve hashes (as above).
    - Cannot execute, cancel, or NoAction; only the `emergencyCaller` can call those CanonGuard methods while emergency mode is ON.
- Emergency caller, emergency mode:
    - Execute a queued transaction: same timelock/expiry/threshold requirements as normal.
    - Cancel an enqueued transaction: does not need to be the proposer; with the approval-check present, cancel reverts if any approval exists on the current-nonce hash.
    - Burn a nonce via `NoAction`: requires threshold approvals.
- Emergency trigger:
    - Can turn ON `emergencyMode` instantly.
    - Cannot unset it; unsetting requires a Safe execution (i.e., go through queue/timelock/threshold).

## Definitions (used below)

- Lost: owner has no access; attacker has no access.
- Lost-and-compromised: owner has no access; attacker has access.
- Compromised: both owner and attacker have access (they can both act from the same address).
- Assumptions: 3 owners, threshold 2. Non-sequential approvals are intended and supported.

## Capability and cancellation quick reference

| Mode | Queue | Approve | Execute | Cancel | NoAction |
| --- | --- | --- | --- | --- | --- |
| Normal | Any owner | Any owner | Anyone via `CanonGuard`, needs timelock+threshold | Proposer only | Anyone via `CanonGuard`, needs threshold |
| Emergency | Any owner | Any owner | Only `emergencyCaller` | Only `emergencyCaller` | Only `emergencyCaller`, needs threshold |

Cancel behavior (two branches)

| Mode | Who cancels | With approval-check (current code) | Without approval-check (proposed) |
| --- | --- | --- | --- |
| Normal | Proposer only | Cancel reverts if any approval exists on current-nonce hash | Proposer can always cancel |
| Emergency | `emergencyCaller` only | Cancel reverts if any approval exists on current-nonce hash | `emergencyCaller` can always cancel |

## Single owner compromise (threshold remains 2)

- Lost:
    - Emergency mode not necessary.
    - Other owners should queue owner removal and add a new owner; approve and execute.
- Lost-and-compromised:
    - Attacker can queue/approve malicious txs but cannot reach threshold alone.
    - Honest owners should deploy an actions builder that removes the compromised owner and adds a new one; ensure the honest side is the proposer. They can bundle approvals and (once executable) the execution, e.g., using 7702-style bundling where applicable.
- Compromised:
    - Same mitigation as lost-and-compromised. Since honest owners can reach threshold themselves, there’s no need for “approval races.” Focus on:
        - Honest proposer for the honest queue.
    - Emergency mode generally unnecessary; it introduces extra centralization risk (the `emergencyCaller`).

This case set should be safe without emergency mode if honest owners coordinate.

## Threshold compromise (two owners compromised)

- Lost:
    - `SAFE` is effectively bricked: no transaction can reach threshold approvals.
- Lost-and-compromised:
    - If emergency mode is OFF: attackers can meet threshold and execute malicious txs.
    - If emergency mode is ON: only `emergencyCaller` can execute; if the caller is honest, they can refuse malicious executions. If the caller is malicious/unavailable, honest owners can't do anything and the `SAFE` will be drained or DoS.
- Compromised:
    - Emergency mode ON:
        - Queue and execute a rescue (e.g., move funds to a safe account). Alternative: queue the necessary actions to swap the compromised owners.
        - Attackers can still queue and approve malicious txs, but only the `emergencyCaller` can execute while emergency mode is ON.
    - Emergency mode OFF (out of caution/uncertainty):
        - The malicious owners will queue and approve malicious transactions to drain the funds. To which the honest owners, given they share the same address, will cancel them, assuming the approval’s check does not exist. Likewise, the malicious owners will cancel any rescue transaction queued by the owners they compromised.
            
            This would result in a stalemate, except for the owner that's not compromised. In this case, because no malicious actor has control over the last owner, he can queue a transaction to send the funds out of the `SAFE` to a trusted address without worrying about this transaction being cancelled given he's the proposer and therefore has sole control.
            
            The compromised owners will have to approve the transaction, which will require waiting for the transaction to be executable, and then bundling the approvals and execution, as the malicious owners can burn as many nonces as they want to fight their approvals.
            
            If the check on the number of signers exists at the time of cancelling an enqueued transaction, then the honest user will have to burn nonces (and perhaps quite a lot, as malicious owners can approve for thousand of upcoming nonces in advance) in order to cancel a transaction.
            
## Emergency Caller compromise

- Emergency mode OFF:
    - Minimal impact; they’re just an external caller.
- Emergency mode ON:
    - Lost/Lost-and-compromised: `SAFE` is bricked from the owners’ perspective—`emergencyCaller` gates execute/cancel/NoAction.
    - Compromised:
        - With approval-check: owners can pre-approve the current-nonce rescue hash and then queue it; cancel will revert. The caller still must execute when executable—liveness depends on caller cooperation.
        - Without approval-check: caller can cancel even fully approved rescues; strong DoS while emergency mode is ON.

The emergency caller alone cannot queue or approve; they only gate execute/cancel/NoAction during emergency mode.

## Emergency Trigger compromise

- The trigger can instantly turn emergency mode ON; only the Safe can unset it.
- If the `emergencyCaller` is honest/available:
    - They can execute rescues and unset emergency mode (via a queued/approved tx).
- If the `emergencyCaller` is malicious/unavailable:
    - Owners can queue/approve but cannot execute/cancel/NoAction; system is effectively stuck in emergency mode.
    - With approval-check removed, the caller can also cancel even approved rescues; recovery is blocked while emergency mode is ON.

## Emergency caller + threshold compromise

We will assume emergency mode on.

- Lost: Bit of a non-sensical case here, but `SAFE` would be bricked. No transactions other than NoActions could be executed.
- Lost and compromised: `SAFE` is rekt. There's nothing a single actor can do to stop the malicious owners from queueing and executing whatever they want.
- Compromised: This is the most interesting case, but it would essentially lead to an stalemate where the owners would try to burn nonces for the emergency caller to properly cancel action builders if the signatures' check is present, otherwise, it would just be an stalemate where the emergency caller would cancel anything that's queued.

## Lingering Malicious Transactions

When threshold is compromised, attackers can queue and pre-approve malicious builders. If emergency mode is used to pause execution, unsetting it re-opens public execution paths. Before unsetting, ensure no malicious queued item will be immediately executable. Likewise, be mindful of potential lingering approvals for transactions that weren't yet queued.

## Takeaways

- There may be cases where if the extent of the compromise is not certain, it may be better to not trigger emergency mode (assuming the signature's check on canceling doesn't exist). For example, on the `EmergencyCaller` compromise case. Imagine if a single owner is compromised, you panic and enter emergency mode, only to find out the emergency caller was compromised as well, and suddenly the `SAFE` can be DoS.
- Proposer control matters:
    - In normal mode, only the proposer can cancel; honest rescues should be queued by an honest, non-compromised proposer.
- Approval-check trade-off:
    - Keep it: provides a defensive shield (pre-approvals on current-nonce hashes block cancel), but adds nonce/timing complexity and can hinder cleanup if attackers get any current-nonce approval.
    - Remove it: simpler, consistent semantics, but loses the on-chain shield—malicious/unavailable `emergencyCaller` can cancel even fully approved rescues in emergency mode. In normal mode, malicious proposers can cancel approved txs they proposed.
- If you remove the check enforce proposer discipline operationally, and be careful with emergency mode.
- Always perform “lingering tx” cleanup before unsetting emergency mode to avoid immediately executable malicious transactions.