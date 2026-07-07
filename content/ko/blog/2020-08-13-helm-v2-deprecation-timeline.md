---
title: "헬름 v2 사용중단 타임라인"
slug: "helm-v2-deprecation-timeline"
authorname: "Bridget Kromhout"
author: "@bridgetkromhout"
authorlink: "https://twitter.com/bridgetkromhout"
date: "2020-08-12"
---


_[루이스 캐롤에게 고개를 끄덕이며...](https://www.jabberwocky.com/carroll/walrus.html)_

    “때가 되었습니다,” 메인테이너(maintainers)는 말한다,
      “소프트웨어의 운명에 대하여 이야기하기 위해:
    업그레이드와 -- 헬름 v3의 출시와 --
      버그의 수정 -- 그리고 k8s. --”

헬름 v3는 [2019년 11월에 출시되었으며](/blog/helm-3-released/), 커뮤니티의 요구에 부응하여 헬름을 계속 발전시켜온 커뮤니티의 노력의 결과입니다. 간소화된 클라이언트 단독 사용환경, 새로운 보안 관점, 쿠버네티스 API와의 더욱 긴밀한 연계를 통하여 헬름 v3는 쿠버네티스에 대한 운영 테스트 패키지 관리 기능을 계속 제공합니다. 그리고 [졸업한 CNCF 프로젝트](/blog/celebrating-helms-cncf-graduation/)인 헬름은 클라우드 네이티브 생태계의 핵심부분입니다.

운영 환경에 주(major) 버전 변경사항을 반영하려면 시간이 필요하다는 것을 우리도 인지하고 있다. 헬름 메인테이너(maintainer)는 2020년 5월까지 헬름 v2에 대한 버그픽스([2020년 8월로 연장됨](/blog/covid-19-extending-helm-v2-bug-fixes/)), 2020년 11월까지 헬름 v2에 대한 보안패치를 제공하기로 했다. 그리고 이제 버그픽스 창은 닫힙니다. [헬름 v2.16.10](https://github.com/helm/helm/releases/tag/v2.16.10)은 최종 버그픽스 릴리스이며 2.17.0은 [다운로드 위치가 변경](https://github.com/helm/helm/issues/8346)되어 나올 것이다.
<!--more-->
헬름 사용자에게 이는 어떤 의미인가?

_2020년 8월 13일 이후, 다음의 변경 사항이 적용된다:_
- 만약 아직 헬름 v2를 사용중인 경우 지금 [헬름 v3로 마이그레이션](/blog/migrate-from-helm-v2-to-helm-v3/)하는 것이 좋다. 헬름 3.2.4는 널리 사용되고 있으며 운영준비가 되어있다. 대체로 이전 버전과 호환되지만 마이그레이션을 수행할 때 알아야 할 변경사항들이 있다.
- 지금부터, 헬름 v2에 대한 지속적인 지원은 향후 3개월의 보안패치로 제한된다. 즉, 확인된 보안 문제 외에는 더 이상 PR 요청을 수락하지 않는다.
- `stable` 및 `incubator` 저장소는 [2018년 12월에 도입된](/blog/intro-helm-hub/) 헬름 허브에서 삭제된다. [헬름 허브](https://hub.helm.sh)에서 선호하는 저장소를 찾아 구성에 추가하고, [새로운 분산 저장소들로의 마이그레이션을 수행해야](https://github.com/helm/charts/issues/21103) 한다.


_2020년 11월 13일 이후로 다음과 같은 변경사항이 적용된다._
- 더 이상 헬름 v2는 릴리스되지 않는다. (보안 패치조차도)
- 더 이상 [헬름 v2 문서](https://v2.helm.sh/docs)에 대한 업데이트도 없다. 현재로서는 계속 사용될 수도 있지만, 중단될 수도 있다.
- v2와 관련된 기존 및 신규 이슈/PR 은 닫히게 된다.
- [헬름 릴리스와 차트 호스팅에 대한 소유권(ownership)을 CNCF로 이관](https://github.com/helm/community/issues/114).

| | |
| - | - |
| 제거 예정 | 교체 예정 |
| 구글 클라우드 스토리지를 통한 헬름 v2 클라이언트 다운로드 | [get.helm.sh](/blog/get-helm-sh/)을 통한 클라이언트 다운로드 |
| 구글 컨테이너 레지스트리에 저장된 틸러(Tiller)용 도커 이미지 | [대신 다른 위치에서 사용 가능한](https://github.com/helm/helm/issues/8346) 틸러 이미지를 배포하며, helm init --tiller-image 명령어로 업데이트 가능하게 할 것이다. |
| 안정적(stable)인 인큐베이터 차트 저장소를 위한 구글 클라우드 버킷 | “안정적” 인 “인큐베이터” 저장소 사용 중단; https://github.com/helm/charts 는 사용되지 않음(obsolete)으로 표시 |

커뮤니티는 헬름 v3가 훨씬 개선된 환경임을 확인했으며, [helm-2to3 플러그인](https://github.com/helm/helm-2to3)과 같은 커뮤니티 리소스를 사용하여 필수 마이그레이션을 지원할 수 있다. 더 이상 보안 패치가 제공되지 않는 소프트웨어를 운영하게 되는 위험을 피하는 가장 좋은 방법은, 11월 13일 이전에 헬름 v3로의 마이그레이션을 완료하는 것이다.

이 자리를 빌어, 헬름을 사용하거나 개선을 위해 문제를 제기하거나 요청을 제출한 커뮤니티의 모든 분들께 감사드린다. 여러 훌륭한 아이디어들이 헬름에는 맞지 않더라도 [관련 생태계의 프로젝트](https://helm.sh/docs/community/related/)에서 많은 성공을 거두었다. 문서에 대한 업데이트를 제출할 때마다 다른 사용자들이 헬름을 시작하고 더 효과적으로 사용하는 데 도움이 된다. 모두들 감사합니다!
