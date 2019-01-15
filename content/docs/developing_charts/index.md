# Charts

Helm uses a packaging format called _charts_. A chart is a collection of files
that describe a related set of Kubernetes resources. A single chart
might be used to deploy something simple, like a memcached pod, or
something complex, like a full web app stack with HTTP servers,
databases, caches, and so on.

Charts are created as files laid out in a particular directory tree,
then they can be packaged into versioned archives to be deployed.

This document explains the chart format, and provides basic guidance for
building charts with Helm.

## The Chart File Structure

A chart is organized as a collection of files inside of a directory. The
directory name is the name of the chart (without versioning information). Thus,
a chart describing WordPress would be stored in the `wordpress/` directory.

Inside of this directory, Helm will expect a structure that matches this:

```
wordpress/
  Chart.yaml          # A YAML file containing information about the chart
  LICENSE             # OPTIONAL: A plain text file containing the license for the chart
  README.md           # OPTIONAL: A human-readable README file
  requirements.yaml   # OPTIONAL: A YAML file listing dependencies for the chart
  values.yaml         # The default configuration values for this chart
  charts/             # A directory containing any charts upon which this chart depends.
  templates/          # A directory of templates that, when combined with values,
                      # will generate valid Kubernetes manifest files.
  templates/NOTES.txt # OPTIONAL: A plain text file containing short usage notes
```

Helm reserves use of the `charts/` and `templates/` directories, and of
the listed file names. Other files will be left as they are.

## The Chart.yaml File

The `Chart.yaml` file is required for a chart. It contains the following fields:

```yaml
apiVersion: The chart API version, always "v1" (required)
name: The name of the chart (required)
version: A SemVer 2 version (required)
kubeVersion: A SemVer range of compatible Kubernetes versions (optional)
description: A single-sentence description of this project (optional)
keywords:
  - A list of keywords about this project (optional)
home: The URL of this project's home page (optional)
sources:
  - A list of URLs to source code for this project (optional)
maintainers: # (optional)
  - name: The maintainer's name (required for each maintainer)
    email: The maintainer's email (optional for each maintainer)
    url: A URL for the maintainer (optional for each maintainer)
engine: gotpl # The name of the template engine (optional, defaults to gotpl)
icon: A URL to an SVG or PNG image to be used as an icon (optional).
appVersion: The version of the app that this contains (optional). This needn't be SemVer.
deprecated: Whether this chart is deprecated (optional, boolean)
tillerVersion: The version of Tiller that this chart requires. This should be expressed as a SemVer range: ">2.0.0" (optional)
```

If you are familiar with the `Chart.yaml` file format for Helm Classic, you will
notice that fields specifying dependencies have been removed. That is because
the new Chart format expresses dependencies using the `charts/` directory.

Other fields will be silently ignored.

### Charts and Versioning

Every chart must have a version number. A version must follow the
[SemVer 2](http://semver.org/) standard. Unlike Helm Classic, Kubernetes
Helm uses version numbers as release markers. Packages in repositories
are identified by name plus version.

For example, an `nginx` chart whose version field is set to `version:
1.2.3` will be named:

```
nginx-1.2.3.tgz
```

More complex SemVer 2 names are also supported, such as
`version: 1.2.3-alpha.1+ef365`. But non-SemVer names are explicitly
disallowed by the system.

**NOTE:** Whereas Helm Classic and Deployment Manager were both
very GitHub oriented when it came to charts, Kubernetes Helm does not
rely upon or require GitHub or even Git. Consequently, it does not use
Git SHAs for versioning at all.

The `version` field inside of the `Chart.yaml` is used by many of the
Helm tools, including the CLI and the Tiller server. When generating a
package, the `helm package` command will use the version that it finds
in the `Chart.yaml` as a token in the package name. The system assumes
that the version number in the chart package name matches the version number in
the `Chart.yaml`. Failure to meet this assumption will cause an error.

### The appVersion field

Note that the `appVersion` field is not related to the `version` field. It is
a way of specifying the version of the application. For example, the `drupal`
chart may have an `appVersion: 8.2.1`, indicating that the version of Drupal
included in the chart (by default) is `8.2.1`. This field is informational, and
has no impact on chart version calculations.

### Deprecating Charts

When managing charts in a Chart Repository, it is sometimes necessary to
deprecate a chart. The optional `deprecated` field in `Chart.yaml` can be used
to mark a chart as deprecated. If the **latest** version of a chart in the
repository is marked as deprecated, then the chart as a whole is considered to
be deprecated. The chart name can later be reused by publishing a newer version
that is not marked as deprecated. The workflow for deprecating charts, as
followed by the [helm/charts](https://github.com/helm/charts)
project is:

- Update chart's `Chart.yaml` to mark the chart as deprecated, bumping the version
- Release the new chart version in the Chart Repository
- Remove the chart from the source repository (e.g. git)

## Chart LICENSE, README and NOTES

Charts can also contain files that describe the installation, configuration, usage and license of a
chart.

A LICENSE is a plain text file containing the [license](https://en.wikipedia.org/wiki/Software_license)
for the chart. The chart can contain a license as it may have programming logic in the templates and
would therefore not be configuration only. There can also be separate license(s) for the application
installed by the chart, if required.

A README for a chart should be formatted in Markdown (README.md), and should generally
contain:

- A description of the application or service the chart provides
- Any prerequisites or requirements to run the chart
- Descriptions of options in `values.yaml` and default values
- Any other information that may be relevant to the installation or configuration of the chart

The chart can also contain a short plain text `templates/NOTES.txt` file that will be printed out
after installation, and when viewing the status of a release. This file is evaluated as a
[template](#templates-and-values), and can be used to display usage notes, next steps, or any other
information relevant to a release of the chart. For example, instructions could be provided for
connecting to a database, or accessing a web UI. Since this file is printed to STDOUT when running
`helm install` or `helm status`, it is recommended to keep the content brief and point to the README
for greater detail.

## Chart Dependencies

In Helm, one chart may depend on any number of other charts.
These dependencies can be dynamically linked through the `requirements.yaml`
file or brought in to the `charts/` directory and managed manually.

Although manually managing your dependencies has a few advantages some teams need,
the preferred method of declaring dependencies is by using a
`requirements.yaml` file inside of your chart.

**Note:** The `dependencies:` section of the `Chart.yaml` from Helm
Classic has been completely removed.

### Managing Dependencies with `requirements.yaml`

A `requirements.yaml` file is a simple file for listing your
dependencies.

```yaml
dependencies:
  - name: apache
    version: 1.2.3
    repository: http://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: http://another.example.com/charts
```

- The `name` field is the name of the chart you want.
- The `version` field is the version of the chart you want.
- The `repository` field is the full URL to the chart repository. Note
  that you must also use `helm repo add` to add that repo locally.

Once you have a dependencies file, you can run `helm dependency update`
and it will use your dependency file to download all the specified
charts into your `charts/` directory for you.

```console
$ helm dep up foochart
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "example" chart repository
...Successfully got an update from the "another" chart repository
Update Complete. Happy Helming!
Saving 2 charts
Downloading apache from repo http://example.com/charts
Downloading mysql from repo http://another.example.com/charts
```

When `helm dependency update` retrieves charts, it will store them as
chart archives in the `charts/` directory. So for the example above, one
would expect to see the following files in the charts directory:

```
charts/
  apache-1.2.3.tgz
  mysql-3.2.1.tgz
```

Managing charts with `requirements.yaml` is a good way to easily keep
charts updated, and also share requirements information throughout a
team.

#### Alias field in requirements.yaml

In addition to the other fields above, each requirements entry may contain
the optional field `alias`.

Adding an alias for a dependency chart would put
a chart in dependencies using alias as name of new dependency.

One can use `alias` in cases where they need to access a chart
with other name(s).

```yaml
# parentchart/requirements.yaml
dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-1
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-2
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
```

In the above example we will get 3 dependencies in all for `parentchart`

```
subchart
new-subchart-1
new-subchart-2
```

The manual way of achieving this is by copy/pasting the same chart in the
`charts/` directory multiple times with different names.

#### Tags and Condition fields in requirements.yaml

In addition to the other fields above, each requirements entry may contain
the optional fields `tags` and `condition`.

All charts are loaded by default. If `tags` or `condition` fields are present,
they will be evaluated and used to control loading for the chart(s) they are applied to.

Condition - The condition field holds one or more YAML paths (delimited by commas).
If this path exists in the top parent's values and resolves to a boolean value,
the chart will be enabled or disabled based on that boolean value.  Only the first
valid path found in the list is evaluated and if no paths exist then the condition has no effect.

Tags - The tags field is a YAML list of labels to associate with this chart.
In the top parent's values, all charts with tags can be enabled or disabled by
specifying the tag and a boolean value.

```yaml
# parentchart/requirements.yaml
dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart1.enabled,global.subchart1.enabled
    tags:
      - front-end
      - subchart1

  - name: subchart2
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart2.enabled,global.subchart2.enabled
    tags:
      - back-end
      - subchart2

```

```yaml
# parentchart/values.yaml

subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

In the above example all charts with the tag `front-end` would be disabled but since the
`subchart1.enabled` path evaluates to 'true' in the parent's values, the condition will override the
`front-end` tag and `subchart1` will be enabled.

Since `subchart2` is tagged with `back-end` and that tag evaluates to `true`, `subchart2` will be
enabled. Also notes that although `subchart2` has a condition specified in `requirements.yaml`, there
is no corresponding path and value in the parent's values so that condition has no effect.

##### Using the CLI with Tags and Conditions

The `--set` parameter can be used as usual to alter tag and condition values.

````
helm install --set tags.front-end=true --set subchart2.enabled=false
````

##### Tags and Condition Resolution

- **Conditions (when set in values) always override tags.**
- The first condition path that exists wins and subsequent ones for that chart are ignored.
- Tags are evaluated as 'if any of the chart's tags are true then enable the chart'.
- Tags and conditions values must be set in the top parent's values.
- The `tags:` key in values must be a top level key. Globals and nested `tags:` tables
    are not currently supported.

#### Importing Child Values via requirements.yaml

In some cases it is desirable to allow a child chart's values to propagate to the parent chart and be
shared as common defaults. An additional benefit of using the `exports` format is that it will enable future
tooling to introspect user-settable values.

The keys containing the values to be imported can be specified in the parent chart's `requirements.yaml` file
using a YAML list. Each item in the list is a key which is imported from the child chart's `exports` field.

To import values not contained in the `exports` key, use the [child-parent](#using-the-child-parent-format) format.
Examples of both formats are described below.

##### Using the exports format

If a child chart's `values.yaml` file contains an `exports` field at the root, its contents may be imported
directly into the parent's values by specifying the keys to import as in the example below:

```yaml
# parent's requirements.yaml file
    ...
    import-values:
      - data
```

```yaml
# child's values.yaml file
...
exports:
  data:
    myint: 99
```

Since we are specifying the key `data` in our import list, Helm looks in the `exports` field of the child
chart for `data` key and imports its contents.

The final parent values would contain our exported field:

```yaml
# parent's values file
...
myint: 99

```

Please note the parent key `data` is not contained in the parent's final values. If you need to specify the
parent key, use the 'child-parent' format.

##### Using the child-parent format

To access values that are not contained in the `exports` key of the child chart's values, you will need to
specify the source key of the values to be imported (`child`) and the destination path in the parent chart's
values (`parent`).

The `import-values` in the example below instructs Helm to take any values found at `child:` path and copy them
to the parent's values at the path specified in `parent:`

```yaml
# parent's requirements.yaml file
dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    ...
    import-values:
      - child: default.data
        parent: myimports
```

In the above example, values found at `default.data` in the subchart1's values will be imported
to the `myimports` key in the parent chart's values as detailed below:

```yaml
# parent's values.yaml file

myimports:
  myint: 0
  mybool: false
  mystring: "helm rocks!"

```

```yaml
# subchart1's values.yaml file

default:
  data:
    myint: 999
    mybool: true

```

The parent chart's resulting values would be:

```yaml
# parent's final values

myimports:
  myint: 999
  mybool: true
  mystring: "helm rocks!"

```

The parent's final values now contains the `myint` and `mybool` fields imported from subchart1.

### Managing Dependencies manually via the `charts/` directory

If more control over dependencies is desired, these dependencies can
be expressed explicitly by copying the dependency charts into the
`charts/` directory.

A dependency can be either a chart archive (`foo-1.2.3.tgz`) or an
unpacked chart directory. But its name cannot start with `_` or `.`.
Such files are ignored by the chart loader.

For example, if the WordPress chart depends on the Apache chart, the
Apache chart (of the correct version) is supplied in the WordPress
chart's `charts/` directory:

```
wordpress:
  Chart.yaml
  requirements.yaml
  # ...
  charts/
    apache/
      Chart.yaml
      # ...
    mysql/
      Chart.yaml
      # ...
```

The example above shows how the WordPress chart expresses its dependency
on Apache and MySQL by including those charts inside of its `charts/`
directory.

**TIP:** _To drop a dependency into your `charts/` directory, use the
`helm fetch` command_

### Operational aspects of using dependencies

The above sections explain how to specify chart dependencies, but how does this affect
chart installation using `helm install` and `helm upgrade`?

Suppose that a chart named "A" creates the following Kubernetes objects

- namespace "A-Namespace"
- statefulset "A-StatefulSet"
- service "A-Service"

Furthermore, A is dependent on chart B that creates objects

- namespace "B-Namespace"
- replicaset "B-ReplicaSet"
- service "B-Service"

After installation/upgrade of chart A a single Helm release is created/modified. The release will
create/update all of the above Kubernetes objects in the following order:

- A-Namespace
- B-Namespace
- A-StatefulSet
- B-ReplicaSet
- A-Service
- B-Service

This is because when Helm installs/upgrades charts,
the Kubernetes objects from the charts and all its dependencies are

- aggregrated into a single set; then
- sorted by type followed by name; and then
- created/updated in that order.

Hence a single release is created with all the objects for the chart and its dependencies.

The install order of Kubernetes types is given by the enumeration InstallOrder in kind_sorter.go
(see [the Helm source file](https://github.com/helm/helm/blob/master/pkg/tiller/kind_sorter.go#L26)).

## Templates and Values

Helm Chart templates are written in the
[Go template language](https://golang.org/pkg/text/template/), with the
addition of 50 or so add-on template
functions [from the Sprig library](https://github.com/Masterminds/sprig) and a
few other [specialized functions](./#chart-development-tips-and-tricks).

All template files are stored in a chart's `templates/` folder. When
Helm renders the charts, it will pass every file in that directory
through the template engine.

Values for the templates are supplied two ways:

- Chart developers may supply a file called `values.yaml` inside of a
  chart. This file can contain default values.
- Chart users may supply a YAML file that contains values. This can be
  provided on the command line with `helm install`.

When a user supplies custom values, these values will override the
values in the chart's `values.yaml` file.

### Template Files

Template files follow the standard conventions for writing Go templates
(see [the text/template Go package documentation](https://golang.org/pkg/text/template/)
for details).
An example template file might look something like this:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{.Values.imageRegistry}}/postgres:{{.Values.dockerTag}}
          imagePullPolicy: {{.Values.pullPolicy}}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{default "minio" .Values.storage}}
```

The above example, based loosely on [https://github.com/deis/charts](https://github.com/deis/charts), is a template for a Kubernetes replication controller.
It can use the following four template values (usually defined in a
`values.yaml` file):

- `imageRegistry`: The source registry for the Docker image.
- `dockerTag`: The tag for the docker image.
- `pullPolicy`: The Kubernetes pull policy.
- `storage`: The storage backend, whose default is set to `"minio"`

All of these values are defined by the template author. Helm does not
require or dictate parameters.

To see many working charts, check out the [Helm Charts
project](https://github.com/helm/charts)

### Predefined Values

Values that are supplied via a `values.yaml` file (or via the `--set`
flag) are accessible from the `.Values` object in a template. But there
are other pre-defined pieces of data you can access in your templates.

The following values are pre-defined, are available to every template, and
cannot be overridden. As with all values, the names are _case
sensitive_.

- `Release.Name`: The name of the release (not the chart)
- `Release.Time`: The time the chart release was last updated. This will
  match the `Last Released` time on a Release object.
- `Release.Namespace`: The namespace the chart was released to.
- `Release.Service`: The service that conducted the release. Usually
  this is `Tiller`.
- `Release.IsUpgrade`: This is set to true if the current operation is an upgrade or rollback.
- `Release.IsInstall`: This is set to true if the current operation is an
  install.
- `Release.Revision`: The revision number. It begins at 1, and increments with
  each `helm upgrade`.
- `Chart`: The contents of the `Chart.yaml`. Thus, the chart version is
  obtainable as `Chart.Version` and the maintainers are in
  `Chart.Maintainers`.
- `Files`: A map-like object containing all non-special files in the chart. This
  will not give you access to templates, but will give you access to additional
  files that are present (unless they are excluded using `.helmignore`). Files can be
  accessed using `{{index .Files "file.name"}}` or using the `{{.Files.Get name}}` or
  `{{.Files.GetString name}}` functions. You can also access the contents of the file
  as `[]byte` using `{{.Files.GetBytes}}`
- `Capabilities`: A map-like object that contains information about the versions
  of Kubernetes (`{{.Capabilities.KubeVersion}}`, Tiller
  (`{{.Capabilities.TillerVersion}}`, and the supported Kubernetes API versions
  (`{{.Capabilities.APIVersions.Has "batch/v1"`)

**NOTE:** Any unknown Chart.yaml fields will be dropped. They will not
be accessible inside of the `Chart` object. Thus, Chart.yaml cannot be
used to pass arbitrarily structured data into the template. The values
file can be used for that, though.

### Values files

Considering the template in the previous section, a `values.yaml` file
that supplies the necessary values would look like this:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

A values file is formatted in YAML. A chart may include a default
`values.yaml` file. The Helm install command allows a user to override
values by supplying additional YAML values:

```console
$ helm install --values=myvals.yaml wordpress
```

When values are passed in this way, they will be merged into the default
values file. For example, consider a `myvals.yaml` file that looks like
this:

```yaml
storage: "gcs"
```

When this is merged with the `values.yaml` in the chart, the resulting
generated content will be:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"
```

Note that only the last field was overridden.

**NOTE:** The default values file included inside of a chart _must_ be named
`values.yaml`. But files specified on the command line can be named
anything.

**NOTE:** If the `--set` flag is used on `helm install` or `helm upgrade`, those
values are simply converted to YAML on the client side.

**NOTE:** If any required entries in the values file exist, they can be declared
as required in the chart template by using the ['required' function](./#chart-development-tips-and-tricks)

Any of these values are then accessible inside of templates using the
`.Values` object:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{.Values.imageRegistry}}/postgres:{{.Values.dockerTag}}
          imagePullPolicy: {{.Values.pullPolicy}}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{default "minio" .Values.storage}}

```

### Scope, Dependencies, and Values

Values files can declare values for the top-level chart, as well as for
any of the charts that are included in that chart's `charts/` directory.
Or, to phrase it differently, a values file can supply values to the
chart as well as to any of its dependencies. For example, the
demonstration WordPress chart above has both `mysql` and `apache` as
dependencies. The values file could supply values to all of these
components:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

Charts at a higher level have access to all of the variables defined
beneath. So the WordPress chart can access the MySQL password as
`.Values.mysql.password`. But lower level charts cannot access things in
parent charts, so MySQL will not be able to access the `title` property. Nor,
for that matter, can it access `apache.port`.

Values are namespaced, but namespaces are pruned. So for the WordPress
chart, it can access the MySQL password field as `.Values.mysql.password`. But
for the MySQL chart, the scope of the values has been reduced and the
namespace prefix removed, so it will see the password field simply as
`.Values.password`.

#### Global Values

As of 2.0.0-Alpha.2, Helm supports special "global" value. Consider
this modified version of the previous example:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

The above adds a `global` section with the value `app: MyWordPress`.
This value is available to _all_ charts as `.Values.global.app`.

For example, the `mysql` templates may access `app` as `{{.Values.global.app}}`, and
so can the `apache` chart. Effectively, the values file above is
regenerated like this:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  global:
    app: MyWordPress
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  global:
    app: MyWordPress
  port: 8080 # Passed to Apache
```

This provides a way of sharing one top-level variable with all
subcharts, which is useful for things like setting `metadata` properties
like labels.

If a subchart declares a global variable, that global will be passed
_downward_ (to the subchart's subcharts), but not _upward_ to the parent
chart. There is no way for a subchart to influence the values of the
parent chart.

Also, global variables of parent charts take precedence over the global variables from subcharts.

### References

When it comes to writing templates and values files, there are several
standard references that will help you out.

- [Go templates](https://godoc.org/text/template)
- [Extra template functions](https://godoc.org/github.com/Masterminds/sprig)
- [The YAML format](http://yaml.org/spec/)

## Using Helm to Manage Charts

The `helm` tool has several commands for working with charts.

It can create a new chart for you:

```console
$ helm create mychart
Created mychart/
```

Once you have edited a chart, `helm` can package it into a chart archive
for you:

```console
$ helm package mychart
Archived mychart-0.1.-.tgz
```

You can also use `helm` to help you find issues with your chart's
formatting or information:

```console
$ helm lint mychart
No issues found
```

## Chart Repositories

A _chart repository_ is an HTTP server that houses one or more packaged
charts. While `helm` can be used to manage local chart directories, when
it comes to sharing charts, the preferred mechanism is a chart
repository.

Any HTTP server that can serve YAML files and tar files and can answer
GET requests can be used as a repository server.

Helm comes with built-in package server for developer testing (`helm
serve`). The Helm team has tested other servers, including Google Cloud
Storage with website mode enabled, and S3 with website mode enabled.

A repository is characterized primarily by the presence of a special
file called `index.yaml` that has a list of all of the packages supplied
by the repository, together with metadata that allows retrieving and
verifying those packages.

On the client side, repositories are managed with the `helm repo`
commands. However, Helm does not provide tools for uploading charts to
remote repository servers. This is because doing so would add
substantial requirements to an implementing server, and thus raise the
barrier for setting up a repository.

## Chart Starter Packs

The `helm create` command takes an optional `--starter` option that lets you
specify a "starter chart".

Starters are just regular charts, but are located in `$HELM_HOME/starters`.
As a chart developer, you may author charts that are specifically designed
to be used as starters. Such charts should be designed with the following
considerations in mind:

- The `Chart.yaml` will be overwritten by the generator.
- Users will expect to modify such a chart's contents, so documentation
  should indicate how users can do so.
- All occurrences of `<CHARTNAME>` in files within the `templates` directory
  will be replaced with the specified chart name so that starter charts can be
  used as templates. Additionally, occurrences of `<CHARTNAME>` in
  `values.yaml` will also be replaced.

Currently the only way to add a chart to `$HELM_HOME/starters` is to manually
copy it there. In your chart's documentation, you may want to explain that
process.

# Hooks

Helm provides a _hook_ mechanism to allow chart developers to intervene
at certain points in a release's life cycle. For example, you can use
hooks to:

- Load a ConfigMap or Secret during install before any other charts are
  loaded.
- Execute a Job to back up a database before installing a new chart,
  and then execute a second job after the upgrade in order to restore
  data.
- Run a Job before deleting a release to gracefully take a service out
  of rotation before removing it.

Hooks work like regular templates, but they have special annotations
that cause Helm to utilize them differently. In this section, we cover
the basic usage pattern for hooks.

Hooks are declared as an annotation in the metadata section of a manifest:

```yaml
apiVersion: ...
kind: ....
metadata:
  annotations:
    "helm.sh/hook": "pre-install"
# ...
```

## The Available Hooks

The following hooks are defined:

- pre-install: Executes after templates are rendered, but before any
  resources are created in Kubernetes.
- post-install: Executes after all resources are loaded into Kubernetes
- pre-delete: Executes on a deletion request before any resources are
  deleted from Kubernetes.
- post-delete: Executes on a deletion request after all of the release's
  resources have been deleted.
- pre-upgrade: Executes on an upgrade request after templates are
  rendered, but before any resources are loaded into Kubernetes (e.g.
  before a Kubernetes apply operation).
- post-upgrade: Executes on an upgrade after all resources have been
  upgraded.
- pre-rollback: Executes on a rollback request after templates are
  rendered, but before any resources have been rolled back.
- post-rollback: Executes on a rollback request after all resources
  have been modified.
- crd-install: Adds CRD resources before any other checks are run. This is used
  only on CRD definitions that are used by other manifests in the chart.

## Hooks and the Release Lifecycle

Hooks allow you, the chart developer, an opportunity to perform
operations at strategic points in a release lifecycle. For example,
consider the lifecycle for a `helm install`. By default, the lifecycle
looks like this:

1. User runs `helm install foo`
2. Chart is loaded into Tiller
3. After some verification, Tiller renders the `foo` templates
4. Tiller loads the resulting resources into Kubernetes
5. Tiller returns the release name (and other data) to the client
6. The client exits

Helm defines two hooks for the `install` lifecycle: `pre-install` and
`post-install`. If the developer of the `foo` chart implements both
hooks, the lifecycle is altered like this:

1. User runs `helm install foo`
2. Chart is loaded into Tiller
3. After some verification, Tiller renders the `foo` templates
4. Tiller prepares to execute the `pre-install` hooks (loading hook resources into
   Kubernetes)
5. Tiller sorts hooks by weight (assigning a weight of 0 by default) and by name for those hooks with the same weight in ascending order.
6. Tiller then loads the hook with the lowest weight first (negative to positive)
7. Tiller waits until the hook is "Ready" (except for CRDs)
8. Tiller loads the resulting resources into Kubernetes. Note that if the `--wait` 
flag is set, Tiller will wait until all resources are in a ready state
and will not run the `post-install` hook until they are ready.
9. Tiller executes the `post-install` hook (loading hook resources)
10. Tiller waits until the hook is "Ready"
11. Tiller returns the release name (and other data) to the client
12. The client exits

What does it mean to wait until a hook is ready? This depends on the
resource declared in the hook. If the resources is a `Job` kind, Tiller
will wait until the job successfully runs to completion. And if the job
fails, the release will fail. This is a _blocking operation_, so the
Helm client will pause while the Job is run.

For all other kinds, as soon as Kubernetes marks the resource as loaded
(added or updated), the resource is considered "Ready". When many
resources are declared in a hook, the resources are executed serially. If they
have hook weights (see below), they are executed in weighted order. Otherwise,
ordering is not guaranteed. (In Helm 2.3.0 and after, they are sorted
alphabetically. That behavior, though, is not considered binding and could change
in the future.) It is considered good practice to add a hook weight, and set it
to `0` if weight is not important.


### Hook resources are not managed with corresponding releases

The resources that a hook creates are not tracked or managed as part of the
release. Once Tiller verifies that the hook has reached its ready state, it
will leave the hook resource alone.

Practically speaking, this means that if you create resources in a hook, you
cannot rely upon `helm delete` to remove the resources. To destroy such
resources, you need to either write code to perform this operation in a `pre-delete`
or `post-delete` hook or add `"helm.sh/hook-delete-policy"` annotation to the hook template file.

## Writing a Hook

Hooks are just Kubernetes manifest files with special annotations in the
`metadata` section. Because they are template files, you can use all of
the normal template features, including reading `.Values`, `.Release`,
and `.Template`.

For example, this template, stored in `templates/post-install-job.yaml`,
declares a job to be run on `post-install`:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{.Release.Name}}"
  labels:
    app.kubernetes.io/managed-by: {{.Release.Service | quote }}
    app.kubernetes.io/instance: {{.Release.Name | quote }}
    helm.sh/chart: "{{.Chart.Name}}-{{.Chart.Version}}"
  annotations:
    # This is what defines this resource as a hook. Without this line, the
    # job is considered part of the release.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{.Release.Name}}"
      labels:
        app.kubernetes.io/managed-by: {{.Release.Service | quote }}
        app.kubernetes.io/instance: {{.Release.Name | quote }}
        helm.sh/chart: "{{.Chart.Name}}-{{.Chart.Version}}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{default "10" .Values.sleepyTime}}"]

```

What makes this template a hook is the annotation:

```
  annotations:
    "helm.sh/hook": post-install
```

One resource can implement multiple hooks:

```
  annotations:
    "helm.sh/hook": post-install,post-upgrade
```

Similarly, there is no limit to the number of different resources that
may implement a given hook. For example, one could declare both a secret
and a config map as a pre-install hook.

When subcharts declare hooks, those are also evaluated. There is no way
for a top-level chart to disable the hooks declared by subcharts.

It is possible to define a weight for a hook which will help build a
deterministic executing order. Weights are defined using the following annotation:

```
  annotations:
    "helm.sh/hook-weight": "5"
```

Hook weights can be positive or negative numbers but must be represented as
strings. When Tiller starts the execution cycle of hooks of a particular kind (ex. the `pre-install` hooks or `post-install` hooks, etc.) it will sort those hooks in ascending order.

It is also possible to define policies that determine when to delete corresponding hook resources. Hook deletion policies are defined using the following annotation:

```
  annotations:
    "helm.sh/hook-delete-policy": hook-succeeded
```

You can choose one or more defined annotation values:

* `"hook-succeeded"` specifies Tiller should delete the hook after the hook is successfully executed.
* `"hook-failed"` specifies Tiller should delete the hook if the hook failed during execution.
* `"before-hook-creation"` specifies Tiller should delete the previous hook before the new hook is launched.

### Defining a CRD with the `crd-install` Hook

Custom Resource Definitions (CRDs) are a special kind in Kubernetes. They provide
a way to define other kinds.

On occasion, a chart needs to both define a kind and then use it. This is done
with the `crd-install` hook.

The `crd-install` hook is executed very early during an installation, before
the rest of the manifests are verified. CRDs can be annotated with this hook so
that they are installed before any instances of that CRD are referenced. In this
way, when verification happens later, the CRDs will be available.

Here is an example of defining a CRD with a hook, and an instance of the CRD:

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
  annotations:
    "helm.sh/hook": crd-install
spec:
  group: stable.example.com
  version: v1
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

And:

```yaml
apiVersion: stable.example.com/v1
kind: CronTab
metadata:
  name: {{ .Release.Name }}-inst
```

Both of these can now be in the same chart, provided that the CRD is correctly
annotated.

### Automatically delete hook from previous release

When helm release being updated it is possible, that hook resource already exists in cluster. By default helm will try to create resource and fail with `"... already exists"` error.

One might choose `"helm.sh/hook-delete-policy": "before-hook-creation"` over `"helm.sh/hook-delete-policy": "hook-succeeded,hook-failed"` because:

* It is convenient to keep failed hook job resource in kubernetes for example for manual debug.
* It may be necessary to keep succeeded hook resource in kubernetes for some reason.
* At the same time it is not desirable to do manual resource deletion before helm release upgrade.

`"helm.sh/hook-delete-policy": "before-hook-creation"` annotation on hook causes tiller to remove the hook from previous release if there is one before the new hook is launched and can be used with another policy.

# Chart Development Tips and Tricks

This guide covers some of the tips and tricks Helm chart developers have
learned while building production-quality charts.

## Know Your Template Functions

Helm uses [Go templates](https://godoc.org/text/template) for templating
your resource files. While Go ships several built-in functions, we have
added many others.

First, we added almost all of the functions in the
[Sprig library](https://godoc.org/github.com/Masterminds/sprig). We removed two
for security reasons: `env` and `expandenv` (which would have given chart authors
access to Tiller's environment).

We also added two special template functions: `include` and `required`. The `include`
function allows you to bring in another template, and then pass the results to other
template functions.

For example, this template snippet includes a template called `mytpl`, then
lowercases the result, then wraps that in double quotes.

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

The `required` function allows you to declare a particular
values entry as required for template rendering. If the value is empty, the template
rendering will fail with a user submitted error message.

The following example of the `required` function declares an entry for .Values.who
is required, and will print an error message when that entry is missing:

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## Quote Strings, Don't Quote Integers

When you are working with string data, you are always safer quoting the
strings than leaving them as bare words:

```yaml
name: {{ .Values.MyName | quote }}
```

But when working with integers _do not quote the values._ That can, in
many cases, cause parsing errors inside of Kubernetes.

```yaml
port: {{ .Values.Port }}
```

This remark does not apply to env variables values which are expected to be string, even if they represent integers:

```yaml
env:
  -name: HOST
    value: "http://host"
  -name: PORT
    value: "1234"
```

## Using the 'include' Function

Go provides a way of including one template in another using a built-in
`template` directive. However, the built-in function cannot be used in
Go template pipelines.

To make it possible to include a template, and then perform an operation
on that template's output, Helm has a special `include` function:

```gotpl
{{- include "toYaml" $value | nindent 2 }}
```

The above includes a template called `toYaml`, passes it `$value`, and
then passes the output of that template to the `nindent` function. Using
the `{{- ... | nindent _n_ }}` pattern makes it easier to read the `include`
in context, because it chomps the whitespace to the left (including the
previous newline), then the `nindent` re-adds the newline and indents
the included content by the requested amount.

Because YAML ascribes significance to indentation levels and whitespace,
this is one great way to include snippets of code, but handle
indentation in a relevant context.

## Using the 'required' function

Go provides a way for setting template options to control behavior
when a map is indexed with a key that's not present in the map. This
is typically set with template.Options("missingkey=option"), where option
can be default, zero, or error. While setting this option to error will
stop execution with an error, this would apply to every missing key in the
map. There may be situations where a chart developer wants to enforce this
behavior for select values in the values.yml file.

The `required` function gives developers the ability to declare a value entry
as required for template rendering. If the entry is empty in values.yml, the
template will not render and will return an error message supplied by the
developer.

For example:

```gotpl
{{ required "A valid foo is required!" .Values.foo }}
```

The above will render the template when .Values.foo is defined, but will fail
to render and exit when .Values.foo is undefined.

## Using the 'tpl' Function

The `tpl` function allows developers to evaluate strings as templates inside a template.
This is useful to pass a template string as a value to a chart or render external configuration files.
Syntax: `{{ tpl TEMPLATE_STRING VALUES }}`

Examples:

```yaml
# values
template: "{{ .Values.name }}"
name: "Tom"

# template
{{ tpl .Values.template . }}

# output
Tom
```

Rendering a external configuration file:

```yaml
# external configuration file conf/app.conf
firstName={{ .Values.firstName }}
lastName={{ .Values.lastName }}

# values
firstName: Peter
lastName: Parker

# template
{{ tpl (.Files.Get "conf/app.conf") . }}

# output
firstName=Peter
lastName=Parker
```

## Creating Image Pull Secrets

Image pull secrets are essentially a combination of _registry_, _username_, and _password_. You may need them in an application you are deploying, but to create them requires running _base64_ a couple of times. We can write a helper template to compose the Docker configuration file for use as the Secret's payload. Here is an example:

First, assume that the credentials are defined in the `values.yaml` file like so:

```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
```

We then define our helper template as follows:

```gotpl
{{- define "imagePullSecret" }}
{{- printf "{\"auths\": {\"%s\": {\"auth\": \"%s\"}}}" .Values.imageCredentials.registry (printf "%s:%s" .Values.imageCredentials.username .Values.imageCredentials.password | b64enc) | b64enc }}
{{- end }}
```

Finally, we use the helper template in a larger template to create the Secret manifest:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## Automatically Roll Deployments When ConfigMaps or Secrets change

Often times configmaps or secrets are injected as configuration
files in containers.
Depending on the application a restart may be required should those
be updated with a subsequent `helm upgrade`, but if the
deployment spec itself didn't change the application keeps running
with the old configuration resulting in an inconsistent deployment.

The `sha256sum` function can be used to ensure a deployment's
annotation section is updated if another file changes:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

See also the `helm upgrade --recreate-pods` flag for a slightly
different way of addressing this issue.

## Tell Tiller Not To Delete a Resource

Sometimes there are resources that should not be deleted when Helm runs a
`helm delete`. Chart developers can add an annotation to a resource to prevent
it from being deleted.

```yaml
kind: Secret
metadata:
  annotations:
    "helm.sh/resource-policy": keep
[...]
```

(Quotation marks are required)

The annotation `"helm.sh/resource-policy": keep` instructs Tiller to skip this
resource during a `helm delete` operation. _However_, this resource becomes
orphaned. Helm will no longer manage it in any way. This can lead to problems
if using `helm install --replace` on a release that has already been deleted, but
has kept resources.

## Using "Partials" and Template Includes

Sometimes you want to create some reusable parts in your chart, whether
they're blocks or template partials. And often, it's cleaner to keep
these in their own files.

In the `templates/` directory, any file that begins with an
underscore(`_`) is not expected to output a Kubernetes manifest file. So
by convention, helper templates and partials are placed in a
`_helpers.tpl` file.

## Complex Charts with Many Dependencies

Many of the charts in the [official charts repository](https://github.com/helm/charts)
are "building blocks" for creating more advanced applications. But charts may be
used to create instances of large-scale applications. In such cases, a single
umbrella chart may have multiple subcharts, each of which functions as a piece
of the whole.

The current best practice for composing a complex application from discrete parts
is to create a top-level umbrella chart that
exposes the global configurations, and then use the `charts/` subdirectory to
embed each of the components.

Two strong design patterns are illustrated by these projects:

**SAP's [OpenStack chart](https://github.com/sapcc/openstack-helm):** This chart
installs a full OpenStack IaaS on Kubernetes. All of the charts are collected
together in one GitHub repository.

**Deis's [Workflow](https://github.com/deis/workflow/tree/master/charts/workflow):**
This chart exposes the entire Deis PaaS system with one chart. But it's different
from the SAP chart in that this umbrella chart is built from each component, and
each component is tracked in a different Git repository. Check out the
`requirements.yaml` file to see how this chart is composed by their CI/CD
pipeline.

Both of these charts illustrate proven techniques for standing up complex environments
using Helm.

## YAML is a Superset of JSON

According to the YAML specification, YAML is a superset of JSON. That
means that any valid JSON structure ought to be valid in YAML.

This has an advantage: Sometimes template developers may find it easier
to express a datastructure with a JSON-like syntax rather than deal with
YAML's whitespace sensitivity.

As a best practice, templates should follow a YAML-like syntax _unless_
the JSON syntax substantially reduces the risk of a formatting issue.

## Be Careful with Generating Random Values

There are functions in Helm that allow you to generate random data,
cryptographic keys, and so on. These are fine to use. But be aware that
during upgrades, templates are re-executed. When a template run
generates data that differs from the last run, that will trigger an
update of that resource.

## Upgrade a release idempotently

In order to use the same command when installing and upgrading a release, use the following command:

```shell
helm upgrade --install <release name> --values <values file> <chart directory>
```

# The Chart Repository Guide

This section explains how to create and work with Helm chart repositories. At a
high level, a chart repository is a location where packaged charts can be
stored and shared.

The official chart repository is maintained by the
[Helm Charts](https://github.com/helm/charts), and we welcome
participation. But Helm also makes it easy to create and run your own chart
repository. This guide explains how to do so.

## Prerequisites

* Go through the [Quickstart](./#quickstart) Guide
* Read through the [Charts](./#charts) document

## Create a chart repository

A _chart repository_ is an HTTP server that houses an `index.yaml` file and
optionally some packaged charts.  When you're ready to share your charts, the
preferred way to do so is by uploading them to a chart repository.

**Note:** For Helm 2.0.0, chart repositories do not have any intrinsic
authentication. There is an [issue tracking progress](https://github.com/helm/helm/issues/1038)
in GitHub.

Because a chart repository can be any HTTP server that can serve YAML and tar
files and can answer GET requests, you have a plethora of options when it comes
down to hosting your own chart repository. For example, you can use a Google
Cloud Storage (GCS) bucket, Amazon S3 bucket, Github Pages, or even create your
own web server.

### The chart repository structure

A chart repository consists of packaged charts and a special file called
`index.yaml` which contains an index of all of the charts in the repository.
Frequently, the charts that `index.yaml` describes are also hosted on the same
server, as are the [provenance files](./#helm-provenance-and-integrity).

For example, the layout of the repository `https://example.com/charts` might
look like this:

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

In this case, the index file would contain information about one chart, the Alpine
chart, and provide the download URL `https://example.com/charts/alpine-0.1.2.tgz`
for that chart.

It is not required that a chart package be located on the same server as the
`index.yaml` file. However, doing so is often the easiest.

### The index file

The index file is a yaml file called `index.yaml`. It
contains some metadata about the package, including the contents of a
chart's `Chart.yaml` file. A valid chart repository must have an index file. The
index file contains information about each chart in the chart repository. The
`helm repo index` command will generate an index file based on a given local
directory that contains packaged charts.

This is an example of an index file:

```
apiVersion: v1
entries:
  alpine:
    - created: 2016-10-06T16:23:20.499814565-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 99c76e403d752c84ead610644d4b1c2f2b453a74b921f422b9dcb8a7c8b559cd
      home: https://k8s.io/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.2.0.tgz
      version: 0.2.0
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 515c58e5f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cd78727
      home: https://k8s.io/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.1.0.tgz
      version: 0.1.0
  nginx:
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Create a basic nginx HTTP server
      digest: aaff4545f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cdffffff
      home: https://k8s.io/helm
      name: nginx
      sources:
      - https://github.com/helm/charts
      urls:
      - https://technosophos.github.io/tscharts/nginx-1.1.0.tgz
      version: 1.1.0
generated: 2016-10-06T16:23:20.499029981-06:00
```

A generated index and packages can be served from a basic webserver. You can test
things out locally with the `helm serve` command, which starts a local server.

```console
$ helm serve --repo-path ./charts
Regenerating index. This may take a moment.
Now serving you on 127.0.0.1:8879
```

The above starts a local webserver, serving the charts it finds in `./charts`. The
serve command will automatically generate an `index.yaml` file for you during
startup.

## Hosting Chart Repositories

This part shows several ways to serve a chart repository.

### Google Cloud Storage

The first step is to **create your GCS bucket**. We'll call ours
`fantastic-charts`.

![Create a GCS Bucket](https://raw.githubusercontent.com/helm/helm/master/docs/images/create-a-bucket.png)

Next, make your bucket public by **editing the bucket permissions**.

![Edit Permissions](https://raw.githubusercontent.com/helm/helm/master/docs/images/edit-permissions.png)

Insert this line item to **make your bucket public**:

![Make Bucket Public](https://raw.githubusercontent.com/helm/helm/master/docs/images/make-bucket-public.png)

Congratulations, now you have an empty GCS bucket ready to serve charts!

You may upload your chart repository using the Google Cloud Storage command line
tool, or using the GCS web UI. This is the technique the official Kubernetes
Charts repository hosts its charts, so you may want to take a
[peek at that project](https://github.com/helm/charts) if you get stuck.

**Note:** A public GCS bucket can be accessed via simple HTTPS at this address
`https://bucket-name.storage.googleapis.com/`.

### JFrog Artifactory

You can also set up chart repositories using JFrog Artifactory.
Read more about chart repositories with JFrog Artifactory [here](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories)

### Github Pages example

In a similar way you can create charts repository using GitHub Pages.

GitHub allows you to serve static web pages in two different ways:

- By configuring a project to serve the contents of its `docs/` directory
- By configuring a project to serve a particular branch

We'll take the second approach, though the first is just as easy.

The first step will be to **create your gh-pages branch**.  You can do that
locally as.

```console
$ git checkout -b gh-pages
```

Or via web browser using **Branch** button on your Github repository:

![Create Github Pages branch](https://raw.githubusercontent.com/helm/helm/master/docs/images/create-a-gh-page-button.png)

Next, you'll want to make sure your **gh-pages branch** is set as Github Pages,
click on your repo **Settings** and scroll down to **Github pages** section and
set as per below:

![Create Github Pages branch](https://raw.githubusercontent.com/helm/helm/master/docs/images/set-a-gh-page.png)

By default **Source** usually gets set to **gh-pages branch**. If this is not set by default, then select it.

You can use a **custom domain** there if you wish so.

And check that **Enforce HTTPS** is ticked, so the **HTTPS** will be used when
charts are served.

In such setup you can use **master branch** to store your charts code, and
**gh-pages branch** as charts repository, e.g.:
`https://USERNAME.github.io/REPONAME`. The demonstration [TS Charts](https://github.com/technosophos/tscharts)
repository is accessible at `https://technosophos.github.io/tscharts/`.

### Ordinary web servers

To configure an ordinary web server to serve Helm charts, you merely need to do
the following:

- Put your index and charts in a directory that the server can serve
- Make sure the `index.yaml` file can be accessed with no authentication requirement
- Make sure `yaml` files are served with the correct content type (`text/yaml` or
  `text/x-yaml`)

For example, if you want to serve your charts out of `$WEBROOT/charts`, make sure
there is a `charts/` directory in your web root, and put the index file and
charts inside of that folder.


## Managing Chart Repositories

Now that you have a chart repository, the last part of this guide explains how
to maintain charts in that repository.


### Store charts in your chart repository

Now that you have a chart repository, let's upload a chart and an index file to
the repository.  Charts in a chart repository must be packaged
(`helm package chart-name/`) and versioned correctly (following
[SemVer 2](https://semver.org/) guidelines).

These next steps compose an example workflow, but you are welcome to use
whatever workflow you fancy for storing and updating charts in your chart
repository.

Once you have a packaged chart ready, create a new directory, and move your
packaged chart to that directory.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

The last command takes the path of the local directory that you just created and
the URL of your remote chart repository and composes an `index.yaml` file inside the
given directory path.

Now you can upload the chart and the index file to your chart repository using
a sync tool or manually. If you're using Google Cloud Storage, check out this
[example workflow](./#developing_charts_sync_example) using the gsutil client. For
GitHub, you can simply put the charts in the appropriate destination branch.

### Add new charts to an existing repository

Each time you want to add a new chart to your repository, you must regenerate
the index. The `helm repo index` command will completely rebuild the `index.yaml`
file from scratch, including only the charts that it finds locally.

However, you can use the `--merge` flag to incrementally add new charts to an
existing `index.yaml` file (a great option when working with a remote repository
like GCS). Run `helm repo index --help` to learn more,

Make sure that you upload both the revised `index.yaml` file and the chart. And
if you generated a provenance file, upload that too.

### Share your charts with others

When you're ready to share your charts, simply let someone know what the URL of
your repository is.

From there, they will add the repository to their helm client via the `helm
repo add [NAME] [URL]` command with any name they would like to use to
reference the repository.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

If the charts are backed by HTTP basic authentication, you can also supply the
username and password here:

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**Note:** A repository will not be added if it does not contain a valid
`index.yaml`.

After that, your users will be able to search through your charts. After you've updated
the repository, they can use the `helm repo update` command to get the latest
chart information.

*Under the hood, the `helm repo add` and `helm repo update` commands are
fetching the index.yaml file and storing them in the
`$HELM_HOME/repository/cache/` directory. This is where the `helm search`
function finds information about charts.*

# Syncing Your Chart Repository
*Note: This example is specifically for a Google Cloud Storage (GCS) bucket which serves a chart repository.*

## Prerequisites
* Install the [gsutil](https://cloud.google.com/storage/docs/gsutil) tool. *We rely heavily on the gsutil rsync functionality*
* Be sure to have access to the Helm binary
* _Optional: We recommend you set [object versioning](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page) on your GCS bucket in case you accidentally delete something._

## Set up a local chart repository directory
Create a local directory like we did in [the chart repository guide](./#developing_charts), and place your packaged charts in that directory.

For example:
```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## Generate an updated index.yaml
Use Helm to generate an updated index.yaml file by passing in the directory path and the url of the remote repository to the `helm repo index` command like this:

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```
This will generate an updated index.yaml file and place in the `fantastic-charts/` directory.

## Sync your local and remote chart repositories
Upload the contents of the directory to your GCS bucket by running `scripts/sync-repo.sh` and pass in the local directory name and the GCS bucket name.

For example:
```console
$ pwd
/Users/funuser/go/src/github.com/helm/helm
$ scripts/sync-repo.sh fantastic-charts/ fantastic-charts
Getting ready to sync your local directory (fantastic-charts/) to a remote repository at gs://fantastic-charts
Verifying Prerequisites....
Thumbs up! Looks like you have gsutil. Let's continue.
Building synchronization state...
Starting synchronization
Would copy file://fantastic-charts/alpine-0.1.0.tgz to gs://fantastic-charts/alpine-0.1.0.tgz
Would copy file://fantastic-charts/index.yaml to gs://fantastic-charts/index.yaml
Are you sure you would like to continue with these changes?? [y/N]} y
Building synchronization state...
Starting synchronization
Copying file://fantastic-charts/alpine-0.1.0.tgz [Content-Type=application/x-tar]...
Uploading   gs://fantastic-charts/alpine-0.1.0.tgz:              740 B/740 B
Copying file://fantastic-charts/index.yaml [Content-Type=application/octet-stream]...
Uploading   gs://fantastic-charts/index.yaml:                    347 B/347 B
Congratulations your remote chart repository now matches the contents of fantastic-charts/
```
## Updating your chart repository
You'll want to keep a local copy of the contents of your chart repository or use `gsutil rsync` to copy the contents of your remote chart repository to a local directory.

For example:
```console
$ gsutil rsync -d -n gs://bucket-name local-dir/    # the -n flag does a dry run
Building synchronization state...
Starting synchronization
Would copy gs://bucket-name/alpine-0.1.0.tgz to file://local-dir/alpine-0.1.0.tgz
Would copy gs://bucket-name/index.yaml to file://local-dir/index.yaml

$ gsutil rsync -d gs://bucket-name local-dir/       # performs the copy actions
Building synchronization state...
Starting synchronization
Copying gs://bucket-name/alpine-0.1.0.tgz...
Downloading file://local-dir/alpine-0.1.0.tgz:                        740 B/740 B
Copying gs://bucket-name/index.yaml...
Downloading file://local-dir/index.yaml:                              346 B/346 B
```


Helpful Links:
* Documentation on [gsutil rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
* [The Chart Repository Guide](./#developing_charts)
* Documentation on [object versioning and concurrency control](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview) in Google Cloud Storage

# Helm Provenance and Integrity

Helm has provenance tools which help chart users verify the integrity and origin
of a package. Using industry-standard tools based on PKI, GnuPG, and well-respected
package managers, Helm can generate and verify signature files.

## Overview

Integrity is established by comparing a chart to a provenance record. Provenance
records are stored in _provenance files_, which are stored alongside a packaged
chart. For example, if a chart is named `myapp-1.2.3.tgz`, its provenance file
will be `myapp-1.2.3.tgz.prov`.

Provenance files are generated at packaging time (`helm package --sign ...`), and
can be checked by multiple commands, notable `helm install --verify`.

## The Workflow

This section describes a potential workflow for using provenance data effectively.

Prerequisites:

- A valid PGP keypair in a binary (not ASCII-armored) format
- The `helm` command line tool
- GnuPG >=2.1 command line tools (optional)
- Keybase command line tools (optional)

**NOTE:** If your PGP private key has a passphrase, you will be prompted to enter
that passphrase for any commands that support the `--sign` option. You can set the
HELM_KEY_PASSPHRASE environment variable to that passphrase in case you don't want
to be prompted to enter the passphrase.

**NOTE:** The keyfile format for GnuPG changed in version 2.1. Prior to that release
it was unnecessary to export keys out of GnuPG, and you could instead point Helm
at your `*.gpg` files. With 2.1, the new `.kbx` format was introduced, and this
format is not supported by Helm.

Creating a new chart is the same as before:

```
$ helm create mychart
Creating mychart
```

Once ready to package, add the `--sign` flag to `helm package`. Also, specify
the name under which the signing key is known and the keyring containing the corresponding private key:

```
$ helm package --sign --key 'helm signing key' --keyring path/to/keyring.secret mychart
```

**TIP:** for GnuPG users, your secret keyring is in `~/.gnupg/secring.kbx`. You can
use `gpg --list-secret-keys` to list the keys you have.

**Warning:**  the GnuPG v2.1 store your secret keyring using a new format 'kbx' on the default location  '~/.gnupg/pubring.kbx'. Please use the following command to convert your keyring to the legacy gpg format:

```
$ gpg --export-secret-keys >~/.gnupg/secring.gpg
```

At this point, you should see both `mychart-0.1.0.tgz` and `mychart-0.1.0.tgz.prov`.
Both files should eventually be uploaded to your desired chart repository.

You can verify a chart using `helm verify`:

```
$ helm verify mychart-0.1.0.tgz
```

A failed verification looks like this:

```
$ helm verify topchart-0.1.0.tgz
Error: sha256 sum does not match for topchart-0.1.0.tgz: "sha256:1939fbf7c1023d2f6b865d137bbb600e0c42061c3235528b1e8c82f4450c12a7" != "sha256:5a391a90de56778dd3274e47d789a2c84e0e106e1a37ef8cfa51fd60ac9e623a"
```

To verify during an install, use the `--verify` flag.

```
$ helm install --verify mychart-0.1.0.tgz
```

If the keyring (containing the public key associated with the signed chart) is not in the default location, you may need to point to the
keyring with `--keyring PATH` as in the `helm package` example.

If verification fails, the install will be aborted before the chart is even pushed
up to Tiller.

### Using Keybase.io credentials

The [Keybase.io](https://keybase.io) service makes it easy to establish a chain of
trust for a cryptographic identity. Keybase credentials can be used to sign charts.

Prerequisites:

- A configured Keybase.io account
- GnuPG installed locally
- The `keybase` CLI installed locally

#### Signing packages

The first step is to import your keybase keys into your local GnuPG keyring:

```
$ keybase pgp export -s > secring.gpg
```

This will convert your Keybase key into the OpenPGP format, and then place it
locally into your `secring.gpg` file.

> Tip: If you need to add a Keybase key to an existing keyring, you will need to
> do `keybase pgp export -s | gpg --import && gpg --export-secret-keys --outfile secring.gpg`

Your secret key will have an identifier string:

```
technosophos (keybase.io/technosophos) <technosophos@keybase.io>
```

That is the full name of your key.

Next, you can package and sign a chart with `helm package`. Make sure you use at
least part of that name string in `--key`.

```
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart
```

As a result, the `package` command should produce both a `.tgz` file and a `.tgz.prov`
file.

#### Verifying packages

You can also use a similar technique to verify a chart signed by someone else's
Keybase key. Say you want to verify a package signed by `keybase.io/technosophos`.
To do this, use the `keybase` tool:

```
$ keybase follow technosophos
$ keybase pgp pull
```

The first command above tracks the user `technosophos`. Next `keybase pgp pull`
downloads the OpenPGP keys of all of the accounts you follow, placing them in
your GnuPG keyring (`~/.gnupg/pubring.gpg`).

At this point, you can now use `helm verify` or any of the commands with a `--verify`
flag:

```
$ helm verify somechart-1.2.3.tgz
```

### Reasons a chart may not verify

These are common reasons for failure.

- The prov file is missing or corrupt. This indicates that something is misconfigured
  or that the original maintainer did not create a provenance file.
- The key used to sign the file is not in your keyring. This indicate that the
  entity who signed the chart is not someone you've already signaled that you trust.
- The verification of the prov file failed. This indicates that something is wrong
  with either the chart or the provenance data.
- The file hashes in the provenance file do not match the hash of the archive file. This
  indicates that the archive has been tampered with.

If a verification fails, there is reason to distrust the package.

## The Provenance File
The provenance file contains a chart’s YAML file plus several pieces of
verification information. Provenance files are designed to be automatically
generated.


The following pieces of provenance data are added:


* The chart file (Chart.yaml) is included to give both humans and tools an easy
  view into the contents of the chart.
* The signature (SHA256, just like Docker) of the chart package (the .tgz file)
  is included, and may be used to verify the integrity of the chart package.
* The entire body is signed using the algorithm used by PGP (see
  [http://keybase.io] for an emerging way of making crypto signing and
  verification easy).

The combination of this gives users the following assurances:

* The package itself has not been tampered with (checksum package tgz).
* The entity who released this package is known (via the GnuPG/PGP signature).

The format of the file looks something like this:

```
-----BEGIN PGP SIGNED MESSAGE-----
name: nginx
description: The nginx web server as a replication controller and service pair.
version: 0.5.1
keywords:
  - https
  - http
  - web server
  - proxy
source:
- https://github.com/foo/bar
home: http://nginx.com

...
files:
        nginx-0.5.1.tgz: “sha256:9f5270f50fc842cfcb717f817e95178f”
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.9 (GNU/Linux)

iEYEARECAAYFAkjilUEACgQkB01zfu119ZnHuQCdGCcg2YxF3XFscJLS4lzHlvte
WkQAmQGHuuoLEJuKhRNo+Wy7mhE7u1YG
=eifq
-----END PGP SIGNATURE-----
```

Note that the YAML section contains two documents (separated by `...\n`). The
first is the Chart.yaml. The second is the checksums, a map of filenames to
SHA-256 digests (value shown is fake/truncated)

The signature block is a standard PGP signature, which provides [tamper
resistance](http://www.rossde.com/PGP/pgp_signatures.html).

## Chart Repositories

Chart repositories serve as a centralized collection of Helm charts.

Chart repositories must make it possible to serve provenance files over HTTP via
a specific request, and must make them available at the same URI path as the chart.

For example, if the base URL for a package is `https://example.com/charts/mychart-1.2.3.tgz`,
the provenance file, if it exists, MUST be accessible at `https://example.com/charts/mychart-1.2.3.tgz.prov`.

From the end user's perspective, `helm install --verify myrepo/mychart-1.2.3`
should result in the download of both the chart and the provenance file with no
additional user configuration or action.

## Establishing Authority and Authenticity

When dealing with chain-of-trust systems, it is important to be able to
establish the authority of a signer. Or, to put this plainly, the system
above hinges on the fact that you trust the person who signed the chart.
That, in turn, means you need to trust the public key of the signer.

One of the design decisions with Kubernetes Helm has been that the Helm
project would not insert itself into the chain of trust as a necessary
party. We don't want to be "the certificate authority" for all chart
signers. Instead, we strongly favor a decentralized model, which is part
of the reason we chose OpenPGP as our foundational technology.
So when it comes to establishing authority, we have left this
step more-or-less undefined in Helm 2.0.0.

However, we have some pointers and recommendations for those interested
in using the provenance system:

- The [Keybase](https://keybase.io) platform provides a public
  centralized repository for trust information.
  - You can use Keybase to store your keys or to get the public keys of others.
  - Keybase also has fabulous documentation available
  - While we haven't tested it, Keybase's "secure website" feature could
    be used to serve Helm charts.
- The [official Helm Charts project](https://github.com/helm/charts)
  is trying to solve this problem for the official chart repository.
  - There is a long issue there [detailing the current thoughts](https://github.com/helm/charts/issues/23).
  - The basic idea is that an official "chart reviewer" signs charts with
    her or his key, and the resulting provenance file is then uploaded
    to the chart repository.
  - There has been some work on the idea that a list of valid signing
    keys may be included in the `index.yaml` file of a repository.

Finally, chain-of-trust is an evolving feature of Helm, and some
community members have proposed adapting part of the OSI model for
signatures. This is an open line of inquiry in the Helm team. If you're
interested, jump on in.

# Chart Tests

A chart contains a number of Kubernetes resources and components that work together. As a chart author, you may want to write some tests that validate that your chart works as expected when it is installed. These tests also help the chart consumer understand what your chart is supposed to do.

A **test** in a helm chart lives under the `templates/` directory and is a pod definition that specifies a container with a given command to run. The container should exit successfully (exit 0) for a test to be considered a success. The pod definition must contain one of the helm test hook annotations: `helm.sh/hook: test-success` or `helm.sh/hook: test-failure`.

Example tests:
- Validate that your configuration from the values.yaml file was properly injected.
  - Make sure your username and password work correctly
  - Make sure an incorrect username and password does not work
- Assert that your services are up and correctly loadbalanced.
- etc.

You can run the pre-defined tests in Helm on a release using the command `helm test <RELEASE_NAME>`. For a chart consumer, this is a great way to sanity check that their release of a chart (or application) works as expected.

## A Breakdown of the Helm Test Hooks

In Helm, there are two test hooks: `test-success` and `test-failure`

`test-success` indicates that test pod should complete successfully. In other words, the containers in the pod should exit 0.
`test-failure` is a way to assert that a test pod should not complete successfully. If the containers in the pod do not exit 0, that indicates success.

## Example Test

Here is an example of a helm test pod definition in an example wordpress chart. The test verifies the access and login to the mariadb database:

```
wordpress/
  Chart.yaml
  README.md
  values.yaml
  charts/
  templates/
  templates/tests/test-mariadb-connection.yaml
```
In `wordpress/templates/tests/test-mariadb-connection.yaml`:
```
apiVersion: v1
kind: Pod
metadata:
  name: "{{ .Release.Name }}-credentials-test"
  annotations:
    "helm.sh/hook": test-success
spec:
  containers:
  - name: {{ .Release.Name }}-credentials-test
    image: {{ .Values.image }}
    env:
      - name: MARIADB_HOST
        value: {{ template "mariadb.fullname" . }}
      - name: MARIADB_PORT
        value: "3306"
      - name: WORDPRESS_DATABASE_NAME
        value: {{ default "" .Values.mariadb.mariadbDatabase | quote }}
      - name: WORDPRESS_DATABASE_USER
        value: {{ default "" .Values.mariadb.mariadbUser | quote }}
      - name: WORDPRESS_DATABASE_PASSWORD
        valueFrom:
          secretKeyRef:
            name: {{ template "mariadb.fullname" . }}
            key: mariadb-password
    command: ["sh", "-c", "mysql --host=$MARIADB_HOST --port=$MARIADB_PORT --user=$WORDPRESS_DATABASE_USER --password=$WORDPRESS_DATABASE_PASSWORD"]
  restartPolicy: Never
```

## Steps to Run a Test Suite on a Release
1. `$ helm install wordpress`
```
NAME:   quirky-walrus
LAST DEPLOYED: Mon Feb 13 13:50:43 2017
NAMESPACE: default
STATUS: DEPLOYED
```

2. `$ helm test quirky-walrus`
```
RUNNING: quirky-walrus-credentials-test
SUCCESS: quirky-walrus-credentials-test
```

## Notes
- You can define as many tests as you would like in a single yaml file or spread across several yaml files in the `templates/` directory
- You are welcome to nest your test suite under a `tests/` directory like `<chart-name>/templates/tests/` for more isolation

# Chart Repositories: Frequently Asked Questions

This section tracks some of the more frequently encountered issues with using chart repositories.

**We'd love your help** making this document better. To add, correct, or remove
information, [file an issue](https://github.com/helm/helm/issues) or
send us a pull request.

## Fetching

**Q: Why do I get a `unsupported protocol scheme ""` error when trying to fetch a chart from my custom repo?**

A: (Helm < 2.5.0) This is likely caused by you creating your chart repo index without specifying the `--url` flag.
Try recreating your `index.yaml` file with a command like `helm repo index --url http://my-repo/charts .`,
and then re-uploading it to your custom charts repo.

This behavior was changed in Helm 2.5.0.
