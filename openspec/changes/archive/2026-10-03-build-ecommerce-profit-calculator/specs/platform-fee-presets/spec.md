## ADDED Requirements

### Requirement: Generic calculation mode
The system SHALL offer a generic platform and generic category so that users can complete a calculation without selecting a marketplace-specific preset.

#### Scenario: User keeps generic selections
- **WHEN** the calculator loads and the user does not select a platform or category
- **THEN** the form remains usable and calculates with the visible generic assumptions

### Requirement: Platform-dependent categories
The system SHALL update the available category choices after a platform selection and SHALL always retain a generic category choice for that platform.

#### Scenario: Platform changes
- **WHEN** a user changes from one platform to another
- **THEN** the category list changes to the new platform's supported categories and falls back to its generic category

### Requirement: Preset resolution and fallback
The system SHALL resolve a fee preset by platform and category, then fall back to the platform generic preset, then to the global generic preset.

#### Scenario: Category-specific preset exists
- **WHEN** the selected platform and category have a matching preset
- **THEN** the matching category preset supplies the suggested fee values

#### Scenario: Category-specific preset is absent
- **WHEN** no category-specific record exists for a selected platform
- **THEN** the platform generic values are used and the fallback is visible to the user

### Requirement: Editable suggestions
The system SHALL treat preset values as suggestions and SHALL allow users to edit every suggested percentage and fixed fee before relying on a result.

#### Scenario: User overrides a suggested rate
- **WHEN** a user edits a fee that came from a preset
- **THEN** subsequent calculations use the edited value and mark that assumption as manually adjusted

### Requirement: Preset provenance
Every non-generic preset SHALL include its market, source URL, effective date, review date, data version, and a note describing material exclusions.

#### Scenario: User inspects fee assumptions
- **WHEN** a marketplace preset is active
- **THEN** the interface exposes the source, market, review date, and exceptions without claiming exact platform coverage

