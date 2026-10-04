## ADDED Requirements

### Requirement: Commercial static hosting path
The system SHALL support a root-path static export suitable for deployment to Cloudflare Pages without purchasing a server or domain.

#### Scenario: Cloudflare Pages production build
- **WHEN** the site builds with `STATIC_EXPORT=true` and no GitHub Pages flag
- **THEN** Next.js writes a complete `out` directory whose routes and assets load from the `pages.dev` domain root

### Requirement: GitHub Pages static export
The system SHALL provide an automated GitHub Actions workflow that installs locked dependencies, builds a static export, uploads it as a Pages artifact, and deploys it to GitHub Pages.

#### Scenario: Main branch is updated
- **WHEN** an authorized change is pushed to the default branch or the workflow is started manually
- **THEN** GitHub Actions builds and deploys the contents of the Next.js `out` directory

### Requirement: Repository subpath compatibility
The system SHALL render navigation, framework assets, metadata, sitemap, robots rules, and web app start URLs correctly when hosted under a GitHub project repository subpath.

#### Scenario: Project Pages deployment
- **WHEN** repository `owner/repository` is published at `https://owner.github.io/repository/`
- **THEN** all internal routes and assets remain under `/repository` and load without broken links

#### Scenario: User or organization Pages deployment
- **WHEN** a repository named `owner.github.io` is published
- **THEN** the application uses the domain root without an extra repository path

### Requirement: Local and server builds remain available
The system SHALL enable static export only when a static-host or GitHub Pages build flag is set.

#### Scenario: Developer runs a normal build
- **WHEN** `npm run build` runs without `GITHUB_PAGES=true`
- **THEN** the existing Next.js production build completes without forcing static export

### Requirement: Deployment can be configured without source edits
The system SHALL read the public site URL and hosted feedback endpoint from build-time environment configuration.

#### Scenario: Repository variables are configured
- **WHEN** the Pages workflow builds with the generated Pages URL and feedback endpoint variable
- **THEN** metadata uses the public URL and the contact page enables online feedback

### Requirement: Deployment instructions are reproducible
The repository SHALL document account prerequisites, exact Cloudflare Pages, GitHub Pages, and Formspree setup steps, environment configuration, commercial-use limitations, verification, alternatives, and rollback under `doc/`.

#### Scenario: Owner follows the deployment guide
- **WHEN** the owner starts with a GitHub account and no server or domain
- **THEN** the guide provides enough steps to obtain a public HTTPS address suitable for the intended use and verify feedback delivery
