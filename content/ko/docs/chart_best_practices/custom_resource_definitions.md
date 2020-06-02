---
title: "커스텀 리소스 데피니션"
description: "CRD를 생성하고 사용하는 방법"
weight: 7
aliases: ["/docs/topics/chart_best_practices/custom_resource_definitions/"]
---

이 부분은 모범사례 가이드의 일부로서 커스텀 리소스 데피니션 객체를 생성하고 사용하는 것을 다룬다.

커스텀 리소스 데피니션(CRD)를 다룰 때에는, 다음 2가지를 구분하는 것이 중요하다.

- CRD의 선언이 있다. 이것은 종류(kind)가 `CustomResourceDefinition` YAML 파일이다.
- 그리고 그 CRD를 사용하는 리소스들이 있다. 어떤 CRD가 `foo.example.com/v1`를 정의한다고 해보자.
  `apiVersion: example.com/v1`이고  종류(kind)가 `Foo`인 모든 리소스들은 그 CRD를 사용하는 리소스이다.

## 리소스를 사용하기 전에 CRD 선언을 설치하기

Helm is optimized to load as many resources into Kubernetes as fast as possible.
By design, Kubernetes can take an entire set of manifests and bring them all
online (this is called the reconciliation loop).

But there's a difference with CRDs.

For a CRD, the declaration must be registered before any resources of that CRDs
kind(s) can be used. And the registration process sometimes takes a few seconds.

### 방법 1: `helm`이 처리하게 하기

With the arrival of Helm 3, we removed the old `crd-install` hooks for a more
simple methodology. There is now a special directory called `crds` that you can
create in your chart to hold your CRDs. These CRDs are not templated, but will
be installed by default when running a `helm install` for the chart. If the CRD
already exists, it will be skipped with a warning. If you wish to skip the CRD
installation step, you can pass the `--skip-crds` flag.

#### Some caveats (and explanations)

There is not support at this time for upgrading or deleting CRDs using Helm.
This was an explicit decision after much community discussion due to the danger
for unintentional data loss. Furthermore, there is currently no community
consensus around how to handle CRDs and their lifecycle. As this evolves, Helm
will add support for those use cases.

The `--dry-run` flag of `helm install` and `helm upgrade` is not currently
supported for CRDs. The purpose of "Dry Run" is to validate that the output of
the chart will actually work if sent to the server. But CRDs are a modification
of the server's behavior. Helm cannot install the CRD on a dry run, so the
discovery client will not know about that Custom Resource (CR), and validation
will fail. You can alternatively move the CRDs to their own chart or use
`helm template` instead.

Another important point to consider in the discussion around CRD support is how
the rendering of templates is handled. One of the distinct disadvantages of the
`crd-install` method used in Helm 2 was the inability to properly validate
charts due to changing API availability (a CRD is actually adding another
available API to your Kubernetes cluster). If a chart installed a CRD, `helm` no
longer had a valid set of API versions to work against. This is also the reason
behind removing templating support from CRDs. With the new `crds` method of CRD
installation, we now ensure that `helm` has completely valid information about
the current state of the cluster.

### 방법 2: 차트 분리하기

Another way to do this is to put the CRD definition in one chart, and then put
any resources that use that CRD in _another_ chart.

In this method, each chart must be installed separately. However, this workflow
may be more useful for cluster operators who have admin access to a cluster
