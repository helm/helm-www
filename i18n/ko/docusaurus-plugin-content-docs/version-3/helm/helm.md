---
title: helm
slug: helm
---

쿠버네티스를 위한 Helm 패키지 매니저

### 개요

쿠버네티스 패키지 매니저

일반적으로 사용되는 Helm 작업:

- helm search:    차트를 검색
- helm pull:      차트를 로컬 디렉토리에 다운로드하여 확인
- helm install:   쿠버네티스에 차트 업로드
- helm list:      차트 릴리스 목록 표시

환경 변수:

| Name                               | Description                                                                                                |
|------------------------------------|------------------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | 캐시된 파일을 저장할 대체 위치를 지정                                                                      |
| $HELM_CONFIG_HOME                  | Helm 설정을 저장할 대체 위치를 지정                                                                        |
| $HELM_DATA_HOME                    | Helm 데이터를 저장할 대체 위치를 지정                                                                      |
| $HELM_DEBUG                        | Helm이 디버그 모드에서 실행 중인지 여부 표시                                                               |
| $HELM_DRIVER                       | 백엔드 스토리지 드라이버 설정. 값: configmap, secret, memory, sql                                          |
| $HELM_DRIVER_SQL_CONNECTION_STRING | SQL 스토리지 드라이버가 사용해야 하는 연결 문자열 지정                                                     |
| $HELM_MAX_HISTORY                  | Helm 릴리스 내역의 최대 수 설정                                                                            |
| $HELM_NAMESPACE                    | Helm 작업에 사용되는 네임스페이스 지정                                                                     |
| $HELM_NO_PLUGINS                   | 플러그인 비활성화. 비활성화하려면 HELM_NO_PLUGINS=1로 지정                                                 |
| $HELM_PLUGINS                      | 플러그인 디렉토리에 대한 경로 설정                                                                         |
| $HELM_REGISTRY_CONFIG              | 레지스트리 구성 파일의 경로를 설정                                                                         |
| $HELM_REPOSITORY_CACHE             | 리포지토리 캐시 디렉토리에 대한 경로 설정                                                                  |
| $HELM_REPOSITORY_CONFIG            | 리포지토리 파일의 경로 설정                                                                                |
| $KUBECONFIG                        | 대체 Kubernetes 설정 파일 지정 (기본값 "~/.kube/config")                                                   |
| $HELM_KUBEAPISERVER                | 인증을 위한 Kubernetes API 서버의 엔드포인트 설정                                                          |
| $HELM_KUBECAFILE                   | Kubernetes 인증 기관 파일 설정                                                                             |
| $HELM_KUBEASGROUPS                 | 쉼표로 구분된 목록을 사용하여, 작업에 가장(impersonation)할 그룹 지정                                      |
| $HELM_KUBEASUSER                   | 작업에 가장(impersonation)할 사용자 이름 설정                                                              |
| $HELM_KUBECONTEXT                  | kubeconfig 컨텍스트의 이름 설정                                                                            |
| $HELM_KUBETOKEN                    | 인증에 사용되는 Bearer KubeToken 설정                                                                      |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | Kubernetes API 서버의 인증서 유효성 검사를 건너뛸지 여부 표시 (안전하지 않음)                              |
| $HELM_KUBETLS_SERVER_NAME          | Kubernetes API 서버 인증서를 검증하는 데 사용할 서버 이름 설정                                             |
| $HELM_BURST_LIMIT                  | 서버에 CRD가 많은 경우의 기본 버스트 제한 설정 (기본값 100, 비활성화하려면 -1)                             |
| $HELM_QPS                          | 높은 버스트 값 옵션을 초과하는 호출이 많은 경우의 초당 쿼리 수(QPS) 설정                                   |

Helm은 다음 설정 순서를 기반으로 캐시, 설정 정보, 데이터를 저장한다:

- HELM_*_HOME 환경변수가 설정된 경우 이 변수를 사용함
- 그렇지 않으면, XDG 기반 디렉토리 사양을 지원하는 시스템에서 XDG 변수를 사용함
- 다른 위치를 설정하지 않은 경우 운영 체제의 기본 위치를 사용함

기본적으로 기본 디렉토리는 운영체제에 따라 다르며, 기본값은 아래와 같다:

| 운영체제 | 캐시 경로                   | 설정 경로                          | 데이터 경로               |
|----------|---------------------------|----------------------------------|-------------------------|
| Linux    | $HOME/.cache/helm         | $HOME/.config/helm               | $HOME/.local/share/helm |
| macOS    | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm   | $HOME/Library/helm      |
| Windows  | %TEMP%\helm               | %APPDATA%\helm                   | %APPDATA%\helm          |


### 옵션

```
      --burst-limit int                 클라이언트 측 기본 스로틀링 제한 (기본값 100)
      --debug                           상세한(verbose) 출력 활성화
  -h, --help                            helm 명령어에 대한 도움말
      --kube-apiserver string           Kubernetes API 서버의 주소 및 포트
      --kube-as-group stringArray       작업에 가장할 그룹. 이 플래그를 여러 번 사용하여 여러 그룹 지정 가능
      --kube-as-user string             작업에 가장할 사용자명
      --kube-ca-file string             Kubernetes API 서버 연결에 사용할 인증 기관 파일
      --kube-context string             사용할 kubeconfig 컨텍스트 이름
      --kube-insecure-skip-tls-verify   true인 경우, Kubernetes API 서버의 인증서 유효성을 검사하지 않음. 이 옵션을 사용하면 HTTPS 연결이 안전하지 않게 됨
      --kube-tls-server-name string     Kubernetes API 서버 인증서 검증에 사용할 서버 이름. 제공되지 않으면 서버에 연결하는 데 사용된 호스트 이름이 사용됨
      --kube-token string               인증에 사용될 Bearer 토큰
      --kubeconfig string               kubeconfig 파일 경로
  -n, --namespace string                이 요청에 대한 네임스페이스 범위
      --qps float32                     Kubernetes API와 통신 시 사용할 초당 쿼리 수(버스트 제외)
      --registry-config string          레지스트리 구성 파일에 대한 경로 (기본값 "~/.config/helm/registry/config.json")
      --repository-cache string         캐시된 리포지토리 인덱스가 포함된 디렉토리 경로 (기본값 "~/.cache/helm/repository")
      --repository-config string        리포지토리 이름 및 URL을 포함하는 파일 경로 (기본값 "~/.config/helm/repositories.yaml")
```

### 참조

* [helm completion](/helm/helm_completion.md)	 - 지정된 셸에 대한 자동 완성 스크립트 생성
* [helm create](/helm/helm_create.md)	 - 주어진 이름으로 새 차트 생성
* [helm dependency](/helm/helm_dependency.md)	 - 차트의 종속성 관리
* [helm env](/helm/helm_env.md)	 - Helm 클라이언트 환경 정보
* [helm get](/helm/helm_get.md)	 - 명명된 릴리스의 확장 정보 다운로드
* [helm history](/helm/helm_history.md)	 - 릴리스 기록 가져오기
* [helm install](/helm/helm_install.md)	 - 차트 설치
* [helm lint](/helm/helm_lint.md)	 - 차트에서 발생 가능한 이슈 검사
* [helm list](/helm/helm_list.md)	 - 릴리스 목록
* [helm package](/helm/helm_package.md)	 - 차트 디렉토리를 차트 아카이브로 패키징
* [helm plugin](/helm/helm_plugin.md)	 - Helm 플러그인 설치, 조회, 제거
* [helm pull](/helm/helm_pull.md)	 - 리포지토리에서 차트를 다운로드하고 (선택적으로) 로컬 디렉토리에 압축 해제
* [helm push](/helm/helm_push.md)	 - 차트를 원격에 푸시
* [helm registry](/helm/helm_registry.md)	 - 레지스트리에 로그인 또는 로그아웃
* [helm repo](/helm/helm_repo.md)	 - 차트 리포지토리의 추가, 조회, 제거, 업데이트 및 인덱스 생성
* [helm rollback](/helm/helm_rollback.md)	 - 릴리스를 이전 리비전으로 롤백
* [helm search](/helm/helm_search.md)	 - 차트에서 키워드 검색
* [helm show](/helm/helm_show.md)	 - 차트 정보 표시
* [helm status](/helm/helm_status.md)	 - 명명된 릴리스의 상태 표시
* [helm template](/helm/helm_template.md)	 - 로컬에서 템플릿 렌더링
* [helm test](/helm/helm_test.md)	 - 릴리스 테스트 수행
* [helm uninstall](/helm/helm_uninstall.md)	 - 릴리스 제거
* [helm upgrade](/helm/helm_upgrade.md)	 - 릴리스 업그레이드
* [helm verify](/helm/helm_verify.md)	 - 지정된 경로의 차트가 서명되었고 유효한지 검증
* [helm version](/helm/helm_version.md)	 - 클라이언트 버전 정보 표시

###### Auto generated by spf13/cobra on 14-Jan-2026
