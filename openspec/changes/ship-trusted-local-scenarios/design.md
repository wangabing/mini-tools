## Context

The static Next.js app has pure calculation functions and versioned platform templates. Fourteen independent cases establish a baseline; six refund cases expose a shipped-order semantics gap. Browser storage has not previously been used.

## Goals / Non-Goals

**Goals:** Correct professional expected profit, explain uncertainty, simplify mode discovery, and retain/compare plans on the current device.

**Non-Goals:** Partial refunds, per-fee refund policies, cloud sync, bulk CSV, accounting profit and proven commercial adoption.

## Decisions

- Professional order count means shipped orders. Full returns reverse buyer revenue and subsidy, recover undamaged inventory and refundable transaction fees; tax allowance is reversed with returned revenue. Forward logistics, advertising, insurance and packaging remain spent. One common nonrefundable transaction-fee proportion remains an explicit approximation.
- Gross revenue in professional results is expected retained settlement; original settlement is separately shown. Profit before monthly overhead and after allocation are separately named. ROAS uses expected retained settlement, explicitly distinct from ad-dashboard GMV.
- Bounded probabilities normalize to 0–100 and surface a validation warning for raw out-of-range inputs. Field-level errors support editing without silently certifying invalid values.
- Keep the existing mineral white, paper white, teal, amber and indigo palette, system Chinese body type and monospaced numeric utility type. The signature is a compact ledger of saved plans with aligned decision amounts, stacking into single columns at 320px. Mode selection moves above the short form; professional details open on selection.
- Persist only explicitly saved snapshots. Include model/preset versions, source, input, zero acknowledgements and fee confirmation. No current draft auto-save. Parse and validate local data before restoring; incompatible versions remain visible but require explicit recalculation and renewed confirmations. Stored historical results remain visible separately.
- Use browser storage through an external store with a stable server snapshot to preserve static rendering and hydration. Catch quota, corruption and denied-storage errors without disabling the calculator. Save at most twelve plans and compare at most three. Deletion requires an explicit second action.
- Platform guide links use a query parameter read in a client effect after hydration, without introducing dynamic server rendering.

## Risks / Trade-offs

- [Shared refund proportion cannot match every contract] → show full-return assumptions and unsupported partial refunds/individual refund rules.
- [Browser data can be cleared or shared] → disclose device-only storage and offer explicit deletion.
- [Model changes invalidate saved conclusions] → preserve historical summary and version provenance; flag mismatch before recalculation.
- [More controls burden novices] → short mode helper, collapsed saved-plan workspace and contextual cost acknowledgement.

## Migration Plan

Deploy static output after unit/UI checks, strict synthetic audit and production build. No pre-existing saved schema requires migration. Bump the professional model version and retain old snapshots rather than silently treating them as current. Rollback uses the prior static release.
