---
title: "릴리스 체크리스트"
description: "다음 버전의 헬름을 출시할 때 유지관리자를 위한 체크리스트"
weight: 2
---

# 헬름 릴리스에 대한 유지관리자 가이드

새로운 헬름을 출시할 시간이다! 릴리스를 끊는 헬름 유지관리자로서,
자신의 경험이 여기에 문서화된 내용과 다른 점이 있다면
[이 릴리스 체크리스트를 업데이트](https://github.com/helm/helm-www/blob/main/content/ko/docs/community/release_checklist.md)하기에 
딱 맞는 사람이다.

모든 릴리스는 vX.Y.Z 형식이다. 
여기서 X는 주 버전 번호, Y는 부 버전 번호, Z는 패치 릴리스 번호이다. 
이 프로젝트는 [유의적 버전 관리] (https://semver.org/)를 엄격히 따르므로 
이 단계를 따르는 것이 매우 중요하다.

헬름은 다음 마이너 릴리스 날짜를 미리 발표한다. 
발표된 날짜를 지키기 위해 최선을 다해야 한다. 
또한 릴리스 프로세스를 시작할 때, 다음 릴리스 날짜를 선택해야 하며
릴리스 프로세스의 일환이다.

이 지침은 초기 구성에 이어 세 가지 
다른 종류의 릴리스에 대한 릴리스 절차를 다룬다.

* 주 릴리스 - 상대적으로 낮은 빈도로 릴리스 - 주요 변경 사항이 있음
* 부 릴리스 - 3~4개월마다 릴리스 - 주요 변경 사항 없음
* 패치 릴리스 - 매월 릴리스 - 이 가이드의 모든 단계가 불필요

[초기 구성](#초기-구성)

1. [릴리스 브랜치 생성](#1-릴리스-브랜치-생성)
2. [주 또는 부 릴리스: git에서 버전 번호 변경](#2-git에서-주-또는-부-버전-번호-변경)
3. [주/부 릴리스: 릴리스 브랜치 커밋 및 푸시](#3-주부-릴리스-릴리스-브랜치-커밋-및-푸시)
4. [주/부 릴리스: 릴리스 후보 생성](#4-주부-릴리스-릴리스-후보-생성)
5. [주/부 릴리스: 연속 릴리스 후보 개선](#5-주부-릴리스-연속-릴리스-후보-개선)
6. [릴리스 확정](#6-릴리스-확정)
7. [릴리스 노트 작성](#7-릴리스-노트-작성)
8. [다운로드에 PGP 서명](#8-다운로드에-pgp-서명)
9. [릴리스 출간](#9-릴리스-출간)
10. [문서 업데이트](#10-문서-업데이트)
11. [커뮤니티에 알리기](#11-커뮤니티에-알리기)

## 초기 구성

### Git 원격 설정하기

이 문서에서는 저장소에서 <https://github.com/helm/helm>에 해당하는 
Git 원격의 이름이 "upstream"이라고 가정한다는 점에 유의해야 한다. 
그렇지 않은 경우(예: 이름을 "origin" 또는 이와 유사한 이름으로 선택한 경우) 
그에 따라 로컬 환경에 맞게 나열된 스니핏(snippet)을 조정해야 한다. 
업스트림 원격의 이름이 확실하지 않은 경우 `git remote -v` 와 
같은 명령을 사용하여 확인하자.

[업스트림 원격](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork)이 
없는 경우 
다음과 같이 추가할 수 있다.

```shell
git remote add upstream git@github.com:helm/helm.git
```

### 환경 변수 설정하기

이 문서에서는 편의를 위해 설정할 수 있는 몇 가지 환경 변수를 
소개한다. 주/부 릴리스의 경우 
다음을 사용하자.

```shell
export RELEASE_NAME=vX.Y.0
export RELEASE_BRANCH_NAME="release-X.Y"
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.1"
```

패치 릴리스를 만드는 경우 대신 다음을 사용하자.

```shell
export PREVIOUS_PATCH_RELEASE=vX.Y.Z
export RELEASE_NAME=vX.Y.Z+1
export RELEASE_BRANCH_NAME="release-X.Y"
```

### 서명 키 설정하기

또한 바이너리를 해싱하고 서명 파일을 제공하여 릴리스 
프로세스의 보안 및 검증을 추가한다. 이 작업은 
[GitHub 및 GPG] (https://help.github.com/en/articles/about-commit-signature-verification)를 
이용하여 수행한다. 
GPG가 아직 설정되지 않은 경우, 다음 단계를 수행할 수 있다.

1. [GPG 설치] (https://gnupg.org/index.html)
2. [GPG 키 
   생성] (https://help.github.com/en/articles/generating-a-new-gpg-key)
3. [GitHub 계정에 
   키 추가] (https://help.github.com/en/articles/adding-a-new-gpg-key-to-your-github-account)
4. [Git에서 서명 
   키 설정] (https://help.github.com/en/articles/telling-git-about-your-signing-key)

서명 키가 있으면 저장소 루트에 있는 KEYS 파일에 추가해야 
한다. KEYS 파일에 추가하는 지시어는 그 파일 안에 있다. 아직
공개 키를 키 서버 네트워크에 추가하지 않았다면 추가해야 한다. 
GnuPG를 사용하는 경우 
[Debian에서 제공하는 지침] (https://debian-administration.org/article/451/Submitting_your_GPG_key_to_a_keyserver)을 따를 수 있다.

## 1. 릴리스 브랜치 생성

### 주/부 릴리스

주요 릴리스는 *이전 호환성을 깨는* 새로운 기능의 추가 및 동작 
변경을 위한 것이다. 부 릴리스는 이전 버전과의 호환성을 깨지 않는 선에서 
새로운 기능 추가를 위한 것이다. 주 또는 부 릴리스를 생성하려면 
먼저 main에서 `release-X.Y` 브랜치를 생성한다.

```shell
git fetch upstream
git checkout upstream/main
git checkout -b $RELEASE_BRANCH_NAME
```

이 새 브랜치는 릴리스의 기반이 되며,
이를 기반으로 하여 변경해 나갈 것이다.

릴리스에 대한 
[헬름/헬름 마일스톤] (https://github.com/helm/helm/milestones)이 GitHub에 있는지 확인한다(필요한 경우 생성). 
이 릴리스에 대한 PR 및 이슈가 이 마일스톤에 있는지 확인하자.

주 또는 부 릴리스의 경우 2 단계로 이동한다. 
[주 또는 부 릴리스: 
git에서 버전 번호 변경](#2-git에서-주-또는-부-버전-번호-변경)

### 패치 릴리스

패치 릴리스는 기존 릴리스에 대한 몇 가지 중요한 수정 사항이다. 
`release-X.Y` 브랜치를 생성하여 시작한다.

```shell
git fetch upstream
git checkout -b $RELEASE_BRANCH_NAME upstream/$RELEASE_BRANCH_NAME
```

여기에서 패치 릴리스로 가져올 커밋을 
선택할 수 있다.

```shell
# 체리-픽(cherry-pick)하려는 커밋 ID 목록 조회
git log --oneline
# 병합 커밋을 포함하지 않고 가장 오래된 커밋부터 골라서 선택
git cherry-pick -x <commit-id>
```

커밋이 체리픽되면 릴리스 브랜치를 푸시해야 한다.

```shell
git push upstream $RELEASE_BRANCH_NAME
```

분기를 푸시하면 테스트가 실행되며, 태그를 만들기 전에 통과해야 한다. 
이 새로운 태그는 패치 릴리스의 기반이 된다.

패치 릴리스의 경우 
[헬름/헬름 마일스톤] (https://github.com/helm/helm/milestones) 
생성은 선택사항이다.

계속 진행하기 전에 릴리스가 CI를 통과했는지 [CircleCI 에서의 헬름](https://circleci.com/gh/helm/helm)를 
확인하자. 패치 릴리스는 2-5 단계를 건너 뛰고 6 단계로 진행하여 
[릴리스 확정](#6-릴리스-확정)를 수행할 수 있다.

## 2. git에서 주 또는 부 버전 번호 변경

주 또는 부 릴리스를 수행할 때 `internal/version/version.go` 를 
새 릴리스 버전으로 업데이트해야 한다.

```shell
$ git diff internal/version/version.go
diff --git a/internal/version/version.go b/internal/version/version.go
index 712aae64..c1ed191e 100644
--- a/internal/version/version.go
+++ b/internal/version/version.go
@@ -30,7 +30,7 @@ var (
        // Increment major number for new feature additions and behavioral changes.
        // Increment minor number for bug fixes and performance enhancements.
        // Increment patch number for critical fixes to existing releases.
-       version = "v3.3"
+       version = "v3.4"

        // metadata is extra build time data
        metadata = ""
```

`version.go` 파일에서 버전을 업데이트하는 것 외에도 
해당 버전 번호를 사용하는 해당 테스트도 업데이트해야 한다.

* `cmd/helm/testdata/output/version.txt`
* `cmd/helm/testdata/output/version-client.txt`
* `cmd/helm/testdata/output/version-client-shorthand.txt`
* `cmd/helm/testdata/output/version-short.txt`
* `cmd/helm/testdata/output/version-template.txt`
* `pkg/chartutil/capabilities_test.go`

```shell
git add .
git commit -m "bump version to $RELEASE_NAME"
```

이는 $RELEASE_BRANCH_NAME에 대해서만 업데이트된다. 
[3.2에서 3.3으로의 
이 예제](https://github.com/helm/helm/pull/8411/files)에서와 
같이 다음 릴리스가 생성될 때 이 변경 사항을 마스터 브랜치로 
가져와야 하며, 다음 릴리스의 마일스톤에 추가해야 한다.

```shell
# 버전을 올리기 위해 마지막 커밋을 획득
git log --format="%H" -n 1

# 마스터에서 새 브랜치를 생성
git checkout main
git checkout -b bump-version-<release_version>

# 첫 번째 명령으로부터 ID를 사용하여 커밋을 체리픽
git cherry-pick -x <commit-id>

# 변경 사항 커밋
git push origin bump-version-<release-version>
```

## 3. 주/부 릴리스: 릴리스 브랜치 커밋 및 푸시

다른 사람들이 테스트를 시작하기 위해 이제 릴리스 브랜치를 업스트림으로 푸시하고 
테스트 프로세스를 시작할 수 있다.

```shell
git push upstream $RELEASE_BRANCH_NAME
```

계속 진행하기 전에 릴리스가 CI를 통과했는지 
[CircleCI 에서의 헬름] (https://circleci.com/gh/helm/helm)을 확인하자.

사용 가능한 사람이 있는 경우 모든 적절한 변경 사항이 적용되고 
릴리스에 대한 모든 커밋이 있는지 계속 확인하기 전에 
다른 사용자와 브랜치에 대해 동료-평가를 진행하자.

## 4. 주/부 릴리스: 릴리스 후보 생성

이제 릴리스 브랜치가 나왔고 준비되었으므로 
릴리스 후보를 만들고 반복할 차례이다.

```shell
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

CircleCI는 테스트할 태그된 릴리스 이미지와 클라이언트 바이너리를 
자동으로 생성한다.

테스터의 경우 CircleCI가 아티팩트 빌드를 완료한 후 
테스트를 시작하는 프로세스에는 다음과 같이 클라이언트를 받는 단계가 포함된다.

리눅스/amd64 의 경우, /bin/bash 를 사용한다

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-linux-amd64.tar.gz
```

darwin/amd64 의 경우, Terminal.app 을 사용한다.

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-darwin-amd64.tar.gz
```

윈도우/amd64, 파워셸(PowerShell)을 사용한다.

```shell
PS C:\> Invoke-WebRequest -Uri "https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-windows-amd64.tar.gz" -OutFile "helm-$ReleaseCandidateName-windows-amd64.tar.gz"
```

그런 다음 바이너리의 압축을 풀고 $PATH의 특정 장소로 이동하거나 
특정 장소로 이동하여 $PATH에 추가한다 
(예 : linux/macOS의 경우 /usr/local/bin/helm,  Windows의 경우 C:\Program Files\helm\helm.exe).

## 5. 주/부 릴리스: 연속 릴리스 후보 개선

릴리스와 관련된 모든 결과를 문서화하여 가능한 
모든 방법으로 헬름 테스트를 시도하고 중단하기 위해 
명시적으로 시간과 리소스를 투자하는 데 여러 시간을 보내게 된다. 
이 시간은 릴리스가 다양한 기능 또는 업그레이드 환경에, 
코딩이 아닌 문제를 유발할 수있는 방법을 테스트하고 찾는데 소비되어야 한다. 
이 기간 동안 릴리스는 코드 동결 상태이며 추가 코드 변경 사항은 다음 릴리스로 푸시된다.

이 단계에서 $RELEASE_BRANCH_NAME 브랜치는 
새로운 출시 후보를 생성함에 따라 계속 발전하게 된다. 
새로운 후보의 빈도는 릴리스 관리자에게 달려 있다.
보고된 문제의 심각도, 테스터의 가용성 및 릴리스 기한을 고려하여 
최선의 판단을 내리자. 일반적인 경우, 손상된 릴리스를 전달하는 것보다는 
릴리스가 마감일을 넘기는게 차라리 더 좋다.

새 릴리스 후보를 생성 할 때마다 마스터 브랜치에서 체리픽 하여 
브랜치에 커밋을 추가하는 것으로 시작한다.

```shell
git cherry-pick -x <commit_id>
```

또한 분기를 GitHub으로 푸시하고 CI를 통과하는지도 확인해야 한다.

그럼 다음 태그를 지정하고 사용자들에게 새 릴리스 후보에 대해 알린다.

```shell
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.2"
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

GitHub에 푸시되면 이 태그가 있는 브랜치가 CI에 빌드 되는지 확인한다.

여기서부터는 이 프로세스를 반복하고 릴리스 후보에 만족할 때까지 지속적으로 테스트한다. 
릴리스 후보의 경우 전체 노트를 작성하지는 않지만 일부 
[릴리스 노트](#7-릴리스-노트-작성)를 미리 작성(scaffold)할 수 있다.

## 6. 릴리스 확정

최종적으로 릴리스 후보의 품질에 만족한다면 계속 진행하여 진짜를 
만들 수 있다. 마지막으로 한 번 더 확인하여 모든 것이 
정상인지 확인한 다음, 마지막으로 릴리스 태그를 푸시한다.

```shell
git checkout $RELEASE_BRANCH_NAME
git tag --sign --annotate "${RELEASE_NAME}" --message "Helm release ${RELEASE_NAME}"
git push upstream $RELEASE_NAME
```

릴리스가 [CircleCI](https://circleci.com/gh/helm/helm)에서 
성공했는지 확인하자. 그렇지 않은 경우 릴리스를 수정하고 
릴리스를 다시 푸시해야 한다.

CI 작업을 실행하는 데 약간의 시간이 걸리므로 완료될 때까지 
기다리는 동안 릴리스 정보 작성 단계로 넘어갈 수 있다.

## 7. 릴리스 노트 작성

릴리스 주기 동안 발생한 커밋을 기반으로 변경 로그를 자동 생성하지만 
일반적으로 수동으로, 인간 생명체든/마케팅 팀이든/심지어 고양이라도 릴리스 노트는 손으로 작성한 경우가 
최종 사용자에게 더 유용하다.

주/부 릴리스를 릴리스하는 경우 일반적으로 주목할만한 
사용자용 기능을 나열하는 것으로 충분하다. 패치 릴리스의 경우 
동일하게 하되 증상이나 영향을 받을 수 있는 사용자에 대해 기재하자.

릴리스 정보에는 다음 릴리스의 버전과 계획된 날짜가 포함되어야 한다.

부 릴리스에 대한 예제 릴리스 노트는 다음과 같다.

```markdown
## vX.Y.Z

Helm vX.Y.Z는 기능 릴리스이다. 이번 릴리스에서는 <insert focal point>에 중점을 두었다. 사용자는 최상의 환경을 위해 업그레이드하는 것이 좋다.

커뮤니티는 계속 성장하고 있으며, 함께하면 좋겠다!

- [Kubernetes Slack] (https://kubernetes.slack.com)에서 토론에 참여해보자.
  - 질문을 하려면 `#helm-users`
  - PR, 코드, 버그를 논의하려면 `#helm-dev`
- 공개 개발자 전화 : 목요일 오전 9시 30 분 [Zoom]을 통해 행 아웃 (https://zoom.us/j/696660622)
- 차트 테스트, 디버그, 기여 : [GitHub/헬름/차트] (https://github.com/helm/charts)

## 주목할 만한 변화

- Kubernetes 1.16은 이제 새 매니페스트 apiVersion도 지원한다.
- Spring은 2.22으로 업그레이드되었다.

## 설치 및 업그레이드

헬름 X.Y 를 다운로드한다. 일반적인 플랫폼 바이너리는 다음과 같다.

- [MacOS amd64](https://get.helm.sh/helm-vX.Y.Z-darwin-amd64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-darwin-amd64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [리눅스 amd64](https://get.helm.sh/helm-vX.Y.Z-linux-amd64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-amd64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [리눅스 arm](https://get.helm.sh/helm-vX.Y.Z-linux-arm.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-arm.tar.gz.sha256) / CHECKSUM_VAL)
- [리눅스 arm64](https://get.helm.sh/helm-vX.Y.Z-linux-arm64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-arm64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [리눅스 i386](https://get.helm.sh/helm-vX.Y.Z-linux-386.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-386.tar.gz.sha256) / CHECKSUM_VAL)
- [리눅스 ppc64le](https://get.helm.sh/helm-vX.Y.Z-linux-ppc64le.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-ppc64le.tar.gz.sha256sum) / CHECKSUM_VAL)
- [리눅스 s390x](https://get.helm.sh/helm-vX.Y.Z-linux-s390x.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-s390x.tar.gz.sha256sum) / CHECKSUM_VAL)
- [윈도우 amd64](https://get.helm.sh/helm-vX.Y.Z-windows-amd64.zip) ([checksum](https://get.helm.sh/helm-vX.Y.Z-windows-amd64.zip.sha256sum) / CHECKSUM_VAL)

[빠른 시작 가이드](https://docs.helm.sh/using_helm/#quickstart-guide)를 참조하세요. **업그레이드 안내** 또는 자세한 설치 정보는 [설치 가이드](https://docs.helm.sh/using_helm/#installing-helm)를 확인하세요. `bash` 가 있는 모든 시스템에서 [설치할 스크립트] (https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3)를 사용할 수도 있다.

## 향후 계획

- vX.Y.Z + 1 에는 버그 수정만 포함되며 <날짜 삽입>에 릴리스 예정이다.
- vX.Y + 1.0 은 다음 기능 릴리스이며 <날짜 삽입>에 릴리스 예정이다. 이 릴리스는 ...

## 변경로그

- chore(*) v2.7.0 로 버전 업(bump) 08c1144f5eb3e3b636d9775617287cc26e53dba4 (Adam Reese) 
- 태그를 작성하지 않는 버그 수정 f4f932fabd197f7e6d608c8672b33a483b4b76fa (Matthew Fisher)
```

변경 로그를 포함하여 부분적으로 완료된 릴리스 정보 
집합은 다음 명령을 실행하여 작성할 수 있다.

```shell
export VERSION="$RELEASE_NAME"
export PREVIOUS_RELEASE=vX.Y.Z
make clean
make fetch-dist
make release-notes
```

이렇게하면 **주요 변경 사항** 및 **다음 단계** 섹션을 
작성하기만 하면 되는 훌륭한 기본 출시 노트 세트가 생성된다.

릴리스 노트에 의견을 자유롭게 추가하도록 하자. 
사람들이 볼 때, 우리가 로봇이라는 생각이 들지 않도록 하는 것이 좋다.

또한 자동 생성된 릴리스 노트에서 URL과 
체크섬이 올바른지 다시 확인해야 한다.

완료되면 GitHub에서 [헬름/헬름 릴리스](https://github.com/helm/helm/releases)로 
이동하고 여기에 작성된 메모로 태그가 지정된 
릴리스의 릴리스 노트를 편집한다. 대상 분기의 경우 
$RELEASE_BRANCH_NAME로 설정한다.

이제는 릴리스가 게시되기 전에 다른 사람들에게 릴리스 정보를 보여주어
검토 받을 필요가 있다. 검토를 받기 위해
[#helm-dev](https://kubernetes.slack.com/messages/C51E88VDG)로 
요청을 보내자. 누구든 놓치는 부분이 있을 수 있기 때문에 항상 도움이 된다.

## 8. 다운로드에 PGP 서명

해시는 다운로드 내용이 어떤 것으로 생성되었는지에 대한 서명을 
제공하지만, 서명된 패키지는 그 패키지가 어디서 왔는지 출처를
추적할 수 있게 해준다.

이렇게 하기 위하여 다음의 `make` 명령을 실행한다.

```shell
export VERSION="$RELEASE_NAME"
make clean		# if not already run
make fetch-dist	# if not already run
make sign
```

이렇게 하면 CI가 푸시한 개별 파일에 대하여, ASCII 아머드 서명 파일을
생성한다.

모든 서명 파일(`*.asc`)을 GitHub의 릴리스에 업로드해야
한다. (바이너리 첨부)

## 9. 릴리스 출간

이제 출시를 공식화할 차례이다!

릴리스 노트가 GitHub에 저장되고 CI 빌드가 완료되고 
릴리스에 서명 파일을 추가한 후 릴리스에서 "게시"를 누를 수 있다. 
그러면 릴리스가 게시되고 "최신(latest)"으로 나열되며 
[helm/helm] (https://github.com/helm/helm) 저장소의 첫 페이지에 이 릴리스가 표시된다.

## 10. 문서 업데이트

[헬름 웹 사이트 문서 섹션](https://helm.sh/docs)에는 
문서의 헬름 버전이 나열된다. 사이트에서 주, 부, 패치 버전을 
업데이트해야 한다. 다음 부 릴리스 날짜도 사이트에 
게시되며 업데이트해야 한다.
이를 위해 [helm-www 저장소] (https://github.com/helm/helm-www)에 
대한 pull 요청을 생성한다. 
`config.toml` 파일에서 
적절한 `params.versions` 섹션을 찾고 [현재 버전 업데이트](https://github.com/helm/helm-www/pull/676/files)의 
예와 같이 헬름 버전을 업데이트한다. 동일한`config.toml` 파일에서
`params.nextversion` 섹션을 업데이트한다. 

해당되는 경우 릴리스의 [helm/helm 마일스톤](https://github.com/helm/helm/milestones)을 
닫는다.

주/부 릴리스의 
[버전 차이] (https://github.com/helm/helm-www/blob/main/content/en/docs/topics/version_skew.md)를 
업데이트한다.

[여기](https://helm.sh/calendar/release)에서 릴리스 달력을 업데이트한다.
* 당일 오후 5시 GMT에 대한 알림과 함께 다음 마이너 릴리스에 대한 항목을 생성한다.
* 계획된 릴리스 전의 월요일에 다음 마이너 릴리스의 RC1 항목을 만들고 그날 오후 5시 GMT에 대한 알림을 생성한다.

## 11. 커뮤니티에 알리기

축하한다! 모두 완료했다. $DRINK_OF_CHOICE 를 한모금 하자.
당신은 그럴만한 일을 했다.

좋은 $DRINK_OF_CHOICE 를 즐긴 후, Slack과 Twitter에
[GitHub 릴리스] (https://github.com/helm/helm/releases) 링크를 통해 
새 릴리스를 발표하자.

선택적으로, 새 릴리스에 대한 블로그 게시물을 작성하고 그 곳에 몇 가지 새로운 기능을
보여주도록 하자!
