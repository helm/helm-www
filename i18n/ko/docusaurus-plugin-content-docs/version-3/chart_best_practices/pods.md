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

`deployment.yaml`는

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

`values.yaml`는

```yaml
image:
  pullPolicy: IfNotPresent
```

라고 하면 그에 따라 `helm create`는 `imagePullPolicy` 기본값으로 `IfNotPresent`을 설정하게 된다.

비슷하게, 쿠버네티스에서도 따로 정의하지 않더라도 `imagePullPolicy`의 기본값은 `IfNotPresent`이 된다.
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

위의 것은 잘된 사례인데, 셋(set)과 파드 사이에 관계가 맺어졌기 때문이다.

이것은 디플로이먼트와 같은 셋(set)의 경우에 더욱 중요하다.
관계가 맺어져 있지 않다면, _모든_ 레이블들이 매칭되는 파드 선택에 사용되며,
버전이나 릴리스 날짜와 같이 변경되는 레이블을 사용하는 경우 깨질 수 있다.
