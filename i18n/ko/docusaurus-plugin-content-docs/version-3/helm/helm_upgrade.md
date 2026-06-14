---
title: helm upgrade
---
릴리스를 업그레이드한다.

### 개요


이 명령어는 릴리스를 새 버전의 차트로 업그레이드한다.

업그레이드 시 사용되는 인수는 릴리스 및 차트여야 한다.
차트 인수는 차트 참조('example/mariadb'), 차트 디렉터리 경로,
패키지 차트 또는 정규화된 URL 중 하나일 수 있다.
차트 참조 시 '--version' 플래그가 설정되지 않았을 경우 최신 버전이 지정된다.

차트의 값을 재정의하려면 '--values' 플래그를 사용하고 파일을
전달하거나 '--set' 플래그를 사용하고 명령줄에서 구성을 전달한다.
문자열 값을 강제하려면 '--set-string'을 사용한다.
값 자체가 명령줄에 사용하기엔 너무 길거나 동적으로 생성되는 경우
'--set-file'을 사용하여 파일에서 개별 값을 설정할 수 있다.
'--set-json'을 사용하여 명령줄에서 JSON 값(스칼라/객체/배열)을
설정할 수도 있다.

'--values'/'-f' 플래그를 여러 번 지정할 수 있다. 지정된 마지막(가장 오른쪽) 파일에 우선 순위가 부여된다.
예를 들어 myvalues.yaml과 override.yaml에 'Test'라는 키가 포함된 경우
override.yaml에 설정된 값이 우선한다.

    $ helm upgrade -f myvalues.yaml -f override.yaml redis ./redis

'--set' 플래그도 여러 번 지정할 수 있다. 지정된 마지막(가장 오른쪽) 세트에
우선 순위가 부여된다. 예를 들어 'foo'라는 키에 대해 'bar'와 'newbar'에서
값이 모두 설정된 경우 'newbar'가 우선한다.

    $ helm upgrade --set foo=bar --set foo=newbar redis ./redis

'--reuse-values' 플래그를 사용하여 기존 릴리스의 값을 업데이트할 수도 있다.
'RELEASE'와 'CHART' 인수는 원래 매개변수로 설정해야 하며,
기존 값은 '--values'/'-f' 또는 '--set' 플래그를 통해 설정된 값과 병합된다.
새 값에 우선 순위가 부여된다.

    $ helm upgrade --reuse-values --set foo=bar --set foo=newbar redis ./redis

--dry-run 플래그는 민감한 값을 포함할 수 있는 Secret을 포함하여
생성된 모든 차트 매니페스트를 출력한다. Kubernetes Secret을 숨기려면
--hide-secret 플래그를 사용한다. 이러한 플래그를 사용하는 방법과 시기를
신중하게 고려해야 한다.


```
helm upgrade [RELEASE] [CHART] [flags]
```

### 옵션

```
      --atomic                                     설정된 경우, 업그레이드 실패 시 변경 사항을 롤백. --atomic을 사용하면 --wait 플래그가 자동으로 설정
      --ca-file string                             이 CA 번들을 사용하여 HTTPS 사용 서버의 인증서를 확인
      --cert-file string                           이 SSL 인증서 파일을 사용하여 HTTPS 클라이언트를 식별
      --cleanup-on-fail                            업그레이드 실패 시, 이 업그레이드에서 생성된 새 리소스 삭제를 허용
      --create-namespace                           --install이 설정된 경우 릴리스 네임스페이스가 없으면 생성
      --dependency-update                          차트를 설치하기 전에 종속성이 누락된 경우 업데이트
      --description string                         사용자 정의 설명을 추가
      --devel                                      개발 버전도 사용. 버전 '>0.0.0-0'에 해당하며 --version이 설정되어 있으면 무시
      --disable-openapi-validation                 설정된 경우, 업그레이드 프로세스는 쿠버네티스 OpenAPI 스키마에 대해 렌더링된 템플릿의 유효성 검사 미수행
      --dry-run string[="client"]                  설치를 시뮬레이션. --dry-run이 옵션 없이 설정되거나 '--dry-run=client'로 설정되면 클러스터 연결을 시도하지 않음. '--dry-run=server'로 설정하면 클러스터 연결을 시도
      --enable-dns                                 템플릿 렌더링 시 DNS 조회 활성화
      --force                                      대체 전략을 통해 리소스 강제 업데이트
  -h, --help                                       upgrade 명령어에 대한 도움말
      --hide-notes                                 설정된 경우, 업그레이드 출력에 notes를 표시하지 않음. 차트 메타데이터에는 영향 없음
      --hide-secret                                --dry-run 플래그와 함께 사용 시 Kubernetes Secret을 숨김
      --history-max int                            릴리스당 저장되는 최대 리비전 수를 제한. 0은 무제한 (기본값 10)
      --insecure-skip-tls-verify                   차트 다운로드를 위한 TLS 인증서 검사 건너뛰기
  -i, --install                                    이 이름의 릴리스가 아직 없는 경우 설치 수행
      --key-file string                            이 SSL 키 파일을 사용하여 HTTPS 클라이언트 식별
      --keyring string                             확인에 사용되는 공개키의 위치 (기본값 "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      릴리스 메타데이터에 추가될 레이블. 쉼표로 구분해야 함. 원래 릴리스 레이블이 업그레이드 레이블과 병합됨. null을 사용하여 레이블 해제 가능 (기본값 [])
      --no-hooks                                   사전/사후 업그레이드 훅 비활성화
  -o, --output format                              지정된 형식으로 출력. 허용되는 값: table, json, yaml (기본값 table)
      --pass-credentials                           모든 도메인에 자격 증명 전달
      --password string                            요청된 차트를 찾을 수 있는 차트 저장소 비밀번호
      --plain-http                                 차트 다운로드에 안전하지 않은 HTTP 연결 사용
      --post-renderer postRendererString           포스트 렌더링에 사용될 실행 파일의 경로. $PATH에 있으면 바이너리가 사용되며 그렇지 않은 경우 주어진 경로에서 실행 파일을 탐색
      --post-renderer-args postRendererArgsSlice   포스트 렌더러에 대한 인수 (여러 개 지정 가능) (기본값 [])
      --render-subchart-notes                      설정된 경우, 상위 차트와 함께 하위 차트 notes도 렌더링
      --repo string                                요청된 차트를 찾을 수 있는 차트 저장소 URL
      --reset-then-reuse-values                    업그레이드 할 때, 값을 차트에 내장된 값으로 재설정하고, 마지막 릴리스의 값을 적용한 다음 명령줄의 --set 및 -f를 통한 재정의와 병합. '--reset-values' 또는 '--reuse-values'가 지정되면 무시
      --reset-values                               업그레이드 할 때, 값을 차트에 내장된 값으로 재설정
      --reuse-values                               업그레이드 할 때, 마지막 릴리스의 값을 재사용하고 --set 및 -f를 통해 명령줄에서 재정의를 병합. '--reset-values'가 지정되면 무시
      --set stringArray                            명령줄에서 값 설정 (쉼표로 여러 값 또는 개별 값을 지정 가능: key1=val1,key2=val2)
      --set-file stringArray                       명령줄을 통해 지정된 각 파일에서 값 설정 (쉼표로 여러 값 또는 개별 값을 지정 가능: key1=path1,key2=path2)
      --set-json stringArray                       명령줄에서 JSON 값 설정 (쉼표로 여러 값 또는 개별 값을 지정 가능: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    명령줄에서 리터럴 STRING 값 설정
      --set-string stringArray                     명령줄에서 STRING 값 설정 (쉼표로 여러 값 또는 개별 값을 지정 가능: key1=val1,key2=val2)
      --skip-crds                                  설정된 경우, 설치 플래그가 활성화된 상태에서 업그레이드를 수행할 때 CRD 미설치. 기본적으로 설치 플래그가 활성화된 상태에서 업그레이드가 수행될 때 CRD가 없으면 설치
      --skip-schema-validation                     설정된 경우, JSON 스키마 유효성 검사 비활성화
      --take-ownership                             설정된 경우, 업그레이드는 helm 어노테이션 검사를 무시하고 기존 리소스의 소유권을 가져옴
      --timeout duration                           개별 쿠버네티스 작업(훅에 대한 Job 등)을 기다리는 시간 (기본값 5m0s)
      --username string                            요청된 차트를 찾을 수 있는 차트 저장소 사용자 이름
  -f, --values strings                             YAML 파일 또는 URL에 값 지정 (여러 개 지정 가능)
      --verify                                     사용하기 전에 패키지 확인
      --version string                             사용할 차트 버전에 대한 버전 제약 조건 지정. 이 제약 조건은 특정 태그(예: 1.1.1)이거나 유효한 범위(예: ^2.0.0)를 참조할 수 있음. 지정하지 않으면 최신 버전 사용
      --wait                                       설정된 경우, 릴리스를 성공으로 표시하기 전에 모든 Pod, PVC, Service, 및 Deployment, StatefulSet 또는 ReplicaSet의 최소 Pod 수가 준비 상태가 될 때까지 대기. --timeout으로 설정된 시간까지 대기
      --wait-for-jobs                              설정되고 --wait가 활성화된 경우, 릴리스를 성공으로 표시하기 전에 모든 Job이 완료될 때까지 대기. --timeout으로 설정된 시간까지 대기
```

### 부모 명령어에서 상속된 옵션들

```
      --burst-limit int                 클라이언트 측 기본 쓰로틀링 제한 (기본값 100)
      --debug                           장황한(verbose) 출력 활성화
      --kube-apiserver string           쿠버네티스 API 서버의 주소 및 포트
      --kube-as-group stringArray       작업을 수행할 그룹을 지정. 이 플래그는 여러 그룹을 지정하기 위해 반복 사용 가능
      --kube-as-user string             작업을 수행할 사용자 이름을 지정
      --kube-ca-file string             쿠버네티스 API 서버 연결을 위한 인증 기관 파일
      --kube-context string             사용할 kubeconfig 컨텍스트 이름
      --kube-insecure-skip-tls-verify   true인 경우, 쿠버네티스 API 서버의 인증서 유효성을 검사하지 않음. HTTPS 연결이 안전하지 않게 됨
      --kube-tls-server-name string     쿠버네티스 API 서버 인증서 검증에 사용할 서버 이름. 지정하지 않으면 서버에 연결할 때 사용한 호스트 이름을 사용
      --kube-token string               인증에 사용할 베어러(bearer) 토큰
      --kubeconfig string               kubeconfig 파일 경로
  -n, --namespace string                요청에 대한 네임스페이스 지정
      --qps float32                     쿠버네티스 API와 통신할 때 사용되는 초당 쿼리 수 (버스트 제외)
      --registry-config string          레지스트리 구성 파일 경로 (기본값 "~/.config/helm/registry/config.json")
      --repository-cache string         캐시된 저장소 인덱스가 포함된 디렉토리 경로 (기본값 "~/.cache/helm/repository")
      --repository-config string        저장소 이름 및 URL을 포함하는 파일 경로 (기본값 "~/.config/helm/repositories.yaml")
```

### 참조

* [helm](./helm.md)	 - 쿠버네티스를 위한 헬름 패키지 매니저.

###### Auto generated by spf13/cobra on 14-Jan-2026
