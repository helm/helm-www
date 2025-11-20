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

## CLI Documentation Generation Script

### Helm-Specific Requirement

Regenerate Helm CLI documentation for each release with consistent formatting and Docusaurus-compatible structure.

### Solution

Uses an ESM Node.js script: `scripts/regenerate-cli-docs.mjs`

**Why ESM over CommonJS:** Modern package compatibility (ora, p-limit) and consistency with future Node.js direction while maintaining parallel processing capabilities for performance.

**Post-processing steps:** Automatically handles Docusaurus requirements like converting links to absolute paths, cleaning frontmatter, and creating proper index files - tasks that would be error-prone if done manually for each release.

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

## Community Documentation Import

### Helm-Specific Requirement

The Helm project maintains community governance documents in a [separate repository](https://github.com/helm/community) that need to be included in the website as an unversioned documentation section with proper Docusaurus integration.

### Solution

Uses [docusaurus-plugin-remote-content](https://github.com/rdilweb/docusaurus-plugin-remote-content) to import and transform content at build time.

**Architecture:**
- **Multi-instance docs:** Community docs are a separate Docusaurus docs plugin instance with `id: "community"`, creating `/community/*` URLs
- **Content transformation:** Custom functions in `src/utils/communityDocsTransforms.js` handle all content processing
- **Configuration:** Centralized in `docusaurus.config.js` under `customFields.communityDocs`
- **Files committed to Git:** Imported files are tracked in version control to maintain clean git status and avoid complex .gitignore management
- **Build settings:** Uses `performCleanup: false` to prevent file deletion during i18n builds (workaround for [plugin issue #98](https://github.com/rdilweb/docusaurus-plugin-remote-content/issues/98))

### Content Transformation Features

**Import notice headers:** Every imported file gets a warning header indicating it shouldn't be edited directly, with a link to the source file in the helm/community repository.

**HIP (Helm Improvement Proposal) formatting:** HIP documents get special treatment:
- Metadata fields (hip, authors, created, status, etc.) displayed as a markdown table
- Sidebar labels include HIP number for easy navigation (e.g., "0023: Utilize Server Side Apply")
- Frontmatter cleaned to remove duplicate metadata

**Plain text file handling:** `.txt` files (like meeting notes) are automatically:
- Converted to `.md` files during import
- Title extracted from content headers
- Content wrapped in code blocks to preserve formatting

**Link transformations:** Only applied for configured exceptions - most links work as-is since the file structure mirrors the source repository.

### Why imported files are committed to Git

The `/community` directory mixes imported files from helm/community with locally-maintained community docs. Committing imported files to Git:

1. **Avoids complex .gitignore patterns** - No need to maintain a parallel list of which specific files to ignore
2. **Provides clean git status** - Contributors don't see dozens of untracked files during development
3. **Enables offline development** - With `noRuntimeDownloads: true`, `yarn start` works without network access
4. **Simplifies mental model** - All files in `/community` are tracked, regardless of source

The tradeoff of content duplication is acceptable since these files rarely change structure and the import notices clearly indicate they shouldn't be edited locally.

### Commands

- `yarn download-remote-community` - Fetch and transform latest content from helm/community repository
- `yarn clear-remote-community` - Remove imported files (useful for testing)

### Automated Updates

A GitHub Action (`.github/workflows/update-community-docs.yml`) runs weekly to:
1. Check for updates in helm/community repository
2. Apply transformations and import changes
3. Create or update a PR if there are changes
4. Skip if an identical PR already exists

The workflow can also be triggered manually through GitHub Actions UI.

### For Contributors

To add new community documents:
1. Add entry to `customFields.communityDocs.remoteDocs` in `docusaurus.config.js`
2. Include optional `meta` field for frontmatter overrides
3. Add link exceptions only if specific links need custom mapping
4. Run `yarn download-remote-community` to test import locally

To modify transformation logic:
1. Edit `src/utils/communityDocsTransforms.js` for content processing
2. Test changes with `yarn download-remote-community`

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
