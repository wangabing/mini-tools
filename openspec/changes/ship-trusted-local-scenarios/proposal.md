## Why

Public-evidence audits found six refund scenarios whose shipped-order expectations differ from the current professional model. Merchants also cannot retain or compare pricing plans, so every visit requires repeated entry.

## What Changes

- **BREAKING**: Professional calculations use expected revenue and recoverable inventory per shipped order, with refundable transaction fees accounted for once. Quick estimates remain compatible.
- Label examples and unverified decisions; validate probability ranges and invalidate confirmation when effective fee assumptions change.
- Expose mode selection and let merchants acknowledge legitimate zero costs.
- Add explicit device-local saves, restore/copy/delete and comparison of up to three plans, with version and source snapshots and recoverable storage failures.
- Link platform guidance to its calculator selection and update privacy and calculation documentation.

## Capabilities

### New Capabilities

- `local-calculation-scenarios`: Explicit local persistence and version-aware pricing-plan comparison.

### Modified Capabilities

- `profit-calculation`: Shipped-order professional refund semantics and probability validation.
- `calculator-experience`: Example state, accessible mode selection, zero-cost acknowledgement and qualified decision metrics.

## Impact

Pure profit domain, calculator and platform components, CSS, privacy/methodology pages, documentation and tests. Static export and browser-only calculation remain; no backend or new production dependencies.
