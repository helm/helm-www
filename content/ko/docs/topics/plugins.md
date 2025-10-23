---
title: "헬름 플러그인 가이드"
description: "헬름의 기능을 확장하기 위해 플러그인을 사용하고 만드는 방법을 소개한다."
weight: 12
---

헬름 플러그인은 `helm` CLI를 통해 액세스할 수 있는 도구이지만
기본 제공 헬름 코드 베이스에 포함되지는 않는다.

기존 플러그인은 
[관련]({{< ref "related.md#helm-plugins">}}) 섹션 또는 
[GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories)을 검색하여 찾을 수 있다.

이 가이드에서는 플러그인을 사용하고 만드는 방법을 설명한다.

## 개요

헬름 플러그인은 헬름과 원활하게 연계되는 애드온 도구이다. 
새로운 모든 기능을 Go로 작성하거나 코어 도구에 추가하지 않더라도,
헬름 플러그인을 사용하여 코어 기능 세트를 확장하는 방법을 제공한다.

헬름 플러그인에는 다음과 같은 기능들이 있다.

- 코어 헬름 도구에 영향을 주지 않고 헬름 설치에서 추가하거나
  제거할 수  있다.
- 어느 프로그래밍 언어로도 작성할 수 있다.
- 헬름과 연계되며 `helm help` 및 그 외의 위치에서 조회될 수 있다.

헬름 플러그인은 `$HELM_PLUGINS` 에 있다. 
`helm env` 명령어를 사용하여 환경설정되지 않은 경우 기본값을 포함하여 현재 값을 찾을 수 있다.

헬름 플러그인 모델은 부분적으로 Git의 플러그인 모델에서 모델링되었다.
이런 이유로 간혹 헬름을 _porcelain_ 레이어로, 플러그인은 _plumbing_ 로 불리는 경우도 있다.
이것은 헬름이 바깥으로 보이는 사용자 경험과 최상위 수준의 처리 로직을 제공하는 반면, 플러그인은 원하는 작업을 수행하는 "세부 작업"을 제공하기 때문이다.

## 플러그인 설치하기

플러그인은 `$ helm plugin install <path|url>` 명령어를 사용하여 설치된다.
로컬 파일 시스템의 플러그인 경로 또는 원격 VCS 레포지터리의 URL을 전달할 수 있다.
`helm plugin install` 명령은 `$HELM_PLUGINS` 에 지정된 경로/URL 에서 플러그인을 복제하거나 복사한다.

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

플러그인 tar 배포판이 있는 경우 `$HELM_PLUGINS` 디렉터리에 플러그인 압축을 해제한다.
`helm plugin install https://domain/path/to/plugin.tar.gz` 을 실행하여
URL에서 직접 tarball 플러그인을 설치할 수도 있다.

## 플러그인 구축하기

여러 가지 측면에서 플러그인은 차트와 유사하다.
각 플러그인에는 최상위 디렉토리와 `plugin.yaml` 파일이 있다.

```
$HELM_PLUGINS/
  |- keybase/
      |
      |- plugin.yaml
      |- keybase.sh

```

위의 예에서 `keybase` 플러그인은 `keybase` 라는 디렉터리에 포함되어 있다.
여기에는 `plugin.yaml`(필수) 파일과 실행 가능한 스크립트 `keybase.sh`(선택사항)이 있다.

플러그인의 핵심은 `plugin.yaml` 이라는 간단한 YAML 파일이다.
다음은 keybase 작업에 대한 지원을 추가하는 플러그인용 YAML이다.

```yaml
name: "last"
version: "0.1.0"
usage: "get the last release name"
description: "get the last release name""
ignoreFlags: false
command: "$HELM_BIN --host $TILLER_HOST list --short --max 1 --date -r"
platformCommand:
  - os: linux
    arch: i386
    command: "$HELM_BIN list --short --max 1 --date -r"
  - os: linux
    arch: amd64
    command: "$HELM_BIN list --short --max 1 --date -r"
  - os: windows
    arch: amd64
    command: "$HELM_BIN list --short --max 1 --date -r"
```

`name` 은 플러그인의 이름이다.
헬름은 이 플러그인을 실행할 때 이 이름을 사용한다.(예: `helm NAME` 이 이 플러그인을 호출)

_`name` 은 디렉토리 이름과 일치해야 한다._ 
위의 예시에서는 `name: keybase` 가 있는 플러그인이 `keybase` 라는 디렉터리에 포함되어야 한다.

`name`에 대한 제한:

- `name` 은 기존의 `helm` 최상위 명령어와 중복될 수 없다.
- `name` 은 ASCII 문자 a-z, A-Z, 0-9, `_`, `-` 로 제한된다.

`version` 은 플러그인의 SemVer 2 버전이다.
`usage` 및 `description` 은 모두 명령의 도움말 텍스트를 생성하는데 사용된다.

`ignoreFlags` 스위치는 헬름에 플래그를 플러그인에게 전달하지 _않도록_ 한다.
따라서 플러그인이 `helm myplugin --foo` 및 `ignoreFlag: true` 로 호출되면 `--foo` 는 자동으로 삭제된다.

마지막으로 가장 중요한 것은 `platformCommand` 또는 `command` 가 플러그인이 호출될 때 실행할 명령어이다.
`platformCommand` 섹션은 명령어의 OS/아키텍처에 따른 변형을 정의한다.
사용할 명령어를 결정할 때는 다음의 규칙이 적용된다.

- `platformCommand` 가 있으면 우선 검색한다.
- `os` 와 `arch` 가 현재 플랫폼과 일치하면,
  검색을 중지하고 명령어를 사용한다.
- `os` 가 일치하고 `arch` 가 일치하지 않으면 
  명령어를 사용한다.
- 일치하는 `platformCommand` 가 없으면 기본 `command` 를 사용한다.
- `platformCommand` 에 일치하는 항목이 없고 `command` 가 없는 경우
  헬름은 오류와 함께 종료된다.

플러그인이 실행되기 전에 환경 변수가 보간된다.
위의 패턴은 플러그인 프로그램이 있는 위치를 나타내기 위해 선호되는 방식이다.

플러그인 명령어 작업을 위한 몇 가지 전략이 있다.

- 플러그인에 실행 파일이 포함된 경우 `platformCommand :` 또는 `command :`에 해당하는 
  실행 파일이 플러그인 디렉토리에 패키징되어야 한다.
- `platformCommand :`또는`command :` 행은 
  실행 전에 확장된 환경 변수를 가진다. 
  `$ HELM_PLUGIN_DIR`은 플러그인 디렉토리를 가리킨다.
- 명령어 자체는 쉘에서 실행되지 않는다.
  따라서 쉘 스크립트를 한줄로 작성할 수는 없다.
- 헬름은 수많은 설정들을 환경 변수로 주입한다. 
  사용 가능한 정보가 무엇인지 그 환경을 확인해보자.
- 헬름은 플러그인의 언어를 가리지 않는다.
  원하는 것을 선택하여 작성하면 된다.
- 각 명령어에는`-h` 및`--help` 에 대한 도움말 텍스트가 구현되어야 한다.
  Helm은 `helm help` 및 `helm help myplugin` 에 `usage` 및 `description`을 사용하지만
  `helm myplugin --help`는 처리하지 않는다.

## 다운로더 플러그인
기본적으로 헬름은 HTTP/S 를 사용하여 차트를 가져올 수 있다.
헬름 2.4.0부터 플러그인은 임의의 소스에서 차트를 다운로드하는 특별한 기능을 갖는다.

플러그인은 `plugin.yaml` 파일(최상위수준)에서 이 특수기능을
선언해야 한다.

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

이러한 플러그인이 설치된 경우 Helm은 `command` 를 호출하여, 지정된 프로토콜 체계를 사용하여 레포지터리와 상호 작용할 수 있다.
`helm repo add favorite myprotocol://example.com/` 와 같은 특별한 레포지터리도 일반 레포지터리와 유사하게 추가된다.
특별한 레포지터리에 대한 규칙은 일반 레포지터리와 동일하다. 사용가능한 차트 목록을 검색하고 캐시하려면
헬름이 `index.yaml` 파일을 다운로드할 수 있어야 한다.

정의된 명령어는 `command certFile keyFile caFile full-URL` 형식에 따라 호출된다.
SSL 자격 증명은 `$HELM_REPOSITORY_CONFIG`(예를 들어, `$HELM_CONFIG_HOME/repositories.yaml`)에 저장된 레포지터리 정의에서 가져온다.
다운로더 플러그인은 원시 콘텐츠를 stdout 에 덤프하고 stderr에 오류를 보고해야 한다.

다운로더 명령어는 하위 명령어 또는 인수도 지원하며, 예를 들어 `plugin.yaml` 에 `bin/mydownloader 하위명령어 -d` 를 지정할 수 있다.
이는 기본 플러그인 명령어와 다운로더 명령어에 대해 동일한 실행 파일을 사용하지만 각각에 대해 다른 하위명령어를 사용하려는 경우에 유용하다.

## 환경 변수

Helm은 플러그인을 실행할 때, 외부 환경을 플러그인에 전달하고 추가 환경 변수도 삽입한다.

`KUBECONFIG`와 같은 변수는 외부 환경에서 설정한 경우 플러그인에 대해 설정된다.

다음의 변수들은 자동으로 설정된다.

- `HELM_PLUGINS`: 플러그인 디렉토리 경로
- `HELM_PLUGIN_NAME`: `helm`에 의해 호출되는 플러그인의 이름
  즉, `helm myplug`는 `myplug` 라는 짧은 이름을 갖게 된다. 
- `HELM_PLUGIN_DIR`: 플러그인이 포함된 디렉토리
- `HELM_BIN`: (사용자에 의해 실행되는) `helm` 명령어의 경로
- `HELM_DEBUG`: helm에 의해 디버그 플래그가 설정되었는지 여부를 표시한다.
- `HELM_REGISTRY_CONFIG`: (사용하는 경우) 레지스트리 설정 위치
  레지스트리와 함께 헬름을 사용하는 것은 실험적인 기능임을 알아두자.
- `HELM_REPOSITORY_CACHE`: 저장소 캐시 파일의 경로
- `HELM_REPOSITORY_CONFIG`: 저장소 설정 파일의 경로
- `HELM_NAMESPACE`: `helm` 명령어에 지정된 네임스페이스 
  (일반적으로 `-n` 플래그 사용)
- `HELM_KUBECONTEXT`: `helm` 명령어에 제공된 쿠버네티스
  설정 컨텍스트의 이름

또한 쿠버네티스 설정 파일이 명시적으로 지정된 경우 'KUBECONFIG' 변수로 설정된다.

## 플래그 구문 분석에 대한 유의 사항

플러그인을 실행할 때 헬름은 자체 사용을 위해 전역 플래그를 구문 분석한다. 
이러한 플래그는 플러그인에 전달되지 않는다.

- `--burst-limit`: 이 플래그는 `$HELM_BURST_LIMIT` 로 변환된다.
- `--debug`: 지정하면`$ HELM_DEBUG`가`1`로 설정된다.
- `--kube-apiserver`: 이 플래그는 `$HELM_KUBEAPISERVER` 로 변환된다.
- `--kube-as-group`: 이 플래그는 `$HELM_KUBEASGROUPS` 로 변환된다.
- `--kube-as-user`: 이 플래그는 `$HELM_KUBEASUSER` 로 변환된다.
- `--kube-ca-file`: 이 플래그는 `$HELM_KUBECAFILE` 로 변환된다.
- `--kube-context`: 이 플래그는 `$HELM_KUBECONTEXT` 로 변환된다.
- `--kube-insecure-skip-tls-verify`: 이 플래그는 `$HELM_KUBEINSECURE_SKIP_TLS_VERIFY` 로 변환된다.
- `--kube-tls-server-name`: 이 플래그는 `$HELM_KUBETLS_SERVER_NAME` 로 변환된다.
- `--kube-token`: 이 플래그는 `$HELM_KUBETOKEN` 로 변환된다.
- `--kubeconfig`: 이 플래그는 `$KUBECONFIG` 로 변환된다.
- `--namespace` and `-n`: 이 플래그는 `$HELM_NAMESPACE` 로 변환된다.
- `--qps`: 이 플래그는 `$HELM_QPS` 로 변환된다.
- `--registry-config`: 이 플래그는 `$HELM_REGISTRY_CONFIG` 로 변환된다.
- `--repository-cache`: 이 플래그는 `$HELM_REPOSITORY_CACHE` 로 변환된다.
- `--repository-config`: 이 플래그는 `$HELM_REPOSITORY_CONFIG` 로 변환된다.

플러그인은 도움말 텍스트를 표시한 다음 `-h` 및 `--help` 를 위해 _종료해야 한다_. 
다른 모든 경우에는, 플러그인은 적절하게 플래그를 사용할 수 있다.

## 쉘 자동-완성 제공

헬름 3.2부터, 플러그인은 헬름의 기존 자동 완성 메커니즘의 일부로 쉘 자동 완성에 대한 지원을 선택적으로 제공할 수 있다.

### 정적 자동-완성

플러그인이 자체 플래그 및/또는 하위 명령어를 제공하는 경우, 플러그인의 루트 디렉토리에 `completion.yaml` 파일을 두어 헬름에 알릴 수 있다. 
`completion.yaml` 파일의 형식은 다음과 같다.

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

유의사항:
1. 모든 섹션은 선택 사항이지만 해당되는 경우에는 제공해야 한다.
1. 플래그에는 `-` 또는`--` 접두사가 포함되지 않아야 한다.
1. 짧은 플래그와 긴 플래그 모두 지정해야 한다. 
   짧은 플래그는 해당하는 긴 형식과 연결될 필요는 없지만, 두 형식 모두 나열되어야 한다.
1. 플래그는 어떤 방식으로도 정렬할 필요는 없지만 파일의 하위 명령어 계층 구조에서 올바른 위치에 나열되어야 한다.
1. 헬름의 기존 전역 플래그는 이미 헬름의 자동완성 메커니즘에 의해 처리되므로 플러그인은 `--debug`, `--namespace` 또는`-n`, `--kube-context` 플래그나 다른 기타 전역 플래그를 지정할 필요가 없다.
1. `validArgs` 목록은 하위 명령어 다음의 첫 번째 매개 변수에 대해 가능한 완성의 정적 목록을 제공한다. 
   이러한 목록을 미리(하단의 [동적 완성](#동적-완성)을 참조) 제공하는 것이 항상 가능한 것은 아니다.
   이 경우`validArgs` 섹션을 생략할 수 있다.

`completion.yaml` 파일은 전적으로 선택 사항이다.
제공되지 않는 경우 Helm은 플러그인(플러그인에서 [동적 완성] (#동적-완성)을 지원하지 않는 경우)에 대한 쉘 자동 완성 기능을 제공하지 않는다.
또한`completion.yaml` 파일을 추가하면 이전 버전과 호환되며 이전 헬름 버전을 사용할 때 플러그인 동작에 영향을 주지 않는다.

예를 들어 하위 명령어는 없지만 `helm status` 명령어와 동일한 플래그를 허용하는 [`풀스테이터스 플러그인`] (https://github.com/marckhouzam/helm-fullstatus)의 경우 `completion. yaml` 파일은 다음과 같다.

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

[`헬름 버전 2에서 버전3으로의 플러그인`] (https://github.com/helm/helm-2to3)과 같은 더 복잡한 예시로, 다음과 같은`completion.yaml` 파일이 있다.

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

또한 헬름 3.2부터 플러그인은 자체 동적 쉘 자동완성 기능을 제공할 수 있다.
동적 쉘 자동완성은 미리 정의할 수 없는 매개 변수 값 또는 플래그 값의 완성이다.
예를 들면, 현재 클러스터에서 사용할 수 있는 헬름 릴리스의 이름 완성이 있다.

플러그인이 동적 자동 완성을 지원하려면 루트 디렉토리에는 `plugin.complete` 라는 **실행** 파일을 제공해야 한다.
헬름 완성 스크립트에 플러그인에 대한 동적 완성이 필요한 경우 `plugin.complete` 파일을 실행하여 완성해야 하는 명령줄에 전달해야 한다.
`plugin.complete` 실행 파일에는 적절한 완성 선택이 무엇인지 결정하고 헬름 완성 스크립트에서 사용할 표준 출력으로 출력하는 로직이 있어야 한다.

`plugin.complete` 파일은 전적으로 선택 사항이다. 
제공되지 않으면 헬름은 플러그인에 대한 동적 자동완성 기능을 제공하지 않는다. 
또한 `plugin.complete` 파일을 추가하는 것은 이전 버전과 호환되어 이전 헬름 버전을 사용할 때 플러그인의 동작에 영향을 주지 않는다.

`plugin.complete` 스크립트의 출력은 다음과 같이 줄바꿈으로 구분된 목록이어야 한다.

```
rel1
rel2
rel3
```

`plugin.complete` 가 호출되면 플러그인의 메인 스크립트가 호출될 때와 마찬가지로 플러그인 환경이 설정된다.
따라서 변수 `$ HELM_NAMESPACE`, `$ HELM_KUBECONTEXT` 및 기타 모든 플러그인 변수가 이미 설정되어 있으며 해당 전역 플래그가 제거된다.

`plugin.complete` 파일은 모든 실행가능 형식일 수 있다. 
쉘 스크립트, Go 프로그램 또는 헬름이 실행할 수 있는 다른 유형의 프로그램이 될 수 있다. 
`plugin.complete` 파일에는 ***반드시*** 사용자에 대한 실행 권한이 있어야 한다. 
`plugin.complete` 파일은 *** 반드시 *** 성공 코드(값 0)와 함께 종료되어야 한다.

경우에 따라서는 동적 완성은 쿠버네티스 클러스터에서 정보를 가져와야 한다.
예를 들어 `helm fullstatus` 플러그인에는 릴리스 이름이 입력으로 필요하다.
`fullstatus` 플러그인에서 `plugin.complete` 스크립트가 현재 릴리스 이름에 대한 완성 기능을 제공하려면 `helm list -q` 를 실행하고 결과를 출력하면 된다.

플러그인 실행과 플러그인 완성을 위해 동일한 실행 파일을 사용하려면 `plugin.complete` 스크립트를 만들어 특별한 매개변수나 플래그를 사용하여 메인 플러그인 실행파일을 호출할 수 있다. 
메인 플러그인 실행파일이 특별한 매개변수나 플래그를 감지하면, 자동완성을 실행하는 것을 알게 된다. 
이 예에서 `plugin.complete` 는 다음과 같이 구현될 수 있다.

```sh
#!/usr/bin/env sh

# "$@" 는 완성이 필요한 전체 명령줄이다.
# 빈 마지막 매개변수를 유지하려면 "$@" 변수를 겹따옴표로 묶는 것이 중요하다.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

`fullstatus` 플러그인의 실제 스크립트 (`status.sh`)는 `--complete` 플래그를 찾아야 하며, 발견될 경우 적절한 완성을 출력해야 한다.

### 팁과 요령

1. 쉘은 사용자 입력과 일치하지 않는 완성 선택항목을 자동으로 필터링한다. 
   따라서 플러그인은 사용자 입력과 일치하지 않는 완성을 제거하지 않고 관련된 모든 완성을 반환할 수 있다.
   예를 들어, 명령줄이 `helm fullstatus ngin <TAB>` 인 경우,
   `plugin.complete` 스크립트는 `ngin` 으로 시작하는 이름뿐 아니라 *모든* 릴리스 이름 (`default` 네임스페이스에 있는 것)을 출력할 수 있다. 
   쉘은 'ngin'으로 시작하는 것만을 유지한다.
1. 특별히 복잡한 플러그인이 있는 경우 동적 완성 지원을 단순화하기 위해 `plugin.complete` 스크립트가 기본 플러그인 스크립트를 호출하고 완성 선택을 요청하도록 할 수 있다. 
   예제는 위의 [동적 완성](#동적-완성) 섹션을 참조하자.
1. 동적 완성 및 `plugin.complete` 파일을 디버깅하기 위해, 
   다음을 실행하여 완성되는 결과를 확인할 수 있다.
    - `helm __complete <pluginName> <arguments to complete>`.  예를 들면,
    - `helm __complete fullstatus --output js<ENTER>`,
    - `helm __complete fullstatus -o json ""<ENTER>`
