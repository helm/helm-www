---
title: 헬름 2 이후의 변경사항
sidebar_position: 1
---

## 헬름 2 이후의 변경사항

다음은 헬름 3에서 도입된 모든 주요 변경사항에 대한 전체 목록이다.

### Tiller 제거

헬름 2 개발 주기 동안 Tiller가 도입되었다. Tiller는 공유 클러스터에서 
작업하는 팀에 중요한 역할을 했다 - 여러 운영자가 동일한 릴리스 세트와 
상호 작용할 수 있도록 해주었다.

쿠버네티스 1.6에서 역할 기반 접근 제어(RBAC)가 기본으로 활성화되면서, 
프로덕션 시나리오에서 Tiller를 잠그는 것이 관리하기 더 어려워졌다. 
가능한 보안 정책의 수가 방대하기 때문에, 우리의 입장은 허용적인 기본 
구성을 제공하는 것이었다. 이를 통해 처음 사용하는 사용자가 보안 제어에 
먼저 뛰어들지 않고도 헬름과 쿠버네티스를 실험해 볼 수 있었다. 
안타깝게도 이 허용적인 구성은 사용자에게 의도하지 않은 광범위한 
권한을 부여할 수 있었다. DevOps와 SRE는 멀티테넌트 클러스터에 
Tiller를 설치할 때 추가적인 운영 단계를 배워야 했다.

커뮤니티 구성원들이 특정 시나리오에서 헬름을 어떻게 사용하는지 들은 후, 
Tiller의 릴리스 관리 시스템이 상태를 유지하거나 헬름 릴리스 정보의 
중앙 허브 역할을 하기 위해 클러스터 내 운영자에 의존할 필요가 없다는 
것을 발견했다. 대신, 쿠버네티스 API 서버에서 정보를 가져오고, 
클라이언트 측에서 차트를 렌더링하고, 쿠버네티스에 설치 기록을 
저장하면 되었다.

Tiller의 주요 목표는 Tiller 없이도 달성할 수 있었으므로, 헬름 3에 
관한 첫 번째 결정 중 하나는 Tiller를 완전히 제거하는 것이었다.

Tiller가 사라지면서 헬름의 보안 모델이 근본적으로 단순해졌다. 
헬름 3는 이제 현대 쿠버네티스의 모든 보안, 신원 확인 및 권한 부여 
기능을 지원한다. 헬름의 권한은 [kubeconfig
파일](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)을 
사용하여 평가된다. 클러스터 관리자는 원하는 세분화 수준으로 
사용자 권한을 제한할 수 있다. 릴리스는 여전히 클러스터 내에 
기록되며, 헬름의 나머지 기능은 그대로 유지된다.

### 개선된 업그레이드 전략: 3-way 전략적 병합 패치

헬름 2는 2-way 전략적 병합 패치를 사용했다. 업그레이드 중에 가장 
최근 차트의 매니페스트와 제안된 차트의 매니페스트(`helm upgrade` 
중에 제공된 것)를 비교했다. 이 두 차트 간의 차이를 비교하여 
쿠버네티스의 리소스에 적용해야 할 변경 사항을 결정했다. 
대역 외에서 변경이 적용된 경우(예: `kubectl edit` 중에), 
해당 변경 사항은 고려되지 않았다. 이로 인해 리소스가 이전 상태로 
롤백할 수 없게 되었다: 헬름은 마지막으로 적용된 차트의 매니페스트만을 
현재 상태로 간주했기 때문에, 차트 상태에 변경이 없으면 라이브 
상태는 변경되지 않고 그대로 유지되었다.

헬름 3에서는 이제 3-way 전략적 병합 패치를 사용한다. 헬름은 
패치를 생성할 때 이전 매니페스트, 라이브 상태, 새 매니페스트를 
고려한다.

#### 예시

이 변경 사항이 영향을 미치는 몇 가지 일반적인 예시를 살펴보자.

##### 라이브 상태가 변경된 곳에서 롤백

팀이 방금 헬름을 사용하여 쿠버네티스의 프로덕션에 애플리케이션을 
배포했다. 차트에는 레플리카 수가 3으로 설정된 Deployment 객체가 
포함되어 있다:

```console
$ helm install myapp ./myapp
```

새 개발자가 팀에 합류한다. 프로덕션 클러스터를 관찰하던 첫날, 
끔찍한 커피-키보드-엎지름 사고가 발생하고 그들은 `kubectl scale`로 
프로덕션 deployment를 3개 레플리카에서 0개로 줄인다.

```console
$ kubectl scale --replicas=0 deployment/myapp
```

팀의 다른 개발자가 프로덕션 사이트가 다운된 것을 발견하고 
릴리스를 이전 상태로 롤백하기로 결정한다:

```console
$ helm rollback myapp
```

무슨 일이 일어날까?

헬름 2에서는 이전 매니페스트와 새 매니페스트를 비교하여 패치를 
생성했다. 이것은 롤백이기 때문에 동일한 매니페스트이다. 헬름은 
이전 매니페스트와 새 매니페스트 사이에 차이가 없기 때문에 변경할 
것이 없다고 판단했다. 레플리카 수는 계속 0으로 유지된다. 
큰 혼란에 빠진다.

헬름 3에서는 이전 매니페스트, 라이브 상태, 새 매니페스트를 
사용하여 패치를 생성한다. 헬름은 이전 상태가 3이었고, 라이브 
상태가 0이며, 새 매니페스트가 다시 3으로 변경하기를 원한다는 
것을 인식하므로, 상태를 다시 3으로 변경하는 패치를 생성한다.

##### 라이브 상태가 변경된 곳에서 업그레이드

많은 서비스 메시와 다른 컨트롤러 기반 애플리케이션은 쿠버네티스 
객체에 데이터를 주입한다. 이것은 사이드카, 레이블 또는 기타 정보일 
수 있다. 이전에 차트에서 렌더링된 다음 매니페스트가 있었다면:

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

그리고 라이브 상태가 다른 애플리케이션에 의해 다음과 같이 
수정되었다면:

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

이제 `nginx` 이미지 태그를 `2.1.0`으로 업그레이드하려고 한다. 
따라서 다음 매니페스트가 있는 차트로 업그레이드한다:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

무슨 일이 일어날까?

헬름 2에서 헬름은 이전 매니페스트와 새 매니페스트 사이의 
`containers` 객체 패치를 생성한다. 패치 생성 중에 클러스터의 
라이브 상태는 고려되지 않는다.

클러스터의 라이브 상태는 다음과 같이 수정된다:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

사이드카 파드가 라이브 상태에서 제거된다. 더 큰 혼란에 빠진다.

헬름 3에서 헬름은 이전 매니페스트, 라이브 상태, 새 매니페스트 
사이의 `containers` 객체 패치를 생성한다. 새 매니페스트가 
이미지 태그를 `2.1.0`으로 변경하지만, 라이브 상태에는 사이드카 
컨테이너가 포함되어 있다는 것을 인식한다.

클러스터의 라이브 상태는 다음과 같이 수정된다:

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

### 릴리스 이름이 이제 네임스페이스 범위로 지정됨

Tiller가 제거되면서 각 릴리스에 대한 정보를 어딘가에 저장해야 했다. 
헬름 2에서는 Tiller와 동일한 네임스페이스에 저장되었다. 
실제로 이는 릴리스에서 이름이 사용되면 다른 네임스페이스에 
배포되더라도 다른 릴리스가 동일한 이름을 사용할 수 없음을 의미했다.

헬름 3에서는 특정 릴리스에 대한 정보가 이제 릴리스 자체와 동일한 
네임스페이스에 저장된다. 이는 사용자가 이제 두 개의 별도 
네임스페이스에서 `helm install wordpress stable/wordpress`를 
실행할 수 있으며, 현재 네임스페이스 컨텍스트를 변경하여 
`helm list`로 각각을 참조할 수 있음을 의미한다 
(예: `helm list --namespace foo`).

네이티브 클러스터 네임스페이스와의 이러한 더 큰 정렬로 인해 
`helm list` 명령은 더 이상 기본적으로 모든 릴리스를 나열하지 
않는다. 대신 현재 쿠버네티스 컨텍스트의 네임스페이스에 있는 
릴리스만 나열한다(즉, `kubectl config view --minify`를 
실행할 때 표시되는 네임스페이스). 또한 헬름 2와 유사한 동작을 
얻으려면 `helm list`에 `--all-namespaces` 플래그를 
제공해야 한다.

### 기본 스토리지 드라이버로 Secrets 사용

헬름 3에서는 이제 Secrets이 [기본 스토리지
드라이버](/topics/advanced.md#storage-backends)로 사용된다. 
헬름 2는 기본적으로 릴리스 정보를 저장하기 위해 ConfigMaps를 
사용했다. 헬름 2.7.0에서 릴리스 정보를 저장하기 위해 Secrets를 
사용하는 새로운 스토리지 백엔드가 구현되었으며, 이제 헬름 3에서 
기본값이 되었다.

헬름 3 기본값으로 Secrets로 변경하면 쿠버네티스의 Secret 암호화 
릴리스와 함께 차트를 보호하는 추가 보안이 가능해진다.

[저장 시 secrets 
암호화](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)는 
쿠버네티스 1.7에서 알파 기능으로 사용 가능해졌으며 쿠버네티스 
1.13에서 안정화되었다. 이를 통해 사용자는 저장 시 헬름 릴리스 
메타데이터를 암호화할 수 있으므로, 나중에 Vault와 같은 것을 
사용하도록 확장할 수 있는 좋은 시작점이다.

### Go import 경로 변경

헬름 3에서 헬름은 Go import 경로를 `k8s.io/helm`에서 
`helm.sh/helm/v3`로 전환했다. 헬름 3 Go 클라이언트 라이브러리로 
업그레이드하려는 경우 import 경로를 변경해야 한다.

### Capabilities

렌더링 단계에서 사용할 수 있는 `.Capabilities` 내장 객체가 
단순화되었다.

[내장 객체](/chart_template_guide/builtin_objects.md)

### JSONSchema를 사용한 차트 값 검증

이제 차트 값에 JSON Schema를 적용할 수 있다. 이를 통해 사용자가 
제공한 값이 차트 관리자가 설정한 스키마를 따르도록 보장하여, 
사용자가 차트에 잘못된 값 세트를 제공할 때 더 나은 오류 보고를 
제공한다.

검증은 다음 명령어가 호출될 때 발생한다:

* `helm install`
* `helm upgrade`
* `helm template`
* `helm lint`

자세한 정보는 [스키마 파일](/topics/charts.md#schema-files) 
문서를 참조하라.

### `requirements.yaml`을 `Chart.yaml`로 통합

차트 의존성 관리 시스템이 requirements.yaml 및 requirements.lock에서 
Chart.yaml 및 Chart.lock으로 이동했다. 헬름 3용 새 차트는 
새 형식을 사용하는 것이 좋다. 그러나 헬름 3는 여전히 Chart API 
버전 1(`v1`)을 이해하고 기존 `requirements.yaml` 파일을 로드한다.

헬름 2에서 `requirements.yaml`은 다음과 같았다:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

헬름 3에서 의존성은 동일한 방식으로 표현되지만, 이제 
`Chart.yaml`에서 표현된다:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

차트는 여전히 `charts/` 디렉토리에 다운로드되고 배치되므로, 
`charts/` 디렉토리에 벤더링된 서브차트는 수정 없이 계속 작동한다.

### 설치 시 이름(또는 --generate-name) 필수

헬름 2에서는 이름이 제공되지 않으면 자동 생성된 이름이 부여되었다. 
프로덕션에서 이것은 유용한 기능이라기보다는 골칫거리로 판명되었다. 
헬름 3에서 `helm install`에 이름이 제공되지 않으면 헬름은 오류를 
발생시킨다.

여전히 자동으로 이름이 생성되기를 원하는 사람들은 `--generate-name` 
플래그를 사용하여 생성할 수 있다.

### OCI 레지스트리에 차트 푸시

이것은 헬름 3에서 도입된 실험적 기능이다. 사용하려면 환경 변수 
`HELM_EXPERIMENTAL_OCI=1`을 설정한다.

높은 수준에서 차트 리포지토리는 차트를 저장하고 공유할 수 있는 
장소이다. 헬름 클라이언트는 헬름 차트를 패키징하여 차트 
리포지토리로 전송한다. 간단히 말해, 차트 리포지토리는 index.yaml 
파일과 일부 패키지된 차트를 호스팅하는 기본 HTTP 서버이다.

차트 리포지토리 API가 가장 기본적인 스토리지 요구 사항을 
충족하는 데는 여러 이점이 있지만, 몇 가지 단점이 나타나기 시작했다:

- 차트 리포지토리는 프로덕션 환경에서 필요한 대부분의 보안 구현을 
  추상화하기가 매우 어렵다. 프로덕션 시나리오에서 인증 및 권한 
  부여를 위한 표준 API를 갖는 것이 매우 중요하다.
- 차트의 무결성과 출처를 서명하고 확인하는 데 사용되는 헬름의 
  차트 출처 도구는 차트 게시 프로세스의 선택적 부분이다.
- 멀티테넌트 시나리오에서 동일한 차트가 다른 테넌트에 의해 
  업로드될 수 있어 동일한 콘텐츠를 저장하는 데 두 배의 스토리지 
  비용이 든다. 이를 처리하도록 설계된 더 스마트한 차트 
  리포지토리가 있지만 공식 사양의 일부는 아니다.
- 검색, 메타데이터 정보 및 차트 가져오기에 단일 인덱스 파일을 
  사용하면 안전한 멀티테넌트 구현에서 설계하기 어렵거나 투박해진다.

Docker의 Distribution 프로젝트(Docker Registry v2라고도 함)는 
Docker Registry 프로젝트의 후속작이다. 많은 주요 클라우드 공급업체가 
Distribution 프로젝트의 제품을 제공하고 있으며, 많은 공급업체가 
동일한 제품을 제공함에 따라 Distribution 프로젝트는 수년간의 
강화, 보안 모범 사례 및 실전 테스트의 혜택을 받았다.

차트를 패키징하고 Docker 레지스트리에 푸시하는 방법에 대한 자세한 
정보는 `helm help chart` 및 `helm help registry`를 참조하라.

자세한 정보는 [이 페이지](/topics/registries.md)를 참조하라.

### `helm serve` 제거

`helm serve`는 개발 목적으로 로컬 차트 리포지토리를 머신에서 
실행했다. 그러나 개발 도구로서 많은 채택을 받지 못했고 설계에 
수많은 문제가 있었다. 결국 우리는 이를 제거하고 플러그인으로 
분리하기로 결정했다.

`helm serve`와 유사한 경험을 위해 
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)의 
로컬 파일 시스템 스토리지 옵션과 
[servecm 플러그인](https://github.com/jdolitsky/helm-servecm)을 
살펴보라.


### 라이브러리 차트 지원

헬름 3는 "라이브러리 차트"라는 차트 클래스를 지원한다. 이것은 
다른 차트에서 공유되지만 자체 릴리스 아티팩트를 생성하지 않는 
차트이다. 라이브러리 차트의 템플릿은 `define` 요소만 선언할 수 
있다. 전역 범위의 비-`define` 콘텐츠는 단순히 무시된다. 
이를 통해 사용자는 많은 차트에서 재사용할 수 있는 코드 스니펫을 
재사용하고 공유하여 중복을 피하고 차트를 
[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)하게 
유지할 수 있다.

라이브러리 차트는 Chart.yaml의 dependencies 지시문에서 선언되며, 
다른 차트와 마찬가지로 설치 및 관리된다.

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

우리는 이 기능이 차트 개발자에게 열어주는 사용 사례와 라이브러리 
차트를 사용함으로써 발생하는 모범 사례를 보게 되어 매우 기쁘다.

### Chart.yaml apiVersion 증가

라이브러리 차트 지원의 도입과 requirements.yaml의 Chart.yaml로의 
통합으로, 헬름 2의 패키지 형식을 이해하는 클라이언트는 이러한 
새로운 기능을 이해하지 못할 것이다. 그래서 Chart.yaml의 
apiVersion을 `v1`에서 `v2`로 증가시켰다.

`helm create`는 이제 이 새로운 형식을 사용하여 차트를 생성하므로, 
기본 apiVersion도 거기서 증가되었다.

두 버전의 헬름 차트를 모두 지원하려는 클라이언트는 패키지 형식을 
구문 분석하는 방법을 이해하기 위해 Chart.yaml의 `apiVersion` 
필드를 검사해야 한다.

### XDG 기본 디렉토리 지원

[XDG 기본 디렉토리 
사양](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)은 
구성, 데이터 및 캐시 파일이 파일 시스템에 저장되어야 하는 위치를 
정의하는 이식 가능한 표준이다.

헬름 2에서 헬름은 이 모든 정보를 `~/.helm`(애칭으로 `helm home`으로 
알려진)에 저장했으며, `$HELM_HOME` 환경 변수를 설정하거나 전역 
플래그 `--home`을 사용하여 변경할 수 있었다.

헬름 3에서 헬름은 이제 XDG 기본 디렉토리 사양에 따라 다음 환경 
변수를 존중한다:

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

헬름 플러그인은 `$HELM_HOME`을 스크래치패드 환경으로 사용하려는 
플러그인과의 하위 호환성을 위해 `$XDG_DATA_HOME`의 별칭으로 
여전히 `$HELM_HOME`을 전달받는다.

이 변경을 수용하기 위해 플러그인 환경에 여러 새로운 환경 변수도 
전달된다:

- 캐시 경로를 위한 `$HELM_PATH_CACHE`
- 구성 경로를 위한 `$HELM_PATH_CONFIG`
- 데이터 경로를 위한 `$HELM_PATH_DATA`

헬름 3를 지원하려는 헬름 플러그인은 이러한 새로운 환경 변수를 
대신 사용하는 것을 고려해야 한다.

### CLI 명령어 이름 변경

다른 패키지 관리자의 용어와 더 잘 맞추기 위해 `helm delete`가 
`helm uninstall`로 이름이 변경되었다. `helm delete`는 여전히 
`helm uninstall`의 별칭으로 유지되므로 어느 형태든 사용할 수 있다.

헬름 2에서 릴리스 원장을 제거하려면 `--purge` 플래그를 제공해야 
했다. 이 기능은 이제 기본적으로 활성화되어 있다. 이전 동작을 
유지하려면 `helm uninstall --keep-history`를 사용하라.

추가로 동일한 규칙을 수용하기 위해 여러 다른 명령어의 이름이 
변경되었다:

- `helm inspect` -> `helm show`
- `helm fetch` -> `helm pull`

이러한 명령어들도 이전 동사를 별칭으로 유지하므로 어느 형태로든 
계속 사용할 수 있다.

### 자동 네임스페이스 생성

존재하지 않는 네임스페이스에 릴리스를 생성할 때, 헬름 2는 
네임스페이스를 생성했다. 헬름 3는 다른 쿠버네티스 도구의 동작을 
따르며 네임스페이스가 존재하지 않으면 오류를 반환한다. 
`--create-namespace` 플래그를 명시적으로 지정하면 헬름 3가 
네임스페이스를 생성한다.

### .Chart.ApiVersion은 어떻게 되었나?

헬름은 약어를 대문자로 표기하는 일반적인 CamelCasing 규칙을 
따른다. 우리는 `.Capabilities.APIVersions.Has`와 같이 코드의 
다른 곳에서도 이 작업을 수행했다. 헬름 v3에서 우리는 
`.Chart.ApiVersion`을 이 패턴을 따르도록 수정하여 
`.Chart.APIVersion`으로 이름을 변경했다.
