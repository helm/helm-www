---
title: Built-in Objects
description: Built-in objects available to templates.
sidebar_position: 3
---

Objects are passed into a template from the template engine. And your code can
pass objects around (we'll see examples when we look at the `with` and `range`
statements). There are even a few ways to create new objects within your
templates, like with the `tuple` function we'll see later.

Objects can be simple, and have just one value. Or they can contain other
objects or functions. For example, the `Release` object contains several objects
(like `Release.Name`) and the `Files` object has a few functions.

In the previous section, we use `{{ .Release.Name }}` to insert the name of a
release into a template. `Release` is one of the top-level objects that you can
access in your templates.

- `Release`: This object describes the release itself. It has several objects
  inside of it:
  - `Release.Name`: The release name
  - `Release.Namespace`: The namespace to be released into (if the manifest
    doesn’t override)
  - `Release.IsUpgrade`: This is set to `true` if the current operation is an
    upgrade or rollback.
  - `Release.IsInstall`: This is set to `true` if the current operation is an
    install.
  - `Release.Revision`: The revision number for this release. On install, this
    is 1, and it is incremented with each upgrade and rollback.
  - `Release.Service`: The service that is rendering the present template. On
    Helm, this is always `Helm`.
- `Values`: Values passed into the template from the `values.yaml` file and from
  user-supplied files. By default, `Values` is empty.
- `Chart`: The contents of the `Chart.yaml` file. Any data in `Chart.yaml` will
  be accessible here. For example `{{ .Chart.Name }}-{{ .Chart.Version }}` will
  print out the `mychart-0.1.0`.
  - The available fields are listed in the [Charts Guide](/topics/charts.mdx#the-chartyaml-file)
- `Subcharts`: This provides access to the scope (.Values, .Charts, .Releases etc.)
  of subcharts to the parent. For example `.Subcharts.mySubChart.myValue` to access
  the `myValue` in the `mySubChart` chart.
- `Files`: This provides access to all non-special files in a chart. While you
  cannot use it to access templates, you can use it to access other files in the
  chart. See the section [Accessing Files](/chart_template_guide/accessing_files.md) for more.
  - `Files.Get` is a function for getting a file by name (`.Files.Get
    config.ini`)
  - `Files.GetBytes` is a function for getting the contents of a file as an
    array of bytes instead of as a string. This is useful for things like
    images.
  - `Files.Glob` is a function that returns a list of files whose names match
    the given shell glob pattern.
  - `Files.Lines` is a function that reads a file line-by-line. This is useful
    for iterating over each line in a file.
  - `Files.AsSecrets` is a function that returns the file bodies as Base 64
    encoded strings.
  - `Files.AsConfig` is a function that returns file bodies as a YAML map.
- `Capabilities`: This provides information about what capabilities the
  Kubernetes cluster supports.
  - `Capabilities.APIVersions` is a set of versions.
  - `Capabilities.APIVersions.Has $version` indicates whether a version (e.g.,
    `batch/v1`) or resource (e.g., `apps/v1/Deployment`) is available on the
    cluster.
  - `Capabilities.KubeVersion` and `Capabilities.KubeVersion.Version` is the
    Kubernetes version.
  - `Capabilities.KubeVersion.Major` is the Kubernetes major version.
  - `Capabilities.KubeVersion.Minor` is the Kubernetes minor version.
  - `Capabilities.HelmVersion` is the object containing the Helm Version details, it is the same output of `helm version`.
  - `Capabilities.HelmVersion.Version` is the current Helm version in semver format.
  - `Capabilities.HelmVersion.GitCommit` is the Helm git sha1.
  - `Capabilities.HelmVersion.GitTreeState` is the state of the Helm git tree.
  - `Capabilities.HelmVersion.GoVersion` is the version of the Go compiler used.
- `Template`: Contains information about the current template that is being
  executed
  - `Template.Name`: A namespaced file path to the current template (e.g.
    `mychart/templates/mytemplate.yaml`)
  - `Template.BasePath`: The namespaced path to the templates directory of the current
    chart (e.g. `mychart/templates`).

The built-in values always begin with a capital letter. This is in keeping with
Go's naming convention. When you create your own names, you are free to use a
convention that suits your team. Some teams, like many whose charts you may see
on [Artifact Hub](https://artifacthub.io/packages/search?kind=0), choose to use
only initial lower case letters in order to distinguish local names from those
built-in. In this guide, we follow that convention.
