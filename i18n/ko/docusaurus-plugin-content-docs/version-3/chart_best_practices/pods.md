---
title: 파드와 파드템플릿
description: 차트 매니페스트에 있는 파드와 파드템플릿 부분의 형식을 논한다.
sidebar_position: 6
---

이 부분은 모범사례 가이드의 일부로서 차트 매니페스트에 있는 파드와 파드템플릿 부분의 형식을 논한다.

파드템플릿을 사용하는 리소스들(일부)은 다음과 같다.

- 디플로이먼트(Deployment)
- 레플리케이션컨트롤러(ReplicationController)
- 레플리카셋(ReplicaSet)
- 데몬셋(DaemonSet)
- 스테이트풀셋(StatefulSet)

## 이미지

컨테이너 이미지는 고정된 태그나 이미지의 SHA를 사용해야 한다.
`latest`, `head`, `canary` 등 "유동적인" 목적으로 고안된 태그를 
사용해서는 안된다.

이미지를 쉽게 교체하기 위해 `values.yaml` 파일 내에 이미지를 정의할 수 있다.

```yaml
image: {{ .Values.redisImage | quote }}
```

`values.yaml` 내에서 이미지와 태그를 각각의 필드로 정의할 수도 있다.

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

`helm create`는 `deployment.yaml` 파일에서 다음과 같이 설정하여 기본적으로 `imagePullPolicy`를 `IfNotPresent`로 설정한다.

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

그리고 `values.yaml`에서는 다음과 같이 설정한다.

```yaml
image:
  pullPolicy: IfNotPresent
```

마찬가지로, Kubernetes에서도 `imagePullPolicy`가 정의되지 않은 경우 기본값은 `IfNotPresent`이다.
`IfNotPresent` 외에 다른 값을 사용하려면, `values.yaml`에 있는 값을 원하는 값으로 바꾸면 된다.


## 파드템플릿에는 셀렉터가 선언되어야 한다

모든 파드템플릿 섹션에는 셀렉터를 지정해야 한다. 예를 들면,

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

이것은 리소스와 파드 간의 관계를 명확히 해주므로 좋은 사례이다.

Deployment와 같은 리소스의 경우 이것이 더욱 중요하다.
셀렉터를 지정하지 않으면 _모든_ 레이블이 매칭되는 파드를 선택하는 데 사용되며,
버전이나 릴리스 날짜와 같이 변경되는 레이블을 사용하는 경우 깨질 수 있다.
