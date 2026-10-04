## Why

E-commerce sellers need a fast way to understand whether an order is profitable without first learning accounting terminology or completing a long form. The repository currently has no application implementation, so this change establishes a focused, production-ready first tool that can later grow into an SEO-driven tool site and an opt-in industry-data product.

## What Changes

- Create a mainstream Next.js, React, and TypeScript application that serves a Chinese e-commerce profit calculator as the primary page.
- Provide a short default form with optional advanced costs, instant client-side calculation, and professional profit, margin, ROI, break-even, advertising, and cost-breakdown outputs.
- Add optional platform and product-category presets with a generic fallback, visible provenance, and editable suggested rates.
- Build a responsive, accessible visual system with restrained future-facing styling, stable result layouts, reserved advertising positions, and no blocking marketing landing page.
- Add calculation unit tests, UI behavior tests, SEO metadata, structured data, sitemap, robots rules, privacy/terms pages, and deployment documentation.
- Publish product requirements, product/technical design, interface/data contracts, user instructions, and deployment guidance under `doc/`.
- Establish domain and data boundaries that allow a later opt-in submission API and SQLite-backed analytics without introducing a database in this first release.

## Capabilities

### New Capabilities

- `profit-calculation`: Defines calculator inputs, formulas, validation, rounding, and professional result metrics.
- `platform-fee-presets`: Defines generic, platform, and category presets, provenance, fallback behavior, and manual overrides.
- `calculator-experience`: Defines the progressive form, responsive results, accessibility, SEO, privacy, advertising boundaries, and future submission boundary.

### Modified Capabilities

None.

## Impact

- Adds a new web application and its production dependencies to the repository root.
- Adds pure TypeScript domain modules and version-controlled fee preset data.
- Adds automated tests and build/lint/type-check scripts.
- Adds static legal and search-discovery routes, but no authentication, database, external platform API, or user-data collection in this release.
