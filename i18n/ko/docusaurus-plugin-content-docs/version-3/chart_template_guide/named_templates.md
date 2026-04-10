---
title: 네임드 템플릿
description: 네임드 템플릿을 정의하는 방법
sidebar_position: 9
---

이제 하나의 템플릿을 넘어 여러 템플릿을 만들어 볼 차례이다. 이 섹션에서는
한 파일에서 _네임드 템플릿_을 정의하고 다른 곳에서 사용하는 방법을 알아본다.
_네임드 템플릿_(때때로 _partial_ 또는 _subtemplate_이라고도 함)은 단순히
파일 내에 정의되어 이름이 부여된 템플릿이다.
템플릿을 만드는 두 가지 방법과 사용하는 여러 방법을 살펴보겠다.

[흐름 제어](./control_structures.md) 섹션에서 템플릿을 선언하고 관리하기
위한 세 가지 액션 `define`, `template`, `block`을 소개했다. 이 섹션에서는
이 세 가지 액션을 다루고, `template` 액션과 유사하게 작동하는 특수 목적의
`include` 함수도 소개한다.

템플릿 이름을 지정할 때 염두에 두어야 할 중요한 사항: **템플릿 이름은
전역적이다**. 동일한 이름으로 두 개의 템플릿을 선언하면 마지막에 로드된
것이 사용된다. 서브차트의 템플릿은 최상위 템플릿과 함께 컴파일되므로
_차트별 고유 이름_으로 템플릿 이름을 지정해야 한다.

일반적인 명명 규칙은 정의된 각 템플릿 앞에 차트 이름을 접두사로 붙이는 것이다:
`{{ define "mychart.labels" }}`. 특정 차트 이름을 접두사로 사용하면
동일한 이름의 템플릿을 구현하는 서로 다른 두 차트로 인해 발생할 수 있는
충돌을 피할 수 있다.

이 동작은 차트의 다른 버전에도 적용된다. 한 가지 방식으로 템플릿을 정의한
`mychart` 버전 `1.0.0`이 있고, 기존 네임드 템플릿을 수정하는 `mychart`
버전 `2.0.0`이 있다면 마지막에 로드된 것이 사용된다. 차트 이름에 버전을
추가하여 이 문제를 해결할 수 있다: `{{ define "mychart.v1.labels" }}`와
`{{ define "mychart.v2.labels" }}`.

## Partial과 `_` 파일

지금까지 하나의 파일을 사용했고, 그 파일에는 단일 템플릿이 포함되어 있었다.
하지만 Helm의 템플릿 언어를 사용하면 다른 곳에서 이름으로 접근할 수 있는
네임드 임베디드 템플릿을 만들 수 있다.

템플릿 작성의 핵심에 들어가기 전에, 언급할 가치가 있는 파일 명명 규칙이 있다:

* `templates/`에 있는 대부분의 파일은 Kubernetes 매니페스트를 포함하는 것으로 취급된다
* `NOTES.txt`는 예외이다
* 그러나 이름이 밑줄(`_`)로 시작하는 파일은 내부에 매니페스트가 _없는_ 것으로
  간주된다. 이 파일들은 Kubernetes 오브젝트 정의로 렌더링되지 않지만,
  다른 차트 템플릿 어디서나 사용할 수 있다.

이 파일들은 partial과 helper를 저장하는 데 사용된다. 실제로 처음
`mychart`를 만들 때 `_helpers.tpl`이라는 파일을 보았다. 이 파일은
템플릿 partial의 기본 위치이다.

## `define`과 `template`으로 템플릿 선언 및 사용하기

`define` 액션을 사용하면 템플릿 파일 내에 네임드 템플릿을 만들 수 있다.
문법은 다음과 같다:

```yaml
{{- define "MY.NAME" }}
  # body of template here
{{- end }}
```

예를 들어, Kubernetes 레이블 블록을 캡슐화하는 템플릿을 정의할 수 있다:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

이제 이 템플릿을 기존 ConfigMap에 포함시키고 `template` 액션으로
포함할 수 있다:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

템플릿 엔진이 이 파일을 읽으면 `template "mychart.labels"`가 호출될 때까지
`mychart.labels` 참조를 저장한다. 그런 다음 해당 템플릿을 인라인으로
렌더링한다. 결과는 다음과 같다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: running-panda-configmap
  labels:
    generator: helm
    date: 2016-11-02
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

참고: `define`은 이 예제처럼 template으로 호출되지 않으면 출력을 생성하지 않는다.

일반적으로 Helm 차트는 이러한 템플릿을 partial 파일, 보통 `_helpers.tpl`에 넣는다.
이 함수를 그곳으로 옮겨 보자:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

관례상, `define` 함수에는 기능을 설명하는 간단한 문서화 블록
(`{{/* ... */}}`)이 있어야 한다.

이 정의가 `_helpers.tpl`에 있더라도 `configmap.yaml`에서 여전히
접근할 수 있다:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

위에서 언급했듯이, **템플릿 이름은 전역적이다**. 결과적으로 동일한 이름으로
두 개의 템플릿이 선언되면 마지막 것이 사용된다. 서브차트의 템플릿은
최상위 템플릿과 함께 컴파일되므로 _차트별 고유 이름_으로 템플릿 이름을
지정하는 것이 좋다. 일반적인 명명 규칙은 정의된 각 템플릿 앞에 차트
이름을 접두사로 붙이는 것이다: `{{ define "mychart.labels" }}`.

## 템플릿 스코프 설정하기

위에서 정의한 템플릿에서는 어떤 오브젝트도 사용하지 않았다.
함수만 사용했다. 차트 이름과 차트 버전을 포함하도록 정의된 템플릿을
수정해 보자:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```

이것을 렌더링하면 다음과 같은 오류가 발생한다:

```console
$ helm install --dry-run moldy-jaguar ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [unknown object type "nil" in ConfigMap.metadata.labels.chart, unknown object type "nil" in ConfigMap.metadata.labels.version]
```

렌더링 결과를 보려면 `--disable-openapi-validation`과 함께 다시 실행한다:
`helm install --dry-run --disable-openapi-validation moldy-jaguar ./mychart`.
결과는 예상한 것과 다르다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: moldy-jaguar-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart:
    version:
```

이름과 버전은 어떻게 되었을까? 정의된 템플릿의 스코프에 포함되지
않았다. 네임드 템플릿(`define`으로 생성된)이 렌더링될 때,
`template` 호출에서 전달된 스코프를 받는다. 예제에서는
다음과 같이 템플릿을 포함했다:

```yaml
{{- template "mychart.labels" }}
```

스코프가 전달되지 않았으므로 템플릿 내에서 `.`의 어떤 것도 접근할 수 없다.
하지만 이것은 쉽게 수정할 수 있다. 템플릿에 스코프를 전달하면 된다:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
```

`template` 호출 끝에 `.`를 전달했다. `.Values`나 `.Values.favorite` 또는
원하는 스코프를 쉽게 전달할 수 있다. 하지만 우리가 원하는 것은
최상위 스코프이다. 네임드 템플릿의 컨텍스트에서 `$`는 전역 스코프가
아니라 전달한 스코프를 참조한다.

이제 `helm install --dry-run --debug plinking-anaco ./mychart`로
이 템플릿을 실행하면 다음을 얻는다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: plinking-anaco-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart: mychart
    version: 0.1.0
```

이제 `{{ .Chart.Name }}`은 `mychart`로, `{{ .Chart.Version }}`은
`0.1.0`으로 해석된다.

## `include` 함수

다음과 같은 간단한 템플릿을 정의했다고 가정해 보자:

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}
```

이제 이것을 템플릿의 `labels:` 섹션과 `data:` 섹션 모두에
삽입하고 싶다고 가정해 보자:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{ template "mychart.app" . }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ template "mychart.app" . }}
```

이것을 렌더링하면 다음과 같은 오류가 발생한다:

```console
$ helm install --dry-run measly-whippet ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [ValidationError(ConfigMap): unknown field "app_name" in io.k8s.api.core.v1.ConfigMap, ValidationError(ConfigMap): unknown field "app_version" in io.k8s.api.core.v1.ConfigMap]
```

렌더링 결과를 보려면 `--disable-openapi-validation`과 함께 다시 실행한다:
`helm install --dry-run --disable-openapi-validation measly-whippet ./mychart`.
출력은 예상한 것과 다르다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: measly-whippet-configmap
  labels:
    app_name: mychart
app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
app_name: mychart
app_version: "0.1.0"
```

`app_version`의 들여쓰기가 두 곳 모두에서 잘못되어 있다. 왜일까?
대체되는 템플릿의 텍스트가 왼쪽 정렬되어 있기 때문이다. `template`은
액션이며 함수가 아니기 때문에 `template` 호출의 출력을 다른 함수에
전달할 방법이 없다. 데이터는 단순히 인라인으로 삽입된다.

이 경우를 해결하기 위해, Helm은 `template`의 대안으로 템플릿의 내용을
현재 파이프라인으로 가져와서 파이프라인의 다른 함수에 전달할 수 있게
해주는 `include`를 제공한다.

다음은 위의 예제를 `indent`를 사용하여 `mychart.app` 템플릿을
올바르게 들여쓰기하도록 수정한 것이다:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
{{ include "mychart.app" . | indent 4 }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ include "mychart.app" . | indent 2 }}
```

이제 생성된 YAML은 각 섹션에 대해 올바르게 들여쓰기된다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-mole-configmap
  labels:
    app_name: mychart
    app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
  app_name: mychart
  app_version: "0.1.0"
```

> Helm 템플릿에서 `template`보다 `include`를 사용하는 것이 선호된다.
> 단순히 YAML 문서에 대한 출력 포맷팅을 더 잘 처리할 수 있기 때문이다.

때로는 컨텐츠를 템플릿이 아닌 그대로 가져오고 싶을 때가 있다.
즉, 파일을 있는 그대로 가져오고 싶은 경우이다. 다음 섹션에서 설명하는
`.Files` 오브젝트를 통해 파일에 접근하면 이를 달성할 수 있다.
