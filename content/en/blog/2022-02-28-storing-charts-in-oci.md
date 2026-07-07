---
title: "Storing Helm Charts in OCI Registries"
slug: "storing-charts-in-oci"
authorname: "Scott Rigby, Josh Dolitsky, Matt Farina"
author: "@scottrigby, @jdolitsky, @mattfarina"
authorlink: "https://helm.sh"
date: "2022-02-28"
---

With the release of Helm 3.8.0, Helm is able to store and work with charts in container registries, as an alternative to [Helm repositories](https://helm.sh/docs/topics/chart_repository/). This feature, which used to be an experimental feature, is now generally available.

<!--more-->

Over the past several years container registry developers have been working on ways to store other artifacts in container registries. To facilitate this in a cross platform manner, the Open Containers Initiative (OCI) - the organization that defines the specifications for containers - released their [distribution specification](https://specs.opencontainers.org/distribution-spec/?v=v1.0.0) which allowed other "artifacts" to be stored in registries.

<!-- ## What Does This Mean For Me? -->

## Common Storage

Since OCI artifacts now makes it possible to store more than container images, you can store charts, images, and other artifacts in a single OCI registry. Sharing a common storage standard that's not specific to Helm allows greater interoperability between tools from the wider container ecosystem for security, identity and access management, and more.

## Working With Charts In Registries

The combination of OCI artifact support in a registry and new functionality within Helm provides the capability to pull and push charts to and from a registry. You can also specify charts stored in OCI as a dependency in any `Chart.yaml` file. The following example illustrates logging into a registry and pushing a chart:

```text
$ helm create demo
Creating demo

$ helm package demo
Successfully packaged chart and saved it to: /tmp/demo-0.1.0.tgz

$ echo "mypass" | helm registry login r.example.com -u myuser --password-stdin
Login Succeeded

$ helm push demo-0.1.0.tgz oci://r.example.com/myuser
Pushed: r.example.com/myuser/demo:0.1.0
Digest: sha256:7ed393daf1ffc94803c08ffcbecb798fa58e786bebffbab02da5458f68d0ecb0
```

More detail on [working with registries can be found in the Helm documentation](https://helm.sh/docs/topics/registries/).

## The Helm SDK

The Helm SDK, which is useful for those building tools to integrate with Helm, also includes support to work with registries programatically. The following example illustrates pushing a chart to a registry:

```go
package main

import (
	"fmt"
	"io/ioutil"

	"helm.sh/helm/v3/pkg/registry"
)

func check(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	client, err := registry.NewClient()
	check(err)

	b, err := ioutil.ReadFile("demo-0.1.0.tgz")
	check(err)

	info, err := client.Push(b, "r.example.com/myuser/demo:0.1.0")
	check(err)

	fmt.Printf("Pushed: %s\n", info.Ref)
	fmt.Printf("Digest: %s\n", info.Manifest.Digest)
}
```

More detail can be found in the [documentation for the registry package](https://pkg.go.dev/helm.sh/helm/v3/pkg/registry).

## Limitations

There are some limitations when using registries to store charts compared to Helm repositories or storing container images in registries.

Helm repositores can be added and searched from the local Helm client. This is similar to how repositories work with other package managers such as zypper or apt. When working with OCI registries, this is not an option. OCI based registries don't provide standard APIs to facilitate searching.

While the OCI specification provides support for artifacts, not all registries support storing Helm charts or other artifacts that are not container images. Before choosing a registry, you should confirm whether it supports storing Helm charts.

## Artifact Hub Support

[Artifact Hub](https://artifacthub.io/), another CNCF project, provides a means to search and discover cloud native assets, including charts. Helm charts stored in OCI based registries can be listed on Artifact Hub, which already knows how to work with them. More details on working with Artifact Hub and Helm charts in container registries can be found in their [documentation](https://artifacthub.io/docs/topics/repositories/#helm-charts-repositories).

## ORAS

The [OCI Registry as Storage (ORAS) project](https://oras.land/), another CNCF project, is used by Helm as the underlying library for working with registries. The ORAS project bills itself as:

> Registries are evolving as generic artifact stores. To enable this goal, the ORAS project provides a way to push and pull OCI Artifacts to and from OCI Registries.

If you want to work with other artifacts in registries the ORAS project may provide some tools to help you.

## Thanks and Help Us Keep Improving

Thanks to everyone who worked on adding support for Helm charts and OCI registries, from the initial experiment to bringing this to a full feature. Thanks especially for end user testing, bug reports and feature requests, and coordination between community members and maintainers across several CNCF projects.

We hope this post helps give a good intro, and some things to consider when evaluating storing your Helm charts in OCI. See if it fits your needs, take it for a spin, and let us know what you think!
