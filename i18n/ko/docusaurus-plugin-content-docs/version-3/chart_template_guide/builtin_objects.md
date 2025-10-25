---
title: 빌트인 객체
description: 템플릿에서 사용가능한 빌트인 객체
sidebar_position: 3
---

객체는 템플릿 엔진에서 템플릿으로 전달된다. 그리고 사용자의 코드는 
객체를 전달할 수 있다. (`with` 와 `range` 문을 볼 때 
예제로 확인할 수 있다.) 이후에 보게 될 `tuple` 함수와 같이 
템플릿 내에서 새로운 객체를 만드는 몇 가지 방법이 있다.

객체는 간단히 하나의 값만 가질 수도 있다. 또는 다른 
객체나 기능을 포함할 수 있다. 예를 들어, `Release` 객체는 
(`Release.Name` 과 같은) 여러 객체를 포함하며 `Files` 객체는 몇 가지 함수를 가지고 있다.

이전 섹션에서는 템플릿에 릴리즈 이름을 삽입하기 위해
`{{.Release.Name}}` 을 사용하였다. `Release` 는 내 템플릿에
접근할 수 있는 최상위 객체 중 하나이다.

- `Release`: 이 객체는 릴리스 자체를 서술한다. 여러 객체를 가지고 있다.
  그 내부:
  - `Release.Name`: 릴리스 이름
  - `Release.Namespace`: 릴리스될 네임스페이스 (manifest에서
    오버라이드하지 않은 경우)
  - `Release.IsUpgrade`: 현재 작업이 업그레이드 또는 롤백인
    경우 `true` 로 설정된다.
  - `Release.IsInstall`: 현재 작업이 설치일
    경우 `true` 로 설정.
  - `Release.Revision`: 이 릴리스의 리비전 번호. 설치시에는 이 값이 
    1이며 업그레이드나 롤백을 수행할 때마다 증가한다.
  - `Release.Service`: 현재 템플릿을 렌더링하는 서비스. Helm 에서는
    항상 `Helm` 이다.
- `Values`: `values.yaml` 파일 및 사용자 제공 파일에서 템플릿으로 
  전달된 값. 기본적으로 `Values` 는 비어 있다.
- `Chart`: `Chart.yaml` 파일의 내용. `Chart.yaml` 안의 모든 데이터는 여기서 
  접근 가능하다. 예를 들어 `{{ .Chart.Name }}-{{ .Chart.Version }}` 은 
  `mychart-0.1.0` 를 출력한다.
  - 사용가능한 필드는 [차트 가이드](/topics/charts.md#the-chartyaml-file)
    에 나열되어 있다.
- `Files`: 차트 내의 모든 특수하지 않은(non-special) 파일에 대한 접근을 제공한다.
  템플릿에 접근하는 데에는 사용할 수 없지만, 차트 내의 다른 파일에 접근하는 데에는 사용할 수 있다.
  자세한 내용은 _Accessing Files_ 섹션을 참고하자.
  - `Files.Get` 은 이름으로 파일을 가지고 오는 함수이다. (`.Files.Get
    config.ini`)
  - `Files.GetBytes` 는 파일의 내용을 문자열이 아닌 
    바이트 배열로 가져오는 함수이다. 이미지 같은 것을
    다룰 때 유용하다.
  - `Files.Glob` 는 이름이 주어진 shell glob 패턴과 
    매치되는 파일 목록을 반환하는 함수이다.
  - `Files.Lines` 는 파일을 한 줄씩 읽는 함수이다. 이것은
    파일 내의 각 행을 순회(iterate)하는데 유용하다.
  - `Files.AsSecrets` 은 파일 본문을 Base64로 인코딩된 문자열로 반환하는
    함수이다.
  - `Files.AsConfig` 는 파일 본문을 YAML 맵으로 반환하는 함수이다.
- `Capabilities`: 쿠버네티스 클러스터가 지원하는 기능에 대한
  정보를 제공한다.
  - `Capabilities.APIVersions` 는 버전의 집합이다.
  - `Capabilities.APIVersions.Has $version` 은 버전(예:
    `batch/v1`) 이나 리소스(예: `apps/v1/Deployment`) 를 클러스터에서 사용할 수 있는지
    여부를 나타낸다.
  - `Capabilities.KubeVersion` 과 `Capabilities.KubeVersion.Version` 는 쿠버네티스 버전이다.
  - `Capabilities.KubeVersion.Major` 는 쿠버네티스 메이저 버전이다.
  - `Capabilities.KubeVersion.Minor` 는 쿠버네티스 마이너 버전이다.
- `Template`: 실행 중인 현재 템플릿에 대한 정보를
  포함한다.
  - `Name`: 현재 템플릿에 대한 네임스페이스 파일 경로 (예:
    `mychart/templates/mytemplate.yaml`)
  - `BasePath`: 현재 차트의 템플릿 디렉토리에 대한 네임스페이스 경로
    (예: `mychart/templates`).

빌트인 값은 항상 대문자로 시작한다. 이것은 Go의 명명 규칙을 
따르고 있다. 사용자는 자신만의 이름의 만들때, 팀에 적합한 
규칙을 자유롭게 사용할 수 있다. [쿠버네티스 차트](https://github.com/helm/charts) 
팀과 같은 일부 팀에서는 로컬 이름과 빌트인 이름을 구분하기 위해 
첫 글자로 소문자만 사용하도록 선택한다. 이 가이드에서는 
해당 규칙을 따른다.
