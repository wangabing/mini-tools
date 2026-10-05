## MODIFIED Requirements

### Requirement: Fee verification state
Every preset SHALL indicate whether its fee assumptions are publicly verifiable, require a merchant login, or depend on merchant admission or contract terms; an unverified zero SHALL NOT be described as a free platform, and a preset that requires verification SHALL remain unconfirmed until the merchant explicitly attests that the current values were checked.

#### Scenario: User selects a login or contract dependent platform
- **WHEN** the selected platform's exact rate is unavailable from a reproducible public rule
- **THEN** the calculator tells the user to replace the zero or reference values with current merchant-console or contract values and marks the resulting estimate as not decision-ready

#### Scenario: User changes an unverified platform or category
- **WHEN** the user changes to a platform or category whose fees require confirmation
- **THEN** any prior fee confirmation is cleared so that confirmation applies only to the current preset and entered values
