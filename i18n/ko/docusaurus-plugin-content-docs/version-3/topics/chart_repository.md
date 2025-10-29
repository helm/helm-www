---
title: 차트 저장소 가이드
description: 헬름 차트 저장소를 만들고 작업하는 방법
sidebar_position: 6
---

이 섹션에서는 Helm 차트 저장소를 만들고 작업하는 방법을 설명한다.
고수준에서 차트 저장소는 패키지형 차트를 저장하고 
공유할 수 있는 장소다.

공식 차트 저장소는 [쿠버네티스 차트](https://github.com/helm/charts)가 
관리하고 있으며 참여를 환영한다. 하지만 헬름도 자신만의 차트 저장소를 
쉽게 만들고 운영할 수 있게 해준다. 이 가이드에서는 
그렇게 하는 방법을 설명한다.

## 전제 조건

* [빠른 시작](/intro/quickstart.md) 가이드 살펴보기
* [차트](/topics/charts.md) 문서 읽기

## 차트 저장소 생성

_차트 저장소_ 는 `index.yaml` 파일과 패키지화된 차트를 
저장하는 HTTP 서버다. 차트를 공유할 준비가 되면 
차트 저장소에 업로드하는 것이 가장 선호되는 방법이다.

**참고:** Helm 2.0.0의 경우 차트 저장소는 고유한 인증 방법이 없다.
GitHub에 [이슈 트래킹 
프로세스](https://github.com/helm/helm/issues/1038)가 있다.

차트 저장소는 YAML과 tar 파일을 서비스할 수 있고 
GET 요청에 응답할 수 있는 모든 HTTP 서버가 될 수 있기 때문에, 
자신만의 차트 저장소를 호스팅하는 것에 관한 한 수많은 옵션이 있다. 
예를 들어 GCS(구글 클라우드 스토리지) 버킷, Amazon S3 버킷, GitHub Pages를
사용하거나 직접 웹 서버를 만들 수도 있다.

### 차트 저장소 구조

차트 저장소는 패키지형 차트와 저장소에 있는 모든 차트의 인덱스를 가진 `index.yaml` 이라는
특수 파일로 구성된다. 종종 `index.yaml` 에 기술된 차트도
[출처 파일](/topics/provenance.md)처럼 동일한 서버에서
호스팅된다.

예를 들어, 저장소 `https://example.com/charts` 의 레이아웃은 
다음과 같을 수 있다:

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

이 경우에는 인덱스 파일에 하나의 차트, 즉 알파인 차트에 대한 정보가 포함되며,
해당 차트에 대한 다운로드 URL 
`https://example.com/charts/alpine-0.1.2.tgz` 을 제공한다.

차트 패키지가 `index.yaml` 파일과 동일한 서버에 위치할 필요는 없다.
하지만 그렇게 하는 것이 종종 가장 쉽다.

### 인덱스 파일

인덱스 파일은 `index.yaml` 이라는 yaml 파일이다. 차트의 
`Chart.yaml` 파일의 내용을 포함하여 패키지에 대한 메타데이터가 
포함되어 있다. 적합한 차트 저장소는 인덱스 파일이 있어야 한다. 
인덱스 파일에는 차트 저장소의 각 차트에 대한 정보가 들어 있다. 
`helm repo index` 명령은 패키지형 차트를 포함하는 지정된 
로컬 디렉토리를 기반으로 인덱스 파일을 생성한다.

인덱스 파일의 예:

```yaml
apiVersion: v1
entries:
  alpine:
    - created: 2016-10-06T16:23:20.499814565-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 99c76e403d752c84ead610644d4b1c2f2b453a74b921f422b9dcb8a7c8b559cd
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.2.0.tgz
      version: 0.2.0
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 515c58e5f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cd78727
      home: https://helm.sh/helm
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
      home: https://helm.sh/helm
      name: nginx
      sources:
      - https://github.com/helm/charts
      urls:
      - https://technosophos.github.io/tscharts/nginx-1.1.0.tgz
      version: 1.1.0
generated: 2016-10-06T16:23:20.499029981-06:00
```

## 차트 저장소 호스팅

이 절은 차트 저장소를 서비스하는 몇 가지 방법을 보여준다.

### 구글 클라우드 스토리지

첫 번째 단계는 **GCS 버킷 만들기**다. `fantastic-charts` 라고 부를 것이다.

![GCS 버킷 생성](https://helm.sh/img/create-a-bucket.png)

다음으로, **버킷 권한을 수정**하여 버킷을 공개하자.

![권한 수정](https://helm.sh/img/edit-permissions.png)

**버킷을 공개하기 위해** 다음 줄을 넣자.

![버킷 공개](https://helm.sh/img/make-bucket-public.png)

축하한다, 이제 차트를 서비스할 빈 GCS 버킷이 준비되었다!

구글 클라우드 스토리지 명령줄 도구 또는 GCS 웹 UI를 사용하여 차트 
저장소를 업로드하자. 이것은 공식 쿠버네티스 차트 저장소가 
차트를 호스팅하는 기술이기 때문에, 만약 막히면 당신은 [그 프로젝트를 
간단히 보는 것](https://github.com/helm/charts)이 좋을 것이다.

**참고:** 공용 GCS 버킷은 `https://bucket-name.storage.googleapis.com/` 에서 간단한
HTTPS를 통해 접근할 수 있다.

### JFrog 아티팩토리

JFrog 아티팩토리를 사용하여 차트 저장소를 만들 수도 있다. JFrog 아티팩토리가 있는
차트 저장소에 대한 자세한 내용은
[여기](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories)를 참조하자.

### 깃헙 페이지 예제

비슷한 방법으로 깃헙 페이지를 사용하여 차트 저장소를 만들 수 있다.

깃헙은 두 가지 방법으로 정적 웹 페이지를 서비스할 수 있도록 한다.

- `docs/` 디렉토리의 내용을 서비스하도록 프로젝트를 설정
- 특정 브랜치를 서비스하도록 프로젝트를 설정

첫 번째 방법이 쉽지만 두 번째 방법을 택하겠다.

첫 번째 단계는 **gh-pages 분기를 만드는** 것이다. 로컬에서 만들 수 있다.

```console
$ git checkout -b gh-pages
```

깃헙 저장소의 **Branch** 버튼을 눌러 웹 브라우저를 통해 만들 수도 있다.

![깃헙 페이지 브랜치 생성](https://helm.sh/img/create-a-gh-page-button.png)

그런 다음 **gh-pages 브랜치**가 깃헙 페이지로 설정되어 있는지 
확인하고 저장소의 **Settings**를 클릭한 다음 **깃헙 페이지** 섹션으로 
스크롤하여 아래와 같이 설정하자.

![깃헙 페이지 브랜치 생성](https://helm.sh/img/set-a-gh-page.png)

기본적으로 **Source**는 **gh-pages 브랜치**로 설정된다. 기본적으로 설정되어 있지
않으면 선택하자.

원한다면 거기서 **사용자 지정 도메인(Custom domain)** 을 사용할 수 있다.

그리고 차트를 서비스할 때 HTTPS가 사용되도록 **HTTPS 강제(Enforce HTTPS)** 가 선택되어
있는지 확인하자.

이러한 설정에서 **master 브랜치**를 사용하여 차트 코드를 저장하고 
**gh-pages 브랜치**를 차트 저장소로 저장할 수 있다 
(예: `https://USERNAME.github.io/REPONAME`). 데모 [TS 차트](https://github.com/technosophos/tscharts) 
저장소는 `https://technosophos.github.io/tscharts/` 에서 
접근할 수 있다.

### 일반 웹 서버

헬름 차트를 서비스하도록 일반 웹 서버를 설정하려면 
다음 작업만 수행하면 된다.

- 서버가 서비스할 수 있는 디렉토리에 인덱스 및 차트 저장
- 인증 요구 사항 없이 `index.yaml` 파일에 접근할 수 
  있는지 확인
- `yaml` 파일이 올바른 내용 유형(`text/yaml` 또는 `text/x-yaml`)과 함께 서비스되는지
  확인.

예를 들어, `$WEBROOT/charts` 에서 차트를 서비스하려면 
웹 루트 `charts/` 디렉토리가 있는지 확인하고 인덱스 파일과 
차트를 해당 폴더 안에 넣자.

### 차트뮤지엄 저장소 서버

차트뮤지엄은 Go 언어로 작성된 오픈소스 헬름 차트 저장소 서버로,
[구글 클라우드 스토리지](https://cloud.google.com/storage/), [아마존
S3](https://aws.amazon.com/s3/), [마이크로소프트 애저 블롭
스토리지](https://azure.microsoft.com/en-us/services/storage/blobs/), [알리바바
클라우드 OSS 스토리지](https://www.alibabacloud.com/product/oss), [오픈스택 오브젝트
스토리지](https://developer.openstack.org/api-ref/object-store/), [오라클 클라우드
인프라 오브젝트 스토리지](https://cloud.oracle.com/storage), [바이두 클라우드
BOS 스토리지](https://cloud.baidu.com/product/bos.html), [텐센트 클라우드 오브젝트
스토리지](https://intl.cloud.tencent.com/product/cos), [디지털오션
스페이스](https://www.digitalocean.com/products/spaces/),
[미니오](https://min.io/), [etcd](https://etcd.io/)를 포함한 클라우드 스토리지
백엔드를 지원한다.

[차트뮤지엄](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
서버를 사용하여 로컬 파일 시스템에서 
차트 저장소를 호스팅할 수 있다.

## 차트 저장소 관리

차트 저장소가 생겼으니 이 가이드의 마지막 부분에서는 해당 저장소에서 차트를
유지하는 방법을 설명한다.


### 차트 저장소에 차트 저장

차트 저장소가 생겼으니 차트와 인덱스 파일을 저장소에 
업로드해 보자. 차트 저장소의 차트는 
올바르게 패키징하고(`helm package chart-name/`) 버전([SemVer 2](https://semver.org/)
가이드라인에 따라)이 제공되어야 한다.

다음 단계는 예제 워크플로우를 구성하지만 차트 
저장소에 차트를 저장하고 갱신하는 데 원하는 
워크플로우를 모두 사용하자.

패키지형 차트가 준비되면 새 디렉토리를 만들고 
패키지형 차트를 해당 디렉토리로 이동시키자.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

마지막 명령은 방금 생성한 로컬 디렉토리의 경로와 
원격 차트 저장소의 URL을 사용하여 지정된 디렉토리 
경로 내에 `index.yaml` 파일을 구성한다.


이제 동기화 도구를 사용하거나 수동으로 차트 저장소에 
차트 및 인덱스 파일을 업로드할 수 있다. 구글 클라우드 스토리지를 
사용하는 경우 gsutil 클라이언트를 사용하여 이  [예제 워크플로우](/howto/chart_repository_sync_example.md)를
확인하자. 깃헙의 경우 해당 목적지 브랜치에 차트를 간단히 넣을 수 있다.

### 기존 저장소에 새로운 차트 추가

저장소에 새로운 차트를 추가할 때마다 인덱스를 재생성해야 한다. 
`helm repo index` 명령은 로컬에서 찾은 차트만 포함하여 
`index.yaml` 파일을 처음부터 완전히 재구성한다.

그러나 `--merge` 플래그를 사용하여 새 차트를 기존 `index.yaml` 파일(GCS와 같은
원격 저장소로 작업할 때 유용한 옵션)에 점진적으로 추가할 수 있다. 자세히 알아보기
위해 `helm repo index --help`를 실행하자.

수정된 `index.yaml` 파일과 차트를 모두 업로드하자. 그리고 출처 파일을 생성했다면
그것도 업로드하자.

### 다른 사람과 차트 공유

차트를 공유할 준비가 되면 다른 사람에게 
저장소의 URL을 알려주자.

그들은 저장소를 조회하기 위해 사용하고자 하는 
이름과 `helm repo add [이름] [URL]` 명령을 통해 
저장소를 헬름 클라이언트에 추가할 것이다.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

차트가 HTTP 기본 인증을 지원할 경우 사용자 이름과 암호를 대야 할 수 있다:

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**참고:** 저장소에 유효한 `index.yaml`이 포함되어 있지 않으면 저장소가 추가되지 않는다.

**참고:** 헬름 저장소가 자체 서명된 인증서를 사용하는 경우
CA 검증을 건너뛰기 위해서 
`helm repo add --insecure-skip-tls-verify ...` 을 사용할
수 있다.

그 후에 사용자들은 당신의 차트를 검색할 수 있을 것이다. 
당신이 저장소를 업데이트한 후에는 사용자들이 `helm repo update` 명령을 
사용하여 최신 차트 정보를 가져올 수 있다.

*내부에서 `helm repo add` 및 `helm repo update` 명령은 
index.yaml 파일을 가져와 `$XDG_CACHE/helm/repository/cache/` 디렉토리에 
저장하고 있다. 여기는 `helm search` 기능이 
차트에 대한 정보를 찾는 곳이다.*
