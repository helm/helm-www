# Helm v2 to Docusaurus Migration Guide

Automated migration of Helm v2 documentation from the original source repository to Docusaurus versioned documentation format, preserving the familiar v2.helm.sh navigation structure and fixing broken links.

## Key Features

- **Complete Structure Analysis** - Analyzes live v2.helm.sh to capture exact sidebar structure
- **Missing File Integration** - Adds helm commands not present in navigation but available in source
- **Link Path Correction** - Fixes broken internal links using shared href processing utility
- **Image Path Replacement** - Updates all image references to `/img/helm2/` format
- **H2 Heading Removal** - Removes redundant first H2 headings from helm command files
- **Index File Creation** - Generates proper Docusaurus landing page with DocCardList
- **Proper Positioning** - Maintains v2.helm.sh hierarchical organization
- **Fully idempotent** - Safe to re-run multiple times

## Usage

**Simple command:**
```bash
yarn migrate:v2
```

**Manual steps (if needed):**

1. **Run complete migration:**
   ```bash
   node scripts/migrate-v2-docs.js
   ```

2. **Copy images (if not already present):**
   ```bash
   cp -r helm2/docs/images static/img/helm2
   ```

The migration command handles all steps automatically including:
- Cloning helm2 source repository
- Generating navigation structure
- Processing and copying files
- Applying link path corrections

## What It Does

The migration process includes:

1. **Fresh Start**: Clears existing v2 documentation and helm2 source
2. **Source Setup**: Clones Helm v2 repository (release-2.17 branch)
3. **Structure Analysis**: `scripts/v2/menu-generate.js` fetches and analyzes complete v2.helm.sh sidebar structure
4. **Content Processing**: `scripts/v2/copy-files.js` processes all files:
   - Removes UTF-8 BOM characters
   - Replaces image paths from `(images/` to `(/img/helm2/`
   - Removes first H2 headings from helm command files
   - Creates proper Docusaurus frontmatter with hierarchical positioning
   - Adds missing helm commands (helm get notes, helm inspect readme)
5. **Link Correction**: `scripts/util/href-diffs-process.js` fixes broken internal links using `scripts/v2/href-diffs.json`
6. **Structure Creation**: Generates `versioned_docs/version-2/` with proper category organization
7. **Index Generation**: Creates `index.mdx` landing page with DocCardList component

## Output Structure

```
versioned_docs/version-2/     # Complete Docusaurus v2 docs
├── index.mdx                 # Landing page (position 1)
├── using_helm/               # Basic usage (position 2)
├── helm/                     # CLI reference (position 3, 45 commands)
├── developing_charts/        # Chart development (position 4)
├── chart_template_guide/     # Template guides (position 5)
├── chart_best_practices/     # Best practices (position 6)
└── [5 top-level files]       # architecture, developers, etc. (positions 7-11)

static/img/helm2/             # All migrated images
```

## Validation & Maintenance

**Verify after running:**
- Navigation matches v2.helm.sh structure with correct positioning (1,2,3,4,5,6,7-11)
- All images display correctly (`/img/helm2/` paths)
- Index files use parent category labels in sidebar
- First H2 headings removed from all helm command files
- Netlify redirects handle v2 → v3 category mapping

**Key paths:**
- Migration orchestrator: `scripts/migrate-v2-docs.js`
- Component scripts: `scripts/v2/menu-generate.js`, `scripts/v2/copy-files.js`
- Link correction: `scripts/util/href-diffs-process.js` with `scripts/v2/href-diffs.json`
- Generated data: `scripts/v2/menu.json`
- Source: `helm2/docs/` (auto-cloned)
- Output: `versioned_docs/version-2/` and `static/img/helm2/`

The migration is fully automated and idempotent - safe to re-run multiple times.

**Link path corrections:** Managed via `scripts/v2/href-diffs.json` - add entries here to fix additional broken links discovered in migrated content.
