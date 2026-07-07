---
title: "차트 개발 팁과 비법"
description: "Covers some of the tips and tricks Helm chart developers have learned while building production-quality charts."
weight: 1
---

이 가이드는 핼름 차트 개발자들이 production-quality 차트들을 만들면서 배운 팁과 비법을 
담고 있습니다.  

## 템플릿 함수 이해하기

Helm uses [Go templates](https://godoc.org/text/template) for templating your
resource files. While Go ships several built-in functions, we have added many
others.

First, we added all of the functions in the [Sprig
library](https://masterminds.github.io/sprig/).

We also added two special template functions: `include` and `required`. The
`include` function allows you to bring in another template, and then pass the
results to other template functions.

For example, this template snippet includes a template called `mytpl`, then
lowercases the result, then wraps that in double quotes.

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

The `required` function allows you to declare a particular values entry as
required for template rendering.  If the value is empty, the template rendering
will fail with a user submitted error message.

The following example of the `required` function declares an entry for
.Values.who is required, and will print an error message when that entry is
missing:

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## 문자열에는 따옴표를 쓰고, 정수형에는 쓰지 말자

문자열 데이터를 사용할 때에는 문자열로 그대로 두기보다 
쌍따옴표로 값을 묶는 것이 안전합니다.:

```yaml
name: {{ .Values.MyName | quote }}
```

하지만 integer는 많은 경우에 쿠버네티스에서 파싱에러가 발생할 수 있으니 
_쌍따옴표를 사용하지 마세요._

```yaml
port: {{ .Values.Port }}
```

env 변수들의 경우에는 앞서 말한 내용과는 다르게 모든 값들을 쌍따옴표로 묶는 것이 좋습니다.:

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## 'include' 함수 사용하기

Go 언어의 내장 지시어인 `template`를 사용해 다른 템플릿으로 부터  템플릿을 가져올 수 있는 방법을 
제공합니다. 하지만 이 지시어는 파이프 라인과는 함께 사용 될 수 없습니다. 

헬름에는 특별한 함수 `include`가 있습니다. 이 함수는 다른 템플릿으로 부터 템플릿을 가져오고 
그 템플릿의 출력 값에 연산을 수행 할 수 있도록 합니다. 

```
{{ include "toYaml" $value | indent 2 }}
```

위의 예제에는 `toYaml`이라고 불리는 템플릿이 포함되어 있습니다. 이 템플릿은 `$value`에 값을 전달하고 
그 출력 값을 `indent` 함수에 전달합니다. 

YAML이 들여쓰기와 공백을 중요하게 생각하기 때문에 이 방법은 문맥에 맞는 적절한 들여쓰기를 하면서 코드 스니펫을 
가져올 수 있는 좋은 방법입니다. 

## 'required' 함수 사용하기

Go 언어는 map에 존재하지 않은 키에 접근하는 상황을 제어하기 위한 템플릿 옵션이 있습니다. 
주로 `template.Options("missingkey=option")`로 설정되며 `option`값은 `default`, `zero` 혹은 `error`가 될 수 있습니다. 
옵션(option) 설정을 error로 하면 map에 존재하지 않는 키에 접근하려는 모든 상황에 에러를 발생하며 실행을 멈출 것입니다. 
차트 개발자가 `values.yaml`에서 값을 가져올 때 이러한 규칙을 적용시키고 싶은 상황이 있을 수 있습니다. 

`required` 함수는 개발자가 템플릿이 랜더링될 때 필수로 입력되어야 하는 값(항목)을 선언할 수 있도록 합니다. 
이 값(항목)이 `values.yaml`에 비어있다면, template은 랜더링을 하지 않고 개발자가 작성한 에러 메세지를 반환할 것입니다. 

예를 들어서:

```
{{ required "A valid foo is required!" .Values.foo }}
```

위의 예제는 `.Values.foo`가 정의 되어있다면 값을 랜더링 하고, 
`.Values.foo`가 정의되어 있지 않다면 랜더링에 실패하고 종료할 것 입니다. 

## 'tpl' 함수 사용하기

`tpl` 함수를 이용하여 템플릿내에 정의 된 템플릿 형식의 문자열의 렌더링 값을 구할 수 있습니다. 이 함수는 차트에 템플릿 문자열을 변수로 전달하거나 외부 설정 파일들을 랜더링 할때 유용합니다. 문법: `{{ tpl TEMPLATE_STRING VALUES }}`

예를 들어:

```yaml
# values
template: "{{ .Values.name }}"
name: "Tom"

# template
{{ tpl .Values.template . }}

# output
Tom
```

외부 설정 값을 랜더링 하는 예제:

```yaml
# external configuration file conf/app.conf
firstName={{ .Values.firstName }}
lastName={{ .Values.lastName }}

# values
firstName: Peter
lastName: Parker

# template
{{ tpl (.Files.Get "conf/app.conf") . }}

# output
firstName=Peter
lastName=Parker
```

## 이미지 풀 시크릿 생성하기
Image pull secrets은 _registry_, _username_, 그리고
_password_의 조합이 기본입니다. 앱을 띄우는데 이 값들이 필요할 수 있지만, 이 값을 만들기 위해서는 `base64`를 몇번 수행해야 합니다. 우리는 helper 템플릿을 작성하여 시크릿 페이로드로써 사용될 도커 설정 파일을 구성할 수 있습니다. 여기 예제가 있습니다.: 

먼저 `values.yaml`에 다음과 같은 신원정보가 정의 되어 있다고 가정해 봅시다.:
```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

그 다음, helper 템플릿을 다음과 같이 정의합니다.:
```
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":\"%s\",\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username .password .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

마지막으로 큰 템플릿에서 helper 템플릿을 사용해 시크릿을 생성합니다.:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## 자동 디플로이먼트 전환(roll)

Often times ConfigMaps or Secrets are injected as configuration files in
containers or there are other external dependency changes that require rolling
pods. Depending on the application a restart may be required should those be
updated with a subsequent `helm upgrade`, but if the deployment spec itself
didn't change the application keeps running with the old configuration resulting
in an inconsistent deployment.

The `sha256sum` function can be used to ensure a deployment's annotation section
is updated if another file changes:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

In the event you always want to roll your deployment, you can use a similar
annotation step as above, instead replacing with a random string so it always
changes and causes the deployment to roll:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

Both of these methods allow your Deployment to leverage the built in update
strategy logic to avoid taking downtime.

NOTE: In the past we recommended using the `--recreate-pods` flag as another
option. This flag has been marked as deprecated in Helm 3 in favor of the more
declarative method above.

## 헬름에 리소스를 언인스톨하지 않도록 알리기

Sometimes there are resources that should not be uninstalled when Helm runs a
`helm uninstall`. Chart developers can add an annotation to a resource to
prevent it from being uninstalled.

```yaml
kind: Secret
metadata:
  annotations:
    "helm.sh/resource-policy": keep
[...]
```

(Quotation marks are required)

The annotation `"helm.sh/resource-policy": keep` instructs Helm to skip deleting
this resource when a helm operation (such as `helm uninstall`, `helm upgrade` or
`helm rollback`) would result in its deletion. _However_, this resource becomes
orphaned. Helm will no longer manage it in any way. This can lead to problems if
using `helm install --replace` on a release that has already been uninstalled,
but has kept resources.

## "Partials" 및 템플릿 포함(include) 사용하기

Sometimes you want to create some reusable parts in your chart, whether they're
blocks or template partials. And often, it's cleaner to keep these in their own
files.

In the `templates/` directory, any file that begins with an underscore(`_`) is
not expected to output a Kubernetes manifest file. So by convention, helper
templates and partials are placed in a `_helpers.tpl` file.

## 의존성이 많은 복잡한 차트

Many of the charts in the [official charts
repository](https://github.com/helm/charts) are "building blocks" for creating
more advanced applications. But charts may be used to create instances of
large-scale applications. In such cases, a single umbrella chart may have
multiple subcharts, each of which functions as a piece of the whole.

The current best practice for composing a complex application from discrete
parts is to create a top-level umbrella chart that exposes the global
configurations, and then use the `charts/` subdirectory to embed each of the
components.

## YAML은 JSON의 상위집합이다

According to the YAML specification, YAML is a superset of JSON. That means that
any valid JSON structure ought to be valid in YAML.

This has an advantage: Sometimes template developers may find it easier to
express a datastructure with a JSON-like syntax rather than deal with YAML's
whitespace sensitivity.

As a best practice, templates should follow a YAML-like syntax _unless_ the JSON
syntax substantially reduces the risk of a formatting issue.

## 랜덤 값을 생성할 때는 주의하자

There are functions in Helm that allow you to generate random data,
cryptographic keys, and so on. These are fine to use. But be aware that during
upgrades, templates are re-executed. When a template run generates data that
differs from the last run, that will trigger an update of that resource.

## 하나의 명령어로 설치 또는 업그레이드하기

Helm provides a way to perform an install-or-upgrade as a single command. Use
`helm upgrade` with the `--install` command. This will cause Helm to see if the
release is already installed. If not, it will run an install. If it is, then the
existing release will be upgraded.

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
