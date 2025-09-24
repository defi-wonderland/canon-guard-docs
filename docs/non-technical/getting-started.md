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

Approving an action builder or hub will allow the transactions included in the contract to have a short timelock. When approving a hub, all hub children will be approved by default. The process is the next one:

1) Select the desired action builder or hub.
2) Deploy a new `ApproveAction` using the `ApproveActionFactory` method `createApproveAction`. Passing the action builder to approve as the first parameter and the duration as the second. The duration is the time in seconds until the approval expires, it must not surpass the `_maxApprovalDuration` set in the deployment.
3) Queue the deployed `ApproveAction` action builder. Given that is not pre-approved, it will go for the long delay path.
4) Sign the transaction hash in the SAFE.
5) Execute the transaction.

### Queueing a transaction

This process will add a transaction to the queue, making it available for signing. In order to queue you will need an action builder. It can be pre-approved or not.

1) Call the Canon Guard method `queueTransaction` with the desired action-builder. The caller must be a SAFE signer.
2) After this the transaction will be available for signing.

### Executing a transaction

Executing a transaction will interact with the SAFE with the given actions. In order to execute a transaction it must be previously queued, signed and not expired. Any account (even someone that is not a signer) can call this method.

1) Call the Canon Guard method `executeTransaction` (single transactions) or `executeTransactions` (multiple transactions) with the action builder as parameter.

### Signing a hash

Signing (or approving) a hash in the SAFE with a given nonce will provide a signature to reach the threshold needed to execute a transaction.

1) Get the safe transaction hash of the desired transaction by calling `getSafeTransactionHash` with the action builder as parameter.
2) Use that hash to call `approveHash` in the SAFE wallet (not in Canon Guard).
