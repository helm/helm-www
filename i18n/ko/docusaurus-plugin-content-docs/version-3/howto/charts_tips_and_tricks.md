---
title: 차트 개발 팁과 비법
description: 헬름 차트 개발자들이 프로덕션 수준의 차트를 만들면서 배운 팁과 비법을 다룹니다.
sidebar_position: 1
---

이 가이드는 헬름 차트 개발자들이 프로덕션 수준의 차트를 만들면서 배운 팁과 비법을 담고 있습니다.

## 템플릿 함수 이해하기

헬름은 리소스 파일의 템플릿을 위해 [Go 템플릿](https://godoc.org/text/template)을 사용합니다. Go는 여러 가지 내장 함수를 제공하지만, 헬름은 많은 추가 함수들을 제공합니다.

먼저 [Sprig 라이브러리](https://masterminds.github.io/sprig/)에 있는 모든 함수를 추가했습니다. 보안상의 이유로 `env`와 `expandenv`는 제외됩니다.

그리고 두 가지 특별한 템플릿 함수인 `include`와 `required`를 추가했습니다. `include` 함수는 다른 템플릿을 불러오고, 그 결과를 다른 템플릿 함수에 전달할 수 있게 해줍니다.

예를 들어, 이 템플릿 조각은 `mytpl`이라는 템플릿을 포함한 후, 결과를 소문자로 변환하고, 그것을 큰따옴표로 감쌉니다.

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

`required` 함수는 템플릿 렌더링을 위해 특정 값 항목이 필수임을 선언할 수 있게 해줍니다. 만약 값이 비어있다면, 템플릿 렌더링은 사용자가 제출한 오류 메시지와 함께 실패하게 됩니다.

다음은 `required` 함수의 예시로, `.Values.who` 항목이 필수로 선언되며, 해당 항목이 없을 경우 오류 메시지를 출력합니다:

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## 문자열에는 따옴표를 쓰고, 정수형에는 쓰지 말자

문자열 데이터를 사용할 때에는 문자열을 그대로 두기보다 쌍따옴표로 값을 묶는 것이 안전합니다:

```yaml
name: {{ .Values.MyName | quote }}
```

하지만 정수형의 경우 많은 경우에 쿠버네티스에서 파싱 에러가 발생할 수 있으니 _쌍따옴표를 사용하지 마세요._

```yaml
port: {{ .Values.Port }}
```

이 내용은 env 변수 값에는 적용되지 않습니다. 정수를 나타내더라도 문자열로 처리되어야 합니다:

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## 'include' 함수 사용하기

Go 언어의 내장 지시어인 `template`를 사용해 다른 템플릿으로부터 템플릿을 가져올 수 있습니다. 하지만 이 지시어는 Go 템플릿 파이프라인과는 함께 사용할 수 없습니다.

헬름에는 특별한 함수 `include`가 있습니다. 이 함수는 다른 템플릿을 가져오고 그 템플릿의 출력 값에 연산을 수행할 수 있도록 합니다:

```
{{ include "toYaml" $value | indent 2 }}
```

위의 예제에는 `toYaml`이라고 불리는 템플릿이 포함되어 있습니다. 이 템플릿은 `$value`에 값을 전달하고 그 출력 값을 `indent` 함수에 전달합니다.

YAML이 들여쓰기와 공백을 중요하게 생각하기 때문에 이 방법은 문맥에 맞는 적절한 들여쓰기를 하면서 코드 스니펫을 가져올 수 있는 좋은 방법입니다.

## 'required' 함수 사용하기

Go 언어는 map에 존재하지 않는 키에 접근하는 상황을 제어하기 위한 템플릿 옵션이 있습니다. 주로 `template.Options("missingkey=option")`로 설정되며 `option` 값은 `default`, `zero` 혹은 `error`가 될 수 있습니다. 옵션 설정을 error로 하면 map에 존재하지 않는 키에 접근하려는 모든 상황에서 에러를 발생하며 실행을 멈출 것입니다. 차트 개발자가 `values.yaml`의 특정 값에 대해 이러한 규칙을 적용하고 싶은 상황이 있을 수 있습니다.

`required` 함수는 개발자가 템플릿 렌더링 시 필수로 입력되어야 하는 값 항목을 선언할 수 있도록 합니다. 이 항목이 `values.yaml`에서 비어있다면, 템플릿은 렌더링되지 않고 개발자가 작성한 에러 메시지를 반환할 것입니다.

예를 들어:

```
{{ required "A valid foo is required!" .Values.foo }}
```

위의 예제는 `.Values.foo`가 정의되어 있다면 값을 렌더링하고, `.Values.foo`가 정의되어 있지 않다면 렌더링에 실패하고 종료할 것입니다.

## 'tpl' 함수 사용하기

`tpl` 함수를 이용하여 템플릿 내에 정의된 템플릿 형식의 문자열의 렌더링 값을 구할 수 있습니다. 이 함수는 차트에 템플릿 문자열을 변수로 전달하거나 외부 설정 파일들을 렌더링할 때 유용합니다. 문법: `{{ tpl TEMPLATE_STRING VALUES }}`

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

외부 설정 파일을 렌더링하는 예제:

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

이미지 풀 시크릿은 기본적으로 _registry_, _username_, 그리고 _password_의 조합입니다. 앱을 배포하는 데 이 값들이 필요할 수 있지만, 이를 만들기 위해서는 `base64`를 몇 번 실행해야 합니다. 헬퍼 템플릿을 작성하여 시크릿 페이로드로 사용될 Docker 설정 파일을 구성할 수 있습니다. 여기 예제가 있습니다:

먼저 `values.yaml`에 다음과 같은 자격 증명이 정의되어 있다고 가정해 봅시다:

```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

그 다음, 헬퍼 템플릿을 다음과 같이 정의합니다:

```
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":%s,\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username (.password | quote) .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

마지막으로 더 큰 템플릿에서 헬퍼 템플릿을 사용해 시크릿 매니페스트를 생성합니다:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## 자동 디플로이먼트 롤링

ConfigMap이나 Secret이 컨테이너에 설정 파일로 주입되거나 다른 외부 의존성 변경으로 인해 파드를 롤링해야 하는 경우가 종종 있습니다. 애플리케이션에 따라 후속 `helm upgrade` 시 재시작이 필요할 수 있지만, 디플로이먼트 스펙 자체가 변경되지 않으면 애플리케이션은 이전 설정으로 계속 실행되어 일관성 없는 배포가 발생합니다.

`sha256sum` 함수를 사용하여 다른 파일이 변경되면 디플로이먼트의 annotation 섹션이 업데이트되도록 할 수 있습니다:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

NOTE: 라이브러리 차트에 이것을 추가하는 경우 `$.Template.BasePath`에서 파일에 접근할 수 없습니다. 대신 `{{ include ("mylibchart.configmap") . | sha256sum }}`과 같이 정의를 참조할 수 있습니다.

항상 디플로이먼트를 롤링하고 싶다면, 위와 비슷한 annotation 단계를 사용하되 랜덤 문자열로 대체하여 항상 변경되고 디플로이먼트가 롤링되도록 할 수 있습니다:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

템플릿 함수를 호출할 때마다 고유한 랜덤 문자열이 생성됩니다. 즉, 여러 리소스에서 사용하는 랜덤 문자열을 동기화해야 하는 경우, 관련된 모든 리소스가 동일한 템플릿 파일에 있어야 합니다.

이 두 가지 방법 모두 디플로이먼트가 내장된 업데이트 전략 로직을 활용하여 다운타임을 방지할 수 있습니다.

NOTE: 과거에는 `--recreate-pods` 플래그를 다른 옵션으로 권장했습니다. 이 플래그는 위의 더 선언적인 방법을 위해 Helm 3에서 deprecated 되었습니다.

## 헬름에 리소스를 삭제하지 않도록 알리기

`helm uninstall`을 실행할 때 삭제되지 않아야 하는 리소스가 있을 수 있습니다. 차트 개발자는 리소스에 annotation을 추가하여 삭제되지 않도록 할 수 있습니다.

```yaml
kind: Secret
metadata:
  annotations:
    helm.sh/resource-policy: keep
[...]
```

`helm.sh/resource-policy: keep` annotation은 헬름 작업(`helm uninstall`, `helm upgrade` 또는 `helm rollback`)으로 인해 이 리소스가 삭제될 때 헬름이 삭제를 건너뛰도록 지시합니다. _하지만_ 이 리소스는 고아 상태가 됩니다. 헬름은 더 이상 어떤 방식으로도 이 리소스를 관리하지 않습니다. 이미 제거되었지만 리소스는 유지된 릴리스에 `helm install --replace`를 사용하면 문제가 발생할 수 있습니다.

## "Partials" 및 템플릿 포함 사용하기

차트에서 재사용 가능한 부분을 만들고 싶을 때가 있습니다. 블록이든 템플릿 partial이든 말입니다. 그리고 종종 이것들을 별도의 파일에 보관하는 것이 더 깔끔합니다.

`templates/` 디렉터리에서 밑줄(`_`)로 시작하는 파일은 쿠버네티스 매니페스트 파일을 출력하지 않습니다. 따라서 관례적으로 헬퍼 템플릿과 partial은 `_helpers.tpl` 파일에 배치합니다.

## 의존성이 많은 복잡한 차트

CNCF [Artifact Hub](https://artifacthub.io/packages/search?kind=0)에 있는 많은 차트들은 더 고급 애플리케이션을 만들기 위한 "빌딩 블록"입니다. 하지만 차트는 대규모 애플리케이션의 인스턴스를 만드는 데 사용될 수도 있습니다. 이러한 경우, 단일 우산(umbrella) 차트가 여러 서브차트를 가질 수 있으며, 각 서브차트는 전체의 일부로 기능합니다.

개별 부분들로 복잡한 애플리케이션을 구성하는 현재 모범 사례는 글로벌 설정을 노출하는 최상위 우산 차트를 만들고, `charts/` 하위 디렉터리를 사용하여 각 컴포넌트를 포함시키는 것입니다.

## YAML은 JSON의 상위집합이다

YAML 명세에 따르면, YAML은 JSON의 상위집합입니다. 즉, 모든 유효한 JSON 구조는 YAML에서도 유효해야 합니다.

이것의 장점이 있습니다: 때때로 템플릿 개발자들은 YAML의 공백 민감성을 다루는 것보다 JSON과 유사한 문법으로 데이터 구조를 표현하는 것이 더 쉽다고 느낄 수 있습니다.

모범 사례로서, 템플릿은 JSON 문법이 포맷팅 문제의 위험을 크게 줄이는 경우가 _아니라면_ YAML과 유사한 문법을 따라야 합니다.

## 랜덤 값을 생성할 때는 주의하자

헬름에는 랜덤 데이터, 암호화 키 등을 생성하는 함수들이 있습니다. 이것들을 사용해도 괜찮습니다. 하지만 업그레이드 중에 템플릿이 다시 실행된다는 점에 유의하세요. 템플릿 실행이 이전 실행과 다른 데이터를 생성하면, 해당 리소스의 업데이트가 트리거됩니다.

## 하나의 명령어로 설치 또는 업그레이드하기

헬름은 설치 또는 업그레이드를 단일 명령으로 수행하는 방법을 제공합니다. `helm upgrade`에 `--install` 플래그를 사용하세요. 이렇게 하면 헬름은 릴리스가 이미 설치되어 있는지 확인합니다. 설치되어 있지 않으면 설치를 실행하고, 설치되어 있으면 기존 릴리스를 업그레이드합니다.

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
