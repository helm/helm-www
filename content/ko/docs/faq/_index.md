---
title: "자주 묻는 질문"
weight: 8
---

# 자주 묻는 질문

> 헬름 2와 헬름 3의 중요한 차이점은 무엇일까요?
> 이 페이지는 가장 자주 나오는 질문들에 대한 도움말을 제공합니다.

이 문서를 개선시킬 수 있도록 **도와주시면 감사하겠습니다**.
정보를 추가, 수정, 삭제하려면 [이슈를 등록](https://github.com/helm/helm-www/issues)하거나
풀 리퀘스트를 보내주세요.

## 헬름 2 이후 변화

다음은 헬름 3에 도입된 주요 변경사항의 상세 목록입니다.

### 틸러(tiller) 제거

헬름 2 개발 주기에 틸러를 도입했었습니다.
틸러는 공유 클러스터에서 작업하는 팀에게 중요한 역할을 했습니다.
서로 다른 운영자가 동일한 릴리스 집합과 상호 작용할 수 있도록 만들어 주었습니다.

쿠버네티스 1.6에서 역할 기반 접근 제어(RBAC)가 기본적으로 활성화되면서,
운영 시나리오에서 틸러 접근제어를 관리하는 것이 더욱 어려워졌습니다.
수많은 보안 정책 때문에
우리의 입장은 허용 가능한 기본 설정을 제공하는 것이었습니다.
이를 통해 헬름을 처음 접한 사용자는 처음부터 보안 제어를 깊이 알지 못해도
헬름과 쿠버네티스를 시작해볼 수 있었습니다. 아쉽지만,
이러한 허용적(permissive) 설정은 의도치 않게 사용자에게 광범위한 권한을 부여할 수 있습니다.
데브옵스(DevOps)와 사이트 신뢰성 엔지니어(SRE)는 멀티 테넌트 클러스터에 틸러를
설치할 때 추가적인 작업 단계를 알아야 했습니다.

커뮤니티 구성원들이 특정 시나리오에서 헬름을 어떻게 사용하는지 들은 후,
틸러의 릴리스 관리 시스템은
상태를 유지하거나 헬름 릴리스 정보의 중심 허브 역할을 하기 위해
클러스터 내 운영자에게 의존할 필요가 없다는 것을 알게 되었습니다.
그 대신 쿠버네티스 API 서버에서 정보를 간단히 가져오고,
차트 클라이언트 측을 렌더링하며 쿠버네티스에 설치 기록을 보관할 수 있습니다.

틸러의 주요 목표는 틸러 없이도 달성될 수 있습니다.
그래서 헬름 3와 관련하여 우리가 내린 첫 번째 결정 중 하나는 틸러를 완전히 제거하는 것입니다.

틸러가 사라지면 헬름의 보안 모델이 획기적으로 간소화됩니다.
헬름 3는 이제 현대 쿠버네티스의 모든 현대적인 보안, 신원 확인 및 인가 기능을 지원합니다. 헬름의 권한은
[kubeconfig 파일](https://kubernetes.io/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)을
사용하여 평가됩니다.
클러스터 관리자는 세세하게 사용자 권한을 제한할 수 있습니다.
릴리스는 여전히 클러스터 내에 기록되며,
헬름의 나머지 기능은 그대로 유지됩니다.

### 업그레이드 전략 개선: 3 방향 전략적 병합 패치

헬름 2는 양방향 전략적 병합 패치를 사용했었습니다. 업그레이드할 때
최근 차트의 매니페스트와 새로 제시된 차트의 매니페스트(`helm upgrade` 중에 제공된 것 중
하나)를 비교했습니다. 쿠버네티스 리소스에 적용해야 할 변경 사항을 알아내기 위해
두 차트 간의 차이를 비교했습니다.
클러스터 외부의 활동(예: `kubectl edit` 하는) 중에 변경 사항이 적용되었다면,
그러한 변경은 고려되지 않았습니다. 이로 인해 리소스가 이전 상태로 롤백할 수 없게 되었습니다.
헬름은 마지막으로 적용된 차트의 매니페스트만 현재 상태로 간주했기 때문에
차트의 상태가 변경되지 않은 경우
활성 상태는 변경되지 않은 상태로 그대로 유지됩니다.

헬름 3는 현재 3 방향 전략적 병합 패치를 사용하고 있습니다.
헬름은 패치를 생성할 때 이전 매니페스트, 라이브 상태, 새 매니페스트를 고려합니다.

#### 예시

이러한 변화가 어떤 영향을 미치는지 몇 가지 일반적인 예를 살펴보겠습니다.

##### 라이브 상태 변경 시 롤백

당신의 팀은 방금 헬름을 사용하여 쿠버네티스 프로덕션 서버에 애플리케이션을 배포했습니다.
차트에는 레플리카 수가 3개로 설정된 디플로이먼트(Deployment) 오브젝트를
포함합니다.

```console
$ helm install myapp ./myapp
```

새로운 개발자가 팀에 합류합니다.
첫날에 프로덕션 클러스터를 살펴보다가, 키보드에 커피를 쏟는 끔찍한 사고가 발생하여
`kubectl scale` 명령어로 프로덕션 디플로이먼트
레플리카 수를 3개에서 0개로 축소시킵니다.

```console
$ kubectl scale --replicas=0 deployment/myapp
```

팀의 다른 개발자는 프로덕션 사이트가 다운된 것을 확인하고
릴리스를 이전 상태로 롤백하기로 합니다.

```console
$ helm rollback myapp
```

어떻게 될까요?

헬름 2에서는 이전 매니페스트를 새 매니페스트와 비교하여 패치를 생성합니다.
이것은 롤백이기 때문에 동일한 매니페스트입니다.
헬름에서는 이전 매니페스트와 새 매니페스트 간에
차이가 없기 때문에 변경할 사항이 없다고 판단합니다.
레플리카 수는 계속 0입니다. 패닉은 계속됩니다.

헬름 3에서 패치는 이전 매니페스트, 라이브 상태, 새 매니페스트를 사용하여 생성됩니다.
헬름은 기존 상태가 3이고 라이브 상태가 0에 있으며,
새 매니페스트는 그것을 다시 3으로 바꾸기를 원하기 때문에,
패치를 생성하여 상태를 다시 3으로 바꾸게 됩니다.

##### 라이브 상태 변경 시 업그레이드

많은 서비스 메쉬 및 기타 컨트롤러 기반 애플리케이션은 데이터를 쿠버네티스 오브젝트에 주입합니다.
이것은 사이드카, 레이블 또는 다른 정보일 수 있습니다.
이전에 차트에서 렌더링된 매니페스트가 있다면 다음과 같습니다.

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

그리고 다른 애플리케이션이 라이브 상태를 다음과 같이 수정했습니다.

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

이제 `nginx` 이미지 태그를 `2.1.0`으로 업그레이드하려고 합니다.
따라서 다음과 같은 매니페스트가 있는 차트로 업그레이드합니다.

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

어떻게 될까요?

헬름 2에서 헬름은 기존 매니페스트와 새로운 매니페스트 사이에
`containers` 오브젝트의 패치를 생성합니다.
패치 생성 중에는 클러스터의 라이브 상태가 고려되지 않습니다.

클러스터의 라이브 상태가 다음과 같이 수정됩니다.

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

사이드카 파드가 라이브 상태에서 제거됩니다. 더 많은 공포가 뒤따릅니다.

헬름 3에서 헬름은 기존 매니페스트, 라이브 상태, 새 매니페스트 사이에
`container` 오브젝트의 패치를 생성합니다. 새로운 매니페스트가 이미지 태그를
`2.1.0` 으로 바꾸지만 라이브 상태는 사이드카 컨테이너를 포함합니다.

클러스터의 라이브 상태가 다음과 같이 수정됩니다.

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

### 이제 릴리스 이름이 네임스페이스에 할당됩니다

틸러가 제거되면서 각 릴리스에 대한 정보는 어디론가 이동해야 했습니다.
헬름 2에서는 틸러와 동일한 네임스페이스에 저장되었습니다.
이는 실제로 릴리스에 이름이 사용되면 다른 네임스페이스에 배포되었더라도
다른 릴리스에서는 동일한 이름을 사용할 수 없음을 의미합니다.

헬름 3에서는 특정 릴리스에 대한 정보가 릴리스 자체와 동일한 네임스페이스에
저장됩니다. 즉, 이제 사용자는 별도의 두 네임스페이스에서
`helm install wordpress stable/wordpress`를 수행할 수 있으며,
현재 네임스페이스 컨텍스트를 변경하여 `helm list` 를 조회할 수 있습니다.
(예: `helm list --namespace foo`)

이렇게 네이티브 클러스터 네임스페이스가 보다 개선되면서
`helm list` 명령은 기본적으로 모든 릴리스를 나열하지 않습니다.
대신 현재 쿠버네티스 컨텍스트의 네임스페이스에 있는 릴리스만
나열됩니다(즉, `kubectl config view --minify`를 실행할 때 표시되는 네임스페이스).
또한 헬름 2와 유사한 동작을 수행하려면 `helm list`에
`--all-namespaces` 플래그를 주어야 합니다.

### 기본 스토리지 드라이버로서의 시크릿(Secret)

헬름 3에서 시크릿은 이제 [기본 스토리지
드라이버](//docs/topics/advanced/#storage-backends)로 사용됩니다. 헬름 2는
기본적으로 컨피그맵(ConfigMap)을 사용하여 릴리스 정보를 저장합니다. 헬름 2.7.0에서
릴리스 정보를 저장하기 위해 시크릿을 사용하는 새로운 스토리지 백엔드가 구현되었으며
헬름 3부터는 기본값이 되었습니다.

헬름 3 기본값을 시크릿으로 변경하면 쿠버네티스의
시크릿 암호화(Secret Encryption) 릴리스와 함께
차트를 보호할 수 있습니다.

[미사용 시크릿을 암호화하는
것](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)은
쿠버네티스 1.7에서 알파 기능으로 사용 가능하게 되었고
쿠버네티스 1.13을 기점으로 안정화되었습니다. 이를 통해 사용자는
미사용 헬름 릴리스 메타데이터를 암호화할 수 있으므로
나중에 볼트(Vault)와 같은 용도로 확장할 수 있습니다.

### Go import 경로 변경

헬름 3에서 헬름은 Go import 경로를 `k8s.io/helm`에서
`helm.sh/helm/v3`으로 전환했습니다. 헬름 3 Go 클라이언트 라이브러리로
업그레이드하려면 import 경로를 변경해야 합니다.

### Capabilities

렌더링 단계에서 사용 가능한 `.Capabilities` 빌트인 객체가
간소화되었습니다.

[빌트인 객체](/docs/chart_template_guide/builtin_objects/)

### JSON 스키마로 차트 값 유효성 검사

이제 차트 값(values)에 JSON 스키마를 적용할 수 있습니다.
이렇게 하면 사용자가 입력한 값이 차트 관리자가 제공한
스키마를 따르므로 사용자가 차트에 잘못된 값들을 입력할 때
오류 보고 기능이 향상됩니다.

다음 명령어 중 하나가 호출될 때 유효성 검사가 수행됩니다.

* `helm install`
* `helm upgrade`
* `helm template`
* `helm lint`

자세한 내용은 [스키마 파일](/ko/docs/topics/charts#스키마-파일) 문서를
참조하십시오.

### `requirements.yaml`이 `Chart.yaml` 로 통합

차트 의존성 관리 시스템이 requirements.yaml 와 requirements.lock에서
Chart.yaml 와 Chart.lock으로 이동했습니다. 헬름 3에서 새로운 차트는
새로운 형식을 사용하는 것이 권장됩니다. 그러나 헬름 3는 여전히 차트 API
버전 1(`v1`)을 이해하고 있으며 기존 `requirements.yaml` 파일을 로드합니다.

헬름 2에서는 `requirements.yaml`이 이렇게 생겼습니다.

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://kubernetes-charts.storage.googleapis.com/
  condition: mariadb.enabled
  tags:
    - database
```

헬름 3에서는 의존성이 동일한 방식으로 표현되지만
이제 `Chart.yaml`에서 표현됩니다.

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://kubernetes-charts.storage.googleapis.com/
  condition: mariadb.enabled
  tags:
    - database
```

차트는 여전히 `charts/` 디렉토리에 다운로드되므로
`charts/` 디렉토리에 제공된 하위 차트는
수정 없이 계속 동작합니다.

### 설치 시 이름(또는 --generate-name)이 필요합니다

헬름 2에서 이름이 주어지지 않은 경우 자동으로 생성된 이름이 지정됩니다. 프로덕션에서
이것은 유용한 기능이라기보다는 오히려 골칫거리로 판명되었습니다. 헬름 3에서
`helm install`과 함께 이름이 주어지지 않으면 헬름이 오류를 던집니다.

이름이 자동으로 생성되기를 원하는 사용자는 `--generate-name` 플래그를
사용하여 자동으로 생성할 수 있습니다.

### OCI 레지스트리로 차트 밀어내기

이것은 헬름 3에 도입된 실험적인(experimental) 기능입니다.
사용하려면 환경 변수 `HELM_EXPERIMENTAL_OCI=1`을 설정합니다.

높은 수준에서 차트 저장소는 차트를 저장하고 공유할 수 있는 곳입니다.
헬름 클라이언트는 헬름 차트를 패키징하여 차트 저장소로 보냅니다.
간단히 말해 차트 저장소는 index.yaml 파일과 일부 패키지형 차트를 저장하는
기본 HTTP 서버입니다.

차트 저장소 API가 가장 기본적인 스토리지 요구 사항을 충족하면 몇 가지 이점이 있지만
다음과 같은 몇 가지 문제점이 나타나기 시작했습니다.

- 차트 저장소는 프로덕션 환경에 필요한 대부분의 보안 구현을
  추상화하는 데 매우 어려움을 겪고 있습니다. 인증 및 인가를
  위한 표준 API를 갖는 것은 프로덕션 시나리오에서
  매우 중요합니다.
- 차트의 무결성과 원본을 표시 및 검증하는 데 사용되는 헬름의 차트 출처(provenance)
  도구는 차트 발행 프로세스의 선택 사항입니다.
- 멀티 테넌트 시나리오에서는 다른 테넌트에서 동일한 차트를 업로드할 수 있으므로
  동일한 컨텐츠를 저장하는 데 드는 스토리지 비용이 두 배가 됩니다.
  보다 스마트한 차트 저장소는 이 문제를 처리하도록 설계되었지만 정식 사양에는
  포함되지 않습니다.
- 검색, 메타데이터 정보, 차트 가져오기에 단일 인덱스 파일을
  사용하면 안전한 멀티 테넌트 구현으로 설계하기가 어렵거나
  복잡해졌습니다.

도커의 분산 프로젝트(Distribution prject, 도커 레지스트리 v2라고도 함)는
도커 레지스트리 프로젝트의 후속 작업입니다. 많은 주요 클라우드 벤더가
분산 프로젝트를 제공하는 상품을 보유하고 있으며, 수많은 벤더가 동일한 제품을
제공함에 따라 분산 프로젝트는 수년간의 개선, 보안 모범 사례, 실전 테스트의
혜택을 받아 왔습니다.

차트를 패키징하고 도커 레지스트리에 밀어내는 방법에 대한 자세한 내용은
`helm help chart` 및 `helm help registry`를 참조하시기 바랍니다.

자세한 내용은 [이 페이지](/docs/topics/registries/)를 참조하시기 바랍니다.

### `helm serve` 제거

`helm serve`는 개발 목적으로 머신에서 로컬 차트 저장소를
실행했습니다. 하지만 개발 도구로서 그다지 많은 관심을 받지 못했고
설계에도 많은 문제가 있었습니다. 결국 우리는 이것을 제거하고
플러그인으로 분리하기로 했습니다.

`helm serve`와 유사한 경험을 위해서는 [차트뮤지엄
(ChartMuseum)](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)의
로컬 파일 시스템 스토리지 옵션과
[servecm 플러그인](https://github.com/jdolitsky/helm-servecm)에 대해 살펴보세요.


### 라이브러리 차트 지원

헬름 3는 "라이브러리 차트"라고 하는 차트의 클래스를 지원합니다. 다른 차트에서
공유하지만 자체 릴리스 아티팩트는 생성하지 않는 차트입니다. 라이브러리 차트의
템플릿은 `define` 요소만 선언할 수 있습니다. 전역 범위 `define`이 아닌 콘텐츠는
무시됩니다. 이를 통해 사용자는 여러 차트에서 재사용할 수 있는 코드 조작(snippet)을
재사용하고 공유할 수 있으므로 중복성을 방지하고
차트 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)를 유지할 수 있습니다.

라이브러리 차트는 Chart.yaml의 dependencies 지시어에 선언되며
다른 차트처럼 설치 및 관리됩니다.

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

이 기능이 차트 개발자에게 제공되는 유즈 케이스와
라이브러리 차트를 사용하면서 생긴 모범 사례을 보게 되어
매우 기쁩니다.

### Chart.yaml apiVersion 격상

라이브러리 차트 지원이 도입되고 requirements.yaml이 Chart.yaml로
통합됨에 따라 헬름 2의 패키지 형식을 이해하고 있는 클라이언트는
이러한 새로운 기능을 이해할 수 없게 되었습니다. 따라서 Chart.yaml의
apiVersion을 v1에서 v2로 격상했습니다.

`helm create`는 이제 이 새로운 형식을 사용하여 차트를 생성하므로
기본 apiVersion도 격상했습니다.

헬름 차트의 두 버전을 모두 지원하려는 클라이언트는 패키지 형식을 해석하는
방법을 이해하기 위해 Chart.yaml의 `apiVersion` 필드를 검사하는 것이 좋습니다.

### XDG 베이스 디렉토리 지원

[XDG 베이스 디렉토리
사양](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)은
파일 시스템에 설정, 데이터, 캐시된 파일을 저장할 위치를 정의하는
이식 가능한 표준입니다.

헬름 2에서 헬름은 이 모든 정보를 `~/.helm`(정확히 `helm home`이라고 함)에
저장했으며, `$HELM_HOME` 환경 변수를 설정하여 변경하거나,
전역 플래그 `--home` 을 사용하여 변경할 수 있습니다.

헬름 3에서 헬름은 XDG 기본 디렉토리 사양에 따라 다음 환경 변수를
고려합니다.

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

헬름 플러그인은 `$HELM_HOME`을 스크래치패드 환경으로
사용하려는 플러그인과의 하위 호환성을 위해
`$XDG_DATA_HOME`의 별칭으로 `$HELM_HOME`을 여전히 전달됩니다.

이러한 변화에 맞추기 위해 몇 가지 새로운 환경 변수도
플러그인 환경에 전달됩니다.

- `$HELM_PATH_CACHE` 로 캐시 경로 지정
- `$HELM_PATH_CONFIG` 로 설정 경로 지정
- `$HELM_PATH_DATA` 로 데이터 경로 지정

헬름 3를 지원하려는 헬름 플러그인은 이 새로운 환경 변수들을
고려해야 합니다.

### CLI 명령어 이름을 변경했습니다

다른 패키지 매니저의 용어와 잘 조화시키기 위해 `helm delete`를 `helm uninstall`로
개명했습니다. `helm delete`은 여전히 `helm uninstall`의 별칭으로 유지되므로
두 형식 중 하나를 사용할 수 있습니다.

헬름 2에서는 릴리스 기록을 제거하기 위해 `--purge` 플래그를 써야
했습니다. 이제 이 기능은 기본적으로 활성화됩니다. 예전 동작을 유지하려면
`helm uninstall --keep-history`를 사용합시다.

또한 동일한 규칙을 수용하기 위해 일부 다른 명령어들이
개명되었습니다.

- `helm inspect` -> `helm show`
- `helm fetch` -> `helm pull`

이러한 명령어는 예전 동사도 별칭으로 유지하므로
두 가지 형식에서 계속 사용할 수 있습니다.

### 네임스페이스 자동 생성

존재하지 않는 네임스페이스에 릴리스를 생성할 때 헬름 2가 네임스페이스를 만들었습니다.
헬름 3는 다른 쿠버네티스 도구의 동작을 따르며 네임스페이스가 없는 경우
오류를 반환합니다. `--create-namespace` 플래그를 명시적으로 지정하면 헬름 3가
네임스페이스를 만듭니다.

### .Chart.ApiVersion 은 없어졌나요?

헬름은 머리글자를 대문자로 나타내는 일반적인 낙타 표기법(CamelCasing)을
따릅니다. `.Capabilities.APIVersions.Has` 와 같은 모든 코드에서 해당
표기법을 사용했습니다. 헬름 3에서는 이 패턴을 지키기 위해 `.Chart.ApiVersion`
을 `.Chart.APIVersion` 으로 변경했습니다.

## 설치

### 페도라(Fedora) 등의 다른 리눅스 배포판을 위한 네이티브 헬름 패키지는 왜 없나요?

헬름 프로젝트는 운영 체제 및 환경에 대한 패키지를 관리하지 않습니다.
헬름 커뮤니티는 네이티브 패키지를 제공할 수 있으며 헬름 프로젝트에서
알게 되면 목록에 포함될 것입니다. 이렇게 해서
홈브루 포뮬러(HomeBrew formula)가 시작되고 포함되었습니다.
패키지 관리에 관심이 있으시다면 감사하겠습니다.

### 왜 `curl ...|bash` 스크립트를 제공하나요?

저장소에 `curl ..|bash` 스크립트로 실행할 수 있는 스크립트(`scripts/get-helm-3`)가
있습니다. 전송은 모두 HTTPS에 의해 보호되며 스크립트는 가져오는 패키지에 대해 일부
감사를 수행합니다. 그러나 이 스크립트는 쉘 스크립트의 모든 일반적인 위험을
가지고 있습니다.

유용하기 때문에 제공하지만 사용자들이 먼저 대본을 주의 깊게
읽어보는 것이 좋습니다. 우리가 정말 원하는 것은 더 나은
패키지형 헬름 릴리스입니다.

### 헬름 클라이언트 파일들을 기본값 말고 다른 곳에 두려면 어떻게 하나요?

헬름은 파일을 보관할 때 XDG 구조를 사용합니다.
그 위치를 재정의(override)할 수 있는 환경변수를 사용할 수 있습니다.

- `$XDG_CACHE_HOME`: 캐시 파일 보관 장소를 다른 곳으로 설정
- `$XDG_CONFIG_HOME`: 헬름 설정 파일 보관 장소를 다른 곳으로
  설정
- `$XDG_DATA_HOME`: 헬름 데이터 보관 장소를 다른 곳으로 설정

기존 저장소가 있는 경우, `helm repo add...`를 사용하여 저장소를 다시 추가해야
합니다.


## 삭제

### 로컬 헬름을 삭제하고 싶어요. 그 파일들은 모두 어디에 있나요?

헬름은 `helm` 바이너리 파일과 함께 일부 파일을 다음 위치에 저장합니다.

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

다음 표에서는 OS 별로 각 항목에 대한 기본 폴더를 제공합니다.

| 운영 체제        | 캐시 경로                   | 설정 경로                        | 데이터 경로               |
|------------------|-----------------------------|----------------------------------|---------------------------|
| 리눅스           | `$HOME/.cache/helm `        | `$HOME/.config/helm `            | `$HOME/.local/share/helm` |
| 맥OS             | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `     |
| 윈도우           | `%TEMP%\helm  `             | `%APPDATA%\helm `                | `%APPDATA%\helm`          |

## 트러블슈팅

### "Unable to get an update from the "stable" chart repository"라는 경고가 표시됩니다.

`helm repo list` 를 실행합니다. `storage.googleapis.com` URL을 가리키고 있는 `stable` 저장소가 표시되면 해당 저장소를 업데이트해야 합니다.
2020년 11월 13일에 헬름 차트 저장소는 일년 간의 유예기간을 거친 후 [더 이상 지원되지 않습니다](https://github.com/helm/charts#deprecation-timeline).
아카이브를 `https://charts.helm.sh/stable` 에서 사용할 수 있지만 더 이상 업데이트를 받을 수 없습니다.

다음 명령을 실행하여 저장소를 수정할 수 있습니다.

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update
```

https://charts.helm.sh/incubator 에서 사용할 수 있는 아카이브가 있는 `incubator` 저장소도 마찬가지입니다.
다음 명령을 실행하여 고칠 수 있습니다.

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update
```

### 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.'라는 경고가 표시됩니다.

기존의 구글 헬름 차트 저장소가 새로운 헬름 차트 저장소로 대체되었습니다.

다음 명령을 실행하여 이 문제를 해결합니다.

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update
```

`incubator` 에 비슷한 오류가 발생한다면 다음 명령을 실행합니다.

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update
```

### 헬름 저장소를 추가하면 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'라는 오류가 표시됩니다.

헬름 차트 저장소는 [1년 동안의 유예기간](https://github.com/helm/charts#deprecation-timeline)이 지나면 더 이상 지원되지 않습니다.
해당 저장소의 아카이브는 `https://charts.helm.sh/stable` 및 `https://charts.helm.sh/incubator` 에서 사용할 수 있지만, 더 이상 업데이트되지 않습니다.
`--use-deprecated-repos` 를 지정하지 않으면 `helm repo add` 명령어로 기존 저장소의 URL을 추가할 수 없습니다.

### GKE (구글 컨테이너 엔진)에서 "현재 열려 있는 SSH 터널이 없습니다"라고 나와요

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

오류 메시지의 또 다른 변형판은 다음과 같습니다.


```
Unable to connect to the server: x509: certificate signed by unknown authority
```

해당 이슈는 로컬 쿠버네티스 설정 파일에 올바른 인증서가 있어야 한다는
것입니다.

GKE에 클러스터를 생성하면 SSL 인증서 및 인증 기관을 포함한
인증서가 제공됩니다. 이러한 파일은 `kubectl`과 `helm`이
접근할 수 있도록 쿠버네티스 설정 파일에 저장되어야
합니다(기본값: `~/.kube/config`).

### 헬름 2에서 마이그레이션한 후, `helm list`에는 릴리스들이 일부만 보여요(또는 안 보여요).

헬름 3는 이제 클러스터 네임스페이스를 사용하여 릴리스들을
구획한다는 사실을 깜빡하신 것 같습니다.
릴리스를 참조하는 모든 명령어는 다음 중 하나로 수행해야 합니다.

* 활성 쿠버네티스 컨텍스트의 현재 네임스페이스에 의존합니다
  (`kubectl config view --minify` 명령어로 확인).
* `--namespace`/`-n` 플래그를 사용하여 올바른 네임스페이스를 지정합니다.
* `helm list` 명령어에 대해서는 `--all-namespaces`/`-A` 플래그를 지정합니다.

이는 릴리스를 참조하는 `helm list`, `helm uninstall` 및
기타 모든 `helm` 명령어에 적용됩니다.


### 맥OS에서는 `/etc/.mdns_debug` 파일에 접근합니다. 왜 그런가요?

맥OS에서는 헬름이 `/etc/.mdns_debug`라는 파일에 접근하려고
하는 것으로 알려져 있습니다. 파일이 있는 경우, 헬름은 파일이 실행되는 동안
파일 핸들을 열어 둡니다.

이 문제는 맥OS의 MDNS 라이브러리로 인해 발생합니다.
디버깅 설정을 읽기 위해 MDNS 라이브러리를 로드하려고 시도합니다(활성화된 경우).
파일 핸들을 열지 말아야 하며, 이 문제는 애플(Apple)에도 보고되었습니다.
다만, 이러한 동작을 일으키는 것은 헬름이 아닌 맥OS입니다.

헬름이 이 파일을 로드하지 않도록 하려면 호스트 네트워크 스택을 사용하지 않는
정적 라이브러리로서 헬름을 컴파일하면 됩니다. 이렇게 하면 헬름의 바이너리 크기가
커지기는 하지만, 그 파일이 열리는 것은 막을 수 있습니다.

이 문제는 원래 잠재적인 보안 문제로 분류되기도 했습니다.
그러나 이후 이 동작으로 인한 결함이나 취약점은 없는 것으로 판명되었습니다.

### helm repo add가 동작한 후 실패합니다.

헬름 3.3.1 및 이전 버전에서 이미 존재하는 저장소(repo)를 추가하려고 하면
`helm repo add <reponame> <url>` 명령어를 실행해도 출력되는 내용은 없습니다.
`--no-update` 플래그를 사용하면 저장소가 이미 등록되어 있는 경우 오류를 발생시킵니다.

헬름 3.3.2 이상에서 기존 저장소를 추가하려고 하면 다음 오류가 발생합니다.

`Error: repository name (reponame) already exists, please specify a different name`

이제 기본 동작은 반대가 됩니다. `--no-update`는 이제 무시되며,
기존 저장소를 교체(덮어쓰기)하려면 `--force-update`를 사용할 수 있습니다.

이는 [헬름 3.3.2 릴리스 노트](https://github.com/helm/helm/releases/tag/v3.3.2)에서
설명된대로 보안 픽스에 따라 단절적 변경(breaking change)이 있었기 때문입니다.

### 쿠버네티스 클라이언트 로깅 활성화

[klog](https://pkg.go.dev/k8s.io/klog) 플래그를 사용하여 쿠버네티스 클라이언트를
디버깅하기 위한 로그 메시지를 출력할 수 있습니다. 대부분의 경우에는 `-v` 플래그를
사용하여 자세한 수준(verbosity level)으로 설정하는 것만으로도 충분합니다.

예시:

```
helm list -v 6
```
