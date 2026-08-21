---
name: Computer Programmer Department Website
description: Modern, approachable design reflecting the real student journey through learning, projects, internships, and career paths
colors:
  navy: "#243B6B"
  blue: "#3B5FA8"
  yellow: "#EABF3A"
  neutral-bg: "#F7F8FC"
  surface: "#FFFFFF"
  text: "#172033"
  muted: "#667085"
  border: "#E4E7EC"
  blue-soft: "#EEF3FB"
  blue-border: "#D7E1F3"
  focus-ring: "rgba(234, 191, 58, 0.42)"
  navbar-bg: "#35518E"
typography:
  display:
    fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 2
  label:
    fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.12em"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section-vertical: "56px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.surface}"
    padding: "12px 24px"
    rounded: "{rounded.xl}"
  button-primary-hover:
    backgroundColor: "{colors.blue}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.navy}"
    padding: "12px 24px"
    rounded: "{rounded.xl}"
  button-secondary-hover:
    textColor: "{colors.blue}"
  tag-pill:
    backgroundColor: "{colors.blue-soft}"
    textColor: "{colors.navy}"
    padding: "6px 14px"
    rounded: "{rounded.full}"
  surface-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "24px"
  navbar-link:
    textColor: "#FFFFFF"
    padding: "10px 14px"
    rounded: "{rounded.lg}"
---

# Design System: Computer Programmer Department Website

## Overview

**Creative North Star: "The Student-Built Journey"**

This design system captures a modern, approachable visual language centered on the authentic journey of Computer Programming students—from foundational learning through project work, internships, and career pathways. The design feels crafted and expressive enough to celebrate the creative and technical nature of the program, while remaining clear, trustworthy, and accessible to both prospective students and parents.

Rather than feeling overly formal or promotional, the visual identity is polished and thoughtful, letting real student work and experiences speak for themselves. The aesthetic combines energetic modern interactions with calm, clear layouts that prioritize comprehension alongside inspiration.

**Key Characteristics:**
- Modern and purposeful, avoiding generic or template-driven presentation
- Energetic enough to excite prospective students about possibilities
- Calm and trustworthy for parent audiences
- Polished rather than playful; authentic rather than promotional
- Responsive and intentional across all screen sizes
- Subtle motion and depth that support content storytelling rather than distract

## Colors

The palette balances authority with approachability. **Navy** grounds the system with confidence and trust, while **blue** softens and opens the visual language. **Yellow** acts as a strategic accent, creating focal points and marking progress. **Neutrals** provide breathing room and readability across all content.

**Primary Colors:**
- **Navy** (#243B6B): Deep, authoritative, builds trust. Used for primary text, buttons, and navbar.
- **Blue** (#3B5FA8): Accessible, welcoming, used for hover states and secondary emphasis.
- **Yellow** (#EABF3A): Energetic, optimistic accent. Marks keypoints, navigation progress, and decorative elements.

**Neutral System:**
- **Surface** (#FFFFFF): Content background, card foundations, highest contrast.
- **Neutral BG** (#F7F8FC): Subtle section backgrounds, maintains visual rest.
- **Text** (#172033): Primary text color, highest legibility.
- **Muted** (#667085): Secondary/body text, de-emphasized content.
- **Border** (#E4E7EC): Subtle dividing lines, card edges, low contrast.
- **Blue Soft** (#EEF3FB): Light tint background for tag pills and highlights.
- **Blue Border** (#D7E1F3): Medium-contrast borders and dividers, softer than neutral border.

**Functional Colors:**
- **Focus Ring** (rgba(234, 191, 58, 0.42)): Yellow-tinted focus state for keyboard navigation, visible but not jarring.
- **Navbar Background** (#35518E): Darker blue for navigation context, paired with white text.

## Typography

The type system uses two primary fonts to honor the bilingual nature of the site: **Plus Jakarta Sans** for English and modern UI elements, paired with **Noto Sans Thai** for Thai-language content. Both are clean, open, and highly readable at all sizes.

**Scale & Hierarchy:**

| Role | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display | clamp(1.75rem, 5vw, 3.25rem) | 700 | 1.25 | Hero headings, major section titles |
| Headline | clamp(1.5rem, 4vw, 3rem) | 700 | 1.25 | Section titles, featured content |
| Title | clamp(1.5rem, 3vw, 2rem) | 700 | 1.25 | Subsection headers, card titles |
| Body | 1rem | 400 | 2 | Paragraph text, descriptions |
| Label | 0.75rem | 700 | 1.5 | Eyebrows, tags, metadata, uppercase |

**Type Details:**
- All headings use `font-weight: 700` for confident presence.
- Body text uses 2x line height (2rem) for comfortable reading, especially on mobile.
- Label text is uppercase with 0.12em letter spacing for distinction and hierarchy.
- Responsive scaling uses `clamp()` to scale fluidly between mobile and desktop without jarring breakpoint shifts.

## Layout

The layout system balances generous breathing room with accessible density. Content flows in a mobile-first, single-column rhythm that expands responsibly on larger screens.

**Container & Spacing:**
- **Max Content Width**: 1280px, centered with symmetric padding.
- **Horizontal Padding**: 20px (mobile) → 24px (sm) → 32px (md) → 40px (lg) → 48px (xl)
- **Section Vertical Padding**: 56px (mobile) → 64px (sm) → 80px (md) → 96px (lg)
- **Section Scroll Gap**: 28px offset for navigation anchoring.

**Responsive Grid System:**
- **Mobile (< 640px)**: Single column, stacked content.
- **Small (≥ 640px)**: Two-column grid when appropriate, increased gaps.
- **Medium (≥ 768px)**: Three-column capability, more aggressive horizontal spacing.
- **Large (≥ 1024px)**: Full-width layout with generous internal spacing, expressive asymmetrical grids.
- **XL (≥ 1280px)**: Maximum visual luxury with optimal reading widths and breathing room.

**Spacing Rhythm:**
- Gap increments: 24px (sm), 32px (md), 40px (lg), 56px (xl) between major sections.
- Internal card padding: 24px base, scales responsively.
- List items and repeated elements: 12px vertical spacing on mobile, 16px+ on desktop.

## Elevation & Depth

The system uses **restrained, tonal layering** rather than aggressive shadows. Depth is suggested through subtle shadow and vertical positioning, supporting a refined aesthetic without visual heaviness.

**Shadow Vocabulary:**
- **Card Elevation**: `0 16px 40px rgba(23, 32, 51, 0.06)` — Gentle depth for surface cards, suggests elevation without drama.
- **Card Hover**: `0 20px 48px rgba(36, 59, 107, 0.10)` — Slightly larger shadow on interaction, reinforcing lift.
- **Button Shadow**: `0 12px 24px rgba(36, 59, 107, 0.18)` — Medium depth for primary action buttons.
- **Button Hover Shadow**: `0 16px 30px rgba(59, 95, 168, 0.20)` — Increased depth on hover, paired with subtle vertical lift.
- **Placeholder Shadow**: `0 16px 40px rgba(23, 32, 51, 0.05)` — Minimal, almost flat treatment for content placeholders.

**Depth Behavior:**
- Shadows are cool-tinted (blue-gray) to harmonize with the color system.
- Hover states amplify shadow slightly and lift elements -0.5 scale units (2px).
- No stacked or layered shadows; each component uses a single, purposeful shadow.

## Shapes

The design favors **rounded corners** as the primary form language, creating warmth and approachability while maintaining clarity.

**Radius Scale:**
- **xs (4px)**: Minimal rounding, applied to small details.
- **sm (8px)**: Fine details, icon backgrounds, focus rings.
- **md (12px)**: Medium components, secondary surfaces.
- **lg (16px)**: Navigation links, tags, pill-shaped elements.
- **xl (16px)**: Primary surfaces (cards), buttons, media containers.
- **full (9999px)**: Pill-shaped badges, eyebrows, circular elements.

**Form Language:**
- Buttons and interactive elements use consistent **rounded-xl** (16px) for unified gesture.
- Cards and content containers use **rounded-2xl** (16px) for premium, approachable surfaces.
- Tags and badges scale from pill to rounded-full depending on content density.
- Images and media use **rounded-2xl** to align with card language.

## Components

### Navigation

**Navbar (`.department-navbar`)**
- Background: #35518E (darker blue for authority)
- Backdrop: `blur(14px) saturate(135%)` for frosted-glass effect
- Height: 72px (mobile) → 76px (md) → 80px (lg)
- Supports sticky positioning with scroll offset compensation

**Navigation Link (`.nav-link`)**
- Padding: 10px 14px (sm: 16px)
- Rounded: 12px
- Text: white, 14px bold, semibold
- Hover: white text with 12% white background overlay
- Active state: animated underline bar (yellow), 4px width, scales in on activation
- Focus: 4px yellow-tinted ring

### Buttons

**Primary Button (`.btn-primary`)**
- Background: Navy → Blue on hover
- Text: White
- Padding: 12px 24px (sm: 16px 28px)
- Min Height: 48px
- Rounded: 16px
- Shadow: `0 12px 24px rgba(36, 59, 107, 0.18)`
- Hover: lifts -2px, shadow increases, background shifts to blue
- Focus: 4px yellow ring with 0.42 alpha
- Transition: 200ms ease-out

**Secondary Button (`.btn-secondary`)**
- Background: Surface (white)
- Border: Navy, 1px
- Text: Navy → Blue on hover
- Padding: 12px 24px (sm: 16px 28px)
- Min Height: 48px
- Rounded: 16px
- Shadow: subtle on hover only
- Hover: lifts -2px, border shifts to blue, text shifts to blue
- Focus: 4px yellow ring
- Transition: 200ms ease-out

### Cards

**Surface Card (`.surface-card`)**
- Background: White
- Border: 1px neutral-border
- Rounded: 16px
- Padding: 24px
- Shadow: `0 16px 40px rgba(23, 32, 51, 0.06)`
- Hover variant: lifts -2px, shadow increases, border shifts to blue-border
- Transition: 200ms ease-out

### Tags & Badges

**Tag Pill (`.tag-pill`)**
- Background: blue-soft
- Text: Navy, 700 weight, 12px
- Padding: 6px 14px (md: 14px 16px)
- Rounded: 9999px (full circle)
- Border: 1px blue-border
- Use: technology lists, category markers, metadata

**Accent Icon (`.accent-icon`)**
- Size: 44px square
- Background: blue-soft
- Border: 1px blue-border, 12px radius
- Content: Navy, 14px extrabold
- Variant: rounded-full (circular) for ordered lists
- Use: numbered feature lists, visual anchors

### Content Containers

**Media Placeholder (`.media-placeholder`)**
- Aspect Ratio: 16/11 (landscape, readable on mobile)
- Border: 1px neutral-border, 16px radius
- Background: white with subtle shadow
- Inner dashed border: blue-border, 16px inner radius
- Accent mark: yellow rectangle top-right, 12px × 64px
- Shadow: `0 16px 40px rgba(23, 32, 51, 0.05)` (minimal)

### Eyebrows & Labels

**Eyebrow (`.eyebrow`)**
- Text: Navy, 12px bold, uppercase, 0.12em tracking
- Padding: 6px 14px
- Rounded: 9999px
- Border: 1px blue-border
- Background: blue-soft
- Prefix dot: yellow, 8px circle
- Use: section precursor labels, marking new ideas

## Do's and Don'ts

**Do:**
- Use navy for primary text and actions; blue for secondary emphasis.
- Pair blue-soft backgrounds with navy text for soft, readable highlights.
- Apply 200ms ease-out transitions to all interactive elements.
- Use hover lift (-2px) and enhanced shadow together for consistent feedback.
- Keep shadow subtle; a single shadow layer per component.
- Respect the spacing rhythm; gaps between sections should scale proportionally.
- Use rounded corners consistently—aim for 12–16px on most interactive elements.
- Test navigation and buttons on keyboard; yellow focus ring must be visible and intentional.
- Scale typography fluidly with `clamp()` to avoid jarring breakpoint changes.

**Don't:**
- Combine multiple button styles in close proximity without clear visual hierarchy.
- Use yellow background for large content areas; reserve it for accents and focal points.
- Apply stacked or multiple shadows to a single element.
- Reduce border-radius below 12px on interactive components; maintain warmth and approachability.
- Animate elements that are not interactive; motion should communicate feedback, not distraction.
- Override the focus ring color; the yellow tint is intentional and accessible.
- Introduce new colors outside the defined palette; maintain tonal cohesion.
- Use harsh shadows or high-contrast elevations; the system favors subtlety and refinement.
- Forget to test responsive behavior; layouts must work elegantly at all breakpoints.
- Overload a section with competing visual weights; let hierarchy guide scanning.
