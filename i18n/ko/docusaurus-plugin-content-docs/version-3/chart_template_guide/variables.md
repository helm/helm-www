---
title: 변수
description: 템플릿에서 변수 사용하기
sidebar_position: 7
---

함수, 파이프라인, 객체, 그리고 흐름 제어 구조를 모두 살펴봤으니, 이제 많은 프로그래밍 언어에서
기본적으로 다루는 개념 중 하나인 변수에 대해 알아보겠습니다. 템플릿에서 변수는 자주 사용되지는 않지만,
코드를 단순화하고 `with` 및 `range`를 더 효과적으로 사용하는 방법을 살펴보겠습니다.

이전 예제에서 다음 코드가 실패하는 것을 확인했습니다:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name`은 `with` 블록에서 제한된 스코프 안에 포함되어 있지 않습니다.
스코프 문제를 해결하는 한 가지 방법은 현재 스코프와 관계없이 접근할 수 있는 변수에 객체를 할당하는 것입니다.

Helm 템플릿에서 변수는 다른 객체에 대한 이름이 있는 참조입니다. 변수는 `$name` 형식을 따릅니다.
변수는 특별한 할당 연산자 `:=`를 사용하여 할당됩니다. 위의 예제를 `Release.Name`에 변수를 사용하도록 다시 작성해 보겠습니다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- $relname := .Release.Name -}}
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $relname }}
  {{- end }}
```

`with` 블록을 시작하기 전에 `$relname := .Release.Name`을 할당했습니다.
이제 `with` 블록 안에서도 `$relname` 변수는 여전히 릴리스 이름을 가리킵니다.

위 코드를 실행하면 다음과 같은 결과가 생성됩니다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: viable-badger-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  release: viable-badger
```

변수는 특히 `range` 루프에서 유용합니다. 리스트 형태의 객체에서 인덱스와 값을 모두 캡처하는 데 사용할 수 있습니다:

```yaml
  toppings: |-
    {{- range $index, $topping := .Values.pizzaToppings }}
      {{ $index }}: {{ $topping }}
    {{- end }}

```

`range`가 먼저 오고, 그 다음 변수, 할당 연산자, 그리고 리스트 순서입니다.
이렇게 하면 정수 인덱스(0부터 시작)가 `$index`에 할당되고 값이 `$topping`에 할당됩니다.
실행하면 다음과 같이 생성됩니다:

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

키와 값이 모두 있는 데이터 구조의 경우, `range`를 사용하여 둘 다 가져올 수 있습니다.
예를 들어, `.Values.favorite`를 다음과 같이 순회할 수 있습니다:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

첫 번째 반복에서 `$key`는 `drink`이고 `$val`은 `coffee`가 되며,
두 번째 반복에서 `$key`는 `food`이고 `$val`은 `pizza`가 됩니다.
위 코드를 실행하면 다음과 같이 생성됩니다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eager-rabbit-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

변수는 일반적으로 "전역"이 아닙니다. 변수는 선언된 블록 내에서만 스코프가 유효합니다.
앞서 템플릿의 최상위 레벨에서 `$relname`을 할당했습니다.
해당 변수는 전체 템플릿에서 스코프 내에 있습니다. 하지만 마지막 예제에서
`$key`와 `$val`은 `{{ range... }}{{ end }}` 블록 안에서만 스코프 내에 있습니다.

그러나 항상 루트 컨텍스트를 가리키는 특별한 변수 `$`가 있습니다.
range 루프 안에서 차트의 릴리스 이름을 알아야 할 때 매우 유용합니다.

다음은 이를 보여주는 예제입니다:
```yaml
{{- range .Values.tlsSecrets }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    # Many helm templates would use `.` below, but that will not work,
    # however `$` will work here
    app.kubernetes.io/name: {{ template "fullname" $ }}
    # I cannot reference .Chart.Name, but I can do $.Chart.Name
    helm.sh/chart: "{{ $.Chart.Name }}-{{ $.Chart.Version }}"
    app.kubernetes.io/instance: "{{ $.Release.Name }}"
    # Value from appVersion in Chart.yaml
    app.kubernetes.io/version: "{{ $.Chart.AppVersion }}"
    app.kubernetes.io/managed-by: "{{ $.Release.Service }}"
type: kubernetes.io/tls
data:
  tls.crt: {{ .certificate }}
  tls.key: {{ .key }}
{{- end }}
```

지금까지 하나의 파일에 선언된 하나의 템플릿만 살펴봤습니다. 하지만 Helm 템플릿 언어의 강력한 기능 중
하나는 여러 템플릿을 선언하고 함께 사용할 수 있다는 것입니다. 다음 섹션에서 이에 대해 알아보겠습니다.
