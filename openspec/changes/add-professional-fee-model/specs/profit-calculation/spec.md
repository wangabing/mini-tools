## ADDED Requirements

### Requirement: Professional order cost model
The system SHALL provide a professional calculation mode that separately calculates platform, payment, creator or affiliate, tax, insurance, activity, after-sales, and recurring costs without changing quick-mode calculations.

#### Scenario: Creator-assisted order
- **WHEN** professional mode uses a creator or affiliate channel with percentage and fixed commission
- **THEN** both commission components are included as a distinct transaction cost and are visible in the result breakdown

#### Scenario: Platform subsidy is received
- **WHEN** professional mode includes a platform subsidy that is paid to the merchant
- **THEN** the subsidy increases seller settlement revenue without reducing the merchant-funded discount

### Requirement: Expected after-sales loss
Professional mode SHALL calculate expected after-sales loss from return rate, reverse shipping, handling, product value loss, and the configured non-refundable share of transaction fees.

#### Scenario: Return risk is present
- **WHEN** return rate and one or more per-return loss inputs are positive
- **THEN** the per-order result includes return rate multiplied by the calculated single-return loss

#### Scenario: No returns are expected
- **WHEN** return rate is zero
- **THEN** professional after-sales loss is zero regardless of the configured per-return costs

### Requirement: Recurring cost allocation
Professional mode SHALL allocate monthly platform and operating costs across expected monthly orders and SHALL deduct those costs exactly once from the monthly result.

#### Scenario: Monthly costs are allocated
- **WHEN** monthly recurring costs and expected monthly orders are positive
- **THEN** each order includes its proportional allocation and monthly profit equals order profit times volume

#### Scenario: Monthly orders are unavailable
- **WHEN** recurring costs are positive and expected monthly orders are zero
- **THEN** the system reports that recurring costs cannot be allocated and does not return misleading reverse-price metrics

## MODIFIED Requirements

### Requirement: Revenue and fee basis
The system SHALL define quick-mode gross revenue as item price plus buyer-paid shipping minus merchant-funded discount and SHALL apply quick-mode percentage deductions to that gross revenue. In professional mode, the system SHALL add platform subsidy to seller settlement revenue and SHALL independently apply platform, payment, creator or affiliate, and tax percentage costs to their configured item-amount, buyer-paid, or seller-settlement bases.

#### Scenario: Shipping and discount affect quick revenue
- **WHEN** buyer-paid shipping and a discount are entered in quick mode
- **THEN** both values affect gross revenue and all quick-mode percentage deductions consistently

#### Scenario: Professional fees use different bases
- **WHEN** professional platform and payment fees select different calculation bases
- **THEN** each fee is calculated from its own base and the result exposes both amounts independently

#### Scenario: Subsidy enters seller settlement only
- **WHEN** professional mode includes a platform subsidy and a fee uses the buyer-paid base
- **THEN** the subsidy increases revenue but does not increase that buyer-paid fee

### Requirement: Decision metrics
The system SHALL derive break-even item price, target-margin item price, maximum allowable advertising cost, break-even ROAS, and monthly profit from the same forward profit model. Quick mode SHALL retain the closed-form reverse calculation, while professional mode SHALL solve reverse prices against the expanded forward model without intermediate rounding.

#### Scenario: Reverse price calculation closes the loop
- **WHEN** the calculated target-margin price is passed back into the applicable forward calculation with unchanged costs, bases, and rates
- **THEN** the resulting margin equals the requested target margin within one currency cent of tolerance

#### Scenario: Professional mixed-base price closes the loop
- **WHEN** professional mode has multiple fee bases, creator commission, expected returns, and recurring allocation
- **THEN** the numerically solved target price produces the requested margin within one currency cent of tolerance

#### Scenario: Advertising headroom is exhausted
- **WHEN** non-advertising costs equal or exceed seller settlement revenue
- **THEN** maximum allowable advertising cost is zero and break-even ROAS is reported as unavailable
