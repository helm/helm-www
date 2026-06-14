---
title: Próximos Passos
description: Finalizando - alguns apontamentos úteis para outras documentações que irão ajudá-lo.
sidebar_position: 14
---

Este guia tem o objetivo de fornecer a você, desenvolvedor de charts, uma compreensão
sólida de como utilizar a linguagem de templates do Helm. O guia foca nos aspectos
técnicos do desenvolvimento de templates.

Mas há muitas coisas que este guia não cobriu quando se trata do desenvolvimento
prático do dia a dia de charts. Aqui estão alguns apontamentos úteis para outras
documentações que irão ajudá-lo na criação de novos charts:

- O [Artifact Hub](https://artifacthub.io/packages/search?kind=0) da CNCF é uma
  fonte indispensável de charts.
- A [Documentação](https://kubernetes.io/docs/home/) do Kubernetes fornece
  exemplos detalhados dos diversos tipos de recursos que você pode utilizar, desde
  ConfigMaps e Secrets até DaemonSets e Deployments.
- O [Guia de Charts](/topics/charts.md) do Helm explica o fluxo de trabalho com
  charts.
- O [Guia de Hooks de Charts](/topics/charts_hooks.md) do Helm explica como
  criar lifecycle hooks.
- O artigo [Dicas e Truques para Charts](/howto/charts_tips_and_tricks.md) do Helm
  fornece algumas dicas úteis para escrever charts.
- A [documentação do Sprig](https://github.com/Masterminds/sprig) documenta mais
  de sessenta funções de template.
- A [documentação de templates Go](https://godoc.org/text/template) explica a
  sintaxe de templates em detalhes.
- A [ferramenta Schelm](https://github.com/databus23/schelm) é um utilitário
  auxiliar útil para depuração de charts.

Às vezes é mais fácil fazer algumas perguntas e obter respostas de desenvolvedores
experientes. O melhor lugar para isso é nos canais do Helm no [Slack do
Kubernetes](https://kubernetes.slack.com):

- [#helm-users](https://kubernetes.slack.com/messages/helm-users)
- [#helm-dev](https://kubernetes.slack.com/messages/helm-dev)
- [#charts](https://kubernetes.slack.com/messages/charts)

Por fim, se você encontrar erros ou omissões neste documento, quiser sugerir algum
novo conteúdo, ou gostaria de contribuir, visite o [Projeto
Helm](https://github.com/helm/helm-www).
