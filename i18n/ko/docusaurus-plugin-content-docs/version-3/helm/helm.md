---
title: helm
slug: helm
---
쿠버네티스를 위한 헬름 패키지 매니저

### 개요

쿠버네티스 패키지 매니저

일반적으로 사용되는 헬름 작업:

- helm search:    차트를 검색
- helm pull:      확인하려는 로컬 디렉토리에 차트를 다운로드
- helm install:   쿠버네티스에 차트 업로드
- helm list:      차트 릴리스 리스트 표시

환경 변수:

| Name                               | Description                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | 캐시된 파일을 저장할 대체 위치를 지정                                                          |
| $HELM_CONFIG_HOME                  | 헬름 설정을 저장할 대체 위치를 지정                                                           |
| $HELM_DATA_HOME                    | 헬름 데이터를 저장할 대체 위치를 지정                                                          |
| $HELM_DEBUG                        | 헬름이 디버그 모드에서 실행 중인지 여부 표시                                                    |
| $HELM_DRIVER                       | 백엔드 스토리지 드라이버 설정. 값 : configmap, secret, memory, postgres                      |
| $HELM_DRIVER_SQL_CONNECTION_STRING | SQL 스토리지 드라이버가 사용해야 하는 연결 문자열 지정                                             |
| $HELM_MAX_HISTORY                  | 헬름 릴리스 내역의 최대 수 설정                                                             |
| $HELM_NAMESPACE                    | 헬름 작업에 사용되는 네임스페이스 지정                                                         |
| $HELM_NO_PLUGINS                   | 플러그인 비활성화. 비활성화 하기 위해 HELM_NO_PLUGINS=1 로 지정.                                 |
| $HELM_PLUGINS                      | 플러그인 디렉토리에 대한 경로 설정                                                            |
| $HELM_REGISTRY_CONFIG              | 레지스트리 구성 파일의 경로를 설정                                                            |
| $HELM_REPOSITORY_CACHE             | 저장소 캐시 디렉토리에 대한 경로 설정                                                          |
| $HELM_REPOSITORY_CONFIG            | 레포지토리 파일의 경로 설정                                                                 |
| $KUBECONFIG                        | 대체 쿠버네티스 설정 파일 지정 (기본값 "~/.kube/config")                                       |
| $HELM_KUBEAPISERVER                | 인증을 위한 쿠버네티스 API 서버의 엔트포인트 설정                                                 |
| $HELM_KUBEASGROUPS                 | 작업을 가장(impersonation)할 사용자 이름 설정                                               |
| $HELM_KUBEASUSER                   | 쉼표로 구분된 목록을 사용하여, 작업을 가장할 그룹 지정                                              |
| $HELM_KUBECONTEXT                  | kubeconfig 컨텍스트의 이름 설정                                                          |
| $HELM_KUBETOKEN                    | 인증에 사용되는 베어러(Bearer) KubeToken 설정                                              |

헬름은 다음 설정 순서를 기반으로 캐시, 설정 정보, 데이터를 저장한다:

- HOME_*_HOME 환경변수가 설정된 경우 이 변수를 사용함
- 그렇지 않으면, XDG 기반 디렉토리 사양을 지원하는 시스템에서 XDG 변수를 사용함
- 다른 위치를 설정하지 않은 경우 운영 체제의 기본 위치를 사용함

기본적으로 기본 디렉토리는 운영체제에 따라 다르며, 기본 값은 아래와 같다.

| 운영체제             | 캐시 파일 경로                 | 설정 파일 경로                      | 데이터 저장 경로              |
|------------------|---------------------------|--------------------------------|-------------------------|
| Linux            | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm |
| macOS            | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm      |
| Windows          | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm          |


### 옵션 

```
      --debug                       장황한(verbose) 출력 활성화
  -h, --help                        helm 명령어에 대한 도움말
      --kube-apiserver string       쿠버네티스 API 서버의 주소 및 포트
      --kube-as-group stringArray   작업에 관해 제시할 그룹. 플래그를 여러 번 사용하여 여러 그룹 지정 가능
      --kube-as-user string         작업에 관해 제시할 사용자명
      --kube-context string         사용할 kubeconfig 컨텍스트 이름
      --kube-token string           인증에 사용될 베어러(bearer) 토큰
      --kubeconfig string           kubeconfig 파일 경로
  -n, --namespace string            이 요청에 대한 네임스페이스 스코프
      --registry-config string      레지스트리 구성 파일에 대한 경로 (기본값 "~/.config/helm/registry.json")
      --repository-cache string     캐시된 저장소 색인이 포함된 파일의 경로 (기본값 "~/.cache/helm/repository")
      --repository-config string    저장소 이름 및 URL 을 포함하는 파일 경로 (기본값 "~/.config/helm/repositories.yaml")
```

### 참조

* [helm completion](/helm/helm_completion.md)	 - 지정된 셸(bash 또는 zsh)에 대한 자동 완성 스크립트 생성
* [helm create](/helm/helm_create.md)	 - 주어진 이름으로 새 차트 생성
* [helm dependency](/helm/helm_dependency.md)	 - 차트의 종속성 관리
* [helm env](/helm/helm_env.md)	 - 헬름 클라이언트 환경 정보
* [helm get](/helm/helm_get.md)	 - 명명된 릴리스의 확장 정보 다운로드
* [helm history](/helm/helm_history.md)	 - 릴리스 기록 가져오기
* [helm install](/helm/helm_install.md)	 - 차트 설치
* [helm lint](/helm/helm_lint.md)	 - 차트에서 발생 가능한 이슈 검사
* [helm list](/helm/helm_list.md)	 - 릴리스 목록
* [helm package](/helm/helm_package.md)	 - 차트 디렉토리를 차트 아카이브로 패키징
* [helm plugin](/helm/helm_plugin.md)	 - Helm 플러그인 설치, 조회, 제거
* [helm pull](/helm/helm_pull.md)	 - 저장소에서 차트를 다운로드하고 (선택적으로) 로컬디렉터리에 압축 해제
* [helm repo](/helm/helm_repo.md)	 - 차트 저장소의 추가, 조회, 제거, 업데이트 및 색인 생성
* [helm rollback](/helm/helm_rollback.md)	 - 릴리스를 이전 버전으로 롤백
* [helm search](/helm/helm_search.md)	 - 차트에서 키워드 검색
* [helm show](/helm/helm_show.md)	 - 차트 정보 표시
* [helm status](/helm/helm_status.md)	 - 명명된 릴리스의 상태 표시
* [helm template](/helm/helm_template.md)	 - 로컬에서 템플릿 렌더링
* [helm test](/helm/helm_test.md)	 - 릴리스 테스트 수행
* [helm uninstall](/helm/helm_uninstall.md)	 - 릴리스 제거
* [helm upgrade](/helm/helm_upgrade.md)	 - 릴리스 업그레이드
* [helm verify](/helm/helm_verify.md)	 - 지정된 경로의 차트의 서명 여부 및 유효성 여부 검증
* [helm version](/helm/helm_version.md)	 - 클라이언트 버전 정보 표시 

###### Auto generated by spf13/cobra on 11-May-2020
