---
title: Hooks de Chart
description: Descreve como trabalhar com hooks de chart.
sidebar_position: 2
---

O Helm fornece um mecanismo de _hook_ que permite aos desenvolvedores de charts
intervir em certos pontos do ciclo de vida de uma release. Por exemplo, você
pode usar hooks para:

- Carregar um ConfigMap ou Secret durante a instalação antes que qualquer outro
  chart seja carregado.
- Executar um Job para fazer backup de um banco de dados antes de instalar um
  novo chart, e então executar um segundo job após a atualização para restaurar
  os dados.
- Executar um Job antes de deletar uma release para retirar um serviço de
  operação de forma controlada antes de removê-lo.

Os hooks funcionam como templates normais, mas possuem anotações especiais que
fazem com que o Helm os utilize de forma diferente. Nesta seção, abordamos o
padrão básico de uso de hooks.

## Os Hooks Disponíveis

Os seguintes hooks são definidos:

| Valor da Anotação  | Descrição                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `pre-install`      | Executa após os templates serem renderizados, mas antes de qualquer recurso ser criado no Kubernetes  |
| `post-install`     | Executa após todos os recursos serem carregados no Kubernetes                                         |
| `pre-delete`       | Executa em uma requisição de exclusão antes de qualquer recurso ser deletado do Kubernetes            |
| `post-delete`      | Executa em uma requisição de exclusão após todos os recursos da release terem sido deletados          |
| `pre-upgrade`      | Executa em uma requisição de upgrade após os templates serem renderizados, mas antes de qualquer recurso ser atualizado |
| `post-upgrade`     | Executa em uma requisição de upgrade após todos os recursos terem sido atualizados                    |
| `pre-rollback`     | Executa em uma requisição de rollback após os templates serem renderizados, mas antes de qualquer recurso ser revertido |
| `post-rollback`    | Executa em uma requisição de rollback após todos os recursos terem sido modificados                   |
| `test`             | Executa quando o subcomando helm test é invocado ([veja a documentação de testes](/topics/chart_tests.md)) |

_Nota: o hook `crd-install` foi removido em favor do diretório `crds/` no
Helm 3._

## Hooks e o Ciclo de Vida da Release

Hooks permitem que você, o desenvolvedor do chart, tenha a oportunidade de
realizar operações em pontos estratégicos do ciclo de vida de uma release. Por
exemplo, considere o ciclo de vida para um `helm install`. Por padrão, o ciclo
de vida se parece com isto:

1. Usuário executa `helm install foo`
2. A API de instalação da biblioteca Helm é chamada
3. Após alguma verificação, a biblioteca renderiza os templates de `foo`
4. A biblioteca carrega os recursos resultantes no Kubernetes
5. A biblioteca retorna o objeto da release (e outros dados) para o cliente
6. O cliente encerra

O Helm define dois hooks para o ciclo de vida do `install`: `pre-install` e
`post-install`. Se o desenvolvedor do chart `foo` implementar ambos os hooks, o
ciclo de vida é alterado desta forma:

1. Usuário executa `helm install foo`
2. A API de instalação da biblioteca Helm é chamada
3. CRDs no diretório `crds/` são instalados
4. Após alguma verificação, a biblioteca renderiza os templates de `foo`
5. A biblioteca se prepara para executar os hooks `pre-install` (carregando
   recursos de hook no Kubernetes)
6. A biblioteca ordena os hooks por peso (atribuindo um peso de 0 por padrão),
   pelo tipo de recurso e finalmente pelo nome em ordem crescente.
7. A biblioteca então carrega o hook com o menor peso primeiro (negativo para
   positivo)
8. A biblioteca espera até que o hook esteja "Pronto" (exceto para CRDs)
9. A biblioteca carrega os recursos resultantes no Kubernetes. Note que se a
   flag `--wait` estiver definida, a biblioteca esperará até que todos os
   recursos estejam em estado pronto e não executará o hook `post-install` até
   que estejam prontos.
10. A biblioteca executa o hook `post-install` (carregando recursos de hook)
11. A biblioteca espera até que o hook esteja "Pronto"
12. A biblioteca retorna o objeto da release (e outros dados) para o cliente
13. O cliente encerra

O que significa esperar até que um hook esteja pronto? Isso depende do recurso
declarado no hook. Se o recurso for do tipo `Job` ou `Pod`, o Helm esperará até
que ele seja executado com sucesso até a conclusão. E se o hook falhar, a
release falhará. Esta é uma _operação bloqueante_, então o cliente Helm pausará
enquanto o Job é executado.

Para todos os outros tipos, assim que o Kubernetes marcar o recurso como
carregado (adicionado ou atualizado), o recurso é considerado "Pronto". Quando
muitos recursos são declarados em um hook, os recursos são executados em série.
Se eles tiverem pesos de hook (veja abaixo), são executados em ordem de peso.
A partir do Helm 3.2.0, recursos de hook com o mesmo peso são instalados na
mesma ordem que os recursos normais não-hook. Caso contrário, a ordenação não é
garantida. (No Helm 2.3.0 e posteriores, eles são ordenados alfabeticamente.
Esse comportamento, no entanto, não é considerado vinculante e pode mudar no
futuro.) É considerado boa prática adicionar um peso de hook, e definí-lo como
`0` se o peso não for importante.

### Recursos de hook não são gerenciados com as releases correspondentes

Os recursos que um hook cria atualmente não são rastreados ou gerenciados como
parte da release. Assim que o Helm verificar que o hook atingiu seu estado
pronto, ele deixará o recurso de hook intocado. A coleta de lixo de recursos de
hook quando a release correspondente é deletada pode ser adicionada ao Helm 3 no
futuro, portanto qualquer recurso de hook que nunca deve ser deletado deve ser
anotado com `helm.sh/resource-policy: keep`.

Na prática, isso significa que se você criar recursos em um hook, você não pode
depender do `helm uninstall` para remover os recursos. Para destruir tais
recursos, você precisa ou [adicionar uma anotação personalizada
`helm.sh/hook-delete-policy`](#hook-deletion-policies) ao arquivo de template do
hook, ou [definir o campo time to live (TTL) de um recurso
Job](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/).

## Escrevendo um Hook

Os hooks são simplesmente arquivos de manifesto Kubernetes com anotações
especiais na seção `metadata`. Como são arquivos de template, você pode usar
todos os recursos normais de template, incluindo ler `.Values`, `.Release` e
`.Template`.

Por exemplo, este template, armazenado em `templates/post-install-job.yaml`,
declara um job para ser executado em `post-install`:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}"
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
    app.kubernetes.io/instance: {{ .Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  annotations:
    # This is what defines this resource as a hook. Without this line, the
    # job is considered part of the release.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{ .Release.Name }}"
      labels:
        app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
        app.kubernetes.io/instance: {{ .Release.Name | quote }}
        helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{ default "10" .Values.sleepyTime }}"]

```

O que faz este template um hook é a anotação:

```yaml
annotations:
  "helm.sh/hook": post-install
```

Um recurso pode implementar múltiplos hooks:

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

Da mesma forma, não há limite para o número de recursos diferentes que podem
implementar um dado hook. Por exemplo, pode-se declarar tanto um secret quanto
um config map como um hook pre-install.

Quando subcharts declaram hooks, esses também são avaliados. Não há como um
chart de nível superior desabilitar os hooks declarados por subcharts.

É possível definir um peso para um hook que ajudará a construir uma ordem de
execução determinística. Pesos são definidos usando a seguinte anotação:

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

Pesos de hook podem ser números positivos ou negativos, mas devem ser
representados como strings. Quando o Helm inicia o ciclo de execução de hooks de
um tipo particular, ele ordenará esses hooks em ordem crescente.

### Políticas de exclusão de hook

É possível definir políticas que determinam quando deletar os recursos de hook
correspondentes. Políticas de exclusão de hook são definidas usando a seguinte
anotação:

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

Você pode escolher um ou mais valores de anotação definidos:

| Valor da Anotação      | Descrição                                                                |
| ---------------------- | ------------------------------------------------------------------------ |
| `before-hook-creation` | Deleta o recurso anterior antes que um novo hook seja lançado (padrão)   |
| `hook-succeeded`       | Deleta o recurso após o hook ser executado com sucesso                   |
| `hook-failed`          | Deleta o recurso se o hook falhou durante a execução                     |

Se nenhuma anotação de política de exclusão de hook for especificada, o
comportamento `before-hook-creation` é aplicado por padrão.
