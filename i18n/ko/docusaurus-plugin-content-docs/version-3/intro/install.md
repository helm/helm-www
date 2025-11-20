---
title: 헬름 설치하기
description: 헬름 설치하고 작동하는 방법 배우기.
sidebar_position: 2
---

이 가이드는 헬름 CLI를 설치하는 방법을 설명합니다.
헬름은 소스 또는 미리-빌드된(pre-built)
바이너리 릴리스로 설치할 수 있습니다.

## 헬름 프로젝트 설치 방법

헬름 프로젝트는 헬름을 가져와서 설치하는데 2가지 방법을 제공합니다.
이 방법들은 헬름 공식 릴리스를 설치하는 공식적인 방법입니다.
또한, 커뮤니티에서는 다양한 패키지 관리자를 통해 헬름을 설치할 수 있는 방법을 제공합니다. 이러한 방법을 통한 설치는 아래에 있는 공식적인 방법들에서 확인할 수 있습니다.

### 바이너리 릴리스로

헬름의 모든 [릴리스](https://github.com/helm/helm/releases)는
다양한 OS들을 위한 바이너리 릴리스를 제공합니다.
이 바이너리 버전들은 수동으로 다운로드하여 설치할 수 있습니다.

1. [원하는 버전](https://github.com/helm/helm/releases)을 다운로드
2. 압축해제 (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. 압축해제된 디렉토리에서 `helm` 파일을 찾아서, 원하는 목적지로 이동
   (`mv linux-amd64/helm /usr/local/bin/helm`)

설치가 완료되면 헬름 클라이언트를 실행하고 [stable 저장소를
추가](/intro/quickstart.md#initialize-a-helm-chart-repository)할 수 있습니다.:
`helm help`.

**참고:** 헬름 자동화 테스트는 GitHub Actions 빌드와 릴리스 사이에, 리눅스 AMD64에서만 수행됩니다. 다른 OS들에 대한 테스트는, 대상 OS에 대한 헬름을 요청한 커뮤니티에서 진행합니다.

### 설치 스크립트로

헬름은 최신 버전을 자동으로 가져와서 [로컬에 설치](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3)하는 설치 스크립트를 제공합니다.

이 스크립트를 받아서 로컬에서 실행할 수 있습니다.
문서가 잘 작성되어 있으므로, 실행 전에 읽어보면 어떤 작업을 하는 것인지 이해할 수 있습니다.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

최신 버전을 설치하려면 `curl
https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash`
로 설치할 수 있습니다.

## 패키지 매니저를 통해서

헬름 커뮤니티 운영체제 패키지 관리자를 통해서 헬름을 설치할 수 있는 기능을 제공합니다.
이것들은 헬름 공식 지원은 아니며, 신뢰 할 수 있는 서드파티로 간주되지 않습니다.

### Homebrew로 (맥OS)

헬름 커뮤니티 멤버들은 Homebrew용 헬름 포뮬러 빌드를 기여했습니다.
이 포뮬러는 일반적으로 최신 상태로 유지됩니다.

```console
brew install helm
```

(참고: emacs-helm는 다른 프로젝트입니다.)

### Chocolatey로 (윈도우)

헬름 커뮤니티 멤버들은 [Chocolatey](https://chocolatey.org/)용
[헬름 패키지](https://chocolatey.org/packages/kubernetes-helm) 빌드를 기여했습니다.
이 패키지는 일반적으로 최신 상태로 유지됩니다.

```console
choco install kubernetes-helm
```

### Scoop으로 (윈도우)

헬름 커뮤니티 멤버들은 [Scoop](https://scoop.sh)용
[헬름 패키지](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json) 빌드를 기여했습니다. 이 패키지는 일반적으로 최신 상태로 유지됩니다.

```console
scoop install helm
```

### Winget로 (윈도우)

헬름 커뮤니티 멤버들은 [Winget](https://learn.microsoft.com/en-us/windows/package-manager/)용
[헬름 패키지](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm) 빌드를 기여했습니다.
이 패키지는 일반적으로 최신 상태로 유지됩니다.

```console
winget install Helm.Helm
```

### Apt로 (데비안/우분투)

헬름 커뮤니티 멤버들은 Debian/Ubuntu용 Apt 패키지를 기여했습니다. 이 패키지는 일반적으로 최신 상태로 유지됩니다. 저장소 호스팅을 제공해준 [Buildkite](https://buildkite.com/organizations/helm-linux/packages/registries/helm-debian)에 감사드립니다.

```console
sudo apt-get install curl gpg apt-transport-https --yes
curl -fsSL https://packages.buildkite.com/helm-linux/helm-debian/gpgkey | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/helm.gpg] https://packages.buildkite.com/helm-linux/helm-debian/any/ any main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### dnf/yum로 (페도라)

Fedora 35부터, 공식 저장소에서 헬름을 사용할 수 있습니다.
다음 명령으로 헬름을 설치할 수 있습니다.

```console
sudo dnf install helm
```

### Snap으로

[Snapcrafters](https://github.com/snapcrafters) 커뮤니티에서
[헬름 패키지](https://snapcraft.io/helm)의 Snap 버전을 유지보수하고 있습니다.

```console
sudo snap install helm --classic
```

### pkg로 (FreeBSD)

FreeBSD 커뮤니티 멤버들은 [FreeBSD Ports Collections](https://man.freebsd.org/ports)용
[헬름 패키지](https://www.freshports.org/sysutils/helm)
빌드를 기여했습니다. 이 패키지는 일반적으로 최신 상태로 유지됩니다.

```console
pkg install helm
```

### 개발용 빌드

릴리스 외에도 헬름의 개발 스냅샷을 다운로드하거나 설치할 수 있습니다.

### 카나리(canary) 빌드에서

"카나리" 빌드는 최신 `main` 브랜치로부터 빌드된 헬름 소프트웨어의 버전입니다.
공식 릴리스가 아니므로 안정적이지 않을 수 있습니다. 하지만 최신 기능을 테스트할 기회를 제공합니다.

카나리 헬름 바이너리는 [get.helm.sh](https://get.helm.sh)에서 제공됩니다.
아래는 일반적인 빌드에 대한 링크들입니다:

- [리눅스 AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [맥OS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [테스트용 윈도우
  AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### 소스에서 (리눅스, 맥OS)

소스로 헬름을 빌드하는 것은 약간 더 많은 작업이 필요하지만, 최신(프리릴리스) Helm 버전을 테스트하려는 경우 가장 좋은 방법입니다.

정상적으로 작동하는 Go 환경이 필요합니다.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

필요한 경우 의존성을 가져와 캐시하고 설정을 검증합니다.
그 후 `helm`을 컴파일하여 `bin/helm`에 생성합니다.

## 맺음말

대부분의 경우, 미리-빌드된(pre-built) `helm` 바이너리를 가져오는 것으로 설치할 수 있습니다.
이 문서는 헬름으로 더 정교한 작업을 하려는 사용자를 위한 추가적인 경우들을 다룹니다.

헬름 클라이언트가 성공적으로 설치되면, 헬름을 사용하여 차트를 관리하고
[stable 차트 저장소를 추가](/intro/quickstart.md#initialize-a-helm-chart-repository)할 수 있습니다.
