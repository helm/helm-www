---
title: 소개
description: Helm Go SDK 소개
sidebar_position: 1
---
Helm Go SDK를 사용하면 커스텀 소프트웨어에서 Helm 차트와 Helm 기능을 활용하여 Kubernetes 소프트웨어 배포를 관리할 수 있다.
(실제로 Helm CLI도 이러한 도구 중 하나일 뿐이다!)

현재 SDK는 Helm CLI와 기능적으로 분리되어 있다.
SDK는 독립적인 도구에서 사용할 수 있으며, 실제로 사용되고 있다.
Helm 프로젝트는 SDK에 대한 API 안정성을 보장한다.
참고로, SDK에는 CLI와 SDK를 분리하는 초기 작업에서 남은 다듬어지지 않은 부분이 있다. Helm 프로젝트는 이를 시간이 지남에 따라 개선할 계획이다.

전체 API 문서는 [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3)에서 확인할 수 있다.

아래에서는 주요 패키지 유형에 대한 간략한 개요와 간단한 예제를 제공한다.
더 많은 예제와 더 완전한 기능의 '드라이버'는 [예제](/sdk/examples.mdx) 섹션을 참조한다.

## 주요 패키지 개요

- [pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action):
  Helm 작업을 수행하기 위한 주요 "클라이언트"를 포함한다.
  이것은 CLI가 내부적으로 사용하는 것과 동일한 패키지이다.
  다른 Go 프로그램에서 기본적인 Helm 명령어만 수행하면 되는 경우 이 패키지를 사용하면 된다.
- [pkg/chart](https://pkg.go.dev/helm.sh/helm/v3/pkg/chart), [pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil):
  차트를 로드하고 조작하는 데 사용되는 메서드와 헬퍼
- [pkg/cli](https://pkg.go.dev/helm.sh/helm/v3/pkg/cli) 및 하위 패키지:
  표준 Helm 환경 변수에 대한 모든 핸들러를 포함하며, 하위 패키지에는 출력 및 values 파일 처리가 포함되어 있다.
- [pkg/release](https://pkg.go.dev/helm.sh/helm/v3/pkg/release):
  `Release` 객체와 상태를 정의한다.

이 외에도 더 많은 패키지가 있으므로 자세한 내용은 문서를 확인한다!

### 간단한 예제
다음은 Go SDK를 사용하여 `helm list`를 수행하는 간단한 예제이다.
더 완전한 기능의 예제는 [예제](/sdk/examples.mdx) 섹션을 참조한다.

```go
package main

import (
    "log"
    "os"

    "helm.sh/helm/v3/pkg/action"
    "helm.sh/helm/v3/pkg/cli"
)

func main() {
    settings := cli.New()

    actionConfig := new(action.Configuration)
    // You can pass an empty string instead of settings.Namespace() to list
    // all namespaces
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // Only list deployed
    client.Deployed = true
    results, err := client.Run()
    if err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    for _, rel := range results {
        log.Printf("%+v", rel)
    }
}

```


## 호환성

Helm SDK는 명시적으로 Helm의 하위 호환성 보장을 따른다:

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

즉, 주요 버전이 변경될 때만 호환성을 깨는 변경이 이루어진다.
