---
sidebar_position: 1
---

# Getting started

## Main Canon Guard flows

### Canon Guard deployment and set up

In order to deploy Canon Guard, you need to have a [SAFE Wallet](https://app.safe.global/welcome) deployed in the corresponding chain. Then follow the next steps:

1) Clone the [canon-guard-scripts](https://github.com/defi-wonderland/canon-guard-scripts) repo on your machine.
2) Install the [required programs](https://github.com/defi-wonderland/canon-guard-scripts?tab=readme-ov-file#prerequisites).
3) Create a copy of the example `.env` and manually fill the values.
4) Import the signers private key: `cast wallet import canon-guard-tester --interactive`.
5) Install the dependencies: `pnpm install`. 
6) Start the setup process: `pnpm setupGuard`. This will interactively guide you into the deploy process of your Canon Guard, you will need:
    - short execution delay ([See glossary](../concepts/glossary.md#short-execution-delay)): recommended value is 1 hour (3600).
    - long execution delay process ([See glossary](../concepts/glossary.md#long-execution-delay)): recommended value is 7 days (604800).
    - transaction expiry delay ([See glossary](../concepts/glossary.md#transaction-expiry-delay)): recommended value is 7 days (604800).
    - maximum approval duration ([See glossary](../concepts/glossary.md#maximum-approval-duration)): recommended value is 7 days (126227808).
    - emergency trigger address ([See glossary](../concepts/glossary.md#emergency-trigger)): another multisig is recommended.
    - emergency caller address ([See glossary](../concepts/glossary.md#emergency-caller)): another multisig is recommended.

If the process is successful, the system will output the address of the deployed Canon Guard and the action builder, save them.

7) While you wait for the long execution delay process, collect the required signatures. See more on the sign process [here](#signing-a-hash).
8) Now call `pnpm executeTransaction` and when prompted use the detached mode and enter the Canon Guard address and the action builder. See more on the `executeTransaction` process [here](#executing-a-transaction).
9) Check with `pnpm isGuardSetup` to see if the setup was successful.

### Approving an action builder or hub

1) Grab the address of the action builder or hub.
2) Call `pnpm approveTransaction` or `pnpm approveHub` depending on what you need. See the glossary for more info on [actionBuilders](../concepts/glossary.md#action-builder) and [hubs](../concepts/glossary.md#hub).
3) This will queue the transaction and while you wait for the long execution period you must collect the required signatures.
4) Execute the tx by calling `pnpm executeTransaction` with the action builder address.

### Queueing a transaction

1) Grab the address of the action builder.
2) Call `pnpm queueTransaction`.

### Executing a transaction

1) Grab the address of the action builder.
2) Call `pnpm executeTransaction`.

### Signing a hash

1) Grab the address of the action builder you want to sign. Or input zero if planning to execute a no-action transaction.
2) Call `pnpm signTransaction`.

### Execute no-action transaction

1) Gather the required signatures by making all the signers call `pnpm signTransaction`, passing zero as the action builder address.
2) Call `pnpm executeNoActionTransaction`.

### Cancel enqueued transaction

1) Grab the address of the action builder you want to cancel. You must be the proposer and the tx must have no signers.
2) Call `pnpm cancelEnqueuedTransaction`.

### Deploy simpleTransfer action

TODO

### Deploy simpleAction action

TODO

### Deploy CappedTokenTransferHub

TODO

## Deploy CappedTokenTransfer

TODO
