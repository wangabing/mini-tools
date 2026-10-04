# Contact Information Specification

## Purpose

Define a minimal, trustworthy contact path for the static first release without adding an online form or data processor.

## Requirements

### Requirement: Contact information is always available
The system SHALL provide a public contact page at `/contact` that displays `mrwbz@sina.com` as a usable email link.

#### Scenario: User chooses to make contact
- **WHEN** a user activates the visible email address
- **THEN** the browser opens the device email application with the recipient and subject prepared

### Requirement: The static release has no online message form
The system SHALL NOT render message fields, a message submit control, or a hosted form request in the first release.

#### Scenario: User opens the contact page
- **WHEN** the contact page finishes rendering
- **THEN** the user sees the direct email option and no in-site message form

### Requirement: Contact does not read calculator data
The email action MUST NOT read, attach, persist, or transmit calculator inputs or results.

#### Scenario: User previously used the calculator
- **WHEN** the user activates the email link after a calculation
- **THEN** price, cost, fee, profit, platform, and category values remain in the browser and are not added to the email action

### Requirement: Privacy guidance is explicit
The contact page SHALL explain that email is sent by the user's email application and SHALL warn against sending passwords, verification codes, identity documents, or unredacted statements.

#### Scenario: User reviews the contact method
- **WHEN** the user reads the contact page
- **THEN** the delivery boundary and sensitive-information warning are visible before contact is initiated
