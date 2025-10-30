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

**Date internationalization:** Uses [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for locale-aware date formatting instead of hardcoded strings, automatically adapting to user's language settings.

## Hero Responsive Design

### Helm-Specific Requirement

Hero content must never be hidden behind navbar or waves, especially on mobile landscape or small windows.

### Key Solutions

**Extreme height constraint (< 380px):** Switches to side-by-side layout instead of stacked
**Text scaling:** Uses CSS `clamp()` for smooth scaling while maintaining readability
**Container bounds:** Absolute positioning keeps content above wave animations

See `src/components/HomeHeader/styles.module.css` for implementation details.

## React Hydration Warning Suppression

### Helm-Specific Requirement

The HomeCommunity component displays event dates using locale-specific formatting, which causes unavoidable hydration mismatches between server and client rendering.

### Solution

Following [React's official guidance for suppressing unavoidable hydration mismatches](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors), we use `suppressHydrationWarning` on date-displaying `<span>` elements in `src/components/HomeCommunity/index.js`.

**Why this happens:** The server renders dates using one locale during static generation, but the client may have a different locale, causing React error #418 (text content mismatch). Since dates are intentionally locale-aware for internationalization, this mismatch is expected and acceptable.

**Implementation:** Added `suppressHydrationWarning` prop to both date range and single date `<span>` elements in the CustomDate component.

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

## Markdown Links

This section provides guidance for working with markdown links in the Helm docs site.

### Absolute paths required

Absolute paths are required for all links. Absolute paths are more verbose but necessary to avoid broken links in our multi-locale site due to the following Docusaurus i18n bug: [facebook/docusaurus#10907](https://github.com/facebook/docusaurus/issues/10907).

The sections below include more information about how and when to use absolute file paths or URL paths.

#### Linking within docs or blogs

When linking from one doc page to another or from one blog post to another, use the _absolute file path_:
   
* Exclude `/blog/` or `/docs/` from the path
* Start the path from the directory within `/blogs` (eg `/2024-10-07-kubecon-na-24/`), or from the version-specific docs folder (eg, `/topics/`, `/chart_template_guide/`, `/helm/`)
* Include the `.md` or `.mdx` file extension

Examples:

```markdown
✅ GOOD (doc to doc link): [Advanced Topics](/topics/advanced.md)
✅ GOOD (blog to blog link): [Helm at KubeCon/CloudNativeCon SLC](/2024-10-07-kubecon-na-24/index.md)
❌ AVOID (relative file path): [Advanced Topics](../topics/advanced.md)
❌ AVOID (relative file path): [Advanced Topics](advanced.md)
❌ AVOID (adding /docs): [Advanced Topics](/docs/topics/advanced.md)
❌ AVOID (absolute URL path, no .md/.mdx): [Advanced Topics](/docs/topics/advanced)
```

#### Linking across docs and blogs

When linking to a doc from a blog, or from a blog to a doc, use the _absolute URL path_:
   
* Include `/blog/` or `/docs/`
* Exclude the `.md` or `.mdx` file extension
* If the doc or blog has a `slug` defined in its front matter, use the slug in the URL path instead of the filename

Examples:

```markdown
✅ GOOD (file name without .md extension when no slug is in front matter): [See this blog post](/blog/2024-01-01-title)
✅ GOOD (when slug is in front matter): [See this blog post](/blog/my-slug)
❌ AVOID (don't use the file extension):  [Advanced Topics](/docs/topics/advanced.md)
```

### Anchor links to headings

Anchor links are challenging in multi-locale sites because anchor IDs are automatically generated from the heading text. This means that any links that point to English language anchor IDs will break in other locales if the given heading is translated to a different language. 

For example:

```markdown
English: ## Storage backends  → #storage-backends
Chinese: ## 后端存储         → #后端存储 (different anchor ID)
```

To avoid broken anchor links, add explicit IDs to headings in all translations. For example:

```markdown
## Storage backends {#storage-backends}
## 后端存储 {#storage-backends}
```

In this case, anchor links to the given ID will work across all locales since the anchor ID itself remains the same in all translations.

### Troubleshoot broken links

You can run a local build to check for broken links (`yarn build`). If there are broken links, you'll see an error like this in the build output:

```bash
Broken link on source page path = /docs/faq/changes_since_helm2
   -> linking to /topics/charts.md
```

To troubleshoot, go to the _source page_ listed in the error message. Note that the source page with the broken link might be in the English docs, even if the broken link was triggered for a different locale.

## Netlify Redirects Strategy

### Hugo to Docusaurus Migration Requirements

During the migration from Hugo to Docusaurus, several legacy URL patterns needed to be preserved to avoid breaking existing links and integrations.

### Redirect Processing Order

[Netlify processes redirects from top to bottom](https://docs.netlify.com/routing/redirects/redirect-options/), with the **first matching rule taking precedence**. This means **more specific patterns must come before general ones**.

### Go Module Import Support

Hugo served Go module import pages at `/helm/`, `/helm/v2/`, `/helm/v3/`, `/helm/v4/`, `/chartmuseum/` using a `content/en/code/` directory with metadata files processed by `themes/helm/layouts/code/single.html`.

### Docusaurus Implementation

Docusaurus replicates this functionality using static HTML files in `/static/`:

- `/static/helm/index.html`
- `/static/helm/v2/index.html`
- `/static/helm/v3/index.html`
- `/static/helm/v4/index.html`
- `/static/chartmuseum/index.html`

Each file provides:
1. **Go import meta tags**: `<meta name="go-import" content="...">` for Go module proxy
2. **Go source meta tags**: `<meta name="go-source" content="...">` for source code navigation
3. **Client-side redirect**: `<meta http-equiv="refresh">` for browser users
4. **Fallback link**: HTML body with link to GitHub repository

### Go Package Import Compatibility

Internal redirects handle Go module proxy requests:

```toml
[[redirects]]
  from = "/helm/v3/*"
  to = "/helm/v3"
  status = 200

[[redirects]]
  from = "/helm/v2/*"
  to = "/helm/v2"
  status = 200
```

### Helm v2 Documentation Redirects

Legacy Helm v2 documentation from `https://v2.helm.sh/docs/*` redirects to the new combined site at `/docs/2/*`. These redirects:

1. **URL format changes**: Map old underscore URLs to new dash URLs (e.g., `using_helm/` → `using-helm/`)
2. **Category-level only**: Target section landing pages (fragments not supported by Netlify)
3. **Temporary status**: Use 302 status during migration phase for easy rollback if issues discovered
4. **Script-managed**: Generated by `scripts/helm2-to-docusaurus.js` for consistency

```toml
# TODO: Change status codes from 302 to 301 after cutover verification
[[redirects]]
  from = "https://v2.helm.sh/docs/using_helm/"
  to = "/docs/2/using-helm/"
  status = 302
```

### Status Code Strategy

- **302 (temporary)** during testing/migration phase - allows easy rollback if issues are discovered
- **301 (permanent)** after Docusaurus site cutover is verified - provides SEO benefits and signals permanent move

This follows [Netlify's best practices](https://docs.netlify.com/routing/redirects/redirect-options/#http-status-codes) for safe migrations.

## Documentation Migration Automation

### Helm-Specific Requirement

Migrating legacy Helm documentation (v2 from Hugo, v3 from existing content) to Docusaurus while preserving URLs and fixing broken links.

### Solution

**Migration Orchestrators:** `scripts/migrate-v2-docs.js` and `scripts/migrate-v3-docs.js` with corresponding `yarn migrate:v2` and `yarn migrate:v3` commands.

**Modular Architecture:** Scripts organized in `scripts/util/`, `scripts/v2/`, `scripts/v3/` directories following UNIX philosophy - each script has a single purpose and can be composed together.

**Key Features:**
- **Fresh start capability:** Each migration clears and rebuilds from source
- **Menu generation:** Extracts navigation structure from live Helm v2 site
- **Link path correction:** Shared `scripts/util/href-diffs-process.js` applies version-specific link fixes from JSON configuration files
- **Missing file handling:** Adds helm commands not present in original navigation but available in source

**Why this approach:** Enables repeatable, testable migrations while maintaining URL compatibility and fixing legacy Hugo-to-Docusaurus link issues.

**For contributors:** Run `yarn migrate:v2` or `yarn migrate:v3` to regenerate versioned documentation. Link fixes are managed via JSON files in each version directory.

**Detailed operational guides:**
- [HELM2-TO-DOCUSAURUS.md](./HELM2-TO-DOCUSAURUS.md) - v2 migration procedures
- [HELM3-TO-DOCUSAURUS.md](./HELM3-TO-DOCUSAURUS.md) - v3 migration procedures

## Hugo Legacy Files Cleanup

### Files to Remove Post-Migration

Once the Docusaurus migration is complete and verified, these Hugo-specific files should be removed:

- **`config.toml`** - Hugo configuration file, replaced by `docusaurus.config.js`
- **`themes/` directory** - Hugo theme files, replaced by Docusaurus theme components
- **`content/en/code/` directory** - Hugo code metadata files, functionality replaced by Netlify redirects

### Migration Strategy

Keep these files during the migration phase to:
1. Reference Hugo configuration when setting up Docusaurus equivalents
2. Understand legacy URL patterns for redirect configuration
3. Maintain ability to rollback if needed during testing

Remove them only after:
1. Docusaurus site cutover is verified
2. All redirects are tested and working
3. No rollback scenarios require Hugo functionality

## Netlify Build Caching

### Problem
Docusaurus builds take ~11 minutes. Need faster builds for development workflow.

### Solution
Custom Netlify plugins cache `.docusaurus/`, `node_modules/`, and `build/` directories.

**Current:** `cache-docusaurus-dirs-file` (stable, 2-4 minute builds)
**Future:** `cache-docusaurus-dirs-api` (beta, potentially 10x faster)

### Build Pipeline Changes
Changed from `make build` (runs destructive `clean`) to `make netlify-build` (preserves cache).

### Cache Strategy
- **Production/branches:** Isolated per branch
- **PR previews:** Shared across PRs via `CACHE_PER_BRANCH=false`
- **Auto-invalidation:** `yarn.lock` changes, `CACHE_VERSION` environment variable

See `netlify-plugins/README.md` for configuration details.
