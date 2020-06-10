---
title: "자주 묻는 질문"
weight: 8
---

# 자주 묻는 질문

> 헬름 2와 헬름 3의 주요 차이점이 무엇인가요?
> 이 페이지는 자주 나오는 질문들로 도움을 드립니다.

이 문서를 개선하는 **당신의 도움을 기대**합니다.
정보를 추가, 수정, 삭제하려면, [이슈를 등록](https://github.com/helm/helm-www/issues)하거나 풀 리퀘스트(pull request)를 보내주세요.

## 헬름 2 이후 변화

이 문서는 헬름 3에 도입된 모든 주요 변경사항의 상세 목록입니다.

### 틸러(tiller) 제거

During the Helm 2 development cycle, we introduced Tiller. Tiller played an
important role for teams working on a shared cluster - it made it possible for
multiple different operators to interact with the same set of releases.

With role-based access controls (RBAC) enabled by default in Kubernetes 1.6,
locking down Tiller for use in a production scenario became more difficult to
manage. Due to the vast number of possible security policies, our stance was to
provide a permissive default configuration. This allowed first-time users to
start experimenting with Helm and Kubernetes without having to dive headfirst
into the security controls. Unfortunately, this permissive configuration could
grant a user a broad range of permissions they weren’t intended to have. DevOps
and SREs had to learn additional operational steps when installing Tiller into a
multi-tenant cluster.

After hearing how community members were using Helm in certain scenarios, we
found that Tiller’s release management system did not need to rely upon an
in-cluster operator to maintain state or act as a central hub for Helm release
information. Instead, we could simply fetch information from the Kubernetes API
server, render the Charts client-side, and store a record of the installation in
Kubernetes.

Tiller’s primary goal could be accomplished without Tiller, so one of the first
decisions we made regarding Helm 3 was to completely remove Tiller.

With Tiller gone, the security model for Helm is radically simplified. Helm 3
now supports all the modern security, identity, and authorization features of
modern Kubernetes. Helm’s permissions are evaluated using your [kubeconfig
file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/).
Cluster administrators can restrict user permissions at whatever granularity
they see fit. Releases are still recorded in-cluster, and the rest of Helm’s
functionality remains.

### 업그레이드 전략 개선: 3-방향 전략적 병합 패치

Helm 2 used a two-way strategic merge patch. During an upgrade, it compared the
most recent chart's manifest against the proposed chart's manifest (the one
supplied during `helm upgrade`). It compared the differences between these two
charts to determine what changes needed to be applied to the resources in
Kubernetes. If changes were applied to the cluster out-of-band (such as during a
`kubectl edit`), those changes were not considered. This resulted in resources
being unable to roll back to its previous state: because Helm only considered
the last applied chart's manifest as its current state, if there were no changes
in the chart's state, the live state was left unchanged.

In Helm 3, we now use a three-way strategic merge patch. Helm considers the old
manifest, its live state, and the new manifest when generating a patch.

#### 예시

Let's go through a few common examples what this change impacts.

##### 라이브(live) 상태 변경시 롤백

Your team just deployed their application to production on Kubernetes using
Helm. The chart contains a Deployment object where the number of replicas is set
to three:

```console
$ helm install myapp ./myapp
```

A new developer joins the team. On their first day while observing the
production cluster, a horrible coffee-spilling-on-the-keyboard accident happens
and they `kubectl scale` the production deployment from three replicas down to
zero.

```console
$ kubectl scale --replicas=0 deployment/myapp
```

Another developer on your team notices that the production site is down and
decides to rollback the release to its previous state:

```console
$ helm rollback myapp
```

What happens?

In Helm 2, it would generate a patch, comparing the old manifest against the new
manifest. Because this is a rollback, it's the same manifest. Helm would
determine that there is nothing to change because there is no difference between
the old manifest and the new manifest. The replica count continues to stay at
zero. Panic ensues.

In Helm 3, the patch is generated using the old manifest, the live state, and
the new manifest. Helm recognizes that the old state was at three, the live
state is at zero and the new manifest wishes to change it back to three, so it
generates a patch to change the state back to three.

##### 라이브 상태 변경시 업그레이드

Many service meshes and other controller-based applications inject data into
Kubernetes objects. This can be something like a sidecar, labels, or other
information. Previously if you had the given manifest rendered from a Chart:

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

And the live state was modified by another application to

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

Now, you want to upgrade the `nginx` image tag to `2.1.0`. So, you upgrade to a
chart with the given manifest:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

What happens?

In Helm 2, Helm generates a patch of the `containers` object between the old
manifest and the new manifest. The cluster's live state is not considered during
the patch generation.

The cluster's live state is modified to look like the following:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

The sidecar pod is removed from live state. More panic ensues.

In Helm 3, Helm generates a patch of the `containers` object between the old
manifest, the live state, and the new manifest. It notices that the new manifest
changes the image tag to `2.1.0`, but live state contains a sidecar container.

The cluster's live state is modified to look like the following:

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

### 이제 릴리스 이름이 네임스페이스로 구획됨(scope)

With the removal of Tiller, the information about each release had to go
somewhere. In Helm 2, this was stored in the same namespace as Tiller. In
practice, this meant that once a name was used by a release, no other release
could use that same name, even if it was deployed in a different namespace.

In Helm 3, information about a particular release is now stored in the
same namespace as the release itself. This means that users can now `helm
install wordpress stable/wordpress` in two separate namespaces, and each can be
referred with `helm list` by changing the current namespace context (e.g. `helm
list --namespace foo`).

With this greater alignment to native cluster namespaces, the `helm list` command
no longer lists all releases by default. Instead, it will list only the releases
in the namespace of your current kubernetes context (i.e. the namespace shown
when you run `kubectl config view --minify`). It also means you must supply the
`--all-namespaces` flag to `helm list` to get behaviour similar to Helm 2.

### 시크릿(secret)이 기본 스토리지 드라이버로

In Helm 3, Secrets are now used as the [default storage driver](/docs/topics/advanced/#storage-backends). Helm 2 used ConfigMaps by default to store release information. In Helm 2.7.0, a new storage backend that uses Secrets for storing release information was implemented, and it is now the default starting in Helm 3.

Changing to Secrets as the Helm 3 default allows for additional security in protecting charts in conjunction with the release of Secret encryption in Kubernetes.

[Encrypting secrets at rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) became available as an alpha feature in Kubernetes 1.7 and became stable as of Kubernetes 1.13. This allows users to encrypt Helm release metadata at rest, and so it is a good starting point that can be expanded later into using something like Vault.

### Go 임포트 경로 변경

In Helm 3, Helm switched the Go import path over from `k8s.io/helm` to
`helm.sh/helm/v3`. If you intend to upgrade to the Helm 3 Go client libraries,
make sure to change your import paths.

### 수용능력

스테이지 렌더링시에 사용가능한 `.Capabilities` 빌트인 객체가 간소화되었다.

[빌트인 객체](/docs/chart_template_guide/builtin_objects/)

### JSON스키마로 차트 값 유효성 검사

A JSON Schema can now be imposed upon chart values. This ensures that values
provided by the user follow the schema laid out by the chart maintainer,
providing better error reporting when the user provides an incorrect set of
values for a chart.

Validation occurs when any of the following commands are invoked:

* `helm install`
* `helm upgrade`
* `helm template`
* `helm lint`

See the documentation on [Schema files](/docs/topics/charts#schema-files) for
more information.

### `requirements.yaml`이 `Chart.yaml` 안으로 통합

The Chart dependency management system moved from requirements.yaml and
requirements.lock to Chart.yaml and Chart.lock. We recommend that new charts
meant for Helm 3 use the new format. However, Helm 3 still understands Chart API
version 1 (`v1`) and will load existing `requirements.yaml` files

In Helm 2, this is how a `requirements.yaml` looked:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://kubernetes-charts.storage.googleapis.com/
  condition: mariadb.enabled
  tags:
    - database
```

In Helm 3, the dependency is expressed the same way, but now from your
`Chart.yaml`:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://kubernetes-charts.storage.googleapis.com/
  condition: mariadb.enabled
  tags:
    - database
```

Charts are still downloaded and placed in the `charts/` directory, so subcharts
vendored into the `charts/` directory will continue to work without
modification.

### 이제 설치시 이름(또는 --generate-name)은 필수사항

In Helm 2, if no name was provided, an auto-generated name would be given. In
production, this proved to be more of a nuisance than a helpful feature. In Helm
3, Helm will throw an error if no name is provided with `helm install`.

For those who still wish to have a name auto-generated for you, you can use the
`--generate-name` flag to create one for you.

### OCI 레지스트리로 차트 푸시

This is an experimental feature introduced in Helm 3. To use, set the
environment variable `HELM_EXPERIMENTAL_OCI=1`.

At a high level, a Chart Repository is a location where Charts can be stored and
shared. The Helm client packs and ships Helm Charts to a Chart Repository.
Simply put, a Chart Repository is a basic HTTP server that houses an index.yaml
file and some packaged charts.

While there are several benefits to the Chart Repository API meeting the most
basic storage requirements, a few drawbacks have started to show:

- Chart Repositories have a very hard time abstracting most of the security
  implementations required in a production environment. Having a standard API
  for authentication and authorization is very important in production
  scenarios.
- Helm’s Chart provenance tools used for signing and verifying the integrity and
  origin of a chart are an optional piece of the Chart publishing process.
- In multi-tenant scenarios, the same Chart can be uploaded by another tenant,
  costing twice the storage cost to store the same content. Smarter chart
  repositories have been designed to handle this, but it’s not a part of the
  formal specification.
- Using a single index file for search, metadata information, and fetching
  Charts has made it difficult or clunky to design around in secure multi-tenant
  implementations.

Docker’s Distribution project (also known as Docker Registry v2) is the
successor to the Docker Registry project. Many major cloud vendors have a
product offering of the Distribution project, and with so many vendors offering
the same product, the Distribution project has benefited from many years of
hardening, security best practices, and battle-testing.

Please have a look at `helm help chart` and `helm help registry` for more
information on how to package a chart and push it to a Docker registry.

For more info, please see [this page](/docs/topics/registries/).

### `helm serve` 제거

`helm serve` ran a local Chart Repository on your machine for development
purposes. However, it didn't receive much uptake as a development tool and had
numerous issues with its design. In the end, we decided to remove it and split
it out as a plugin.

For a similar experience to `helm serve`, have a look at the local filesystem
storage option in
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
and the [servecm plugin](https://github.com/jdolitsky/helm-servecm).


### 라이브러리 차트 지원

Helm 3 supports a class of chart called a “library chart”. This is a chart that
is shared by other charts, but does not create any release artifacts of its own.
A library chart’s templates can only declare `define` elements. Globally scoped
non-`define` content is simply ignored. This allows users to re-use and share
snippets of code that can be re-used across many charts, avoiding redundancy and
keeping charts [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Library charts are declared in the dependencies directive in Chart.yaml, and are
installed and managed like any other chart.

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

We’re very excited to see the use cases this feature opens up for chart
developers, as well as any best practices that arise from consuming library
charts.

### Chart.yaml apiVersion 격상

With the introduction of library chart support and the consolidation of
requirements.yaml into Chart.yaml, clients that understood Helm 2's package
format won't understand these new features. So, we bumped the apiVersion in
Chart.yaml from `v1` to `v2`.

`helm create` now creates charts using this new format, so the default
apiVersion was bumped there as well.

Clients wishing to support both versions of Helm charts should inspect the
`apiVersion` field in Chart.yaml to understand how to parse the package format.

### XDG 베이스 디렉토리 지원

[The XDG Base Directory
Specification](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
is a portable standard defining where configuration, data, and cached files
should be stored on the filesystem.

In Helm 2, Helm stored all this information in `~/.helm` (affectionately known
as `helm home`), which could be changed by setting the `$HELM_HOME` environment
variable, or by using the global flag `--home`.

In Helm 3, Helm now respects the following environment variables as per the XDG
Base Directory Specification:

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

Helm plugins are still passed `$HELM_HOME` as an alias to `$XDG_DATA_HOME` for
backwards compatibility with plugins looking to use `$HELM_HOME` as a scratchpad
environment.

Several new environment variables are also passed in to the plugin's environment
to accommodate this change:

- `$HELM_PATH_CACHE` for the cache path
- `$HELM_PATH_CONFIG` for the config path
- `$HELM_PATH_DATA` for the data path

Helm plugins looking to support Helm 3 should consider using these new
environment variables instead.

### CLI 명령어 이름변경

In order to better align the verbiage from other package managers, `helm delete`
was re-named to `helm uninstall`. `helm delete` is still retained as an alias to
`helm uninstall`, so either form can be used.

In Helm 2, in order to purge the release ledger, the `--purge` flag had to be
provided. This functionality is now enabled by default. To retain the previous
behavior, use `helm uninstall --keep-history`.

Additionally, several other commands were re-named to accommodate the same
conventions:

- `helm inspect` -> `helm show`
- `helm fetch` -> `helm pull`

These commands have also retained their older verbs as aliases, so you can
continue to use them in either form.

### 네임스페이스 자동 생성

When creating a release in a namespace that does not exist, Helm 2 created the
namespace.  Helm 3 follows the behavior of other Kubernetes tooling and returns
an error if the namespace does not exist.  Helm 3 will create the namespace if
you explicitly specify `--create-namespace` flag.

## 설치

### 헬름의 데비안/페도라/... 네이티브 패키지는 왜 없나요?

We'd love to provide these or point you toward a trusted provider. If you're
interested in helping, we'd love it. This is how the Homebrew formula was
started.

### 왜 `curl ...|bash` 스크립트를 제공하나요?

There is a script in our repository (`scripts/get-helm-3`) that can be executed as a
`curl ..|bash` script. The transfers are all protected by HTTPS, and the script
does some auditing of the packages it fetches. However, the script has all the
usual dangers of any shell script.

We provide it because it is useful, but we suggest that users carefully read the
script first. What we'd really like, though, are better packaged releases of
Helm.

### 헬름 클라이언트 파일들을 기본값 말고 다른 곳에 두려면 어떻게 하나요?

헬름은 파일을 보관할 때 XDG 구조를 사용한다. 그 위치를 오버라이드(override)할 수 있는 환경변수가 있다.

- `$XDG_CACHE_HOME`: 캐시 파일 보관장소를 다른 곳으로 설정
- `$XDG_CONFIG_HOME`: 헬름 설정 파일 보관장소를 다른 곳으로 설정
- `$XDG_DATA_HOME`: 헬름 데이터 보관장소를 다른 곳으로 설정

기존 리포지터리들이 있다면, `helm repo add...`으로 다시 추가할 필요가 있음을 알아두자.


## 언인스톨

### 로컬 헬름을 삭제하고 싶어요. 그 파일들은 모두 어디에 있나요?

`helm` 바이너리에 따라, Helm는 일부 파일들을 다음 위치에 저장한다.

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

The following table gives the default folder for each of these, by OS:

| 운영 체제        | 캐시 경로                   | 설정 경로                        | 데이터 경로               |
|------------------|-----------------------------|----------------------------------|---------------------------|
| 리눅스           | `$HOME/.cache/helm `        | `$HOME/.config/helm `            | `$HOME/.local/share/helm` |
| 맥OS             | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `     |
| 윈도우           | `%TEMP%\helm  `             | `%APPDATA%\helm `                | `%APPDATA%\helm`          |

## 트러블슈팅

### GKE (Google Container Engine)에서 "No SSH tunnels currently open"라고 나와요

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Another variation of the error message is:


```
Unable to connect to the server: x509: certificate signed by unknown authority
```

The issue is that your local Kubernetes config file must have the correct
credentials.

When you create a cluster on GKE, it will give you credentials, including SSL
certificates and certificate authorities. These need to be stored in a
Kubernetes config file (Default: `~/.kube/config` so that `kubectl` and `helm`
can access them.

### 헬름 2에서 전환 후, `helm list`에는 릴리스들이 일부만 보여요(또는 안 보여요).

헬름 3는 이제 클러스터 네임스페이스를 사용하여 릴리스들을 구획한다는 사실을 깜빡했을지 모르겠다.
따라서, 릴리스를 참조하는 모든 명령어에 대해:

* 활성 쿠버네티스 컨텍스트(`kubectl config view --minify` 명령어로 확인)에서의 현재 네임스페이스를 그대로 따르거나
* `--namespace`/`-n` 플래그를 사용하여 올바른 네임스페이스를 지정해야 한다.
* 한편 `helm list` 명령어에 대해서는 `--all-namespaces`/`-A` 플래그를 지정할 수 한다.

이는 `helm ls`, `helm uninstall`, 그리고 릴리스를 참조하는 나머지 모든 `helm` 명령어에 적용된다.

