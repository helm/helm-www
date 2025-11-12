---
sidebar_position: 1
sidebar_label: Helm 4 Overview
---

# Helm 4 Overview

Helm v4 represents a significant evolution from v3, introducing breaking changes, new architectural patterns, and enhanced functionality while maintaining backwards compatibility for charts.

For more information about the planned Helm 4 release phases, see [Path to Helm v4](https://helm.sh/blog/path-to-helm-v4/).

## What's New

This section provides an overview of what's new in Helm 4, including breaking changes, major new features, and other improvements. For complete technical details, see the [Full Changelog](./changelog.md).

### Summary

- **New features**: Wasm-based plugins, kstatus watcher, OCI digest support, multi-doc values, JSON arguments
- **Architecture changes**: Plugin system completely redesigned, package restructuring, CLI flag renaming Move to versioned packages, chart v3 support, content-based caching
- **Modernization**: slog migration, Go 1.24 update, dependency cleanup
- **Security**: Enhanced OCI/registry support, TLS improvements

### Breaking Changes

#### Post-renderers implemented as plugins
Post-renderers are implemented as plugins. With this change, it is no longer possible to pass an executable directly to `helm render --post-renderer`, but a plugin name must be passed. This might require updates to existing any post-renderer workflows. 

### New Features

#### Plugin System Overhaul
Helm 4 introduces an optional WebAssembly-based runtime for enhanced security and expanded capabilities. Existing plugins continue to work, but the new runtime opens up more of Helm's core behavior for plugin customization. Helm 4 launches with three plugin types: CLI plugins, getter plugins, and post-renderer plugins, plus a system that enables new plugin types for customizing additional core functionality. See [HIP-0026 plugin system](https://github.com/helm/community/blob/main/hips/hip-0026.md) and [Helm 4 example plugins](https://github.com/scottrigby/h4-example-plugins).

:::tip
Existing plugins work as before. The new WebAssembly runtime is optional but recommended for enhanced security.
:::

#### Better resource monitoring
New kstatus integration shows detailed status of your deployments. Test with complex applications to see if it catches issues better.

#### Enhanced OCI Support
Install charts by digest for better supply chain security. For example, `helm install myapp oci://registry.example.com/charts/app@sha256:abc123...`. Charts with non-matching digests are not installed.

#### Multi-Document Values
Split complex values across multiple YAML files. Perfect for testing different environment configs.

#### Server-Side Apply
Better conflict resolution when multiple tools manage the same resources. Test in environments with operators or other controllers.

#### Custom Template Functions
Extend Helm's templating with your own functions through plugins. Great for organization-specific templating needs.

#### Post-Renderers as Plugins
Post-renderers are implemented as plugins, providing better integration and more capabilities.

#### Stable SDK API
API breaking changes are now complete. Test it, break it, give us feedback! The API also enables additional chart versions, opening possibilities for new features in the upcoming Charts v3.

#### Charts v3

Coming soon. v2 charts continue to work unchanged.

### Improvements

#### Performance
Faster dependency resolution and new content-based chart caching.

#### Error Messages
Clearer, more helpful error output.

#### Registry Authentication
Better OAuth and token support for private registries.

#### CLI Flags renamed

Some common CLI flags are renamed:
- `--atomic` → `--rollback-on-failure`
- `--force` → `--force-replace`

Update any automation that uses these renamed CLI flags.

## Upgrading to Helm 4

While we work hard to make Helm 4 rock-solid for everyone, Helm 4 is brand new. To that end, before upgrading, we've added some tips below for specific things to look out for when testing Helm 4 with your existing workflows. As always, we welcome all feedback about what works, what breaks, and what could be better.

### High Priority
* Test your existing charts and releases to verify that they still work with v4.
* Test all 3 plugin types (CLI, getter, post-renderer).
* Try building WebAssembly plugins with the new runtime (see [example plugins](https://github.com/scottrigby/h4-example-plugins))
* SDK users: test the now-stable API. Try to break it and share your feedback.
* Test your CI/CD pipelines and fix any script errors from the renamed CLI flags.
* Test your post-renderer integrations.
* Test registry authentication and chart installation in your OCI workflows.

### Other
* Test other new features, including multi-document values, digest-based installs, and custom template functions.
* Test the performance of Helm 4 with large, complex charts to see if it is noticeably faster for your workloads.
* Try breaking things intentionally to see if the updated error messages are helpful.

### Feedback
* What other plugin types would you like to see added to customize Helm core functionality?
* With the API supporting additional chart versions, what new features would you want in Charts v3?

## How to Give Feedback

Find issues? Have suggestions? We want to hear from you before the November release:

### GitHub Issues

Review the [list of open issues and feature requests](https://github.com/helm/helm/issues) in the Helm repo. Add comments on the existing items, or [create new](https://github.com/helm/helm/issues/new/choose) issues and requests.

### Community Slack

Join [Kubernetes Slack](https://slack.kubernetes.io/) channels:
- `#helm-dev` for development discussions
- `#helm-users` for user support and testing feedback

### Weekly Dev Meetings

Join live discussion with maintainers every Thursday 9:30am PT on [Zoom](https://zoom.us/j/696660622?pwd=MGsraXZ1UkVlTkJLc1B5U05KN053QT09).

For more options, see the Helm community [communication details](https://github.com/helm/community/blob/main/communication.md).
