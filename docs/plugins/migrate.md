---
title: Migrate v3 Plugins to Helm 4
sidebar_label: Migrate from v3
sidebar_position: 4
---

# Migrate v3 Plugins to Helm 4

Helm 4 introduces a redesigned plugin system with versioned API
support, explicit plugin types, and an optional Wasm runtime.
Your existing Helm 3 plugins still work in Helm 4 and the legacy
subprocess model is fully supported but it is deprecated and
will be removed in Helm 5.

This guide walks you through updating a Helm 3 plugin to the new
`apiVersion: v1` schema.

## Before you begin

You need:

- Helm 4 installed (`helm version` should report v4.x)
- An existing Helm 3 plugin you want to migrate
- Familiarity with your plugin's `plugin.yaml` file

Identify which category your plugin falls into:

| If your plugin... | Its Helm 4 type is |
|---|---|
| Adds a `helm` CLI subcommand | `cli/v1` |
| Downloads charts via a custom protocol (s3, git, etc.) | `getter/v1` |
| Modifies rendered manifests before install | `postrenderer/v1` |

:::warning Breaking change for post-renderers
In Helm 3, `helm install --post-renderer` accepted a path to an
executable. In Helm 4, it requires a **plugin name**. If you maintain
a post-renderer workflow that passes an executable path directly, you
must package it as a `postrenderer/v1` plugin and pass the plugin name
to `--post-renderer` instead. See the
[Helm 4 Overview](/docs/overview#plugin-system-overhaul) for details.
:::

## What changed in plugin.yaml

The table below maps legacy fields to their v4 equivalents.

| Legacy field | v4 equivalent | Notes |
|---|---|---|
| *(not present)* | `apiVersion: v1` | New required field |
| *(not present)* | `type: cli/v1` | New required field. Use `cli/v1`, `getter/v1`, or `postrenderer/v1` |
| *(not present)* | `runtime: subprocess` | New required field. Use `subprocess` or `extism/v1` |
| `name` | `name` | Unchanged |
| `version` | `version` | Unchanged |
| `usage` | `config.usage` | Moved under `config` for CLI plugins |
| `description` | `config.shortHelp` | Renamed and moved under `config`. Optionally split into `shortHelp` (brief, shown in `helm help`) and `longHelp` (detailed, shown in `helm help <plugin>`) |
| *(not present)* | `config.longHelp` | New optional field for CLI plugins. Use for the detailed help text shown in `helm help <plugin>` |
| `ignoreFlags` | `config.ignoreFlags` | Moved under `config` for CLI plugins |
| `platformCommand` | `runtimeConfig.platformCommand` | Moved under `runtimeConfig` |
| `platformHooks` | `runtimeConfig.platformHooks` | Moved under `runtimeConfig` |
| `command` | *(deprecated)* | Use `runtimeConfig.platformCommand` instead |
| `hooks` | *(deprecated)* | Use `runtimeConfig.platformHooks` instead |
| `downloaders` | `config.protocols` + `runtimeConfig.protocolCommands` | Split across config and runtimeConfig for getter plugins. `protocolCommands` is deprecated but currently the documented pattern for subprocess getters |

## Path 1: Subprocess migration (quickest)

If you want to keep running your plugin as a subprocess (no Wasm
compilation), you only need to restructure `plugin.yaml`. The
executable itself does not change.

### Example: CLI plugin

**Before (Helm 3):**

```yaml
name: myplugin
version: 0.2.0
usage: "do something useful"
description: "A plugin that does something useful"
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/myplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
platformHooks:
  install:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
```

**After (Helm 4, subprocess):**

```yaml
apiVersion: v1
type: cli/v1
name: myplugin
version: 0.2.0
runtime: subprocess
sourceURL: https://github.com/example/helm-myplugin

config:
  usage: "do something useful"
  shortHelp: "A plugin that does something useful"
  ignoreFlags: false

runtimeConfig:
  platformCommand:
    - command: ${HELM_PLUGIN_DIR}/bin/myplugin
    - os: windows
      command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
  platformHooks:
    install:
      - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
      - os: windows
        command: pwsh
        args:
          - -c
          - ${HELM_PLUGIN_DIR}\scripts\install.ps1
```

The key changes are: add `apiVersion`, `type`, `runtime`, and
`sourceURL` at the top level; nest `usage`, `description` (now
`shortHelp`), and `ignoreFlags` under `config`; and nest
`platformCommand` and `platformHooks` under `runtimeConfig`.

### Example: Getter plugin (formerly "downloader")

**Before (Helm 3):**

```yaml
name: s3
version: 1.2.0
usage: "fetch charts from S3"
description: "Downloader plugin for S3 chart repos"
downloaders:
  - command: "bin/s3downloader"
    protocols:
      - "s3"
```

**After (Helm 4, subprocess):**

```yaml
apiVersion: v1
type: getter/v1
name: s3
version: 1.2.0
runtime: subprocess
sourceURL: https://github.com/example/helm-s3

config:
  protocols:
    - "s3"

runtimeConfig:
  protocolCommands:
    - protocols:
        - s3
      platformCommand:
        - command: ${HELM_PLUGIN_DIR}/bin/s3downloader
```

The `downloaders` block is replaced by `config.protocols` (which
declares the URL schemes the plugin handles) and
`runtimeConfig.protocolCommands` (which maps each protocol to
its platform command).

:::info
The `protocolCommands` field is marked deprecated in the Overview
spec and will be removed after `apiVersion: v1`. Future versions
should use `runtimeConfig.platformCommand` directly, with the
plugin itself inspecting the download URL to determine protocol
logic. For now, `protocolCommands` is the pattern the official
tutorials teach for subprocess getters.
:::

## Path 2: Wasm migration

If you want to take advantage of the Wasm sandbox, you need to
compile your plugin into a `.wasm` binary using the
[Extism PDK](https://extism.org/docs/concepts/pdk)
for your plugin's language. The most common choice for Go plugins
is the [Extism Go PDK](https://github.com/extism/go-pdk).

For step-by-step instructions on building Wasm plugins from
scratch, see the
[Getter Plugin Wasm tutorial](/docs/plugins/developer/tutorial-getter-plugin#wasm-runtime)
— currently the most complete Wasm example in the docs. You can
also scaffold a new Wasm plugin from the
[Extism plugin template](https://github.com/gjenkins8/helm-extism-plugin-template).

:::info
The CLI and Postrenderer Wasm tutorial sections are still in
progress. Check the
[Developing Plugins](/docs/plugins/developer/) page for updates.
:::

Here is how the `plugin.yaml` changes compared to the subprocess
version above:

```yaml
apiVersion: v1
type: cli/v1
name: myplugin
version: 0.2.0
runtime: extism/v1
sourceURL: https://github.com/example/helm-myplugin

config:
  usage: "do something useful"
  shortHelp: "A plugin that does something useful"
  ignoreFlags: false

runtimeConfig:
  memory:
    maxPages: 16
  allowedHosts:
    - "api.example.com"
  timeout: 30000
```

The main differences from the subprocess version:

- `runtime` changes from `subprocess` to `extism/v1`.
- `runtimeConfig` uses Wasm-specific fields (`memory`,
  `allowedHosts`, `timeout`) instead of `platformCommand`.
- No `platformCommand` or `platformHooks` — the Wasm binary
  is discovered by filename convention (`<name>.wasm`).
- The plugin directory contains a `.wasm` file instead of
  platform-specific executables.

## Signing your migrated plugin

Helm 4 adds built-in provenance signing and verification for
plugins. When you distribute your plugin, sign it:

```bash
helm plugin package --sign --key "your-key-id" ./myplugin
```

Users can then verify the plugin during install:

```bash
helm plugin install https://example.com/myplugin.tgz --verify
```

Verification is enabled by default. See
[Plugin Security](/docs/plugins/user/#plugin-security) for details.

## Backwards compatibility

Legacy plugins (without `apiVersion`) continue to work in Helm 4.
Helm automatically detects the legacy format and routes them
through the legacy subprocess handler. However:

- Legacy plugins are deprecated in Helm 4.
- Legacy plugin support will be removed in Helm 5.
- New plugin features (Wasm runtime, provenance signing,
  new plugin types) are only available with `apiVersion: v1`.

Migrate your plugins now to prepare for Helm 5 and to give your
users the security benefits of the new system.

## Further reading

- [Plugins Overview](/docs/plugins/overview) — full `plugin.yaml`
  specification
- [Developing Plugins](/docs/plugins/developer/) — tutorials for
  building CLI, Getter, and Postrenderer plugins
- [Helm 4 example plugins](https://github.com/scottrigby/h4-example-plugins) —
  official reference plugin implementations
- [Extism plugin template](https://github.com/gjenkins8/helm-extism-plugin-template) —
  scaffold a new Wasm plugin
- [HIP-0026](https://github.com/helm/community/blob/main/hips/hip-0026.md) —
  the design proposal for the Wasm plugin system