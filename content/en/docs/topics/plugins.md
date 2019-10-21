---
title: "The Helm Plugins Guide"
description: "Introduces how to use and create plugins to extend Helm's functionality."
---

Helm 2.1.0 introduced the concept of a client-side Helm _plugin_. A plugin is a
tool that can be accessed through the `helm` CLI, but which is not part of the
built-in Helm codebase.

Existing plugins can be found on [related](related.md#helm-plugins) section or by searching [Github](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories).

This guide explains how to use and create plugins.

## An Overview

Helm plugins are add-on tools that integrate seamlessly with Helm. They provide
a way to extend the core feature set of Helm, but without requiring every new
feature to be written in Go and added to the core tool.

Helm plugins have the following features:

- They can be added and removed from a Helm installation without impacting the
  core Helm tool.
- They can be written in any programming language.
- They integrate with Helm, and will show up in `helm help` and other places.

Helm plugins live in `$(helm home)/plugins`.

The Helm plugin model is partially modeled on Git's plugin model. To that end,
you may sometimes hear `helm` referred to as the _porcelain_ layer, with
plugins being the _plumbing_. This is a shorthand way of suggesting that
Helm provides the user experience and top level processing logic, while the
plugins do the "detail work" of performing a desired action.

## Installing a Plugin

Plugins are installed using the `$ helm plugin install <path|url>` command. You can pass in a path to a plugin on your local file system or a url of a remote VCS repo. The `helm plugin install` command clones or copies the plugin at the path/url given into `$ (helm home)/plugins`

```console
$ helm plugin install https://github.com/technosophos/helm-template
```

If you have a plugin tar distribution, simply untar the plugin into the `$(helm home)/plugins` directory. You can also install tarball plugins directly from url by issuing `helm plugin install http://domain/path/to/plugin.tar.gz`

## Building Plugins

In many ways, a plugin is similar to a chart. Each plugin has a top-level
directory, and then a `plugin.yaml` file.

```
$(helm home)/plugins/
  |- keybase/
      |
      |- plugin.yaml
      |- keybase.sh

```

In the example above, the `keybase` plugin is contained inside of a directory
named `keybase`. It has two files: `plugin.yaml` (required) and an executable
script, `keybase.sh` (optional).

The core of a plugin is a simple YAML file named `plugin.yaml`.
Here is a plugin YAML for a plugin that adds support for Keybase operations:

```yaml
name: "last"
version: "0.1.0"
usage: "get the last release name"
description: "get the last release name""
ignoreFlags: false
command: "$HELM_BIN --host $TILLER_HOST list --short --max 1 --date -r"
platformCommand:
  - os: linux
    arch: i386
    command: "$HELM_BIN list --short --max 1 --date -r"
  - os: linux
    arch: amd64
    command: "$HELM_BIN list --short --max 1 --date -r"
  - os: windows
    arch: amd64
    command: "$HELM_BIN list --short --max 1 --date -r"
```

The `name` is the name of the plugin. When Helm executes it plugin, this is the
name it will use (e.g. `helm NAME` will invoke this plugin).

_`name` should match the directory name._ In our example above, that means the
plugin with `name: keybase` should be contained in a directory named `keybase`.

Restrictions on `name`:

- `name` cannot duplicate one of the existing `helm` top-level commands.
- `name` must be restricted to the characters ASCII a-z, A-Z, 0-9, `_` and `-`.

`version` is the SemVer 2 version of the plugin.
`usage` and `description` are both used to generate the help text of a command.

The `ignoreFlags` switch tells Helm to _not_ pass flags to the plugin. So if a
plugin is called with `helm myplugin --foo` and `ignoreFlags: true`, then `--foo`
is silently discarded.

Finally, and most importantly, `platformCommand` or `command` is the command
that this plugin will execute when it is called. The `platformCommand` section
defines the OS/Architecture specific variations of a command. The following
rules will apply in deciding which command to use:

- If `platformCommand` is present, it will be searched first.
- If both `os` and `arch` match the current platform, search will stop and the
command will be used.
- If `os` matches and there is no more specific `arch` match, the command
will be used.
- If no `platformCommand` match is found, the default `command` will be used.
- If no matches are found in `platformCommand` and no `command` is present,
Helm will exit with an error.

Environment variables are interpolated before the plugin is executed. The
pattern above illustrates the preferred way to indicate where the plugin
program lives.

There are some strategies for working with plugin commands:

- If a plugin includes an executable, the executable for a
`platformCommand:` or a `command:` should be packaged in the plugin directory.
- The `platformCommand:` or `command:` line will have any environment
variables expanded before execution. `$HELM_PLUGIN_DIR` will point to the
plugin directory.
- The command itself is not executed in a shell. So you can't oneline a shell script.
- Helm injects lots of configuration into environment variables. Take a look at
  the environment to see what information is available.
- Helm makes no assumptions about the language of the plugin. You can write it
  in whatever you prefer.
- Commands are responsible for implementing specific help text for `-h` and `--help`.
  Helm will use `usage` and `description` for `helm help` and `helm help myplugin`,
  but will not handle `helm myplugin --help`.

## Downloader Plugins
By default, Helm is able to pull Charts using HTTP/S. As of Helm 2.4.0, plugins
can have a special capability to download Charts from arbitrary sources.

Plugins shall declare this special capability in the `plugin.yaml` file (top level):

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

If such plugin is installed, Helm can interact with the repository using the specified
protocol scheme by invoking the `command`. The special repository shall be added
similarly to the regular ones: `helm repo add favorite myprotocol://example.com/`
The rules for the special repos are the same to the regular ones: Helm must be able
to download the `index.yaml` file in order to discover and cache the list of
available Charts.

The defined command will be invoked with the following scheme:
`command certFile keyFile caFile full-URL`. The SSL credentials are coming from the
repo definition, stored in `$XDG_DATA_HOME/helm/repositories.yaml`. Downloader
plugin is expected to dump the raw content to stdout and report errors on stderr.

The downloader command also supports sub-commands or arguments, allowing you to specify
for example `bin/mydownloader subcommand -d` in the `plugin.yaml`. This is useful
if you want to use the same executable for the main plugin command and the downloader
command, but with a different sub-command for each.

## Environment Variables

When Helm executes a plugin, it passes the outer environment to the plugin, and
also injects some additional environment variables.

Variables like `KUBECONFIG` are set for the plugin if they are set in the
outer environment.

The following variables are guaranteed to be set:

- `HELM_PLUGIN`: The path to the plugins directory
- `HELM_PLUGIN_NAME`: The name of the plugin, as invoked by `helm`. So
  `helm myplug` will have the short name `myplug`.
- `HELM_PLUGIN_DIR`: The directory that contains the plugin.
- `HELM_BIN`: The path to the `helm` command (as executed by the user).
- `HELM_HOME`: The path to `$XDG_DATA_HOME/helm`.
- `HELM_PATH_*`: Paths to important Helm files and directories are stored in
  environment variables prefixed by `HELM_PATH`.

## A Note on Flag Parsing

When executing a plugin, Helm will parse global flags for its own use. Some of
these flags are _not_ passed on to the plugin.

- `--debug`: If this is specified, `$HELM_DEBUG` is set to `1`
- `--home`: This is converted to `$HELM_HOME`
- `--kube-context`: This is simply dropped.

Plugins _should_ display help text and then exit for `-h` and `--help`. In all
other cases, plugins may use flags as appropriate.

