---
sidebar_position: 2
---

### Who is this setup for?

This setup is designed for DAOs, protocol teams, and crypto-native organizations that require high-assurance control over treasury operations. It’s especially well-suited for teams managing large sums or performing recurring transactions, where minimizing signer fatigue and exposure to phishing or UI compromise is critical. Anyone seeking a fully on-chain, simulation-friendly, and tamper-resistant execution model for multisigs will benefit from this architecture.

### **How do you protect against all signers being coerced simultaneously?**

Even if all signers are coerced at the same time, it would still take at least the duration of the long timelock period (e.g., 7 days) to execute any irregular transaction, such as withdrawing all funds. This extended delay provides ample opportunity for intervention unless coercion is sustained for the entire period, and either no one triggers the emergency mode, or the emergency signer multisig is compromised as well.

### **What if the hardware wallet or computers of all signers are compromised?**

If an irregular transaction is proposed due to compromised hardware, monitoring systems would immediately trigger alerts. There would be a timelock window (e.g., 7 days) to identify and remove malicious actions from the queue.
However, removing compromised signers also requires this timelock period, during which the attacker could interfere. In such edge case scenarios, organizations should use the emergency multisig as a secure fallback to avoid getting DoS.

### **What happens if the Safe UI gets compromised?**

This proposed system does not rely on the Safe UI at all. Actions can be queued using local scripts, Etherscan, or directly via wallets supporting arbitrary contract interactions.

### **What if Tenderly or another simulation tool gets compromised?**

In the rare scenario where a malicious actor intercepts an irregular transaction and manipulates simulation tools like Tenderly to disguise its malicious nature, relying solely on a single tool poses risks. To mitigate this, multiple independent verification methods should be employed to thoroughly confirm transaction validity. We might release a recommended verification procedure in the future.

### Could you pre-vet a swap action in the Safe?

Could you? Yes… Should you? We don’t think so.

Swaps require complex logic and dynamic parameters, such as the minimum amount out. We believe that actions should be as simple as possible. So if you need to make a token conversion, it could be better to simply move the tokens you want to swap to another Safe or EOA, execute the swap there, and deposit back, reducing the risk in your main Safe.
