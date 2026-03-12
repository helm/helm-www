---
title: Mudanças Desde o Helm 2
sidebar_position: 1
---

## Mudanças desde o Helm 2

Aqui está uma lista completa de todas as principais mudanças introduzidas no Helm 3.

### Remoção do Tiller

Durante o ciclo de desenvolvimento do Helm 2, introduzimos o Tiller. O Tiller
teve um papel importante para equipes que trabalhavam em um cluster compartilhado
— ele tornava possível que vários operadores diferentes interagissem com o mesmo
conjunto de releases.

Com o controle de acesso baseado em funções (RBAC) habilitado por padrão no
Kubernetes 1.6, restringir o Tiller para uso em cenários de produção se tornou
mais difícil de gerenciar. Devido ao grande número de possíveis políticas de
segurança, nossa posição era fornecer uma configuração permissiva por padrão.
Isso permitia que usuários iniciantes começassem a experimentar o Helm e o
Kubernetes sem ter que mergulhar de cabeça nos controles de segurança.
Infelizmente, essa configuração permissiva podia conceder a um usuário uma ampla
gama de permissões que ele não deveria ter. DevOps e SREs precisavam aprender
etapas operacionais adicionais ao instalar o Tiller em um cluster multi-tenant.

Após ouvir como os membros da comunidade estavam usando o Helm em determinados
cenários, descobrimos que o sistema de gerenciamento de releases do Tiller não
precisava depender de um operador no cluster para manter o estado ou atuar como
um hub central para informações de releases do Helm. Em vez disso, podíamos
simplesmente buscar informações do servidor de API do Kubernetes, renderizar os
Charts no lado do cliente e armazenar um registro da instalação no Kubernetes.

O objetivo principal do Tiller podia ser alcançado sem o Tiller, então uma das
primeiras decisões que tomamos em relação ao Helm 3 foi remover completamente o
Tiller.

Com o Tiller removido, o modelo de segurança do Helm foi radicalmente
simplificado. O Helm 3 agora suporta todos os recursos modernos de segurança,
identidade e autorização do Kubernetes moderno. As permissões do Helm são
avaliadas usando seu [arquivo
kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/).
Os administradores de cluster podem restringir as permissões dos usuários na
granularidade que considerarem adequada. As releases ainda são registradas no
cluster, e o restante da funcionalidade do Helm permanece inalterado.

### Estratégia de Upgrade Aprimorada: 3-way Strategic Merge Patches

O Helm 2 usava um patch de mesclagem estratégica de duas vias. Durante um
upgrade, ele comparava o manifesto do chart mais recente com o manifesto do
chart proposto (aquele fornecido durante o `helm upgrade`). Ele comparava as
diferenças entre esses dois charts para determinar quais mudanças precisavam ser
aplicadas aos recursos no Kubernetes. Se alterações fossem aplicadas ao cluster
fora de banda (como durante um `kubectl edit`), essas alterações não eram
consideradas. Isso resultava em recursos que não conseguiam reverter para seu
estado anterior: como o Helm considerava apenas o manifesto do último chart
aplicado como seu estado atual, se não houvesse mudanças no estado do chart, o
estado ativo permanecia inalterado.

No Helm 3, agora usamos um patch de mesclagem estratégica de três vias. O Helm
considera o manifesto antigo, seu estado ativo e o novo manifesto ao gerar um
patch.

#### Exemplos

Vamos examinar alguns exemplos comuns de como essa mudança impacta.

##### Revertendo quando o estado ativo foi alterado

Sua equipe acabou de implantar a aplicação em produção no Kubernetes usando o
Helm. O chart contém um objeto Deployment onde o número de réplicas está
configurado como três:

```console
$ helm install myapp ./myapp
```

Um novo desenvolvedor entra na equipe. No primeiro dia, enquanto observa o
cluster de produção, acontece um acidente com café derramado no teclado e ele
acaba executando `kubectl scale` no deployment de produção, reduzindo de três
réplicas para zero.

```console
$ kubectl scale --replicas=0 deployment/myapp
```

Outro desenvolvedor da sua equipe percebe que o site de produção está fora do ar
e decide reverter a release para seu estado anterior:

```console
$ helm rollback myapp
```

O que acontece?

No Helm 2, ele geraria um patch comparando o manifesto antigo com o novo
manifesto. Como é um rollback, é o mesmo manifesto. O Helm determinaria que não
há nada a mudar porque não há diferença entre o manifesto antigo e o novo
manifesto. A contagem de réplicas continua em zero. Pânico geral.

No Helm 3, o patch é gerado usando o manifesto antigo, o estado ativo e o novo
manifesto. O Helm reconhece que o estado antigo era três, o estado ativo é zero
e o novo manifesto deseja alterá-lo de volta para três, então ele gera um patch
para mudar o estado de volta para três.

##### Upgrades quando o estado ativo foi alterado

Muitas service meshes e outras aplicações baseadas em controllers injetam dados
nos objetos do Kubernetes. Isso pode ser algo como um sidecar, labels ou outras
informações. Anteriormente, se você tivesse o seguinte manifesto renderizado a
partir de um Chart:

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

E o estado ativo fosse modificado por outra aplicação para

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

Agora, você quer atualizar a tag da imagem `nginx` para `2.1.0`. Então, você faz
upgrade para um chart com o seguinte manifesto:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

O que acontece?

No Helm 2, o Helm gera um patch do objeto `containers` entre o manifesto antigo
e o novo manifesto. O estado ativo do cluster não é considerado durante a
geração do patch.

O estado ativo do cluster é modificado para ficar assim:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

O pod sidecar é removido do estado ativo. Mais pânico.

No Helm 3, o Helm gera um patch do objeto `containers` entre o manifesto antigo,
o estado ativo e o novo manifesto. Ele nota que o novo manifesto muda a tag da
imagem para `2.1.0`, mas o estado ativo contém um container sidecar.

O estado ativo do cluster é modificado para ficar assim:

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

### Nomes de Releases Agora Têm Escopo por Namespace

Com a remoção do Tiller, as informações sobre cada release precisavam ser
armazenadas em algum lugar. No Helm 2, isso era armazenado no mesmo namespace
que o Tiller. Na prática, isso significava que uma vez que um nome era usado por
uma release, nenhuma outra release podia usar esse mesmo nome, mesmo se fosse
implantada em um namespace diferente.

No Helm 3, as informações sobre uma release específica agora são armazenadas no
mesmo namespace que a própria release. Isso significa que os usuários agora
podem executar `helm install wordpress stable/wordpress` em dois namespaces
separados, e cada um pode ser referenciado com `helm list` alterando o contexto
do namespace atual (por exemplo, `helm list --namespace foo`).

Com esse maior alinhamento aos namespaces nativos do cluster, o comando `helm
list` não lista mais todas as releases por padrão. Em vez disso, ele listará
apenas as releases no namespace do seu contexto atual do Kubernetes (ou seja, o
namespace mostrado quando você executa `kubectl config view --minify`). Isso
também significa que você deve fornecer a flag `--all-namespaces` ao `helm list`
para obter um comportamento similar ao do Helm 2.

### Secrets como Driver de Armazenamento Padrão

No Helm 3, Secrets agora são usados como o [driver de armazenamento
padrão](/topics/advanced.md#storage-backends). O Helm 2 usava ConfigMaps por
padrão para armazenar informações de releases. No Helm 2.7.0, um novo backend de
armazenamento que usa Secrets para armazenar informações de releases foi
implementado, e agora é o padrão a partir do Helm 3.

A mudança para Secrets como padrão no Helm 3 permite segurança adicional na
proteção de charts em conjunto com o lançamento da criptografia de Secrets no
Kubernetes.

[Criptografar secrets em
repouso](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)
tornou-se disponível como um recurso alpha no Kubernetes 1.7 e se tornou estável
a partir do Kubernetes 1.13. Isso permite que os usuários criptografem os
metadados de releases do Helm em repouso, sendo um bom ponto de partida que pode
ser expandido posteriormente para usar algo como o Vault.

### Mudanças no Caminho de Import do Go

No Helm 3, o Helm alterou o caminho de import do Go de `k8s.io/helm` para
`helm.sh/helm/v3`. Se você pretende atualizar para as bibliotecas cliente do
Helm 3 em Go, certifique-se de alterar seus caminhos de import.

### Capabilities

O objeto embutido `.Capabilities` disponível durante o estágio de renderização
foi simplificado.

[Objetos Embutidos](/chart_template_guide/builtin_objects.md)

### Validando Valores de Charts com JSONSchema

Um JSON Schema agora pode ser imposto sobre os valores do chart. Isso garante
que os valores fornecidos pelo usuário sigam o schema definido pelo mantenedor
do chart, fornecendo melhor relatório de erros quando o usuário fornece um
conjunto incorreto de valores para um chart.

A validação ocorre quando qualquer um dos seguintes comandos é invocado:

* `helm install`
* `helm upgrade`
* `helm template`
* `helm lint`

Consulte a documentação sobre [Arquivos de Schema](/topics/charts.md#schema-files)
para mais informações.

### Consolidação do `requirements.yaml` no `Chart.yaml`

O sistema de gerenciamento de dependências de Charts foi movido de
requirements.yaml e requirements.lock para Chart.yaml e Chart.lock.
Recomendamos que novos charts destinados ao Helm 3 usem o novo formato. No
entanto, o Helm 3 ainda entende a versão 1 da API de Chart (`v1`) e carregará
arquivos `requirements.yaml` existentes.

No Helm 2, era assim que um `requirements.yaml` se parecia:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

No Helm 3, a dependência é expressa da mesma forma, mas agora a partir do seu
`Chart.yaml`:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

Os charts ainda são baixados e colocados no diretório `charts/`, então subcharts
incluídos no diretório `charts/` continuarão a funcionar sem modificação.

### Nome (ou --generate-name) Agora é Obrigatório na Instalação

No Helm 2, se nenhum nome fosse fornecido, um nome gerado automaticamente seria
dado. Em produção, isso provou ser mais um incômodo do que um recurso útil. No
Helm 3, o Helm lançará um erro se nenhum nome for fornecido com `helm install`.

Para aqueles que ainda desejam que um nome seja gerado automaticamente, você
pode usar a flag `--generate-name` para criar um para você.

### Enviando Charts para Registries OCI

Este é um recurso experimental introduzido no Helm 3. Para usar, defina a
variável de ambiente `HELM_EXPERIMENTAL_OCI=1`.

De forma geral, um Repositório de Charts é um local onde Charts podem ser
armazenados e compartilhados. O cliente Helm empacota e envia Charts do Helm
para um Repositório de Charts. Simplificando, um Repositório de Charts é um
servidor HTTP básico que hospeda um arquivo index.yaml e alguns charts
empacotados.

Embora haja vários benefícios na API do Repositório de Charts atender aos
requisitos de armazenamento mais básicos, algumas desvantagens começaram a
aparecer:

- Repositórios de Charts têm muita dificuldade em abstrair a maioria das
  implementações de segurança exigidas em um ambiente de produção. Ter uma API
  padrão para autenticação e autorização é muito importante em cenários de
  produção.
- As ferramentas de proveniência de Charts do Helm usadas para assinar e
  verificar a integridade e origem de um chart são uma parte opcional do
  processo de publicação de Charts.
- Em cenários multi-tenant, o mesmo Chart pode ser enviado por outro tenant,
  custando o dobro do custo de armazenamento para armazenar o mesmo conteúdo.
  Repositórios de charts mais inteligentes foram projetados para lidar com isso,
  mas não faz parte da especificação formal.
- Usar um único arquivo de índice para pesquisa, informações de metadados e
  busca de Charts tornou difícil ou desajeitado projetar implementações
  multi-tenant seguras.

O projeto Distribution do Docker (também conhecido como Docker Registry v2) é o
sucessor do projeto Docker Registry. Muitos grandes provedores de nuvem têm uma
oferta de produto do projeto Distribution, e com tantos fornecedores oferecendo
o mesmo produto, o projeto Distribution se beneficiou de muitos anos de
hardening, melhores práticas de segurança e testes extensivos em produção.

Por favor, consulte `helm help chart` e `helm help registry` para mais
informações sobre como empacotar um chart e enviá-lo para um registro Docker.

Para mais informações, consulte [esta página](/topics/registries.md).

### Remoção do `helm serve`

O `helm serve` executava um Repositório de Charts local na sua máquina para fins
de desenvolvimento. No entanto, ele não recebeu muita adoção como ferramenta de
desenvolvimento e tinha vários problemas com seu design. No final, decidimos
removê-lo e separá-lo como um plugin.

Para uma experiência similar ao `helm serve`, dê uma olhada na opção de
armazenamento em sistema de arquivos local no
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
e no [plugin servecm](https://github.com/jdolitsky/helm-servecm).

### Suporte a Library Charts

O Helm 3 suporta uma classe de chart chamada "library chart". Este é um chart
que é compartilhado por outros charts, mas não cria nenhum artefato de release
próprio. Os templates de um library chart podem apenas declarar elementos
`define`. Conteúdo de escopo global que não seja `define` é simplesmente
ignorado. Isso permite que os usuários reutilizem e compartilhem trechos de
código que podem ser reutilizados em muitos charts, evitando redundância e
mantendo os charts [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Library charts são declarados na diretiva dependencies no Chart.yaml e são
instalados e gerenciados como qualquer outro chart.

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

Estamos muito empolgados em ver os casos de uso que esse recurso abre para
desenvolvedores de charts, bem como quaisquer melhores práticas que surjam do
consumo de library charts.

### Atualização da apiVersion do Chart.yaml

Com a introdução do suporte a library charts e a consolidação do
requirements.yaml no Chart.yaml, clientes que entendiam o formato de pacote do
Helm 2 não entenderão esses novos recursos. Então, atualizamos a apiVersion no
Chart.yaml de `v1` para `v2`.

O `helm create` agora cria charts usando este novo formato, então a apiVersion
padrão também foi atualizada lá.

Clientes que desejam suportar ambas as versões de charts do Helm devem
inspecionar o campo `apiVersion` no Chart.yaml para entender como analisar o
formato do pacote.

### Suporte ao XDG Base Directory

A [Especificação XDG Base
Directory](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
é um padrão portável que define onde arquivos de configuração, dados e cache
devem ser armazenados no sistema de arquivos.

No Helm 2, o Helm armazenava todas essas informações em `~/.helm` (carinhosamente
conhecido como `helm home`), que podia ser alterado definindo a variável de
ambiente `$HELM_HOME` ou usando a flag global `--home`.

No Helm 3, o Helm agora respeita as seguintes variáveis de ambiente conforme a
Especificação XDG Base Directory:

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

Os plugins do Helm ainda recebem `$HELM_HOME` como um alias para `$XDG_DATA_HOME`
para compatibilidade com plugins que procuram usar `$HELM_HOME` como um ambiente
de rascunho.

Várias novas variáveis de ambiente também são passadas para o ambiente do plugin
para acomodar essa mudança:

- `$HELM_PATH_CACHE` para o caminho de cache
- `$HELM_PATH_CONFIG` para o caminho de configuração
- `$HELM_PATH_DATA` para o caminho de dados

Plugins do Helm que desejam suportar o Helm 3 devem considerar o uso dessas
novas variáveis de ambiente.

### Renomeação de Comandos CLI

Para melhor alinhar a terminologia com outros gerenciadores de pacotes, `helm
delete` foi renomeado para `helm uninstall`. O `helm delete` ainda é mantido
como um alias para `helm uninstall`, então qualquer uma das formas pode ser
usada.

No Helm 2, para limpar o registro da release, a flag `--purge` precisava ser
fornecida. Essa funcionalidade agora está habilitada por padrão. Para manter o
comportamento anterior, use `helm uninstall --keep-history`.

Adicionalmente, vários outros comandos foram renomeados para acomodar as mesmas
convenções:

- `helm inspect` -> `helm show`
- `helm fetch` -> `helm pull`

Esses comandos também mantiveram seus verbos antigos como aliases, então você
pode continuar a usá-los em qualquer forma.

### Criação Automática de Namespaces

Ao criar uma release em um namespace que não existe, o Helm 2 criava o
namespace. O Helm 3 segue o comportamento de outras ferramentas do Kubernetes e
retorna um erro se o namespace não existir. O Helm 3 criará o namespace se você
especificar explicitamente a flag `--create-namespace`.

### O que aconteceu com .Chart.ApiVersion?

O Helm segue a convenção típica de CamelCasing, que é capitalizar um acrônimo.
Fizemos isso em outros lugares no código, como com
`.Capabilities.APIVersions.Has`. No Helm v3, corrigimos `.Chart.ApiVersion` para
seguir esse padrão, renomeando-o para `.Chart.APIVersion`.
