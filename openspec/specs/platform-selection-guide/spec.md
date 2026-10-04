# Platform Selection Guide Specification

## Purpose

Define the domestic platform comparison workspace, operating-path filters, shortlist behavior, time-sensitive information safeguards, and discovery requirements for beginner small and individual merchants.

## Requirements

### Requirement: Domestic platform decision workspace
The system SHALL provide an indexable `/platforms` page that explains and compares all 20 researched domestic commerce platforms for beginner small and individual merchants.

#### Scenario: Beginner opens the guide
- **WHEN** a user opens `/platforms`
- **THEN** the page presents the platform positioning, entry barrier, cost model, suitable seller, unsuitable seller, strengths, and trade-offs in plain Chinese

### Requirement: Operating-path filtering
The system SHALL let users filter platforms by low-barrier trial, content commerce, brand operation, local instant retail, and wholesale or B2B operating paths.

#### Scenario: User chooses an operating path
- **WHEN** a user selects one operating-path filter
- **THEN** only platforms tagged for that path remain in the comparison list and the active path is visibly identified

#### Scenario: User returns to all platforms
- **WHEN** a user selects the all-platforms filter
- **THEN** all 20 platforms return without losing page functionality

### Requirement: Limited shortlist comparison
The system SHALL let users select and compare up to three platforms and remove any selected platform.

#### Scenario: User builds a shortlist
- **WHEN** a user selects between one and three platforms
- **THEN** a comparison area shows their key fit, barrier, cost model, strengths, and trade-offs side by side

#### Scenario: User reaches the limit
- **WHEN** three platforms are already selected
- **THEN** unselected add controls are disabled or otherwise prevented and the three-platform limit is explained

### Requirement: Time-sensitive information is qualified
The system SHALL show a review date, describe recent items as operating signals rather than guaranteed benefits, link to official merchant or activity entrances, and state that current platform displays or contracts control.

#### Scenario: User reviews recent signals
- **WHEN** the page presents platform updates or benefit information
- **THEN** it shows the review date and a caveat that current eligibility and benefits must be confirmed through the linked official entrance

### Requirement: Responsive and accessible comparison
The system SHALL support keyboard operation, visible focus, semantic controls, and layouts from 320 CSS pixels through wide desktop widths without clipped content or required horizontal table scrolling.

#### Scenario: User compares on a narrow viewport
- **WHEN** the viewport is 320 CSS pixels wide
- **THEN** filters, platform facts, shortlist controls, and official links remain readable and operable within the viewport

### Requirement: Guide discovery and search metadata
The system SHALL link the guide from global navigation and the calculator context and SHALL include it in the public sitemap with route-specific metadata.

#### Scenario: User is unsure which platform to select
- **WHEN** a user follows the platform guidance link from the calculator or global navigation
- **THEN** the user arrives at the comparison workspace without losing access to the calculator route
