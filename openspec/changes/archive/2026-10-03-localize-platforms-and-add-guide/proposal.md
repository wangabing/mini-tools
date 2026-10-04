## Why

The calculator currently presents five overseas platforms even though the product now serves domestic Chinese small and individual merchants. Sellers also need a practical way to compare platform fit before calculating an order, while public fee data is often incomplete, login-gated, category-specific, or controlled by merchant contracts.

## What Changes

- **BREAKING** Remove Amazon US, TikTok Shop US, Etsy US, Shopify, and eBay US from the platform selector and preset identifiers.
- Add the 20 domestic platforms covered by `doc/china-ecommerce-platform-fee-research.md`, while retaining the generic fallback.
- Expand domestic product categories and keep the existing platform/category/global fallback behavior.
- Add fee-source access metadata and visible verification guidance so an unknown default rate is never presented as proof that a platform is free.
- Add a `/platforms` decision workspace for beginner individual sellers with operating-path filters, comparable platform rows, a shortlist of up to three platforms, selection advice, recent operating signals, and official merchant or activity entrances.
- Update navigation, sitemap, product documentation, user documentation, and automated tests for the domestic focus.
- Keep calculations local-only; do not add accounts, submissions, a database, scraping, or a complex fee-rule engine in this change.

## Capabilities

### New Capabilities

- `platform-selection-guide`: Covers the domestic platform comparison workspace, seller-path filtering, shortlist comparison, advice, update caveats, and official links.

### Modified Capabilities

- `platform-fee-presets`: Replaces overseas presets with 20 domestic platforms and adds fee verification/source-access semantics.
- `calculator-experience`: Changes the calculator's platform/category experience and communicates whether fee assumptions require merchant-console or contract verification.

## Impact

- Affects platform preset data and types, the calculator selector and assumption/source copy, global navigation and sitemap, and a new static `/platforms` route with a small client-side comparison component.
- Adds structured domestic platform guide data but no external runtime dependency, API, database, analytics event, or user-submitted data flow.
- Existing URLs remain valid; only obsolete platform identifiers and their tests are removed.
