---
title: 템플릿 내부 파일 접근하기
description: 템플릿 안에 있는 파일에 접근하는 방법
sidebar_position: 10
---

이전 항목에서 지명 템플릿을 만들고 액세스하는 몇 가지 방법을 살펴보았다.
이런 방법으로 다른 템플릿에서 필요한 템플릿을 쉽게 가져올 수 있다.
하지만 때로는 _템플릿이 아닌 파일_ 을 가져와서
그 내용을 템플릿 렌더러(renderer)로 보내지 않고 직접 주입(inject)하려고 하는 경우가
있을 수 있다.

헬름은 `.Files` 객체를 통해 파일에 액세스할 수 있게 해준다. 템플릿 예제를 확인하기 전에
어떻게 작동하는지 살펴보자.

- 헬름 차트에 파일을 추가해도 된다. 추가된 파일들은 하나로 묶인다.
  다만, 쿠버네티스 객체 저장소에는 제한이 있어
  차트는 1M 보다 작아야 한다.
- 어떤 파일은 `.Files` 객체를 통해 액세스할 수 없는데,
  주로 보안 상의 이유 때문이다.
  - `templates/`에 있는 파일은 액세스할 수 없다.
  - `.helmignore`를 사용하여 제외된 파일은 액세스할 수 없다.
- 차트는 UNIX 모드 정보를 보존해주지 않으므로
  `.Files` 객체에서 온 파일의 경우, 파일 수준의 권한(permission)은
  파일의 가용성에 영향을 미치지 않는다.

<!-- (see https://github.com/jonschlinkert/markdown-toc) -->

<!-- toc -->

- [기본-예제](#기본-예제)
- [경로-헬퍼](#경로-헬퍼)
- [글롭glob-패턴](#글롭glob-패턴)
- [컨피그맵configmap과-시크릿secret-도구-함수](#컨피그맵configmap과-시크릿secret-도구-함수)
- [인코딩](#인코딩)
- [lines-메소드](#lines-메소드)

<!-- tocstop -->

## 기본 예제

With those caveats behind, let's write a template that reads three files into
our ConfigMap. To get started, we will add three files to the chart, putting all
three directly inside of the `mychart/` directory.

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

Each of these is a simple TOML file (think old-school Windows INI files). We
know the names of these files, so we can use a `range` function to loop through
them and inject their contents into our ConfigMap.

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

This config map uses several of the techniques discussed in previous sections.
For example, we create a `$files` variable to hold a reference to the `.Files`
object. We also use the `tuple` function to create a list of files that we loop
through. Then we print each file name (`{{ . }}: |-`) followed by the contents
of the file `{{ $files.Get . }}`.

Running this template will produce a single ConfigMap with the contents of all
three files:

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

When working with files, it can be very useful to perform some standard
operations on the file paths themselves. To help with this, Helm imports many of
the functions from Go's [path](https://golang.org/pkg/path/) package for your
use. They are all accessible with the same names as in the Go package, but with
a lowercase first letter. For example, `Base` becomes `base`, etc.

The imported functions are:
- Base
- Dir
- Ext
- IsAbs
- Clean

## 글롭(glob) 패턴

As your chart grows, you may find you have a greater need to organize your files
more, and so we provide a `Files.Glob(pattern string)` method to assist in
extracting certain files with all the flexibility of [glob
patterns](https://godoc.org/github.com/gobwas/glob).

`.Glob` returns a `Files` type, so you may call any of the `Files` methods on
the returned object.

For example, imagine the directory structure:

```
foo/:
  foo.txt foo.yaml

bar/:
  bar.go bar.conf baz.yaml
```

You have multiple options with Globs:


```yaml
{{ $currentScope := .}}
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
    {{- with $currentScope}}
        {{ .Files.Get $path }}
    {{- end }}
{{ end }}
```

Or

```yaml
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
      {{ $.Files.Get $path }}
{{ end }}
```

## 컨피그맵(ConfigMap)과 시크릿(Secret) 도구 함수

(Helm 2.0.2부터 사용가능)

It is very common to want to place file content into both ConfigMaps and
Secrets, for mounting into your pods at run time. To help with this, we provide
a couple utility methods on the `Files` type.

For further organization, it is especially useful to use these methods in
conjunction with the `Glob` method.

Given the directory structure from the [글롭glob-패턴](#글롭glob-패턴) example above:

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

You can import a file and have the template base-64 encode it to ensure
successful transmission:

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

The above will take the same `config1.toml` file we used before and encode it:

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

## Lines 메소드

Sometimes it is desirable to access each line of a file in your template. We
provide a convenient `Lines` method for this.

You can loop through `Lines` using a `range` function:

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

There is no way to pass files external to the chart during `helm
install`. So if you are asking users to supply data, it must be loaded using
`helm install -f` or `helm install --set`.

This discussion wraps up our dive into the tools and techniques for writing Helm
templates. In the next section we will see how you can use one special file,
`templates/NOTES.txt`, to send post-installation instructions to the users of
your chart.
