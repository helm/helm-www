---
title: "레이블과 어노테이션"
description: "차트 내에서 레이블과 어노테이션을 사용하는 모범사례를 다룬다."
weight: 5
aliases: ["/docs/topics/chart_best_practices/labels/"]
---

이 부분은 모범사례 가이드의 일부로서 차트 내에서 레이블과 어노테이션을 사용하는 모범사례에 대해 논한다.

## 레이블인가, 어노테이션인가?

다음 조건에 해당하는 메타데이터 항목은 레이블이어야 한다.

- 쿠버네티스에서 해당 리소스를 식별하기 위해 사용된다.
- 시스템 쿼리를 목적으로 운영자에게 유용하게 노출되어야 한다.

예를 들어, `helm.sh/chart: NAME-VERSION`을 레이블로 사용할 것이 권장되는데,
이렇게 하면 운영자는 레이블을 통해 특정 차트의 모든 인스턴스들을 편리하게 찾을 수 있다.

메타데이터 항목이 쿼리에 사용되지 않는다면, 어노테이션으로 설정해야 한다.

헬름 훅은 항상 어노테이션이다.

## 표준 레이블

The following table defines common labels that Helm charts use. Helm itself
never requires that a particular label be present. Labels that are marked REC
are recommended, and _should_ be placed onto a chart for global consistency.
Those marked OPT are optional. These are idiomatic or commonly in use, but are
not relied upon frequently for operational purposes.

이름|상태|설명
-----|------|----------
`app.kubernetes.io/name` | REC | This should be the app name, reflecting the entire app. Usually `{{ template "name" . }}` is used for this. This is used by many Kubernetes manifests, and is not Helm-specific.
`helm.sh/chart` | REC | This should be the chart name and version: `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`.
`app.kubernetes.io/managed-by` | REC | This should always be set to `{{ .Release.Service }}`. It is for finding all things managed by Helm.
`app.kubernetes.io/instance` | REC | This should be the `{{ .Release.Name }}`. It aid in differentiating between different instances of the same application.
`app.kubernetes.io/version` | OPT | The version of the app and can be set to `{{ .Chart.AppVersion }}`.
`app.kubernetes.io/component` | OPT | This is a common label for marking the different roles that pieces may play in an application. For example, `app.kubernetes.io/component: frontend`.
`app.kubernetes.io/part-of` | OPT | When multiple charts or pieces of software are used together to make one application. For example, application software and a database to produce a website. This can be set to the top level application being supported.

You can find more information on the Kubernetes labels, prefixed with
`app.kubernetes.io`, in the [Kubernetes
documentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/).
