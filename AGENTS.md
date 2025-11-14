# AGENTS.md

This file provides guidance to AI coding agents working with the helm.sh website repository.

## Overview

This is the official Helm project website (helm.sh) - a Docusaurus static site serving Helm documentation, blog, and community resources. The site supports multiple languages and versions, and is automatically deployed to Netlify.

### Technology Stack
- Docusaurus (static site generator)
- React (component framework)
- Node.js/Yarn (package management)
- Netlify (hosting and deployment)

## Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build

# Serve production build locally
yarn serve
```

## Repository Structure

### Content Organization
- `docs/` - Current version documentation (unversioned)
- `versioned_docs/version-N/` - Versioned documentation snapshots
- `blog/` - Blog posts and announcements
- `i18n/{lang}/` - Internationalized content for supported languages
- `src/` - React components and custom pages
- `static/` - Static assets (images, files)

### Configuration
- `docusaurus.config.js` - Main Docusaurus configuration
- `sidebars.js` - Documentation sidebar structure
- `versions.json` - Available documentation versions
- `netlify.toml` - Netlify deployment configuration

### Languages
Supported: English (en), German (de), Spanish (es), French (fr), Japanese (ja), Korean (ko), Portuguese (pt), Russian (ru), Ukrainian (uk), Chinese (zh)

## Build and Test Commands

### Development
```bash
# Start dev server (usually port 3000)
yarn start

# Start with specific locale
yarn start --locale ko

# Clear cache if needed
yarn clear
```

### Production Build
```bash
# Build all locales
yarn build

# Build specific locale
yarn build --locale en

# Build without minification (faster for testing)
yarn build --no-minify
```

### Quality Checks
```bash
# Type checking (if TypeScript is added)
yarn typecheck

# Link checking
make check-links-ci

# Spell checking
typos
```

## Architectural Documentation

This codebase includes an `ARCHITECTURAL_DECISIONS.md` document that explains key architectural decisions made during the Docusaurus implementation. When implementing new features or making significant changes:

1. **Document architectural decisions** in `ARCHITECTURAL_DECISIONS.md` with clear reasoning
2. **Include requirements** that drove the decision
3. **Link to relevant Docusaurus documentation** when applicable
4. **Keep explanations concise** but comprehensive enough for future contributors

This helps maintain consistency and guides future development decisions.

### Writing Guidelines for ARCHITECTURAL_DECISIONS.md

When updating architectural decisions:
- **Describe current state** - Document what exists now, not proposals or ideas
- **Keep it concise** - One paragraph per topic, link to external docs instead of repeating them
- **Focus on the "why"** - Explain decisions that aren't obvious from the code
- **Help contributors** - Write for developers who need to understand the codebase quickly
- **Avoid duplication** - Link to Docusaurus docs rather than explaining Docusaurus features

Example: Don't explain what CSS modules are, but DO explain why we chose them over other styling approaches for this specific project.

## Content Management

### Documentation

#### Adding/Editing Docs
1. Edit files in `docs/` for current version
2. For versioned docs, edit in `versioned_docs/version-N/`
3. Frontmatter format:
```yaml
---
title: "Page Title"
sidebar_label: "Short Label"
sidebar_position: 1
---
```

#### Creating New Versions
```bash
# Create new version snapshot
yarn docusaurus docs:version 3.18.0
```
This creates:
- `versioned_docs/version-3.18.0/` - Snapshot of current docs
- `versioned_sidebars/version-3.18.0-sidebars.json` - Sidebar config
- Updates `versions.json`

#### CLI Reference Documentation
Located in `docs/helm/` (and versioned equivalents). To update:
1. Uninstall all helm plugins: `helm plugin uninstall`
2. Navigate to appropriate docs directory
3. Run: `HOME='~' helm docs --type markdown --generate-headers`
4. Commit changes

### Blog Posts

Create in `blog/` directory with naming: `YYYY-MM-DD-slug/index.md`

Frontmatter format:
```yaml
---
title: "Post Title"
authors:
  - name: Author Name
    url: https://author.link
tags: [tag1, tag2]
---

Post summary appears here.

<!--truncate-->

Full post content here.
```

Images go in the same directory as the blog post or in `blog/assets/`.

### Internationalization

#### Adding Translations
1. Extract strings: `yarn write-translations --locale ko`
2. Translate files in `i18n/{locale}/`
3. Content structure:
   - `i18n/{locale}/docusaurus-plugin-content-docs/` - Docs translations
   - `i18n/{locale}/docusaurus-plugin-content-blog/` - Blog translations
   - `i18n/{locale}/code.json` - UI strings

#### Translation Guidelines
- Maintain consistent terminology across versions
- Test with `yarn start --locale {locale}`
- Ensure all navigation and UI elements are translated

## Code Style and Conventions

### Markdown
- Use semantic line breaks (one sentence per line preferred for diffs)
- Code blocks should specify language: ```yaml, ```bash, ```go
- Use relative links for internal pages: `[text](../path/to/page.md)`
- Images: `![alt text](./image.png)` or from static: `![alt text](/img/image.png)`

### Frontmatter Standards
- Required: `title`
- Recommended: `sidebar_label`, `sidebar_position`, `description`
- Blog posts: Use `authors` array, not `author` string

### Component Usage
- Use Docusaurus components when available: `<Tabs>`, `<TabItem>`, `<Admonition>`
- Custom components in `src/components/`
- Import at top of MDX files: `import ComponentName from '@site/src/components/ComponentName'`

### File Naming
- Docs: Use descriptive names, lowercase with hyphens: `getting-started.md`
- Blog: Date prefix required: `YYYY-MM-DD-title/index.md`
- Assets: Descriptive names, avoid spaces

## Deployment

### Netlify Configuration
- **Build command**: `yarn install && make build`
- **Publish directory**: `build`
- **Node version**: Specified in `netlify.toml`
- **Auto-deploys**: From `main` branch
- **Preview deploys**: Automatic for PRs

### Build Process
1. Netlify clones repository
2. Installs dependencies with yarn
3. Runs `make build` which executes `yarn build`
4. Deploys `build/` directory contents
5. Runs post-build plugins (link checking, etc.)

### Environment Considerations
- Build timeout: 15 minutes
- Memory: Standard Netlify build environment
- Cache: `node_modules/` and `.docusaurus/` cached between builds

## Contributing Guidelines

### Requirements
- **Signed commits**: All commits must include DCO sign-off (`git commit -s`)
- **PR approval**: Requires maintainer review
- **Testing**: Build locally before submitting PR

### Workflow
1. Fork repository and create feature branch from `main`
2. Make changes following existing patterns
3. Test locally: `yarn build && yarn serve`
4. Commit with sign-off: `git commit -s -m "description"`
5. Submit PR with clear description
6. Address review feedback

### Commit Messages
- Use conventional commits format when possible
- Be descriptive but concise
- Reference issues: `fixes #123` or `relates to #456`
- Sign all commits with `-s` flag

### Content Approval Process
- **Documentation**: Any maintainer can approve
- **Blog posts**: Require core maintainer approval
- **Configuration changes**: Require thorough review and testing

## Common Tasks

### Updating Helm Version References
1. Update `docusaurus.config.js` - Search for version strings
2. Update relevant documentation pages
3. Consider creating new version snapshot if major release
4. Update `versions.json` if needed

### Adding New Documentation Section
1. Create directory in `docs/`
2. Add index page: `docs/new-section/index.md`
3. Update `sidebars.js` to include new section
4. Add translations to `i18n/{locale}/` directories

### Fixing Broken Links
1. Run link checker: `make check-links-ci`
2. Review output for broken links
3. Fix links in source files
4. Verify in both current and versioned docs if applicable

### Migration from Hugo
If encountering Hugo-specific syntax or structure:
- Hugo shortcodes -> Docusaurus components or MDX
- Hugo frontmatter -> Docusaurus frontmatter (mostly compatible)
- Hugo content organization -> Docusaurus docs structure
- See `HELM2-TO-DOCUSAURUS.md` and `HELM3-TO-DOCUSAURUS.md` for migration details

## Security Considerations

### Content Security
- Never commit secrets or credentials
- Be cautious with external links and embeds
- Validate all user-contributed content
- Use HTTPS for all external resources

### Build Security
- Dependencies audited via Dependabot
- Use exact versions in `package.json` where security-critical
- Review dependency updates before merging

### Deployment Security
- Netlify handles HTTPS/SSL certificates
- No server-side code execution (static site)
- Environment variables kept in Netlify dashboard, not in repo

## Troubleshooting

### Common Issues

**Build fails with "Cannot find module"**
- Solution: `rm -rf node_modules .docusaurus && yarn install`

**Changes not reflecting in dev server**
- Solution: `yarn clear && yarn start`

**Version mismatch errors**
- Solution: Ensure Node.js version matches `.nvmrc` or `netlify.toml`

**Broken links after content move**
- Solution: Search for old path, update all references, run link checker

**Translation missing strings**
- Solution: `yarn write-translations --locale {locale}` to regenerate

### Getting Help
- GitHub Issues: https://github.com/helm/helm-www
- Kubernetes Slack: #helm-users and #helm-dev channels
- Documentation: https://docusaurus.io/docs

## Special Notes for AI Agents

### When Making Changes
1. Always build and test locally before considering work complete
2. Check both English and at least one translated version if touching i18n
3. Verify changes in both current docs and latest versioned docs if applicable
4. Run link checker before finalizing PR
5. Ensure all commits are properly formatted and signed

### File Generation
- CLI reference docs are auto-generated - note this in commits
- Don't manually edit generated files without noting the generation source
- If regenerating docs, ensure clean helm environment (no plugins)

### Be Aware Of
- This is a versioned documentation site - changes may need to apply to multiple versions
- Blog posts are part of permanent site history - be extra careful with edits
- Some content may be in multiple languages - coordinate changes across translations when needed
- External links should be checked periodically as they can break over time
