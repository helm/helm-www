---
title: helm template
---

로컬에서 템플릿을 렌더링한다.

### 개요


차트 템플릿을 로컬에서 렌더링하고 그 결과를 표시한다.

일반적으로 클러스터 내에서 조회되거나 검색되는 모든 값은 로컬에서 모의 처리된다.
또한 차트 유효성에 대한 서버 측 테스트(예: API 지원 여부)는 수행되지 않는다.


```
helm template [NAME] [CHART] [flags]
```

### 옵션

```
  -a, --api-versions strings                       Capabilities.APIVersions에 사용되는 쿠버네티스 API 버전
      --atomic                                     설정된 경우, 설치 프로세스는 실패 시 설치본을 삭제한다. --atomic을 사용하면 --wait 플래그가 자동으로 설정된다
      --ca-file string                             이 CA 번들을 사용하여 HTTPS 사용 서버의 인증서를 확인
      --cert-file string                           이 SSL 인증서 파일을 사용하여 HTTPS 클라이언트 식별
      --create-namespace                           릴리스 네임스페이스가 없는 경우 생성
      --dependency-update                          차트를 설치하기 전에 누락된 종속성을 업데이트
      --description string                         사용자 정의 설명 추가
      --devel                                      개발 버전도 사용. 버전 '>0.0.0-0'에 해당하며, --version이 설정된 경우 무시된다
      --disable-openapi-validation                 설정된 경우, 설치 프로세스는 쿠버네티스 OpenAPI 스키마에 대해 렌더링된 템플릿의 유효성 검사를 수행하지 않는다
      --dry-run string[="client"]                  설치를 시뮬레이션한다. --dry-run을 옵션 없이 설정하거나 '--dry-run=client'로 설정하면 클러스터 연결을 시도하지 않는다. '--dry-run=server'를 설정하면 클러스터 연결을 시도할 수 있다.
      --enable-dns                                 템플릿 렌더링 시 DNS 조회 활성화
      --force                                      교체 전략을 통해 리소스 업데이트를 강제 수행
  -g, --generate-name                              이름을 생성한다 (NAME 매개변수 생략)
  -h, --help                                       template 명령어에 대한 도움말
      --hide-notes                                 설정된 경우, 설치 출력에 노트를 표시하지 않는다. 차트 메타데이터의 존재에는 영향을 미치지 않는다
      --include-crds                               템플릿 출력에 CRD 포함
      --insecure-skip-tls-verify                   차트 다운로드 시 TLS 인증서 검사 건너뛰기
      --is-upgrade                                 .Release.IsInstall 대신 .Release.IsUpgrade 설정
      --key-file string                            이 SSL 키 파일을 사용하여 HTTPS 클라이언트 식별
      --keyring string                             검증에 사용되는 공개 키 위치 (기본값 "~/.gnupg/pubring.gpg")
      --kube-version string                        Capabilities.KubeVersion에 사용되는 쿠버네티스 버전
  -l, --labels stringToString                      릴리스 메타데이터에 추가될 레이블. 쉼표로 구분한다. (기본값 [])
      --name-template string                       릴리스 이름 지정에 사용되는 템플릿 지정
      --no-hooks                                   설치 중 훅 실행 방지
      --output-dir string                          실행된 템플릿을 표준 출력 대신 지정된 출력 디렉터리의 파일에 작성
      --pass-credentials                           모든 도메인에 자격 증명 전달
      --password string                            요청된 차트를 찾을 차트 리포지토리의 비밀번호
      --plain-http                                 차트 다운로드에 안전하지 않은 HTTP 연결 사용
      --post-renderer postRendererString           포스트 렌더링에 사용될 실행 파일 경로. $PATH에 있으면 바이너리가 사용되고, 그렇지 않으면 주어진 경로에서 실행 파일을 찾는다
      --post-renderer-args postRendererArgsSlice   포스트 렌더러에 전달할 인수 (여러 개 지정 가능) (기본값 [])
      --release-name                               출력 디렉터리 경로에 릴리스 이름 사용
      --render-subchart-notes                      설정된 경우, 상위 차트와 함께 하위 차트 노트를 렌더링
      --replace                                    해당 이름이 기록에 남아있는 삭제된 릴리스인 경우에만 주어진 이름을 재사용. 운영 환경에서는 안전하지 않다
      --repo string                                요청된 차트를 찾을 차트 리포지토리 URL
      --set stringArray                            명령줄에서 값 설정 (쉼표로 여러 값 또는 개별 값 지정 가능: key1=val1,key2=val2)
      --set-file stringArray                       명령줄에서 지정한 파일에서 값 설정 (쉼표로 여러 값 또는 개별 값 지정 가능: key1=path1,key2=path2)
      --set-json stringArray                       명령줄에서 JSON 값 설정 (쉼표로 여러 값 또는 개별 값 지정 가능: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    명령줄에서 리터럴 STRING 값 설정
      --set-string stringArray                     명령줄에서 STRING 값 설정 (쉼표로 여러 값 또는 개별 값 지정 가능: key1=val1,key2=val2)
  -s, --show-only stringArray                      주어진 템플릿에서 렌더링된 매니페스트만 표시
      --skip-crds                                  설정된 경우, CRD를 설치하지 않는다. 기본적으로 CRD가 없으면 설치된다
      --skip-schema-validation                     설정된 경우, JSON 스키마 유효성 검사를 비활성화한다
      --skip-tests                                 템플릿 출력에서 테스트 건너뛰기
      --take-ownership                             설정된 경우, 설치 시 헬름 어노테이션 확인을 무시하고 기존 리소스의 소유권을 가져온다
      --timeout duration                           개별 쿠버네티스 작업(예: 훅에 대한 Job)을 기다리는 시간 (기본값 5m0s)
      --username string                            요청된 차트를 찾을 차트 리포지토리의 사용자 이름
      --validate                                   현재 가리키는 쿠버네티스 클러스터에 대해 매니페스트의 유효성을 검사한다. 설치 시 수행되는 것과 동일한 유효성 검사이다
  -f, --values strings                             YAML 파일 또는 URL에 값 지정 (여러 개 지정 가능)
      --verify                                     사용하기 전에 패키지 확인
      --version string                             사용할 차트 버전에 대한 버전 제약 조건 지정. 특정 태그(예: 1.1.1)이거나 유효한 범위(예: ^2.0.0)를 참조할 수 있다. 지정하지 않으면 최신 버전이 사용된다
      --wait                                       설정된 경우, 릴리스를 성공으로 표시하기 전에 모든 파드, PVC, 서비스, 그리고 Deployment, StatefulSet, ReplicaSet의 최소 파드 수가 Ready 상태가 될 때까지 대기한다. --timeout 시간만큼 대기한다
      --wait-for-jobs                              설정되고 --wait가 활성화된 경우, 릴리스를 성공으로 표시하기 전에 모든 Job이 완료될 때까지 대기한다. --timeout 시간만큼 대기한다
```

### 부모 명령어에서 상속된 옵션들

```
      --burst-limit int                 클라이언트 측 기본 스로틀링 제한 (기본값 100)
      --debug                           상세 출력 활성화
      --kube-apiserver string           쿠버네티스 API 서버의 주소 및 포트
      --kube-as-group stringArray       작업에 대해 가장할 그룹. 이 플래그를 반복하여 여러 그룹 지정 가능
      --kube-as-user string             작업에 대해 가장할 사용자 이름
      --kube-ca-file string             쿠버네티스 API 서버 연결을 위한 인증 기관 파일
      --kube-context string             사용할 kubeconfig 컨텍스트 이름
      --kube-insecure-skip-tls-verify   true인 경우, 쿠버네티스 API 서버의 인증서 유효성을 검사하지 않는다. HTTPS 연결이 안전하지 않게 된다
      --kube-tls-server-name string     쿠버네티스 API 서버 인증서 유효성 검사에 사용할 서버 이름. 제공되지 않으면 서버에 연결하는 데 사용된 호스트 이름이 사용된다
      --kube-token string               인증에 사용할 베어러 토큰
      --kubeconfig string               kubeconfig 파일 경로
  -n, --namespace string                이 요청에 대한 네임스페이스 범위
      --qps float32                     쿠버네티스 API와 통신할 때 사용되는 초당 쿼리 수 (버스트 제외)
      --registry-config string          레지스트리 구성 파일 경로 (기본값 "~/.config/helm/registry/config.json")
      --repository-cache string         캐시된 리포지토리 인덱스가 포함된 디렉터리 경로 (기본값 "~/.cache/helm/repository")
      --repository-config string        리포지토리 이름과 URL이 포함된 파일 경로 (기본값 "~/.config/helm/repositories.yaml")
```

### 함께 보기

* [helm](/helm/helm.md)	 - 쿠버네티스용 Helm 패키지 매니저

###### Auto generated by spf13/cobra on 14-Jan-2026
