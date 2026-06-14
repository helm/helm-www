---
title: Labels e Annotations
description: Aborda as boas práticas para o uso de labels e annotations no seu chart.
sidebar_position: 5
---

Esta parte do guia de boas práticas discute o uso de labels e annotations no
seu chart.

## É uma Label ou uma Annotation?

Um item de metadados deve ser uma label nas seguintes condições:

- É usado pelo Kubernetes para identificar este recurso
- É útil expor aos operadores para fins de consulta ao sistema.

Por exemplo, sugerimos usar `helm.sh/chart: NAME-VERSION` como uma label para
que os operadores possam encontrar convenientemente todas as instâncias de um
chart específico.

Se um item de metadados não for usado para consultas, deve ser definido como
uma annotation.

Hooks do Helm são sempre annotations.

## Labels Padrão

A tabela a seguir define labels comuns que os charts do Helm usam. O próprio
Helm nunca exige que uma label específica esteja presente. Labels marcadas como
REC são recomendadas e _devem_ ser incluídas em um chart para consistência
global. As marcadas como OPT são opcionais. Estas são idiomáticas ou comumente
usadas, mas não são frequentemente utilizadas para fins operacionais.

| Nome | Status | Descrição |
|------|--------|-----------|
| `app.kubernetes.io/name` | REC | Deve ser o nome da aplicação, refletindo a aplicação como um todo. Geralmente usa-se `{{ template "name" . }}` para isso. É usado por muitos manifestos Kubernetes e não é específico do Helm. |
| `helm.sh/chart` | REC | Deve ser o nome e a versão do chart: `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`. |
| `app.kubernetes.io/managed-by` | REC | Deve sempre ser definido como `{{ .Release.Service }}`. Serve para encontrar tudo que é gerenciado pelo Helm. |
| `app.kubernetes.io/instance` | REC | Deve ser o `{{ .Release.Name }}`. Ajuda a diferenciar entre diferentes instâncias da mesma aplicação. |
| `app.kubernetes.io/version` | OPT | A versão da aplicação, podendo ser definida como `{{ .Chart.AppVersion }}`. |
| `app.kubernetes.io/component` | OPT | Uma label comum para marcar os diferentes papéis que os componentes podem ter em uma aplicação. Por exemplo, `app.kubernetes.io/component: frontend`. |
| `app.kubernetes.io/part-of` | OPT | Quando múltiplos charts ou componentes de software são usados juntos para criar uma aplicação. Por exemplo, software de aplicação e um banco de dados para produzir um website. Pode ser definido como a aplicação principal que está sendo suportada. |

Você pode encontrar mais informações sobre as labels do Kubernetes, prefixadas
com `app.kubernetes.io`, na [documentação do
Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/).
