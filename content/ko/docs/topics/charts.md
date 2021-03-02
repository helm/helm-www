---
title: "차트"
description: "차트 형식을 설명하고, 헬름으로 차트를 빌드하기 위한 기본지침을 제공한다."
weight: 1
---

Helm uses a packaging format called _charts_. A chart is a collection of files
that describe a related set of Kubernetes resources. A single chart might be
used to deploy something simple, like a memcached pod, or something complex,
like a full web app stack with HTTP servers, databases, caches, and so on.

헬름은 *charts* 라는 패키지 포맷을 사용한다. 차트는 쿠버네티스 리소스와 관련된 셋을 설명하는 파일의 모음이다. 하나의 차트는 memcached 팟을 배포하는 것처럼 단순한 형태나 HTTP 서버, 데이터베이스, 캐시 등으로 구성된 완전한 웹앱 같이 복잡한 형태로 사용될수 있다.

Charts are created as files laid out in a particular directory tree. They can be
packaged into versioned archives to be deployed.

차트는 특정한 폴더 구조를 가진 파일들로 생성된다. 이 파일들은 버전이 부여된 배포 가능한 압축파일로 패키징된다. 

If you want to download and look at the files for a published chart, without
installing it, you can do so with `helm pull chartrepo/chartname`.

설치 없이 공개된 차트를 다운로드 받거나 보고싶으면, `helm pull chartrepo/chartname` 명령을 사용하면 된다.

This document explains the chart format, and provides basic guidance for
building charts with Helm.

이 문서는 차트 포맷을 설명하고, 차트를 헬름으로 구성하는 기본 가이드를 제공한다.

## 차트 파일 구조

A chart is organized as a collection of files inside of a directory. The
directory name is the name of the chart (without versioning information). Thus,
a chart describing WordPress would be stored in a `wordpress/` directory.

차트는 폴더안에 파일들의 모음으로 구성된다. 폴더의 이름은 (버전 정보 없는) 차트의 이름이다. WordPress 를 설명하는 차트는 `wordpress/` 폴더에 저장된다.

Inside of this directory, Helm will expect a structure that matches this:

디렉토리 안에서 헬름은 다음과 같은 구조를 가진다.

```text
wordpress/
  Chart.yaml          # A YAML file containing information about the chart
  LICENSE             # OPTIONAL: A plain text file containing the license for the chart
  README.md           # OPTIONAL: A human-readable README file
  values.yaml         # The default configuration values for this chart
  values.schema.json  # OPTIONAL: A JSON Schema for imposing a structure on the values.yaml file
  charts/             # A directory containing any charts upon which this chart depends.
  crds/               # Custom Resource Definitions
  templates/          # A directory of templates that, when combined with values,
                      # will generate valid Kubernetes manifest files.
  templates/NOTES.txt # OPTIONAL: A plain text file containing short usage notes
```

```text
wordpress/
  Chart.yaml          # 차트에 대한 정보를 가진 YAML 파일
  LICENSE             # 옵션: 차트의 라이센스 정보를 가진 텍스트 파일
  README.md           # 옵션: README 파일
  values.yaml         # 차트에 대한 기본 환경설정 값들
  values.schema.json  # 옵션: values.yaml파일의 구조를 제약하는 JSON 파일
  charts/             # 이 차트에 종속된 차트들을 포함하는 폴더
  crds/               # 커스텀 자원에 대한 정의
  templates/          # values와 결합될때, 유효한 쿠버네티스 manifest 파일들이 생성될 템플릿들의 폴더
  templates/NOTES.txt # 옵션: 간단한 사용법을 포함하는 텍스트 파일
```

Helm reserves use of the `charts/`, `crds/`, and `templates/` directories, and
of the listed file names. Other files will be left as they are.

헬름은 `charts/`, `crds/`, `templates/` 폴더와 나열된 파일 이름의 사용을 예약한다. 다른 파일은 그대로 남는다.

## Chart.yaml 파일

The `Chart.yaml` file is required for a chart. It contains the following fields:

`Chart.yaml` 파일은 차트의 필수 요소이다. 다음과 같은 필드를 포함한다.

```yaml
apiVersion: The chart API version (required)
name: The name of the chart (required)
version: A SemVer 2 version (required)
kubeVersion: A SemVer range of compatible Kubernetes versions (optional)
description: A single-sentence description of this project (optional)
type: The type of the chart (optional)
keywords:
  - A list of keywords about this project (optional)
home: The URL of this projects home page (optional)
sources:
  - A list of URLs to source code for this project (optional)
dependencies: # A list of the chart requirements (optional)
  - name: The name of the chart (nginx)
    version: The version of the chart ("1.2.3")
    repository: The repository URL ("https://example.com/charts") or alias ("@repo-name")
    condition: (optional) A yaml path that resolves to a boolean, used for enabling/disabling charts (e.g. subchart1.enabled )
    tags: # (optional)
      - Tags can be used to group charts for enabling/disabling together
    enabled: (optional) Enabled bool determines if chart should be loaded
    import-values: # (optional)
      - ImportValues holds the mapping of source values to parent key to be imported. Each item can be a string or pair of child/parent sublist items.
    alias: (optional) Alias to be used for the chart. Useful when you have to add the same chart multiple times
maintainers: # (optional)
  - name: The maintainers name (required for each maintainer)
    email: The maintainers email (optional for each maintainer)
    url: A URL for the maintainer (optional for each maintainer)
icon: A URL to an SVG or PNG image to be used as an icon (optional).
appVersion: The version of the app that this contains (optional). This needn't be SemVer.
deprecated: Whether this chart is deprecated (optional, boolean)
annotations:
  example: A list of annotations keyed by name (optional).
```

```yaml
apiVersion: 차트 API 버전 (필수)
name: 차트의 이름 (필수)
version: SemVer 2 버전 (필수)
kubeVersion: 호환되는 쿠버네티스 버전의 SemVer 범위 (선택)
description: 이 프로젝트에 대한 한줄 설명 (선택)
type: 차트 타입 (선택)
keywords:
  - 이 프로젝트에 대한 키워드 리스트 (선택)
home: 프로젝트 홈페이지의 URL (선택)
sources:
  - 이 프로젝트의 소스코드 URL 리스트 (선택)
dependencies: # 차트 필요조건들의 리스트 (optional)
  - name: 차트의 이름 (nginx)
    version: 차트의 버전 ("1.2.3")
    repository: 저장소 URL ("https://example.com/charts") 또는 ("@repo-name")
    condition: (선택) 차트들의 활성/비활성을 결정하는 boolean 값을 만드는 yaml 경로 (예시: subchart1.enabled)
    tags: # (선택)
      - 활성/비활성을 함께 하기위해 차트들을 그룹화 하는 태그들
    enabled: (선택) 차트가 로드될수 있는지 결정하는 boolean
    import-values: # (선택)
      - 이 값들은 import 될수 있는 부모 키와 소스 값들의 매핑을 홀드한다. 각각의 아이템은 자식/부모의 서브리스트 아이템들의 string 쌍이 될수있다.
    alias: (선택) 차트에 대한 별명으로 사용된다. 같은 차트를 여러번 추가해야할때 유용하다.
maintainers: # (선택)
  - name: maintainer들의 이름 (각 maintainer마다 필수)
    email: maintainer들의 email (각 maintainer마다 선택)
    url: maintainer에 대한 URL (각 maintainer마다 선택)
icon: 아이콘으로 사용될 SVG나 PNG 이미지 URL (선택)
appVersion: 이 앱의 버전 (선택). SemVer인 필요는 없다.
deprecated: 이 차트가 deprecated 되었는지 여부 (선택, boolean)
annotations:
  example: 키로 매핑된 주석들의 리스트 (선택).
```

Other fields will be silently ignored.

다른 필드들은 묵시적으로 무시된다.

### 차트와 버저닝

Every chart must have a version number. A version must follow the [SemVer
2](https://semver.org/spec/v2.0.0.html) standard. Unlike Helm Classic, Helm v2
and later uses version numbers as release markers. Packages in repositories are
identified by name plus version.

모든 차트는 버전 번호를 가져야한다. 버전은 [SemVer
2](https://semver.org/spec/v2.0.0.html)표준을 따라야 한다. 이전 헬름과 다르게, 헬름 v2 이상은 버전 번호를 release 마커로 사용한다. 저장소에 있는 패키지들은 이름과 버전으로 구분된다.

For example, an `nginx` chart whose version field is set to `version: 1.2.3`
will be named:

예를 들어, 버전 필드가 `version: 1.2.3` 으로 설정된 `nginx`차트는 다음같이 이름이 지어진다. 

```text
nginx-1.2.3.tgz
```

More complex SemVer 2 names are also supported, such as `version:
1.2.3-alpha.1+ef365`. But non-SemVer names are explicitly disallowed by the
system.

`version:1.2.3-alpha.1+ef365`같은 더 복잡한 SemVer 2 이름도 지원된다. SemVer가 아닌 이름은 시스템에 의해 명백하게 허용되지 않는다.

**NOTE:** Whereas Helm Classic and Deployment Manager were both very GitHub
oriented when it came to charts, Helm v2 and later does not rely upon or require
GitHub or even Git. Consequently, it does not use Git SHAs for versioning at
all.

**참고:** 헬름 클래식과 배포 매니저는 둘다 깃허브를 지향한 차트였지만, 헬름 v2와 이후 버전은 깃허브나 깃에 의존하지도, 필요로 하지도 않는다. 따라서 깃 SHA를 버전관리에서 조금도 사용하지 않는다.

The `version` field inside of the `Chart.yaml` is used by many of the Helm
tools, including the CLI. When generating a package, the `helm package` command
will use the version that it finds in the `Chart.yaml` as a token in the package
name. The system assumes that the version number in the chart package name
matches the version number in the `Chart.yaml`. Failure to meet this assumption
will cause an error.

`Chart.yaml` 의 안에 있는 `version` 필드는 CLI를 포함한 많은 헬름 툴에서 사용된다. 패키지를 만들어낼때, `helm package` 명령은 `Chart.yaml` 에서 찾은 패키지 명안의 토큰으로써 이 버전을 사용할 것이다. 시스템은 차트 패키지 명 안의 버전 넘버가 `Chart.yaml` 안의 버전 넘버와 일치한다고 가정한다. 이 가정을 충족하지 못하면 에러가 발생한다.

### `apiVersion` 필드

The `apiVersion` field should be `v2` for Helm charts that require at least Helm

3. Charts supporting previous Helm versions have an `apiVersion` set to `v1` and
are still installable by Helm 3.

`apiVersion` 필드는 최소 헬름 3을 필요로 하는 헬름 차트에 대해 `v2`여야 한다. 이전 헬름 버전을 지원하는 차트는 `apiVersion`이 `v1`으로 설정되어 있고, 헬름3에 의해 여전히 설치 가능하다.

Changes from `v1` to `v2`:

`v1`에서 `v2`로 바꾸기

- A `dependencies` field defining chart dependencies, which were located in a
  separate `requirements.yaml` file for `v1` charts (see [Chart
  Dependencies](#차트-의존성)).
- 종속성을 정의하는 `dependencies`필드는 `v1` 차트를 위한 독립된 `requirements.yaml` 파일에 위치([Chart
  Dependencies](#차트-의존성) 보기).
- The `type` field, discriminating application and library charts (see [Chart
  Types](#차트-타입)).
- `type`필드는 어플리케이션과 라이브러리 차트를 식별([Chart
  Types](#차트-타입) 보기)

### `appVersion` 필드

Note that the `appVersion` field is not related to the `version` field. It is a
way of specifying the version of the application. For example, the `drupal`
chart may have an `appVersion: 8.2.1`, indicating that the version of Drupal
included in the chart (by default) is `8.2.1`. This field is informational, and
has no impact on chart version calculations.

`appVersion` 필드는 `version`필드와 관련이 없음을 주의하라. 이 필드는 어플리케이션의 버전을 명시하는 방법이다. 예를 들어, `drupal`차트가 `appVersion: 8.2.1`을 가진다면, 차트에 (기본값으로) 포함되는 Drupal의 버전은 `8.2.1`임을 나타낸다. 이 필드는 정보만 제공하고, 차트 버전 계산에 영향이 없다.

### `kubeVersion` 필드

The optional `kubeVersion` field can define semver constraints on supported
Kubernetes versions. Helm will validate the version constraints when installing
the chart and fail if the cluster runs an unsupported Kubernetes version.

선택 필드인 `kubeVersion`은 지원되는 쿠버네티스 버전을 제약하는 semver를 정의할 수 있다. 헬름은 차트를 설치할 때 버전 제약을 판단하고, 클러스터가 지원되지 않는 쿠버네티스 버전을 구동하면 실패한다.

Version constraints may comprise space separated AND comparisons such as

버전 제약은 공백으로 분리된 AND 비교로  다음과 같이 구성된다.

```
>= 1.13.0 < 1.15.0
```
which themselves can be combined with the OR `||` operator like in the following
example

다음 예제와 같이 표현 각각은 OR `||`연산과 결합될 수 있다.

```
>= 1.13.0 < 1.14.0 || >= 1.14.1 < 1.15.0
```
In this example the version `1.14.0` is excluded, which can make sense if a bug
in certain versions is known to prevent the chart from running properly.

이 예제에서 버전 `1.14.0`은 제외되어, 특정 버전에 버그가 차트를 제대로 실행하지 못하게 하는 것으로 이해할 수 있다. 

Apart from version constrains employing operators `=` `!=` `>` `<` `>=` `<=` the
following shorthand notations are supported

버전 제약에 사용하는 `=` `!=` `>` `<` `>=` `<=` 연산 외에도, 다음 약칭 표기법이 지원된다.

 * hyphen ranges for closed intervals, where `1.1 - 2.3.4` is equivalent to `>=
   1.1 <= 2.3.4`.
 * 닫힌 간격에 대한 하이픈 범위,  `1.1 - 2.3.4` 는 `>=1.1 <= 2.3.4` 와 동일하다.
 * wildcards `x`, `X` and `*`, where `1.2.x` is equivalent to `>= 1.2.0 <
   1.3.0`.
 * 와일드카드  `x`, `X` , `*`, 예를 들어 `1.2.x` 는 `>= 1.2.0 <1.3.0`와 동일하다. 
 * tilde ranges (patch version changes allowed), where `~1.2.3` is equivalent to
   `>= 1.2.3 < 1.3.0`.
 * 물결 범위 (패치 버전 변화는 허용),  `~1.2.3`는  `>= 1.2.3 < 1.3.0`와 동일하다.
 * caret ranges (minor version changes allowed), where `^1.2.3` is equivalent to
   `>= 1.2.3 < 2.0.0`.
 * 탈자 범위 (마이너 버전 변화는 허용),  `^1.2.3` 는`>= 1.2.3 < 2.0.0`와 동일하다.

For a detailed explanation of supported semver constraints see
[Masterminds/semver](https://github.com/Masterminds/semver).

지원되는 자세한 server 제약의 표현을 보려면 [Masterminds/semver](https://github.com/Masterminds/semver)을 보라.

### 미사용 예정 차트

When managing charts in a Chart Repository, it is sometimes necessary to
deprecate a chart. The optional `deprecated` field in `Chart.yaml` can be used
to mark a chart as deprecated. If the **latest** version of a chart in the
repository is marked as deprecated, then the chart as a whole is considered to
be deprecated. The chart name can be later reused by publishing a newer version
that is not marked as deprecated. The workflow for deprecating charts, as
followed by the [kubernetes/charts](https://github.com/helm/charts) project is:

1. Update chart's `Chart.yaml` to mark the chart as deprecated, bumping the
   version
2. Release the new chart version in the Chart Repository
3. Remove the chart from the source repository (e.g. git)

차트 저장소에서 차트를 관리할때, 가끔 차트를 deprecate하는 것이 필요하다. `Chart.yaml`에 있는 선택 필드인 `deprecated`는 차트가 미사용 예정임을 표시하는데 사용될 수 있다. 저장소에 있는 차트의 **최신** 버전이 미사용 예정으로 표시된다면, 차트는 전체가 미사용 예정이라고 판단한다. 미사용예정을 체크하지 않은 새로운 버전을 발행함으로써 차트명을 이후에 재사용할수 있다. 차트를 미사용 하는 것에 대한 [kubernetes/charts](https://github.com/helm/charts) 프로젝트를 따르는 작업흐름은 다음과 같다.

1. 차트의  `Chart.yaml`를 업데이트 하여 차트를 미사용 예정으로 표시하여 버전을 올린다.
2. 차트 저장소에 새로운 차트 버전을 Release 한다
3. 차트를 소스 저장소에서 지운다 (예. git)

### 차트 타입

The `type` field defines the type of chart. There are two types: `application`
and `library`. Application is the default type and it is the standard chart
which can be operated on fully. The [library chart]({{< ref
"/docs/topics/library_charts.md" >}}) provides utilities or functions for the
chart builder. A library chart differs from an application chart because it is
not installable and usually doesn't contain any resource objects.

`type` 필드는 차트의 타입을 정의한다. `application`, `library` 의 두가지 타입이 있다. application은 기본 타입이며 완전히 작동할 수 있는 표준 차트이다. [library chart]({{< ref
"/docs/topics/library_charts.md" >}}) 는 차트 빌더에 유틸리티나 함수를 제공한다. library chart는 설치 불가능하고, 보통 어떤 리소스 오브젝트도 가지지 않는다는 것이 application chart와 다르다.

**Note:** An application chart can be used as a library chart. This is enabled
by setting the type to `library`. The chart will then be rendered as a library
chart where all utilities and functions can be leveraged. All resource objects
of the chart will not be rendered.

**참고:** application chart는 library chart로 사용될수 있다. 타입을 `library`로 셋팅함으로써 가능하다. 차트는 모든 유틸리티와 함수 기능을 활용할수 있는 상태의 library chart로 렌더링된다. 모든 차트의 리소스 오브젝트는 렌더링되지 않는다.

## 차트 라이센스, README 와 NOTES

Charts can also contain files that describe the installation, configuration,
usage and license of a chart.

차트는 설치, 환경설정, 사용법, 차트의 라이센스를 설명하는 파일을 가질 수 있다.

A LICENSE is a plain text file containing the
[license](https://en.wikipedia.org/wiki/Software_license) for the chart. The
chart can contain a license as it may have programming logic in the templates
and would therefore not be configuration only. There can also be separate
license(s) for the application installed by the chart, if required.

LICENSE는 차트에 대한 [license](https://en.wikipedia.org/wiki/Software_license) 를 포함하는  일반 텍스트 파일이다. 차트는 템플릿 안의 프로그래밍 로직을 가지는 것으로써의 라이센스를 포함할 수 있으므로 환경 설정 전용이 아니다. 또한, 필요하다면 차트에 의해 설치된 어플리키이션에 대한 라이센스는 나눠질 수 있다.

A README for a chart should be formatted in Markdown (README.md), and should
generally contain:

차트에 대한 README는 마크 다운(README.md)의 포맷이어야 하며, 일반적으로 다음을 포함한다.

- A description of the application or service the chart provides
- 차트가 제공하는 어플리케이션이나 서비스에 관한 설명
- Any prerequisites or requirements to run the chart
- 차트를 실행하기 위한 전제조건이나 필요조건
- Descriptions of options in `values.yaml` and default values
- `values.yaml`에 있는 옵션과 기본값에 대한 설명
- Any other information that may be relevant to the installation or
  configuration of the chart
- 차트의 설치나 환경설정에 관련이 있을 수 있는 다른 정보

When hubs and other user interfaces display details about a chart that detail is
pulled from the content in the `README.md` file.

허브 및 기타 사용자 인터페이스가 `README.md` 파일의 콘텐츠에서 가져온 차트에 대한 세부 정보를 표시하는 경우

The chart can also contain a short plain text `templates/NOTES.txt` file that
will be printed out after installation, and when viewing the status of a
release. This file is evaluated as a [template](#템플릿과-값), and can
be used to display usage notes, next steps, or any other information relevant to
a release of the chart. For example, instructions could be provided for
connecting to a database, or accessing a web UI. Since this file is printed to
STDOUT when running `helm install` or `helm status`, it is recommended to keep
the content brief and point to the README for greater detail.

차트는 릴리즈의 상태를 보여줄때와 설치 후에 출력될 짧은 일반 텍스트를 `template/NOTES.txt` 파일에 적을 수 있다. 이 파일은 [template](#템플릿과-값)으로 평가되고 사용법 메모, 다음 스텝, 차트의 릴리즈와 관련된 다른 정보를 표시하기 위해 사용될 수 있다. 예를 들어, 지시 사항(instructions)은 데이터베이스에 연결하기, 웹 UI에 액세스하기 등에 대해 제공될 수 있다. 이 파일이 `helm install` 이나 `helm status`가 실행될 때 STDOUT으로 출력되기 때문에, 내용을 간단하게 유지하고, 상세 내용은 README를 참조하도록 하는 것을 권장한다.

## 차트 의존성

In Helm, one chart may depend on any number of other charts. These dependencies
can be dynamically linked using the `dependencies` field in `Chart.yaml` or
brought in to the `charts/` directory and managed manually.

헬름에서 하나의 차트는 0개 이상의 다른 차트에 의존한다. 이 의존성은 `Chart.yaml` 에 `dependencies` 필드를 사용하여 직접 연결되거나 `charts/` 폴더로 가져와서 수동으로 관리할 수 있다.

### `dependencies` 필드를 통해 의존성 관리하기

The charts required by the current chart are defined as a list in the
`dependencies` field.

현재 차트가 필요로 하는 차트들은 `dependencies` 필드에 리스트로 정의된다.

```yaml
dependencies:
  - name: apache
    version: 1.2.3
    repository: https://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: https://another.example.com/charts
```

- The `name` field is the name of the chart you want.
- `name` 필드는 당신이 사용할 차트의 이름이다.
- The `version` field is the version of the chart you want.
- `version` 필드는 당신이 사용할 차트의 버전이다.
- The `repository` field is the full URL to the chart repository. Note that you
  must also use `helm repo add` to add that repo locally.
- `repository` 필드는 차트 저장소의 완전한 URL 이다. 반드시 로컬 환경에서 `helm repo add`를 사용해야 함을 주의하라.
- You might use the name of the repo instead of URL
- URL 대신 저장소의 이름을 사용할 수 있다.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
```

```yaml
dependencies:
  - name: awesomeness
    version: 1.0.0
    repository: "@fantastic-charts"
```

Once you have defined dependencies, you can run `helm dependency update` and it
will use your dependency file to download all the specified charts into your
`charts/` directory for you.

일단 종속성을 정의하면, `helm dependency update`를 실행할 수 있고, 실행하면 종속성 파일을 사용해서 모든 명시된 차트를 `charts/` 폴더 안에 다운로드 받는다.

```console
$ helm dep up foochart
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "example" chart repository
...Successfully got an update from the "another" chart repository
Update Complete. Happy Helming!
Saving 2 charts
Downloading apache from repo https://example.com/charts
Downloading mysql from repo https://another.example.com/charts
```

When `helm dependency update` retrieves charts, it will store them as chart
archives in the `charts/` directory. So for the example above, one would expect
to see the following files in the charts directory:

`helm dependency update`가 차트를 가져올 때, 차트 아카이브의 형태로 `charts/` 폴더에 저장한다. 위의 예제 같은 경우, 다음 파일들을 차트 폴더에서 볼수 있다.

```text
charts/
  apache-1.2.3.tgz
  mysql-3.2.1.tgz
```

#### 의존성 안에서의 대체 필드

In addition to the other fields above, each requirements entry may contain the
optional field `alias`.

위에서 본 필드 외에도, 각각의 필요 엔트리는 선택필드인 `alias`를 가질 수 있다.

Adding an alias for a dependency chart would put a chart in dependencies using
alias as name of new dependency.

종속성 차트에 대한 별명을 추가하는 것은 dependencies 안에 새로운 종속성의 이름을 별명으로 사용하여 넣는것이다.

One can use `alias` in cases where they need to access a chart with other
name(s).

`alias`를 다른 이름으로 같은 차트에 엑세스가 필요할 때 사용할 수 있다.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-1
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-2
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
```

In the above example we will get 3 dependencies in all for `parentchart`:

위의 예에서 `parentchart`에 대한 모두 3개의 종속성을 얻는다.

```text
subchart
new-subchart-1
new-subchart-2
```

The manual way of achieving this is by copy/pasting the same chart in the
`charts/` directory multiple times with different names.

같은 동작을 수동으로 하는 방법은 `charts/` 폴더에 여러번 다른 이름으로 같은 차트를 복사/붙여넣기 하면된다.

#### 의존성 안에서의 태그와 조건 필드

In addition to the other fields above, each requirements entry may contain the
optional fields `tags` and `condition`.

위에서 본 필드 외에도, 각각의 필요 엔트리는 선택필드인 `alias`와 `condition`을 가질 수 있다.

All charts are loaded by default. If `tags` or `condition` fields are present,
they will be evaluated and used to control loading for the chart(s) they are
applied to.

모든 차트는 기본으로 로드된다. `tags`나 `condition` 필드가 존재하면, 차트가 적용될지에 대한 로딩 제어를 위해 사용되고 평가된다.

Condition - The condition field holds one or more YAML paths (delimited by
commas). If this path exists in the top parent's values and resolves to a
boolean value, the chart will be enabled or disabled based on that boolean
value.  Only the first valid path found in the list is evaluated and if no paths
exist then the condition has no effect.

Condition - condition 필드는 1개 이상의 YAML 경로이다.(콤마로 구분된다) 최상단 부모의 values에 이 경로가 존재하고 boolean 값으로 판단할수 있다면, 차트는 boolean 값에 의해 활성화 혹은 비활성화 된다. 리스트에서 발견된 유효한 첫번째 경로만이 평가되고, 이 경로가 존재하지 않으면 해당 condition은 무효하다.

Tags - The tags field is a YAML list of labels to associate with this chart. In
the top parent's values, all charts with tags can be enabled or disabled by
specifying the tag and a boolean value.

Tags - tags 필드는 이 차트와 관련된 레이블의 YAML 리스트이다. 최상단 부모의 values에서, 태그를 가진 모든 차트는 특정한 태그와 boolean 값에 의해 활성화 또는 비활성화 된다.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart1.enabled, global.subchart1.enabled
    tags:
      - front-end
      - subchart1
  - name: subchart2
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart2.enabled,global.subchart2.enabled
    tags:
      - back-end
      - subchart2
```

```yaml
# parentchart/values.yaml

subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

In the above example all charts with the tag `front-end` would be disabled but
since the `subchart1.enabled` path evaluates to 'true' in the parent's values,
the condition will override the `front-end` tag and `subchart1` will be enabled.

위 예에서 `front-end` 태그를 가진 모든 차트는 비활성화 되지만, 부모의 values에서 `subchart1.enabled`가 true로 평가되었기 때문에, condition은 `front-end`태그를 덮어쓰고 `subchart1`은 활성화된다.

Since `subchart2` is tagged with `back-end` and that tag evaluates to `true`,
`subchart2` will be enabled. Also note that although `subchart2` has a condition
specified, there is no corresponding path and value in the parent's values so
that condition has no effect.

`subchart2`는 `back-end`와 태그되었고 이 태그는 `true`로 평가되어서, `subchart2`는 활성화된다. 또한 `subchart2`가 특정한 condition을 가지지만, 부모의 values에 대응되는 경로가 없어서 이 condition은 아무 영향이 없다.

##### 태그 및 조건과 함께 CLI 사용

The `--set` parameter can be used as usual to alter tag and condition values.

`--set` 파라미터는 보통 tag와 condition 값을 수정할때 사용할 수 있다.

```console
helm install --set tags.front-end=true --set subchart2.enabled=false
```

##### 태그 및 조건 확인

- **Conditions (when set in values) always override tags.** The first condition
  path that exists wins and subsequent ones for that chart are ignored.
- **(values에 셋팅된) Condition은 항상 tag를 덮어쓴다.** 존재하는 첫번째 condition 경로가 사용되고 그 차트의 다른 것들은 무시된다.
- Tags are evaluated as 'if any of the chart's tags are true then enable the
  chart'.
- tag는 '어떤 차트의 tag라도 true면 차트를 활성화 시킬것' 으로 평가한다.
- Tags and conditions values must be set in the top parent's values.
- tag와 condition 값은 최상단 부모의 values에 셋팅되어야 한다.
- The `tags:` key in values must be a top level key. Globals and nested `tags:`
  tables are not currently supported.
- values의 `tags:` 키는 최상단 레벨의 키여야 한다. 전역과 중첩된 `tags:` 테이블은 현재 지원되지 않는다.

#### 의존성을 통해 자식 값 가져오기

In some cases it is desirable to allow a child chart's values to propagate to
the parent chart and be shared as common defaults. An additional benefit of
using the `exports` format is that it will enable future tooling to introspect
user-settable values.

몇몇 케이스에서 자식 차트의 values가 부모의 차트에 영향을 미치고 공통 기본값으로 공유되도록 하고싶을 수 있다. `exports` 포맷을 사용하는 것의 추가 이점은 향후 도구를 통해 사용자가 설정할수 있는 값을 가능하게 하는 것이다.

The keys containing the values to be imported can be specified in the parent
chart's `dependencies` in the field `import-values` using a YAML list. Each item
in the list is a key which is imported from the child chart's `exports` field.

import 될 값을 포함하는 키는 YAML 리스트를 사용해서 부모 차트의 `dependencies` 안에 `import-values` 필드로 명시할 수 있다. 리스트의 각 아이템은 자식 차트의 `exports` 필드로부터 import 되는 키이다.

To import values not contained in the `exports` key, use the
[child-parent](#자식-부모-형식-사용하기) format. Examples of both formats
are described below.

`exports` 키 안에 포함되지 않은 import value를 사용하려면, [child-parent](#자식-부모-형식-사용하기) 포맷을 사용하라. 두 포맷 모두 아래에서 설명한다.

##### 내보내기 형식 사용하기

If a child chart's `values.yaml` file contains an `exports` field at the root,
its contents may be imported directly into the parent's values by specifying the
keys to import as in the example below:

자식의 `values.yaml`파일이 루트에 `exports` 필드를 가진다면, 이 필드의 내용은 다음 예제처럼 import 하기 위한 키를 명시함으로써 부모의 values에 직접 import 될수 있다.

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - data
```

```yaml
# child's values.yaml file

exports:
  data:
    myint: 99
```

Since we are specifying the key `data` in our import list, Helm looks in the
`exports` field of the child chart for `data` key and imports its contents.

import 리스트에 `data` 키를 명시했기 때문에, 헬름은 `data` 키에 대한 자식 차트의 `exports` 필드를 찾고 그것의 내용을 import 한다.

The final parent values would contain our exported field:

최종 부모의 values는 export된 필드를 포함한다.

```yaml
# parent's values

myint: 99
```

Please note the parent key `data` is not contained in the parent's final values.
If you need to specify the parent key, use the 'child-parent' format.

부모의 `data`키가 부모의 최종 values에 포함되지 않음을 주의하라. 부모의 키에 명시할 필요가 있다면, 'child-parent' 포맷을 사용하라.

##### 자식-부모 형식 사용하기

To access values that are not contained in the `exports` key of the child
chart's values, you will need to specify the source key of the values to be
imported (`child`) and the destination path in the parent chart's values
(`parent`).

The `import-values` in the example below instructs Helm to take any values found
at `child:` path and copy them to the parent's values at the path specified in
`parent:`

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    ...
    import-values:
      - child: default.data
        parent: myimports
```

In the above example, values found at `default.data` in the subchart1's values
will be imported to the `myimports` key in the parent chart's values as detailed
below:

```yaml
# parent's values.yaml file

myimports:
  myint: 0
  mybool: false
  mystring: "helm rocks!"
```

```yaml
# subchart1's values.yaml file

default:
  data:
    myint: 999
    mybool: true
```

The parent chart's resulting values would be:

```yaml
# parent's final values

myimports:
  myint: 999
  mybool: true
  mystring: "helm rocks!"
```

The parent's final values now contains the `myint` and `mybool` fields imported
from subchart1.

### `charts/` 디렉토리를 통해 수동으로 의존성 관리

If more control over dependencies is desired, these dependencies can be
expressed explicitly by copying the dependency charts into the `charts/`
directory.

A dependency can be either a chart archive (`foo-1.2.3.tgz`) or an unpacked
chart directory. But its name cannot start with `_` or `.`. Such files are
ignored by the chart loader.

For example, if the WordPress chart depends on the Apache chart, the Apache
chart (of the correct version) is supplied in the WordPress chart's `charts/`
directory:

```yaml
wordpress:
  Chart.yaml
  # ...
  charts/
    apache/
      Chart.yaml
      # ...
    mysql/
      Chart.yaml
      # ...
```

The example above shows how the WordPress chart expresses its dependency on
Apache and MySQL by including those charts inside of its `charts/` directory.

**TIP:** _To drop a dependency into your `charts/` directory, use the `helm
pull` command_

### 의존성 사용의 운영적 관점

The above sections explain how to specify chart dependencies, but how does this
affect chart installation using `helm install` and `helm upgrade`?

Suppose that a chart named "A" creates the following Kubernetes objects

- namespace "A-Namespace"
- statefulset "A-StatefulSet"
- service "A-Service"

Furthermore, A is dependent on chart B that creates objects

- namespace "B-Namespace"
- replicaset "B-ReplicaSet"
- service "B-Service"

After installation/upgrade of chart A a single Helm release is created/modified.
The release will create/update all of the above Kubernetes objects in the
following order:

- A-Namespace
- B-Namespace
- A-Service
- B-Service
- B-ReplicaSet
- A-StatefulSet

This is because when Helm installs/upgrades charts, the Kubernetes objects from
the charts and all its dependencies are

- aggregrated into a single set; then
- sorted by type followed by name; and then
- created/updated in that order.

Hence a single release is created with all the objects for the chart and its
dependencies.

The install order of Kubernetes types is given by the enumeration InstallOrder
in kind_sorter.go (see [the Helm source
file](https://github.com/helm/helm/blob/484d43913f97292648c867b56768775a55e4bba6/pkg/releaseutil/kind_sorter.go)).

## 템플릿과 값

Helm Chart templates are written in the [Go template
language](https://golang.org/pkg/text/template/), with the addition of 50 or so
add-on template functions [from the Sprig
library](https://github.com/Masterminds/sprig) and a few other [specialized
functions]({{< ref "/docs/howto/charts_tips_and_tricks.md" >}}).

All template files are stored in a chart's `templates/` folder. When Helm
renders the charts, it will pass every file in that directory through the
template engine.

Values for the templates are supplied two ways:

- Chart developers may supply a file called `values.yaml` inside of a chart.
  This file can contain default values.
- Chart users may supply a YAML file that contains values. This can be provided
  on the command line with `helm install`.

When a user supplies custom values, these values will override the values in the
chart's `values.yaml` file.

### 템플릿 파일

Template files follow the standard conventions for writing Go templates (see
[the text/template Go package
documentation](https://golang.org/pkg/text/template/) for details). An example
template file might look something like this:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

The above example, based loosely on
[https://github.com/deis/charts](https://github.com/deis/charts), is a template
for a Kubernetes replication controller. It can use the following four template
values (usually defined in a `values.yaml` file):

- `imageRegistry`: The source registry for the Docker image.
- `dockerTag`: The tag for the docker image.
- `pullPolicy`: The Kubernetes pull policy.
- `storage`: The storage backend, whose default is set to `"minio"`

All of these values are defined by the template author. Helm does not require or
dictate parameters.

To see many working charts, check out the [Kubernetes Charts
project](https://github.com/helm/charts)

### 미리 정의된 값

Values that are supplied via a `values.yaml` file (or via the `--set` flag) are
accessible from the `.Values` object in a template. But there are other
pre-defined pieces of data you can access in your templates.

The following values are pre-defined, are available to every template, and
cannot be overridden. As with all values, the names are _case sensitive_.

- `Release.Name`: The name of the release (not the chart)
- `Release.Namespace`: The namespace the chart was released to.
- `Release.Service`: The service that conducted the release.
- `Release.IsUpgrade`: This is set to true if the current operation is an
  upgrade or rollback.
- `Release.IsInstall`: This is set to true if the current operation is an
  install.
- `Chart`: The contents of the `Chart.yaml`. Thus, the chart version is
  obtainable as `Chart.Version` and the maintainers are in `Chart.Maintainers`.
- `Files`: A map-like object containing all non-special files in the chart. This
  will not give you access to templates, but will give you access to additional
  files that are present (unless they are excluded using `.helmignore`). Files
  can be accessed using `{{ index .Files "file.name" }}` or using the
  `{{.Files.Get name }}` function. You can also access the contents of the file
  as `[]byte` using `{{ .Files.GetBytes }}`
- `Capabilities`: A map-like object that contains information about the versions
  of Kubernetes (`{{ .Capabilities.KubeVersion }}` and the supported Kubernetes
  API versions (`{{ .Capabilities.APIVersions.Has "batch/v1" }}`)

**NOTE:** Any unknown `Chart.yaml` fields will be dropped. They will not be
accessible inside of the `Chart` object. Thus, `Chart.yaml` cannot be used to
pass arbitrarily structured data into the template. The values file can be used
for that, though.

### 값 파일

Considering the template in the previous section, a `values.yaml` file that
supplies the necessary values would look like this:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

A values file is formatted in YAML. A chart may include a default `values.yaml`
file. The Helm install command allows a user to override values by supplying
additional YAML values:

```console
$ helm install --generate-name --values=myvals.yaml wordpress
```

When values are passed in this way, they will be merged into the default values
file. For example, consider a `myvals.yaml` file that looks like this:

```yaml
storage: "gcs"
```

When this is merged with the `values.yaml` in the chart, the resulting generated
content will be:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"
```

Note that only the last field was overridden.

**NOTE:** The default values file included inside of a chart _must_ be named
`values.yaml`. But files specified on the command line can be named anything.

**NOTE:** If the `--set` flag is used on `helm install` or `helm upgrade`, those
values are simply converted to YAML on the client side.

**NOTE:** If any required entries in the values file exist, they can be declared
as required in the chart template by using the ['required' function]({{< ref
"/docs/howto/charts_tips_and_tricks.md" >}})

Any of these values are then accessible inside of templates using the `.Values`
object:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

### 범위, 의존성, 값

Values files can declare values for the top-level chart, as well as for any of
the charts that are included in that chart's `charts/` directory. Or, to phrase
it differently, a values file can supply values to the chart as well as to any
of its dependencies. For example, the demonstration WordPress chart above has
both `mysql` and `apache` as dependencies. The values file could supply values
to all of these components:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

Charts at a higher level have access to all of the variables defined beneath. So
the WordPress chart can access the MySQL password as `.Values.mysql.password`.
But lower level charts cannot access things in parent charts, so MySQL will not
be able to access the `title` property. Nor, for that matter, can it access
`apache.port`.

Values are namespaced, but namespaces are pruned. So for the WordPress chart, it
can access the MySQL password field as `.Values.mysql.password`. But for the
MySQL chart, the scope of the values has been reduced and the namespace prefix
removed, so it will see the password field simply as `.Values.password`.

#### 전역 값

As of 2.0.0-Alpha.2, Helm supports special "global" value. Consider this
modified version of the previous example:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

The above adds a `global` section with the value `app: MyWordPress`. This value
is available to _all_ charts as `.Values.global.app`.

For example, the `mysql` templates may access `app` as `{{
.Values.global.app}}`, and so can the `apache` chart. Effectively, the values
file above is regenerated like this:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  global:
    app: MyWordPress
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  global:
    app: MyWordPress
  port: 8080 # Passed to Apache
```

This provides a way of sharing one top-level variable with all subcharts, which
is useful for things like setting `metadata` properties like labels.

If a subchart declares a global variable, that global will be passed _downward_
(to the subchart's subcharts), but not _upward_ to the parent chart. There is no
way for a subchart to influence the values of the parent chart.

Also, global variables of parent charts take precedence over the global
variables from subcharts.

### 스키마 파일

Sometimes, a chart maintainer might want to define a structure on their values.
This can be done by defining a schema in the `values.schema.json` file. A schema
is represented as a [JSON Schema](https://json-schema.org/). It might look
something like this:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "properties": {
    "image": {
      "description": "Container Image",
      "properties": {
        "repo": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "name": {
      "description": "Service name",
      "type": "string"
    },
    "port": {
      "description": "Port",
      "minimum": 0,
      "type": "integer"
    },
    "protocol": {
      "type": "string"
    }
  },
  "required": [
    "protocol",
    "port"
  ],
  "title": "Values",
  "type": "object"
}
```

This schema will be applied to the values to validate it. Validation occurs when
any of the following commands are invoked:

- `helm install`
- `helm upgrade`
- `helm lint`
- `helm template`

An example of a `values.yaml` file that meets the requirements of this schema
might look something like this:

```yaml
name: frontend
protocol: https
port: 443
```

Note that the schema is applied to the final `.Values` object, and not just to
the `values.yaml` file. This means that the following `yaml` file is valid,
given that the chart is installed with the appropriate `--set` option shown
below.

```yaml
name: frontend
protocol: https
```

```console
helm install --set port=443
```

Furthermore, the final `.Values` object is checked against *all* subchart
schemas. This means that restrictions on a subchart can't be circumvented by a
parent chart. This also works backwards - if a subchart has a requirement that
is not met in the subchart's `values.yaml` file, the parent chart *must* satisfy
those restrictions in order to be valid.

### 참고 자료

When it comes to writing templates, values, and schema files, there are several
standard references that will help you out.

- [Go templates](https://godoc.org/text/template)
- [Extra template functions](https://godoc.org/github.com/Masterminds/sprig)
- [The YAML format](https://yaml.org/spec/)
- [JSON Schema](https://json-schema.org/)

## 사용ㅈ아 지정 리소스정의 (CRDs)

Kubernetes provides a mechanism for declaring new types of Kubernetes objects.
Using CustomResourceDefinitions (CRDs), Kubernetes developers can declare custom
resource types.

In Helm 3, CRDs are treated as a special kind of object. They are installed
before the rest of the chart, and are subject to some limitations.

CRD YAML files should be placed in the `crds/` directory inside of a chart.
Multiple CRDs (separated by YAML start and end markers) may be placed in the
same file. Helm will attempt to load _all_ of the files in the CRD directory
into Kubernetes.

CRD files _cannot be templated_. They must be plain YAML documents.

When Helm installs a new chart, it will upload the CRDs, pause until the CRDs
are made available by the API server, and then start the template engine, render
the rest of the chart, and upload it to Kubernetes. Because of this ordering,
CRD information is available in the `.Capabilities` object in Helm templates,
and Helm templates may create new instances of objects that were declared in
CRDs.

For example, if your chart had a CRD for `CronTab` in the `crds/` directory, you
may create instances of the `CronTab` kind in the `templates/` directory:

```text
crontabs/
  Chart.yaml
  crds/
    crontab.yaml
  templates/
    mycrontab.yaml
```

The `crontab.yaml` file must contain the CRD with no template directives:

```yaml
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
```

Then the template `mycrontab.yaml` may create a new `CronTab` (using templates
as usual):

```yaml
apiVersion: stable.example.com
kind: CronTab
metadata:
  name: {{ .Values.name }}
spec:
   # ...
```

Helm will make sure that the `CronTab` kind has been installed and is available
from the Kubernetes API server before it proceeds installing the things in
`templates/`.

### CRD 에서의 제약사항

Unlike most objects in Kubernetes, CRDs are installed globally. For that reason,
Helm takes a very cautious approach in managing CRDs. CRDs are subject to the
following limitations:

- CRDs are never reinstalled. If Helm determines that the CRDs in the `crds/`
  directory are already present (regardless of version), Helm will not attempt
  to install or upgrade.
- CRDs are never installed on upgrade or rollback. Helm will only create CRDs on
  installation operations.
- CRDs are never deleted. Deleting a CRD automatically deletes all of the CRD's
  contents across all namespaces in the cluster. Consequently, Helm will not
  delete CRDs.

Operators who want to upgrade or delete CRDs are encouraged to do this manually
and with great care.

## 헬름을 사용하여 차트 관리하기

The `helm` tool has several commands for working with charts.

It can create a new chart for you:

```console
$ helm create mychart
Created mychart/
```

Once you have edited a chart, `helm` can package it into a chart archive for
you:

```console
$ helm package mychart
Archived mychart-0.1.-.tgz
```

You can also use `helm` to help you find issues with your chart's formatting or
information:

```console
$ helm lint mychart
No issues found
```

## 차트 레포지토리

A _chart repository_ is an HTTP server that houses one or more packaged charts.
While `helm` can be used to manage local chart directories, when it comes to
sharing charts, the preferred mechanism is a chart repository.

Any HTTP server that can serve YAML files and tar files and can answer GET
requests can be used as a repository server. The Helm team has tested some
servers, including Google Cloud Storage with website mode enabled, and S3 with
website mode enabled.

A repository is characterized primarily by the presence of a special file called
`index.yaml` that has a list of all of the packages supplied by the repository,
together with metadata that allows retrieving and verifying those packages.

On the client side, repositories are managed with the `helm repo` commands.
However, Helm does not provide tools for uploading charts to remote repository
servers. This is because doing so would add substantial requirements to an
implementing server, and thus raise the barrier for setting up a repository.

## 차트 사용 팩

The `helm create` command takes an optional `--starter` option that lets you
specify a "starter chart".

Starters are just regular charts, but are located in
`$XDG_DATA_HOME/helm/starters`. As a chart developer, you may author charts that
are specifically designed to be used as starters. Such charts should be designed
with the following considerations in mind:

- The `Chart.yaml` will be overwritten by the generator.
- Users will expect to modify such a chart's contents, so documentation should
  indicate how users can do so.
- All occurrences of `<CHARTNAME>` will be replaced with the specified chart
  name so that starter charts can be used as templates.

Currently the only way to add a chart to `$XDG_DATA_HOME/helm/starters` is to
manually copy it there. In your chart's documentation, you may want to explain
that process.
