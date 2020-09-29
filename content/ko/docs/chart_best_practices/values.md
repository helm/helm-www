---
title: "값"
description: "값을 구성하고 사용하는 방법을 집중적으로 다룬다."
weight: 2
---

이 부분은 모범사례 가이드의 일부로서 값(values)을 사용하는 방법을 다룬다.
여기서는 차트의 `values.yaml` 파일을 설계하는 데 초점을 맞추고, 값을 어떻게 구성하고 사용할지에 대한 권고사항을 제시한다.

## 네이밍 컨벤션

변수 이름은 소문자로 시작해야하며 단어는 카멜케이스로 
구분해야 한다.

올바른 경우:

```yaml
chicken: true
chickenNoodleSoup: true
```

잘못된 경우:

```yaml
Chicken: true  # 첫 글자가 대문자이면 빌트인 변수와 충돌이 발생할 수 있다
chicken-noodle-soup: true # 변수명에 하이픈(-)을 사용하지 말자
```

헬름의 모든 빌트인 변수는 사용자 정의 값과 쉽게 구분할 수 있도록
대문자로 시작한다: `.Release.Name`,
`.Capabilities.KubeVersion`.

## 평면화(flat) 값, 중첩된(nested) 값

YAML 은 유연한 형식으로, 값은 깊게 중첩되거나 평면화 될 수 있다.

중첩된 경우:

```yaml
server:
  name: nginx
  port: 80
```

평면화된 경우:

```yaml
serverName: nginx
serverPort: 80
```

대부분의 경우, 중첩된 경우보다는 평면화된 경우를 선호하게 된다. 그 이유는 템플릿 개발자와
사용자에게 더 간단하기 때문이다.


최적의 안전성을 위해, 모든 수준에서 중첩된 값을 확인해야 한다.

```
{{ if .Values.server }}
  {{ default "none" .Values.server.name }}
{{ end }}
```

모든 중첩된 계층에 대하여 존재 유무를 점검해야 한다. 다만 평면화된
구성의 경우, 이러한 검사를 건너뛸 수 있으므로 템플릿을 더 쉽게 읽고
사용할 수 있다.

```
{{ default "none" .Values.serverName }}
```

관련 변수가 많고 그 중 하나 이상이 선택 사항이 아닌 경우, 중첩된 값을
사용하여 가독성을 높일 수 있다.

## 자료형을 명확히 하자

YAML 의 유형에 대한 강제적인 규칙은 때때로 직관적이지 못하다. 예를 들어
`foo: false` 는 `foo: "false"` 와 동일하지 않다. `foo: 12345678` 과 같은
큰 정수는 경우에 따라 수학적 표기법으로 변환된다.

유형 변환 오류를 피하는 가장 쉬운 방법은 문자열에 대해서만 명시하고 이 외에는 명시하지 않는 것이다.
혹은 더 간단하게, _모두 인용부호로 감싸서 문자열로 만드는 것이다_. 

종종 정수형의 캐스팅 문제를 방지하기위해, 정수도 문자열로 저장하고 템플릿에서 
`{{ int $value }}` 를 사용하여 문자열에서 다시 정수로 변환하는 것이
유리하다.

대부분의 경우 명시적 유형 태그가 존중되므로 `foo: !!string 1234` 는
`1234` 를 문자열로 처리해야 한다. _그러나_ YAML 파서는 태그를 사용하므로 한번의 구문 분석 후에는
유형 데이터가 손실된다.

## 사용자가 값을 어떻게 사용할지를 고려하자

값에는 다음과 같은 세 가지 출처가 있다.
There are three potential sources of values:

- 차트의 `values.yaml` 파일
- `helm install -f` 또는 `helm upgrade -f` 에서 제공하는 값 파일
- `helm install` 또는 `helm upgrade` 의 `--set` 또는 `--set-string` 플래그에 
  전달된 값

값의 구조를 디자인 할 때 차트 사용자는 `-f` 플래그 또는 `--set` 
옵션을 통해 값을 재정의 
할 수 있다.

`--set` 은 표현력이 더 제한적이므로, `values.yaml` 파일을 작성하기 위한
첫 번째 지침은, _`--set` 에서 쉽게 재정의 할 수 있도록 하는 것이다_.

이러한 이유로 맵을 사용하여 값 파일을 구조화하는 것이 더 좋다.

`--set` 과 함께 사용하기 어려운 경우

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

위의 내용은 헬름 `<=2.4` 에서는 `--set` 으로 표현할 수 없다. 헬름 2.5 에서
foo 의 포트에 액세스 하는 것은 `--set servers[0].port=80` 이다.
사용자가 파악하기 어려울 뿐만 아니라 나중에 `서버` 의 순서가 변경되면
오류가 발생하기 쉽다.

사용하기 쉬운 경우:

```yaml
servers:
  foo:
    port: 80
  bar:
    port: 81
```

foo 의 포트에 접근하는 것이 훨씬 명확하다: `--set servers.foo.port=80`.

## `values.yaml`을 문서화하자

`values.yaml` 에 정의된 모든 속성은 문서화 되어야 한다. 문서
문자열은 설명하는 속성의 이름으로 시작하고 최소한 한 문장으로 된
설명을 제공해야 한다.

잘못된 경우:

```yaml
# the host name for the webserver
serverHost: example
serverPort: 9191
```

올바른 경우:

```yaml
# serverHost is the host name for the webserver
serverHost: example
# serverPort is the HTTP listener port for the webserver
serverPort: 9191
```

각 주석을 문서화하는 매개 변수의 이름으로 시작하면
문서를 쉽게 정리할 수 있으며, 문서화 도구가 문서 문자열과 이를 설명하는 매개변수를 안정적으로 연관시킬 수 있게 해준다.
