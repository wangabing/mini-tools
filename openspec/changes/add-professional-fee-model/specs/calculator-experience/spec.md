## ADDED Requirements

### Requirement: Contextual professional inputs
The calculator SHALL group professional inputs by revenue and order costs, channel and transaction fees, after-sales, and monthly planning, and SHALL show channel-specific commission fields only when relevant.

#### Scenario: User selects creator or affiliate sales
- **WHEN** professional mode uses the creator or affiliate channel
- **THEN** the appropriate platform-specific commission fields and calculation base are visible

#### Scenario: User selects organic or advertising sales
- **WHEN** professional mode uses organic or direct advertising sales
- **THEN** creator or affiliate commission fields are hidden while their saved values do not affect the calculation

### Requirement: Professional result explanation
The professional result SHALL identify seller settlement revenue, transaction fees, expected after-sales loss, recurring cost allocation, and monthly contribution using merchant-facing labels.

#### Scenario: Professional costs update
- **WHEN** the user changes a professional fee base, return assumption, or recurring cost
- **THEN** the primary result, decision metrics, completeness guidance, and cost breakdown update together

## MODIFIED Requirements

### Requirement: Progressive input disclosure
The system SHALL keep platform, category, CNY scope, item price, product cost, fulfillment cost, and advertising cost visible; SHALL place secondary assumptions in one collapsed advanced section; and SHALL keep quick estimate selected by default while allowing professional calculation to be activated inside that section.

#### Scenario: Basic calculation
- **WHEN** a user edits only the visible fields
- **THEN** the system produces a quick estimate using visible preset and zero-value advanced assumptions

#### Scenario: Advanced quick assumptions
- **WHEN** a user expands the advanced section and keeps quick estimate selected
- **THEN** the existing quick assumptions can be edited without exposing professional fee-base and return-model fields

#### Scenario: Professional calculation
- **WHEN** a user selects professional calculation inside advanced settings
- **THEN** grouped professional inputs appear without losing any existing price or cost values
