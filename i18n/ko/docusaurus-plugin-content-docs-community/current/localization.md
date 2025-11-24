---
title: 헬름 문서 현지화
description: 헬름 문서 현지화를 위한 설명서
sidebar_position: 5
---

이 가이드에서는 헬름 문서를 현지화하는 방법에 대해 설명한다.

## 시작하기

번역 기여는 문서 기여와 동일한 과정을 거친다.
번역본은 [풀
리퀘스트](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)
를 통해 [helm-www](https://github.com/helm/helm-www) 깃 저장소에 제공되며 풀 리퀘스트는
웹사이트를 관리하는 팀이 검토한다.

### 두 글자 언어 코드 {#two-letter-language-code}

문서는 언어 코드를 [ISO 639-1
표준](https://www.loc.gov/standards/iso639-2/php/code_list.php)으로 구성한다.
예를 들어, 한국어의 두 글자 코드는 `ko` 이다.

내용 및 설정에서 사용 중인 언어 코드를 찾을 수 있다.
세 가지 예:

- `content` 디렉토리에 언어 코드가 하위 디렉토리로 있고
  각 디렉토리마다 번역된 콘텐츠가 있는데,
  주로 `docs` 하위 디렉토리에 있다.
- `i18n` 디렉토리에는 웹사이트에서 사용하는 문구가 포함된
  각 언어에 대한 설정 파일이 있다.
  파일 이름은 `[LANG].toml` 로 지정되며, 여기서 `[LANG]` 은 두 글자 언어 코드다.
- 프로젝트 최상위에 위치한 `config.toml` 파일에는 언어 코드별로 구성된 네비게이션 및
  기타 세부 사항에 대한 설정 정보가 있다.

언어 코드가 `en` 인 영어는,
번역을 위한 기본 언어이자 원본이다.

### 포크, 브랜치, 변경, 풀 리퀘스트

번역본을 기여하려면 먼저 깃헙에 [helm-www 저장소](https://github.com/helm/helm-www)의
[포크를 만드는 것](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)부터
시작한다.
사용자는 자신의 포크를 커밋함으로써 시작하게 된다.

기본적으로 포크는 master라는 기본 브랜치에서 동작하도록 설정된다.
변경 사항을 개발하고 풀 리퀘스트를 생성하기 위해 브랜치를 사용하자. 브랜치가 익숙하지 않다면
[깃헙 문서를
읽어볼 수 있다](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-branches).

브랜치가 있다면 번역을 추가하고 내용을
현지화하자.

참고로 헬름은 [원본 개발자 증명서](https://developercertificate.org/)를 사용한다.
모든 커밋은 서명이 필요하다.
커밋을 생성할 때, 깃에 설정된 이름과 이메일 주소로 서명하기 위해
`-s` 또는 `--signoff` 플래그를 쓸 수 있다.
자세한 내용은
[CONTRIBUTING.md](https://github.com/helm/helm-www/blob/main/CONTRIBUTING.md#sign-your-work)에서
확인할 수 있다.

준비되면 번역본과 함께 다시 helm-www 저장소로 [풀
리퀘스트](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)를
생성하자.

풀 리퀘스트를 생성하면 관리자 중 한 명이 검토할 것이다.
그 과정에 대한 세부사항은
[CONTRIBUTING.md](https://github.com/helm/helm-www/blob/main/CONTRIBUTING.md)에
있다.

## 콘텐츠 번역하기

헬름의 모든 내용을 현지화하는 것은 상당한 작업이다.
작은 부분부터 시작해도 괜찮다. 이 후에 더 번역할 수 있다.

### 새로운 언어 등록하기

새로운 언어를 등록할 때 필요한 최소 요건이 있다. 여기에는 다음이 포함된다:

- `index.md` 파일이 들어 있는 `content/[LANG]/docs` 디렉토리 추가.
  이것은 최상위 문서 랜딩 페이지다.
- `i18n` 디렉토리에 `[LANG].toml` 파일 생성.
  `en.toml` 파일을 복사해서 시작할 수 있다.
- 새로운 언어를 서비스하기 위해 `config.toml` 파일에 해당 언어 섹션 추가.
  기존 언어 섹션을 써서 등록할 수도 있다.

### 번역하기

번역된 콘텐츠는 `content/[LANG]/docs` 디렉토리에 있어야 한다. 이것은 영어 원문과 동일한 URL을
가져야 한다. 예를 들어, 소개 부분을 한국어로 번역하려면 다음과 같이 영어 원문을 복사하는 것이
유용할 수 있다:

```sh
mkdir -p content/ko/docs/intro
cp content/en/docs/intro/install.md content/ko/docs/intro/install.md
```

그러면 새 파일의 내용을 다른 언어로 번역할 수 있다.

영문 파일의 번역되지 않은 사본을 `content/[LANG]/` 에 추가하지 않도록 한다.
사이트에 해당 언어가 존재하면 번역되지 않은 페이지는 자동으로 영문 페이지로 리다이렉션된다.
번역에는 시간이 필요하고,
사용자들은 오래된 버전의 포크가 아닌 최신 버전의 문서를 번역하길 원한다.

헤더 섹션에서 `aliases` 행을 반드시 제거하자.
`aliases: ["/docs/using_helm/"]` 과 같은 행은 번역에 속하지 않는다.
이것은 새로운 페이지 링크로 인해 없어진 링크에 대한 리다이렉션이다.

참고로 번역 도구는 이 과정에 도움을 줄 수 있다.
여기에는 번역기로 생성한 번역도 포함된다.
번역기로 생성한 번역은 내보내기 전에
원어민이 문법과 의미를 편집하거나 검토해야 한다.


## 언어 변경

![Screen Shot 2020-05-11 at 11 24 22
AM](https://user-images.githubusercontent.com/686194/81597103-035de600-937a-11ea-9834-cd9dcef4e914.png)

사이트 전역 [config.toml](https://github.com/helm/helm-www/blob/main/config.toml#L83L89)
파일에서 언어 변경을 구성한다.

새로운 언어를 추가하려면 위에서 정의한 [두 글자
언어 코드](#two-letter-language-code)를 사용하여 새로운 매개 변수 집합을
추가하자. 예:

```
# Korean
[languages.ko]
title = "Helm"
description = "Helm - The Kubernetes Package Manager."
contentDir = "content/ko"
languageName = "한국어 Korean"
weight = 1
```

## 내부 링크 결정하기

번역된 콘텐츠는 간혹 번역되지 않은 페이지에 대한 링크를 포함한다. 이로 인해 사이트 [빌드
오류](https://app.netlify.com/sites/helm-merge/deploys)가 발생할 수 있다.
예:

```
12:45:31 PM: htmltest started at 12:45:30 on app
12:45:31 PM: ========================================================================
12:45:31 PM: ko/docs/chart_template_guide/accessing_files/index.html
12:45:31 PM:   hash does not exist --- ko/docs/chart_template_guide/accessing_files/index.html --> #basic-example
12:45:31 PM: ✘✘✘ failed in 197.566561ms
12:45:31 PM: 1 error in 212 documents
```

이 문제를 해결하려면 콘텐츠에서 내부 링크를 확인해야 한다.

* 앵커 링크는 번역된 `id` 값을 반영해야 한다.
* 내부 페이지 링크를 고쳐야 한다.

존재하지 않는 _(혹은 아직 번역되지 않은)_ 내부 페이지가 있을 경우,
교정될 때까지 사이트가 빌드되지 않는다.
그 대신 URL은 다음과 같이 해당 콘텐츠가 _존재하는_ 다른 언어를 가리킬 수 있다.

`< relref path="/docs/topics/library_charts.md" lang="en" >`

자세한 내용은 [언어 간 상호 참조에 대한 휴고(Hugo)
문서](https://gohugo.io/content-management/cross-references/#link-to-another-language-version)
를 참조하자.
