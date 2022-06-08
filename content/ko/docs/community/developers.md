---
title: "개발자 가이드"
description: "헬름을 개발하는 사용자의 환경을 구성하기 위한 지침"
weight: 1
---

이 가이드에서는 헬름을 개발하기 위해 환경을 설정하는 방법을 설명한다. 

## 전제 조건

- Go 최신버전
- kubectl 을 쓸 수 있는 쿠버네티스 클러스터 (선택사항)
- Git

## 헬름 빌드하기

프로그램을 빌드하기 위해 Make를 사용한다. 시작하는 가장 간단한 방법은 다음과 같다.

```console
$ make
```

유의사항: `$ GOPATH / src / helm.sh / helm` 경로에서 실행하지 않으면 실패하게 된다. 
`helm.sh` 디렉토리는 심볼릭 링크가 아니어야 한다. 
심볼릭 링크이면 `build`가 관련 패키지를 찾지 못한다.

필요한 경우 먼저 의존성을 설치하고 `vendor/` 트리를 
다시 빌드하고 구성을 확인한다. 그런 다음 `helm` 을 컴파일하여 
`bin/helm` 로 옮긴다.

(`vendor/` 에 대한 테스트는 실행하지 않고) 모든 테스트를 실행하려면  `make test` 를 실행한다.

헬름을 로컬에서 실행하려면 `bin/helm` 을 실행한다.

- 헬름은 맥OS 및 Alpine을 포함한 대부분의 리눅스 배포판에서 실행되는 것으로 알려져 있다.

## 기여 가이드라인

우리는 기여를 환영한다. 이 프로젝트는 (a) 코드 품질이 높게 유지되고, 
(b) 프로젝트가 일관되게 유지되고, (c) 기여가 오픈 소스 법적 요건을 
따르기 위해 몇 가지 지침을 설정했다. 우리의 의도는 기여자에게 
부담을 주는 것이 아니라 사용자가 혜택을 받을 수 있도록 우아하고 
고품질의 오픈 소스 코드를 만드는 것이다.

가장 중심이라 할 수 있는 기여(CONTRIBUTING) 가이드를 읽고 숙지하자.

https://github.com/helm/helm/blob/main/CONTRIBUTING.md

### 코드의 구조

Helm 프로젝트의 코드는 다음과 같이 구성된다.

- 개별 프로그램은 `cmd/`에 위치한다.
  `cmd/` 내부의 코드는 라이브러리 재사용을 위해 설계되지는 않았다.
- 공유 라이브러리는 `pkg/` 에 저장된다.
- `scripts/` 디렉토리에는 여러 유틸리티 스크립트가 들어 있다.
  대부분 CI/CD 파이프라인에서 사용한다.

Go 의존성 관리는 유동적이며 Helm의 수명주기 동안 
변경될 수 있다. 개발자는 의존성을 수동으로 관리하지 
_않기를_ 권장한다. 대신 프로젝트의 `Makefile` 에 
의존하여 이를 수행하는 것이 좋다. Helm 3에서는 
Go 버전 1.13 이상을 사용하는 것이 좋다.

### 문서 작성하기

Helm 3 이후의 문서는 자체 저장소로 이동되었다. 
새로운 기능을 작성할 때 함께 제공되는 문서를 작성하여 
[helm-www] (https://github.com/helm/helm-www) 레포지터리에 제출하자.

### Git 관례

버전 제어 시스템으로는 Git을 사용한다. `main` 브랜치는 현재 개발 
예정 브랜치의 홈 브랜치이다. 릴리스는 태그가 지정되며.

GitHub PR (Pull Requests)을 통한 코드 변경을 허용한다. 
이를 위한 작업 흐름은 다음과 같다.

1. `$GOPATH/src` 디렉토리로 이동한 후에, `mkdir helm.sh; cd helm.sh` 을 수행하고,
   `git clone` 으로 `github.com/helm/helm` 레포지터리를 복제한다.
2. 해당 레포지터리를 GitHub 계정으로 포크한다.
3. 레포지터리를 `$GOPATH/src/helm.sh/helm` 에 대한 원격 레포지터리로 추가한다.
4. 새로운 작업 브랜치를 만들고(`git checkout -b feat/my-feature`) 해당 브랜치에서
   작업을 수행한다.
5. 리뷰를 위한 준비가 되면 브랜치를 GitHub으로 푸시한 다음 
   새로운 풀 리퀘스트를 생성한다.

Git 커밋 메세지의 경우, 우리는 [유의적 커밋 메세지](https://karma-runner.github.io/0.13/dev/git-commit-msg.html)를 
따른다.

```
fix(helm): add --foo flag to 'helm install'

When 'helm install --foo bar' is run, this will print "foo" in the
output regardless of the outcome of the installation.

Closes #1234
```

일반적인 커밋 유형:

- fix: 버그 또는 오류 수정
- feat: 새로운 기능 추가
- docs: 문서 변경
- test: 테스트 개선
- ref: 기존 코드 리팩터링

일반적인 범위:

- helm: 헬름 CLI
- pkg/lint: 린트(lint) 패키지. 어떤 패키지든 유사한 관례에 따르자.
- `*`: 두 개 이상의 스코프

더 읽어보기:
- 이 섹션은 [Deis 
  가이드라인](https://github.com/deis/workflow/blob/master/src/contributing/submitting-a-pull-request.md)에서 영감을 받아 작성되었다.
- Karma Runner는 유의적 커밋 메세지에 대한 아이디어를 
  [정의](https://karma-runner.github.io/0.13/dev/git-commit-msg.html)
  한다.

### Go 관례

우리는 Go 코딩 스타일 표준을 매우 밀접하게 따른다. 일반적으로 `go fmt` 를 실행하여
사용자의 코드를 더욱 아름답게 만들수 있다.

또한 일반적으로 `go lint` 및 `gometalinter` 에서 권장하는 규칙을 따른다.
스타일 적합성을 테스트하려는 경우 `make test-style` 을 실행하자.

더 읽어보기:

- Effective Go [포맷
  소개](https://golang.org/doc/effective_go.html#formatting).
- Go 위키에서 볼 수 있는 훌륭한 
  [포맷](https://github.com/golang/go/wiki/CodeReviewComments) 글

`make test` 타겟을 실행하면 단위 테스트뿐만 아니라 스타일 테스트도 실행된다.
`make test` 대상이 스타일 상의 이유로 실패하면 PR 은 병합할 준비가
되지 않은 것으로 간주한다.
