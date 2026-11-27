## ADDED Requirements

### Requirement: Explicit local plan persistence
The system SHALL save at most twelve named plans only on an explicit action, on the current device, with input, platform/category, fee and zero acknowledgements, model/preset/source provenance and historical summary. It SHALL support restore, save-as-copy and confirmed deletion without sending business values to a server.

#### Scenario: Restore after reload
- **WHEN** a merchant saves a plan and reloads the page
- **THEN** the plan remains available and restoring it recovers its inputs and applicable confirmations

#### Scenario: Storage unavailable
- **WHEN** browser storage is denied, corrupt or full
- **THEN** an actionable message is shown and the current calculator remains usable without reporting a successful save

### Requirement: Version-aware comparison
The system SHALL compare up to three saved plans, show uncertainty and historical version mismatch, and require renewed confirmation when an incompatible snapshot is explicitly restored for recalculation.

#### Scenario: Compare activity pricing
- **WHEN** two or three saved plans are selected
- **THEN** price, profit, margin and advertising boundary are presented together without horizontal overflow at 320px

#### Scenario: Model changed
- **WHEN** a saved plan has an older model or preset version
- **THEN** its historical summary is identified as old and recalculation does not reuse its previous fee confirmation
