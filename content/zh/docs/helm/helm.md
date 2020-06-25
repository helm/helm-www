---
title: "Helm"
---

## helm

The Helm package manager for Kubernetes.

### Synopsis

The Kubernetes package manager

Common actions for Helm:

- helm search:    search for charts
- helm pull:      download a chart to your local directory to view
- helm install:   upload the chart to Kubernetes
- helm list:      list releases of charts

Environment variables:

| Name                               | Description                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------|
| $XDG_CACHE_HOME                    | set an alternative location for storing cached files.                             |
| $XDG_CONFIG_HOME                   | set an alternative location for storing Helm configuration.                       |
| $XDG_DATA_HOME                     | set an alternative location for storing Helm data.                                |
| $HELM_DRIVER                       | set the backend storage driver. Values are: configmap, secret, memory, postgres   |
| $HELM_DRIVER_SQL_CONNECTION_STRING | set the connection string the SQL storage driver should use.                      |
| $HELM_NO_PLUGINS                   | disable plugins. Set HELM_NO_PLUGINS=1 to disable plugins.                        |
| $KUBECONFIG                        | set an alternative Kubernetes configuration file (default "~/.kube/config")       |

Helm stores configuration based on the XDG base directory specification, so

- cached files are stored in $XDG_CACHE_HOME/helm
- configuration is stored in $XDG_CONFIG_HOME/helm
- data is stored in $XDG_DATA_HOME/helm

By default, the default directories depend on the Operating System. The defaults are listed below:

| Operating System | Cache Path                | Configuration Path             | Data Path               |
|------------------|---------------------------|--------------------------------|-------------------------|
| Linux            | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm |
| macOS            | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm      |
| Windows          | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm          |


### Options

```
      --add-dir-header                   If true, adds the file directory to the header
      --alsologtostderr                  log to standard error as well as files
      --debug                            enable verbose output
  -h, --help                             help for helm
      --kube-apiserver string            the address and the port for the Kubernetes API server
      --kube-context string              name of the kubeconfig context to use
      --kube-token string                bearer token used for authentication
      --kubeconfig string                path to the kubeconfig file
      --log-backtrace-at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                   If non-empty, write log files in this directory
      --log-file string                  If non-empty, use this log file
      --log-file-max-size uint           Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited. (default 1800)
      --logtostderr                      log to standard error instead of files (default true)
  -n, --namespace string                 namespace scope for this request
      --registry-config string           path to the registry config file (default "~/.config/helm/registry.json")
      --repository-cache string          path to the file containing cached repository indexes (default "~/snap/code/common/.cache/helm/repository")
      --repository-config string         path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
      --skip-headers                     If true, avoid header prefixes in the log messages
      --skip-log-headers                 If true, avoid headers when opening log files
      --stderrthreshold severity         logs at or above this threshold go to stderr (default 2)
  -v, --v Level                          number for the log level verbosity
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```

### SEE ALSO

* [helm completion](../helm_completion)	 - generate autocompletions script for the specified shell (bash or zsh)
* [helm create](../helm_create)	 - create a new chart with the given name
* [helm dependency](../helm_dependency)	 - manage a chart's dependencies
* [helm env](../helm_env)	 - helm client environment information
* [helm get](../helm_get)	 - download extended information of a named release
* [helm history](../helm_history)	 - fetch release history
* [helm install](../helm_install)	 - install a chart
* [helm lint](../helm_lint)	 - examine a chart for possible issues
* [helm list](../helm_list)	 - list releases
* [helm package](../helm_package)	 - package a chart directory into a chart archive
* [helm plugin](../helm_plugin)	 - install, list, or uninstall Helm plugins
* [helm pull](../helm_pull)	 - download a chart from a repository and (optionally) unpack it in local directory
* [helm repo](../helm_repo)	 - add, list, remove, update, and index chart repositories
* [helm rollback](../helm_rollback)	 - roll back a release to a previous revision
* [helm search](../helm_search)	 - search for a keyword in charts
* [helm show](../helm_show)	 - show information of a chart
* [helm status](../helm_status)	 - display the status of the named release
* [helm template](../helm_template)	 - locally render templates
* [helm test](../helm_test)	 - run tests for a release
* [helm uninstall](../helm_uninstall)	 - uninstall a release
* [helm upgrade](../helm_upgrade)	 - upgrade a release
* [helm verify](../helm_verify)	 - verify that a chart at the given path has been signed and is valid
* [helm version](../helm_version)	 - print the client version information

###### Auto generated by spf13/cobra on 11-May-2020
