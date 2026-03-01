## Design Decisions

During the development of this token, several implementation choices were made with simplicity, cost-efficiency, and educational clarity in mind.

- **Token Decimals**
  - The token was configured with `0 decimals`.
  - This means the token is **non-fractional** and can only exist in whole units.
  - Since this is a testing / academic token and not intended for financial precision, fractional divisibility was unnecessary.
  - This simplifies both:
    - contract logic
    - frontend interaction
  - It also makes token behavior easier to reason about during demonstrations and evaluation.

- **Development Environment**
  - The project was built using a **Node.js-based environment**.
  - Development was done using **VS Code-compatible tooling**, due to strong familiarity and productivity within this ecosystem.

- **Blockchain Choice**
  - The token was deployed on the **Base network**.
  - Reasons for this choice:
    - It is **EVM-compatible**, meaning it fully supports the ERC-20 standard.
    - It offers **extremely low transaction fees**, making it practical even without relying on a testnet.