---
title: "헬름 차트 저장소 지원 중단 업데이트"
slug: "charts-repo-deprecation"
authors: ["viciglesias"]
date: "2020-10-30"
---

2019 년에 헬름 v2 지원 타임 라인 및 수명 종료 계획이 발표되었을 때 [helm/charts GitHub 저장소](https://github.com/helm/charts)의 [지원 중단](https://github.com/helm/charts#deprecation-timeline)도 발표되었다. 지원 중단의 주된 이유는 [저장소 관리자](https://github.com/helm/charts/blob/master/OWNERS)의 유지 관리가 크게 증가했기 때문이다. 지난 몇 년 동안 유지 관리중인 차트 수가 100 개 이하에서 300 개 이상으로 증가하여 저장소에 대한 풀 요청 및 업데이트가 이에 상응하게 증가했다. 안타깝게도 검토 및 유지 관리 작업을 자동화하려는 많은 노력에도 불구하고 관리자의 유지 관리 시간은 단축되지 않았다.<!-- truncate -->

지원 중단을 발표했을 때 우리는 helm/charts repo를 유지하는 데 사용했던 도구와 지침도 공유하기 시작했다. 자체 저장소를 호스팅하고 유지하려는 사람들을 위해 이제 다음 도구를 사용하여 프로세스를 간소화 할 수 있다.

- [차트 테스트](https://github.com/helm/chart-testing)는 차트에 대한 PR 린팅(Linting) 및 테스트를 제공한다.
- [차트 Releaser](https://github.com/helm/chart-releaser) 는 아티팩트를 호스팅하는 데 사용되는 깃헙 릴리스 및 페이지를 사용하여 자체 차트 저장소를 호스팅 하는데 도움이 되는 도구를 제공한다.
- [깃헙 동작 테스트 및 릴리징](https://github.com/helm?q=chart+action) 는 위에서 설명한 깃헙 동작을 사용하여 도구를 자동화 한다.

이러한 도구를 사용하여 활성 유지 관리를 위해 많은 차트를 [자체 저장소로 마이그레이션] (https://github.com/helm/charts/issues/21103) 할 수 있다.

## 주요 날짜 및 권장되는 조치

계획이 수정되면서 다음에 일어날 일에 대한 혼란/질문이 있었기에 앞으로 진행할 주요 이벤트 및 ** 권장 조치 **의 타임 라인을 제공하고자 한다.

* 2020년 11월 2일 - 지원 중단되지 않는 모든 차트의 README 에 더 이상 업데이트 되지 않는다는 메모가 추가된다.
	* **권장 조치** - 차트 저장소의 차트에 의존하는 경우 새 공식 위치를 찾아야 한다. 존재하지 않을 경우 차트의 적용을 고려하라.
* 2020년 11월 6일 - [아티팩트 허브](https://artifacthub.io/)에서 stable 및 incubator 차트 저장소가 삭제된다.
	* **권장 조치** - 없음
* 2020년 11월 13일 - [helm/charts 저장소](https://github.com/helm/chart)의 CI가 비활성화되고 더 이상 Pull Request 가 허용되지 않는다.
	* **권장 조치** - 차트를 새 저장소로 재배치하기 위한 진행중인 발의(initiative) 대한 자세한 내용은 [이 문제](https://github.com/helm/charts/issues/21103)를 참조하자.
* 2020년 11월 13일 *이후* - 이전 위치에서 차트를 다운로드하면 GitHub 페이지에서 사용할 수있는 읽기 전용 아카이브로 리디렉션된다. 이 날짜 이후에는 이전 위치를 더 이상 사용할 수 없다.
	* **권장 조치** - [보관된 stable 및 incubator 차트로의 전환](https://helm.sh/docs/faq/#i-am-getting-a-warning-about-unable-to-get-an-update-from-the-stable-chart-repository)에 대한 정보를 참조하라. 이 차트는 더 이상 버그 수정이나 보안 패치로 업데이트되지 않는다.


## 참조

* [차트 저장소 지원 중단 일정](https://github.com/helm/charts/issues/23944)
* [패키지 이력 재배치](https://github.com/helm/charts/issues/23850)
* [헬름 차트 호스팅을 CNCF로 전환하도록 요청](https://github.com/helm/community/issues/114)
