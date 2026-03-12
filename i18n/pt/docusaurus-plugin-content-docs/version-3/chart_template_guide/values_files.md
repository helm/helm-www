---
title: Arquivos de Values
description: Instruções sobre como utilizar a flag --values.
sidebar_position: 4
---

Na seção anterior, vimos os objetos embutidos que os templates do Helm oferecem.
Um dos objetos embutidos é `Values`. Este objeto fornece acesso aos valores
passados para o chart. Seu conteúdo pode vir de múltiplas fontes:

- O arquivo `values.yaml` no chart
- Se este for um subchart, o arquivo `values.yaml` de um chart pai
- Um arquivo de values passado ao `helm install` ou `helm upgrade` com a flag `-f`
  (`helm install -f myvals.yaml ./mychart`)
- Parâmetros individuais passados com `--set` (como `helm install --set foo=bar
  ./mychart`)

A lista acima está em ordem de especificidade: `values.yaml` é o padrão, que pode
ser sobrescrito pelo `values.yaml` de um chart pai, que por sua vez pode ser
sobrescrito por um arquivo de values fornecido pelo usuário, que por sua vez pode
ser sobrescrito por parâmetros `--set`.

Arquivos de values são arquivos YAML simples. Vamos editar `mychart/values.yaml`
e depois editar nosso template de ConfigMap.

Removendo os valores padrão em `values.yaml`, vamos definir apenas um parâmetro:

```yaml
favoriteDrink: coffee
```

Agora podemos usar isso dentro de um template:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

Observe que na última linha acessamos `favoriteDrink` como um atributo de `Values`:
`{{ .Values.favoriteDrink }}`.

Vamos ver como isso é renderizado.

```console
$ helm install geared-marsupi ./mychart --dry-run --debug
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: geared-marsupi
LAST DEPLOYED: Wed Feb 19 23:21:13 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
favoriteDrink: coffee

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: geared-marsupi-configmap
data:
  myvalue: "Hello World"
  drink: coffee
```

Como `favoriteDrink` está definido no arquivo `values.yaml` padrão como `coffee`,
esse é o valor exibido no template. Podemos facilmente sobrescrever isso
adicionando a flag `--set` na nossa chamada ao `helm install`:

```console
$ helm install solid-vulture ./mychart --dry-run --debug --set favoriteDrink=slurm
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: solid-vulture
LAST DEPLOYED: Wed Feb 19 23:25:54 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
favoriteDrink: slurm

COMPUTED VALUES:
favoriteDrink: slurm

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: solid-vulture-configmap
data:
  myvalue: "Hello World"
  drink: slurm
```

Como `--set` tem maior precedência que o arquivo `values.yaml` padrão, nosso
template gera `drink: slurm`.

Arquivos de values também podem conter conteúdo mais estruturado. Por exemplo, podemos
criar uma seção `favorite` no nosso arquivo `values.yaml` e adicionar várias chaves
nela:

```yaml
favorite:
  drink: coffee
  food: pizza
```

Agora precisamos modificar ligeiramente o template:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink }}
  food: {{ .Values.favorite.food }}
```

Embora seja possível estruturar dados dessa forma, a recomendação é manter suas
árvores de values rasas, favorecendo a simplicidade. Quando vermos como atribuir
values a subcharts, entenderemos como os values são nomeados usando uma estrutura
de árvore.

## Excluindo uma chave padrão

Se você precisar excluir uma chave dos values padrão, pode sobrescrever o valor
da chave para `null`, e nesse caso o Helm removerá a chave da mesclagem de
values sobrescritos.

Por exemplo, o chart stable do Drupal permite configurar o liveness probe, caso
você configure uma imagem personalizada. Aqui estão os values padrão:
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

Se você tentar sobrescrever o handler do livenessProbe para `exec` em vez de `httpGet`
usando `--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]`, o Helm irá
mesclar as chaves padrão e sobrescritas, resultando no seguinte YAML:
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  exec:
    command:
    - cat
    - docroot/CHANGELOG.txt
  initialDelaySeconds: 120
```

No entanto, o Kubernetes falharia porque não é possível declarar mais de um
handler de livenessProbe. Para contornar isso, você pode instruir o Helm a excluir
o `livenessProbe.httpGet` definindo-o como null:
```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

Neste ponto, já vimos vários objetos embutidos e os utilizamos para injetar
informações em um template. Agora vamos analisar outro aspecto do motor de
templates: funções e pipelines.
