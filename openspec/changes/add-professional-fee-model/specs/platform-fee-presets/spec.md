## ADDED Requirements

### Requirement: First-six professional field templates
The system SHALL provide professional field templates for 淘宝、天猫、京东开放平台、拼多多、抖音电商 and 快手电商, with platform-specific transaction-fee and distribution labels, suggested fee bases, supported channels, and verification checklists.

#### Scenario: First-six platform enters professional mode
- **WHEN** a user selects one of the first six platforms and activates professional calculation
- **THEN** the advanced form uses that platform's field vocabulary and suggested bases without inserting an unverified numeric rate

#### Scenario: Other platform enters professional mode
- **WHEN** a user selects another supported platform and activates professional calculation
- **THEN** the advanced form uses a generic professional template and remains fully editable

### Requirement: Professional template freshness
Every professional template SHALL include a version, review date, next-review date, and official source inherited from or linked to the platform preset, and the interface SHALL identify a template whose next-review date has passed.

#### Scenario: Template is within review window
- **WHEN** the current date is on or before the template next-review date
- **THEN** the interface displays its version and next planned review without an overdue warning

#### Scenario: Template review is overdue
- **WHEN** the current date is after the template next-review date
- **THEN** the interface marks the template as due for review and continues requiring merchant verification rather than silently treating it as current
