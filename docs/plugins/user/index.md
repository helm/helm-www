---
title: Plugins User Guide
sidebar_label: Using Plugins
sidebar_position: 2
---

For an overview of Helm Plugin concepts, how to read their structure, and how to understand what their configurations mean for you as a user, read the [Plugins Overview](/plugins/overview.md).

This section focuses on using Helm Plugins as an end-user.

## Finding Plugins

You can already find [Helm Plugins on ArtifactHub](https://artifacthub.io/packages/search?kind=6).

The Helm 4 Plugin system is brand new. In the near future, you should be able to search plugins by type and runtime on ArtifactHub. Stay tuned for updates on this!

## Plugin Security

Depending on the plugin runtime, you should inspect any plugin from third parties before running on your system.

- Subprocess runtime has as much access to your system as the user running the commands. Be sure to carefully inspect the plugin code before installing a plugin, uninstalling a plugin, or running any helm commands that could also run these plugins.
- Wasm runtime, by contrast, runs in a secure sandbox with only the access to your system that you explicitly approve. This plugin runtime has much stronger controls and an inherently higher level of built-in safety. You should still inspect `plugin.yaml` to know what permissions the plugin is requesting.

In both cases, it is highly recommended to verify the provenance of even a Wasm runtime plugin before installing it, so that you can trust where it is downloaded from and who created it. This not only protects you from accidentally installing plugins from spoofed URL attacks, but also network hijacking attacks. Plugin verification allows you to cryptographically ensure a chart has not been compromised before you install it.

See the `--verify` flag in `helm plugin install --help`.

You may also verify the provenance of already installed plugins with `helm plugin verify --help`, in case verification was bypassed during installation (for development purposes), as well as to help provide you with security compliance information at any time.

The `helm plugin list` command also includes high-level provenance information at a glance.

## Installing Plugins

Helm has a build-in command to install plugins that defaults to secure installation. However, be sure to read [Plugin Security](#plugin-security) to understand what to check before installing.

See `helm plugin install --help` for more information.

## Listing Installed Plugins

The command to list plugins includes the plugin's name, version, type, API version, provenance, and source.

See `helm plugin list --help` for more information.

## Uninstalling Plugins

Uninstalling plugins is intended to be straightforward and easy. However, be sure to read [Plugin Security](#plugin-security) to understand the risks of uninstalling as well.

See `helm plugin uninstall --help`.
