## MODIFIED Requirements

### Requirement: Search and trust foundation
The system SHALL provide unique metadata, canonical URL support, WebApplication structured data, sitemap, robots rules, methodology content, contact information, privacy information, terms, and calculation disclaimers.

#### Scenario: Search crawler requests public routes
- **WHEN** a crawler loads the calculator, contact, or legal routes
- **THEN** it receives indexable HTML with route-appropriate metadata and no dependency on calculator interaction

### Requirement: Calculator data remains local
The first release SHALL NOT transmit calculator inputs or outputs to an application server, hosted feedback service, or analytics provider. A user MAY separately submit contact fields they actively enter on the contact page.

#### Scenario: User calculates an order
- **WHEN** a user enters or changes business values
- **THEN** the values are processed in the browser only and are not persisted remotely

#### Scenario: User submits a contact message
- **WHEN** a user sends the contact form after using the calculator
- **THEN** no calculator inputs or outputs are included in the feedback request

### Requirement: Customer-facing language
All rendered product copy SHALL speak to merchants in plain Chinese about their business decisions, contact choices, and current privacy protection, and SHALL NOT expose internal plans for databases, interfaces, sample collection, or analysis.

#### Scenario: Customer reads a public page
- **WHEN** a user opens the calculator, platform guide, contact page, privacy page, methodology, or terms
- **THEN** the content describes recognizable merchant actions and current product behavior without developer-oriented implementation or roadmap language
