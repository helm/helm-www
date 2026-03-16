---
title: Helm 플러그인 가이드
description: Helm의 기능을 확장하기 위해 플러그인을 사용하고 만드는 방법을 소개한다.
sidebar_position: 12
---

Helm 플러그인은 `helm` CLI를 통해 접근할 수 있지만, 기본 제공되는
Helm 코드베이스에 포함되지는 않는 도구이다.

기존 플러그인은 [관련](/community/related#helm-plugins) 섹션 또는
[GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories)을
검색하여 찾을 수 있다.

이 가이드에서는 플러그인을 사용하고 만드는 방법을 설명한다.

## 개요

Helm 플러그인은 Helm과 원활하게 통합되는 애드온 도구이다.
모든 새 기능을 Go로 작성하거나 코어 도구에 추가하지 않고도
Helm의 핵심 기능 세트를 확장하는 방법을 제공한다.

Helm 플러그인에는 다음과 같은 특징이 있다.

- 코어 Helm 도구에 영향을 주지 않고 Helm 설치에서 추가하거나
  제거할 수 있다.
- 어떤 프로그래밍 언어로도 작성할 수 있다.
- Helm과 통합되며 `helm help` 및 기타 위치에 표시된다.

Helm 플러그인은 `$HELM_PLUGINS`에 위치한다. 환경에 설정되지 않은 경우
기본값을 포함하여 현재 값은 `helm env` 명령어로 확인할 수 있다.

Helm 플러그인 모델은 부분적으로 Git의 플러그인 모델을 기반으로 한다.
그래서 때때로 `helm`을 _도자기(porcelain)_ 레이어로, 플러그인을
_배관(plumbing)_ 이라고 부르기도 한다. 이것은 Helm이 사용자 경험과
최상위 수준의 처리 로직을 제공하고, 플러그인은 원하는 작업을
수행하는 "세부 작업"을 담당한다는 것을 간략히 표현한 것이다.

## 플러그인 설치하기

플러그인은 `$ helm plugin install <path|url>` 명령어를 사용하여 설치한다.
로컬 파일 시스템의 플러그인 경로 또는 원격 VCS 저장소의 URL을 전달할 수 있다.
`helm plugin install` 명령어는 지정된 경로/URL에서 플러그인을 `$HELM_PLUGINS`로
복제하거나 복사한다. VCS에서 설치하는 경우 `--version` 인수로 버전을 지정할 수 있다.

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

플러그인 tar 배포판이 있는 경우, 플러그인을 `$HELM_PLUGINS` 디렉터리에
압축 해제하면 된다. `helm plugin install
https://domain/path/to/plugin.tar.gz`를 실행하여 URL에서 직접
tarball 플러그인을 설치할 수도 있다.

## 플러그인 파일 구조

여러 면에서 플러그인은 차트와 유사하다. 각 플러그인에는 `plugin.yaml`
파일이 포함된 최상위 디렉터리가 있다. 추가 파일이 있을 수 있지만
`plugin.yaml` 파일만 필수이다.

```console
$HELM_PLUGINS/
  |- last/
      |- plugin.yaml
```

## plugin.yaml 파일

plugin.yaml 파일은 플러그인에 필수이다. 다음 필드를 포함한다.

```yaml
name: The name of the plugin (REQUIRED)
version: A SemVer 2 version (REQUIRED)
usage: Single line usage text shown in help
description: Long description shown in places like helm help
ignoreFlags: Ignore flags passed in from Helm
platformCommand: # Configure command to run based on the platform
  - os: OS match, can be empty or omitted to match all OS'
    arch: Architecture match, can be empty or omitted to match all architectures
    command: Plugin command to execute
    args: Plugin command arguments
command: (DEPRECATED) Plugin command, use platformCommand instead
platformHooks: # Configure plugin lifecycle hooks based on the platform
  install: # Install lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin install command to execute
      args: Plugin install command arguments
  update: # Update lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin update command to execute
      args: Plugin update command arguments
  delete: # Delete lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin delete command to execute
      args: Plugin delete command arguments
hooks: # (Deprecated) Plugin lifecycle hooks, use platformHooks instead
  install: Command to install plugin
  update: Command to update plugin
  delete: Command to delete plugin
downloaders: # Configure downloaders capability
  - command: Command to invoke
    protocols:
      - Protocol schema supported
```

### `name` 필드

`name`은 플러그인의 이름이다. Helm은 이 플러그인을 실행할 때
이 이름을 사용한다(예: `helm NAME`이 이 플러그인을 호출한다).

_`name`은 디렉터리 이름과 일치해야 한다._ 위의 예에서 `name: last`인
플러그인은 `last`라는 이름의 디렉터리에 포함되어야 한다.

`name`에 대한 제한 사항:

- `name`은 기존 `helm` 최상위 명령어와 중복될 수 없다.
- `name`은 ASCII 문자 a-z, A-Z, 0-9, `_`, `-`로 제한된다.

### `version` 필드

`version`은 플러그인의 SemVer 2 버전이다. `usage`와 `description`은
모두 명령어의 도움말 텍스트를 생성하는 데 사용된다.

### `ignoreFlags` 필드

`ignoreFlags` 스위치는 Helm에 플래그를 플러그인에 전달하지 _않도록_ 지시한다.
따라서 플러그인이 `helm myplugin --foo`로 호출되고 `ignoreFlags: true`인 경우,
`--foo`는 조용히 무시된다.

### `platformCommand` 필드

`platformCommand`는 플러그인이 호출될 때 실행할 명령어를 구성한다.
`platformCommand`와 `command`를 동시에 설정하면 오류가 발생한다.
사용할 명령어를 결정할 때 다음 규칙이 적용된다.

- `platformCommand`가 있으면 사용된다.
  - `os`와 `arch`가 모두 현재 플랫폼과 일치하면, 검색을 중지하고
  해당 명령어를 사용한다.
  - `os`가 일치하고 `arch`가 비어 있으면, 해당 명령어를 사용한다.
  - `os`와 `arch`가 모두 비어 있으면, 해당 명령어를 사용한다.
  - 일치하는 항목이 없으면, Helm은 오류와 함께 종료된다.
- `platformCommand`가 없고 더 이상 사용되지 않는 `command`가 있으면
해당 명령어를 사용한다.
  - 명령어가 비어 있으면, Helm은 오류와 함께 종료된다.

### `platformHooks` 필드

`platformHooks`는 플러그인이 라이프사이클 이벤트에 대해 실행할 명령어를 구성한다.
`platformHooks`와 `hooks`를 동시에 설정하면 오류가 발생한다.
사용할 훅 명령어를 결정할 때 다음 규칙이 적용된다.

- `platformHooks`가 있으면 사용되고, 라이프사이클 이벤트에 대한
명령어가 처리된다.
  - `os`와 `arch`가 모두 현재 플랫폼과 일치하면, 검색을 중지하고
  해당 명령어를 사용한다.
  - `os`가 일치하고 `arch`가 비어 있으면, 해당 명령어를 사용한다.
  - `os`와 `arch`가 모두 비어 있으면, 해당 명령어를 사용한다.
  - 일치하는 항목이 없으면, Helm은 해당 이벤트를 건너뛴다.
- `platformHooks`가 없고 더 이상 사용되지 않는 `hooks`가 있으면,
라이프사이클 이벤트에 대한 명령어를 사용한다.
  - 명령어가 비어 있으면, Helm은 해당 이벤트를 건너뛴다.

## 플러그인 빌드하기

다음은 마지막 릴리스 이름을 가져오는 간단한 플러그인의 YAML이다.

```yaml
name: last
version: 0.1.0
usage: get the last release name
description: get the last release name
ignoreFlags: false
platformCommand:
  - command: ${HELM_BIN}
    args:
      - list
      - --short
      - --max=1
      - --date
      - -r
```

플러그인에는 추가 스크립트와 실행 파일이 필요할 수 있다.
스크립트는 플러그인 디렉터리에 포함하고, 실행 파일은
훅을 통해 다운로드할 수 있다. 다음은 예제 플러그인이다.

```console
$HELM_PLUGINS/
  |- myplugin/
    |- scripts/
      |- install.ps1
      |- install.sh
    |- plugin.yaml
```

```yaml
name: myplugin
version: 0.1.0
usage: example plugin
description: example plugin
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/myplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
platformHooks:
  install:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
  update:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
      args:
        - -u
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
        - -Update
```

플러그인이 실행되기 전에 환경 변수가 보간된다.
위의 패턴은 플러그인 프로그램의 위치를 나타내는 권장 방식이다.

### 플러그인 명령어

플러그인 명령어 작업을 위한 몇 가지 전략이 있다.

- 플러그인에 실행 파일이 포함된 경우, `platformCommand:` 또는
  에 해당하는 실행 파일은 플러그인 디렉터리에 패키징하거나
  훅을 통해 설치해야 한다.
- `platformCommand:` 또는 `command:` 줄은 실행 전에 환경 변수가
  확장된다. `$HELM_PLUGIN_DIR`은 플러그인 디렉터리를 가리킨다.
- 명령어 자체는 셸에서 실행되지 않는다. 따라서 셸 스크립트를
  한 줄로 작성할 수 없다.
- Helm은 많은 설정을 환경 변수에 주입한다. 사용 가능한 정보를
  확인하려면 환경을 살펴보자.
- Helm은 플러그인 언어에 대해 가정하지 않는다. 원하는 언어로
  작성할 수 있다.
- 명령어는 `-h`와 `--help`에 대한 특정 도움말 텍스트를 구현해야 한다.
  Helm은 `helm help`와 `helm help myplugin`에 `usage`와 `description`을
  사용하지만, `helm myplugin --help`는 처리하지 않는다.

### 로컬 플러그인 테스트하기

먼저 `HELM_PLUGINS` 경로를 찾아야 한다. 다음 명령어를 실행한다.

``` bash
helm env
```

현재 디렉터리를 `HELM_PLUGINS`가 설정된 디렉터리로 변경한다.

이제 플러그인의 빌드 출력에 대한 심볼릭 링크를 추가할 수 있다.
이 예에서는 `mapkubeapis`에 대해 수행했다.

``` bash
ln -s ~/GitHub/helm-mapkubeapis ./helm-mapkubeapis
```

## 다운로더 플러그인

기본적으로 Helm은 HTTP/S를 사용하여 차트를 가져올 수 있다.
Helm 2.4.0부터 플러그인은 임의의 소스에서 차트를 다운로드하는
특수 기능을 가질 수 있다.

플러그인은 `plugin.yaml` 파일(최상위 수준)에서 이 특수 기능을
선언해야 한다.

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

이러한 플러그인이 설치되면, Helm은 `command`를 호출하여 지정된
프로토콜 스키마를 사용하여 저장소와 상호 작용할 수 있다.
특수 저장소는 일반 저장소와 유사하게 추가된다:
`helm repo add favorite myprotocol://example.com/`
특수 저장소에 대한 규칙은 일반 저장소와 동일하다:
Helm이 사용 가능한 차트 목록을 검색하고 캐시하려면
`index.yaml` 파일을 다운로드할 수 있어야 한다.

정의된 명령어는 `command certFile keyFile caFile full-URL` 스키마로
호출된다. SSL 자격 증명은 `$HELM_REPOSITORY_CONFIG`
(즉, `$HELM_CONFIG_HOME/repositories.yaml`)에 저장된
저장소 정의에서 가져온다. 다운로더 플러그인은 원시 콘텐츠를
stdout에 덤프하고 오류를 stderr에 보고해야 한다.

다운로더 명령어는 하위 명령어나 인수도 지원하므로, 예를 들어
`plugin.yaml`에 `bin/mydownloader subcommand -d`를 지정할 수 있다.
이것은 메인 플러그인 명령어와 다운로더 명령어에 동일한 실행 파일을
사용하되, 각각에 대해 다른 하위 명령어를 사용하려는 경우에 유용하다.

## 환경 변수

Helm은 플러그인을 실행할 때 외부 환경을 플러그인에 전달하고,
추가 환경 변수도 주입한다.

`KUBECONFIG`와 같은 변수는 외부 환경에서 설정된 경우
플러그인에 대해 설정된다.

다음 변수는 항상 설정된다.

- `HELM_PLUGINS`: 플러그인 디렉터리의 경로.
- `HELM_PLUGIN_NAME`: `helm`에 의해 호출된 플러그인의 이름.
  따라서 `helm myplug`는 짧은 이름 `myplug`를 갖는다.
- `HELM_PLUGIN_DIR`: 플러그인이 포함된 디렉터리.
- `HELM_BIN`: (사용자가 실행한) `helm` 명령어의 경로.
- `HELM_DEBUG`: Helm에 의해 디버그 플래그가 설정되었는지 나타낸다.
- `HELM_REGISTRY_CONFIG`: (사용하는 경우) 레지스트리 설정 위치.
  레지스트리와 함께 Helm을 사용하는 것은 실험적 기능임에 유의하자.
- `HELM_REPOSITORY_CACHE`: 저장소 캐시 파일의 경로.
- `HELM_REPOSITORY_CONFIG`: 저장소 설정 파일의 경로.
- `HELM_NAMESPACE`: `helm` 명령어에 지정된 네임스페이스
  (일반적으로 `-n` 플래그 사용).
- `HELM_KUBECONTEXT`: `helm` 명령어에 제공된 Kubernetes 설정
  컨텍스트의 이름.

또한, Kubernetes 설정 파일이 명시적으로 지정된 경우
`KUBECONFIG` 변수로 설정된다.

## 플래그 파싱에 대한 참고 사항

플러그인을 실행할 때, Helm은 자체 사용을 위해 전역 플래그를 파싱한다.
이러한 플래그는 플러그인에 전달되지 않는다.

- `--burst-limit`: `$HELM_BURST_LIMIT`로 변환된다.
- `--debug`: 지정하면 `$HELM_DEBUG`가 `1`로 설정된다.
- `--kube-apiserver`: `$HELM_KUBEAPISERVER`로 변환된다.
- `--kube-as-group`: `$HELM_KUBEASGROUPS`로 변환된다.
- `--kube-as-user`: `$HELM_KUBEASUSER`로 변환된다.
- `--kube-ca-file`: `$HELM_KUBECAFILE`로 변환된다.
- `--kube-context`: `$HELM_KUBECONTEXT`로 변환된다.
- `--kube-insecure-skip-tls-verify`: `$HELM_KUBEINSECURE_SKIP_TLS_VERIFY`로 변환된다.
- `--kube-tls-server-name`: `$HELM_KUBETLS_SERVER_NAME`로 변환된다.
- `--kube-token`: `$HELM_KUBETOKEN`로 변환된다.
- `--kubeconfig`: `$KUBECONFIG`로 변환된다.
- `--namespace` 및 `-n`: `$HELM_NAMESPACE`로 변환된다.
- `--qps`: `$HELM_QPS`로 변환된다.
- `--registry-config`: `$HELM_REGISTRY_CONFIG`로 변환된다.
- `--repository-cache`: `$HELM_REPOSITORY_CACHE`로 변환된다.
- `--repository-config`: `$HELM_REPOSITORY_CONFIG`로 변환된다.

플러그인은 `-h`와 `--help`에 대해 도움말 텍스트를 표시하고 종료해야 _한다_.
다른 모든 경우에는 플러그인이 적절하게 플래그를 사용할 수 있다.

## 셸 자동 완성 제공

Helm 3.2부터 플러그인은 Helm의 기존 자동 완성 메커니즘의 일부로
셸 자동 완성 지원을 선택적으로 제공할 수 있다.

### 정적 자동 완성

플러그인이 자체 플래그 및/또는 하위 명령어를 제공하는 경우,
플러그인의 루트 디렉터리에 `completion.yaml` 파일을 두어
Helm에 알릴 수 있다. `completion.yaml` 파일의 형식은 다음과 같다.

```yaml
name: <pluginName>
flags:
- <flag 1>
- <flag 2>
validArgs:
- <arg value 1>
- <arg value 2>
commands:
  name: <commandName>
  flags:
  - <flag 1>
  - <flag 2>
  validArgs:
  - <arg value 1>
  - <arg value 2>
  commands:
     <and so on, recursively>
```

유의 사항:

1. 모든 섹션은 선택 사항이지만 해당되는 경우 제공해야 한다.
1. 플래그에는 `-` 또는 `--` 접두사를 포함하지 않아야 한다.
1. 짧은 플래그와 긴 플래그 모두 지정할 수 있고 지정해야 한다.
   짧은 플래그가 해당하는 긴 형식과 연결될 필요는 없지만,
   두 형식 모두 나열해야 한다.
1. 플래그는 어떤 방식으로든 정렬할 필요가 없지만, 파일의
   하위 명령어 계층 구조에서 올바른 위치에 나열해야 한다.
1. Helm의 기존 전역 플래그는 이미 Helm의 자동 완성 메커니즘에서
   처리되므로, 플러그인은 `--debug`, `--namespace` 또는 `-n`,
   `--kube-context`, `--kubeconfig` 또는 기타 전역 플래그를
   지정할 필요가 없다.
1. `validArgs` 목록은 하위 명령어 다음의 첫 번째 매개변수에 대해
   가능한 완성의 정적 목록을 제공한다. 이러한 목록을 미리
   제공하는 것이 항상 가능하지는 않다(아래 [동적
   완성](#동적-완성) 섹션 참조). 이 경우 `validArgs` 섹션을
   생략할 수 있다.

`completion.yaml` 파일은 전적으로 선택 사항이다. 제공되지 않으면
Helm은 플러그인에 대한 셸 자동 완성을 제공하지 않는다(플러그인이
[동적 완성](#동적-완성)을 지원하지 않는 한). 또한, `completion.yaml`
파일을 추가하는 것은 이전 버전과 호환되며 이전 Helm 버전을 사용할 때
플러그인 동작에 영향을 주지 않는다.

예를 들어, 하위 명령어는 없지만 `helm status` 명령어와 동일한 플래그를
허용하는 [`fullstatus 플러그인`](https://github.com/marckhouzam/helm-fullstatus)의
경우, `completion.yaml` 파일은 다음과 같다.

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

더 복잡한 예로 [`2to3 플러그인`](https://github.com/helm/helm-2to3)의
`completion.yaml` 파일은 다음과 같다.

```yaml
name: 2to3
commands:
- name: cleanup
  flags:
  - config-cleanup
  - dry-run
  - l
  - label
  - release-cleanup
  - s
  - release-storage
  - tiller-cleanup
  - t
  - tiller-ns
  - tiller-out-cluster
- name: convert
  flags:
  - delete-v2-releases
  - dry-run
  - l
  - label
  - s
  - release-storage
  - release-versions-max
  - t
  - tiller-ns
  - tiller-out-cluster
- name: move
  commands:
  - name: config
    flags:
    - dry-run
```

### 동적 완성

Helm 3.2부터 플러그인은 자체 동적 셸 자동 완성을 제공할 수 있다.
동적 셸 자동 완성은 미리 정의할 수 없는 매개변수 값 또는 플래그 값의
완성이다. 예를 들어, 현재 클러스터에서 사용 가능한 Helm 릴리스 이름의 완성이 있다.

플러그인이 동적 자동 완성을 지원하려면, 루트 디렉터리에 `plugin.complete`라는
**실행 파일**을 제공해야 한다. Helm 완성 스크립트가 플러그인에 대한
동적 완성을 필요로 할 때, 완성해야 할 명령줄을 전달하여 `plugin.complete`
파일을 실행한다. `plugin.complete` 실행 파일에는 적절한 완성 선택지가
무엇인지 결정하고 Helm 완성 스크립트가 사용할 수 있도록 표준 출력으로
출력하는 로직이 있어야 한다.

`plugin.complete` 파일은 전적으로 선택 사항이다. 제공되지 않으면
Helm은 플러그인에 대한 동적 자동 완성을 제공하지 않는다. 또한,
`plugin.complete` 파일을 추가하는 것은 이전 버전과 호환되며
이전 Helm 버전을 사용할 때 플러그인 동작에 영향을 주지 않는다.

`plugin.complete` 스크립트의 출력은 다음과 같이 줄바꿈으로 구분된
목록이어야 한다.

```console
rel1
rel2
rel3
```

`plugin.complete`가 호출되면, 플러그인의 메인 스크립트가 호출될 때와
마찬가지로 플러그인 환경이 설정된다. 따라서 `$HELM_NAMESPACE`,
`$HELM_KUBECONTEXT` 및 기타 모든 플러그인 변수가 이미 설정되어 있고,
해당하는 전역 플래그는 제거된다.

`plugin.complete` 파일은 어떤 실행 형식이든 될 수 있다. 셸 스크립트,
Go 프로그램 또는 Helm이 실행할 수 있는 다른 유형의 프로그램이 될 수 있다.
`plugin.complete` 파일은 사용자에 대해 ***반드시*** 실행 권한이 있어야 한다.
`plugin.complete` 파일은 ***반드시*** 성공 코드(값 0)와 함께 종료되어야 한다.

경우에 따라 동적 완성은 Kubernetes 클러스터에서 정보를 가져와야 한다.
예를 들어, `helm fullstatus` 플러그인은 입력으로 릴리스 이름이 필요하다.
`fullstatus` 플러그인에서 `plugin.complete` 스크립트가 현재 릴리스 이름에
대한 완성을 제공하려면, 단순히 `helm list -q`를 실행하고 결과를 출력하면 된다.

플러그인 실행과 플러그인 완성에 동일한 실행 파일을 사용하려면,
`plugin.complete` 스크립트가 특별한 매개변수나 플래그와 함께
메인 플러그인 실행 파일을 호출하도록 만들 수 있다.
메인 플러그인 실행 파일이 특별한 매개변수나 플래그를 감지하면,
완성을 실행해야 함을 알게 된다.
이 예에서 `plugin.complete`는 다음과 같이 구현할 수 있다.

```sh
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

`fullstatus` 플러그인의 실제 스크립트(`status.sh`)는 `--complete` 플래그를
찾아야 하며, 발견되면 적절한 완성을 출력해야 한다.

### 팁과 요령

1. 셸은 사용자 입력과 일치하지 않는 완성 선택지를 자동으로 필터링한다.
   따라서 플러그인은 사용자 입력과 일치하지 않는 것을 제거하지 않고
   관련된 모든 완성을 반환할 수 있다. 예를 들어, 명령줄이
   `helm fullstatus ngin<TAB>`인 경우, `plugin.complete` 스크립트는
   `ngin`으로 시작하는 것뿐만 아니라 (`default` 네임스페이스의)
   *모든* 릴리스 이름을 출력할 수 있다. 셸이 `ngin`으로 시작하는
   것만 유지한다.
1. 특히 복잡한 플러그인이 있는 경우, 동적 완성 지원을 단순화하기 위해
   `plugin.complete` 스크립트가 메인 플러그인 스크립트를 호출하고
   완성 선택지를 요청하도록 할 수 있다. 예제는 위의
   [동적 완성](#동적-완성) 섹션을 참조하자.
1. 동적 완성과 `plugin.complete` 파일을 디버깅하려면, 다음을 실행하여
   완성 결과를 확인할 수 있다.
    - `helm __complete <pluginName> <arguments to complete>`. 예를 들어:
    - `helm __complete fullstatus --output js<ENTER>`,
    - `helm __complete fullstatus -o json ""<ENTER>`
