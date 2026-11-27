## MODIFIED Requirements

### Requirement: Progressive input disclosure
The system SHALL keep platform, category, item price, product cost, fulfillment cost, advertising cost and quick/professional mode selection visible while placing secondary assumptions in one advanced section that opens when professional mode is selected.

#### Scenario: Basic calculation
- **WHEN** a user edits only the visible fields
- **THEN** results update immediately and assumptions remain discoverable

#### Scenario: Advanced assumptions
- **WHEN** a user selects professional mode
- **THEN** contextual professional fields become visible without losing basic inputs

## ADDED Requirements

### Requirement: Qualified decisions and example state
The system SHALL identify initial example results and default assumptions, qualify unconfirmed pricing and advertising decisions, and invalidate fee confirmation after mode, channel or fee-basis changes.

#### Scenario: Initial example
- **WHEN** a user first opens the calculator
- **THEN** the result is labeled as an example and the user can start a personal plan

### Requirement: Legitimate zero cost acknowledgement
The system SHALL allow explicit acknowledgement of a missing cost as zero without requiring a positive amount. Related input, mode, platform or channel changes SHALL invalidate affected acknowledgements.

#### Scenario: No paid acquisition
- **WHEN** a merchant acknowledges zero acquisition cost
- **THEN** that cost no longer appears as an unresolved check
