---
title: "다음 단계"
description: "마무리 - 도움이 되는 다른 유용한 문서들"
weight: 14
---

본 가이드는 차트 개발자에게 헬름의 템플릿 언어를 사용하는 방법을 깊이 이해시키기 위한 것이다.
템플릿 개발의 기술적 관점이 중심이 된다.

그러나 이 가이드에서도 실제 차트 개발에 필요한 많은 것들을 모두 다루지는 못했다.
새로운 차트를 작성할 때 도움이 되는 다른 유용한 문서들은 다음과 같다.

- [Helm Charts project](https://github.com/helm/charts) is an indispensable source of charts. That project is also sets the standard for best practices in chart development.
- The Kubernetes [Documentation](https://kubernetes.io/docs/home/) provides detailed examples of the various resource kinds that you can use, from ConfigMaps and Secrets to DaemonSets and Deployments.
- The Helm [Charts Guide]({{< ref path="../topics/charts" lang="en" >}}) explains the workflow of using charts.
- The Helm [Chart Hooks Guide]({{< ref path="../topics/charts_hooks/" lang="en" >}}) explains how to create lifecycle hooks.
- The Helm [Charts Tips and Tricks]({{< ref path="../howto/charts_tips_and_tricks" lang="en" >}}) article provides some useful tips for writing charts.
- The [Sprig documentation](https://github.com/Masterminds/sprig) documents more than sixty of the template functions.
- The [Go template docs](https://godoc.org/text/template) explain the template syntax in detail.
- The [Schelm tool](https://github.com/databus23/schelm) is a nice helper utility for debugging charts.

Sometimes it's easier to ask a few questions and get answers from experienced developers. The best place to do this is in the [Kubernetes Slack](https://kubernetes.slack.com) Helm channels:

- [#helm-users](https://kubernetes.slack.com/messages/helm-users)
- [#helm-dev](https://kubernetes.slack.com/messages/helm-dev)
- [#charts](https://kubernetes.slack.com/messages/charts)

마지막으로, 이 문서에서 오류나 누락을 찾았거나,
새로운 컨텐츠를 제안하거나 기여하고자 한다면, [헬름 프로젝트](https://github.com/helm/helm-www)를 방문하자.
