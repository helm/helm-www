---
title: "내장 객체"
description: "템플릿에서 사용가능한 내장 객체"
weight: 3
---

객체는 템플릿 엔진에서 템플릿으로 전달된다.
그리고 당신의 코드는 객체를 전달할 수 있다.
(`with`와 `range` 구문을 볼 때 예시를 볼 것이다).
나중에 볼 `tuple` 함수처럼 템플릿 내에 새로운 객체를 만드는 몇 가지 방법이 있다.

객체는 간단할 수 있고, 단 하나의 값만 가질 수도 있다.
또는 다른 객체나 함수를 포함할 수도 있다.
예를 들어,
`Release` 객체는 `Release.Name`과 같은 여러 객체를 포함하고
`Files` 객체에는 몇 가지 함수가 있다.

앞의 섹션에서는 템플릿에 릴리즈 이름을 삽입하기 위해 `{{ .Release.Name }}`를 사용헸다.
`Release`는 템플릿에서 접근할 수 있는 최상위 객체 중 하나다.

- `Release`: 이 객체는 릴리즈 자체를 나타낸다.
  여기에는 여러 가지 객체가 있다:
  - `Release.Name`: 릴리즈 이름
  - `Release.Namespace`: 릴리즈 하려는 네임스페이스 (단, 매니페스트가 재정의되지 않은 경우)
  - `Release.IsUpgrade`: 현재 작업이 upgrade 또는 rollback 인 경우 `true`로 설정된다.
  - `Release.IsInstall`: 현재 작업이 install 인 경우 `true`로 설정된다.
  - `Release.Revision`: 해당 릴리즈의 개정 번호.
    설치 시 이 값은 1이며 upgrade 및 rollback 마다 증가한다.
  - `Release.Service`: 현재 템플릿을 렌더링 하는 서비스.
    헬름에서는 이 값이 항상 `Helm`이다.
- `Values`: `values.yaml` 파일과 사용자가 제공한 파일에서 템플릿으로 전달되는 값을 나타낸다.
  기본적으로 `Values`는 비어 있다.
- `Chart`: `Chart.yaml` 파일의 내용을 나타낸다. `Chart.yaml`의 모든 데이터는 여기에서 접근할 수 있다.
  예를 들어, `{{ .Chart.Name }}-{{ .Chart.Version }}`은 `mychart-0.1.0`을 출력한다.
  - 사용 가능한 필드는 [차트
    가이드]({{< ref path="/docs/topics/charts.md#the-chartyaml-file" lang="en" >}})
    에서 확인할 수 있다.
- `Files`: 차트에 있는 모든 일반 파일에 접근할 수 있도록 한다.
  템플릿에 접근하기 위해 사용할 수는 없지만,
  이 외의 차트 파일에 접근하기 위해 사용할 수 있다. [파일에
  접근하기]({{< ref "/docs/chart_template_guide/accessing_files.md" >}})
  섹션에서 더 많은 내용을 볼 수 있다.
  - `Files.Get` 은 이름(`.Files.Get.config.ini`)으로 파일을 가져오는 함수다.
  - `Files.GetBytes`는 파일의 내용을 문자열 대신 바이트 배열로 가져오는 함수다.
    이미지 같은 것에 유용하다.
  - `Files.Glob`는 지정된 쉘 글롭 패턴과 이름이 일치하는 파일 목록을 반환하는 함수다.
  - `Files.Lines`는 파일을 한 줄씩 읽는 함수다.
    파일의 각 행을 순회하는 데 유용하다.
  - `Files.AsSecrets`는 파일 본문을 Base 64로 인코딩된 문자열로 반환하는 함수다.
  - `Files.AsConfig`는 파일 본문을 YAML 맵 형식으로 반환하는 함수다.
- `Capabilities`: 쿠버네티스 클러스터가 지원하는 기능에 대한 정보를 제공한다.
  - `Capabilities.APIVersions`는 버전 정보다.
  - `Capabilities.APIVersions.Has $version`은 버전(예: `batch/v1`)이나
    리소스(예: `apps/v1/Deployment`)를 사용할 수 있는지 나타낸다.
  - `Capabilities.KubeVersion`과 `Capabilities.KubeVersion.Version`은 쿠버네티스 버전이다.
  - `Capabilities.KubeVersion.Major`는 쿠버네티스 메이저 버전이다.
  - `Capabilities.KubeVersion.Minor`는 쿠버네티스 마이너 버전이다.
- `Template`: 실행 중인 현재 템플릿에 대한 정보를 포함한다.
  - `Name`: 현재 템플릿이 속한 파일 경로
    (예: `mychart/templates/mytemplate.yaml`)
  - `BasePath`: 현재 차트의 템플릿 디렉토리가 속한 경로
    (e.g. `mychart/templates`).

내장 객체의 이름은 항상 대문자로 시작한다.
이는 Go의 명명규칙을 따른다.
이름을 직접 짓는다면 팀에 맞는 규칙을 자유롭게 적용할 수 있다.
[Kubernetes Charts](https://github.com/helm/charts)
처럼 일부 팀들은 자신들만의 이름과 내장 객체의 이름을 구별하기 위해 소문자로 시작한다.
본 가이드에서는 이 규칙을 따른다.
