---
title: "헬름"
---

## 헬름

쿠버네티스를 위한 헬름 패키지 매니저

### 개요

쿠버네티스 패키지 매니저

일반적으로 사용되는 헬름 작업:

- helm search:    차트를 검색
- helm pull:      확인하려는 로컬 디렉토리에 차트를 다운로드
- helm install:   쿠버네티스에 차트 업로드
- helm list:      차트 릴리스 리스트 표시

환경 변수:

| 이름                               | 설명                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------|
| $XDG_CACHE_HOME                    | 캐시된 파일을 저장할 대체 위치를 지정.                                                          |
| $XDG_CONFIG_HOME                   | 헬름 설정을 저장할 대체 위치 지정.                                                          |
| $XDG_DATA_HOME                     | 헬름 데이터를 저장할 대체 위치를 지정.                                                        |
| $HELM_DRIVER                       | 백엔드 스토리지 드라이버 설정. 값 : configmap, secret, memory, postgres                       |
| $HELM_DRIVER_SQL_CONNECTION_STRING | SQL 스토리지 드라이버가 사용해야 하는 연결 문자열 지정.                                              |
| $HELM_NO_PLUGINS                   | 플러그인 비활성화. 비활성화 하기 위해 HELM_NO_PLUGINS=1 로 지정.                                  |
| $KUBECONFIG                        | 대체 쿠버네티스 설정 파일 지정 (기본값 "~/.kube/config")                                              |

헬름 은 기본 디렉토리 사양을 기반으로 설정을 저장하므로,

- 캐시된 파일은 $XDG_CACHE_HOME/helm 에 저장
- 설정은 $XDG_CONFIG_HOME/helm 에 저장
- 데이터는 $XDG_DATA_HOME/helm 에 저장

기본적으로 기본 디렉토리는 운영체제에 따라 다르며, 기본 값은 아래와 같다.

| 운영체제             | 캐시 파일 경로                 | 설정 파일 경로                      | 데이터 저장 경로              |
|------------------|---------------------------|--------------------------------|-------------------------|
| Linux            | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm |
| macOS            | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm      |
| Windows          | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm          |


### 옵션 

```
      --add-dir-header                   이 값이 참이면, 헤더에 파일 디렉토리를 추가
      --alsologtostderr                  표준 오류를 로그 및 파일로 표시
      --debug                            상세 내용 표시 활성화
  -h, --help                             헬름에 대한 도움말
      --kube-apiserver string            쿠버네티스 API 서버의 주소 및 포트
      --kube-context string              사용할 kubeconfig 컨텍스트 이름
      --kube-token string                인증에 사용될 문자열 전달 토큰
      --kubeconfig string                kubeconfig 파일 경로
      --log-backtrace-at traceLocation   로깅 시 N 행에 걸친 스택 추적 내용을 표시 (기본값 :0)
      --log-dir string                   이 값이 비어있지 않을 경우, 이 값에 지정된 디렉토리에 로그 파일 쓰기 수행
      --log-file string                  이 값이 비어있지 않을 경우, 이 값에 지정된 파일명으로 로그 파일 쓰기 수행
      --log-file-max-size uint           로그파일이 증가할 수 있는 최대 크기 지정. 단위는 메가 바이트이며 값이 0일 경우 최대 파일크기 제한 없음(기본 값 1800)
      --logtostderr                      로그를 파일이 아닌 표준 출력으로 표시 (기본값 : true)
  -n, --namespace string                 요청에 대한 네임스페이스 지정
      --registry-config string           레지스트리 구성 파일에 대한 경로 (기본값 "~/.config/helm/registry.json")
      --repository-cache string          캐시된 저장소 색인이 포함된 파일의 경로 (기본값 "~/snap/code/common/.cache/helm/repository")
      --repository-config string         저장소 이름 및 URL 을 포함하는 파일 경로 (기본값 "~/.config/helm/repositories.yaml")
      --skip-headers                     이 값이 참이면, 로그파일에서 헤더 접두사를 미사용
      --skip-log-headers                 이 값이 참이면, 로그 파일을 열 때 헤더 제외
      --stderrthreshold severity         stderr로 로그가 변경될 수 있는 최저 임계점 (기본값 2)
  -v, --v Level                          로그 수준 상세표시 레벨
      --vmodule moduleSpec               파일로 필터링 된 로깅을 위한 패턴=N 설정의 쉼표로 구분된 리스트
```

### 참조

* [helm completion](/docs/helm/helm_completion)	 - 지정된 셸(bash 또는 zsh)에 대한 자동 완성 스크립트 생성
* [helm create](/docs/helm/helm_create)	 - 주어진 이름으로 새 차트 생성
* [helm dependency](/docs/helm/helm_dependency)	 - 차트의 종속성 관리
* [helm env](/docs/helm/helm_env)	 - 헬름 클라이언트 환경 정보
* [helm get](/docs/helm/helm_get)	 - 명명된 릴리스의 확장 정보 다운로드
* [helm history](/docs/helm/helm_history)	 - 릴리스 기록 가져오기
* [helm install](/docs/helm/helm_install)	 - 차트 설치
* [helm lint](/docs/helm/helm_lint)	 - 차트에서 발생 가능한 이슈 검사
* [helm list](/docs/helm/helm_list)	 - 릴리스 목록
* [helm package](/docs/helm/helm_package)	 - 차트 디렉토리를 차트 아카이브로 패키징
* [helm plugin](/docs/helm/helm_plugin)	 - Helm 플러그인 설치, 조회, 제거
* [helm pull](/docs/helm/helm_pull)	 - 저장소에서 차트를 다운로드하고 (선택적으로) 로컬디렉터리에 압축 해제
* [helm repo](/docs/helm/helm_repo)	 - 차트 저장소의 추가, 조회, 제거, 업데이트 및 색인 생성
* [helm rollback](/docs/helm/helm_rollback)	 - 릴리스를 이전 버전으로 롤백
* [helm search](/docs/helm/helm_search)	 - 차트에서 키워드 검색
* [helm show](/docs/helm/helm_show)	 - 차트 정보 표시
* [helm status](/docs/helm/helm_status)	 - 명명된 릴리스의 상태 표시
* [helm template](/docs/helm/helm_template)	 - 로컬에서 템플릿 렌더링
* [helm test](/docs/helm/helm_test)	 - 릴리스 테스트 수행
* [helm uninstall](/docs/helm/helm_uninstall)	 - 릴리스 제거
* [helm upgrade](/docs/helm/helm_upgrade)	 - 릴리스 업그레이드
* [helm verify](/docs/helm/helm_verify)	 - 지정된 경로의 차트의 서명 여부 및 유효성 여부 검증
* [helm version](/docs/helm/helm_version)	 - 클라이언트 버전 정보 표시 

###### Auto generated by spf13/cobra on 11-May-2020
