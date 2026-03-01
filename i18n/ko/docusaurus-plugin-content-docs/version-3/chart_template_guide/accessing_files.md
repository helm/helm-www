---
title: 템플릿 내부 파일 접근하기
description: 템플릿 안에 있는 파일에 접근하는 방법
sidebar_position: 10
---

이전 섹션에서 명명된 템플릿을 만들고 접근하는 몇 가지 방법을 살펴보았다.
이를 통해 다른 템플릿에서 필요한 템플릿을 쉽게 가져올 수 있다.
하지만 때로는 _템플릿이 아닌 파일_ 을 가져와서
그 내용을 템플릿 렌더러를 거치지 않고 직접 주입하고 싶을 때가 있다.

Helm은 `.Files` 객체를 통해 파일에 접근할 수 있게 해 준다. 템플릿 예제를 살펴보기 전에
이 기능이 어떻게 작동하는지 알아야 할 몇 가지가 있다:

- Helm 차트에 추가 파일을 넣어도 된다. 이 파일들은 함께 번들로 묶인다.
  하지만 주의가 필요하다. Kubernetes 객체의 저장 제한 때문에
  차트는 1M보다 작아야 한다.
- 일부 파일은 `.Files` 객체를 통해 접근할 수 없는데,
  주로 보안상의 이유 때문이다.
  - `templates/` 안에 있는 파일은 접근할 수 없다.
  - `.helmignore`를 사용하여 제외된 파일은 접근할 수 없다.
  - 부모 차트를 포함하여, Helm 애플리케이션 [하위 차트](./subcharts_and_globals.md) 외부에 있는 파일은 접근할 수 없다.
- 차트는 UNIX 모드 정보를 보존하지 않으므로, `.Files` 객체에 관해서는
  파일 수준 권한이 파일 가용성에 영향을 미치지 않는다.

<!-- (see https://github.com/jonschlinkert/markdown-toc) -->

<!-- toc -->

- [기본 예제](#기본-예제)
- [경로 헬퍼](#경로-헬퍼)
- [글롭(Glob) 패턴](#글롭glob-패턴)
- [ConfigMap과 Secret 유틸리티 함수](#configmap과-secret-유틸리티-함수)
- [인코딩](#인코딩)
- [Lines](#lines)

<!-- tocstop -->

## 기본 예제

위의 주의 사항을 알았으니, 이제 세 개의 파일을 읽어서 ConfigMap에 넣는 템플릿을 작성해 보자.
시작하기 위해 차트에 세 개의 파일을 추가하고, 세 파일 모두 `mychart/` 디렉토리 안에 직접 넣는다.

`config1.toml`:

```toml
message = "Hello from config 1"
```

`config2.toml`:

```toml
message = "This is config 2"
```

`config3.toml`:

```toml
message = "Goodbye from config 3"
```

이 파일들은 각각 간단한 TOML 파일이다(옛날 Windows INI 파일을 생각하면 된다).
파일 이름을 알고 있으므로 `range` 함수를 사용하여 파일들을 순회하며
그 내용을 ConfigMap에 주입할 수 있다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}
```

이 ConfigMap은 이전 섹션에서 논의한 여러 기법을 사용한다.
예를 들어, `.Files` 객체에 대한 참조를 담기 위해 `$files` 변수를 만든다.
또한 `tuple` 함수를 사용하여 순회할 파일 목록을 만든다.
그런 다음 각 파일 이름(`{{ . }}: |-`)을 출력하고 그 뒤에 파일 내용(`{{ $files.Get . }}`)을 출력한다.

이 템플릿을 실행하면 세 파일의 내용이 모두 포함된 단일 ConfigMap이 생성된다:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: quieting-giraf-configmap
data:
  config1.toml: |-
    message = "Hello from config 1"

  config2.toml: |-
    message = "This is config 2"

  config3.toml: |-
    message = "Goodbye from config 3"
```

## 경로 헬퍼

파일을 다룰 때, 파일 경로 자체에 대한 표준 작업을 수행하는 것이 매우 유용할 수 있다.
이를 돕기 위해 Helm은 Go의 [path](https://golang.org/pkg/path/) 패키지에서
많은 함수를 가져와 사용할 수 있게 해 준다. 이 함수들은 Go 패키지와 같은 이름으로 접근할 수 있지만,
첫 글자가 소문자이다. 예를 들어, `Base`는 `base`가 된다.

가져온 함수들은 다음과 같다:
- Base
- Dir
- Ext
- IsAbs
- Clean

## 글롭(Glob) 패턴

차트가 커지면서 파일을 더 체계적으로 정리해야 할 필요가 생길 수 있다.
이를 위해 [글롭 패턴](https://godoc.org/github.com/gobwas/glob)의 모든 유연성을 활용하여
특정 파일을 추출하는 데 도움이 되는 `Files.Glob(pattern string)` 메서드를 제공한다.

`.Glob`은 `Files` 타입을 반환하므로, 반환된 객체에서 `Files`의 모든 메서드를 호출할 수 있다.

예를 들어, 다음과 같은 디렉토리 구조를 상상해 보자:

```
foo/:
  foo.txt foo.yaml

bar/:
  bar.go bar.conf baz.yaml
```

Glob을 사용하는 여러 방법이 있다:

```yaml
{{ $currentScope := .}}
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
    {{- with $currentScope}}
        {{ .Files.Get $path }}
    {{- end }}
{{ end }}
```

또는

```yaml
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
      {{ $.Files.Get $path }}
{{ end }}
```

## ConfigMap과 Secret 유틸리티 함수

(Helm 2.0.2 이후 사용 가능)

파일 내용을 ConfigMap과 Secret에 넣어서 런타임에 파드에 마운트하는 것은 매우 일반적인 작업이다.
이를 돕기 위해 `Files` 타입에 몇 가지 유틸리티 메서드를 제공한다.

파일을 더 체계적으로 정리하려면 이러한 메서드를 `Glob` 메서드와 함께 사용하는 것이 특히 유용하다.

위의 [글롭(Glob) 패턴](#글롭glob-패턴) 예제에서 나온 디렉토리 구조를 가정하면:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: conf
data:
{{ (.Files.Glob "foo/*").AsConfig | indent 2 }}
---
apiVersion: v1
kind: Secret
metadata:
  name: very-secret
type: Opaque
data:
{{ (.Files.Glob "bar/*").AsSecrets | indent 2 }}
```

## 인코딩

파일을 가져와서 템플릿이 base-64로 인코딩하도록 하여
안전한 전송을 보장할 수 있다:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secret
type: Opaque
data:
  token: |-
    {{ .Files.Get "config1.toml" | b64enc }}
```

위 코드는 이전에 사용했던 동일한 `config1.toml` 파일을 가져와서 인코딩한다:

```yaml
# Source: mychart/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: lucky-turkey-secret
type: Opaque
data:
  token: |-
    bWVzc2FnZSA9ICJIZWxsbyBmcm9tIGNvbmZpZyAxIgo=
```

## Lines

때로는 템플릿에서 파일의 각 줄에 접근하는 것이 필요할 수 있다.
이를 위해 편리한 `Lines` 메서드를 제공한다.

`range` 함수를 사용하여 `Lines`를 순회할 수 있다:

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

`helm install` 중에 차트 외부의 파일을 전달할 방법은 없다.
따라서 사용자에게 데이터를 제공받으려면 `helm install -f` 또는
`helm install --set`을 사용하여 로드해야 한다.

이것으로 Helm 템플릿 작성을 위한 도구와 기법에 대한 심층 탐구를 마친다.
다음 섹션에서는 특별한 파일인 `templates/NOTES.txt`를 사용하여
차트 사용자에게 설치 후 지침을 보내는 방법을 살펴볼 것이다.
