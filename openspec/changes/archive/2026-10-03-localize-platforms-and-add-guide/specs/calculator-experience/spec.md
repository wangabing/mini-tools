## ADDED Requirements

### Requirement: Domestic platform guidance
The calculator SHALL use domestic platform and category labels and SHALL provide a direct route to the platform comparison guide for users who do not know which platform fits their business.

#### Scenario: User needs help choosing a platform
- **WHEN** a user activates the platform comparison link near the selector
- **THEN** the system opens the domestic platform guide at `/platforms`

### Requirement: Unverified fee assumptions remain explicit
The calculator SHALL distinguish editable planning assumptions from verified official rates in both its compact assumption summary and expanded source detail.

#### Scenario: User calculates with an unverified platform preset
- **WHEN** a platform preset uses zero or planning values because current official rates require login or contract confirmation
- **THEN** the calculator remains usable and visibly instructs the user to verify and edit the fee fields before making a business decision

### Requirement: Customer-facing language
All rendered product copy SHALL speak to merchants in plain Chinese about their business decisions and current privacy protection, and SHALL NOT expose internal plans for databases, interfaces, sample collection, or analysis.

#### Scenario: Customer reads a public page
- **WHEN** a user opens the calculator, platform guide, privacy page, methodology, or terms
- **THEN** the content describes recognizable merchant actions and current product behavior without developer-oriented implementation or roadmap language
