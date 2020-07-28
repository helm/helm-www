---
title: "The Helm Plugins Guide"
description: "Introduces how to use and create plugins to extend Helm's functionality."
aliases: ["/docs/plugins/"]
weight: 12
---

A Helm plugin is a tool that can be accessed through the `helm` CLI, but which
is not part of the built-in Helm codebase.

Existing plugins can be found on [related]({{< ref "related.md#helm-plugins"
>}}) section or by searching
[GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories).

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

Helm plugins live in `$XDG_DATA_HOME/helm/plugins`.

The Helm plugin model is partially modeled on Git's plugin model. To that end,
you may sometimes hear `helm` referred to as the _porcelain_ layer, with plugins
being the _plumbing_. This is a shorthand way of suggesting that Helm provides
the user experience and top level processing logic, while the plugins do the
"detail work" of performing a desired action.

## Installing a Plugin

Plugins are installed using the `$ helm plugin install <path|url>` command. You
can pass in a path to a plugin on your local file system or a url of a remote
VCS repo. The `helm plugin install` command clones or copies the plugin at the
path/url given into `$XDG_DATA_HOME/helm/plugins`

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

If you have a plugin tar distribution, simply untar the plugin into the
`$XDG_DATA_HOME/helm/plugins` directory. You can also install tarball plugins
directly from url by issuing `helm plugin install
https://domain/path/to/plugin.tar.gz`

## Building Plugins

In many ways, a plugin is similar to a chart. Each plugin has a top-level
directory, and then a `plugin.yaml` file.

```
$XDG_DATA_HOME/helm/plugins/
  |- keybase/
      |
      |- plugin.yaml
      |- keybase.sh

```

In the example above, the `keybase` plugin is contained inside of a directory
named `keybase`. It has two files: `plugin.yaml` (required) and an executable
script, `keybase.sh` (optional).

The core of a plugin is a simple YAML file named `plugin.yaml`. Here is a plugin
YAML for a plugin that adds support for Keybase operations:

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

The `name` is the name of the plugin. When Helm executes this plugin, this is
the name it will use (e.g. `helm NAME` will invoke this plugin).

_`name` should match the directory name._ In our example above, that means the
plugin with `name: keybase` should be contained in a directory named `keybase`.

Restrictions on `name`:

- `name` cannot duplicate one of the existing `helm` top-level commands.
- `name` must be restricted to the characters ASCII a-z, A-Z, 0-9, `_` and `-`.

`version` is the SemVer 2 version of the plugin. `usage` and `description` are
both used to generate the help text of a command.

The `ignoreFlags` switch tells Helm to _not_ pass flags to the plugin. So if a
plugin is called with `helm myplugin --foo` and `ignoreFlags: true`, then
`--foo` is silently discarded.

Finally, and most importantly, `platformCommand` or `command` is the command
that this plugin will execute when it is called. The `platformCommand` section
defines the OS/Architecture specific variations of a command. The following
rules will apply in deciding which command to use:

- If `platformCommand` is present, it will be searched first.
- If both `os` and `arch` match the current platform, search will stop and the
  command will be used.
- If `os` matches and there is no more specific `arch` match, the command will
  be used.
- If no `platformCommand` match is found, the default `command` will be used.
- If no matches are found in `platformCommand` and no `command` is present, Helm
  will exit with an error.

Environment variables are interpolated before the plugin is executed. The
pattern above illustrates the preferred way to indicate where the plugin program
lives.

There are some strategies for working with plugin commands:

- If a plugin includes an executable, the executable for a `platformCommand:` or
  a `command:` should be packaged in the plugin directory.
- The `platformCommand:` or `command:` line will have any environment variables
  expanded before execution. `$HELM_PLUGIN_DIR` will point to the plugin
  directory.
- The command itself is not executed in a shell. So you can't oneline a shell
  script.
- Helm injects lots of configuration into environment variables. Take a look at
  the environment to see what information is available.
- Helm makes no assumptions about the language of the plugin. You can write it
  in whatever you prefer.
- Commands are responsible for implementing specific help text for `-h` and
  `--help`. Helm will use `usage` and `description` for `helm help` and `helm
  help myplugin`, but will not handle `helm myplugin --help`.

## Downloader Plugins
By default, Helm is able to pull Charts using HTTP/S. As of Helm 2.4.0, plugins
can have a special capability to download Charts from arbitrary sources.

Plugins shall declare this special capability in the `plugin.yaml` file (top
level):

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

If such plugin is installed, Helm can interact with the repository using the
specified protocol scheme by invoking the `command`. The special repository
shall be added similarly to the regular ones: `helm repo add favorite
myprotocol://example.com/` The rules for the special repos are the same to the
regular ones: Helm must be able to download the `index.yaml` file in order to
discover and cache the list of available Charts.

The defined command will be invoked with the following scheme: `command certFile
keyFile caFile full-URL`. The SSL credentials are coming from the repo
definition, stored in `$XDG_DATA_HOME/helm/repositories.yaml`. Downloader plugin
is expected to dump the raw content to stdout and report errors on stderr.

The downloader command also supports sub-commands or arguments, allowing you to
specify for example `bin/mydownloader subcommand -d` in the `plugin.yaml`. This
is useful if you want to use the same executable for the main plugin command and
the downloader command, but with a different sub-command for each.

## Environment Variables

When Helm executes a plugin, it passes the outer environment to the plugin, and
also injects some additional environment variables.

Variables like `KUBECONFIG` are set for the plugin if they are set in the outer
environment.

The following variables are guaranteed to be set:

- `HELM_PLUGINS`: The path to the plugins directory.
- `HELM_PLUGIN_NAME`: The name of the plugin, as invoked by `helm`. So `helm
  myplug` will have the short name `myplug`.
- `HELM_PLUGIN_DIR`: The directory that contains the plugin.
- `HELM_BIN`: The path to the `helm` command (as executed by the user).
- `HELM_DEBUG`: Indicates if the debug flag was set by helm.
- `HELM_REGISTRY_CONFIG`: The location for the registry configuration (if
  using). Note that the use of Helm with registries is an experimental feature.
- `HELM_REPOSITORY_CACHE`: The path to the repository cache files.
- `HELM_REPOSITORY_CONFIG`: The path to the repository configuration file.
- `HELM_NAMESPACE`: The namespace given to the `helm` command (generally using
  the `-n` flag).
- `HELM_KUBECONTEXT`: The name of the Kubernetes config context given to the
  `helm` command.

Additionally, if a Kubernetes configuration file was explicitly specified, it
will be set as the `KUBECONFIG` variable

## A Note on Flag Parsing

When executing a plugin, Helm will parse global flags for its own use. None of
these flags are passed on to the plugin.

- `--debug`: If this is specified, `$HELM_DEBUG` is set to `1`
- `--registry-config`: This is converted to `$HELM_REGISTRY_CONFIG`
- `--repository-cache`: This is converted to `$HELM_REPOSITORY_CACHE`
- `--repository-config`: This is converted to `$HELM_REPOSITORY_CONFIG`
- `--namespace` and `-n`: This is converted to `$HELM_NAMESPACE`
- `--kube-context`: This is converted to `$HELM_KUBECONTEXT`
- `--kubeconfig`: This is converted to `$KUBECONFIG`

Plugins _should_ display help text and then exit for `-h` and `--help`. In all
other cases, plugins may use flags as appropriate.

## Providing shell auto-completion

As of Helm 3.2, a plugin can optionally provide support for shell
auto-completion as part of Helm's existing auto-completion mechanism.

### Static auto-completion

If a plugin provides its own flags and/or sub-commands, it can inform Helm of
them by having a `completion.yaml` file located in the plugin's root directory.
The `completion.yaml` file has the form:

```yaml
name: <pluginName>
flags:
- <flag 1>
- <flag 2>
validArgs:
- <arg value 1>
- <arg value 2>
commands:
  name: <commandName>
  flags:
  - <flag 1>
  - <flag 2>
  validArgs:
  - <arg value 1>
  - <arg value 2>
  commands:
     <and so on, recursively>
```

Notes:
1. All sections are optional but should be provided if applicable.
1. Flags should not include the `-` or `--` prefix.
1. Both short and long flags can and should be specified. A short flag need not
   be associated with its corresponding long form, but both forms should be
   listed.
1. Flags need not be ordered in any way, but need to be listed at the correct
   point in the sub-command hierarchy of the file.
1. Helm's existing global flags are already handled by Helm's auto-completion
   mechanism, therefore plugins need not specify the following flags `--debug`,
   `--namespace` or `-n`, `--kube-context`, and `--kubeconfig`, or any other
   global flag.
1. The `validArgs` list provides a static list of possible completions for the
   first parameter following a sub-command.  It is not always possible to
   provide such a list in advance (see the [Dynamic
   Completion](#dynamic-completion) section below), in which case the
   `validArgs` section can be omitted.

The `completion.yaml` file is entirely optional.  If it is not provided, Helm
will simply not provide shell auto-completion for the plugin (unless [Dynamic
Completion](#dynamic-completion) is supported by the plugin).  Also, adding a
`completion.yaml` file is backwards-compatible and will not impact the behavior
of the plugin when using older helm versions.

As an example, for the [`fullstatus
plugin`](https://github.com/marckhouzam/helm-fullstatus) which has no
sub-commands but accepts the same flags as the `helm status` command, the
`completion.yaml` file is:

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

A more intricate example for the [`2to3
plugin`](https://github.com/helm/helm-2to3), has a `completion.yaml` file of:

```yaml
name: 2to3
commands:
- name: cleanup
  flags:
  - config-cleanup
  - dry-run
  - l
  - label
  - release-cleanup
  - s
  - release-storage
  - tiller-cleanup
  - t
  - tiller-ns
  - tiller-out-cluster
- name: convert
  flags:
  - delete-v2-releases
  - dry-run
  - l
  - label
  - s
  - release-storage
  - release-versions-max
  - t
  - tiller-ns
  - tiller-out-cluster
- name: move
  commands:
  - name: config
    flags:
    - dry-run
```

### Dynamic completion

Also starting with Helm 3.2, plugins can provide their own dynamic shell
auto-completion. Dynamic shell auto-completion is the completion of parameter
values or flag values that cannot be defined in advance.  For example,
completion of the names of helm releases currently available on the cluster.

For the plugin to support dynamic auto-completion, it must provide an
**executable** file called `plugin.complete` in its root directory. When the
Helm completion script requires dynamic completions for the plugin, it will
execute the `plugin.complete` file, passing it the command-line that needs to be
completed.  The `plugin.complete` executable will need to have the logic to
determine what the proper completion choices are and output them to standard
output to be consumed by the Helm completion script.

The `plugin.complete` file is entirely optional.  If it is not provided, Helm
will simply not provide dynamic auto-completion for the plugin.  Also, adding a
`plugin.complete` file is backwards-compatible and will not impact the behavior
of the plugin when using older helm versions.

The output of the `plugin.complete` script should be a new-line separated list
such as:

```
rel1
rel2
rel3
```

When `plugin.complete` is called, the plugin environment is set just like when
the plugin's main script is called. Therefore, the variables `$HELM_NAMESPACE`,
`$HELM_KUBECONTEXT`, and all other plugin variables will already be set, and
their corresponding global flags will be removed.

The `plugin.complete` file can be in any executable form; it can be a shell
script, a Go program, or any other type of program that Helm can execute. The
`plugin.complete` file ***must*** have executable permissions for the user. The
`plugin.complete` file ***must*** exit with a success code (value 0).

In some cases, dynamic completion will require to obtain information from the
Kubernetes cluster.  For example, the `helm fullstatus` plugin requires a
release name as input. In the `fullstatus` plugin, for its `plugin.complete`
script to provide completion for current release names, it can simply run `helm
list -q` and output the result.

If it is desired to use the same executable for plugin execution and for plugin
completion, the `plugin.complete` script can be made to call the main plugin
executable with some special parameter or flag; when the main plugin executable
detects the special parameter or flag, it will know to run the completion. In
our example, `plugin.complete` could be implemented like this:

```sh
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

The `fullstatus` plugin's real script (`status.sh`) must then look for the
`--complete` flag and if found, printout the proper completions.

### Tips and tricks

1. The shell will automatically filter out completion choices that don't match
   user input. A plugin can therefore return all relevant completions without
   removing the ones that don't match the user input.  For example, if the
   command-line is `helm fullstatus ngin<TAB>`, the `plugin.complete` script can
   print *all* release names (of the `default` namespace), not just the ones
   starting with `ngin`; the shell will only retain the ones starting with
   `ngin`.
1. To simplify dynamic completion support, especially if you have a complex
   plugin, you can have your  `plugin.complete` script call your main plugin
   script and request completion choices.  See the [Dynamic
   Completion](#dynamic-completion) section above for an example.
1. To debug dynamic completion and the `plugin.complete` file, one can run the
   following to see the completion results :
    - `helm __complete <pluginName> <arguments to complete>`.  For example:
    - `helm __complete fullstatus --output js<ENTER>`,
    - `helm __complete fullstatus -o json ""<ENTER>`
