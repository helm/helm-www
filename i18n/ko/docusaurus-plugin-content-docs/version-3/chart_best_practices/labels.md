---
title: 레이블과 어노테이션
description: 차트 내에서 레이블과 어노테이션을 사용하는 모범사례를 다룬다.
sidebar_position: 5
---

이 부분은 모범사례 가이드의 일부로서 차트 내에서 레이블과 어노테이션을 사용하는 모범사례에 대해 논한다.

## 레이블인가, 어노테이션인가?

다음 조건에 해당하는 메타데이터 항목은 레이블이어야 한다.

- 쿠버네티스에서 해당 리소스를 식별하기 위해 사용된다.
- 시스템 쿼리를 목적으로 운영자에게 유용하게 노출되어야 한다.

예를 들어, `helm.sh/chart: NAME-VERSION`을 레이블로서 사용하는 것을 권장하는데,
이렇게 하면 운영자는 레이블을 통해 특정 차트의 모든 인스턴스들을 편리하게 찾을 수 있다.

메타데이터 항목이 쿼리에 사용되지 않는다면, 어노테이션으로 설정해야 한다.

헬름 훅은 항상 어노테이션이다.

## 표준 레이블

아래 표에 헬름 차트에서 널리 사용되는 레이블이 있다.
헬름 자체는 특정 레이블을 필요로 하지 않는다.
REC로 표시된 레이블은 권장되는 것으로서, 전체적인 정합성 유지를 위해 차트에 있어야 한다.
OPT로 표시된 레이블은 선택사항이다.
이것들은 관용적 또는 일반적으로 사용하지만, 운영 목적에서는 그렇게 자주 사용하지 않는다.

이름|상태|설명
-----|------|----------
`app.kubernetes.io/name` | REC | 전체 앱을 잘 나타내는 앱 이름을 써야 한다. 흔히 `{{ template "name" . }}`로 쓴다. 많은 쿠버네티스 매니페스트에서 사용되는 것으로서, 헬름에만 있는 것이 아니다.
`helm.sh/chart` | REC | 차트 이름과 버전을 써야 한다. `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`.
`app.kubernetes.io/managed-by` | REC | 항상 `{{ .Release.Service }}`로 설정해야 한다. 헬름이 관리하는 모든 것을 찾기 위한 것이다.
`app.kubernetes.io/instance` | REC | `{{ .Release.Name }}`이어야 한다. 동일한 애플리케이션의 다른 인스턴스들을 구별하는 데 도움이 된다.
`app.kubernetes.io/version` | OPT | 앱의 버전이며, `{{ .Chart.AppVersion }}`로 설정할 수 있다.
`app.kubernetes.io/component` | OPT | 하나의 애플리케이션 내에서 각 부분들이 맡은 역할을 표시하는 일반적인 레이블이다. 예를 들면 `app.kubernetes.io/component: frontend`.
`app.kubernetes.io/part-of` | OPT | 하나의 애플리케이션을 구성하는 데 여러 차트 또는 소프트웨어 부분들이 함께 사용되는 경우(예를 들어, 웹사이트를 제공하는 애플리케이션 소프트웨어와 데이터베이스), 그것들이 지원하는 최상위 애플리케이션으로 설정할 수 있다.

`app.kubernetes.io` 접두어를 가진 쿠버네티스 레이블에 대한 더 자세한 정보는
[쿠버네티스 문서](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/)에서 찾아볼 수 있다.
