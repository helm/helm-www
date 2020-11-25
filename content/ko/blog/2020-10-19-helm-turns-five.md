---
title: "헬름 5주년과 깃헙으로부터의 차트 선물"
slug: "helm-turns-five"
authorname: "Matt Butcher & Matt Farina"
author: "@technosophos & @mattfarina"
authorlink: "https://helm.sh"
date: "2020-10-19"
---

{{< figure src="https://helm.sh/blog/images/happy-5th.png" alt="Happy 5th Birthday Helm" >}}

5년 전, Deis(마이크로소프트에 인수된 이후)의 해커톤에서 헬름이 탄생했다.
<!--more-->

```
commit ecad6e2ef9523a0218864ec552bbfc724f0b9d3d
Author: Matt Butcher <mbutcher@engineyard.com>
Date:   Mon Oct 19 17:43:26 2015 -0600

    initial add
```

[이 커밋](https://github.com/helm/helm-classic/commit/ecad6e2ef9523a0218864ec552bbfc724f0b9d3d)은 헬름 v1 용 코드베이스가 있는 헬름 클래식 깃 저장소에서 찾을 수 있다. 

이것은 디플로이먼트 매니저와 병합되어 쿠버네티스에 합쳐지기 전의 원래 헬름이다. 이것이 모든 것이 시작된 곳이다.

첫날부터 헬름 프로젝트는 소스 관리, 풀 요청 관리 및 문제 추적을 위해 깃헙을 사용해왔다. 
졸업한 CNCF 프로젝트로서, 헬름 조직은 이제 수십 개의 깃헙 저장소를 운영하고 있다.

하지만 패키징 된 차트를 호스팅 할때 구글 클라우드에서 호스팅 되는 객체 스토리지 버킷에 저장했었다. 

이 역사적인 결정은 당시 구글이 헬름의 주요 기여자 중 하나였음을 반영한다.

최근, 구글이 공식 헬름 차트 저장소를 지원하는 시기가 다가오고 있다. 

지난 몇년 동안 구글이 헬름 차트 저장소를 호스팅 해준 것에 대해 감사한다. 

또한 이 이벤트를 통해 차트 개발 파이프라인을 깃헙과 통합 할수 있는 기회를 얻게 되었다.


{{< figure src="../images/octocat.png" alt="Hello Github Octocat!" width="350px" >}}

따라서 오늘의 생일 축하 행사를 위해,  헬름 `stable` 및 `인큐베이터` 차트 저장소가 깃헙에서 직접 호스팅 될 예정임을 알리고 싶다. 

또한 깃헙 액션은 차트 게시를 위한 파이프라인을 강화한다. 깃헙의 놀랍도록 빠른 네트워크 덕분에 차트 다운로드가 그 어느 때보다 더욱 빨라졌다!

추가로 깃헙 마켓 플레이스에 공식 헬름 깃헙 작업을 게시했다. 

깃헙에서 헬름 차트를 호스팅 하는 방법은 [헬름 차트 릴리서(Helm Chart Releaser)](https://github.com/marketplace/actions/helm-chart-releaser)를 확인하자.

헬름 2 는 지원이 종료되었지만, [공식 틸러 도커 이미지](https://github.com/orgs/helm/packages)도 깃헙의 컨테이너 저장소로 이동했다.

깃헙의 도구와 모든 규모의 오픈 소스 프로젝트에 대한 지원에 깊이 감사드린다.

헬름의 생일을 축하한다!
