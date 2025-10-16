# Helm v2 to Docusaurus Conversion Guide

Automated conversion of Helm v2 documentation from the original source repository to Docusaurus versioned documentation format, preserving the familiar v2.helm.sh navigation structure.

## Key Features

- **Fully idempotent** - Safe to re-run multiple times
- **IDE-compatible links** - Uses actual file paths with .md extensions
- **Automated redirects** - Generates Netlify redirects with start/end markers
- **Complete migration** - Handles docs, images, CLI references, and frontmatter
- **Original structure preserved** - Maintains v2.helm.sh organization and positioning

## Usage

1. **Setup source repository:**
   ```bash
   git clone --single-branch --branch release-2.17 git@github.com:helm/helm.git helm2
   ```

2. **Run conversion:**
   ```bash
   node scripts/helm2-to-docusaurus.js
   ```

## What It Does

The script performs a complete automated conversion:

1. **Content Processing**: Removes UTF-8 BOM, fixes all internal links with proper .md extensions, updates image paths
2. **Structure Creation**: Generates the full `versioned_docs/version-2/` hierarchy matching v2.helm.sh navigation
3. **Frontmatter Generation**: Adds proper `sidebar_position`, `sidebar_label`, and `slug` to all files
4. **Image Migration**: Copies all images to `static/img/helm2/`
5. **Redirect Generation**: Creates Netlify redirects with managed start/end markers (302 status, upgradeable to 301)

## Output Structure

```
versioned_docs/version-2/     # Complete Docusaurus v2 docs
├── index.mdx                 # Auto-generated landing page
├── using-helm/               # Basic usage (position 2)
├── helm/                     # CLI reference (position 3, 46 commands)
├── developing-charts/        # Chart development (position 4)
├── chart-template-guide/     # Template guides (position 5)
├── chart-best-practices/     # Best practices (position 6)
└── [5 top-level files]       # architecture, developers, etc. (positions 101-105)

static/img/helm2/             # All migrated images
```

## Validation & Maintenance

**Verify after running:**
- Navigation matches v2.helm.sh structure with correct positioning (2,3,4,5,6,101-105)
- All images display correctly (`/img/helm2/` paths)
- Internal links use proper .md extensions for IDE compatibility
- Netlify redirects include managed start/end markers with 302 status codes

**Key paths:**
- Script: `scripts/helm2-to-docusaurus.js`
- Source: `helm2/docs/` (from cloned repository)
- Output: `versioned_docs/version-2/` and `static/img/helm2/`

The script is fully idempotent and handles all aspects of the conversion automatically.
