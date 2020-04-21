---
title: "Helm 설치하기"
description: "Helm 설치하고 작동하는 방법 배우기."
weight: 2
aliases: ["/docs/install/"]
---

이 가이드는 Helm CLI를 설치하는 방법을 설명한다. Helm은 소스 또는 미리-빌드된(pre-built) 바이너리 릴리즈로 설치할 수 있다.

### 바이너리 릴리즈로

Every [release](https://github.com/helm/helm/releases) of Helm provides binary
releases for a variety of OSes. These binary versions can be manually downloaded
and installed.

1. Download your [desired version](https://github.com/helm/helm/releases)
2. Unpack it (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Find the `helm` binary in the unpacked directory, and move it to its desired
   destination (`mv linux-amd64/helm /usr/local/bin/helm`)

From there, you should be able to run the client and [add the stable repo](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository): `helm help`.

**Note:** Helm automated tests are performed for Linux AMD64 only during CircleCi
builds and releases. Testing of other OSes are the responsibility of the community
requesting Helm for the OS in question. 

### From Homebrew (macOS)

Members of the Kubernetes community have contributed a Helm formula build to
Homebrew. This formula is generally up to date.

```console
brew install helm
```

(Note: There is also a formula for emacs-helm, which is a different project.)

### Chocolatey로 (윈도우)

Members of the Kubernetes community have contributed a [Helm
package](https://chocolatey.org/packages/kubernetes-helm) build to
[Chocolatey](https://chocolatey.org/). This package is generally up to date.

```console
choco install kubernetes-helm
```

### Snap으로 (리눅스)                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                     
The [Snapcrafters](https://github.com/snapcrafters) community maintains the
Snap version of the [Helm package](https://snapcraft.io/helm):

```console
sudo snap install helm --classic
```

## 스크립트로

Helm now has an installer script that will automatically grab the latest version
of Helm and [install it
locally](https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3).

You can fetch that script, and then execute it locally. It's well documented so
that you can read through it and understand what it is doing before you run it.

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

Building Helm from source is slightly more work, but is the best way to go if
you want to test the latest (pre-release) Helm version.

You must have a working Go environment.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

If required, it will fetch the dependencies and cache them, and
validate configuration. It will then compile `helm` and place it in `bin/helm`.

## 맺음말

대부분의 경우, 설치는 미리-빌드된(pre-built) `helm` 바이너리를 받는 것만큼 단순하다.
이 문서는 Helm으로 좀더 복잡한 것을 하려는 사람들을 위해 추가적인 경우를 커버한다.

일단 Helm 클라이언트가 성공적으로 설치되면, 
차트를 관리하고 [stable 저장소를 추가](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository)하기 위해 Helm을 사용할 수 있다.
