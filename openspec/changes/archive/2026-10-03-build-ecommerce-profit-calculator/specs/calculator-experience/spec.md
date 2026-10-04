## ADDED Requirements

### Requirement: Calculator-first experience
The system SHALL present the functional calculator and current result in the first viewport instead of requiring a user to pass through a marketing landing page.

#### Scenario: First visit on desktop
- **WHEN** a desktop user opens the root URL
- **THEN** the short input form and primary profit result are both visible without navigation

#### Scenario: First visit on mobile
- **WHEN** a mobile user opens the root URL
- **THEN** the short form begins in the first viewport and the result follows directly in document order

### Requirement: Progressive input disclosure
The system SHALL keep platform, category, item price, product cost, fulfillment cost, and advertising cost visible while placing secondary assumptions in one collapsed advanced section.

#### Scenario: Basic calculation
- **WHEN** a user edits only the visible fields
- **THEN** the system produces a complete result using visible preset and zero-value advanced assumptions

#### Scenario: Advanced assumptions
- **WHEN** a user expands the advanced section
- **THEN** the additional values can be edited without losing any existing basic input

### Requirement: Professional result explanation
The system SHALL display primary profit, margin, ROI, break-even price, target price, advertising headroom, break-even ROAS, monthly projection, and a cost composition visualization with plain-language labels.

#### Scenario: Result updates
- **WHEN** any calculation input changes
- **THEN** all affected metrics and the cost composition update together without a separate submit action

### Requirement: Responsive and accessible interaction
The system SHALL support keyboard operation, visible focus, semantic labels, sufficient contrast, reduced motion, and layouts from 320 CSS pixels through wide desktop widths without overlap or clipped text.

#### Scenario: Keyboard-only use
- **WHEN** a user navigates the calculator with a keyboard
- **THEN** every interactive control is reachable, labeled, and has a visible focus state

#### Scenario: Narrow viewport
- **WHEN** the viewport width is 320 CSS pixels
- **THEN** inputs, results, navigation, and advertising space remain within the viewport without horizontal scrolling

### Requirement: Search and trust foundation
The system SHALL provide unique metadata, canonical URL support, WebApplication structured data, sitemap, robots rules, methodology content, privacy information, terms, and calculation disclaimers.

#### Scenario: Search crawler requests public routes
- **WHEN** a crawler loads the calculator or legal routes
- **THEN** it receives indexable HTML with route-appropriate metadata and no dependency on calculator interaction

### Requirement: Stable advertising boundary
The system SHALL reserve advertising space outside the primary input and result controls without embedding a publisher identifier in source code.

#### Scenario: Advertising is not configured
- **WHEN** no advertising publisher is configured
- **THEN** the reserved region remains stable and does not issue third-party advertising requests

### Requirement: Calculator data remains local
The first release SHALL NOT transmit calculator inputs or outputs to an application server or analytics provider.

#### Scenario: User calculates an order
- **WHEN** a user enters or changes business values
- **THEN** the values are processed in the browser only and are not persisted remotely

