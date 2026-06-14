---
title: helm install
---
차트를 설치한다.

### 개요


이 명령은 차트 아카이브를 설치한다.

install 인수는 차트 참조, 패키지된 차트 경로,
압축 해제된 차트 디렉토리 경로 또는 URL이어야 한다.

차트의 값을 재정의하려면 '--values' 플래그를 사용하여 파일을 전달하거나
'--set' 플래그를 사용하여 명령줄에서 구성을 전달한다. 문자열 값을 강제하려면
'--set-string'을 사용한다. 값 자체가 명령줄에 사용하기엔 너무 길거나
동적으로 생성되는 경우 '--set-file'을 사용하여 파일에서 개별 값을 설정할 수 있다.
'--set-json'을 사용하여 명령줄에서 JSON 값(스칼라/객체/배열)을 설정할 수도 있다.

    $ helm install -f myvalues.yaml myredis ./redis

또는

    $ helm install --set name=prod myredis ./redis

또는

    $ helm install --set-string long_int=1234567890 myredis ./redis

또는

    $ helm install --set-file my_script=dothings.sh myredis ./redis

또는

    $ helm install --set-json 'master.sidecars=[{"name":"sidecar","image":"myImage","imagePullPolicy":"Always","ports":[{"name":"portname","containerPort":1234}]}]' myredis ./redis


'--values'/'-f' 플래그를 여러 번 지정할 수 있다. 지정된 마지막(가장 오른쪽) 파일에
우선순위가 부여된다. 예를 들어 myvalues.yaml과 override.yaml에 'Test'라는 키가
포함된 경우 override.yaml에 설정된 값이 우선한다:

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

'--set' 플래그를 여러 번 지정할 수 있다. 지정된 마지막(가장 오른쪽) 세트에
우선순위가 부여된다. 예를 들어 'foo'라는 키에 대해 'bar'와 'newbar' 값이 모두
설정된 경우 'newbar' 값이 우선한다:

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis

마찬가지로, 다음 예제에서 'foo'는 '["four"]'로 설정된다:

    $ helm install --set-json='foo=["one", "two", "three"]' --set-json='foo=["four"]' myredis ./redis

그리고 다음 예제에서 'foo'는 '{"key1":"value1","key2":"bar"}'로 설정된다:

    $ helm install --set-json='foo={"key1":"value1","key2":"value2"}' --set-json='foo.key2="bar"' myredis ./redis

차트를 설치하지 않고 릴리스의 생성된 매니페스트를 확인하려면
--debug와 --dry-run 플래그를 함께 사용할 수 있다.

--dry-run 플래그는 민감한 값을 포함할 수 있는 Secret을 포함하여
생성된 모든 차트 매니페스트를 출력한다. Kubernetes Secret을 숨기려면
--hide-secret 플래그를 사용한다. 이러한 플래그를 사용하는 방법과 시기를
신중하게 고려해야 한다.

--verify가 설정된 경우, 차트에는 출처 파일이 반드시 있어야 하며,
출처 파일은 모든 검증 단계를 반드시 통과해야 한다.

설치할 차트를 표현하는 여섯 가지 방법이 있다:

1. 차트 참조: helm install mymaria example/mariadb
2. 패키지된 차트 경로: helm install mynginx ./nginx-1.2.3.tgz
3. 압축 해제된 차트 디렉토리 경로: helm install mynginx ./nginx
4. 절대 URL: helm install mynginx https://example.com/charts/nginx-1.2.3.tgz
5. 차트 참조 및 저장소 URL: helm install --repo https://example.com/charts/ mynginx nginx
6. OCI 레지스트리: helm install mynginx --version 1.2.3 oci://example.com/charts/nginx

차트 참조

차트 참조는 차트 저장소에서 차트를 참조하는 편리한 방법이다.

저장소 접두사가 있는 차트 참조('example/mariadb')를 사용하면, Helm은
로컬 구성에서 'example'이라는 차트 저장소를 찾은 다음
해당 저장소에서 'mariadb'라는 이름의 차트를 찾는다.
개발 버전(알파, 베타, 릴리스 후보)도 포함하려면 '--devel' 플래그를 지정하거나
'--version' 플래그로 버전 번호를 제공하지 않는 한,
해당 차트의 최신 안정 버전을 설치한다.

차트 저장소 목록을 보려면 'helm repo list'를 사용한다.
저장소에서 차트를 검색하려면 'helm search'를 사용한다.


```
helm install [NAME] [CHART] [flags]
```

### 옵션

```
      --atomic                                     설정된 경우, 설치 실패 시 설치를 삭제. --atomic을 사용하면 --wait 플래그가 자동으로 설정
      --ca-file string                             이 CA 번들을 사용하여 HTTPS 사용 서버의 인증서를 확인
      --cert-file string                           이 SSL 인증서 파일을 사용하여 HTTPS 클라이언트를 식별
      --create-namespace                           릴리스 네임스페이스가 없는 경우 생성
      --dependency-update                          차트를 설치하기 전에 의존성이 누락된 경우 업데이트
      --description string                         사용자 정의 설명 추가
      --devel                                      개발 버전도 사용. 버전 '>0.0.0-0'과 동일. --version이 설정되면 무시
      --disable-openapi-validation                 설정된 경우, 설치 프로세스는 렌더링된 템플릿을 Kubernetes OpenAPI 스키마에 대해 검증하지 않음
      --dry-run string[="client"]                  설치를 시뮬레이션. --dry-run이 옵션 없이 설정되거나 '--dry-run=client'로 설정된 경우, 클러스터 연결을 시도하지 않음. '--dry-run=server'를 설정하면 클러스터 연결을 시도 가능
      --enable-dns                                 템플릿 렌더링 시 DNS 조회를 활성화
      --force                                      교체 전략을 통해 리소스 업데이트를 강제
  -g, --generate-name                              이름을 생성(NAME 매개변수 생략)
  -h, --help                                       install 도움말
      --hide-notes                                 설정된 경우, 설치 출력에 notes를 표시하지 않음. 차트 메타데이터에는 영향을 주지 않음
      --hide-secret                                --dry-run 플래그와 함께 사용할 때 Kubernetes Secret을 숨김
      --insecure-skip-tls-verify                   차트 다운로드를 위한 TLS 인증서 검사를 건너뜀
      --key-file string                            이 SSL 키 파일을 사용하여 HTTPS 클라이언트를 식별
      --keyring string                             검증에 사용되는 공개 키의 위치 (기본값 "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      릴리스 메타데이터에 추가할 레이블. 쉼표로 구분 (기본값 [])
      --name-template string                       릴리스 이름을 지정하는 데 사용되는 템플릿 지정
      --no-hooks                                   설치 중 훅 실행을 방지
  -o, --output format                              지정된 형식으로 출력. 허용되는 값: table, json, yaml (기본값 table)
      --pass-credentials                           모든 도메인에 자격 증명을 전달
      --password string                            요청된 차트가 위치한 차트 저장소 비밀번호
      --plain-http                                 차트 다운로드에 보안되지 않은 HTTP 연결을 사용
      --post-renderer postRendererString           포스트 렌더링에 사용할 실행 파일의 경로. $PATH에 있으면 바이너리가 사용되고, 그렇지 않으면 지정된 경로에서 실행 파일을 탐색
      --post-renderer-args postRendererArgsSlice   포스트 렌더러에 대한 인수 (여러 개 지정 가능) (기본값 [])
      --render-subchart-notes                      설정된 경우, 부모 차트와 함께 하위 차트 notes를 렌더링
      --replace                                    지정된 이름이 히스토리에 남아 있는 삭제된 릴리스인 경우에만 해당 이름을 재사용. 프로덕션 환경에서는 안전하지 않음
      --repo string                                요청된 차트가 위치한 차트 저장소 URL
      --set stringArray                            명령줄에서 값을 설정 (여러 개 또는 쉼표로 구분된 값을 지정 가능: key1=val1,key2=val2)
      --set-file stringArray                       명령줄에서 지정된 해당 파일에서 값을 설정 (여러 개 또는 쉼표로 구분된 값을 지정 가능: key1=path1,key2=path2)
      --set-json stringArray                       명령줄에서 JSON 값을 설정 (여러 개 또는 쉼표로 구분된 값을 지정 가능: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    명령줄에서 리터럴 STRING 값을 설정
      --set-string stringArray                     명령줄에서 STRING 값을 설정 (여러 개 또는 쉼표로 구분된 값을 지정 가능: key1=val1,key2=val2)
      --skip-crds                                  설정된 경우, CRD가 설치되지 않음. 기본적으로 CRD가 아직 없으면 설치
      --skip-schema-validation                     설정된 경우, JSON 스키마 검증을 비활성화
      --take-ownership                             설정된 경우, install은 helm 어노테이션 검사를 무시하고 기존 리소스의 소유권을 가져옴
      --timeout duration                           개별 Kubernetes 작업(예: 훅에 대한 Job)을 기다리는 시간 (기본값 5m0s)
      --username string                            요청된 차트가 위치한 차트 저장소 사용자명
  -f, --values strings                             YAML 파일 또는 URL에서 값을 지정 (여러 개 지정 가능)
      --verify                                     사용하기 전에 패키지를 검증
      --version string                             사용할 차트 버전에 대한 버전 제약을 지정. 이 제약은 특정 태그(예: 1.1.1)일 수도 있고 유효한 범위(예: ^2.0.0)를 참조할 수도 있음. 지정하지 않으면 최신 버전이 사용
      --wait                                       설정된 경우, 릴리스를 성공으로 표시하기 전에 모든 Pod, PVC, Service, 그리고 Deployment, StatefulSet 또는 ReplicaSet의 최소 Pod 수가 준비 상태가 될 때까지 --timeout 만큼 대기
      --wait-for-jobs                              설정되고 --wait가 활성화된 경우, 릴리스를 성공으로 표시하기 전에 모든 Job이 완료될 때까지 --timeout 만큼 대기
```

### 부모 명령에서 상속된 옵션

```
      --burst-limit int                 클라이언트 측 기본 스로틀링 제한 (기본값 100)
      --debug                           상세 출력을 활성화
      --kube-apiserver string           Kubernetes API 서버의 주소와 포트
      --kube-as-group stringArray       작업을 수행할 그룹을 지정. 이 플래그는 여러 그룹을 지정하기 위해 반복 사용 가능
      --kube-as-user string             작업을 수행할 사용자 이름을 지정
      --kube-ca-file string             Kubernetes API 서버 연결을 위한 인증 기관 파일
      --kube-context string             사용할 kubeconfig 컨텍스트 이름
      --kube-insecure-skip-tls-verify   true인 경우, Kubernetes API 서버의 인증서 유효성을 검사하지 않음. HTTPS 연결이 안전하지 않게 됨
      --kube-tls-server-name string     Kubernetes API 서버 인증서 검증에 사용할 서버 이름. 지정하지 않으면 서버에 연결할 때 사용한 호스트 이름을 사용
      --kube-token string               인증에 사용할 베어러(bearer) 토큰
      --kubeconfig string               kubeconfig 파일 경로
  -n, --namespace string                요청에 대한 네임스페이스 지정
      --qps float32                     Kubernetes API와 통신할 때 사용되는 초당 쿼리 수 (버스트 제외)
      --registry-config string          레지스트리 구성 파일 경로 (기본값 "~/.config/helm/registry/config.json")
      --repository-cache string         캐시된 저장소 인덱스가 포함된 디렉토리 경로 (기본값 "~/.cache/helm/repository")
      --repository-config string        저장소 이름 및 URL을 포함하는 파일 경로 (기본값 "~/.config/helm/repositories.yaml")
```

### 참조

* [helm](./helm.md)	 - Kubernetes를 위한 Helm 패키지 매니저.

###### Auto generated by spf13/cobra on 14-Jan-2026
