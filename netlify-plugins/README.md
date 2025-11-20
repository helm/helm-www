# Netlify Build Plugins

Caches Docusaurus build directories to reduce ~11 minute builds to 2-4 minutes.

## Quick Reference

**Current plugin:** `cache-docusaurus-dirs-file` (stable)
**Build command:** `make netlify-build` (preserves cache)

## Configuration

```toml
# netlify.toml
[[plugins]]
package = "./netlify-plugins/cache-docusaurus-dirs-file"
  [plugins.inputs]
  dirs = [".docusaurus", "node_modules", "build"]
```

All caching behavior controlled by environment variables:
- `CACHE_VERSION` - Manual cache busting per environment
- `CACHE_PER_BRANCH` - Set to `"false"` for PR previews to share cache

## Switching Plugins

To test beta Cache API (potentially 10x faster):
```toml
package = "./netlify-plugins/cache-docusaurus-dirs-api"
```
