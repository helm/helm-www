---
title: 템플릿 함수와 파이프라인
description: 템플릿에서 함수 사용하기
sidebar_position: 5
---

지금까지 템플릿에 정보를 넣는 방법을 살펴봤다. 하지만 그 정보는 수정 없이 그대로 삽입된다. 때로는 제공된 데이터를 더 유용하게 변환하고 싶을 때가 있다.

가장 좋은 방법부터 시작해보자: `.Values` 객체의 문자열을 템플릿에 삽입할 때는 따옴표로 감싸야 한다. 템플릿 지시어에서 `quote` 함수를 호출하면 된다:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

템플릿 함수는 `functionName arg1 arg2...` 구문을 따른다. 위 코드에서 `quote .Values.favorite.drink`는 `quote` 함수를 호출하고 단일 인자를 전달한다.

Helm에는 60개 이상의 함수가 있다. 일부는 [Go 템플릿 언어](https://godoc.org/text/template) 자체에서 정의된 것이고, 대부분은 [Sprig 템플릿 라이브러리](https://masterminds.github.io/sprig/)의 일부다. 예제를 진행하면서 많은 함수들을 살펴볼 것이다.

> "Helm 템플릿 언어"를 Helm에서만 사용하는 것처럼 말하지만, 실제로는 Go 템플릿 언어와 몇 가지 추가 함수, 그리고 특정 객체를 템플릿에 노출하기 위한 다양한 래퍼의 조합이다. Go 템플릿에 대한 많은 자료가 템플릿 학습에 도움이 될 것이다.

## 파이프라인

템플릿 언어의 강력한 기능 중 하나는 _파이프라인_ 개념이다. UNIX의 개념을 빌려와서, 파이프라인은 일련의 템플릿 명령을 연결하여 일련의 변환을 간결하게 표현하는 도구다. 다시 말해, 파이프라인은 여러 작업을 순서대로 효율적으로 처리하는 방법이다. 위 예제를 파이프라인을 사용해 다시 작성해보자.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | quote }}
```

이 예제에서는 `quote ARGUMENT`를 호출하는 대신 순서를 바꿨다. 파이프라인(`|`)을 사용하여 인자를 함수로 "전송"했다: `.Values.favorite.drink | quote`. 파이프라인을 사용하면 여러 함수를 연결할 수 있다:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

> 순서를 바꾸는 것은 템플릿에서 흔한 방식이다. `quote .val`보다 `.val | quote`를 더 자주 보게 될 것이다. 두 방식 모두 괜찮다.

위 템플릿을 평가하면 다음과 같은 결과가 나온다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: trendsetting-p-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

원래 `pizza`가 `"PIZZA"`로 변환된 것에 주목하자.

이렇게 인자를 파이프라인으로 전달할 때, 첫 번째 평가 결과(`.Values.favorite.drink`)는 _함수의 마지막 인자_로 전달된다. 두 개의 인자를 받는 함수를 사용하여 drink 예제를 수정해보자: `repeat COUNT STRING`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

`repeat` 함수는 주어진 문자열을 지정된 횟수만큼 반복 출력하므로, 다음과 같은 결과가 나온다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: melting-porcup-configmap
data:
  myvalue: "Hello World"
  drink: "coffeecoffeecoffeecoffeecoffee"
  food: "PIZZA"
```

## `default` 함수 사용하기

템플릿에서 자주 사용되는 함수 중 하나는 `default` 함수다: `default DEFAULT_VALUE GIVEN_VALUE`. 이 함수는 값이 생략된 경우 템플릿 내에서 기본값을 지정할 수 있게 해준다. 위 drink 예제를 수정해보자:

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

정상적으로 실행하면 `coffee`가 출력된다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: virtuous-mink-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

이제 `values.yaml`에서 favorite drink 설정을 제거해보자:

```yaml
favorite:
  #drink: coffee
  food: pizza
```

이제 `helm install --dry-run --debug fair-worm ./mychart`를 다시 실행하면 다음 YAML이 생성된다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fair-worm-configmap
data:
  myvalue: "Hello World"
  drink: "tea"
  food: "PIZZA"
```

실제 차트에서는 모든 정적 기본값이 `values.yaml`에 있어야 하며, `default` 명령으로 반복해서는 안 된다(그렇지 않으면 중복이 된다). 하지만 `default` 명령은 `values.yaml` 내에 선언할 수 없는 계산된 값에 적합하다. 예를 들어:

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

어떤 곳에서는 `default`보다 `if` 조건문이 더 적합할 수 있다. 다음 섹션에서 이를 살펴볼 것이다.

템플릿 함수와 파이프라인은 정보를 변환한 다음 YAML에 삽입하는 강력한 방법이다. 하지만 때로는 단순히 문자열을 삽입하는 것보다 더 복잡한 템플릿 로직이 필요할 때가 있다. 다음 섹션에서는 템플릿 언어가 제공하는 제어 구조를 살펴볼 것이다.

## `lookup` 함수 사용하기

`lookup` 함수를 사용하면 실행 중인 클러스터에서 리소스를 조회할 수 있다. lookup 함수의 구문은 `lookup apiVersion, kind, namespace, name -> resource or resource list`이다.

| 파라미터   | 자료형 |
|------------|--------|
| apiVersion | string |
| kind       | string |
| namespace  | string |
| name       | string |

`name`과 `namespace`는 선택사항이며 빈 문자열(`""`)로 전달할 수 있다. 하지만 namespace 범위의 리소스를 다룰 때는 `name`과 `namespace`를 모두 지정해야 한다.

다음과 같은 파라미터 조합이 가능하다:

| 동작                                   | lookup 함수                                |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"`  |
| `kubectl get pods -n mynamespace`      | `lookup "v1" "Pod" "mynamespace" ""`       |
| `kubectl get pods --all-namespaces`    | `lookup "v1" "Pod" "" ""`                  |
| `kubectl get namespace mynamespace`    | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces`               | `lookup "v1" "Namespace" "" ""`            |

`lookup`이 객체를 반환하면 딕셔너리를 반환한다. 이 딕셔너리를 탐색하여 특정 값을 추출할 수 있다.

다음 예제는 `mynamespace` 객체에 있는 어노테이션을 반환한다:

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

`lookup`이 객체 목록을 반환하면 `items` 필드를 통해 객체 목록에 접근할 수 있다:

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* do something with each service */}}
{{ end }}
```

객체를 찾지 못하면 빈 값이 반환된다. 이를 사용하여 객체의 존재 여부를 확인할 수 있다.

`lookup` 함수는 Helm의 기존 Kubernetes 연결 설정을 사용하여 Kubernetes에 쿼리한다. API 서버와 상호 작용할 때 오류가 반환되면(예: 리소스 접근 권한이 없는 경우) Helm의 템플릿 처리가 실패한다.

`helm template|install|upgrade|delete|rollback --dry-run` 작업 중에는 Helm이 Kubernetes API 서버에 접속하지 않아야 한다는 점을 기억하자. 실행 중인 클러스터에서 `lookup`을 테스트하려면 `helm template|install|upgrade|delete|rollback --dry-run=server`를 사용하여 클러스터 연결을 허용해야 한다.

## 연산자는 함수이다

템플릿에서 연산자(`eq`, `ne`, `lt`, `gt`, `and`, `or` 등)는 모두 함수로 구현되어 있다. 파이프라인에서 연산은 괄호(`(`, `)`)로 그룹화할 수 있다.

이제 함수와 파이프라인에서 조건문, 반복문, 스코프 수정자를 사용한 흐름 제어로 넘어가보자.
