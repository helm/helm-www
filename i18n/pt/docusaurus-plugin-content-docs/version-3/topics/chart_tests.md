---
title: Testes de Chart
description: Descreve como executar e testar seus charts.
sidebar_position: 3
---

Um chart contém vários recursos e componentes do Kubernetes que funcionam
juntos. Como autor de um chart, você pode querer escrever alguns testes que
validem que seu chart funciona conforme esperado quando é instalado. Esses
testes também ajudam o consumidor do chart a entender o que seu chart deve
fazer.

Um **teste** em um chart Helm fica no diretório `templates/` e é uma definição
de job que especifica um container com um comando dado para executar. O
container deve sair com sucesso (exit 0) para que o teste seja considerado
bem-sucedido. A definição do job deve conter a anotação de hook de teste do
Helm: `helm.sh/hook: test`.

Note que até o Helm v3, a definição do job precisava conter uma dessas
anotações de hook de teste do Helm: `helm.sh/hook: test-success` ou
`helm.sh/hook: test-failure`. `helm.sh/hook: test-success` ainda é aceita como
uma alternativa para compatibilidade com versões anteriores de
`helm.sh/hook: test`.

Exemplos de testes:

- Validar que sua configuração do arquivo values.yaml foi injetada corretamente.
  - Certificar-se de que seu nome de usuário e senha funcionam corretamente
  - Certificar-se de que um nome de usuário e senha incorretos não funcionam
- Verificar que seus serviços estão ativos e fazendo balanceamento de carga
  corretamente
- etc.

Você pode executar os testes pré-definidos no Helm em uma release usando o
comando `helm test <RELEASE_NAME>`. Para um consumidor de chart, esta é uma
ótima maneira de verificar que a release de um chart (ou aplicação) funciona
conforme esperado.

## Exemplo de Teste

O comando [helm create](/helm/helm_create.md) criará automaticamente várias
pastas e arquivos. Para experimentar a funcionalidade de teste do Helm,
primeiro crie um chart Helm de demonstração.

```console
$ helm create demo
```

Agora você poderá ver a seguinte estrutura no seu chart Helm de demonstração.

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

Em `demo/templates/tests/test-connection.yaml` você verá um teste que pode
experimentar. Você pode ver a definição do pod de teste do Helm aqui:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "demo.fullname" . }}-test-connection"
  labels:
    {{- include "demo.labels" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "demo.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never

```

## Passos para Executar uma Suíte de Testes em uma Release

Primeiro, instale o chart no seu cluster para criar uma release. Você pode
precisar esperar que todos os pods fiquem ativos; se você testar imediatamente
após esta instalação, é provável que ocorra uma falha transitória, e você vai
querer testar novamente.

```console
$ helm install demo demo --namespace default
$ helm test demo
NAME: demo
LAST DEPLOYED: Mon Feb 14 20:03:16 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     demo-test-connection
Last Started:   Mon Feb 14 20:35:19 2022
Last Completed: Mon Feb 14 20:35:23 2022
Phase:          Succeeded
[...]
```

## Notas

- Você pode definir quantos testes quiser em um único arquivo yaml ou
  distribuí-los em vários arquivos yaml no diretório `templates/`.
- Você pode aninhar sua suíte de testes em um diretório `tests/` como
  `<chart-name>/templates/tests/` para maior isolamento.
- Um teste é um [hook do Helm](/topics/charts_hooks.md), então anotações como
  `helm.sh/hook-weight` e `helm.sh/hook-delete-policy` podem ser usadas com
  recursos de teste.
