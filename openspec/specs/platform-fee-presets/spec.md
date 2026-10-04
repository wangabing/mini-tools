# Platform Fee Presets Specification

## Purpose

Define optional, transparent platform and product-category fee suggestions, their fallback order, editable behavior, and provenance requirements.

## Requirements

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
Every non-generic preset SHALL include its domestic market, official source URL, effective date when known, review date, data version, source-access status, and a note describing material exclusions and verification needs.

#### Scenario: User inspects fee assumptions
- **WHEN** a marketplace preset is active
- **THEN** the interface exposes the source, market, review date, access status, verification guidance, and exceptions without claiming exact platform coverage

### Requirement: Domestic platform coverage
The system SHALL provide selectable presets for 淘宝、天猫、京东开放平台、拼多多、抖音电商、快手电商、微信小店、小红书电商、闲鱼、1688、唯品会、得物、美团闪购、京东秒送/京东到家、饿了么零售、苏宁易购开放平台、当当开放平台、百度爱采购、微店 and 孔夫子旧书网, plus the generic platform.

#### Scenario: User opens the platform selector
- **WHEN** the calculator platform selector is opened
- **THEN** it contains the generic platform and all 20 domestic platforms and contains none of the removed overseas platforms

### Requirement: Fee verification state
Every preset SHALL indicate whether its fee assumptions are publicly verifiable, require a merchant login, or depend on merchant admission or contract terms, and an unverified zero SHALL NOT be described as a free platform.

#### Scenario: User selects a login or contract dependent platform
- **WHEN** the selected platform's exact rate is unavailable from a reproducible public rule
- **THEN** the calculator tells the user to replace the zero or reference values with current merchant-console or contract values
