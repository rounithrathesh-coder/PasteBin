---
name: ProCode DevSystem
colors:
  surface: '#0d1322'
  surface-dim: '#0d1322'
  surface-bright: '#33394a'
  surface-container-lowest: '#080e1d'
  surface-container-low: '#151b2b'
  surface-container: '#191f2f'
  surface-container-high: '#242a3a'
  surface-container-highest: '#2f3445'
  on-surface: '#dde2f8'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#dde2f8'
  inverse-on-surface: '#2a3040'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#ffb784'
  on-tertiary: '#4f2500'
  tertiary-container: '#a15100'
  on-tertiary-container: '#ffe0cd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb784'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#0d1322'
  on-background: '#dde2f8'
  surface-variant: '#2f3445'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

This design system is engineered for developers who value precision, speed, and a high-end aesthetic. It balances the utility of code editors like VS Code with the refined, atmospheric presentation of Vercel. 

The aesthetic is **Modern Corporate / Developer-Centric**, utilizing deep space-navy backgrounds to reduce eye strain during long sessions. It employs vibrant purple accents to guide attention and signify premium features. Visual hierarchy is established through subtle border definitions and tonal layering rather than aggressive shadows. The interface should feel technical yet polished, evoking a sense of high-performance reliability.

## Colors

The palette is optimized for a dark-first experience. 
- **Primary & Secondary:** Vibrant purples are reserved for primary actions, progress indicators, and active states. 
- **Neutral:** A deep navy base (`#0B1120`) serves as the core background. Surfaces and cards use slightly lighter shades of navy to create depth.
- **Syntax Highlighting:** A curated set of high-contrast colors inspired by the "One Dark" theme ensures code snippets are highly legible.
- **Status:** Functional colors (Green, Yellow, Red) follow standard semiotics but are slightly desaturated to sit comfortably within the dark UI.

## Typography

Inter is the primary typeface, chosen for its exceptional legibility in technical interfaces. 
- **Hierarchy:** Large display titles use tight letter spacing and heavy weights. 
- **Utility:** Body text defaults to 14px for density, mirroring the information density of modern IDEs. 
- **Code:** For actual code snippets or terminal outputs, use **JetBrains Mono** to maintain a developer-friendly experience.
- **Mobile:** Scale `display-lg` down to 28px on mobile devices to ensure headings do not wrap awkwardly.

## Layout & Spacing

The design system uses a **Fluid Grid** model with a 4px baseline unit. 
- **Sidebar:** A fixed-width sidebar (240px) is recommended for navigation, consistent with dashboard patterns.
- **Grid:** Use a 12-column layout for the main content area. Dashboard cards should typically span 3, 4, or 6 columns depending on the data complexity.
- **Density:** Spacing is intentional but compact. Use 16px (`stack-md`) for internal card padding and 24px (`gutter`) for the space between major components.

## Elevation & Depth

Depth is primarily communicated through **Tonal Layers** and **Low-Contrast Outlines**. 
- **Borders:** All surfaces should feature a 1px border (`#334155` or similar) to separate them from the background.
- **Shadows:** Use a single "Soft Shadow" style for floating elements like dropdowns or active cards. This shadow should be ultra-diffused: `0px 10px 30px rgba(0, 0, 0, 0.5)`.
- **Active State:** Instead of heavy shadows, use a primary-colored outer glow (2px spread, low opacity) to indicate focused or selected states.

## Shapes

The shape language is consistent and modern. 
- **Base Radius:** All primary containers, cards, and input fields must use a **14px** corner radius.
- **Sub-elements:** Smaller elements like tags or buttons should use an 8px radius to maintain a nested visual harmony. 
- **Buttons:** Primary buttons can optionally use a pill-shape for high-contrast action points, though the 14px standard is preferred for consistency with the overall grid.

## Components

### Buttons
- **Primary:** Gradient background (`#7C3AED` to `#A855F7`), white text, no border.
- **Secondary:** Transparent background, 1px border in primary color, primary color text.
- **Ghost:** No background or border, white text; background appears on hover at 10% opacity.

### Cards (Dashboard Style)
- Background: `#111827`. 
- Border: 1px solid `#1E293B`.
- Radius: 14px.
- Internal Padding: 20px.
- Feature: Use a subtle vertical accent line (2px wide) on the left edge to denote "Status" or "Category."

### Input Fields
- Background: `#0B1120`.
- Border: 1px solid `#334155`.
- Focus State: Border color changes to `#7C3AED` with a 2px soft outer glow.

### Chips / Badges
- Used for programming languages or visibility status (Public/Private).
- Styling: Small, uppercase text, 8px radius, subtle background tint based on the language/status color.

### Code Editor Surface
- Background: `#0B1120` (Darker than cards).
- Feature: Line numbers on the left in `#5C6370`.
- Syntax Highlighting: Adhere to the `syntax` tokens defined in the Color section.