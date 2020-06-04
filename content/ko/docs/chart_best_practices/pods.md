---
title: "파드와 파드템플릿"
description: "차트 매니페스트에 있는 파드와 파드템플릿 부분의 형식을 논한다."
weight: 6
aliases: ["/docs/topics/chart_best_practices/pods/"]
---

이 부분은 모범사례 가이드의 일부로서 차트 매니페스트에 있는 파드와 파드템플릿 부분의 형식을 논한다.

The following (non-exhaustive) list of resources use PodTemplates:

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## 이미지

A container image should use a fixed tag or the SHA of the image. It should not
use the tags `latest`, `head`, `canary`, or other tags that are designed to be
"floating".


Images _may_ be defined in the `values.yaml` file to make it easy to swap out
images.

```yaml
image: {{ .Values.redisImage | quote }}
```

An image and a tag _may_ be defined in `values.yaml` as two separate fields:

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

`helm create` sets the `imagePullPolicy` to `IfNotPresent` by default by doing
the following in your `deployment.yaml`:

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

And `values.yaml`:

```yaml
pullPolicy: IfNotPresent
```

Similarly, Kubernetes defaults the `imagePullPolicy` to `IfNotPresent` if it is
not defined at all. If you want a value other than `IfNotPresent`, simply update
the value in `values.yaml` to your desired value.


## 파드템플릿에는 셀렉터가 선언되어야 한다

All PodTemplate sections should specify a selector. For example:

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

This is a good practice because it makes the relationship between the set and
the pod.

But this is even more important for sets like Deployment. Without this, the
_entire_ set of labels is used to select matching pods, and this will break if
you use labels that change, like version or release date.
