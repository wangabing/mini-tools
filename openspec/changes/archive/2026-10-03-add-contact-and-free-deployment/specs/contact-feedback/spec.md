## ADDED Requirements

### Requirement: Contact information is always available
The system SHALL provide a public contact page at `/contact` that displays `mrwbz@sina.com` as a usable email link regardless of online form configuration.

#### Scenario: User prefers email
- **WHEN** a user opens the contact page
- **THEN** the user can activate the visible email address to compose a message

### Requirement: Feedback form stays minimal
The system SHALL request only an optional name, an optional reply email, and a required message for online feedback.

#### Scenario: User sends a concise message
- **WHEN** a user provides a message and activates the send control
- **THEN** the system submits the three feedback fields without requesting account, shop, phone, order, or calculator data

#### Scenario: Reply email is malformed
- **WHEN** a user enters an invalid reply email
- **THEN** browser validation prevents submission and identifies the field that needs correction

### Requirement: Submission state is truthful and actionable
The system SHALL expose pending, success, failure, and unconfigured states and SHALL NOT report success before the hosted form endpoint accepts the submission.

#### Scenario: Hosted service accepts feedback
- **WHEN** the configured endpoint returns a successful response
- **THEN** the form clears and confirms that the message was sent

#### Scenario: Feedback delivery fails
- **WHEN** the network fails or the endpoint rejects the submission
- **THEN** the form preserves the entered content, explains that it was not sent, and presents the direct email alternative

#### Scenario: Feedback endpoint is absent
- **WHEN** the site was built without a feedback endpoint
- **THEN** the page presents direct email contact and does not render a deceptively active submission control

### Requirement: Feedback is separated from calculator data
The system MUST send only the values a user actively enters into the contact form and MUST NOT read, attach, or transmit calculator inputs or results.

#### Scenario: User previously used the calculator
- **WHEN** the user later submits a contact message
- **THEN** the request contains no price, cost, fee, profit, platform, or category values from the calculator

### Requirement: Basic automated-submission defense
The system SHALL include a non-disruptive automated-submission check without adding a challenge to the normal user flow.

#### Scenario: Hidden trap field is completed
- **WHEN** an automated submitter fills the hidden trap field
- **THEN** the client does not send the form to the hosted endpoint
