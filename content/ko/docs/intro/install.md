---
title: "Helm 설치하기"
description: "Helm 설치하고 작동하는 방법 배우기."
weight: 2
aliases: ["/docs/install/"]
---

이 가이드는 Helm CLI를 설치하는 방법을 설명한다. Helm은 소스 또는 미리-빌드된(pre-built) 바이너리 릴리즈로 설치할 수 있다.

### 바이너리 릴리즈로

Helm의 모든 [릴리즈](https://github.com/helm/helm/releases)는 다양한 OS들의 바이너리 릴리즈를 제공한다.
이 바이너리 버전들은 수동으로 다운로드하여 설치할 수 있다.

1. [원하는 버전](https://github.com/helm/helm/releases)을 다운로드한다.
2. 압축해제한다. (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. 압축해제된 디렉토리에서 `helm` 바이너리를 찾아서, 원하는 목적지로 이동시킨다. (`mv linux-amd64/helm /usr/local/bin/helm`)

거기서부터, 클라이언트를 구동하고 [stable 저장소를 추가](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository)할 수 있어야 한다: `helm help`.

**Note:** Helm automated tests are performed for Linux AMD64 only during CircleCi
builds and releases. Testing of other OSes are the responsibility of the community
requesting Helm for the OS in question. 

### Homebrew로 (맥OS)

쿠버네티스 커뮤니티 멤버들은 Homebrew용 Helm 포뮬러 빌드에 기여해왔다.
이 패키지는 보통 최신이다.

```console
brew install helm
```

(Note: emacs-helm 라는 포뮬러도 있는데, 다른 프로젝트이다.)

### Chocolatey로 (윈도우)

쿠버네티스 커뮤니티 멤버들은 [Chocolatey](https://chocolatey.org/)용 [Helm 패키지](https://chocolatey.org/packages/kubernetes-helm) 빌드에 기여해왔다. 이 패키지는 보통 최신이다.

```console
choco install kubernetes-helm
```

### Snap으로 (리눅스)                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                     
[Snapcrafters](https://github.com/snapcrafters) 커뮤니티는 [Helm 패키지](https://snapcraft.io/helm)의 Snap 버전을 유지보수한다.

```console
sudo snap install helm --classic
```

## 스크립트로

이제 Helm은 Helm 최신 버전을 자동으로 가져와서
[로컬에 설치](https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3)하는
인스톨러 스크립트를 가지고 있다.

이 스크립트를 받아서 로컬에서 실행할 수 있다.
문서화가 잘 되어 있으므로 실행 전에 문서를 읽어보면 무엇을 하는 것인지 이해할 수 있을 것이다.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Yes, you can `curl
https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash` that if
you want to live on the edge.

### 카나리 빌드로

"Canary" builds are versions of the Helm software that are built from the latest
master branch. They are not official releases, and may not be stable. However,
they offer the opportunity to test the cutting edge features.

Canary Helm binaries are stored at [get.helm.sh](https://get.helm.sh). Here are
links to the common builds:

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows
  AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### 소스로 (리눅스, 맥OS)

소스로 Helm을 빌드하는 것은 약간 작업이 더 많다. 하지만 최신 (프리-릴리즈) Helm 버전을 테스트하기에는 가장 좋은 방법이다.

작동하는 Go 환경이 필수적이다.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

필요시에는 의존성을 페치(fetch)하고 캐시(cache)하고 설정 유효성검사를 하게 된다.
그러고 나서 `helm`을 컴파일하여 `bin/helm`에 둔다.

## 맺음말

대부분의 경우, 설치는 미리-빌드된(pre-built) `helm` 바이너리를 받는 것만큼 단순하다.
이 문서는 Helm으로 좀더 복잡한 것을 하려는 사람들을 위해 추가적인 경우를 커버한다.

일단 Helm 클라이언트가 성공적으로 설치되면, 
차트를 관리하고 [stable 저장소를 추가](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository)하기 위해 Helm을 사용할 수 있다.
