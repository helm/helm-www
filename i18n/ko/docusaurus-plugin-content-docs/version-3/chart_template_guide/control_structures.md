---
title: 흐름 제어
description: 템플릿 내부의 흐름 구조에 대한 간단한 개요
sidebar_position: 7
---

제어 구조(템플릿 용어로 "액션"이라 함)를 사용하면 템플릿 작성자가 템플릿 생성의 흐름을 제어할 수 있다.
Helm의 템플릿 언어는 다음과 같은 제어 구조를 제공한다.

- `if`/`else` - 조건부 블록 생성
- `with` - 스코프 지정
- `range` - "for each" 스타일 반복문 제공

이 외에도 명명된(named) 템플릿 세그먼트를 선언하고 사용하기 위한 몇 가지 액션을 제공한다.

- `define` - 템플릿 내부에서 새로운 명명된 템플릿을 선언한다
- `template` - 명명된 템플릿을 가져온다
- `block` - 채울 수 있는 특별한 종류의 템플릿 영역을 선언한다

이 섹션에서는 `if`, `with`, `range`에 대해 설명한다. 나머지는 이 가이드의 뒷부분에 있는 
"명명된 템플릿" 섹션에서 다룬다.

## If/Else

가장 먼저 살펴볼 제어 구조는 템플릿에 텍스트 블록을 조건부로 포함하기 위한 것이다.
이것이 바로 `if`/`else` 블록이다.

조건문의 기본 구조는 다음과 같다.

```
{{ if PIPELINE }}
  # Do something
{{ else if OTHER PIPELINE }}
  # Do something else
{{ else }}
  # Default case
{{ end }}
```

여기서 값 대신 _파이프라인_ 에 대해 이야기하고 있다는 점에 주목하자.
이는 제어 구조가 단순히 값을 평가하는 것이 아니라 전체 파이프라인을 실행할 수 있다는 것을 명확히 하기 위함이다.

파이프라인은 다음과 같은 경우 _false_ 로 평가된다.

- 불리언 false
- 숫자 0
- 빈 문자열
- `nil` (비어있거나 null)
- 빈 컬렉션 (`map`, `slice`, `tuple`, `dict`, `array`)

그 외의 모든 조건에서는 true이다.

ConfigMap에 간단한 조건문을 추가해 보자. drink가 coffee로 설정된 경우 다른 설정을 추가할 것이다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}mug: "true"{{ end }}
```

이전 예제에서 `drink: coffee`를 주석 처리했으므로 출력에는 `mug: "true"` 플래그가 포함되지 않을 것이다.
하지만 `values.yaml` 파일에 해당 라인을 다시 추가하면 출력은 다음과 같이 된다.

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

## 공백 제어

조건문을 살펴보는 김에 템플릿에서 공백을 제어하는 방법도 간단히 살펴보자.
이전 예제를 좀 더 읽기 쉽게 포맷해 보자.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
    mug: "true"
  {{ end }}
```

처음에는 괜찮아 보인다. 하지만 템플릿 엔진을 통해 실행하면 안타까운 결과를 얻게 된다.

```console
$ helm install --dry-run --debug ./mychart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart
Error: YAML parse error on mychart/templates/configmap.yaml: error converting YAML to JSON: yaml: line 9: did not find expected key
```

무슨 일이 일어난 걸까? 위의 공백 때문에 잘못된 YAML이 생성되었다.

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
    mug: "true"
```

`mug`의 들여쓰기가 잘못되었다. 해당 라인의 들여쓰기를 줄이고 다시 실행해 보자.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{ end }}
```

이렇게 보내면 유효한 YAML을 얻게 되지만, 여전히 조금 이상하게 보인다.

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: telling-chimp-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"

  mug: "true"

```

YAML에 몇 개의 빈 줄이 있는 것을 주목하자. 왜 그럴까?
템플릿 엔진이 실행될 때 `{{`와 `}}` 내부의 내용은 _제거_ 되지만,
남은 공백은 그대로 유지된다.

YAML은 공백에 의미를 부여하므로 공백 관리가 상당히 중요해진다.
다행히 Helm 템플릿에는 이를 도와주는 몇 가지 도구가 있다.

첫째, 템플릿 선언의 중괄호 구문에 특수 문자를 추가하여 템플릿 엔진에게
공백을 제거하도록 지시할 수 있다.
`{{- `(대시와 공백 추가)는 왼쪽 공백을 제거해야 함을 나타내고,
` -}}`는 오른쪽 공백을 제거해야 함을 의미한다.
_주의하자! 개행도 공백이다!_

> `-`와 지시어의 나머지 부분 사이에 공백이 있어야 한다.
> `{{- 3 }}`은 "왼쪽 공백을 제거하고 3을 출력"을 의미하고,
> `{{-3 }}`은 "-3을 출력"을 의미한다.

이 구문을 사용하여 템플릿을 수정하면 새 줄을 제거할 수 있다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{- end }}
```

이 점을 명확히 하기 위해 위의 내용을 조정하고 이 규칙에 따라 삭제될 각 공백을 `*`로 대체해 보자.
줄 끝의 `*`는 제거될 개행 문자를 나타낸다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}*
**{{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"*
**{{- end }}

```

이를 염두에 두고 Helm을 통해 템플릿을 실행하면 다음과 같은 결과를 볼 수 있다.

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: clunky-cat-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

공백 제거 수정자를 사용할 때 주의하자. 다음과 같은 실수를 저지르기 쉽다.

```yaml
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" -}}
  mug: "true"
  {{- end -}}

```

이렇게 하면 양쪽의 개행을 모두 제거하여 `food: "PIZZA"mug: "true"`가 출력된다.

> 템플릿의 공백 제어에 대한 자세한 내용은 [공식 Go 템플릿 문서](https://godoc.org/text/template)를 참조하자.

마지막으로, 템플릿 지시어의 간격을 숙달하려고 노력하는 대신 템플릿 시스템에게 
들여쓰기를 지정하도록 하는 것이 더 쉬울 때가 있다.
이런 이유로 `indent` 함수를 사용하는 것이 유용할 때가 있다 (`{{ indent 2
"mug:true" }}`).

## `with`를 사용하여 스코프 수정

다음으로 살펴볼 제어 구조는 `with` 액션이다. 이것은 변수 스코프를 제어한다.
`.`는 _현재 스코프_ 에 대한 참조임을 상기하자.
따라서 `.Values`는 템플릿에게 현재 스코프에서 `Values` 객체를 찾으라고 지시한다.

`with`의 구문은 간단한 `if` 문과 유사하다.

```
{{ with PIPELINE }}
  # restricted scope
{{ end }}
```

스코프는 변경될 수 있다. `with`를 사용하면 현재 스코프(`.`)를 특정 객체로 설정할 수 있다.
예를 들어, 우리는 `.Values.favorite`로 작업해 왔다.
`.` 스코프가 `.Values.favorite`를 가리키도록 ConfigMap을 다시 작성해 보자.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
```

이전 예제에서 `if` 조건문을 제거했다는 점에 주목하자.
`PIPELINE`의 값이 비어 있지 않은 경우에만 `with` 뒤의 블록이 실행되기 때문에 
이제 더 이상 필요하지 않다.

이제 `.drink`와 `.food`를 전체 경로 없이 참조할 수 있다는 점에 주목하자.
이는 `with` 문이 `.`를 `.Values.favorite`를 가리키도록 설정했기 때문이다.
`.`는 `{{ end }}` 이후에 이전 스코프로 재설정된다.

하지만 여기서 주의해야 할 점이 있다! 제한된 스코프 내에서는 `.`를 사용하여
부모 스코프의 다른 객체에 접근할 수 없다. 예를 들어 다음은 실패한다.

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name`이 `.`의 제한된 스코프 내에 없기 때문에 오류가 발생한다.
그러나 마지막 두 줄을 바꾸면 `{{ end }}` 후에 스코프가 재설정되므로 예상대로 작동한다.

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

또는 `$`를 사용하여 부모 스코프에서 `Release.Name` 객체에 접근할 수 있다.
`$`는 템플릿 실행이 시작될 때 루트 스코프에 매핑되며 템플릿 실행 중에 변경되지 않는다.
다음도 작동한다.

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

`range`를 살펴본 후, 위의 스코프 문제에 대한 하나의 해결책을 제공하는 
템플릿 변수에 대해 살펴볼 것이다.

## `range` 액션으로 반복하기

많은 프로그래밍 언어에서 `for` 루프, `foreach` 루프 또는 유사한 함수형 메커니즘을 사용한 
반복을 지원한다. Helm의 템플릿 언어에서 컬렉션을 반복하는 방법은 `range` 연산자를 사용하는 것이다.

시작하기 위해 `values.yaml` 파일에 피자 토핑 목록을 추가해 보자.

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions
  - pineapple
```

이제 `pizzaToppings` 목록(템플릿에서는 `slice`라고 함)이 생겼다.
템플릿을 수정하여 이 목록을 ConfigMap에 출력할 수 있다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  toppings: |-
    {{- range .Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}

```

`$`를 사용하여 부모 스코프에서 `Values.pizzaToppings` 목록에 접근할 수 있다.
`$`는 템플릿 실행이 시작될 때 루트 스코프에 매핑되며 템플릿 실행 중에 변경되지 않는다.
다음도 작동한다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  toppings: |-
    {{- range $.Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
  {{- end }}
```

`toppings:` 목록을 더 자세히 살펴보자. `range` 함수는 `pizzaToppings` 목록을
"range over"(반복) 한다. 하지만 여기서 흥미로운 일이 발생한다.
`with`가 `.`의 스코프를 설정하는 것처럼 `range` 연산자도 그렇게 한다.
루프를 통과할 때마다 `.`는 현재 피자 토핑으로 설정된다.
즉, 처음에는 `.`가 `mushrooms`로 설정된다. 두 번째 반복에서는 `cheese`로 설정되는 식이다.

`.`의 값을 파이프라인으로 직접 보낼 수 있으므로 `{{ . | title | quote }}`를 실행하면
`.`를 `title`(타이틀 케이스 함수)로 보낸 다음 `quote`로 보낸다.
이 템플릿을 실행하면 출력은 다음과 같다.

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-dragonfly-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  toppings: |-
    - "Mushrooms"
    - "Cheese"
    - "Peppers"
    - "Onions"
    - "Pineapple"
```

이 예제에서는 약간의 트릭을 사용했다. `toppings: |-` 줄은 여러 줄 문자열을 선언한다.
따라서 토핑 목록은 실제로 YAML 목록이 아니라 큰 문자열이다.
왜 이렇게 할까? ConfigMap의 `data`는 키와 값이 모두 단순 문자열인 키/값 쌍으로 구성되기 때문이다.
이것이 왜 그런지 이해하려면 [Kubernetes ConfigMap 문서](https://kubernetes.io/docs/concepts/configuration/configmap/)를 참조하자.
하지만 우리에게 이 세부 사항은 그다지 중요하지 않다.

> YAML의 `|-` 마커는 여러 줄 문자열을 취한다. 이것은 여기서 예시된 것처럼
> 매니페스트 내부에 큰 데이터 블록을 포함하는 데 유용한 기술일 수 있다.

때때로 템플릿 내부에서 목록을 빠르게 만들고 해당 목록을 반복하는 것이 유용하다.
Helm 템플릿에는 이를 쉽게 만드는 함수가 있다: `tuple`.
컴퓨터 과학에서 튜플은 고정 크기이지만 임의의 데이터 타입을 가진 목록과 유사한 컬렉션이다.
이것은 `tuple`이 사용되는 방식을 대략적으로 전달한다.

```yaml
  sizes: |-
    {{- range tuple "small" "medium" "large" }}
    - {{ . }}
    {{- end }}
```

위의 내용은 다음과 같이 출력된다.

```yaml
  sizes: |-
    - small
    - medium
    - large
```

목록과 튜플 외에도 `range`는 키와 값이 있는 컬렉션(`map` 또는 `dict` 같은)을 반복하는 데 
사용할 수 있다. 다음 섹션에서 템플릿 변수를 소개할 때 그 방법을 살펴볼 것이다.
