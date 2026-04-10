---
title: 다음 단계
description: 마무리 - 도움이 되는 다른 유용한 문서들
sidebar_position: 14
---

본 가이드는 차트 개발자에게 Helm의 템플릿 언어를 사용하는 방법을 깊이 이해시키기 위한 것이다.
템플릿 개발의 기술적 관점이 중심이 된다.

그러나 이 가이드에서도 실제 차트 개발에 필요한 많은 것들을 모두 다루지는 못했다.
새로운 차트를 작성할 때 도움이 되는 다른 유용한 문서들은 다음과 같다.

- CNCF [Artifact Hub](https://artifacthub.io/packages/search?kind=0)는
  차트를 찾는 데 없어서는 안 될 소스이다.
- Kubernetes [문서](https://kubernetes.io/docs/home/)에서는
  ConfigMap과 Secret부터 DaemonSet과 Deployment까지, 
  사용할 수 있는 다양한 리소스의 자세한 예시를 제공한다.
- Helm [차트 가이드](/topics/charts.md)에서는 
  차트 사용 워크플로우를 설명한다.
- Helm [차트 훅 가이드](/topics/charts_hooks.md)에서는 
  라이프사이클 훅을 만드는 방법을 설명한다.
- Helm [차트 팁과 트릭](/howto/charts_tips_and_tricks.md) 문서에서는 
  차트 작성에 유용한 팁을 제공한다.
- [Sprig 문서](https://github.com/Masterminds/sprig)에는 
  60개 이상의 템플릿 함수가 문서화되어 있다.
- [Go 템플릿 문서](https://godoc.org/text/template)에서는 
  템플릿 문법을 자세히 설명한다.
- [Schelm 도구](https://github.com/databus23/schelm)는 
  차트 디버깅에 유용한 헬퍼 유틸리티이다.

때로는 질문을 하고 경험 많은 개발자에게 답을 얻는 것이 더 쉬울 수 있다.
가장 좋은 곳은 [Kubernetes Slack](https://kubernetes.slack.com)의 Helm 채널들이다:

- [#helm-users](https://kubernetes.slack.com/messages/helm-users)
- [#helm-dev](https://kubernetes.slack.com/messages/helm-dev)
- [#charts](https://kubernetes.slack.com/messages/charts)

마지막으로, 이 문서에서 오류나 누락을 찾았거나,
새로운 컨텐츠를 제안하거나 기여하고자 한다면, 
[Helm 프로젝트](https://github.com/helm/helm-www)를 방문하자.
