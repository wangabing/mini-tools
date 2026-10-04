## 1. Contact Experience

- [x] 1.1 Add the `/contact` route with customer-facing contact information, minimal form fields, privacy explanation, and direct email fallback
- [x] 1.2 Implement configured, pending, success, failure, unconfigured, and automated-submission states without reading calculator data
- [x] 1.3 Add the contact route to navigation, footer, metadata, sitemap, and privacy disclosures
- [x] 1.4 Add focused component tests for successful delivery, failed delivery, missing configuration, and the hidden trap field

## 2. Static Deployment

- [x] 2.1 Configure conditional Next.js static export, trailing slashes, GitHub Pages base path, and manifest scope
- [x] 2.2 Add a GitHub Actions workflow that builds and deploys the `out` artifact with repository variables
- [x] 2.3 Verify normal production build and GitHub Pages static export, including route and asset paths

## 3. Documentation

- [x] 3.1 Rewrite `doc/deployment.md` with exact GitHub Pages and Formspree setup, limitations, checks, alternatives, and rollback
- [x] 3.2 Update README, requirements, design, interface, user guide, and owner input checklist for contact and free deployment

## 4. Quality And Release

- [x] 4.1 Run unit tests, type checking, lint, OpenSpec validation, and both production build modes
- [x] 4.2 Inspect the contact page and existing routes at mobile and desktop widths, fixing overflow, overlap, focus, and state issues
- [x] 4.3 Sync delta specs into the main OpenSpec specs and archive the completed change
