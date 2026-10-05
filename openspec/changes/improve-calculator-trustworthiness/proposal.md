## Why

The calculator currently presents marketplace results with the same positive/negative decision language even when the selected domestic platform has unknown zero-value fees. That can make an incomplete estimate look decision-ready, while the single-currency-symbol switch and hidden zero-value costs add further ambiguity for merchants.

## What Changes

- Add an explicit fee-verification workflow for domestic platform presets whose current rates require merchant-console or contract confirmation.
- Replace definitive profit/loss language with an incomplete-estimate state until required fees are confirmed.
- Add a calculation-completeness summary that identifies zero-value cost categories merchants should confirm before relying on the result.
- Clarify result terminology as order contribution profit and monthly estimated contribution profit.
- Fix the domestic calculator to CNY instead of offering display-only currency switching.
- Allow numeric fields to remain temporarily blank while editing and normalize an empty field on blur.
- Document the broader product, domain-model, UI, technical, and commercialization roadmap without expanding this implementation into the future multi-fee engine.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `calculator-experience`: Add decision-readiness states, completeness guidance, precise contribution-profit language, CNY-only behavior, and forgiving numeric editing.
- `platform-fee-presets`: Require explicit merchant confirmation before an unverified marketplace estimate is presented as decision-ready.

## Impact

- Affects the calculator client state, numeric input control, result panel, responsive styles, and calculator UI tests.
- Adds a product improvement roadmap under `doc/` and updates customer guidance for the revised trust states.
- Keeps the existing profit formula, static export architecture, local-only processing, and platform preset provenance model unchanged.
