---
title: "템플릿"
description: "템플릿에 관한 모범사례 들여다보기"
weight: 3
---

이 부분은 모범사례 가이드의 일부로서 템플릿을 자세히 알아본다.

## `templates/`의 구조

`templates/` 디렉토리는 다음과 같이 구조화되어야 한다.

- YAML을 만드는 템플릿 파일들은 확장자가 `.yaml`이어야 한다.
  형식이 정해지지 않은 컨텐츠를 만드는 템플릿 파일에는 `.tpl` 확장자를 쓸 수
  있다.
- 템플릿 파일 이름은 대시 표기법(`my-example-configmap.yaml`)을 따라야 하며,
  카멜 표기법이 아니다.
- 각 리소스 정의는 자체 템플릿 파일 내에 있어야 한다.
- 템플릿 파일 이름은 이름 내에 리소스 종류를 반영해야 한다. 예 :
  `foo-pod.yaml`,`bar-svc.yaml`
  
## 정의된 템플릿의 이름

정의된 템플릿 (`{{ define }}` 지시문 내에 생성된 템플릿)은
전역에서 접근가능하다. 즉, 차트와 그 모든 하위 차트는
`{{ define }}` 으로 생성된 모든 템플릿에 접근할 수 있다.

위와 같은 이유로, _모든 정의된 템플릿 이름은 네임스페이스별로 구분되어야 한다._

올바른 경우:

```yaml
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}
```

잘못된 경우:

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}
```
이 모범 사례에 따라 템플릿 이름이 자동으로 정의되므로,
`helm create` 명령을 통해 새 차트를 생성하는 것이 좋다.

## 템플릿 형식

템플릿은 _스페이스 2개_ (탭 아님)를 사용하여 들여쓰기 해야 한다.

템플릿 지시문에서 여는 중괄호 뒤와 닫는 중괄호 앞에는
공백을 두어야 한다.

올바른 경우:
```
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}
```

잘못된 경우:
```
{{.foo}}
{{print "foo"}}
{{-print "bar"-}}
```

템플릿은 가능한 경우 공백을 줄여야 한다.

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

블록 (예 : 제어 구조)은 템플릿 코드의 흐름을 나타내기 위해
들여쓰기 할 수 있다.

```
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

하지만, YAML은 공백 지향 언어이기 때문에, 
규칙에 따른 코드 들여쓰기가 불가능한 경우가 많다.

## 생성된 템플릿의 화이트스페이스

생성된 템플릿의 공백을 최소로 유지하는 것이 좋다.
특히, 많은 수의 빈 줄이 서로 인접해 있으면 안된다.
그러나 가끔씩 나오는 빈 줄(특히 논리 섹션 사이)은 
무방하다.

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

괜찮은 경우:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

지양해야 할 경우:

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

YAML과 헬름 템플릿 모두 주석 마커가 있다.

YAML 주석:
```yaml
# This is a comment
type: sprocket
```

템플릿 주석:
```yaml
{{- /*
This is a comment.
*/}}
type: frobnitz
```

정의된 템플릿 설명과 같이 템플릿의 기능을 문서화할 때는,
템플릿 주석을 사용해야 한다.

```yaml
{{- /*
mychart.shortname 은 릴리스 이름에서 6자만 자른 것을 제공한다.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

템플릿 내에서, YAML 주석은 헬름 사용자가 디버깅 중에 주석을 볼 때
유용하게 사용될 수 있다.

```yaml
# 값이 100Gi를 넘으면 문제가 발생할 수 있다
memory: {{ .Values.maxMem | quote }}
```

위의 주석은 사용자가 `helm install --debug` 를 실행할 때 표시되는데,
`{{-/ * * /-}}` 섹션에 지정된 주석은 표시되지 않는다.

## 템플릿과 템플릿 출력에서 JSON 사용하기

YAML은 JSON의 상위집합이다. 경우에 따라서는, JSON 구문을 사용하는 것이
다른 YAML 표현보다 더 읽기 쉬울 수 있다.

예를 들어, 이 YAML은 목록을 표현하는 일반적인 YAML 방법에 더 가깝다.

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

그러나 JSON 목록 스타일로 축약하면 읽기가 더 쉽다.

```yaml
arguments: ["--dirname", "/foo"]
```

가독성을 높이기 위해 JSON을 사용하는 것은 좋다. 하지만, 더 복잡한 구조를 나타내는 데에
JSON 구문을 사용해서는 안된다.

YAML (예를 들어 init 컨테이너 설정)에 포함된 순수 JSON을 다룰 때에는,
당연히 JSON 형식을 사용하는 것이 적절하다.
