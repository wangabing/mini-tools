## Context

The current client-side calculator has a small version-controlled preset module for five overseas platforms and a selector that applies one aggregate platform rate, one payment rate, one fixed payment fee, and one refund reserve. The domestic platform research covers 20 platforms across marketplace, content commerce, secondhand, B2B, local retail, and vertical models, but it also establishes that many exact rates are visible only after login or in merchant contracts.

The primary users are beginner Chinese individual sellers. They need a fast way to choose plausible channels and estimate one order without first learning platform accounting terminology. The implementation must remain a lean Next.js monolith and preserve a future boundary for SQLite-backed, opt-in sample collection without adding that storage now.

## Goals / Non-Goals

**Goals:**

- Replace overseas choices with the 20 researched domestic platforms and useful domestic category sets.
- Preserve a short default calculator and editable aggregate fee assumptions.
- Make the difference between a verified public fee and an unverified/login/contract rate impossible to miss.
- Help a beginner narrow 20 platforms to two or three based on operating path, entry barrier, strengths, and trade-offs.
- Keep guide content structured, testable, indexable, and easy to update without editing component markup.

**Non-Goals:**

- Reproduce every platform's multi-base, tiered, refund-aware fee engine.
- Scrape rules, guarantee promotions, or claim a current rate without a reproducible official source.
- Add merchant accounts, saved shortlists, submissions, analytics, APIs, or SQLite.
- Introduce a component framework, global state library, chart package, or external font.

## Decisions

### Keep a conservative aggregate preset model

Each domestic platform receives a platform-generic preset so selecting any platform remains useful. Rates that cannot be verified from a public, currently applicable official rule default to zero and carry a source-access status plus explicit verification guidance. Refund-loss reserves remain planning assumptions rather than official fees. This is safer than inventing industry averages and smaller than prematurely implementing the six rule-engine families described by the research.

The data model retains the existing category/platform/global resolution order. Categories can still guide the user's context even when they resolve to the platform-generic preset. A future change can replace aggregate values with independent fee rules without changing the calculator's pure profit formula.

### Model guide content as typed static data

A dedicated data module holds positioning, model, operating paths, barrier, cost model, suitability, strengths, trade-offs, recent signal, official benefit entrance, review date, and official URL for each platform. The page consumes the same `PlatformId` identifiers as the calculator. This avoids duplicated platform names and makes omissions detectable in tests.

The “recent signal” field describes durable operating direction, not a promised promotion. The page states that actual benefits and admission rules are controlled by the current merchant console or contract.

### Use a decision workspace instead of a directory card wall

The subject is a beginner deciding where to sell, and the page's single job is to eliminate poor fits and retain two or three candidates. The signature element is an unframed “经营路径地图” connecting five recognizable seller goals to the platform list. A segmented filter changes the comparison rows; each row exposes the decision-critical facts before secondary detail.

Desktop uses a stable comparison grid with aligned decision columns. Narrow screens use full-width rows with labeled facts and no horizontal table scrolling. Users can add at most three platforms to a sticky-but-contained shortlist comparison and remove them individually.

The existing mineral white, paper white, carbon, ledger teal, signal amber, loss coral, and data indigo tokens remain. Typography stays with the existing Chinese system sans and tabular utility stack. The distinct visual risk is the route-map rail: a compact branching line that encodes actual operating paths rather than acting as decoration. Everything else remains quiet, square, and divider-led.

### Keep the route static with a small client interaction island

`/platforms` is a server page for metadata and indexable copy. Filtering and shortlist state live in one client component with local React state. No value is persisted or transmitted. This matches the current architecture and keeps deployment static-capable.

### Update documents in place

Product requirements, product design, data contracts, and the user guide are revised under `doc/` to describe the domestic platform scope and the new route. The completed fee research remains the source of truth for platform cost rules and official entrances.

## Risks / Trade-offs

- [Zero can be mistaken for no fee] -> Label the preset as requiring verification next to the applied assumptions and again in the expanded source panel.
- [Twenty choices overwhelm a short form] -> Keep native platform selection familiar, use Chinese names, and direct users who are unsure to the guide.
- [Guide advice becomes stale] -> Store a review date per record, use official entrances, avoid transient numerical claims, and display the current-backend caveat.
- [Aggregate fee inputs under-model domestic platforms] -> State exclusions clearly and defer the multi-fee rule engine until the first six platforms can be audited from real merchant accounts.
- [A comparison table breaks on mobile] -> Render responsive labeled rows instead of relying on horizontal scrolling.
- [Subjective recommendations appear authoritative] -> Frame them as operating-fit guidance and show both strengths and trade-offs for every platform.

## Migration Plan

1. Replace preset identifiers and update tests in the same deployment so no stale identifiers remain reachable.
2. Add structured guide data, the `/platforms` route, navigation, sitemap, and documentation.
3. Run type checking, lint, unit/UI tests, production build, and real-browser responsive checks.
4. Deploy as one static-capable application update. Rollback is a deployment revert because there is no persistent state migration.

## Open Questions

- Which first-party merchant accounts can be used in a future audited-rate phase for the first six platforms?
- Which hosting model will provide persistent SQLite-compatible storage when opt-in sample submission is introduced?

