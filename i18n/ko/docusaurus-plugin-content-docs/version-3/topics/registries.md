---
title: OCI 기반 레지스트리 사용
description: 차트 배포를 위한 OCI 사용법을 설명한다.
sidebar_position: 7
---

Helm 3부터 [OCI](https://www.opencontainers.org/) 지원이 가능한 컨테이너 레지스트리를 사용하여 차트 패키지를 저장하고 공유할 수 있다. Helm v3.8.0부터 OCI 지원이 기본적으로 활성화되어 있다.


## v3.8.0 이전의 OCI 지원

OCI 지원은 Helm v3.8.0에서 실험적 기능에서 정식(GA) 기능으로 전환되었다. 이전 버전의 Helm에서는 OCI 지원이 다르게 동작했다. Helm v3.8.0 이전에 OCI 지원을 사용했다면, 버전별로 변경된 사항을 이해하는 것이 중요하다.

### v3.8.0 이전 OCI 지원 활성화

Helm v3.8.0 이전에는 OCI 지원이 *실험적* 기능이었으며 수동으로 활성화해야 했다.

Helm v3.8.0 이전 버전에서 OCI 실험적 지원을 활성화하려면 환경에서 `HELM_EXPERIMENTAL_OCI`를 설정한다. 예시:

```console
export HELM_EXPERIMENTAL_OCI=1
```

### v3.8.0의 OCI 기능 지원 중단 및 동작 변경

[Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0) 릴리스에서는 이전 버전과 다음 기능 및 동작이 다르다:

- 차트의 dependencies에서 OCI로 설정할 때 버전을 다른 dependencies처럼 범위로 지정할 수 있다.
- 빌드 정보가 포함된 SemVer 태그를 푸시하고 사용할 수 있다. OCI 레지스트리는 태그 문자로 `+`를 지원하지 않는다. Helm은 태그로 저장할 때 `+`를 `_`로 변환한다.
- `helm registry login` 명령이 이제 자격 증명 저장에 Docker CLI와 동일한 구조를 따른다. 레지스트리 설정에 동일한 위치를 Helm과 Docker CLI 모두에 전달할 수 있다.

### v3.7.0의 OCI 기능 지원 중단 및 동작 변경

[Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) 릴리스에는 OCI 지원을 위한 [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) 구현이 포함되었다. 그 결과, 이전 버전과 다음 기능 및 동작이 다르다:

- `helm chart` 하위 명령이 제거되었다.
- 차트 캐시가 제거되었다 (`helm chart list` 등이 없음).
- OCI 레지스트리 참조에는 이제 항상 `oci://` 접두사가 붙는다.
- 레지스트리 참조의 기본 이름(basename)은 *항상* 차트의 이름과 일치해야 한다.
- 레지스트리 참조의 태그는 *항상* 차트의 시맨틱 버전과 일치해야 한다 (즉, `latest` 태그 사용 불가).
- 차트 레이어 미디어 타입이 `application/tar+gzip`에서 `application/vnd.cncf.helm.chart.content.v1.tar+gzip`으로 변경되었다.


## OCI 기반 레지스트리 사용

### OCI 기반 레지스트리의 Helm 리포지토리

[Helm 리포지토리](/topics/chart_repository.md)는 패키지된 Helm 차트를 저장하고 배포하는 장소다. OCI 기반 레지스트리는 0개 이상의 Helm 리포지토리를 포함할 수 있으며, 각 리포지토리는 0개 이상의 패키지된 Helm 차트를 포함할 수 있다.

### 호스팅 레지스트리 사용

Helm 차트에 사용할 수 있는 OCI 지원 호스팅 컨테이너 레지스트리가 여러 개 있다. 예시:

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Cloudsmith](https://help.cloudsmith.io/docs/oci-repository)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)
- [RepoFlow](https://docs.repoflow.io/PackageTypes/helm#oci-helm-support)
  

호스팅 컨테이너 레지스트리 제공자의 문서를 따라 OCI 지원이 가능한 레지스트리를 생성하고 구성한다.

**참고:** 개발 컴퓨터에서 OCI 기반 레지스트리인 [Docker Registry](https://docs.docker.com/registry/deploying/)나 [`zot`](https://github.com/project-zot/zot)를 실행할 수 있다. 개발 컴퓨터에서 OCI 기반 레지스트리를 실행하는 것은 테스트 목적으로만 사용해야 한다.

### sigstore를 사용한 OCI 기반 차트 서명

[`helm-sigstore`](https://github.com/sigstore/helm-sigstore) 플러그인을 사용하면 컨테이너 이미지 서명에 사용하는 것과 동일한 도구로 [Sigstore](https://sigstore.dev/)를 사용하여 Helm 차트에 서명할 수 있다. 이는 기존 [차트 리포지토리](/topics/chart_repository.md)에서 지원하는 [GPG 기반 출처 확인](/topics/provenance.md)의 대안을 제공한다.

`helm sigstore` 플러그인 사용에 대한 자세한 내용은 [해당 프로젝트 문서](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md)를 참조한다.

## 레지스트리 작업 명령어

### `registry` 하위 명령

#### `login`

레지스트리에 로그인 (암호 수동 입력)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

레지스트리에서 로그아웃

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### `push` 하위 명령

차트를 OCI 기반 레지스트리에 업로드:

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

`push` 하위 명령은 `helm package`를 사용하여 미리 생성된 `.tgz` 파일에 대해서만 사용할 수 있다.

`helm push`를 사용하여 OCI 레지스트리에 차트를 업로드할 때, 참조에는 반드시 `oci://` 접두사가 붙어야 하며 기본 이름(basename)이나 태그를 포함해서는 안 된다.

레지스트리 참조의 기본 이름(basename)은 차트 이름에서 추론되고, 태그는 차트의 시맨틱 버전에서 추론된다. 이는 현재 엄격하게 요구되는 사항이다.

일부 레지스트리에서는 리포지토리 및/또는 네임스페이스(지정된 경우)를 미리 생성해야 한다. 그렇지 않으면 `helm push` 작업 중 오류가 발생한다.

[출처 파일](/topics/provenance.md) (`.prov`)을 생성했고, 이 파일이 차트 `.tgz` 파일 옆에 있으면 `push` 시 자동으로 레지스트리에 업로드된다. 이 경우 [Helm 차트 매니페스트](#helm-차트-매니페스트)에 추가 레이어가 생성된다.

[helm-push 플러그인](https://github.com/chartmuseum/helm-push) (차트를 [ChartMuseum](/topics/chart_repository.md#chartmuseum-리포지토리-서버)에 업로드하기 위한) 사용자는 이 플러그인이 새로운 내장 `push`와 충돌하기 때문에 문제가 발생할 수 있다. v0.10.0 버전부터 플러그인은 `cm-push`로 이름이 변경되었다.

### 기타 하위 명령

`oci://` 프로토콜 지원은 다양한 다른 하위 명령에서도 사용할 수 있다. 전체 목록은 다음과 같다:

- `helm pull`
- `helm push`
- `helm show `
- `helm template`
- `helm install`
- `helm upgrade`

차트 다운로드가 관련된 모든 유형의 작업에는 레지스트리 참조의 기본 이름(차트 이름)이 포함된다 (`helm push`에서는 생략됨).

다음은 위에 나열된 하위 명령을 OCI 기반 차트에 사용하는 몇 가지 예시다:

```
$ helm pull oci://localhost:5000/helm-charts/mychart --version 0.1.0
Pulled: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:0be7ec9fb7b962b46d81e4bb74fdcdb7089d965d3baca9f85d64948b05b402ff

$ helm show all oci://localhost:5000/helm-charts/mychart --version 0.1.0
apiVersion: v2
appVersion: 1.16.0
description: A Helm chart for Kubernetes
name: mychart
...

$ helm template myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
---
# Source: mychart/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
...

$ helm install myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...

$ helm upgrade myrelease oci://localhost:5000/helm-charts/mychart --version 0.2.0
Release "myrelease" has been upgraded. Happy Helming!
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
NOTES:
...
```

## 다이제스트를 사용한 차트 설치

다이제스트를 사용하여 차트를 설치하는 것은 태그보다 더 안전하다. 다이제스트는 불변이기 때문이다.
다이제스트는 차트 URI에 지정한다:

```
$ helm install myrelease oci://localhost:5000/helm-charts/mychart@sha256:52ccaee6d4dd272e54bfccda77738b42e1edf0e4a20c27e23f0b6c15d01aef79
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...
```

## dependencies 지정

`dependency update` 하위 명령을 사용하여 레지스트리에서 차트의 dependencies를 가져올 수 있다.

`Chart.yaml`의 특정 항목에 대한 `repository`는 기본 이름 없이 레지스트리 참조로 지정한다:

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
`dependency update`가 실행되면 `oci://localhost:5000/myrepo/mychart:2.7.0`을 가져온다.

## Helm 차트 매니페스트

레지스트리에 표시되는 Helm 차트 매니페스트 예시 (`mediaType` 필드 참고):
```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

다음 예시에는 [출처 파일](/topics/provenance.md)이 포함되어 있다 (추가 레이어 참고):

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

## 차트 리포지토리에서 마이그레이션

기존 [차트 리포지토리](/topics/chart_repository.md) (index.yaml 기반 리포지토리)에서 마이그레이션하는 작업은 `helm pull`을 사용한 다음 `helm push`를 사용하여 생성된 `.tgz` 파일을 레지스트리에 업로드하면 된다.
