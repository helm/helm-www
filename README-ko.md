![github-banner-helm-helmwww](https://user-images.githubusercontent.com/686194/68531441-f4ad4e00-02c6-11ea-982b-74d7c3ff0071.png)

여기서 [헬름](https://github.com/helm/helm) 프로젝트의 웹 사이트 [helm.sh](https://helm.sh/)를 구성하는 모든 것을 확인할 수 있습니다. 문서를 편집하거나 웹 사이트 버그를 보고하거나 새 블로그 게시물을 작성하려는 경우 잘 찾아오셨습니다!

## 개발

Helm.sh는 간단한 [Docusaurus](https://docusaurus.io/) 정적 사이트입니다. 웹 사이트를 로컬에서 실행하려면 먼저 의존성을 설치해야 합니다.

```
yarn
```

그런 다음 사이트를 로컬에서 컴파일하고 실행할 수 있습니다.

```
yarn start
```

## 배포 [![Netlify Status](https://api.netlify.com/api/v1/badges/8ffabb30-f2f4-45cc-b0fa-1b4adda00b5e/deploy-status)](https://app.netlify.com/sites/helm-merge/deploys)

변경 사항을 `main` 브랜치에 병합하면 [넷틀리파이(Netlify)](https://app.netlify.com/sites/helm-merge/deploys)에 자동으로 배포됩니다. 빌드 로그는 [여기](https://app.netlify.com/sites/helm-merge/deploys)에서 확인할 수 있습니다.

---

## 기여

누구나 풀 리퀘스트(PR)를 제출하여 Helm.sh을 편집할 수 있습니다. 커밋을 위해서는 서명이 필요합니다. [기여 가이드](https://github.com/helm/helm/blob/main/CONTRIBUTING.md#sign-your-work)를 참조하세요.

풀 리퀘스트는 병합되기 전에 [관리자](https://github.com/helm/helm-www/blob/main/OWNERS)의 승인이 필요합니다.

### 헬름 문서를 편집하는 방법

헬름 v4 문서는 이 저장소의 `/docs/` 에 있습니다. 헬름 v4 문서의 사이드바는 `sidebars.js`에 있습니다.

헬름 v3 문서는 `versioned-docs/version-3` 에 있습니다. 헬름 v3 문서의 사이드바는 `versioned-sidebars/sidebars-version-2.js`에 있습니다.

이전 버전의 경우, [기본 헬름 저장소](https://github.com/helm/helm/tree/dev-v2/docs)의 dev-v2 브랜치를 참조합니다.

### 헬름 CLI 레퍼런스 문서 업데이트

헬름 CLI 명령어 목록에 대한 문서는 기본 헬름 프로젝트 저장소에서 [내보내지고](https://github.com/helm/helm/blob/a6b2c9e2126753f6f94df231e89b2153c2862764/cmd/helm/root.go#L169), [여기](https://helm.sh/docs/helm)에서 레퍼런스로 제공됩니다.

문서를 업데이트하려면 다음을 수행해야 합니다.

1. `helm plugin uninstall` 을 실행하여 현재 설치된 모든 플러그인을 제거합니다.
2. `content/en/docs/helm/` 으로 이동합니다.
3. 기존 마크다운 파일을 대체하여 새로운 마크다운 문서 파일을 생성하기 위해 `HOME='~' helm docs --type markdown --generate-headers`를 실행합니다. **참고:** 문서를 빌드하려는 helm 버전을 실행해야 합니다 (예: 올바른 태그를 체크아웃하고 빌드)
4. 변경 내용을 커밋하고 PR을 만들어 웹 사이트를 업데이트합니다.

### 블로그 게시물을 작성하는 방법

블로그 게시물은 풀 리퀘스트를 통해 만들어집니다. 다음 단계를 사용하여 추가합니다.

1. `/blog/` 디렉터리에 게시 날짜와 제목이 파일명인 새 파일을 추가합니다. 파일은 마크다운 형식이어야 합니다. 형식 예시는 기존 제목을 참조합니다.
2. 이 형식을 사용하여 파일에 헤더 메타데이터를 추가합니다.

   ```yaml
   ---
   title: "Blog Title"
   slug: "blog-slug"
   # from /blog/authors.yml
   authors: ["firstlast"]
   date: "YYYY-MM-DD"
   ---
   ```

3. 이 저자의 첫 번째 블로그 게시물인 경우, `/blog/authors.yml`을 업데이트하여 새 저자 레코드를 추가합니다.
   ```yaml
   # authors.yml
   johndoe:
     name: John Doe
     image_url: https://github.com/johndoe.png
     page: true
     socials:
       github: johndoe
       linkedin: johndoe
       website: http://johndoe.com/
   ```
4. `---` 아래에 마크다운으로 내용을 추가합니다. 이 섹션에는 제목을 포함할 필요가 없습니다.
5. 모든 이미지는 `/blog/images/` 디렉토리에 두어야 합니다. 이미지 크기를 줄이려면 무손실 압축되어야 합니다. [ImageOptim](https://imageoptim.com/)와 같은 도구를 사용할 수 있습니다.
6. 블로그 인덱스 페이지의 내용을 요약하려면 마크다운 파일에 `<!--truncate-->` 구분자를 넣습니다. 이렇게 하면 _더 읽기_ 링크로 내용 끝을 자릅니다.

블로그 PR은 병합되기 전에 주요 헬름 [관리자](https://github.com/helm/helm/blob/main/OWNERS)들의 승인이 필요합니다.

### 버전 관리

이 저장소의 다음 파일들이 버전 관리를 제어하는 데 사용됩니다:

- 버전 관리된 문서는 `versioned_docs`에 있습니다.
- 각 버전에 해당하는 사이드바는 `versioned_sidebars`에 있습니다.
- 버전 관리 동작은 `docusaurus.config.js` 파일에서 관리됩니다:

  ```js
  export default {
    presets: [
      '@docusaurus/preset-classic',
      docs: {
      // lastVersion = 최신 릴리스 버전 (/versioned_docs의 특정 버전 또는 'current')
      // 최신으로 나열되지 않은 버전의 경우, 사용자가 오래되었거나 사전 릴리스 문서를 보고 있다는 경고 배너가 자동으로 표시됩니다
        lastVersion: '3',
        versions: {
          // current = 최상위 /docs 디렉토리의 문서. 이것들은 사전 릴리스이거나 최신 릴리스 버전일 수 있습니다
          // label = 네비게이션 바 드롭다운에 표시되는 버전 레이블
          current: { label: '4.0.0-alpha.1 🚧' },
          // 번호가 매겨진 버전은 /versioned_docs의 디렉토리에 해당합니다
          '3': { label: '3.19.0' },
          '2': { label: '2.17.0' },
        },
      },
    ],
  };
  ```

- 사용 가능한 버전 목록은 `versions.json`에서 유지됩니다.

아래 표는 이 저장소의 버전 관리된 문서에 매핑되는 버전 레이블과 URL 경로를 설명합니다:

| 저장소 경로                            | 버전                 | URL 경로            |
| -------------------------------------- | -------------------- | ------------------- |
| `versioned_docs/version-2/filename.md` | 2.17.0               | /docs/2/filename    |
| `versioned_docs/version-3/filename.md` | 3.19.0 (최신)        | /docs/filename      |
| `docs/filename.md`                     | 4.0.0-alpha.1 (현재) | /docs/next/filename |

#### 사전 릴리스 문서를 GA로 이동하는 방법

Docusaurus는 _사전 릴리스_ (알파, 베타) 문서 게시를 지원합니다. 기본적으로 사전 릴리스 문서는 helm.sh/docs/next에서 게시되며 이 저장소의 최상위 `/docs` 디렉토리에서 제공됩니다. 또한 Docusaurus는 사용자가 릴리스되지 않은 문서를 보고 있다는 것을 알리기 위해 모든 사전 릴리스 문서에 자동으로 배너를 적용합니다.

Helm의 사전 릴리스 버전이 GA로 승격될 때, 사전 릴리스 문서를 helm.sh/docs/next에서 helm.sh/docs로 이동하려면 다음을 수행합니다:

1. `docusaurus.config.js`를 업데이트하여 `lastVersion`을 `'current'`로 설정합니다. 이렇게 하면 메인 `/docs` 폴더의 내용이 helm.sh`/docs`에 게시됩니다.

   ```js
   // docusaurus.config.js
   lastVersion: 'current',
   ```

1. `current` 버전의 네비게이션 바 `label`을 업데이트합니다. 예를 들어:

   ```js
   // docusaurus.config.js
   current: { label: '4.0.0' },
   ```

1. 변경사항을 테스트하기 위해 로컬 미리보기를 시작합니다. "릴리스되지 않음" 배너가 현재 버전에서 제거되고 현재 버전이 helm.sh/docs/next가 아닌 helm.sh/docs에서 사용할 수 있게 되는 것을 확인해야 합니다.

#### 새로운 사전 릴리스 버전을 만드는 방법

새 버전 만들기는 `/docs` 디렉토리 내용을 `versioned_docs`의 버전 관리된 폴더로 복사하는 것을 의미합니다. 새로운 _주요_ 사전 릴리스 버전의 문서를 게시할 준비가 되었을 때 버전을 만듭니다. 이는 일반적으로 Helm의 새로운 알파 버전이 개발되고 문서화할 준비가 되었을 때입니다.

**참고:** Helm의 사전 릴리스 버전이 개발되고 문서화할 준비가 될 때까지는 새 버전 만들기를 권장하지 않습니다. 그렇지 않으면 문서를 두 곳에서 유지해야 하므로(둘 다 `/docs`와 최신 `/versioned_docs` 폴더), 관리자가 동기화 상태를 유지하기 위해 추가 작업을 해야 합니다. 대신 아래의 *사전 릴리스 문서를 GA로 이동하는 방법*을 참조하세요.

새 버전을 만들려면:

1. `<version>`이 주요 Helm 버전에 해당하는 정수인 `yarn docusaurus docs:version <version>`을 실행합니다. 예를 들어, Helm v5에 대한 새로운 사전 릴리스 문서를 게시하려면 v4 문서 내용을 새로운 `version-4` 폴더로 복사하기 위해 `yarn docusaurus docs:version 4`를 실행할 수 있습니다.

   이 명령은 다음을 수행합니다:

   - 전체 `docs/` 폴더 내용을 새로운 `versioned_docs/version-<version>/` 폴더로 복사합니다.
   - `versioned_sidebars/version-<version>-sidebars.json`에 버전 관리된 사이드바 파일을 생성합니다.
   - `versions.json`에 새 버전 번호를 추가합니다.

1. `docusaurus.config.js` 파일을 업데이트합니다:

   1. `lastVersion`을 최신 GA 버전으로 설정합니다. 이렇게 하면 helm.sh/docs의 문서가 최신 versioned_docs 폴더에서 제공됩니다. 그리고 helm.sh/docs/next의 문서가 메인 `/docs` 폴더에서 제공됩니다.

      예를 들어, Helm v4 문서를 `versioned_docs/version-4/` 디렉토리로 만들고 Helm v5.0.0-alpha.1에 대한 사전 릴리스 문서를 게시하려면 `lastVersion`을 `'4'`로 설정합니다.

   1. `current` 버전의 네비게이션 바 `label`을 업데이트합니다. 예를 들어, 현재(사전 릴리스) 버전을 `5.0.0-alpha.1`로 레이블링하려면 다음과 같이 레이블을 업데이트합니다:

      ```js
      current: { label: '5.0.0-alpha.1 🚧' },
      ```

1. 변경사항을 테스트하기 위해 로컬 미리보기를 시작합니다. 드롭다운에서 새 버전을 보고, helm.sh/docs/next에서 사전 릴리스 문서에 액세스할 수 있으며, 모든 사전 릴리스 문서 상단에 "릴리스되지 않음" 배너가 표시되는 것을 확인해야 합니다.

새 문서 버전 만들기에 대한 자세한 정보는 Docusaurus 문서의 [버전 관리](https://docusaurus.io/docs/versioning)를 참조하세요.

### 국제화 & 번역

**우리 사이트와 문서의 컨텐츠 번역을 환영합니다** 전 세계에서 Helm에 대한 접근을 확장하는 데 도움이 되도록 합니다.

Helm.sh는 여러 언어를 지원합니다. 해외 사용자를 위한 컨텐츠 번역과 구성 가이드는 [헬름 문서 현지화](/community/localization)를 참조하세요.

---

### 행동 강령

헬름 커뮤니티 참여는 헬름 [행동 강령](https://github.com/helm/helm/blob/main/code-of-conduct.md)을 따릅니다.

### 감사합니다!

웹 사이트 및 문서 기여에 감사드립니다! :clap:
