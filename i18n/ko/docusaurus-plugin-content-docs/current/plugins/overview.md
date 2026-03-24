---
title: 플러그인 개요
sidebar_label: 개요
sidebar_position: 1
---

헬름 플러그인은 유저가 모든 새로운 기능을 Go로 작성해 헬름 코어에 추가하지 않고도 Helm의 핵심 기능을 확장할 수 있게 해줍니다.

플러그인은 어떤 프로그래밍 언어로도 작성할 수 있으며 헬름의 코어 기능을 망가뜨리지 않으며 헬름 설치에 추가하거나 제거할 수 있습니다.

## 플러그인 타입 {#plugin-types}

현재 헬름에는 세 가지 유형의 플러그인이 있습니다:

- [CLI 플러그인](#cli-plugins): 사용자가 추가적인 `helm` CLI 하위 명령어를 덧붙일 수 있게 해줍니다.
- [Getter 플러그인](#getter-plugins): 헬름 코어에서 기본적으로 지원하지 않는 위치에서도 차트나 다른 플러그인을 사용할 수 있게 합니다.
- [Postrenderer 플러그인](#postrenderer-plugins): 사용자가 차트에 의해 렌더링된 매니페스트를 쿠버네티스 API로 전송하기 전 수정할 수 있게 해줍니다.

헬름4부터 추가적인 플러그인 유형을 더 쉽게 추가할 수 있도록 플러그인 시스템이 설계되었고, 사용자는 헬름 기능의 다른 영역도 수정할 수 있게 됩니다.

### CLI 플러그인 {#cli-plugins}

별도의 스크립트나 자체적인 독립형 커멘드를 지닌 툴을 사용하는 것과 대비해 플러그인을 이용해 `helm` CLI 하위 명령어를 만드는 것의 이점이 무엇일까요? 

가장 큰 장점은 `helm` CLI 하위 명령어를 추가하는 플러그인이 독립 실행형 스크립트나 도구가 직접 구현해야 하는 헬름 고유의 설정, 컨텍스트 및 기능을 활용할 수 있다는 점입니다. 이를 통해 `helm` CLI 사용자 워크플로우를 보다 원활하게 확장할 수 있습니다.

### Getter 플러그인 {#getter-plugins}

헬름은 로컬 파일 시스템에 있거나 [OCI 레지스트리](/topics/registries.mdx)에 아티팩트로 저장된 [Chart](/glossary/index.mdx)와 플러그인을 다루는 기본 기능을 제공합니다. 차트는 추가적으로 [HTTP 저장소](/topics/chart_repository.md)에 저장할 수 있으며 플러그인은 추가적으로 Git과 같은 VCS 저장소에도 저장할 수 있습니다.

헬름의 Getter 플러그인은 이러한 저장 및 다운로드 동작을 확장하여 다른 저장소를 지원할 수 있게 합니다.
[s3 버킷](/community/related#helm-plugins)나 그 외 다른 어디든 차트와 플러그인을 저장할 수 있는 커뮤니티 Getter 플러그인이 있습니다. 헬름 워크플로우에서 추가적인 저장 옵션이 필요할 때 getter 플러그인을 사용하길 선호하게 될 겁니다.

### 포스트렌더러 플러그인 {#postrenderer-plugins}

헬름은 사용자가 커스텀 값을 제공해 차트를 구성하게 해줍니다. 사용자에 의해 제공된 값은 차트가 매니페스트를 렌더링하는 데 사용되는데, 이를 통해 헬름은 쿠버네티스에서 어플리케이션을 관리할 수 있습니다. 

자기 소유의 차트를 작성할 땐 렌더링된 매니페스트에 추가적인 구성 옵션이 필요할 때마다 템플릿을 업데이트할 수 있습니다. 하지만 자기 소유가 아닌 커뮤니티 차트를 사용한다면 포스트 렌더링으로 차트가 매니페스트를 렌더링한 시점, 하지만 아직 헬름이 그를 사용해 쿠버네티스 리소스를 관리하진 않은 이전 시점에 매니페스트를 수정할 수 있습니다. 헬름4부터는 포스트렌더러 플러그인으로 이를 수행할 수 있습니다.

## 플러그인 API 버전 {#plugin-api-versions}

헬름4부터 모든 플러그인에 포함된 `plugin.yaml` 파일에 `apiVersion` 필드가 추가되며 현재 값은 `v1`입니다.

(API 버전 도입 이전의) 레거시 플러그인도 헬름4에서 계속 지원될 것이며, 따라서 헬름3에서 사용하던 기존 플러그인도 헬름5가 나오기 전까지는 계속 작동할 것입니다. 다만 자주 사용하는 플러그인의 개발자에게 새 버전 관리 시스템으로 업데이트하길 요청하는 게 좋습니다.

플러그인 개발자라면, [플러그인 개발자 가이드](/plugins/developer/index.mdx)에서 이에 관해 더 자세히 읽어보세요.

## 플러그인 런타임 {#plugin-runtimes}

헬름은 현재 두 가지 플러그인 런타임을 지원합니다:

- 서브프로세스 런타임
- Wasm 런타임

각 런타임에 대한 자세한 내용은 [플러그인 사용자 가이드](/plugins/user/index.md) 또는  [플러그인 개발자 가이드](/plugins/developer/index.mdx)를 참조하세요.

## 파일 구조 {#file-structure}

플러그인의 모든 파일은 단일 디렉터리에 위치하며, 이 디렉터리는 개발, 패키징, 설치에 사용됩니다.

플러그인 디렉터리 내부에서 헬름은 다음 구조를 요구합니다:

```
example-plugin
├── plugin.yaml # REQUIRED
├── plugin.sh   # OPTIONAL for Subprocess runtime
└── plugin.wasm # REQUIRED for Wasm runtime
```

- 필수 파일은 [plugin.yaml](#pluginyaml)가 유일합니다.
- [서브프로세스 런타임](#plugin-runtimes)에는 선택적으로 (노드, 파이썬, Go, 그 외 등등) 플러그인 코드가 담긴 한 가지 이상의 실행 파일을 넣을 수 있습니다. 이 런타임에서는 `plugin.yaml` [런타임 설정](#runtime-configuration)의 `platformCommand` 필드를 통해 사용자의 PATH에서 이미 사용 가능한 실행 파일을 직접 호출할 수도 있습니다.
- [Wasm 런타임](#plugin-runtimes)의 경우 `.wasm` 파일을 포함해야 합니다. 이는 Wasm으로 컴파일된 플러그인 코드입니다(Node, Python, Go 등 가능).

## Plugin.yaml {#plugin-yaml}

`plugin.yaml` 파일은 플러그인에 필수 요소입니다. 이 파일은 플러그인에 관한 메타데이터와 구성을 담은 YAML 파일입니다.

### 메타데이터 정보 {#metadata-information}

```yaml
apiVersion: 필수 - 플러그인 API 버전. 값은 반드시 "v1"이어야 함.  
type: 필수 - 버전 관리된 플러그인 유형. "cli/v1", "getter/v1", 또는 "postrenderer/v1" 중 하나일 수 있음.  
name: 필수 - 플러그인의 이름.  
version: 필수 - 플러그인의 버전.  
runtime: 필수 - 플러그인 런타임. "subprocess" 또는 "extism/v1"(Wasm) 중 하나일 수 있음. 
sourceURL: 선택 - 플러그인 소스 코드를 가리키는 URL.  
config: 플러그인 유형에 따라 달라짐  
runtimeConfig: 런타임에 따라 달라짐
```

- `config` 필드는 [플러그인 유형 구성](#plugin-type-configuration)에 사용되며, `type` 필드에 정의된 [플러그인 유형](#plugin-types)에 따라 구조가 달라집니다.  
- `runtimeConfig` 필드는 [런타임 구성](#runtime-configuration)에 사용되며, `runtime` 필드에 정의된 [런타임](#plugin-runtimes)에 따라 구조가 달라집니다.  
- 💡 `sourceURL` 필드는 선택 사항이지만, 플러그인 작성자는 플러그인 소스 코드를 가리키도록 권장됩니다. 이는 플러그인 사용자가 코드가 무엇을 하는지 이해하고, 오픈소스 기여가 가능할 경우 플러그인에 기여할 수 있도록 돕기 위함입니다.

### 플러그인 유형 구성 {#plugin-type-configuration}

[plugin.yaml](#pluginyaml)의 `config` 필드는 [플러그인 유형](#plugin-types)마다 서로 다른 옵션을 가집니다. 플러그인의 유형은 `type` 필드로 정의됩니다.

#### CLI 플러그인 설정 {#cli-plugin-configuration}

만약 `type` 필드가 `cli/v1`이라면 [CLI 플러그인 유형](#cli-plugins)이며, 다음 플러그인 유형 설정이 허용됩니다:

```yaml
usage: 선택 사항 - 도움말에 표시되는 한 줄 사용법 텍스트  
shortHelp: `helm help` 출력에 표시되는 짧은 설명  
longHelp: `helm help <this-command>` 출력에 표시되는 상세 메시지  
ignoreFlags: Helm에서 전달된 플래그를 무시합니다
```

- `usage`는 선택 사항입니다. 커스텀 사용법 문자열로 오버라이드하지 않으면 기본값은 "helm PLUGIN_NAME [flags]"입니다. 권장 문법은 [spf13/cobra.command.Command] Use 필드 주석을 참조하세요: https://pkg.go.dev/github.com/spf13/cobra#Command
- `ignoreFlags`는 Helm이 플러그인에 플래그를 전달하지 않도록 합니다. 예를 들어 `helm myplugin --foo`로 플러그인을 호출하고 `ignoreFlags: true`인 경우 `--foo`는 자동으로 무시됩니다.

#### Getter 플러그인 설정 {#getter-plugin-configuration}

만약 `type` 필드가 `getter/v1`이라면 [Getter 플러그인 유형](#getter-plugins)이며, 다음 플러그인 유형 설정이 허용됩니다:

```yaml
protocols: 이 플러그인이 지원하는 차트 URL의 스킴 목록입니다.
```

#### 포스트 렌더러 플러그인 설정 {#postrenderer-plugin-configuration}

만약 `type` 필드가 `postrenderer/v1`이라면 [포스트 렌더러 플러그인 유형](#postrenderer-plugins)이며, 별도의 설정 옵션이 없습니다.

### 런타임 설정 {#runtime-configuration}

[plugin.yaml](#pluginyaml)의 `runtimeConfig` 필드는 [플러그인 런타임](#plugin-runtimes)에 따라 다른 옵션을 가집니다. 플러그인의 런타임은 `runtime` 필드로 정의됩니다.

#### 서브프로세스 런타임 설정 {#subprocess-runtime-configuration}

만약 `runtime` 필드가 `subprocess`라면 [서브프로세스 런타임](#plugin-runtimes) 플러그인이며, 다음 런타임 설정이 허용됩니다:

```yaml
runtimeConfig:
    platformCommand: # 플랫폼에 따라 실행할 명령어 설정
        - os: OS 일치 조건, 비워두거나 생략하면 모든 OS에 일치
          arch: 아키텍처 일치 조건, 비워두거나 생략하면 모든 아키텍처에 일치
          command: 실행할 플러그인 명령어
          args: 플러그인 명령어 인수
    platformHooks: # 플랫폼에 따라 플러그인 라이프사이클 훅 설정
        install: # 설치 라이프사이클 명령어
            - os: OS 일치 조건, 비워두거나 생략하면 모든 OS에 일치
              arch: 아키텍처 일치 조건, 비워두거나 생략하면 모든 아키텍처에 일치
              command: 실행할 플러그인 설치 명령어
              args: 플러그인 설치 명령어 인수
        update: # 업데이트 라이프사이클 명령어
            - os: OS 일치 조건, 비워두거나 생략하면 모든 OS에 일치
              arch: 아키텍처 일치 조건, 비워두거나 생략하면 모든 아키텍처에 일치
              command: 실행할 플러그인 업데이트 명령어
              args: 플러그인 업데이트 명령어 인수
        delete: # 삭제 라이프사이클 명령어
            - os: OS 일치 조건, 비워두거나 생략하면 모든 OS에 일치
              arch: 아키텍처 일치 조건, 비워두거나 생략하면 모든 아키텍처에 일치
              command: 실행할 플러그인 삭제 명령어
              args: 플러그인 삭제 명령어 인수
    protocolCommands: # 더 이상 사용되지 않음/지원 중단
        - protocols: [] # 차트 URL의 스킴 목록
          platformCommand: [] # 위의 "platformCommand"와 동일한 구조
```

- ⚠️ `protocolCommands`는 `obsolete/deprecated`로 표시되어 있으며, `apiVersion: v1` 이후의 플러그인 시스템 버전에서 제거될 예정입니다. 이 필드는 "getter/v1" 플러그인 유형에만 적용됩니다. 이는 단일 플러그인에서 여러 프로토콜을 지원하도록 확장된 구 플러그인 다운로더 메커니즘의 호환성 잔재입니다. PlatformCommand에 지정된 명령어는 다운로드 URL을 검사하여 프로토콜별 로직을 구현해야 됩니다.

#### Wasm 런타임 설정 {#wasm-runtime-configuration}

만약 `runtime` 필드가 `extism/v1`이라면 [Wasm 런타임](#plugin-runtimes) 플러그인이며, 다음 런타임 설정이 허용됩니다:

```yaml
runtimeConfig:
    memory: # 플러그인에 할당될 수 있는 메모리 한도 설정
        maxPages: 플러그인이 할당할 수 있는 최대 페이지 수. 1페이지는 64KiB. 예: 16페이지는 1MiB 필요. 기본값은 4페이지(256KiB).
        maxHttpResponseBytes: Extism HTTP 응답의 최대 크기(바이트). 기본값은 4096바이트(4KiB).
        maxVarBytes: 모든 Extism 변수의 최대 크기(바이트). 기본값은 4096바이트(4KiB).
    config: {} # 플러그인에 전달할 수 있는 자유 형식 맵.
    allowedHosts: [] # 이 플러그인이 통신할 수 있는 호스트 목록(선택 사항). 기본값은 허용된 호스트 없음.
    fileSystem:
        createTempDir: 파일 시스템에 임시 디렉터리를 생성할지 여부. "true" 또는 "false".
    timeout: 플러그인 실행 타임아웃(밀리초)
    hostFunctions: 플러그인이 접근할 수 있는 헬름에서 노출된 HostFunction 이름. https://extism.org/docs/concepts/host-functions/ 참조
    entryFuncName: 플러그인에서 호출할 진입 함수 이름. 기본값은 "helm_plugin_main".
```

- `allowedHosts`는 플러그인이 HTTP 요청을 수행하는 경우에만 적용됩니다. 지정하지 않으면 어떤 호스트도 허용되지 않습니다.