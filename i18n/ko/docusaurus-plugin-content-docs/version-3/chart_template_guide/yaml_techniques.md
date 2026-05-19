---
title: "부록: YAML 기법"
description: YAML 명세와 그것이 Helm에 어떻게 적용되는지 자세히 알아보기
sidebar_position: 15
---

이 가이드의 대부분은 템플릿 언어 작성에 초점을 맞추었다.
여기서는 YAML 형식을 살펴볼 것이다.
YAML에는 템플릿 작성자로서 템플릿의 오류를 줄이고 가독성을 높이는 데 활용할 수 있는 유용한 기능들이 있다.

## 스칼라(scalar)와 콜렉션(collection)

[YAML 명세](https://yaml.org/spec/1.2/spec.html)에 따르면,
두 가지 유형의 콜렉션과 다양한 스칼라 자료형이 있다.

두 가지 콜렉션 유형은 맵(map)과 시퀀스(sequence)이다:

```yaml
map:
  one: 1
  two: 2
  three: 3

sequence:
  - one
  - two
  - three
```

스칼라 값은 (콜렉션과 반대되는) 개별 값이다.

### YAML에서의 스칼라 자료형

Helm의 YAML 방언에서 값의 스칼라 자료형은 Kubernetes의 리소스 정의 스키마를 포함한
복잡한 규칙 집합에 의해 결정된다.
하지만 자료형을 추론할 때 다음 규칙들이 일반적으로 적용된다.

정수나 부동 소수점이 따옴표 없는 값이면 일반적으로 숫자형으로 처리된다:

```yaml
count: 1
size: 2.34
```

그러나 따옴표로 감싸면 문자열로 처리된다:

```yaml
count: "1" # <-- string, not int
size: '2.34' # <-- string, not float
```

불리언도 마찬가지다:

```yaml
isGood: true   # bool
answer: "true" # string
```

빈 값을 나타내는 단어는 `null`이다 (`nil`이 아님).

`port: "80"`은 유효한 YAML이며 템플릿 엔진과 YAML 파서를 모두 통과하지만,
Kubernetes가 `port`를 정수로 기대하는 경우 실패한다는 점에 유의하자.

어떤 경우에는 YAML 노드 태그를 사용하여 특정 자료형 추론을 강제할 수 있다:

```yaml
coffee: "yes, please"
age: !!str 21
port: !!int "80"
```

위 예제에서 `!!str`은 파서에게 `age`가 정수처럼 보여도 문자열이라고 알려준다.
그리고 `port`는 따옴표로 감싸져 있어도 정수로 처리된다.


## YAML에서의 문자열

YAML 문서에 넣는 데이터의 대부분은 문자열이다.
YAML에는 문자열을 표현하는 여러 가지 방법이 있다.
이 섹션에서는 그 방법들을 설명하고 일부를 사용하는 방법을 보여준다.

문자열을 선언하는 세 가지 "인라인" 방식이 있다:

```yaml
way1: bare words
way2: "double-quoted strings"
way3: 'single-quoted strings'
```

모든 인라인 스타일은 한 줄에 있어야 한다.

- 따옴표 없는 값은 이스케이프되지 않는다. 따라서 어떤 문자를 사용할지 주의해야 한다.
- 큰따옴표 문자열은 `\`로 특정 문자를 이스케이프할 수 있다.
  예를 들어 `"\"Hello\", she said"`처럼 쓸 수 있다. `\n`으로 줄바꿈을 이스케이프할 수 있다.
- 작은따옴표 문자열은 "리터럴" 문자열이며 `\`를 사용하여 문자를 이스케이프하지 않는다.
  유일한 이스케이프 시퀀스는 `''`이며, 이것은 단일 `'`로 디코딩된다.

한 줄 문자열 외에도 멀티라인 문자열을 선언할 수 있다:

```yaml
coffee: |
  Latte
  Cappuccino
  Espresso
```

위 예제에서 `coffee`의 값은 `Latte\nCappuccino\nEspresso\n`과 동일한 단일 문자열로 처리된다.

`|` 다음의 첫 번째 줄은 올바르게 들여쓰기해야 한다는 점에 유의하자.
따라서 다음과 같이 하면 위 예제가 깨질 수 있다:

```yaml
coffee: |
         Latte
  Cappuccino
  Espresso

```

`Latte`가 잘못 들여쓰기되었기 때문에 다음과 같은 오류가 발생한다:

```
Error parsing file: error converting YAML to JSON: yaml: line 7: did not find expected key
```

템플릿에서는 위 오류를 방지하기 위해 멀티라인 문서에 가짜 "첫 번째 줄" 내용을 넣는 것이
더 안전한 경우가 있다:

```yaml
coffee: |
  # Commented first line
         Latte
  Cappuccino
  Espresso

```

첫 번째 줄이 무엇이든 문자열의 출력에 그대로 유지된다는 점에 유의하자.
예를 들어 이 기법을 사용하여 파일 내용을 ConfigMap에 주입하는 경우,
주석은 해당 항목을 읽는 쪽에서 기대하는 유형이어야 한다.

### 멀티라인 문자열에서 스페이스 처리

위 예제에서 `|`를 사용하여 멀티라인 문자열을 나타냈다.
그런데 문자열 내용 뒤에 후행 `\n`이 붙는다는 점을 주목하자.
YAML 프로세서가 후행 줄바꿈을 제거하게 하려면 `|` 뒤에 `-`를 추가하면 된다:

```yaml
coffee: |-
  Latte
  Cappuccino
  Espresso
```

이제 `coffee` 값은 `Latte\nCappuccino\nEspresso`가 된다 (후행 `\n` 없음).

반대로 모든 후행 공백을 유지하고 싶을 때도 있다.
`|+` 표기법을 사용하면 된다:

```yaml
coffee: |+
  Latte
  Cappuccino
  Espresso


another: value
```

이제 `coffee` 값은 `Latte\nCappuccino\nEspresso\n\n\n`이 된다.

텍스트 블록 내부의 들여쓰기는 그대로 유지되며, 줄바꿈도 보존된다:

```yaml
coffee: |-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

위 경우 `coffee`는 `Latte\n  12 oz\n  16 oz\nCappuccino\nEspresso`가 된다.

### 들여쓰기와 템플릿

템플릿을 작성할 때 파일 내용을 템플릿에 주입하고 싶을 수 있다.
이전 챕터에서 보았듯이 두 가지 방법이 있다:

- `{{ .Files.Get "FILENAME" }}`을 사용하여 차트 내 파일의 내용을 가져온다.
- `{{ include "TEMPLATE" . }}`을 사용하여 템플릿을 렌더링한 다음 그 내용을 차트에 배치한다.

파일을 YAML에 삽입할 때 위의 멀티라인 규칙을 이해하는 것이 좋다.
정적 파일을 삽입하는 가장 쉬운 방법은 보통 다음과 같다:

```yaml
myfile: |
{{ .Files.Get "myfile.txt" | indent 2 }}
```

위에서 들여쓰기하는 방식에 주목하자: `indent 2`는 템플릿 엔진에게
"myfile.txt"의 모든 줄을 두 칸 들여쓰기하라고 지시한다.
해당 템플릿 줄 자체는 들여쓰기하지 않는다는 점에 유의하자.
만약 그렇게 하면 첫 번째 줄의 파일 내용이 두 번 들여쓰기되기 때문이다.

### 접힌 멀티라인 문자열

YAML에서 여러 줄로 문자열을 표현하되 해석될 때는 하나의 긴 줄로 처리되길 원할 때가 있다.
이것을 "접기(folding)"라고 한다.
접힌 블록을 선언하려면 `|` 대신 `>`를 사용한다:

```yaml
coffee: >
  Latte
  Cappuccino
  Espresso


```

위에서 `coffee` 값은 `Latte Cappuccino Espresso\n`이 된다.
마지막 줄바꿈을 제외한 모든 줄바꿈이 공백으로 변환된다.
공백 제어를 접힌 텍스트 마커와 결합할 수 있으므로, `>-`는 모든 줄바꿈을 대체하거나 제거한다.

접힌 구문에서 텍스트를 들여쓰기하면 줄이 그대로 보존된다는 점에 유의하자.

```yaml
coffee: >-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

위 예제는 `Latte\n  12 oz\n  16 oz\nCappuccino Espresso`를 생성한다.
공백과 줄바꿈이 모두 그대로 남아 있다.

## 하나의 파일에 여러 문서 넣기

단일 파일에 둘 이상의 YAML 문서를 넣을 수 있다.
새 문서 앞에 `---`를 붙이고 문서 끝에 `...`을 붙이면 된다.

```yaml

---
document: 1
...
---
document: 2
...
```

대부분의 경우 `---`나 `...`을 생략할 수 있다.

Helm의 일부 파일은 둘 이상의 문서를 포함할 수 없다.
예를 들어 `values.yaml` 파일 내에 둘 이상의 문서가 제공되면 첫 번째 문서만 사용된다.

그러나 템플릿 파일은 둘 이상의 문서를 가질 수 있다.
이 경우 파일(및 모든 문서)은 템플릿 렌더링 중에 하나의 객체로 처리된다.
그러나 결과 YAML은 Kubernetes로 전달되기 전에 여러 문서로 분할된다.

파일당 여러 문서는 절대적으로 필요한 경우에만 사용하는 것을 권장한다.
파일에 여러 문서가 있으면 디버깅이 어려울 수 있다.

## YAML은 JSON의 상위집합이다

YAML은 JSON의 상위집합이므로, 유효한 JSON 문서는 _모두_ 유효한 YAML이어야 한다.

```json
{
  "coffee": "yes, please",
  "coffees": [
    "Latte", "Cappuccino", "Espresso"
  ]
}
```

위는 다음을 표현하는 또 다른 방법이다:

```yaml
coffee: yes, please
coffees:
- Latte
- Cappuccino
- Espresso
```

그리고 이 둘을 (주의하여) 혼합할 수 있다:

```yaml
coffee: "yes, please"
coffees: [ "Latte", "Cappuccino", "Espresso"]
```

세 가지 모두 동일한 내부 표현으로 파싱되어야 한다.

이것은 `values.yaml` 같은 파일이 JSON 데이터를 포함할 수 있다는 것을 의미하지만,
Helm은 파일 확장자 `.json`을 유효한 접미사로 취급하지 않는다.

## YAML 앵커(anchor)

YAML 명세는 값에 대한 참조를 저장하고 나중에 그 참조로 값을 참조하는 방법을 제공한다.
YAML에서는 이것을 "앵커링(anchoring)"이라고 한다:

```yaml
coffee: "yes, please"
favorite: &favoriteCoffee "Cappuccino"
coffees:
  - Latte
  - *favoriteCoffee
  - Espresso
```

위에서 `&favoriteCoffee`는 `Cappuccino`에 대한 참조를 설정한다.
나중에 해당 참조는 `*favoriteCoffee`로 사용된다.
따라서 `coffees`는 `Latte, Cappuccino, Espresso`가 된다.

앵커가 유용한 경우가 몇 가지 있지만, 미묘한 버그를 일으킬 수 있는 측면이 하나 있다:
YAML이 처음 소비될 때 참조가 확장된 다음 버려진다.

따라서 위 예제를 디코딩한 다음 다시 인코딩하면 결과 YAML은 다음과 같다:

```yaml
coffee: yes, please
favorite: Cappuccino
coffees:
- Latte
- Cappuccino
- Espresso
```

Helm과 Kubernetes는 종종 YAML 파일을 읽고, 수정하고, 다시 작성하기 때문에
앵커가 손실된다.
