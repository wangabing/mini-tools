## Context

The repository contains planning documents but no application code. The first product is a Chinese profit calculator for cross-border and general e-commerce sellers. Its primary job is to turn a small number of familiar order values into decision-ready profitability metrics, while remaining credible enough to support future platform-specific tools, advertising, and opt-in aggregate analysis.

The first release must be deployable without a database or account system. Platform fee data changes over time and varies by market and category, so presets are suggestions with provenance rather than hidden authority. Future submission analytics will require consent, abuse controls, a persistent SQLite-compatible deployment, and a distinction between preset and user-entered values.

## Goals / Non-Goals

**Goals:**

- Deliver a fast, responsive calculator as the first screen rather than a marketing landing page.
- Keep the default form short while supporting a complete cost model through progressive disclosure.
- Separate pure calculation logic, preset data, and React presentation.
- Make every suggested fee editable and traceable to a market, source, and review date.
- Produce indexable static content, stable advertising space, legal pages, and reliable automated checks.
- Preserve a clean boundary for a later opt-in submission API and SQLite-backed aggregate analysis.

**Non-Goals:**

- User accounts, saved calculations, server-side submissions, dashboards, or a database.
- Automatic scraping or background updating of platform fees.
- Tax, legal, or accounting advice, or exact reproduction of every platform exception.
- A broad directory of hundreds of calculators in the first release.

## Decisions

### Use a lean Next.js monolith

Use the current patched stable Next.js App Router with React and strict TypeScript. It provides static SEO routes and a future server boundary without adding a separate API service. A Vue SPA plus a second backend was rejected because it creates two deployment and framework surfaces when data collection arrives. Copying the 222-page SellerToolSuite repository was rejected because removing duplicated pages and embedded formulas would cost more than starting with a small application.

### Keep calculation logic pure and client-side

All first-release calculations live in framework-independent TypeScript functions. React owns input state and presentation only. Values retain full precision internally and are rounded only for display. This makes formula tests direct and lets a future submission service recompute and validate results server-side.

The calculation model treats gross order revenue as item price plus buyer-paid shipping minus discount. Percentage deductions apply to gross revenue. Fixed costs include product, fulfillment, packaging, advertising, other costs, and fixed payment fees. Profit is gross revenue minus all costs. Break-even and target prices solve the same forward formula rather than using the current order's fee amount as a fixed cost.

### Use version-controlled, explainable presets

Preset records include platform, market, category, suggested percentage and fixed fees, source URL, effective date, review date, and notes. The selector resolves in this order: platform/category, platform/generic, generic. A preset fills fee fields only when selected; users can immediately edit any filled value. The UI labels these values as reference data and exposes provenance beside the advanced fee controls.

The initial set focuses on common cross-border seller contexts and deliberately remains small. It is not an attempt to encode every fee exception. A richer rule engine is deferred until a specific market validates the need.

### Use progressive disclosure for the form

The always-visible controls are platform, category, item price, product cost, fulfillment cost, and advertising cost. A single advanced section contains buyer-paid shipping, discount, packaging, payment fees, tax allowance, refund-loss allowance, other costs, target margin, and monthly order volume. Calculations update immediately without a submit step.

On desktop, inputs and results use a two-column work surface; on mobile, results follow the short form and the advanced section remains collapsed. Stable result dimensions prevent layout movement when values change.

### Adopt a precise "profit instrument" visual direction

The subject is a seller making a pricing decision, and the page's single job is to expose the economic signal quickly. The visual system uses mineral white (`#F4F7F5`), paper white (`#FFFFFF`), carbon (`#17201C`), ledger teal (`#087F6D`), signal amber (`#D99524`), loss coral (`#C94F45`), and data indigo (`#4059AD`). UI text uses system Chinese sans fonts; monetary figures use a tabular numeric utility stack.

The signature element is a horizontal contribution scale that places revenue, cost, and profit/loss on one stable instrument-like rail. Everything else stays quiet: square-to-6px corners, hairline dividers, no gradients, no decorative blobs, and motion limited to value transitions that respect reduced-motion preferences.

### Keep analytics opt-in and deferred

The first release sends no calculator values to a server. A future `SubmissionRepository` boundary can accept an explicitly consented snapshot containing platform, category, market, inputs, outputs, preset version, and whether suggested rates were overridden. It must omit product names, SKUs, contact data, and raw IP storage. Published analysis must be labeled as calculator-user sample data rather than industry-wide statistics.

For deployment, local SQLite is valid only on a single host with persistent storage and backups. A serverless deployment must use a remote SQLite-compatible service such as libSQL/Turso rather than an ephemeral local file.

## Risks / Trade-offs

- [Preset data becomes stale] -> Show sources and review dates, keep fields editable, and cover preset shape with tests.
- [A short form hides important costs] -> Keep advanced inputs one action away and show which assumptions are currently zero.
- [Users interpret estimates as accounting advice] -> Add methodology, source context, and a concise disclaimer near results and in legal pages.
- [Static SEO copy becomes thin or duplicated] -> Launch only the calculator and essential explanatory/legal routes with original content.
- [Advertising harms trust or causes layout shift] -> Reserve fixed-size slots outside the input-result interaction and load ads only after a publisher is configured.
- [Future collected samples are biased or manipulated] -> Require explicit submission, record preset/manual provenance, rate-limit, validate server-side, deduplicate, and describe sampling limitations.

## Migration Plan

1. Scaffold the application and pin patched dependencies.
2. Add domain calculation and preset modules with tests.
3. Build the calculator experience and static routes.
4. Run lint, type checking, unit/UI tests, production build, and responsive browser checks.
5. Deploy the static-capable release. Rollback is a deployment revert because no persistent data is changed.
6. In a later change, select the hosting model before adding the submission repository and SQLite migrations.

## Open Questions

- Which platform and market should receive the first audited, category-complete fee schedule?
- Will the future database run on a persistent single-host volume or a remote SQLite-compatible service?
- Which jurisdictions and advertising provider determine the eventual consent-management requirements?

