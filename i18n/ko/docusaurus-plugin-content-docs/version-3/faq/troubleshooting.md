---
title: 문제 해결
sidebar_position: 4
---

## 문제 해결

### "stable" 차트 리포지토리에서 업데이트를 가져올 수 없다는 경고가 나타나요

`helm repo list`를 실행한다. `stable` 리포지토리가 `storage.googleapis.com` URL을 가리키고 있다면, 해당 리포지토리를 업데이트해야 한다. 2020년 11월 13일, 1년간의 지원 중단(deprecation) 기간 후에 Helm Charts 리포지토리가 [지원 종료](https://github.com/helm/charts#deprecation-timeline)되었다. 아카이브가 `https://charts.helm.sh/stable`에 제공되고 있지만, 더 이상 업데이트되지 않는다.

다음 명령어를 실행하여 리포지토리를 수정할 수 있다:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

`incubator` 리포지토리도 마찬가지로 https://charts.helm.sh/incubator 에서 아카이브를 사용할 수 있다. 다음 명령어를 실행하여 수정할 수 있다:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.' 경고가 나타나요

이전 Google helm 차트 리포지토리가 새로운 Helm 차트 리포지토리로 대체되었다.

다음 명령어를 실행하여 영구적으로 수정할 수 있다:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

`incubator`에서 비슷한 오류가 발생한다면, 다음 명령어를 실행한다:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Helm 리포지토리를 추가할 때 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available' 오류가 발생해요

Helm Chart 리포지토리는 [1년간의 지원 중단 기간](https://github.com/helm/charts#deprecation-timeline) 이후 더 이상 지원되지 않는다. 이 리포지토리들의 아카이브는 `https://charts.helm.sh/stable` 및 `https://charts.helm.sh/incubator`에서 사용할 수 있지만, 더 이상 업데이트되지 않는다. `helm repo add` 명령어는 `--use-deprecated-repos`를 지정하지 않으면 이전 URL을 추가할 수 없다.

### GKE(Google Container Engine)에서 "No SSH tunnels currently open" 오류가 발생해요

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

다른 형태의 오류 메시지:

```
Unable to connect to the server: x509: certificate signed by unknown authority
```

이 문제는 로컬 Kubernetes 설정 파일에 올바른 자격 증명이 없어서 발생한다.

GKE에서 클러스터를 생성하면, SSL 인증서와 인증 기관을 포함한 자격 증명이 제공된다. 이것들은 Kubernetes 설정 파일(기본값: `~/.kube/config`)에 저장되어야 `kubectl` 및 `helm`이 접근할 수 있다.

### Helm 2에서 마이그레이션한 후, `helm list`에서 일부(또는 전체) 릴리스가 표시되지 않아요

Helm 3에서는 릴리스 범위를 지정하기 위해 클러스터 네임스페이스를 사용한다는 사실을 놓쳤을 가능성이 높다. 이는 릴리스를 참조하는 모든 명령어에서 다음 중 하나를 수행해야 함을 의미한다:

* 활성 kubernetes 컨텍스트의 현재 네임스페이스에 의존하거나(`kubectl config view --minify` 명령어로 확인 가능),
* `--namespace`/`-n` 플래그를 사용하여 올바른 네임스페이스를 지정하거나,
* `helm list` 명령어의 경우, `--all-namespaces`/`-A` 플래그를 지정한다.

이는 `helm ls`, `helm uninstall` 및 릴리스를 참조하는 모든 `helm` 명령어에 적용된다.


### macOS에서 `/etc/.mdns_debug` 파일에 접근하는 이유가 뭔가요?

macOS에서 Helm이 `/etc/.mdns_debug`라는 파일에 접근하려고 하는 경우가 있다. 해당 파일이 존재하면, Helm은 실행 중에 파일 핸들을 열린 상태로 유지한다.

이는 macOS의 MDNS 라이브러리 때문이다. 이 라이브러리는 디버깅 설정(활성화된 경우)을 읽기 위해 해당 파일을 로드하려고 시도한다. 파일 핸들이 열린 상태로 유지되는 것은 적절하지 않으며, 이 문제는 Apple에 보고되었다. 그러나 이 동작을 일으키는 것은 Helm이 아니라 macOS이다.

Helm이 이 파일을 로드하지 않도록 하려면, 호스트 네트워크 스택을 사용하지 않는 정적 라이브러리로 Helm을 컴파일할 수 있다. 이렇게 하면 Helm의 바이너리 크기가 증가하지만, 파일이 열리는 것을 방지할 수 있다.

이 문제는 원래 잠재적인 보안 문제로 보고되었다. 그러나 이후 이 동작으로 인한 결함이나 취약점이 없는 것으로 확인되었다.

### helm repo add가 예전에는 작동했는데 지금은 실패해요

helm 3.3.1 이전에는, `helm repo add <reponame> <url>` 명령어가 이미 존재하는 리포지토리를 추가하려고 해도 아무런 출력을 하지 않았다. `--no-update` 플래그는 리포지토리가 이미 등록된 경우 오류를 발생시켰다.

helm 3.3.2부터는, 기존 리포지토리를 추가하려고 하면 오류가 발생한다:

`Error: repository name (reponame) already exists, please specify a different name`

이제 기본 동작이 반대로 바뀌었다. `--no-update`는 이제 무시되며, 기존 리포지토리를 대체(덮어쓰기)하려면 `--force-update`를 사용해야 한다.

이는 [Helm 3.3.2 릴리스 노트](https://github.com/helm/helm/releases/tag/v3.3.2)에 설명된 보안 수정을 위한 호환성 변경 때문이다.

### Kubernetes 클라이언트 로깅 활성화

Kubernetes 클라이언트 디버깅을 위한 로그 메시지 출력은 [klog](https://pkg.go.dev/k8s.io/klog) 플래그를 사용하여 활성화할 수 있다. 대부분의 경우 `-v` 플래그를 사용하여 상세 수준(verbosity level)을 설정하면 충분하다.

예시:

```
helm list -v 6
```

### Tiller 설치가 작동하지 않고 접근이 거부돼요

Helm 릴리스는 이전에 <https://storage.googleapis.com/kubernetes-helm/>에서 제공되었다. ["Announcing get.helm.sh"](https://helm.sh/blog/get-helm-sh/)에 설명된 것처럼 공식 위치는 2019년 6월에 변경되었다. [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller)에서 모든 이전 Tiller 이미지를 제공하고 있다.

이전에 사용하던 스토리지 버킷에서 이전 버전의 Helm을 다운로드하려고 하면 해당 파일이 누락된 것을 발견할 수 있다:

```
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

[레거시 Tiller 이미지 위치](https://gcr.io/kubernetes-helm/tiller)에서 2021년 8월부터 이미지 제거가 시작되었다. 이러한 이미지는 [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) 위치에서 사용할 수 있다. 예를 들어, v2.17.0 버전을 다운로드하려면 다음을 대체한다:

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

다음으로 변경:

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz`

Helm v2.17.0으로 초기화하려면:

`helm init —upgrade`

또는 다른 버전이 필요한 경우, --tiller-image 플래그를 사용하여 기본 위치를 재정의하고 특정 Helm v2 버전을 설치할 수 있다:

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**참고:** Helm 유지관리자들은 현재 지원되는 Helm 버전으로의 마이그레이션을 권장한다. Helm v2.17.0은 Helm v2의 마지막 릴리스였으며, Helm v2는 2020년 11월부터 지원되지 않는다. 자세한 내용은 [Helm 2 and the Charts Project Are Now Unsupported](https://helm.sh/blog/helm-2-becomes-unsupported/)를 참고한다. 그 이후로 많은 CVE가 Helm에 대해 보고되었으며, 이러한 취약점은 Helm v3에서 패치되었지만 Helm v2에서는 패치되지 않는다. [현재 게시된 Helm 보안 권고 목록](https://github.com/helm/helm/security/advisories?state=published)을 확인하고 오늘 [Helm v3로 마이그레이션](/topics/v2_v3_migration.md)할 계획을 세우기 바란다.
