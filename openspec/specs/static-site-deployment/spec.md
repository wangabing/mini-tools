# Static Site Deployment Specification

## Purpose

Define reproducible, server-free publication to GitHub Pages, including repository subpath and custom-domain compatibility.

## Requirements

### Requirement: Every production build is static
The system SHALL use the Next.js static export output mode for all production builds and SHALL write the deployable site to `out/`.

#### Scenario: Developer creates a production build
- **WHEN** `npm run build` completes
- **THEN** `out/` contains the static HTML, CSS, JavaScript, metadata, and public routes without requiring a Node.js server

### Requirement: GitHub Pages deployment is automated
The system SHALL provide a GitHub Actions workflow that installs locked dependencies, builds the static export, uploads it as a Pages artifact, and deploys it to GitHub Pages.

#### Scenario: Main branch is updated
- **WHEN** an authorized change is pushed to `main` or the workflow is started manually
- **THEN** GitHub Actions builds and deploys the contents of `out/`

### Requirement: Repository subpath is supported
The system SHALL render navigation, framework assets, metadata, sitemap, robots rules, and web app URLs correctly under a GitHub project repository path.

#### Scenario: Default project Pages URL is used
- **WHEN** `owner/repository` is published at `https://owner.github.io/repository/`
- **THEN** the build uses `/repository` as its base path and all internal routes and assets remain within that path

### Requirement: Custom domains use the root path
The system SHALL derive the base path from the configured public Pages URL so a custom domain does not retain the repository prefix.

#### Scenario: The production domain is bound
- **WHEN** the Pages public URL is `https://tool.xiaozhan.info`
- **THEN** the build uses an empty base path and emits canonical, sitemap, robots, and manifest URLs for that domain

### Requirement: Deployment needs no additional website service
The first release SHALL deploy using only GitHub Actions and GitHub Pages and SHALL NOT require a separate hosting, form, API, or database service.

#### Scenario: Owner follows the deployment guide
- **WHEN** the owner enables GitHub Actions as the Pages source
- **THEN** the guide provides enough steps to publish at the default HTTPS address, bind a purchased domain, verify the result, and roll back a release
