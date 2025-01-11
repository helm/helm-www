![github-banner-helm-helmwww](https://user-images.githubusercontent.com/686194/68531441-f4ad4e00-02c6-11ea-982b-74d7c3ff0071.png)


여기서 [헬름](https://github.com/helm/helm) 프로젝트의 웹 사이트 [helm.sh](https://helm.sh/)를 구성하는 모든 것을 확인할 수 있습니다. 문서를 편집하거나 웹 사이트 버그를 보고하거나 새 블로그 게시물을 작성하려는 경우 잘 찾아오셨습니다!


## 개발

Helm.sh는 사용자 지정 테마를 사용하여 구축된 간단한 [휴고(Hugo)](https://gohugo.io/) 정적 사이트입니다. 웹 사이트를 로컬에서 실행하려면 먼저 휴고와 이와 관련된 모듈(dependencies)을 [설치](https://gohugo.io/getting-started)해야 합니다.

```
brew install hugo yarn node
yarn install
```

설치 후에 사이트를 로컬에서 컴파일하고 실행할 수 있습니다.

```
hugo serve
```

## 배포 [![Netlify Status](https://api.netlify.com/api/v1/badges/8ffabb30-f2f4-45cc-b0fa-1b4adda00b5e/deploy-status)](https://app.netlify.com/sites/helm-merge/deploys)

변경 사항을 `main` 브랜치에 병합하면 [넷틀리파이(Netlify)](https://app.netlify.com/sites/helm-merge/deploys)에 자동으로 배포됩니다. 빌드 로그는 [여기](https://app.netlify.com/sites/helm-merge/deploys)에서 확인할 수 있습니다.


---

## 기여

누구나 풀 리퀘스트(PR)를 제출하여 Helm.sh을 편집할 수 있습니다. 커밋을 위해서는 서명이 필요합니다. [기여 가이드](https://github.com/helm/helm/blob/main/CONTRIBUTING.md#sign-your-work)를 참조하세요.

풀 리퀘스트는 병합되기 전에 [관리자](https://github.com/helm/helm-www/blob/main/OWNERS)의 승인이 필요합니다.


### 헬름 문서를 편집하는 방법

헬름 3 릴리스 이후 모든 프로젝트 문서는 이 저장소 `/content/en/docs/` 에 있습니다.

이전 버전의 경우, [기본 헬름 저장소](https://github.com/helm/helm/tree/dev-v2/docs)의 dev-v2 브랜치를 참조합니다.


### 헬름 CLI 레퍼런스 문서 업데이트

헬름 CLI 명령어 목록에 대한 문서는 기본 헬름 프로젝트 저장소에서 [내보내지고](https://github.com/helm/helm/blob/a6b2c9e2126753f6f94df231e89b2153c2862764/cmd/helm/root.go#L169), [여기](https://helm.sh/docs/helm)에서 레퍼런스로 제공됩니다.

문서를 업데이트하려면 다음을 수행해야 합니다.

1. `helm plugin uninstall` 을 실행하여 현재 설치된 모든 플러그인을 제거합니다.
2. `content/en/docs/helm/` 으로 이동합니다.
3. 기존 마크다운 파일을 대체하여 새로운 마크다운 문서 파일을 생성하기 위해 `helm docs --type markdown`을 실행합니다.
4. 변경된 각 파일에 YAML 프런트 매터(front-matter)를 다시 추가합니다.
5. 변경 내용을 커밋하고 PR을 만들어 웹 사이트를 업데이트합니다.


### 블로그 게시물을 작성하는 방법

블로그 게시물은 풀 리퀘스트를 통해 만들어집니다. 다음 단계를 사용하여 추가합니다.

1) 새 파일을 `content/en/blog/` 디렉터리에 추가합니다. 디렉터리의 이름은 게시 날짜 및 제목입니다. 파일은 마크다운 형식이어야 합니다. 형식 예시는 기존 제목을 참조합니다.
2) 아래 형식을 사용하여 헤더 메타데이터를 파일에 추가합니다(퍼머링크 구조 참고). 이름(들)이어야 하는 `authorname` 은 권장되지만 필수는 아닌 필드이며, 게시물에 그대로 표시됩니다. 또한 `authorlink` 는 `authorname` 이 사용하는 링크입니다.

```yaml
---
title: "A Fancy Title"
slug: "fancy-title"
authorname: "Captain Awesome"
authorlink: "https://example.com"
date: "yyyy-mm-dd"
---
```

3) 게시물 내용을 `---` 아래에 마크다운 형식으로 추가합니다. 제목은 여기에 포함되지 않아도 됩니다.
4) 모든 이미지는 `/content/en/blog/images/` 디렉토리에 두어야 합니다. 이미지 크기를 줄이려면 무손실 압축되어야 합니다. [ImageOptim](https://imageoptim.com/)와 같은 도구를 사용할 수 있습니다.
5) 블로그 인덱스 페이지의 내용을 요약하려면 마크다운 파일에 `<!--more-->` 구분자를 넣습니다. 이렇게 하면 더 읽기(Read More) 링크로 내용 끝을 자릅니다.

블로그 PR은 병합되기 전에 주요 헬름 [관리자](https://github.com/helm/helm/blob/main/OWNERS)들의 승인이 필요합니다.


### 국제화 & 번역

전세계에서 헬름을 더 쉽게 사용할 수 있도록 헬름 사이트 및 문서 **컨텐츠 번역을 환영합니다**.

Helm.sh은 여러 언어를 지원합니다. 해외 사용자를 위한 컨텐츠 번역과 구성 가이드는 [헬름 문서 현지화](https://helm.sh/docs/community/localization/)를 참조하세요.

---

### 행동 강령

헬름 커뮤니티 참여는 헬름 [행동 강령](https://github.com/helm/helm/blob/main/code-of-conduct.md)을 따릅니다.

### 감사합니다!

웹 사이트 및 문서 기여에 감사드립니다! :clap:
