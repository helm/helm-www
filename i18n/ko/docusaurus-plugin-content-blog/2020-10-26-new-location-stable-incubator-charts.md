---
title: "Stable 및 Incubator 차트를 위한 새로운 공간"
slug: "new-location-stable-incubator-charts"
authors: ["mattfarina"]
date: "2020-10-26"
---

[이전에 발표한 것과 같이](https://helm.sh/ko/blog/helm-turns-five/), stable 및 incubator 저장소가 새로운 공간으로 이동하게 된다. 
이 게시물은 새로운 위치에 대한 업데이트를 제공하고 그것을 사용하는 방법을 제공한다.<!-- truncate -->

_**중요한 참고사항:** 이는 2019 년에 발표된 stable 및 incubator 저장소의 오래된 타임 라인에 영향을 주지 않는다. 
2020 년 11 월 13 일에 stable 및 incubator 차트 저장소는 개발이 끝나고 아카이브가 된다. 
많은 차트가 커뮤니티에서 관리하는 다른 저장소로 이동했음을 알 수 있다. 
[아티팩트 허브](https://artifacthub.io/)에서 확인할 수 있다. 
노후화에 대한 자세한 정보는 향후 블로그 게시물 및 커뮤니케이션에서 이어질 예정이다._

stable 저장소의 새 위치는 https://charts.helm.sh/stable이고 incubator 저장소의 새 위치는 https://charts.helm.sh/incubator 이다. 
아래의 이전 위치 중 하나에서 차트를 사용하는 경우 2020 년 11 월 13 일 이전에 사용하는 저장소를 업데이트 해야한다. 
새 위치는 깃헙 페이지를 사용하여 호스팅된다.

| 이름        | 이전 위치       | 새 위치        |
| --------- | ------------ | ------------ |
| stable    | https://kubernetes-charts.storage.googleapis.com | https://charts.helm.sh/stable |
| incubator | https://kubernetes-charts-incubator.storage.googleapis.com | https://charts.helm.sh/incubator |


새 위치와 함께 헬름 v2.17.0 및 v3.4.0 이 릴리스 되어 새 위치에서 사용할 수 있다. 
최신 버전으로 업그레이드하는 것이 좋다. <!-more->

## 헬름 v3.4.0

헬름 v3.4.0은 이제 이전 위치로 구성된 안정 및 인큐베이터 저장소가 있는지 감지하고 구성을 새 위치로 업데이트해야 함을 경고한다. 
단일 명령을 사용하여 이를 수행 할 수 있다. 
예를 들어 `stable` 이라는 이름으로 설정된 안정적인 저장소를 업데이트하려면 다음을 실행할 수 있다.

```
helm repo add stable https://charts.helm.sh/stable --force-update
```

이 명령은 v3.4.0 이전의 헬름 v3 버전에서도 작동한다. 
최신 헬름 v3 릴리스로 업데이트하지 않고도 사용할 수 있다.

또한 `helm repo add` 를 사용하여 이전 위치에 있는 저장소 중 하나를 추가하려고 하면 Helm v3.4.0 이상 버전은 저장소를 추가하지 못하고 새 위치를 사용하도록 경고한다. 
자동으로 새 위치를 추가하는 대신 사람들에게 위치 변경을 알리고 싶은 의도이다. 
이전 위치 중 하나를 사용해야하는 이유가 있는 경우 새로운 `--allow-deprecated-repos` 플래그를 사용할 수 있다. 
플래그는 이전 위치가 계속 작동하는 동안에만 유용하다.

## 헬름 v2.17.0

헬름 v2 에서는 `helm init` 가 실행될 때 기본적으로 stable 저장소를 추가했다. 
이로 인해 v2.17.0 부터는 헬름 v2 에 대한 다른 솔루션이 도입되었다.

stable 저장소 또는 로컬 저장소가 필요하지 않은 경우 `helm init` 를 실행할 때 `--skip-repos` 플래그를 사용할 수 있다. 
이것은 v2.17.0의 새로운 플래그이다. 
안정적인 저장소를 사용하지 않는 CI 시스템과 같은 일부 사용 사례에서 성능상의 이점이 있을 수 있다.

v2.17.0 에서 `helm init` 가 실행되면 이전 위치 대신 새 위치가 사용된다. 
이것은 정기적으로 `helm init` 를 실행하는 CI 시스템에서 발생한다. 
이전 위치를 계속 사용해야 하는 경우 새로운 `--use-deprecated-stable-repository` 플래그를 `helm init` 에 전달할 수 있습니다. 
이것은 이전 위치가 계속 작동하는 동안에만 작동한다.

stable 또는 incubator 저장소에 대해 구성된 이전 위치가 이미 있는 경우 헬름은 새 위치로 전환해야 한다는 경고를 표시한다. 
Helm v2에서는 작업 수행 시 두 개의 명령을 사용해야 한다는 점에서 
Helm v3와 약간 다르다. 
예를 들어 `stable` 저장소를 변경하려면 다음을 실행할 수 있다.

```
helm repo rm stable
helm repo add stable https://charts.helm.sh/stable
```

이 명령은 v2.17.0 이전의 Helm v2 버전에서 작동한다. 
최신 Helm v2 릴리스로 업데이트 하지 않고도 사용할 수 있다.

_참고 : GitHub 페이지로 이동하는 stable 및 incubator 저장소 외에도 
[틸러(Tiller)의 기본 위치가 GitHub 컨테이너 저장소 (ghcr.io)로 이동되었다](https://github.com/orgs/helm/packages/container/package/tiller). 
[틸러는 GCR에서 계속 사용할 수 있다](https://gcr.io/kubernetes-helm/tiller) (이전 위치). 
[도커 허브] (https://hub.docker.com/r/helmpack/tiller) 및 [Quay] (http://quay.io/helmpack/tiller)에서도 틸러를 다운로드 할 수 있다. 
틸러의 기본 위치가 아닌 위치를 지정하려면 `helm init`를 실행할 때 `-i` 또는 `--tiller-image` 플래그를 사용할 수 있다._

## 사용자만의 복제본 호스팅 하기

헬름이 네트워크 호출을 할 수 있는 위치를 제어 할 수 있고 
헬름이 깃헙 페이지를 호출하지 않도록 하는 경우가 있다. 
stable 또는 incubator 저장소의 차트가 필요한 경우 한 가지 옵션은 
자신의 저장소에 필요한 차트 및 차트 버전의 사본을 호스팅하는 것이다. 
[ChartMuseum] (https://github.com/helm/chartmuseum), [Harbor] (https://goharbor.io/), 정적 웹 서버 또는 다른 시스템으로 이 저장소를 호스팅 할 수 있다.

헬름 조직 및 차트 관리자 중 한 명인 Scott Rigby는 [차트와 기록의 전체 또는 일부를 복사 할 수있는 스크립트](https://github.com/scottrigby/helm-adopt-package-history)를 만들었다(이전 차트 버전). 
이 도구 및 이와 유사한 도구를 사용하여 사용하는 차트의 복사본을 만들 수 있다. 
이것은 다른 위치에서 제공 될 수 있다.

헬름 v2 에서는 `--stable-repo-url` 플래그를 사용하여 `helm init` 를 실행할 때 
안정적인 저장소의 대체 위치를 지정할 수 있다.
