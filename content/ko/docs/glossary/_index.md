---
title: "용어집" 
description: "헬름 아키텍처의 컴포넌트들을 기술하기 위해 사용된 용어."
weight: 9
---

# 용어집

## 차트

쿠버네티스 클러스터 내에 리소스 세트를 설치하는 데 필요한 정보를 담고 있는 헬름 패키지

차트는 템플릿을 비롯하여 `Chart.yaml` 파일, 기본 값(`values.yaml`), 의존성(dependencies)을 포함한다.

차트는 잘 정의된 디렉토리 구조 속에서 개발되며, _chart archive_라고 하는 아카이브 형식으로 패키징된다.

## 차트 아카이브

_chart archive_는 tar와 gzip으로 (필요시 서명을 추가한) 묶인 차트이다.

## 차트 의존성 (서브차트)

차트는 다른 차트에 의존(depend)할 수 있다. 의존성을 일으키는 2가지 방법은 다음과 같다.

- 약한 의존성: 클러스터에 다른 차트가 없으면 차트가 동작하지 않을 수 있다. 
  헬름은 이런 경우에 필요한 도구를 제공하지 않으며, 별도로 의존성을 관리해야 한다.
- 강한 의존성: A chart may contain (inside of its `charts/` directory)
  another chart upon which it depends. In this case, installing the chart will
  install all of its dependencies. In this case, a chart and its dependencies
  are managed as a collection.

When a chart is packaged (via `helm package`) all of its hard dependencies are
bundled with it.

## Chart Version

Charts are versioned according to the [SemVer 2 spec](https://semver.org). A
version number is required on every chart.

## Chart.yaml

Information about a chart is stored in a special file called `Chart.yaml`. Every
chart must have this file.

## Helm (and helm)

Helm is the package manager for Kubernetes. As an operating system package
manager makes it easy to install tools on an OS, Helm makes it easy to install
applications and resources into Kubernetes clusters.

While _Helm_ is the name of the project, the command line client is also named
`helm`. By convention, when speaking of the project, _Helm_ is capitalized. When
speaking of the client, _helm_ is in lowercase.

## Helm Configuration Files (XDG)

Helm stores its configuration files in XDG directories. These directories are
created the first time `helm` is run.

## Kube Config (KUBECONFIG)

The Helm client learns about Kubernetes clusters by using files in the _Kube
config_ file format. By default, Helm attempts to find this file in the place
where `kubectl` creates it (`$HOME/.kube/config`).

## Lint (Linting)

To _lint_ a chart is to validate that it follows the conventions and
requirements of the Helm chart standard. Helm provides tools to do this, notably
the `helm lint` command.

## Provenance (Provenance file)

Helm charts may be accompanied by a _provenance file_ which provides information
about where the chart came from and what it contains.

Provenance files are one part of the Helm security story. A provenance contains
a cryptographic hash of the chart archive file, the Chart.yaml data, and a
signature block (an OpenPGP "clearsign" block). When coupled with a keychain,
this provides chart users with the ability to:

- Validate that a chart was signed by a trusted party
- Validate that the chart file has not been tampered with
- Validate the contents of a chart metadata (`Chart.yaml`)
- Quickly match a chart to its provenance data

Provenance files have the `.prov` extension, and can be served from a chart
repository server or any other HTTP server.

## Release

When a chart is installed, the Helm library creates a _release_ to track that
installation.

A single chart may be installed many times into the same cluster, and create
many different releases. For example, one can install three PostgreSQL databases
by running `helm install` three times with a different release name.

## Release Number (Release Version)

A single release can be updated multiple times. A sequential counter is used to
track releases as they change. After a first `helm install`, a release will have
_release number_ 1. Each time a release is upgraded or rolled back, the release
number will be incremented.

## Rollback

A release can be upgraded to a newer chart or configuration. But since release
history is stored, a release can also be _rolled back_ to a previous release
number. This is done with the `helm rollback` command.

Importantly, a rolled back release will receive a new release number.

| Operation  | Release Number                                       |
|------------|------------------------------------------------------|
| install    | release 1                                            |
| upgrade    | release 2                                            |
| upgrade    | release 3                                            |
| rollback 1 | release 4 (but running the same config as release 1) |

The above table illustrates how release numbers increment across install,
upgrade, and rollback.

## Helm Library (or SDK)

The Helm Library (or SDK) refers to the Go code that interacts directly with the
Kubernetes API server to install, upgrade, query, and remove Kubernetes
resources. It can be imported into a project to use Helm as a client library
instead of a CLI.

## Repository (Repo, Chart Repository)

Helm charts may be stored on dedicated HTTP servers called _chart repositories_
(_repositories_, or just _repos_).

A chart repository server is a simple HTTP server that can serve an `index.yaml`
file that describes a batch of charts, and provides information on where each
chart can be downloaded from. (Many chart repositories serve the charts as well
as the `index.yaml` file.)

A Helm client can point to zero or more chart repositories. By default, Helm
clients are not configured with any chart repositories. Chart repositories can
be added at any time using the `helm repo add` command.

## Values (Values Files, values.yaml)

Values provide a way to override template defaults with your own information.

Helm Charts are "parameterized", which means the chart developer may expose
configuration that can be overridden at installation time. For example, a chart
may expose a `username` field that allows setting a user name for a service.

These exposed variables are called _values_ in Helm parlance.

Values can be set during `helm install` and `helm upgrade` operations, either by
passing them in directly, or by using a `values.yaml` file.

