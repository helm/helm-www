---
title: "템플릿"
description: "템플릿에 관한 모범사례 들여다보기"
weight: 3
---

이 부분은 모범사례 가이드의 일부로서 템플릿을 자세히 알아본다.

## `templates/`의 구조

`templates/` 디렉토리는 다음과 같이 구성되어야 한다.

- 템플릿 파일은 YAML 출력을 생성하는 경우, `.yaml` 확장자를 가져야 한다.
  확장자 `.tpl` 은 형식화된 콘텐츠를 생성하지 않는 템플릿 파일에서 
  사용할 수 있다.
- 템플릿 파일 이름은 카멜 케이스가 아닌 점선 표기법(`my-example-configmap.yaml`) 을 
  사용해야 한다.
- 각 리소스 정의는 자체 템플릿 파일에 있어야 한다.
- 템플릿 파일 이름은 이름에 리소스 종류를 반영해야 한다.
  예: `foo-pod.yaml`, `bar-svc.yaml`

## 정의된 템플릿의 이름

정의된 템플릿 (`{{ define }} ` 지시문 안에서 생성된 템플릿)은 전역적으로 액세스 
할 수 있다. 즉, 차트와 모든 하위 차트는 `{{ define }}` 로 만든 모든 템플릿에 액세스
할 수 있다. 

따라서 _정의된 모든 템플릿 이름은 네임스페이스가 지정되어야 한다._

올바른 경우:

```yaml
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}
```

올바르지 못한 경우:

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}
```
이 모범 사례에 따라 템플릿 이름이 자동으로 정의되므로 `helm create` 명령을 통해
새 차트를 만드는 것이 좋다.

## 템플릿 형식

템플릿은 _2개의 공백_ (탭 사용 안함)을 사용하여 들여쓰기 해야한다.

탬플릿 지시문은 여는 중괄호 뒤와 닫는 중괄호 앞에 공백이 
있어야 한다.

올바른 경우:
```
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}
```

올바르지 못한 경우:
```
{{.foo}}
{{print "foo"}}
{{-print "bar"-}}
```

템플릿은 가능한 한 공백을 줄여야 한다.

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

블록(예: 제어 구조)은 템플릿 코드의흐름을 나타내기 위해
들여쓰기 될 수 있다.

```
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

그러나 YAML 은 공백 지향 언어이므로 코드 들여쓰기가 해당 규칙을 따르는 것이
불가능한 경우가 많다.

## 생성된 템플릿의 화이트스페이스

생성된 템플릿의 공백을 최소로 유지하는 것이 좋다. 특히,
많은 빈 줄이 서로 인접해 있으면 안된다. 그러나
가끔 빈 줄(특히 논리섹션)이 있는 것은
가능하다.

가장 좋은 경우:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

양호한 경우:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

다만 지양해야 하는 경우:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## 주석 (YAML 주석 vs. 템플릿 주석)

YAML 과 헬름 템플릿에는 모두 주석 마커가 있다.

YAML 주석:
```yaml
# This is a comment
type: sprocket
```

템플릿 주석:
```yaml
{{- /*
This is a comment.
*/ -}}
type: frobnitz
```

정의된 템플릿 설명과 같이 템플릿의 기능을 문서화 할 때 템플릿
주석을 사용 해야 한다.

```yaml
{{- /*
mychart.shortname provides a 6 char truncated version of the release name.
*/ -}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

템플릿 내에서 YAML 주석은 헬름 사용자가 디버깅 중에 주석을 볼 때
유용하게 사용될 수 있다.

```yaml
# This may cause problems if the value is more than 100Gi
memory: {{ .Values.maxMem | quote }}
```

위의 주석은 사용자가 `helm install --debug`  를 실행할 때 표시되지만,
`{{- /* */ -}}` 섹션에 지정된 주석은 표시 되지 않는다.

## 템플릿과 템플릿 출력에서 JSON 사용하기

YAML 은 JSON 의 상위 집합이다. 어떤 경우에는 JSON 구문을 사용하는
것이 다른 YAML 표현보다 더 읽기 쉬울 수 있다.

예를 들어, 이 YAML 은 목록을 표현하는 일반적인 YAML 방법에 더 가깝다.

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

그러나 JSON 목록 스타일로 축소하면 읽기가 더 쉽다.

```yaml
arguments: ["--dirname", "/foo"]
```

가독성을 높이기 위해 JSON을 사용하는 것이 좋다. 그러나 더 복잡한 구조를
나타내는 데 JSON 구문을 사용해서는 안된다.

YAML 에 포함 된 순수 JSON (예: 초기화 컨테이너 구성)을 다룰 때는 물론
JSON 형식을 사용하는 것이 적절하다.
