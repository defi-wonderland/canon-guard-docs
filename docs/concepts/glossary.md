---
sidebar_position: 9
---

# Glossary

## Canon Guard is a system with several new definitions

#### **Action**: 
An on-chain call that one desires to execute through Canon Guard.

#### **Action builder**: 
A contract that will parse and build a set of actions and will be used to queue and execute them.

#### **Factory**: 
A previously deployed contract (don't worry, you won't have to deployed it yourself) that can be used to create new action builders or hubs.

#### **Child**: 
A contract created by a factory, it can be a hub or an action builder.

#### **Parent**: 
The contract that created a specific contract. It can be a factory or a hub.

#### **Hub**: 
A more sophisticated contract that can be used to give new functionalities to action builders. Like managing caps, saving storage, doing complex checks that can't be made on the action builder itself. An action builder that has a parent hub will report to this contract and will be it's hub child.

#### **Hub child**: 
The child of a hub, it is always an action builder.

#### **Emergency mode**: 
When Canon Guard enters this mode, the next methods can only be called by the emergency caller: `executeTransaction`, `executeTransactions`, `executeNoActionTransaction` and `cancelEnqueuedTransaction`.

#### **Emergency caller**:
Privileged address that is configured at deployment time, is the only one able to execute some methods when emergency mode is on.

#### **Emergency trigger**:
Privileged address that is configured at deployment time, is the only one able to set the emergency mode on.

#### **Short execution delay**:
Timelock for pre-approved actions (actions that were approved by calling `approveActionsBuilderOrHub`).

#### **Long execution delay**:
Timelock for actions that were not pre-approved

#### **Transaction expiry delay**:
Seconds until the queued actions expire (meaning that it can no longer be executable).

#### **Maximum approval duration**: 
The maximum amount of time an action builder or hub can be approved.

#### **Approve an action builder or hub**: 
The process of pre-approving a set of actions (or action builder or hub). Those actions will have a short execution delay period. If approving a hub, all hub children will inherit the approved status. 

#### **Queue a transaction**:
The process of adding a new set of actions to the queue, making them available to sign, and initiating the timelock.

#### **Execute a transaction**: 
If the actions have the required signatures and they not expired, they can be executed by anyone. This will call the SAFE with the saved payload and finish the main flow of Canon Guard.

#### **Cancel enqueued transaction**:
If a transaction does not have any signers it can be effectively removed from the queue.

#### **Execute no-action transaction**:
In the case were a transaction includes an error but it was already signed by the required signers, a rapid, no-timelock transaction can be sent that will use the current nonce of the SAFE in order to nullify the signatures for that transaction. 
