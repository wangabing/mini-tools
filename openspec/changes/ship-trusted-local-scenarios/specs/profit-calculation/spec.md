## ADDED Requirements

### Requirement: Professional shipped-order expected profit
Professional mode SHALL compute expected profit per shipped order, reverse revenue and subsidy on full returns, recover undamaged inventory, account for nonrefundable transaction fees once, and retain spent fulfillment and acquisition costs. Monthly orders SHALL use the same shipped-order denominator.

#### Scenario: Recoverable full return
- **WHEN** price is 100, goods cost is 60, return probability is 10%, and no other costs apply
- **THEN** expected profit is 36 and 100 shipped orders produce 3600 before monthly overhead

#### Scenario: All orders returned
- **WHEN** all goods are fully recoverable and all orders are returned with forward shipping 5 and reverse shipping 2
- **THEN** expected revenue is zero and profit is minus 7

### Requirement: Probability constraints
The domain SHALL constrain probability and loss proportions to 0–100, report invalid raw ranges and withhold reverse decision metrics until corrected.

#### Scenario: Invalid return probability
- **WHEN** return rate exceeds 100
- **THEN** the result is finite, a specific validation warning is present and reverse metrics are unavailable
