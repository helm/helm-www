# Helm v2 to Docusaurus Conversion Guide

Automated conversion of Helm v2 documentation from the original source repository to Docusaurus versioned documentation format, preserving the familiar v2.helm.sh navigation structure.

## Key Features

- **Complete Structure Analysis** - Analyzes live v2.helm.sh to capture exact sidebar structure
- **Image Path Replacement** - Updates all image references to `/img/helm2/` format
- **H2 Heading Removal** - Removes redundant first H2 headings from helm command files
- **Index File Creation** - Generates proper Docusaurus landing page with DocCardList
- **Proper Positioning** - Maintains v2.helm.sh hierarchical organization
- **Fully idempotent** - Safe to re-run multiple times

## Usage

1. **Setup source repository:**
   ```bash
   git clone --single-branch --branch release-2.17 git@github.com:helm/helm.git helm2
   ```

2. **Generate menu structure:**
   ```bash
   node scripts/v2-menu-generate.js
   ```

3. **Copy all files:**
   ```bash
   node scripts/v2-copy-files.js
   ```

4. **Copy images:**
   ```bash
   cp -r helm2/docs/images static/img/helm2
   ```

## What It Does

The conversion process includes:

1. **Structure Analysis**: `v2-menu-generate.js` fetches and analyzes the complete v2.helm.sh sidebar structure using WebFetch
2. **Content Processing**: `v2-copy-files.js` processes all files:
   - Removes UTF-8 BOM characters
   - Replaces image paths from `(images/` to `(/img/helm2/`
   - Removes first H2 headings from helm command files
   - Creates proper Docusaurus frontmatter with hierarchical positioning
3. **Structure Creation**: Generates `versioned_docs/version-2/` with proper category organization
4. **Index Generation**: Creates `index.mdx` landing page with DocCardList component
5. **Image Migration**: Manual copy of images to `static/img/helm2/` directory

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
- Scripts: `scripts/v2-menu-generate.js` and `scripts/v2-copy-files.js`
- Generated data: `scripts/v2-menu.json`
- Source: `helm2/docs/` (from cloned repository)
- Output: `versioned_docs/version-2/` and `static/img/helm2/`

The conversion is fully automated and idempotent - safe to re-run multiple times.
