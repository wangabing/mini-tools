## ADDED Requirements

### Requirement: Decision readiness state
The system SHALL distinguish an arithmetic preview with unconfirmed required fees from a decision-ready estimate, and SHALL NOT describe an unconfirmed positive preview as current profit.

#### Scenario: Marketplace fees are not confirmed
- **WHEN** a user selects a platform whose preset requires merchant-console or contract confirmation and has not confirmed those assumptions
- **THEN** the result remains visible but uses a warning state labelled "费用待核对" and estimated contribution-profit language

#### Scenario: Marketplace fees are confirmed
- **WHEN** the user confirms that the displayed fee assumptions were checked against the merchant console or contract
- **THEN** the result uses its normal profit, loss, or break-even decision state

### Requirement: Calculation completeness guidance
The system SHALL show how many common revenue and cost areas are represented in the current estimate and SHALL identify zero-value areas that deserve confirmation without treating them as invalid.

#### Scenario: Common cost area is zero
- **WHEN** one or more tracked cost areas have a zero value
- **THEN** the result lists those areas as suggestions to confirm and explains that zero may be valid

#### Scenario: Required platform fees are unconfirmed
- **WHEN** the selected platform requires fee confirmation and the user has not confirmed it
- **THEN** platform and payment assumptions are counted as an uncovered area

### Requirement: Domestic currency scope
The domestic calculator SHALL calculate and display monetary values in CNY and SHALL NOT offer a selector that only changes currency symbols without converting values.

#### Scenario: User opens the domestic calculator
- **WHEN** the calculator renders
- **THEN** the currency area displays人民币 CNY and states that no currency conversion is performed

### Requirement: Forgiving numeric editing
The system SHALL allow a numeric input to remain temporarily empty while the user is editing and SHALL normalize an empty draft to zero when editing ends.

#### Scenario: User replaces a numeric value
- **WHEN** the user clears a numeric field and types a replacement value
- **THEN** the field does not insert zero before the replacement and valid typed values update the calculation immediately

#### Scenario: User leaves a numeric field empty
- **WHEN** the user clears a numeric field and moves focus away without entering a replacement
- **THEN** the field commits and displays zero

## MODIFIED Requirements

### Requirement: Professional result explanation
The system SHALL display order contribution profit, contribution margin, order-cost return, break-even price, target price, advertising headroom, break-even ROAS, monthly estimated contribution profit, and a cost composition visualization with plain-language labels.

#### Scenario: Result updates
- **WHEN** any calculation input changes
- **THEN** all affected metrics and the cost composition update together without a separate submit action

### Requirement: Unverified fee assumptions remain explicit
The calculator SHALL distinguish editable planning assumptions from verified official rates in both its compact assumption summary and expanded source detail, and SHALL require explicit merchant confirmation before presenting a marketplace estimate as decision-ready.

#### Scenario: User calculates with an unverified platform preset
- **WHEN** a platform preset uses zero or planning values because current official rates require login or contract confirmation
- **THEN** the calculator remains usable, tells the user to verify and edit the fee fields, and presents the result as an incomplete estimate until the user explicitly confirms the assumptions
