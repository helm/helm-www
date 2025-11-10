---
title: Plugins Overview
sidebar_label: Overview
sidebar_position: 1
---

Helm Plugins allow users to extend the core feature set of Helm, without requiring every new feature to be written in Go and added to Helm core.

They can be written in any programming language, and can be added and removed from a Helm installation without breaking Helm core functionality.

## Plugin Types

Helm currently has 3 types of Plugins:

- [CLI plugins](#cli-plugins): allow users to add additional `helm` CLI sub-commands
- [Getter plugins](#getter-plugins): allow users to use Charts and even other Plugins in locations Helm core doesn't have built-in support for
- [Postrenderer plugins](#postrenderer-plugins): allow users to modify Chart rendered manifests before being sent to the Kuberentes API

Starting with Helm 4, the plugin system is set up to more easily allow adding additional plugin types, which would allow users to modify other areas of Helm functionality.

### CLI plugins

What is the advantage of using a plugin to create `helm` CLI subcommands as opposed to using separate scripts, or tools with their own standalone commands?

The main reason is plugins that add `helm` CLI sub-commands can leverage Helm-specific configuration, context, and functionality that stanedalone scripts and tools would otherwise need to develop themselves. They can allow a more seamless extention of `helm` CLI user workflows.

### Getter Plugins

Helm has build-in support for working with [Charts](/glossary/index.mdx/#chart) and Plugins on your local filesystem or stored as artifacts in [OCI Registries](#). Charts can additionally be stored in [HTTP repositories](#), and plugins can additionally be stored in [VCS repositories](#) like Git.

Helm Getter plugins allow you to extend this storage and download behavior to support other storage locations. There are community Getter plugins for storing Charts and Plugins in [s3 buckets](#), and elsewhere. You will want to use getter plugins if you need additional storage options for your Helm workflows.

### PostRenderer plugins

Helm allows users to configure charts by supplying custom values. These user-provided values are what Charts use to render the manifests that allow Helm to manage your applications in Kubernetes.

If you write your own charts, you can update the templates whenever you need additinoal configurability for your rendered manifests. However, if you are using community charts that you don't own, post-rendering allows you to modify the manifests after the charts have rendered them but before Helm uses them to manage your Kubernetes resorces. Starting with Helm 4, postrenderer plugins are the way to do this.

## Plugin API Versions

Starting with Helm 4, the `plugin.yaml` file included with every plugin now has an `apiVersion` field, currently at `v1`.

Legacy plugins (prior to API versioning) will still be supported throughout the life of Helm 4, so your existing plugins from Helm 3 will still work until Helm 5. However, you should ask authors of your favorite plugins to update their plugins to the new versioning system.

If you are a plugin developer, read more about this in the [Plugins Developer Guide](/plugins/developer/index.mdx).

## Plugin Runtimes

Helm currently supports 2 plugin runtimes:

- Subprocess runtime
- Wasm runtime

See the relevant information about each runtime in either the [Plugins User Guide](/plugins/user/index.md) or [Plugins Developer Guide](/plugins/developer/index.mdx).
