# Helm Documentation Website (helm.sh)

The Helm Documentation Website is a Hugo-based static site that serves the official documentation, blog, and resources for the Helm project. The site supports 10+ languages and is automatically deployed to helm.sh via Netlify when changes are merged to main.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and test the repository:
  - Determine version of Hugo from netlify.toml file `export $(grep HUGO_VERSION netlify.toml | sed -e 's/ //g')`
  - Install Hugo extended (version specified in netlify.toml): `wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz -O /tmp/hugo.tar.gz && cd /tmp && tar -xzf hugo.tar.gz && sudo mv hugo /usr/local/bin/`
  - Verify Hugo: `hugo version` (should show `HUGO_VERSION` as specified in netlify.toml)
  - Install Node.js dependencies: `yarn install` -- takes ~10 seconds
  - Build production site: `make build` -- takes ~5 seconds. NEVER CANCEL.
  - Clean build artifacts: `make clean`
- Run the development server:
  - ALWAYS run the bootstrapping steps first.
  - Development server: `hugo serve` -- starts in ~2 seconds, available at http://localhost:1313/
  - Use `hugo serve --bind 0.0.0.0` to bind to all interfaces if needed
  - Development server automatically rebuilds on file changes
- Build variations:
  - Production build: `make build` (includes link checking)
  - Preview build with drafts: `make build-preview` (may fail link checking without proper baseURL - this is expected)

## Validation

- Build validation is the primary test mechanism for this static site.
- ALWAYS run `make build` after making content changes to ensure the site builds successfully and passes link checking.
- Link checking runs automatically with builds via htmltest and takes ~1 second.
- Test the development server by visiting http://localhost:1313/ in a browser after running `hugo serve`.
- For content changes, verify the specific pages you modified render correctly.
- ALWAYS validate multi-language content if editing content in `/content/` directories.
- No separate unit test suite exists - successful build + link validation + manual verification is sufficient.

## Content Structure and Common Tasks

The repository structure prioritizes content organization:

### Repository Root Structure
```
├── content/           # All website content, organized by language
│   ├── en/           # English content (primary)
│   ├── ko/           # Korean content
│   ├── ja/           # Japanese content
│   ├── de/           # German content
│   └── [8 other languages]
├── themes/helm/      # Hugo theme files
├── config.toml       # Hugo configuration
├── Makefile         # Build automation
├── package.json     # Node.js dependencies
├── netlify.toml     # Netlify deployment config
└── .nvmrc           # Node.js version (10.15.1)
```

### Key Content Directories
- `/content/en/docs/` - Main documentation (most frequently edited)
- `/content/en/blog/` - Blog posts
- `/content/en/docs/helm/` - CLI reference docs (generated from main Helm repo)
- `/themes/helm/` - Theme templates and assets

### Most Common Tasks

1. **Editing Documentation**: Edit markdown files in `/content/en/docs/` and rebuild
2. **Adding Blog Posts**: Add new markdown files to `/content/en/blog/` with proper frontmatter
3. **Updating CLI Docs**: Follow special process in README.md (requires Helm CLI installed)
4. **Multi-language Content**: Copy and translate content between language directories

### Example Build and Validation Workflow
```bash
# 1. Make content changes
# 2. Test in development
hugo serve
# 3. Validate build
make build
# 4. Commit changes
git add . && git commit -m "docs: update installation guide"
```

## Dependencies and Prerequisites

- **Hugo Extended (version from netlify.toml)** (critical version match for Netlify compatibility)
- **Node.js v10.15.1** (specified in .nvmrc, but newer versions work)
- **Yarn** for package management
- **Git** for version control

### Required Environment Setup Commands
```bash
# Check Hugo version required in netlify.toml
# Install Hugo (if not already installed)
wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz -O /tmp/hugo.tar.gz
cd /tmp && tar -xzf hugo.tar.gz && sudo mv hugo /usr/local/bin/

# Install Node.js dependencies
yarn install

# Verify setup
hugo version
yarn --version
```

## Build Timing and Performance

- **Yarn install**: ~10 seconds
- **Hugo build**: ~3 seconds
- **Link checking**: ~1 second
- **Total build time**: ~5 seconds
- **Development server startup**: ~2 seconds

All builds are very fast. Set timeouts to 30+ seconds if needed, but builds typically complete in under 10 seconds.

## Common Issues and Troubleshooting

### Build Issues
- **Hugo version mismatch**: Must use exactly the version specified in netlify.toml for Netlify compatibility
- **Missing dependencies**: Run `yarn install` if build fails
- **Link check failures**: Normal for `build-preview` without proper baseURL

### Content Issues
- **Markdown syntax**: Check `.markdownlint.json` for project style rules
- **Missing translations**: Add corresponding files in other language directories when adding new content
- **Broken internal links**: Use relative paths and ensure target files exist

### Development Server Issues
- **Port conflicts**: Use `hugo serve --port 1314` or different port
- **Cache issues**: Stop server, run `make clean`, restart server
- **File permission errors**: Ensure write permissions in repository directory

## Content Guidelines

### Adding Blog Posts
1. Create file in `/content/en/blog/` with naming format: `YYYY-MM-DD-title.md`
2. Add required frontmatter:
```yaml
---
title: "Post Title"
slug: "post-slug"
authorname: "Author Name"
authorlink: "https://author-url.com"
date: "YYYY-MM-DD"
---
```
3. Use `<!--more-->` tag to truncate content on index page
4. Place images in `/content/en/blog/images/`

### Editing Documentation
- Primary docs are in `/content/en/docs/`
- Follow existing structure and navigation patterns
- Use relative links: `[link text](../other-page/)`
- Test changes with `hugo serve` before committing

### Multi-language Considerations
- Always update the primary English content first
- Consider which languages need translation updates
- Each language has its own content directory structure
- Check `config.toml` for language-specific settings

## Deployment

- **Automatic**: All merges to `main` branch deploy automatically via Netlify
- **Build command**: `make build` (as specified in netlify.toml)
- **Output directory**: `app/` (Hugo's publishdir setting)
- **Deploy previews**: Available for all pull requests via Netlify

No manual deployment steps are required for contributors.