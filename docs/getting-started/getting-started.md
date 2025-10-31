---
sidebar_position: 1
---

# Getting started

## Main Canon Guard flows

> Before you start setting up everything, make sure you have gone through the [concepts](/docs/category/concepts) section and understand what canon guard is about.

### Canon Guard deployment and set up

In order to deploy Canon Guard, you need to have a [SAFE Wallet](https://app.safe.global/welcome) deployed in the corresponding chain. Then follow the next steps:

1) Clone the [canon-guard-scripts](https://github.com/defi-wonderland/canon-guard-scripts) repo on your machine.
2) Install the [required programs](https://github.com/defi-wonderland/canon-guard-scripts?tab=readme-ov-file#prerequisites).
3) Create a copy of the example `.env` and manually fill the values.
4) Import the signers private key: `cast wallet import canon-guard-tester --interactive`.
5) Install the dependencies: `pnpm install`. 
6) Start the setup process: `pnpm setupGuard`. This will interactively guide you into the deploy process of your Canon Guard, you will need:
    - Short execution delay ([See glossary](../concepts/glossary.md#short-execution-delay)): recommended value is 1 hour (3600).
    - Long execution delay process ([See glossary](../concepts/glossary.md#long-execution-delay)): recommended value is 7 days (604800).
    - Transaction expiry delay ([See glossary](../concepts/glossary.md#transaction-expiry-delay)): recommended value is 7 days (604800).
    - Maximum approval duration ([See glossary](../concepts/glossary.md#maximum-approval-duration)): recommended value is 7 days (126227808).
    - Emergency trigger address ([See glossary](../concepts/glossary.md#emergency-trigger)): another multisig is recommended.
    - Emergency caller address ([See glossary](../concepts/glossary.md#emergency-caller)): another multisig is recommended.

If the process is successful, the system will output the address of the deployed Canon Guard and the action builder, save them. An example output will look like this: 

```
How long in seconds should you SHORT execution delay be? In seconds: 3600
How long in seconds should you LONG execution delay be? In seconds: 604800
From the moment a transaction is executable, how long until it expires? In seconds: 604800
What should be the maximum approval duration? In seconds: 126227808
Who should be the emergency trigger?: 0x80B0b49ed8Bfb0b879FbDd8c6A211E5Aa9A050C6
Who should be the emergency caller?: 0x80B0b49ed8Bfb0b879FbDd8c6A211E5Aa9A050C6
Enter keystore password:
Canon guard and set guard action successfully deployed. Would you like to enqueue the action into your Canon guard? y/(N): y
Transaction successfully queued. Would you like to approve this transaction in your Safe? y/(N): y
Script ran successfully.
Gas used: 3814893

== Logs ==
  Signer: 0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38
  Safe: 0xA55A50CD0038F128e577fcf7B8D1232ED98d3F17
  Safe threshold: 1
  Canon guard: 0x0000000000000000000000000000000000000000
  Canon guard deployed to: 0x7278227C6108801f3118Ad250b42Ed0059e47D6c
  Set guard simple action deployed to: 0xd0f5D793825A54FC9F24Dd179Ab8e1602da976A1
  Your transaction will be executable in 604800 seconds
  Watch out, your transaction will also expire in 604800 seconds
  You can execute the transaction via the executeTransaction script
  Detached Canon guard: 0x7278227C6108801f3118Ad250b42Ed0059e47D6c
  Action builder: 0xd0f5D793825A54FC9F24Dd179Ab8e1602da976A1

## Setting up 1 EVM.

==========================
```

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

1) Grab the token address, the amount and the recipient.
2) Call `pnpm deploySimpleTransfer`.

### Deploy simpleAction action

1) Grab the contract address you want to interact with, and the selector. ABI-encode the calldata using `cast abi-encode` or a page like [Hashex](https://abi.hashex.org/).
2) Call `pnpm deploySimpleAction`.

### Deploy CappedTokenTransferHub

1) Grab the token address, the amount and the recipient you want to cap the transfers.
2) Call `pnpm deployCappedTokenTransferHub`.

## Deploy CappedTokenTransfer

1) Grab the address of the deployed CappedTokenTransferHub
2) Call `pnpm deployCappedTokenTransfer`.
3) Select the amount you want to transfer, it should not exceed the cap set in the hub.
