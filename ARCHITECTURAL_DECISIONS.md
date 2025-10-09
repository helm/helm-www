# Architectural Decisions - Helm Website

This document explains Helm-specific architectural decisions that help maintain the site and guide contributors. For general Docusaurus concepts, see the [official documentation](https://docusaurus.io/docs).

## Homepage Hero Height Management

### Helm-Specific Requirement

The Helm homepage hero needs to fill the full viewport height minus the navbar for a clean presentation.

### Solution

Uses a [Docusaurus client module](https://docusaurus.io/docs/advanced/client#client-modules): `src/client-modules/heroHeightCalculator.js`

**Handles:** Window resize, orientation change, client-side navigation (SPA routing), and development hot reloading

**Why client modules instead of static scripts:** Integrates with Docusaurus build process and avoids file serving issues in different deployment environments.

## Homepage Component Organization

### Helm-Specific Requirement

Split the homepage into focused components so contributors can easily find and edit specific sections.

### Component Structure

```
src/components/
├── HomeHeader/          # Hero section
├── HomeAbout/           # "What is Helm?" section
├── HomeFeatures/        # Feature cards
├── HomeGettingStarted/  # Installation tabs
└── HomeCommunity/       # Community links
```

**Shared CSS modules:** `src/css/home-*.module.css` for common patterns across components.

## Hero Responsive Design

### Helm-Specific Requirement

Hero content must never be hidden behind navbar or waves, especially on mobile landscape or small windows.

### Key Solutions

**Extreme height constraint (< 380px):** Switches to side-by-side layout instead of stacked
**Text scaling:** Uses CSS `clamp()` for smooth scaling while maintaining readability
**Container bounds:** Absolute positioning keeps content above wave animations

See `src/components/HomeHeader/styles.module.css` for implementation details.

## Boat and Wave Animation

### Helm-Specific Requirement

Boat must appear to float on waves across all screen sizes while using minimal space in the hero section.

### Key Solutions

**Scaling:** Uses `max(rem, vw)` for viewport-proportional scaling with minimum readable sizes
**Space efficiency:** Boat can overflow above a compact wave container to maximize hero content space
**Animation sync:** Boat bob animation coordinates with wave heights for consistent floating appearance

See `src/components/Boat/styles.module.css` for implementation.

## CSS Organization

### Helm-Specific Requirement

Homepage styles should only load on homepage, not other pages.

### Solution

Uses [CSS Modules](https://docusaurus.io/docs/styling-layout#css-modules) with strategic sharing:
- `src/css/home-*.module.css` - Shared patterns (sections, cards)
- Component `styles.module.css` - Component-specific styles

**Why this approach:** Only homepage components import homepage CSS, so other pages don't load unnecessary styles.

## Blog and Docs Layout Consistency

### Why This Change Was Made

Blog and docs pages now use identical layout and navigation. This was done by [swizzling Docusaurus theme components](https://docusaurus.io/docs/swizzling) rather than custom CSS.

### Key Files for Maintainers

**Core Components (don't delete):**
```
src/theme/BlogLayout/              # Makes blog look like docs
src/theme/BlogBreadcrumbs/         # "Home → Blog → Post" navigation
src/theme/BlogListBreadcrumbs/     # "Home → Blog" navigation
src/theme/DocBreadcrumbs/          # "Home → Docs → Page" navigation
src/theme/TOCCollapsible/          # Mobile "On this page" menu
```

### Expected Navigation Patterns

- **Blog listing:** Home → Blog
- **Blog post:** Home → Blog → Post Title
- **Docs page:** Home → Docs → Category → Page

### Common Issues

**Blog breadcrumbs broken?** Check `src/theme/BlogBreadcrumbs/index.js`

**Mobile TOC not working?** Verify `src/theme/TOCCollapsible/` and that blog posts use proper headers (##, ###)

**Missing "Docs" in breadcrumbs?** Check `src/theme/DocBreadcrumbs/index.js` has the "Docs" link

**Layout looks wrong?** Don't add custom CSS - edit the React components instead

See [Docusaurus swizzling docs](https://docusaurus.io/docs/swizzling) for how these theme components work.
