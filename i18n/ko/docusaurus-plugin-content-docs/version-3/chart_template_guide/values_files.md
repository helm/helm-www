---
title: Values 파일
description: "--values 플래그 사용법 설명"
sidebar_position: 4
---

이전 섹션에서 우리는 헬름 템플릿에서 제공하는 빌트인 객체를 살펴봤다. 기본 객체 중 하나는 `Values`이다. 이 객체는 차트로 전달된 값에 접근할 수 있게 해준다. 이 객체의 내용들은 여러 출처에서 나온다:

- 본 차트에 포함된 `values.yaml` 파일
- 서브 차트의 경우, 부모 차트의 `values.yaml` 파일
- `-f` 플래그 (`helm install -f myvals.yaml ./mychart`)가 있는 `helm install` 또는 `helm upgrade`로 전달된 `values.yaml` 파일
- `--set` (such as `helm install --set foo=bar ./mychart`)과 함께 전달된 개별 매개변수

위 목록은 적용될 값의 순서이다: 기본 값인 `values.yaml`은 부모 차트의 `values.yaml`에 의해 재정의될 수 있고, 사용자가 제공한 `values.yaml` 파일에 의해 재정의될 수 있으며, `--set` 매개변수에 의해 재정의될 수 있다.

Values 파일은 일반 YAML 파일이다. `mychart/values.yaml` 파일을 편집한 후 ConfigMap 템플릿을 편집해보자.

`values.yaml`의 기본값을 제거하고, 다음 하나의 매개변수만 설정하자:

```yaml
favoriteDrink: coffee
```

이제 템플릿 내부에서 다음과 같이 사용할 수 있다: 

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

마지막 줄에서 `Values`의 속성으로 `favoriteDrink`를 사용했다:
`{{ .Values.favoriteDrink }}`.

적용된 결과를 확인해보자.

```console
$ helm install geared-marsupi ./mychart --dry-run --debug
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: geared-marsupi
LAST DEPLOYED: Wed Feb 19 23:21:13 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
favoriteDrink: coffee

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: geared-marsupi-configmap
data:
  myvalue: "Hello World"
  drink: coffee
```

`favoriteDrink`가 기본 `values.yaml` 파일에서 `coffee`로 설정했기 때문에, 그 값이 템플릿에 표시되었다. 우리는 `helm install` 사용 시 `--set` 플래그를 추가하여 해당 값을 쉽게 재정의할 수 있다:

```console
$ helm install solid-vulture ./mychart --dry-run --debug --set favoriteDrink=slurm
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: solid-vulture
LAST DEPLOYED: Wed Feb 19 23:25:54 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
favoriteDrink: slurm

COMPUTED VALUES:
favoriteDrink: slurm

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: solid-vulture-configmap
data:
  myvalue: "Hello World"
  drink: slurm
```

`--set` 플래그는 기본 `values.yaml` 파일보다 높은 우선순위를 가지고 있으므로, 템플릿의 값이 `drink: slurm`으로 재정의되었다.

Values 파일에는 구조화된 값들을 더 추가할 수 있다. 예를 들어, `values.yaml` 파일에 `favorite` 섹션을 추가한 다음 몇 가지 키를 더 추가할 수 있다:

```yaml
favorite:
  drink: coffee
  food: pizza
```

이를 적용하기 위해 템플릿을 약간 수정해보자:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink }}
  food: {{ .Values.favorite.food }}
```

이런 방식으로 중첩된 값을 사용할 수 있지만, 평면화(flat)한 값을 사용하여 트리 구조를 얕게 유지하는 것을 권장한다. 서브 차트에 값을 할당할 때, 트리 구조를 사용하여 값을 지정하는 방법을 알아보자.

## 기본 키 삭제하기

기본 값에서 키를 삭제하는 경우, 삭제할 키의 값을 `null`로 지정할 수 있다. 이 경우 헬름은 재정의된 키를 제거할 것이다. 

예를 들어, Drupal 차트는 사용자 정의 이미지 사용하는 경우 활성 프로브를 구성할 수 있다. 기본 값은 다음과 같다:

```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

만약 활성 프로브를 `httpGet` 대신에 `exec`를 사용하여 `--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]`로 대체하고 싶다면, Helm은 기본 키와 재정의된 키를 함께 병합하여 다음과 같은 YAML을 생성할 것이다:

```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  exec:
    command:
    - cat
    - docroot/CHANGELOG.txt
  initialDelaySeconds: 120
```

하지만, Kubernetes는 둘 이상의 활성 프로브 핸들러를 정의할 수 없기 때문에 실행에 실패한다. 이 문제를 해결하려면, `livenessProbe.httpGet`을 null로 설정하여 해당 키를 삭제해야 한다:

```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

몇 가지의 빌트인 객체를 이용하여 템플릿에 값을 전달했다. 이제 템플릿 엔진의 함수와 파이프라인에 대해 알아보자. 
