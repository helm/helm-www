---
title: Utilizando o Helm
description: Explica os fundamentos do Helm.
sidebar_position: 3
---

Esse guia explica os fundamentos da utilização do Helm para gerenciar pacotes
em seu cluster Kubernetes. Ele assume que você já [instalou](/intro/install.md) o cliente Helm.

Se você está simplesmente interessado em executar alguns comandos rápidos, talvez
prefira começar pelo [Guia de Início Rápido](/intro/quickstart.md). Este capítulo
aborda os detalhes dos comandos do Helm e explica como utilizá-lo.

## Três Grandes Conceitos

Um *Chart* é um pacote do Helm. Ele contém todas as definições de recursos
necessárias para executar uma aplicação, ferramenta ou serviço dentro de um cluster
Kubernetes. Pense nele como o equivalente do Kubernetes a uma fórmula do Homebrew,
um pacote dpkg do Apt ou um arquivo RPM do Yum.

Um *Repositório* é o lugar onde os Charts podem ser coletados e compartilhados. É como
o [arquivo CPAN](https://www.cpan.org) do Perl ou o [Banco de Dados de Pacotes do
Fedora](https://src.fedoraproject.org/), mas para pacotes Kubernetes.

Uma *Release* é uma instância de um Chart em execução em um cluster Kubernetes. Um Chart
frequentemente pode ser instalado várias vezes no mesmo cluster. E cada vez que é
instalado, uma nova _release_ é criada. Considere um Chart MySQL. Se você quer dois
bancos de dados em execução em seu cluster, você pode instalar esse Chart duas vezes.
Cada um terá sua própria _release_, que por sua vez terá seu próprio _release name_.

Com esses conceitos em mente, podemos explicar o Helm da seguinte forma:

O Helm instala _charts_ no Kubernetes, criando uma nova _release_ para cada
instalação. E para encontrar novos Charts, você pode pesquisar em _repositórios_ de Charts do Helm.

## 'helm search': Encontrando Charts

O Helm vem com um poderoso comando de pesquisa. Ele pode ser utilizado para pesquisar dois
tipos diferentes de fontes:

- `helm search hub` pesquisa no [Artifact Hub](https://artifacthub.io), que
  lista Charts do Helm de dezenas de repositórios diferentes.
- `helm search repo` pesquisa nos repositórios que você adicionou ao seu cliente
  Helm local (com `helm repo add`). Essa pesquisa é feita sobre dados locais, e
  nenhuma conexão de rede pública é necessária.

Você pode encontrar Charts disponíveis publicamente executando `helm search hub`:

```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      A Helm chart for deploying a WordPress site on ...
```

O comando acima pesquisa todos os Charts de `wordpress` no Artifact Hub.

Sem nenhum filtro, `helm search hub` mostra todos os Charts disponíveis.

`helm search hub` expõe a URL para a localização no [artifacthub.io](https://artifacthub.io/), mas não o repositório Helm real. `helm search hub --list-repo-url` expõe a URL real do repositório Helm, o que é útil quando você deseja adicionar um novo repositório: `helm repo add [NAME] [URL]`.

Usando `helm search repo`, você pode encontrar os nomes dos Charts nos repositórios
que você já adicionou:

```console
$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                          CHART VERSION APP VERSION DESCRIPTION
brigade/brigade               1.3.2         v1.2.1      Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app    0.4.1         v0.2.1      The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth  0.2.0         v0.20.0     The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway   0.1.0                     A Helm chart for Kubernetes
brigade/brigade-project       1.0.0         v1.0.0      Create a Brigade project
brigade/kashti                0.4.0         v0.4.0      A Helm chart for Kubernetes
```

A pesquisa do Helm usa um algoritmo de correspondência aproximada de strings, então você pode digitar partes
de palavras ou frases:

```console
$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes
```

A pesquisa é uma boa maneira de encontrar pacotes disponíveis. Depois de encontrar um pacote
que deseja instalar, você pode usar `helm install` para instalá-lo.

## 'helm install': Instalando um Pacote

Para instalar um novo pacote, use o comando `helm install`. Na sua forma mais simples, ele
recebe dois argumentos: um nome de release que você escolhe e o nome do Chart que
deseja instalar.

```console
$ helm install happy-panda bitnami/wordpress
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Agora o Chart `wordpress` está instalado. Note que instalar um Chart cria um
novo objeto de _release_. A release acima é chamada `happy-panda`. (Se você quiser
que o Helm gere um nome para você, omita o nome da release e use
`--generate-name`.)

Durante a instalação, o cliente `helm` imprimirá informações úteis sobre quais
recursos foram criados, qual é o estado da release, e também se há
etapas adicionais de configuração que você pode ou deve executar.

O Helm instala os recursos na seguinte ordem:

- Namespace
- NetworkPolicy
- ResourceQuota
- LimitRange
- PodSecurityPolicy
- PodDisruptionBudget
- ServiceAccount
- Secret
- SecretList
- ConfigMap
- StorageClass
- PersistentVolume
- PersistentVolumeClaim
- CustomResourceDefinition
- ClusterRole
- ClusterRoleList
- ClusterRoleBinding
- ClusterRoleBindingList
- Role
- RoleList
- RoleBinding
- RoleBindingList
- Service
- DaemonSet
- Pod
- ReplicationController
- ReplicaSet
- Deployment
- HorizontalPodAutoscaler
- StatefulSet
- Job
- CronJob
- Ingress
- APIService
- MutatingWebhookConfiguration
- ValidatingWebhookConfiguration

O Helm não espera até que todos os recursos estejam em execução antes de finalizar. Muitos
Charts requerem imagens Docker com mais de 600MB de tamanho e podem levar muito
tempo para serem instalados no cluster.

Para acompanhar o estado de uma release ou reler informações de configuração, você
pode usar `helm status`:

```console
$ helm status happy-panda
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

O comando acima mostra o estado atual da sua release.

### Personalizando o Chart Antes de Instalar

A instalação da forma que fizemos aqui usará apenas as opções de configuração padrão
para este Chart. Muitas vezes, você vai querer personalizar o Chart para usar sua
configuração preferida.

Para ver quais opções são configuráveis em um Chart, use `helm show values`:

```console
$ helm show values bitnami/wordpress
## Global Docker image parameters
## Please, note that this will override the image parameters, including dependencies, configured to use the global value
## Current available global Docker image parameters: imageRegistry and imagePullSecrets
##
# global:
#   imageRegistry: myRegistryName
#   imagePullSecrets:
#     - myRegistryKeySecretName
#   storageClass: myStorageClass

## Bitnami WordPress image version
## ref: https://hub.docker.com/r/bitnami/wordpress/tags/
##
image:
  registry: docker.io
  repository: bitnami/wordpress
  tag: 5.6.0-debian-10-r35
  [..]
```

Você pode então sobrescrever qualquer uma dessas configurações em um arquivo formatado em YAML e
passá-lo durante a instalação.

```console
$ echo '{mariadb.auth.database: user0db, mariadb.auth.username: user0}' > values.yaml
$ helm install -f values.yaml bitnami/wordpress --generate-name
```

O comando acima criará um usuário MariaDB padrão com o nome `user0` e concederá
a esse usuário acesso a um banco de dados `user0db` recém-criado, mas aceitará todos os
outros padrões desse Chart.

Existem duas formas de passar dados de configuração durante a instalação:

- `--values` (ou `-f`): Especifica um arquivo YAML com sobrescritas. Isso pode ser
  especificado várias vezes, e o arquivo mais à direita terá precedência
- `--set`: Especifica sobrescritas na linha de comando.

Se ambos forem usados, os valores de `--set` são mesclados em `--values` com maior
precedência. As sobrescritas especificadas com `--set` são persistidas em um Secret.
Valores que foram definidos com `--set` podem ser visualizados para uma release específica com `helm get
values <release-name>`. Valores que foram definidos com `--set` podem ser limpos executando
`helm upgrade` com `--reset-values` especificado.

#### Formato e Limitações do `--set`

A opção `--set` recebe zero ou mais pares de nome/valor. Na sua forma mais simples, é
usada assim: `--set name=value`. O equivalente em YAML seria:

```yaml
name: value
```

Múltiplos valores são separados por vírgulas. Então `--set a=b,c=d` se torna:

```yaml
a: b
c: d
```

Expressões mais complexas são suportadas. Por exemplo, `--set outer.inner=value`
é traduzido para:
```yaml
outer:
  inner: value
```

Listas podem ser expressas envolvendo valores em `{` e `}`. Por exemplo, `--set
name={a, b, c}` se traduz em:

```yaml
name:
  - a
  - b
  - c
```

Certos nomes/chaves podem ser definidos como `null` ou como um array vazio `[]`. Por exemplo, `--set name=[],a=null` transforma

```yaml
name:
  - a
  - b
  - c
a: b
```

em

```yaml
name: []
a: null
```

A partir do Helm 2.5.0, é possível acessar itens de lista usando uma sintaxe de índice
de array. Por exemplo, `--set servers[0].port=80` se torna:

```yaml
servers:
  - port: 80
```

Múltiplos valores podem ser definidos dessa forma. A linha `--set
servers[0].port=80,servers[0].host=example` se torna:

```yaml
servers:
  - port: 80
    host: example
```

Às vezes você precisa usar caracteres especiais nas suas linhas `--set`. Você pode usar
uma barra invertida para escapar os caracteres; `--set name=value1\,value2` se tornará:

```yaml
name: "value1,value2"
```

Da mesma forma, você pode escapar sequências de pontos, o que pode ser útil quando
os Charts usam a função `toYaml` para analisar annotations, labels e node
selectors. A sintaxe de `--set nodeSelector."kubernetes\.io/role"=master`
se torna:

```yaml
nodeSelector:
  kubernetes.io/role: master
```

Estruturas de dados muito aninhadas podem ser difíceis de expressar usando `--set`. Recomenda-se
que os desenvolvedores de Charts considerem o uso de `--set` ao projetar o formato
de um arquivo `values.yaml` (consulte [Arquivos de Values](/chart_template_guide/values_files.md)).

### Mais Métodos de Instalação

O comando `helm install` pode instalar a partir de várias fontes:

- Um repositório de Charts (como vimos acima)
- Um arquivo de Chart local (`helm install foo foo-0.1.1.tgz`)
- Um diretório de Chart descompactado (`helm install foo path/to/foo`)
- Uma URL completa (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' e 'helm rollback': Atualizando uma Release e Revertendo em Caso de Falha

Quando uma nova versão de um Chart é lançada, ou quando você quer alterar a
configuração da sua release, você pode usar o comando `helm upgrade`.

Um upgrade pega uma release existente e a atualiza de acordo com as
informações que você fornece. Como os Charts do Kubernetes podem ser grandes e complexos,
o Helm tenta realizar o upgrade menos invasivo possível. Ele atualizará apenas o que
mudou desde a última release.

```console
$ helm upgrade -f panda.yaml happy-panda bitnami/wordpress
```

No caso acima, a release `happy-panda` é atualizada com o mesmo Chart,
mas com um novo arquivo YAML:

```yaml
mariadb.auth.username: user1
```

Podemos usar `helm get values` para ver se essa nova configuração foi aplicada.

```console
$ helm get values happy-panda
mariadb:
  auth:
    username: user1
```

O comando `helm get` é uma ferramenta útil para examinar uma release no cluster.
E como podemos ver acima, ele mostra que nossos novos valores de `panda.yaml` foram
aplicados no cluster.

Agora, se algo não sair como planejado durante uma release, é fácil reverter
para uma release anterior usando `helm rollback [RELEASE] [REVISION]`.

```console
$ helm rollback happy-panda 1
```

O comando acima reverte nossa happy-panda para sua primeira versão de release. Uma
versão de release é uma revisão incremental. Cada vez que uma instalação, upgrade ou
rollback acontece, o número de revisão é incrementado em 1. O primeiro número de revisão
é sempre 1. E podemos usar `helm history [RELEASE]` para ver os números de revisão
de uma release específica.

## Opções Úteis para Install/Upgrade/Rollback

Existem várias outras opções úteis que você pode especificar para personalizar o
comportamento do Helm durante uma instalação/upgrade/rollback. Por favor, note que esta não é
uma lista completa de flags do CLI. Para ver uma descrição de todas as flags, execute `helm
<command> --help`.

- `--timeout`: Um valor de [duração Go](https://golang.org/pkg/time/#ParseDuration)
  para esperar a conclusão dos comandos do Kubernetes. O padrão é `5m0s`.
- `--wait`: Aguarda até que todos os Pods estejam em estado pronto, PVCs estejam vinculados,
  Deployments tenham o mínimo (`Desired` menos `maxUnavailable`) de Pods em estado
  pronto e Services tenham um endereço IP (e Ingress se for um `LoadBalancer`) antes
  de marcar a release como bem-sucedida. Aguardará pelo tempo definido em `--timeout`.
  Se o timeout for atingido, a release será marcada como `FAILED`. Nota: Em
  cenários onde o Deployment tem `replicas` definido como 1 e `maxUnavailable` não está
  definido como 0 como parte da estratégia de rolling update, `--wait` retornará como pronto assim
  que satisfizer a condição mínima de Pod pronto.
- `--no-hooks`: Pula a execução dos hooks para o comando
- `--recreate-pods` (disponível apenas para `upgrade` e `rollback`): Esta flag
  fará com que todos os pods sejam recriados (com exceção de pods pertencentes a
  deployments). (DESCONTINUADO no Helm 3)

## 'helm uninstall': Desinstalando uma Release

Quando chegar a hora de desinstalar uma release do cluster, use o comando `helm
uninstall`:

```console
$ helm uninstall happy-panda
```

Isso removerá a release do cluster. Você pode ver todas as suas releases
atualmente implantadas com o comando `helm list`:

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

Na saída acima, podemos ver que a release `happy-panda` foi
desinstalada.

Em versões anteriores do Helm, quando uma release era excluída, um registro de sua
exclusão permanecia. No Helm 3, a exclusão remove o registro da release também.
Se você deseja manter um registro de exclusão da release, use `helm uninstall
--keep-history`. Usando `helm list --uninstalled` mostrará apenas as releases que
foram desinstaladas com a flag `--keep-history`.

A flag `helm list --all` mostrará todos os registros de release que o Helm manteve,
incluindo registros de itens com falha ou excluídos (se `--keep-history` foi
especificado):

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     wordpress-10.4.5.6.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

Note que, como as releases agora são excluídas por padrão, não é mais possível
reverter um recurso desinstalado.

## 'helm repo': Trabalhando com Repositórios

O Helm 3 não vem mais com um repositório de Charts padrão. O grupo de comandos `helm repo`
fornece comandos para adicionar, listar e remover repositórios.

Você pode ver quais repositórios estão configurados usando `helm repo list`:

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

E novos repositórios podem ser adicionados com `helm repo add [NAME] [URL]`:

```console
$ helm repo add dev https://example.com/dev-charts
```

Como os repositórios de Charts mudam frequentemente, a qualquer momento você pode garantir
que seu cliente Helm esteja atualizado executando `helm repo update`.

Repositórios podem ser removidos com `helm repo remove`.

## Criando Seus Próprios Charts

O [Guia de Desenvolvimento de Charts](/topics/charts.md) explica como
desenvolver seus próprios Charts. Mas você pode começar rapidamente usando o comando `helm
create`:

```console
$ helm create deis-workflow
Creating deis-workflow
```

Agora há um Chart em `./deis-workflow`. Você pode editá-lo e criar seus próprios
templates.

Enquanto edita seu Chart, você pode validar se ele está bem formado executando `helm
lint`.

Quando chegar a hora de empacotar o Chart para distribuição, você pode executar o comando `helm
package`:

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

E esse Chart agora pode ser facilmente instalado com `helm install`:

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

Charts que são empacotados podem ser carregados em repositórios de Charts. Consulte a
documentação sobre [repositórios de Charts do
Helm](/topics/chart_repository.md) para mais detalhes.

## Conclusão

Este capítulo abordou os padrões básicos de uso do cliente `helm`,
incluindo pesquisa, instalação, upgrade e desinstalação. Também abordou
comandos utilitários úteis como `helm status`, `helm get` e `helm repo`.

Para mais informações sobre esses comandos, consulte a ajuda integrada do Helm:
`helm help`.

No [próximo capítulo](/howto/charts_tips_and_tricks.md), veremos o processo de desenvolvimento de Charts.
