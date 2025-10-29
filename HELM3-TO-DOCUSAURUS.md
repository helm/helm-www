# Helm v3 to Docusaurus Migration Guide

Automated migration of Helm v3 documentation from existing Hugo content to Docusaurus versioned documentation format, applying comprehensive text transformations and link corrections.

## Key Features

- **Hugo to Docusaurus Conversion** - Transforms Hugo content structure to Docusaurus versioning
- **Hugo Shortcode Processing** - Converts `{{< ref "path" >}}` and `{{< highlightexamplego file="path" >}}` to standard links
- **Link Path Correction** - Fixes broken internal links using shared href processing utility
- **Alias Removal** - Removes Hugo aliases that conflict with Docusaurus routing
- **SDK Section Migration** - Imports and processes Go SDK examples with transformations
- **DocCardList Integration** - Adds navigation cards to index pages
- **Netlify Redirect Generation** - Creates redirects for removed aliases
- **Fully idempotent** - Safe to re-run multiple times

## Usage

**Simple command:**
```bash
yarn migrate:v3
```

**Manual steps (if needed):**

1. **Run complete migration:**
   ```bash
   node scripts/migrate-v3-docs.js
   ```

The migration command handles all steps automatically including:
- Fresh start with clean slate
- Moving docs from Hugo structure to Docusaurus versioning
- Processing Hugo shortcodes and text replacements
- Applying link path corrections
- Removing conflicting aliases
- Adding navigation components

## What It Does

The migration process includes:

1. **Fresh Start**: Clears existing v3 documentation and restores from git main
2. **Docusaurus Setup**: Creates `versioned_docs/version-3/` structure
3. **Content Migration**: Moves docs from `content/en/docs/` to versioned structure
4. **Content Cleanup**: Deletes files marked with deprecated frontmatter section
5. **File Renaming**: Converts `index.md` files to `index.mdx` for React component support
6. **Frontmatter Conversion**: Replaces Hugo `weight` with Docusaurus `sidebar_position`
7. **Index Metadata**: Adds proper metadata to main index file
8. **SDK Migration**: `scripts/v3/migrate-sdk-section.js` imports Go SDK examples with transformations
9. **Text Processing**: `scripts/util/util-text-replacements.js` handles:
   - Hugo shortcode conversion (`{{< ref "path" >}}` → `path`)
   - Link path correction using `scripts/v3/href-diffs.json`
10. **Helm File Processing**: `scripts/v3/process-helm-files.js` removes redundant H2 headings and adds metadata
11. **Alias Removal**: `scripts/v3/remove-aliases.js` removes conflicting Hugo aliases
12. **Navigation Enhancement**: `scripts/util/util-migration.js` adds DocCardList components to index pages
13. **Redirect Generation**: `scripts/v3/add-netlify-redirects.js` creates redirects for removed aliases

## Output Structure

```
versioned_docs/version-3/     # Complete Docusaurus v3 docs
├── index.mdx                 # Landing page with DocCardList
├── intro/                    # Introduction section
├── topics/                   # Advanced topics
├── chart_template_guide/     # Template development
├── chart_best_practices/     # Best practices
├── community/                # Community resources
├── helm/                     # CLI reference
└── [other sections]          # Additional documentation areas

netlify.toml                  # Updated with v3 redirects
```

## Validation & Maintenance

**Verify after running:**
- Navigation structure matches expected Docusaurus layout
- Hugo shortcodes converted to standard markdown links
- All `index.mdx` files have proper DocCardList components
- CLI reference files have clean headings (no redundant H2s)
- Netlify redirects handle removed aliases
- No Hugo aliases remain in frontmatter

**Key paths:**
- Migration orchestrator: `scripts/migrate-v3-docs.js`
- Component scripts: `scripts/v3/migrate-sdk-section.js`, `scripts/v3/process-helm-files.js`, `scripts/v3/remove-aliases.js`, `scripts/v3/add-netlify-redirects.js`
- Text processing: `scripts/util/util-text-replacements.js`, `scripts/util/util-migration.js`
- Link correction: `scripts/util/href-diffs-process.js` with `scripts/v3/href-diffs.json`
- Source: `content/en/docs/` (Hugo structure)
- Output: `versioned_docs/version-3/` (Docusaurus structure)

The migration is fully automated and idempotent - safe to re-run multiple times.

**Link path corrections:** Managed via `scripts/v3/href-diffs.json` - add entries here to fix additional broken links discovered in migrated content.

**SDK examples:** The migration includes Go SDK examples from `sdkexamples/` with automatic transformations for Docusaurus compatibility.