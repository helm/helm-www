---
title: Criando um Arquivo NOTES.txt
description: Como fornecer instruções para os usuários do seu Chart.
sidebar_position: 10
---

Nesta seção vamos ver a ferramenta do Helm para fornecer instruções aos usuários
do seu chart. No final de um `helm install` ou `helm upgrade`, o Helm pode
exibir um bloco de informações úteis para os usuários. Essas informações podem
ser personalizadas usando templates.

Para adicionar notas de instalação ao seu chart, basta criar um arquivo
`templates/NOTES.txt`. Este arquivo é texto simples, mas é processado como um
template e tem todas as funções e objetos de template disponíveis.

Vamos criar um arquivo `NOTES.txt` simples:

```
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

  $ helm status {{ .Release.Name }}
  $ helm get all {{ .Release.Name }}

```

Agora, se executarmos `helm install rude-cardinal ./mychart`, veremos esta
mensagem no final:

```
RESOURCES:
==> v1/Secret
NAME                   TYPE      DATA      AGE
rude-cardinal-secret   Opaque    1         0s

==> v1/ConfigMap
NAME                      DATA      AGE
rude-cardinal-configmap   3         0s


NOTES:
Thank you for installing mychart.

Your release is named rude-cardinal.

To learn more about the release, try:

  $ helm status rude-cardinal
  $ helm get all rude-cardinal
```

Usar o `NOTES.txt` dessa forma é uma ótima maneira de fornecer aos seus usuários
informações detalhadas sobre como utilizar o chart recém-instalado. A criação de
um arquivo `NOTES.txt` é fortemente recomendada, embora não obrigatória.
