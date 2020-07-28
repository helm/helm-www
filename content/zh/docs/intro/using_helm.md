---
title: "Using Helm"
description: "Explains the basics of Helm."
weight: 3
---

This guide explains the basics of using Helm to manage packages on your
Kubernetes cluster. It assumes that you have already [installed]({{< ref
"install.md" >}}) the Helm client.

If you are simply interested in running a few quick commands, you may wish to
begin with the [Quickstart Guide]({{< ref "quickstart.md" >}}). This chapter
covers the particulars of Helm commands, and explains how to use Helm.

## Three Big Concepts

A *Chart* is a Helm package. It contains all of the resource definitions
necessary to run an application, tool, or service inside of a Kubernetes
cluster. Think of it like the Kubernetes equivalent of a Homebrew formula, an
Apt dpkg, or a Yum RPM file.

A *Repository* is the place where charts can be collected and shared. It's like
Perl's [CPAN archive](https://www.cpan.org) or the [Fedora Package
Database](https://admin.fedoraproject.org/pkgdb/), but for Kubernetes packages.

A *Release* is an instance of a chart running in a Kubernetes cluster. One chart
can often be installed many times into the same cluster. And each time it is
installed, a new _release_ is created. Consider a MySQL chart. If you want two
databases running in your cluster, you can install that chart twice. Each one
will have its own _release_, which will in turn have its own _release name_.

With these concepts in mind, we can now explain Helm like this:

Helm installs _charts_ into Kubernetes, creating a new _release_ for each
installation. And to find new charts, you can search Helm chart _repositories_.

## 'helm search': Finding Charts

Helm comes with a powerful search command. It can be used to search two
different types of source:

- `helm search hub` searches [the Helm Hub](https://hub.helm.sh), which
  comprises helm charts from dozens of different repositories.
- `helm search repo` searches the repositories that you have added to your local
  helm client (with `helm repo add`). This search is done over local data, and
  no public network connection is needed.

You can find publicly available charts by running `helm search hub`:

```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      A Helm chart for deploying a WordPress site on ...
```

The above searches for all `wordpress` charts on Helm Hub.

With no filter, `helm search hub` shows you all of the available charts.

Using `helm search repo`, you can find the names of the charts in repositories
you have already added:

```console
$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                          CHART VERSION APP VERSION DESCRIPTION
brigade/brigade               1.3.2         v1.2.1      Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app    0.4.1         v0.2.1      The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth  0.2.0         v0.20.0     The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway   0.1.0                     A Helm chart for Kubernetes
brigade/brigade-project       1.0.0         v1.0.0      Create a Brigade project
brigade/kashti                0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Helm search uses a fuzzy string matching algorithm, so you can type parts of
words or phrases:

```console
$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Search is a good way to find available packages. Once you have found a package
you want to install, you can use `helm install` to install it.

## 'helm install': Installing a Package

To install a new package, use the `helm install` command. At its simplest, it
takes two arguments: A release name that you pick, and the name of the chart you
want to install.

```console
$ helm install happy-panda stable/mariadb
WARNING: This chart is deprecated
NAME: happy-panda
LAST DEPLOYED: Fri May  8 17:46:49 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
This Helm chart is deprecated

...

Services:

  echo Master: happy-panda-mariadb.default.svc.cluster.local:3306
  echo Slave:  happy-panda-mariadb-slave.default.svc.cluster.local:3306

Administrator credentials:

  Username: root
  Password : $(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)

To connect to your database:

  1. Run a pod that you can use as a client:

      kubectl run happy-panda-mariadb-client --rm --tty -i --restart='Never' --image  docker.io/bitnami/mariadb:10.3.22-debian-10-r27 --namespace default --command -- bash

  2. To connect to master service (read/write):

      mysql -h happy-panda-mariadb.default.svc.cluster.local -uroot -p my_database

  3. To connect to slave service (read-only):

      mysql -h happy-panda-mariadb-slave.default.svc.cluster.local -uroot -p my_database

To upgrade this helm chart:

  1. Obtain the password as described on the 'Administrator credentials' section and set the 'rootUser.password' parameter as shown below:

      ROOT_PASSWORD=$(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)
      helm upgrade happy-panda stable/mariadb --set rootUser.password=$ROOT_PASSWORD

```

Now the `mariadb` chart is installed. Note that installing a chart creates a new
_release_ object. The release above is named `happy-panda`. (If you want Helm to
generate a name for you, leave off the release name and use `--generate-name`.)

During installation, the `helm` client will print useful information about which
resources were created, what the state of the release is, and also whether there
are additional configuration steps you can or should take.

Helm does not wait until all of the resources are running before it exits. Many
charts require Docker images that are over 600M in size, and may take a long
time to install into the cluster.

To keep track of a release's state, or to re-read configuration information, you
can use `helm status`:

```console
$ helm status happy-panda                
NAME: happy-panda
LAST DEPLOYED: Fri May  8 17:46:49 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
This Helm chart is deprecated

...

Services:

  echo Master: happy-panda-mariadb.default.svc.cluster.local:3306
  echo Slave:  happy-panda-mariadb-slave.default.svc.cluster.local:3306

Administrator credentials:

  Username: root
  Password : $(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)

To connect to your database:

  1. Run a pod that you can use as a client:

      kubectl run happy-panda-mariadb-client --rm --tty -i --restart='Never' --image  docker.io/bitnami/mariadb:10.3.22-debian-10-r27 --namespace default --command -- bash

  2. To connect to master service (read/write):

      mysql -h happy-panda-mariadb.default.svc.cluster.local -uroot -p my_database

  3. To connect to slave service (read-only):

      mysql -h happy-panda-mariadb-slave.default.svc.cluster.local -uroot -p my_database

To upgrade this helm chart:

  1. Obtain the password as described on the 'Administrator credentials' section and set the 'rootUser.password' parameter as shown below:

      ROOT_PASSWORD=$(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)
      helm upgrade happy-panda stable/mariadb --set rootUser.password=$ROOT_PASSWORD
```

The above shows the current state of your release.

### Customizing the Chart Before Installing

Installing the way we have here will only use the default configuration options
for this chart. Many times, you will want to customize the chart to use your
preferred configuration.

To see what options are configurable on a chart, use `helm show values`:

```console
$ helm show values stable/mariadb
Fetched stable/mariadb-0.3.0.tgz to /Users/mattbutcher/Code/Go/src/helm.sh/helm/mariadb-0.3.0.tgz
## Bitnami MariaDB image version
## ref: https://hub.docker.com/r/bitnami/mariadb/tags/
##
## Default: none
imageTag: 10.1.14-r3

## Specify a imagePullPolicy
## Default to 'Always' if imageTag is 'latest', else set to 'IfNotPresent'
## ref: https://kubernetes.io/docs/user-guide/images/#pre-pulling-images
##
# imagePullPolicy:

## Specify password for root user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#setting-the-root-password-on-first-run
##
# mariadbRootPassword:

## Create a database user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-user-on-first-run
##
# mariadbUser:
# mariadbPassword:

## Create a database
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-on-first-run
##
# mariadbDatabase:
# ...
```

You can then override any of these settings in a YAML formatted file, and then
pass that file during installation.

```console
$ echo '{mariadbUser: user0, mariadbDatabase: user0db}' > config.yaml
$ helm install -f config.yaml stable/mariadb --generate-name
```

The above will create a default MariaDB user with the name `user0`, and grant
this user access to a newly created `user0db` database, but will accept all the
rest of the defaults for that chart.

There are two ways to pass configuration data during install:

- `--values` (or `-f`): Specify a YAML file with overrides. This can be
  specified multiple times and the rightmost file will take precedence
- `--set`: Specify overrides on the command line.

If both are used, `--set` values are merged into `--values` with higher
precedence. Overrides specified with `--set` are persisted in a ConfigMap.
Values that have been `--set` can be viewed for a given release with `helm get
values <release-name>`. Values that have been `--set` can be cleared by running
`helm upgrade` with `--reset-values` specified.

#### The Format and Limitations of `--set`

The `--set` option takes zero or more name/value pairs. At its simplest, it is
used like this: `--set name=value`. The YAML equivalent of that is:

```yaml
name: value
```

Multiple values are separated by `,` characters. So `--set a=b,c=d` becomes:

```yaml
a: b
c: d
```

More complex expressions are supported. For example, `--set outer.inner=value`
is translated into this:
```yaml
outer:
  inner: value
```

Lists can be expressed by enclosing values in `{` and `}`. For example, `--set
name={a, b, c}` translates to:

```yaml
name:
  - a
  - b
  - c
```

As of Helm 2.5.0, it is possible to access list items using an array index
syntax. For example, `--set servers[0].port=80` becomes:

```yaml
servers:
  - port: 80
```

Multiple values can be set this way. The line `--set
servers[0].port=80,servers[0].host=example` becomes:

```yaml
servers:
  - port: 80
    host: example
```

Sometimes you need to use special characters in your `--set` lines. You can use
a backslash to escape the characters; `--set name=value1\,value2` will become:

```yaml
name: "value1,value2"
```

Similarly, you can escape dot sequences as well, which may come in handy when
charts use the `toYaml` function to parse annotations, labels and node
selectors. The syntax for `--set nodeSelector."kubernetes\.io/role"=master`
becomes:

```yaml
nodeSelector:
  kubernetes.io/role: master
```

Deeply nested data structures can be difficult to express using `--set`. Chart
designers are encouraged to consider the `--set` usage when designing the format
of a `values.yaml` file.

### More Installation Methods

The `helm install` command can install from several sources:

- A chart repository (as we've seen above)
- A local chart archive (`helm install foo foo-0.1.1.tgz`)
- An unpacked chart directory (`helm install foo path/to/foo`)
- A full URL (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' and 'helm rollback': Upgrading a Release, and Recovering on Failure

When a new version of a chart is released, or when you want to change the
configuration of your release, you can use the `helm upgrade` command.

An upgrade takes an existing release and upgrades it according to the
information you provide. Because Kubernetes charts can be large and complex,
Helm tries to perform the least invasive upgrade. It will only update things
that have changed since the last release.

```console
$ helm upgrade -f panda.yaml happy-panda stable/mariadb
Fetched stable/mariadb-0.3.0.tgz to /Users/mattbutcher/Code/Go/src/helm.sh/helm/mariadb-0.3.0.tgz
happy-panda has been upgraded. Happy Helming!
Last Deployed: Wed Sep 28 12:47:54 2016
Namespace: default
Status: DEPLOYED
...
```

In the above case, the `happy-panda` release is upgraded with the same chart,
but with a new YAML file:

```yaml
mariadbUser: user1
```

We can use `helm get values` to see whether that new setting took effect.

```console
$ helm get values happy-panda
mariadbUser: user1
```

The `helm get` command is a useful tool for looking at a release in the cluster.
And as we can see above, it shows that our new values from `panda.yaml` were
deployed to the cluster.

Now, if something does not go as planned during a release, it is easy to roll
back to a previous release using `helm rollback [RELEASE] [REVISION]`.

```console
$ helm rollback happy-panda 1
```

The above rolls back our happy-panda to its very first release version. A
release version is an incremental revision. Every time an install, upgrade, or
rollback happens, the revision number is incremented by 1. The first revision
number is always 1. And we can use `helm history [RELEASE]` to see revision
numbers for a certain release.

## Helpful Options for Install/Upgrade/Rollback

There are several other helpful options you can specify for customizing the
behavior of Helm during an install/upgrade/rollback. Please note that this is
not a full list of cli flags. To see a description of all flags, just run `helm
<command> --help`.

- `--timeout`: A value in seconds to wait for Kubernetes commands to complete
  This defaults to `5m0s`
- `--wait`: Waits until all Pods are in a ready state, PVCs are bound,
  Deployments have minimum (`Desired` minus `maxUnavailable`) Pods in ready
  state and Services have an IP address (and Ingress if a `LoadBalancer`) before
  marking the release as successful. It will wait for as long as the `--timeout`
  value. If timeout is reached, the release will be marked as `FAILED`. Note: In
  scenarios where Deployment has `replicas` set to 1 and `maxUnavailable` is not
  set to 0 as part of rolling update strategy, `--wait` will return as ready as
  it has satisfied the minimum Pod in ready condition.
- `--no-hooks`: This skips running hooks for the command
- `--recreate-pods` (only available for `upgrade` and `rollback`): This flag
  will cause all pods to be recreated (with the exception of pods belonging to
  deployments). (DEPRECATED in Helm 3)

## 'helm uninstall': Uninstalling a Release

When it is time to uninstall a release from the cluster, use the `helm
uninstall` command:

```console
$ helm uninstall happy-panda
```

This will remove the release from the cluster. You can see all of your currently
deployed releases with the `helm list` command:

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

From the output above, we can see that the `happy-panda` release was
uninstalled.

In previous versions of Helm, when a release was deleted, a record of its
deletion would remain. In Helm 3, deletion removes the release record as well.
If you wish to keep a deletion release record, use `helm uninstall
--keep-history`. Using `helm list --uninstalled` will only show releases that
where uninstalled with the `--keep-history` flag.

The `helm list --all` flag will show you all release records that Helm has
retained, including records for failed or deleted items (if `--keep-history` was
specified):

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     mariadb-0.3.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

Note that because releases are now deleted by default, it is no longer possible
to rollback an uninstalled resource.

## 'helm repo': Working with Repositories

Helm 3 no longer ships with a default chart repository. The `helm repo` command
group provides commands to add, list, and remove repositories.

You can see which repositories are configured using `helm repo list`:

```console
$ helm repo list
NAME            URL
stable          https://kubernetes-charts.storage.googleapis.com
mumoshu         https://mumoshu.github.io/charts
```

And new repositories can be added with `helm repo add`:

```console
$ helm repo add dev https://example.com/dev-charts
```

Because chart repositories change frequently, at any point you can make sure
your Helm client is up to date by running `helm repo update`.

Repositories can be removed with `helm repo remove`.

## Creating Your Own Charts

The [Chart Development Guide]({{< ref "/docs/topics/charts.md" >}}) explains how
to develop your own charts. But you can get started quickly by using the `helm
create` command:

```console
$ helm create deis-workflow
Creating deis-workflow
```

Now there is a chart in `./deis-workflow`. You can edit it and create your own
templates.

As you edit your chart, you can validate that it is well-formed by running `helm
lint`.

When it's time to package the chart up for distribution, you can run the `helm
package` command:

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

And that chart can now easily be installed by `helm install`:

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

Charts that are packaged can be loaded into chart repositories. See the
documentation for your chart repository server to learn how to upload.

Note: The `stable` repository is managed on the [Kubernetes Charts GitHub
repository](https://github.com/helm/charts). That project accepts chart source
code, and (after audit) packages those for you.

## Conclusion

This chapter has covered the basic usage patterns of the `helm` client,
including searching, installation, upgrading, and uninstalling. It has also
covered useful utility commands like `helm status`, `helm get`, and `helm repo`.

For more information on these commands, take a look at Helm's built-in help:
`helm help`.

In the next chapter, we look at the process of developing charts.
