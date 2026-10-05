## Context

The current calculator is a browser-only React client component backed by a pure TypeScript profit function. Its formula is intentionally generic, while every domestic marketplace preset currently carries unknown zero-value platform and payment fees and a `verificationRequired` flag. The UI warns about this in supporting copy but still renders a green "current profit" decision state, so the warning and the visual conclusion conflict.

The change must preserve static export, local-only calculation, the existing formula, and the compact calculator-first layout. The broader multi-fee model is documented as the next architectural phase rather than being partially introduced here.

## Goals / Non-Goals

**Goals:**

- Make an unverified marketplace estimate visually and semantically impossible to confuse with a decision-ready result.
- Give merchants a compact view of which common cost areas are represented and which zero-value areas deserve confirmation.
- Use precise contribution-profit terminology throughout the result surface.
- Remove display-only currency switching from the domestic calculator.
- Make numeric entry forgiving on mobile and desktop without weakening domain normalization.
- Preserve accessibility, responsive behavior, and local-only processing.

**Non-Goals:**

- Replacing the current profit formula with independent fee rules or multiple calculation bases.
- Publishing guessed platform rates or treating user confirmation as official verification.
- Adding accounts, remote persistence, analytics, batch import, scenario saving, or paid features.
- Reworking the established ledger-style visual system.

## Decisions

### Keep fee confirmation as explicit UI state

The calculator will keep a local `feesConfirmed` boolean. It is true in generic mode, false whenever a preset requires verification, and reset when platform or category changes. The merchant must use a checkbox labelled as a confirmation against their console or contract. Editing a fee does not silently imply confirmation because a partial edit may still omit payment or related charges.

The result panel receives a `needsFeeVerification` flag. While true, its status and primary metric use the amber warning treatment and estimated language regardless of whether the arithmetic result is positive or negative. The numeric preview remains available so the merchant can see changes while completing inputs.

Alternative considered: hide all results until fees are verified. This was rejected because immediate feedback is the calculator's core interaction and helps users enter the missing values correctly.

### Calculate completeness as transparent coverage, not accounting truth

A pure presentation helper will assess nine common areas: sale price, product cost, fulfillment, packaging/other order costs, acquisition cost, platform/payment assumptions, after-sales reserve, tax reserve, and monthly order plan. A positive value covers an amount/rate area; platform/payment coverage additionally requires explicit confirmation for unverified presets.

The UI will label absent areas as "建议确认" and state that a zero value may be valid but needs review. This score is guidance, not a validation gate and not a claim of net-profit accuracy.

Alternative considered: add a "not applicable" toggle beside every field. That would provide stronger semantics but would substantially increase first-release input burden; it belongs with the future professional mode.

### Fix the domestic experience to CNY

The currency selector will become a read-only CNY field with concise copy that the domestic version does not convert currencies. Existing formatting types remain intact to avoid unnecessary domain churn and to leave a clean path for a future dedicated cross-border mode.

### Preserve transient blank numeric input locally

`NumberField` will keep a string draft synchronized with its numeric prop. Empty input remains blank while focused and commits zero only on blur. Valid numeric drafts continue updating the calculation immediately. The domain layer remains numeric and continues normalizing invalid values.

### Extend the existing visual language

The change uses the established mineral white, ledger green, amber warning, coral loss, compact borders, and data typography. The signature contribution scale remains unchanged. Readiness and completeness are added as unframed bands within the result hierarchy rather than introducing nested cards or decorative UI.

## Risks / Trade-offs

- [A merchant can confirm fees without actually checking them] -> Use explicit first-person confirmation copy and continue showing the source and exclusions; do not call the values official or verified by the product.
- [A zero-cost area can be legitimate] -> Describe uncovered items as suggestions to confirm, not errors, and keep the score non-blocking.
- [Local string drafts can drift after reset or preset changes] -> Synchronize the draft from the numeric prop and cover clear/type/blur/reset behavior in component tests.
- [Removing currency choices affects users doing informal overseas estimates] -> State CNY-only behavior clearly and retain currency-ready domain formatting for a later cross-border product.
- [The generic formula remains incomplete for complex platforms] -> Document the limitation prominently and keep the multi-fee engine as the next P0 roadmap item.

## Migration Plan

1. Add readiness assessment and tests without changing profit arithmetic.
2. Wire fee confirmation and CNY-only behavior into the calculator.
3. Update result terminology, readiness styling, and responsive completeness display.
4. Update public guidance and add the product roadmap.
5. Run unit/UI tests, type checking, linting, and static production build. Rollback is a source revert; no persisted data or server migration exists.

## Open Questions

- The exact professional-mode confirmation model for legitimate zero-cost fields will be decided with the multi-fee engine.
- Cross-border currency conversion, rate source, and rate timestamp remain a separate product decision.
