## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Preset provenance
Every non-generic preset SHALL include its domestic market, official source URL, effective date when known, review date, data version, source-access status, and a note describing material exclusions and verification needs.

#### Scenario: User inspects fee assumptions
- **WHEN** a marketplace preset is active
- **THEN** the interface exposes the source, market, review date, access status, verification guidance, and exceptions without claiming exact platform coverage

