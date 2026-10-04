## ADDED Requirements

### Requirement: Deterministic order profit calculation
The system SHALL calculate gross revenue, percentage fees, fixed costs, total costs, contribution profit, profit margin, and ROI from a typed set of non-negative order inputs.

#### Scenario: Profitable order
- **WHEN** a user enters positive revenue and costs whose total is below revenue
- **THEN** the system returns positive profit, margin, and ROI using the documented formulas

#### Scenario: Loss-making order
- **WHEN** a user enters costs whose total exceeds revenue
- **THEN** the system returns a negative profit and margin without replacing the loss with zero

### Requirement: Revenue and fee basis
The system SHALL define gross revenue as item price plus buyer-paid shipping minus discount, and SHALL apply percentage-based platform, payment, tax, and expected refund-loss rates to that gross revenue.

#### Scenario: Shipping and discount affect revenue
- **WHEN** buyer-paid shipping and a discount are entered
- **THEN** both values affect gross revenue and all percentage deductions consistently

### Requirement: Decision metrics
The system SHALL derive break-even item price, target-margin item price, maximum allowable advertising cost, break-even ROAS, and monthly profit from the same forward profit model.

#### Scenario: Reverse price calculation closes the loop
- **WHEN** the calculated target-margin price is passed back into the forward calculation with unchanged costs and rates
- **THEN** the resulting margin equals the requested target margin within one currency cent of tolerance

#### Scenario: Advertising headroom is exhausted
- **WHEN** non-advertising costs equal or exceed gross revenue
- **THEN** maximum allowable advertising cost is zero and break-even ROAS is reported as unavailable

### Requirement: Safe numeric boundaries
The system SHALL normalize non-finite and negative amounts to zero, reject a total variable rate at or above 100%, and avoid returning `NaN` in any displayed result.

#### Scenario: Empty calculator
- **WHEN** all amount inputs are zero
- **THEN** every monetary result is finite and percentage results use a defined zero or unavailable state

#### Scenario: Impossible fee rate
- **WHEN** combined percentage deductions reach or exceed 100%
- **THEN** reverse price metrics are unavailable and the system provides a specific validation message

### Requirement: Stable monetary presentation
The system SHALL preserve full calculation precision and SHALL round currency and percentage values only at the presentation boundary.

#### Scenario: Fractional-cent fees
- **WHEN** a percentage fee produces fractional cents
- **THEN** dependent calculations use the unrounded value while the interface displays the configured currency precision

