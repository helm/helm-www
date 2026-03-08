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
- [Postrenderer plugins](#postrenderer-plugins): allow users to modify Chart rendered manifests before being sent to the Kubernetes API

Starting with Helm 4, the plugin system is set up to more easily allow adding additional plugin types, which would allow users to modify other areas of Helm functionality.

### CLI plugins

What is the advantage of using a plugin to create `helm` CLI subcommands as opposed to using separate scripts, or tools with their own standalone commands?

The main reason is plugins that add `helm` CLI sub-commands can leverage Helm-specific configuration, context, and functionality that standalone scripts and tools would otherwise need to develop themselves. They can allow a more seamless extension of `helm` CLI user workflows.

### Getter Plugins

Helm has build-in support for working with [Charts](/glossary/index.mdx#chart) and Plugins on your local filesystem or stored as artifacts in [OCI Registries](/topics/registries.mdx). Charts can additionally be stored in [HTTP repositories](/topics/chart_repository.md), and plugins can additionally be stored in VCS repositories like Git.

Helm Getter plugins allow you to extend this storage and download behavior to support other storage locations. There are community Getter plugins for storing Charts and Plugins in [s3 buckets](/community/related#helm-plugins), and elsewhere. You will want to use getter plugins if you need additional storage options for your Helm workflows.

### PostRenderer plugins

Helm allows users to configure charts by supplying custom values. These user-provided values are what Charts use to render the manifests that allow Helm to manage your applications in Kubernetes.

If you write your own charts, you can update the templates whenever you need additional configurability for your rendered manifests. However, if you are using community charts that you don't own, post-rendering allows you to modify the manifests after the charts have rendered them but before Helm uses them to manage your Kubernetes resources. Starting with Helm 4, postrenderer plugins are the way to do this.

## Plugin API Versions

Starting with Helm 4, the `plugin.yaml` file included with every plugin now has an `apiVersion` field, currently at `v1`.

Legacy plugins (prior to API versioning) will still be supported throughout the life of Helm 4, so your existing plugins from Helm 3 will still work until Helm 5. However, you should ask authors of your favorite plugins to update their plugins to the new versioning system.

If you are a plugin developer, read more about this in the [Plugins Developer Guide](/plugins/developer/index.mdx).

## Plugin Runtimes

Helm currently supports 2 plugin runtimes:

- Subprocess runtime
- Wasm runtime

See the relevant information about each runtime in either the [Plugins User Guide](/plugins/user/index.md) or [Plugins Developer Guide](/plugins/developer/index.mdx).

## File structure

All of the files for a plugin live within a single directory, which is used for developing, packaging, and installing.

Inside the plugin's directory, Helm expects this structure:

```
example-plugin
├── plugin.yaml # REQUIRED
├── plugin.sh   # OPTIONAL for Subprocess runtime
└── plugin.wasm # REQUIRED for Wasm runtime
```

- The only required file is [plugin.yaml](#pluginyaml).
- [Subprocess runtime](#plugin-runtimes) can optionally contain one or more custom executable files containing your plugin code (can be Node, Python, Go, etc). For this runtime, you can alternatively call any executable already available in the user's PATH, directly from the `plugin.yaml` [runtime configuration](#runtime-configuration) `platformCommand` field.
- For [Wasm runtime](#plugin-runtimes), you will need to include a `.wasm` file. This is your plugin code (can be Node, Python, Go, etc) compiled to Wasm.

## Plugin.yaml

The `plugin.yaml` file is required for a plugin. It is a YAML file containing metadata and configuration for the plugin.

### Metadata Information

```yaml
apiVersion: REQUIRED - The Plugin API version. Must be "v1"
type: REQUIRED - The versioned Plugin Type. Can be "cli/v1", "getter/v1", or "postrenderer/v1"
name: REQUIRED - The name of the plugin
version: REQUIRED - The version of the plugin
runtime: REQUIRED - The runtime for the plugin. Can be "subprocess" or "extism/v1" (Wasm)
sourceURL: OPTIONAL - A URL pointing to the source code for your plugin
config: DEPENDS ON PLUGIN TYPE
runtimeConfig: DEPENDS ON RUNTIME
```

- The `config` field is for [Plugin Type Configuration](#plugin-type-configuration), with a structure that differs per [Plugin Type](#plugin-types) as defined by the `type` field.
- The `runtimeConfig` field is for [Runtime Configuration](#runtime-configuration), with a structure that differs per [Runtime](#plugin-runtimes) as defined by the `runtime` field.
- 💡 While the `sourceURL` field is optional, plugin authors are strongly encouraged to point to the plugin source code because it helps plugin users understand what the code does, and contribute to the plugin if it accepts open source contributions.

### Plugin Type Configuration

The `config` field of [plugin.yaml](#pluginyaml) has different options per [Plugin Type](#plugin-types). A plugin's type is defined by the `type` field.

#### CLI Plugin Configuration

If `type` field is `cli/v1`, it is a [CLI Plugin type](#cli-plugins), and the following plugin type configurations are allowed:

```yaml
usage: OPTIONAL - The single-line usage text shown in help
shortHelp: The short description shown in the 'helm help' output
longHelp: The long message shown in the 'helm help <this-command>' output
ignoreFlags: Ignores any flags passed in from Helm
```

- `usage` is optional. Defaults to "helm PLUGIN_NAME [flags]" if not overridden with a custom usage string. For recommended syntax, see [spf13/cobra.command.Command] Use field comment: https://pkg.go.dev/github.com/spf13/cobra#Command
- `ignoreFlags` switch tells Helm to not pass flags to the plugin. So if a plugin is called with `helm myplugin --foo` and `ignoreFlags: true`, then `--foo` is silently discarded.

#### Getter Plugin Configuration

If `type` field is `getter/v1`, it is a [Getter Plugin type](#getter-plugins), and the following plugin type configurations are allowed:

```yaml
protocols: The list of schemes from the charts URL that this plugin supports.
```

#### Postrenderer Plugin Configuration

If `type` field is `postrenderer/v1`, it is a [Postrenderer Plugin type](#cli-plugins), and does not have any configuration options.

### Runtime Configuration

The `runtimeConfig` field of [plugin.yaml](#pluginyaml) has different options per [Plugin Runtime](#plugin-runtimes). A plugin's runtime is defined by the `runtime` field.

#### Subprocess Runtime Configuration

If the `runtime` field is `subprocess`, it is a [Subprocess Runtime](#plugin-runtimes) plugin and the following runtime configurations are allowed:

```yaml
runtimeconfig:
    platformCommand: # Configure command to run based on the platform
        - os: OS match, can be empty or omitted to match any OS
          arch: Architecture match, can be empty or omitted to match any architecture
          command: Plugin command to execute
          args: Plugin command arguments
    platformHooks: # Configure plugin lifecycle hooks based on the platform
        install: # Install lifecycle commands
            - os: OS match, can be empty or omitted to match any OS
              arch: Architecture match, can be empty or omitted to match any architecture
              command: Plugin install command to execute
              args: Plugin install command arguments
        update: # Update lifecycle commands
            - os: OS match, can be empty or omitted to match any OS
              arch: Architecture match, can be empty or omitted to match any architecture
              command: Plugin update command to execute
              args: Plugin update command arguments
        delete: # Delete lifecycle commands
            - os: OS match, can be empty or omitted to match any OS
              arch: Architecture match, can be empty or omitted to match any architecture
              command: Plugin delete command to execute
              args: Plugin delete command arguments
    protocolCommands: # Obsolete/deprecated
        - protocols: [] # Protocols are the list of schemes from the charts URL.
          platformCommand: [] # Same structure as "platformCommand" above
```

- ⚠️ `protocolCommands` is marked `obsolete/deprecated`, and will be removed in future versions of the plugin system after `apiVersion: v1`. It only applies to the "getter/v1" plugin type. This is a compatibility hangover from the old plugin downloader mechanism, which was extended to support multiple protocols in a given plugin. The command supplied in PlatformCommand should implement protocol specific logic by inspecting the download URL.

#### Wasm Runtime Configuration

If the `runtime` field is `extism/v1`, it is a [Wasm Runtime](#plugin-runtimes) plugin and the following runtime configurations are allowed:

```yaml
runtimeconfig:
    memory: # Describes the limits on the memory the plugin may be allocated
        maxPages: The max amount of pages the plugin can allocate. One page is 64Kib. e.g. 16 pages would require 1MiB. Default is 4 pages (256KiB).
        maxHttpResponseBytes: The max size of an Extism HTTP response in bytes. Default is 4096 bytes (4KiB).
        maxVarBytes: The max size of all Extism vars in bytes. Default is 4096 bytes (4KiB).
    config: {} # A free-form map that can be passed to the plugin.
    allowedHosts: [] # An optional set of hosts this plugin can communicate with. Defaults to no hosts allowed.
    fileSystem:
        createTempDir: Whether to create a temporary directory on the filesystem. Can be "true" or "false".
    timeout: The timeout in milliseconds for the plugin to execute
    hostFunctions: HostFunction names exposed in Helm the plugin may access. See https://extism.org/docs/concepts/host-functions/
    entryFuncName: The name of entry function name to call in the plugin. Defaults to "helm_plugin_main".
```

- `allowedHosts` only has an effect if the plugin makes HTTP requests. If not specified, then no hosts are allowed.
