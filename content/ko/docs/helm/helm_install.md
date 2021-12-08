---
title: "Helm Install"
---

## helm install

차트를 설치한다.

### 개요


이 명령은 차트 아카이브를 설치한다.

install 인수는 차트 참조, 패키지 된 차트 경로, 
압축 해제 된 차트 디렉토리 경로 또는 URL 이어야한다.

차트의 값을 재정의하려면 '--values' 플래그를 사용하고 파일을 전달하거나 
'--set' 플래그를 사용하고 명령 줄에서 구성을 전달하고 
문자열 값에 '--set-string' 을 사용한다.
값이 커서 '--values' 도 '--set' 도 사용하지 않으려면 
'--set-file' 을 사용하여 파일에서 하나의 큰 값을 읽도록 하자.

    $ helm install -f myvalues.yaml myredis ./redis

또는

    $ helm install --set name=prod myredis ./redis

또는

    $ helm install --set-string long_int=1234567890 myredis ./redis

또는

    $ helm install --set-file my_script=dothings.sh myredis ./redis

'--values'/'-f' 플래그를 여러 번 지정할 수 있다. 지정된 마지막 (가장 오른쪽) 파일에 우선 순위가 부여된다. 
예를 들어 myvalues.yaml 과 override.yaml 에 'Test' 라는 키가 포함 된 경우 
override.yaml에 설정된 값이 우선한다.

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

'--set' 플래그를 여러 번 지정할 수 있다. 지정된 마지막 (가장 오른쪽) 세트에 우선 순위가 부여된다. 
예를 들어 'foo' 라는 키에 대해 'bar' 및 'newbar' 값이 모두 설정된 경우 
'newbar' 값이 우선한다.

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis


차트를 설치하지 않고 생성 된 릴리스의 매니페스트를 확인하려면 
'--debug' 및 '--dry-run' 플래그를 결합 할 수 있다.

--verify가 설정된 경우 차트에는 출처 파일이 반드시 있어야하며 
출처 파일은 모든 확인 단계를 반드시 통과해야한다.

설치할 차트를 표현할 수 있는 다섯가지 방법이 있다.

1. 차트 참조 : helm install mymaria example/mariadb
2. 패키지 차트 경로 : helm install mynginx ./nginx-1.2.3.tgz
3. 압축을 푼 차트 디렉토리 경로 : helm install mynginx ./nginx
4. 절대 URL : helm install mynginx https://example.com/charts/nginx-1.2.3.tgz
5. 차트 참조 및 저장소 URL : helm install --repo https://example.com/charts/ mynginx nginx

차트 참조(CHART REFERENCES)

차트 참조는 차트 저장소에서 차트를 참조하는 편리한 방법이다.

repo 접두사가 있는 차트 참조 ('example/mariadb')를 사용하면 
헬름은 로컬 구성에서 'example' 이라는 차트 저장소를 찾은 뒤
이름이 'mariadb' 인 해당 저장소에서 차트를 찾는다. 개발 버전(알파, 베타 및 릴리스 후보 릴리스)도 
포함하도록 '--devel' 플래그를 지정하거나 '--version' 플래그와 
함께 버전 번호를 제공하지 않는 한, 해당 차트의 최신 안정 버전을 설치한다.

차트 저장소 목록을 보려면 'helm repo list' 를 사용하자. 
저장소에서 차트를 검색하려면 'helm search' 를 사용하자.


```
helm install [NAME] [CHART] [flags]
```

### 옵션

```
      --atomic                       설정된 경우 설치 프로세스는 실패시 설치를 삭제. --atomic 을 사용할 경우 --wait 플래그도 자동으로 설정.
      --ca-file string               이 CA 번들을 사용하여 HTTPS 사용 서버의 인증서 확인
      --cert-file string             이 SSL 인증서 파일을 사용하여 HTTPS 클라이언트 식별
      --create-namespace             릴리스 네임스페이스가 없는 경우 생성
      --dependency-update            차트를 설치하기 전에 헬름 종속성 업데이트 실행
      --description string           사용자 정의 설명 추가
      --devel                        개발 버전도 사용. 버전 '>0.0.0-0' 과 동일하며, --version 이 설정되어 있을 경우 무시
      --disable-openapi-validation   설정된 경우, 설치 프로세스는 쿠버네티스 OpenAPI 스키마에 대해 렌더링 된 템플릿의 유효성 검사 미수행
      --dry-run                      모의 설치
  -g, --generate-name                이름을 생성 (그리고 NAME 매개 변수 생략)
  -h, --help                         helm install 명령어에 대한 도움말
      --insecure-skip-tls-verify     차트 다운로드를 위한 TLS 인증서 검사 미수행
      --key-file string              이 SSL 키 파일을 사용하여 HTTPS 클라이언트 식별
      --keyring string               확인에 사용되는 공개키의 위치 (기본값 "~/.gnupg/pubring.gpg")
      --name-template string         릴리스 이름을 지정하는데 사용되는 탬플릿 지정
      --no-hooks                     설치 중 훅 실행 방지
  -o, --output format                지정된 형식으로 출력. 허용되는 값: table, json, yaml (기본값 table)
      --password string              요청된 차트를 찾을 수 있는 차트 저장소 비밀번호
      --post-renderer postrenderer   포스트 렌더링에 사용될 실행 파일의 경로. $PATH에 있으면 바이너리가 사용되며 그렇지 않으면 주어진 경로에서 실행 파일을 탐색(기본 exec).
      --render-subchart-notes        설정된 경우 상위 차트와 함께 하위 차트 메모를 렌더링
      --replace                      해당 이름이 기록에 남아있는 삭제 된 릴리스 인 경우에만 주어진 이름을 재사용. 운영 환경에서는 안전하지 않기에 권장되지 않음
      --repo string                  요청된 차트를 찾을 수 있는 차트 저장소 URL
      --set stringArray              명령 줄에서 값 설정 (쉼표로 여러 값 또는 개별 값을 지정가능 : 키1 = 값1, 키2 = 값2)
      --set-file stringArray         명령 줄을 통해 지정된 각 파일에서 값 설정 (쉼표로 여러 값 또는 개별 값을 지정가능 : 키1 = 경로1, 키2 = 경로2)
      --set-string stringArray       명령 줄에서 STRING 값 설정 (쉼표로 여러 값 또는 개별 값을 지정가능 : 키1 = 값1, 키2 = 값2)
      --skip-crds                    설정된 경우, CRD 미설치. (기본적으로 CRD가 없는 경우에는 설치)
      --timeout duration             개별 쿠버네티스 작업(예: 훅에 대한 작업)을 기다리는 시간 (기본값 5m0s)
      --username string              요청된 차트를 찾을 수 있는 차트 저장소 사용자 이름
  -f, --values strings               YAML 파일 또는 URL에 값 지정 (여러 개를 지정가능)
      --verify                       사용하기 전에 패키지 확인
      --version string               사용할 정확한 차트 버전을 지정. 지정하지 않으면 최신 버전이 사용
      --wait                         설정된 경우, 릴리스를 성공으로 표시하기 전에 모든 파드, PVC, 서비스, 디플로이먼트, 스테이트풀셋, 레플리카셋의 최소 파드 수가 Ready 상태가 될 때까지 --timeout 만큼 대기
```

### 부모 명령어에서 상속된 옵션들

```
      --debug                       장황한(verbose) 출력 활성화
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

### 함께 보기

* [helm](helm.md)	 - 쿠버네티스에 대한 헬름 패키지 매니저.

###### Auto generated by spf13/cobra on 29-Oct-2020
