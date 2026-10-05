## Context

The current calculator has a deliberately flat `ProfitInput`: one gross-revenue value, a small set of percentage rates sharing that base, and fixed order costs. This is appropriate for quick estimation but cannot explain common domestic marketplace statements where platform service, payment, affiliate, subsidy, returns, and recurring fees use different bases or periods.

The previous trustworthiness change established that unknown fees remain unconfirmed, CNY is fixed for the domestic product, and incomplete estimates are visually distinct. This change must preserve those safeguards, local-only processing, static export, the short default form, and all existing quick-mode results.

## Goals / Non-Goals

**Goals:**

- Add a professional mode with separate fee bases and fixed charges.
- Represent content/affiliate selling, platform subsidies, insurance, expected return loss, and monthly cost allocation.
- Keep every reverse metric consistent with the expanded forward model.
- Provide useful field templates for the first six platforms without guessing fee rates.
- Keep the default user journey as simple as the current calculator.

**Non-Goals:**

- Exact automatic rates for every category, merchant type, campaign, or contract.
- Arbitrary user-created fee rows, tiered thresholds, caps, or per-fee refund policies in this iteration.
- Store accounts, SKU persistence, CSV import, historical comparisons, or remote APIs.
- Tax filing, VAT invoice accounting, guarantee-deposit funding cost, or formal accounting profit.

## Decisions

### Preserve quick mode and add a typed professional branch

`ProfitInput` gains `calculationMode: "quick" | "professional"` plus typed professional fields. Quick mode remains the default and continues using the existing gross-revenue formula, refund reserve, and reverse-price behavior. Professional mode activates the expanded fields. This avoids forcing existing users to understand fee bases and protects current callers and tests.

Alternative considered: replace the quick model outright. Rejected because most first-time decisions need speed, and a mandatory professional form would violate the product's primary UX principle.

### Use explicit fee bases with an internal rule pipeline

Professional percentage fees select one of three bases:

- `item-amount`: item price after merchant-funded discount, excluding shipping and subsidy;
- `buyer-paid`: item amount plus buyer-paid shipping;
- `seller-settlement`: buyer-paid amount plus platform subsidy.

The calculator builds independent internal rules for platform percentage/fixed fee, payment percentage/fixed fee, creator/affiliate percentage/fixed fee, tax reserve, and recurring platform cost. Each evaluated rule produces a named breakdown row. The first UI iteration exposes fixed fields rather than arbitrary row creation so merchants see stable, recognizable inputs.

### Model after-sales as expected loss

Professional mode calculates:

```text
single return loss = reverse shipping
                   + handling
                   + product cost x product value loss rate
                   + transaction fees x non-refundable share

expected return loss/order = return rate x single return loss
```

This is more explainable than multiplying revenue by a generic refund-loss rate. Quick mode retains the simple reserve for users who do not have return data.

### Allocate recurring costs by monthly order volume

Monthly platform/software costs and monthly operating overhead are divided by expected monthly orders and included in per-order cost. Monthly profit then multiplies the allocated per-order result by the same volume, deducting the monthly costs exactly once. If monthly costs are positive and order volume is zero, recurring allocation and reverse decision metrics are unavailable with a specific validation message.

### Solve professional reverse prices numerically

Mixed bases and return-fee interactions make the current closed-form reverse formula invalid. Professional mode will evaluate the same forward model repeatedly with a bounded binary search to find the minimum item price for zero profit or the requested margin. Quick mode keeps the existing closed-form path for regression stability.

The solver starts at zero, expands an upper bound until the target is reached or a safe price ceiling is exceeded, then performs enough iterations to exceed currency-cent precision. No rounded intermediate value enters the solver.

### Treat platform templates as field vocabulary, not price data

A new data module supplies versioned templates for 淘宝、天猫、京东、拼多多、抖音 and 快手. Templates customize platform fee and distribution labels, suggested fee bases, supported selling channels, checklist text, review date, and next-review date. Numeric rates remain zero unless supplied by an independently verified preset; selecting a template never converts an unknown fee into a trusted default.

Other platforms receive a generic professional template, so professional mode remains usable everywhere.

### Keep professional controls inside advanced settings

The advanced section starts with a two-option segmented control: quick estimate and professional calculation. Professional mode then reveals grouped sections for revenue/order costs, channel/fees, after-sales, and monthly planning. The platform, category, price, product cost, fulfillment, and advertising fields remain unchanged and visible in the short form.

The existing result hierarchy remains. Cost labels and methodology copy expand only where the professional model needs additional explanation.

## Risks / Trade-offs

- [Professional mode still cannot model every tier, cap, or refund exception] -> Label it as an explainable planning model and keep actual-statement verification prominent.
- [Many optional fields can feel overwhelming] -> Keep quick mode default, group fields by merchant task, show creator fields only for creator/affiliate channels, and use platform-specific labels.
- [A numerical solver could fail or become slow] -> Use deterministic bounded monotonic search, pure functions, strict iteration limits, and edge-case tests.
- [Monthly costs with zero orders cannot be allocated] -> Return unavailable reverse metrics with a direct validation message instead of silently dropping the costs.
- [Template metadata can become stale] -> Store review due dates, show freshness in the source area, and test first-six coverage and overdue detection.
- [Adding string fields weakens numeric-key updates] -> Introduce a mapped numeric input-key type and separate typed setters for mode, channel, and fee bases.

## Migration Plan

1. Extend domain types and defaults with a quick-mode-compatible professional input contract.
2. Refactor calculation into shared evaluation plus quick and professional reverse paths; add domain tests first.
3. Add professional platform templates and data tests.
4. Add the mode control and contextual grouped inputs, then update readiness and result explanations.
5. Update documentation and run complete automated and responsive browser verification.

Rollback is a source revert. There is no persisted user data or server migration.

## Open Questions

- Arbitrary fee rows, tiered rules, caps, and per-fee refund policies remain candidates for the next professional-model iteration.
- Whether professional scenarios should be saved locally will be decided in the later merchant-workflow phase.
