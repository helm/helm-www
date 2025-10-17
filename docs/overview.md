---
sidebar_position: 1
sidebar_label: Overview
---

# Helm 4 🔭 Overview

**Help us test Helm 4 before the November release at KubeCon Atlanta!** Try the pre-release builds and let us know what works, what breaks, and what could be better. Read more about the [Path to Helm v4](https://helm.sh/blog/path-to-helm-v4/) release phases.

## Quick Summary

- **Breaking Changes**: HIP-0026 plugin system completely redesigned, package restructuring, flag renaming
- **Major Features**: kstatus watcher, OCI digest support, multi-doc values, JSON arguments
- **Architecture**: Move to versioned packages, chart v3 support, content-based caching
- **Modernization**: slog migration, Go 1.24 update, dependency cleanup
- **Security**: Enhanced OCI/registry support, TLS improvements

See the [Full Changelog](./changelog.md) for complete technical details.

## What's New in Helm 4

### 🚨 Breaking Changes (Test Your Workflows!)

**Plugin System Overhaul**: New optional WebAssembly-based runtime for enhanced security and expanded capabilities. Existing plugins continue to work, but the new runtime opens up more of Helm's core behavior for plugin customization. Helm 4 launches with 3 plugin types: CLI plugins, getter plugins, and post-renderer plugins, plus a system that enables new plugin types for customizing additional core functionality.

**Flag Changes**: Some common flags were renamed:
- `--atomic` → `--rollback-on-failure`
- `--force` → `--force-replace`

**Post-Renderers Now Plugins**: Post-renderers are now implemented as plugins, which may require updates to existing post-renderer workflows.

**What to Test**: Update your scripts and automation to use the new flags and test your post-renderer integrations.

### 🚀 Major Features (Try These Out!)

**Better Resource Monitoring**: New kstatus integration shows detailed status of your deployments. Test with complex applications to see if it catches issues better.

**Enhanced OCI Support**: Install charts by digest for better supply chain security. Try: `helm install myapp oci://registry.example.com/charts/app@sha256:abc123...`

**Multi-Document Values**: Split complex values across multiple YAML files. Perfect for testing different environment configs.

**Server-Side Apply**: Better conflict resolution when multiple tools manage the same resources. Test in environments with operators or other controllers.

**Custom Template Functions**: Extend Helm's templating with your own functions via plugins. Great for organization-specific templating needs.

**Post-Renderers as Plugins**: Post-renderers are now implemented as plugins, providing better integration and more capabilities.

**Stable SDK API**: The Helm SDK API is now stable as of the beta. Test it, break it, give us feedback! The API also enables additional chart versions, opening possibilities for new features in the upcoming Charts v3.

### 🔧 Improvements to Test

**Performance**: Faster dependency resolution and new content-based chart caching. Test with large, complex charts to ensure compatibility.

**Error Messages**: Clearer, more helpful error output. Try breaking things intentionally to see if the errors make sense.

**Registry Authentication**: Better OAuth and token support for private registries. Test your authentication workflows.

## What We Need You to Test

### High Priority
1. **Your existing charts and releases** - Do they still work?
2. **Plugin system** - Test all 3 plugin types (CLI, getter, post-renderer) and try the new WebAssembly runtime
3. **Stable SDK API** - SDK users: test the now-stable API, try to break it, share your feedback
4. **CI/CD pipelines** - Any script failures from flag changes?
5. **OCI workflows** - Registry authentication and chart installation
6. **Complex deployments** - Large charts, many dependencies, custom resources

### Medium Priority
1. **New features** - Multi-document values, digest-based installs, custom template functions
2. **Plugin development** - Try building WebAssembly plugins with the new runtime (see [example plugins](https://github.com/scottrigby/h4-example-plugins))
3. **Future plugin types** - Think about what other plugin types you'd like to see added to customize Helm core functionality
4. **Charts v3 features** - With the API supporting additional chart versions, what new features would you want in Charts v3?
5. **Performance** - Is Helm 4 noticeably faster for your workloads?
6. **Error handling** - Are error messages helpful when things go wrong?

### Breaking Change Impact
- **Charts**: v2 charts continue to work unchanged
- **Plugins**: Existing plugins work as before; new WebAssembly runtime is optional but recommended for enhanced security
- **Post-Renderers**: Now implemented as plugins, existing post-renderer workflows may need updates
- **Scripts**: Update any automation using renamed flags

## How to Give Feedback

Found issues? Have suggestions? We want to hear from you before the November release:

- **GitHub Issues**: [Report bugs and feature requests](https://github.com/helm/helm/issues/new)
- **Community Slack**: Join [Kubernetes Slack](https://slack.kubernetes.io/) channels:
  - `#helm-dev` for development discussions
  - `#helm-users` for user support and testing feedback
- **Weekly Dev Meetings**: Every Thursday 9:30am PT on [Zoom](https://zoom.us/j/696660622?pwd=MGsraXZ1UkVlTkJLc1B5U05KN053QT09) for live discussion with maintainers

See full [communication details](https://github.com/helm/community/blob/main/communication.md) for more options.

**Goal**: Make Helm 4 rock-solid for everyone when it ships in November!
