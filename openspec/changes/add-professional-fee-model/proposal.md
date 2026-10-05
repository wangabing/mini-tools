## Why

The current quick estimator applies every percentage cost to one revenue base and represents after-sales risk as a simple sales percentage. Merchants need a professional path that can model platform, payment, distribution, returns, and recurring costs independently without making the default calculator harder to use.

## What Changes

- Preserve the existing quick-estimate mode as the default and add an explicit professional-calculation mode inside advanced settings.
- Add independent calculation bases for platform, payment, distribution, and tax percentage costs, with separate fixed charges.
- Add merchant-funded discount, platform subsidy, insurance, creator/affiliate commission, expected return loss, and monthly platform/operating cost inputs.
- Calculate expected return loss from return rate, reverse-logistics and handling costs, product value loss, and the non-refundable share of transaction fees.
- Allocate monthly recurring costs by expected order volume and show the allocation in order and monthly results.
- Replace closed-form reverse pricing with a forward-model numerical solver in professional mode so break-even and target prices remain consistent across mixed fee bases.
- Add versioned field templates for 淘宝、天猫、京东、拼多多、抖音 and 快手, including review-due metadata and platform-specific fee labels without publishing guessed rates.
- Update result breakdowns, completeness guidance, methodology, user documentation, and automated tests.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `profit-calculation`: Add a professional order model with independent fee bases, expected return loss, recurring-cost allocation, and numerical reverse-price calculations while retaining quick mode.
- `calculator-experience`: Add a simple quick/professional mode control and contextual advanced inputs without expanding the default short form.
- `platform-fee-presets`: Add versioned professional field templates and review-due metadata for the first six domestic platforms without unverified numeric defaults.

## Impact

- Extends the typed profit input/result contracts and calculation engine while preserving existing quick-mode callers.
- Adds a professional-template data module and updates calculator state, advanced settings, result breakdowns, readiness assessment, styles, and tests.
- Updates product, methodology, user, and API documentation.
- Adds no backend, account, remote persistence, analytics, or external dependency.
