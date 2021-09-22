---
title: "레지스트리"
description: "차트 배포를 위한 OCI 사용법을 설명한다."
weight: 7
---

헬름 3는 패키지 배포를 위해 <a href="https://www.opencontainers.org/"
target="_blank">OCI</a>를 지원한다. 차트 패키지는 OCI 기반 레지스트리 간에
저장 및 공유할 수 있다.

## OCI 지원 활성화

현재 OCI 지원은 *실험적(experimental)* 으로 간주되고 있다.

아래에서 기술된 명령들을 사용하려면 환경에서 `HELM_EXPERIMENTAL_OCI` 변수를 설정하자:

```console
export HELM_EXPERIMENTAL_OCI=1
```

## 레지스트리 실행

테스트 목적으로 레지스트리를 시작하는 것은 간단하다. 도커를 설치한 경우, 다음 명령어를
실행하자.

```console
docker run -dp 5000:5000 --restart=always --name registry registry
```

이렇게 하면 `localhost:5000`에서 레지스트리 서버가 시작될 것이다.

`docker logs -f registry`를 사용하여 로그를 확인하고 `docker rm -f registry`를
사용하여 중지하자.

스토리지를 보존하려면 위의 명령에 `-v $(pwd)/registry:/var/lib/registry`를
추가하자.

자세한 설정 옵션은 [해당 문서](https://docs.docker.com/registry/deploying/)를
참조하자.

### 인증

레지스트리에 인증을 활성화하려면, 다음과 같이 해보자.

먼저 사용자 이름과 비밀번호로 `auth.htpasswd` 파일을 만들자.

```console
htpasswd -cB -b auth.htpasswd myuser mypass
```

그런 다음, 서버를 시작하여 해당 파일을 마운트하고 `REGISTRY_AUTH` 환경 변수를
지정하자.

```console
docker run -dp 5000:5000 --restart=always --name registry \
  -v $(pwd)/auth.htpasswd:/etc/docker/registry/auth.htpasswd \
  -e REGISTRY_AUTH="{htpasswd: {realm: localhost, path: /etc/docker/registry/auth.htpasswd}}" \
  registry
```

## 레지스트리 작업 명령어

`helm registry`와 `helm chart` 명령어로 레지스트리와 로컬 캐시에 대한 작업을 할 수 있다.

### `registry` 하위 명령어

#### `login`

레지스트리에 로그인 (암호 수동 입력)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

레지스트리에서 로그아웃

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### `chart` 하위 명령어

#### `save`

로컬 캐시에 차트 디렉토리를 저장

```console
$ helm chart save mychart/ localhost:5000/myrepo/mychart:2.7.0
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
2.7.0: saved
```

#### `list`

저장된 모든 차트 나열

```console
$ helm chart list
REF                                                     NAME                    VERSION DIGEST  SIZE            CREATED
localhost:5000/myrepo/mychart:2.7.0                     mychart                 2.7.0   84059d7 454 B           27 seconds
localhost:5000/stable/acs-engine-autoscaler:2.2.2       acs-engine-autoscaler   2.2.2   d8d6762 4.3 KiB         2 hours
localhost:5000/stable/aerospike:0.2.1                   aerospike               0.2.1   4aff638 3.7 KiB         2 hours
localhost:5000/stable/airflow:0.13.0                    airflow                 0.13.0  c46cc43 28.1 KiB        2 hours
localhost:5000/stable/anchore-engine:0.10.0             anchore-engine          0.10.0  3f3dcd7 34.3 KiB        2 hours
...
```

#### `export`

디렉토리로 차트 내보내기

```console
$ helm chart export localhost:5000/myrepo/mychart:2.7.0
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
Exported chart to mychart/
```

#### `push`

원격지로 차트 밀어주기(push)

```console
$ helm chart push localhost:5000/myrepo/mychart:2.7.0
The push refers to repository [localhost:5000/myrepo/mychart]
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
2.7.0: pushed to remote (1 layer, 2.4 KiB total)
```

#### `remove`

캐시에서 차트 제거하기

```console
$ helm chart remove localhost:5000/myrepo/mychart:2.7.0
2.7.0: removed
```

#### `pull`

원격지에서 차트 가져오기(pull)

```console
$ helm chart pull localhost:5000/myrepo/mychart:2.7.0
2.7.0: Pulling from localhost:5000/myrepo/mychart
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
Status: Downloaded newer chart for localhost:5000/myrepo/mychart:2.7.0
```

## 내 차트는 어디 있나?

위의 명령어들을 사용하여 저장된 차트는 파일 시스템에 캐시될 것이다.

[OCI 이미지 레이아웃
사양](https://github.com/opencontainers/image-spec/blob/main/image-layout.md)은
파일시스템 레이아웃에 엄격하게 적용되는데, 예를 들면 다음과 같다.
```console
$ tree ~/Library/Caches/helm/
/Users/myuser/Library/Caches/helm/
└── registry
    ├── cache
    │   ├── blobs
    │   │   └── sha256
    │   │       ├── 1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
    │   │       ├── 31fb454efb3c69fafe53672598006790122269a1b3b458607dbe106aba7059ef
    │   │       └── 8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111
    │   ├── index.json
    │   ├── ingest
    │   └── oci-layout
    └── config.json
```

모든 헬름 차트 매니페스트에 대한 참조(ref)를 포함하는 예시 index.json:

```console
$ cat ~/Library/Caches/helm/registry/cache/index.json  | jq
{
  "schemaVersion": 2,
  "manifests": [
    {
      "mediaType": "application/vnd.oci.image.manifest.v1+json",
      "digest": "sha256:31fb454efb3c69fafe53672598006790122269a1b3b458607dbe106aba7059ef",
      "size": 354,
      "annotations": {
        "org.opencontainers.image.ref.name": "localhost:5000/myrepo/mychart:2.7.0"
      }
    }
  ]
}
```

헬름 차트 매니페스트 예시 ('mediaType' 필드를 주목하자):

```console
$ cat ~/Library/Caches/helm/registry/cache/blobs/sha256/31fb454efb3c69fafe53672598006790122269a1b3b458607dbe106aba7059ef | jq
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

## 차트 저장소에서 마이그레이션

클래식 [차트 저장소]({{< ref path="chart_repository.md" lang="ko" >}}) (index.yaml 기반 저장소)에서 마이그레이션하는 작업은 `helm fetch` (헬름 2 CLI), `helm
chart save`, `helm chart push` 정도로 간단하다.
