---
title: 서브차트와 글로벌 값
description: 서브차트 및 글로벌 값 사용하기
sidebar_position: 11
---

지금까지 우리는 단일 차트만 가지고 작업해왔다. 하지만 차트는 자체적인 값과 템플릿을 가진 _서브차트_ 라고 불리는 의존성을 가질 수 있다. 이 섹션에서는 서브차트를 만들고 템플릿 내에서 값에 접근하는 다양한 방법을 살펴볼 것이다.

코드로 들어가기 전에 애플리케이션 서브차트에 대해 알아야 할 몇 가지 중요한 사항이 있다.

1. 서브차트는 "독립적"으로 간주된다. 이는 서브차트가 절대로 부모 차트에 명시적으로 의존할 수 없음을 의미한다.
2. 그런 이유로 서브차트는 부모의 값에 접근할 수 없다.
3. 부모 차트는 서브차트의 값을 오버라이드할 수 있다.
4. Helm에는 모든 차트에서 접근할 수 있는 _글로벌 값_ 이라는 개념이 있다.

> 이러한 제한 사항은 표준화된 헬퍼 기능을 제공하도록 설계된 [라이브러리 차트](/topics/library_charts.md)에는 반드시 적용되지 않는다.

이 섹션의 예제를 살펴보면서 이러한 개념들이 더 명확해질 것이다.

## 서브차트 작성

이 실습에서는 가이드 시작 부분에서 만든 `mychart/` 차트를 가지고 시작하여 그 안에 새로운 차트를 추가할 것이다.

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

이전과 마찬가지로 처음부터 시작할 수 있도록 모든 기본 템플릿을 삭제했다. 이 가이드에서는 의존성 관리가 아닌 템플릿 작동 방식에 초점을 맞추고 있다. 서브차트 작동 방식에 대한 자세한 내용은 [차트 가이드](/topics/charts.md)를 참조하라.

## 서브차트에 값과 템플릿 추가하기

다음으로 `mysubchart` 차트를 위한 간단한 템플릿과 values 파일을 만들어 보자. `mychart/charts/mysubchart`에 이미 `values.yaml`이 있을 것이다. 다음과 같이 설정하자:

```yaml
dessert: cake
```

다음으로 `mychart/charts/mysubchart/templates/configmap.yaml`에 새 ConfigMap 템플릿을 만들자:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

모든 서브차트는 _독립적인 차트_ 이기 때문에 `mysubchart`를 단독으로 테스트할 수 있다:

```console
$ helm install --generate-name --dry-run --debug mychart/charts/mysubchart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart/charts/mysubchart
NAME:   newbie-elk
TARGET NAMESPACE:   default
CHART:  mysubchart 0.1.0
MANIFEST:
---
# Source: mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: newbie-elk-cfgmap2
data:
  dessert: cake
```

## 부모 차트에서 값 오버라이드하기

원래의 `mychart` 차트가 이제 `mysubchart`의 _부모_ 차트이다. 이 관계는 `mysubchart`가 `mychart/charts` 내에 있기 때문에 성립한다.

`mychart`가 부모이기 때문에 `mychart`에서 구성을 지정하고 그 구성을 `mysubchart`로 전달할 수 있다. 예를 들어 `mychart/values.yaml`을 다음과 같이 수정할 수 있다:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream
```

마지막 두 줄에 주목하라. `mysubchart` 섹션 안의 모든 지시문은 `mysubchart` 차트로 전달된다. 따라서 `helm install --generate-name --dry-run --debug mychart`를 실행하면 `mysubchart` ConfigMap을 볼 수 있다:

```yaml
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unhinged-bee-cfgmap2
data:
  dessert: ice cream
```

최상위 레벨의 값이 서브차트의 값을 오버라이드한 것이다.

여기서 주목해야 할 중요한 세부 사항이 있다. `mychart/charts/mysubchart/templates/configmap.yaml`의 템플릿을 `.Values.mysubchart.dessert`를 가리키도록 변경하지 않았다. 해당 템플릿의 관점에서 값은 여전히 `.Values.dessert`에 위치한다. 템플릿 엔진이 값을 전달할 때 스코프를 설정한다. 따라서 `mysubchart` 템플릿의 경우 `mysubchart`에 특정한 값만 `.Values`에서 사용할 수 있다.

하지만 때로는 특정 값을 모든 템플릿에서 사용할 수 있도록 하고 싶을 때가 있다. 이럴 때 글로벌 차트 값을 사용하면 된다.

## 글로벌 차트 값

글로벌 값은 정확히 같은 이름으로 모든 차트나 서브차트에서 접근할 수 있는 값이다. 글로벌은 명시적 선언이 필요하다. 기존의 비글로벌 값을 글로벌인 것처럼 사용할 수는 없다.

Values 데이터 타입에는 글로벌 값을 설정할 수 있는 `Values.global`이라는 예약된 섹션이 있다. `mychart/values.yaml` 파일에 하나를 설정해 보자.

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream

global:
  salad: caesar
```

글로벌의 작동 방식 때문에 `mychart/templates/configmap.yaml`과 `mysubchart/templates/configmap.yaml` 모두 `{{ .Values.global.salad }}`로 해당 값에 접근할 수 있어야 한다.

`mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  salad: {{ .Values.global.salad }}
```

`mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
  salad: {{ .Values.global.salad }}
```

이제 dry run 설치를 실행하면 두 출력에서 같은 값을 볼 수 있다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-configmap
data:
  salad: caesar

---
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-cfgmap2
data:
  dessert: ice cream
  salad: caesar
```

글로벌은 이와 같은 정보를 전달하는 데 유용하지만, 올바른 템플릿이 글로벌을 사용하도록 구성되어 있는지 확인하기 위해 약간의 계획이 필요하다.

## 템플릿과 서브차트 공유하기

부모 차트와 서브차트는 템플릿을 공유할 수 있다. 모든 차트에서 정의된 블록은 다른 차트에서 사용할 수 있다.

예를 들어 다음과 같이 간단한 템플릿을 정의할 수 있다:

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

템플릿의 레이블이 _전역적으로 공유_ 된다는 것을 상기하라. 따라서 `labels` 차트는 다른 어떤 차트에서도 포함될 수 있다.

차트 개발자는 `include`와 `template` 중에서 선택할 수 있지만, `include`를 사용하는 한 가지 장점은 `include`가 템플릿을 동적으로 참조할 수 있다는 것이다:

```yaml
{{ include $mytemplate }}
```

위의 코드는 `$mytemplate`을 역참조한다. 반면에 `template` 함수는 문자열 리터럴만 받아들인다.

## 블록 사용 피하기

Go 템플릿 언어는 개발자가 나중에 오버라이드되는 기본 구현을 제공할 수 있게 해주는 `block` 키워드를 제공한다. Helm 차트에서는 동일한 블록의 여러 구현이 제공되면 어떤 것이 선택될지 예측할 수 없기 때문에 블록은 오버라이드하기에 최적의 도구가 아니다.

대신 `include`를 사용하는 것을 권장한다.
