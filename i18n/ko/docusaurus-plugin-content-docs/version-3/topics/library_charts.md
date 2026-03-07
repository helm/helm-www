---
title: 라이브러리 차트
description: 라이브러리 차트의 개념과 사용 예제를 설명합니다
sidebar_position: 4
---

라이브러리 차트는 [Helm 차트](/topics/charts.md)의 한 유형으로,
다른 차트의 Helm 템플릿에서 공유할 수 있는 차트 기본 요소나 정의를 제공합니다.
이를 통해 사용자는 여러 차트에서 재사용할 수 있는 코드 조각을 공유하고,
반복을 피하며 차트를 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)하게
유지할 수 있습니다.

라이브러리 차트는 Helm 2부터 차트 관리자들이 사용해온 공용 또는 헬퍼 차트를
공식적으로 인정하기 위해 Helm 3에서 도입되었습니다.
차트 유형으로 포함함으로써 다음과 같은 기능을 제공합니다:
- 공용 차트와 애플리케이션 차트를 명확하게 구분하는 수단
- 공용 차트의 설치를 방지하는 로직
- 릴리스 아티팩트를 포함할 수 있는 공용 차트의 템플릿 렌더링 방지
- 의존하는 차트가 가져오는 쪽의 컨텍스트를 사용할 수 있도록 허용

차트 관리자는 공용 차트를 라이브러리 차트로 정의하면
Helm이 표준화되고 일관된 방식으로 해당 차트를 처리할 것이라고 확신할 수 있습니다.
또한 차트 유형을 변경하여 애플리케이션 차트의 정의를 공유할 수 있습니다.

## 간단한 라이브러리 차트 만들기

앞서 언급했듯이, 라이브러리 차트는 [Helm 차트](/topics/charts.md)의 한 유형입니다.
따라서 스캐폴드 차트를 생성하는 것부터 시작할 수 있습니다:

```console
$ helm create mylibchart
Creating mylibchart
```

먼저 `templates` 디렉토리의 모든 파일을 삭제합니다.
이 예제에서는 직접 템플릿 정의를 만들 것입니다.

```console
$ rm -rf mylibchart/templates/*
```

values 파일도 필요하지 않습니다.

```console
$ rm -f mylibchart/values.yaml
```

공용 코드를 작성하기 전에, 관련된 Helm 개념을 간단히 살펴보겠습니다.
[이름이 지정된 템플릿](/chart_template_guide/named_templates.md)(partial 또는
subtemplate이라고도 함)은 파일 내에 정의되고 이름이 부여된 템플릿입니다.
`templates/` 디렉토리에서 밑줄(_)로 시작하는 파일은 Kubernetes 매니페스트 파일을
출력하지 않습니다. 따라서 관례적으로 헬퍼 템플릿과 partial은
`_*.tpl` 또는 `_*.yaml` 파일에 배치합니다.

이 예제에서는 빈 ConfigMap 리소스를 생성하는 공용 ConfigMap을 작성합니다.
공용 ConfigMap은 `mylibchart/templates/_configmap.yaml` 파일에 다음과 같이 정의합니다:

```yaml
{{- define "mylibchart.configmap.tpl" -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data: {}
{{- end -}}
{{- define "mylibchart.configmap" -}}
{{- include "mylibchart.util.merge" (append . "mylibchart.configmap.tpl") -}}
{{- end -}}
```

ConfigMap 구조는 `mylibchart.configmap.tpl`이라는 이름이 지정된 템플릿에 정의됩니다.
빈 리소스 `data`를 가진 간단한 ConfigMap입니다. 이 파일에는
`mylibchart.configmap`이라는 또 다른 이름이 지정된 템플릿이 있습니다.
이 템플릿은 `mylibchart.util.merge`라는 또 다른 이름이 지정된 템플릿을 포함하며,
`mylibchart.configmap`을 호출하는 템플릿과 `mylibchart.configmap.tpl`이라는
두 개의 이름이 지정된 템플릿을 인수로 받습니다.

헬퍼 함수 `mylibchart.util.merge`는 `mylibchart/templates/_util.yaml`에 있는
이름이 지정된 템플릿입니다. 이것은 [공용 Helm 헬퍼 차트](#공용-helm-헬퍼-차트)에서
가져온 유용한 유틸리티로, 두 템플릿을 병합하고 공통 부분을 덮어씁니다:

```yaml
{{- /*
mylibchart.util.merge will merge two YAML templates and output the result.
This takes an array of three values:
- the top context
- the template name of the overrides (destination)
- the template name of the base (source)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

차트가 자체 설정으로 사용자 정의해야 하는 공용 코드를 사용하려는 경우에 이것이 중요합니다.

마지막으로 차트 유형을 `library`로 변경합니다.
`mylibchart/Chart.yaml`을 다음과 같이 편집합니다:

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
# type: application
type: library

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
version: 0.1.0

# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application and it is recommended to use it with quotes.
appVersion: "1.16.0"
```

이제 라이브러리 차트를 공유할 준비가 되었으며, ConfigMap 정의를 재사용할 수 있습니다.

계속 진행하기 전에, Helm이 해당 차트를 라이브러리 차트로 인식하는지 확인해 볼 가치가 있습니다:

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## 간단한 라이브러리 차트 사용하기

이제 라이브러리 차트를 사용할 차례입니다. 다시 스캐폴드 차트를 생성합니다:

```console
$ helm create mychart
Creating mychart
```

ConfigMap만 생성할 것이므로 템플릿 파일들을 다시 정리합니다:

```console
$ rm -rf mychart/templates/*
```

Helm 템플릿에서 간단한 ConfigMap을 생성하려면 다음과 비슷한 형태가 됩니다:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

그러나 우리는 `mylibchart`에 이미 작성된 공용 코드를 재사용할 것입니다.
ConfigMap은 `mychart/templates/configmap.yaml` 파일에 다음과 같이 생성할 수 있습니다:

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

ConfigMap의 표준 속성을 추가하는 공용 ConfigMap 정의를 상속받아
작업을 단순화한 것을 볼 수 있습니다. 우리의 템플릿에서는 설정만 추가합니다.
이 경우 데이터 키 `myvalue`와 그 값입니다. 이 설정은 공용 ConfigMap의 빈 리소스를
덮어씁니다. 이것은 이전 섹션에서 언급한 헬퍼 함수 `mylibchart.util.merge` 덕분에 가능합니다.

공용 코드를 사용하려면 `mylibchart`를 의존성으로 추가해야 합니다.
`mychart/Chart.yaml` 파일 끝에 다음을 추가합니다:

```yaml
# My common code in my library chart
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

이것은 애플리케이션 차트와 동일한 상위 경로에 있는 파일 시스템에서
라이브러리 차트를 동적 의존성으로 포함합니다. 라이브러리 차트를 동적 의존성으로 포함하므로
`helm dependency update`를 실행해야 합니다. 이 명령은 라이브러리 차트를
`charts/` 디렉토리로 복사합니다.

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

이제 차트를 배포할 준비가 되었습니다. 설치하기 전에 먼저 렌더링된 템플릿을 확인해 보는 것이 좋습니다.

```console
$ helm install mydemo mychart/ --debug --dry-run
install.go:159: [debug] Original chart version: ""
install.go:176: [debug] CHART PATH: /root/test/helm-charts/mychart

NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:48:47 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
mylibchart:
  global: {}
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  annotations: {}
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
```

원하는 대로 `myvalue: Hello World` 데이터가 덮어씌워진 ConfigMap처럼 보입니다. 설치해 봅시다:

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

릴리스를 조회하여 실제 템플릿이 로드되었는지 확인할 수 있습니다.

```console
$ helm get manifest mydemo
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
  ```

## 라이브러리 차트의 장점

라이브러리 차트는 독립 실행형 차트로 동작할 수 없기 때문에 다음과 같은 기능을 활용할 수 있습니다:
- `.Files` 객체는 라이브러리 차트의 로컬 경로가 아닌 부모 차트의 파일 경로를 참조합니다
- `.Values` 객체는 부모 차트와 동일합니다. 이는 부모의 헤더 아래에 설정된
  값 섹션을 받는 애플리케이션 [서브차트](/chart_template_guide/subcharts_and_globals.md)와 대조됩니다


## 공용 Helm 헬퍼 차트

```markdown
참고: GitHub의 공용 Helm 헬퍼 차트 리포지토리는 더 이상 적극적으로 유지 관리되지 않으며, 해당 리포지토리는 더 이상 사용되지 않고 보관되었습니다.
```

이 [차트](https://github.com/helm/charts/tree/master/incubator/common)는
공용 차트의 원래 패턴이었습니다. Kubernetes 차트 개발의 모범 사례를 반영하는
유틸리티를 제공합니다. 무엇보다도 차트를 개발할 때 바로 사용하여 편리한 공유 코드를
활용할 수 있습니다.

다음은 이를 사용하는 빠른 방법입니다. 자세한 내용은
[README](https://github.com/helm/charts/blob/master/incubator/common/README.md)를 참조하세요.

다시 스캐폴드 차트를 생성합니다:

```console
$ helm create demo
Creating demo
```

헬퍼 차트의 공용 코드를 사용해 봅시다. 먼저 deployment
`demo/templates/deployment.yaml`을 다음과 같이 편집합니다:

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Define overrides for your Deployment resource here, e.g.
apiVersion: apps/v1
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "demo.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "demo.selectorLabels" . | nindent 8 }}

{{- end -}}
```

그리고 service 파일 `demo/templates/service.yaml`을 다음과 같이 편집합니다:

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Define overrides for your Service resource here, e.g.
# metadata:
#   labels:
#     custom: label
# spec:
#   ports:
#   - port: 8080
{{- end -}}
```

이 템플릿들은 헬퍼 차트의 공용 코드를 상속받아
리소스의 설정 또는 사용자 정의만으로 코딩을 단순화하는 방법을 보여줍니다.

공용 코드를 사용하려면 `common`을 의존성으로 추가해야 합니다.
`demo/Chart.yaml` 파일 끝에 다음을 추가합니다:

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

참고: Helm 리포지토리 목록에 `incubator` 리포지토리를 추가해야 합니다
(`helm repo add`).

차트를 동적 의존성으로 포함하므로 `helm dependency update`를 실행해야 합니다.
이 명령은 헬퍼 차트를 `charts/` 디렉토리로 복사합니다.

헬퍼 차트가 일부 Helm 2 구조를 사용하므로, Helm 3 스캐폴드 차트에서 업데이트된
`nginx` 이미지를 로드하려면 `demo/values.yaml`에 다음을 추가해야 합니다:

```yaml
image:
  tag: 1.16.0
```

`helm lint`와 `helm template` 명령을 사용하여 배포 전에 차트 템플릿이 올바른지 테스트할 수 있습니다.

문제가 없다면 `helm install`을 사용하여 배포하세요!
