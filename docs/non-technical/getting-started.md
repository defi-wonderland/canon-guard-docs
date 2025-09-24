---
sidebar_position: 1
---

# Getting started

## Main Canon Guard flows

### Canon Guard deployment and set up

In order to deploy Canon Guard, you need to have a SAFE Wallet deployed in the corresponding chain. Then follow the next steps:

1) Use the Canon Guard factory to deploy a new implementation of Canon Guard. Refer to the [registry](./registry.md) to find the address of the factory.
2) Deploy a new instance by calling the function `createCanonGuard` on the factory. With the following parameters:
    - `_safe`: Your SAFE wallet address.
    - `_shortTxExecutionDelay`: The short execution timelock. Recommended value: 1 hour (in seconds).
    - `_longTxExecutionDelay`: The long execution timelock. Recommended value: 7 days (in seconds).
    - `_txExpiryDelay`: The expiration time for transactions. Recommended value: 7 days (in seconds).
    - `_maxApprovalDuration`: The maximum time for approving an action or hub. Recommended value: 4 years (in seconds).
    - `_emergencyTrigger`: The address that will be able to turn emergency mode on.
    - `_emergencyCaller`: The address that will be able to call special methods during emergency mode.
3) Look for the address of the new instance. This will be **your** Canon Guard.
4) Approve the already deployed action builder `SetGuardAction`. Check the [registry](./registry.md) for the action builder address.([See more on approving](#approving-an-action-builder-or-hub))
5) Queue a new transaction with `SetGuardAction` as parameter. ([See more on queueing](#queueing-a-transaction))
6) Sign the transaction hash. ([See more on signing](#signing-a-hash))
7) Once all signers of the SAFE approved the transaction, it can be executed by calling `executeTransaction` passing `SetGuardAction` as parameter. ([See more executing](#executing-a-transaction))

### Approving an action builder or hub
TODO

### Queueing a transaction
TODO

### Executing a transaction
TODO

### Signing a hash
TODO
