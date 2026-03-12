---
title: Charts
description: Explica o formato de chart e fornece orientações básicas para criar charts com o Helm.
sidebar_position: 1
---

O Helm usa um formato de empacotamento chamado _charts_. Um chart é uma coleção
de arquivos que descrevem um conjunto relacionado de recursos do Kubernetes. Um
único chart pode ser usado para implantar algo simples, como um pod do memcached,
ou algo complexo, como uma pilha completa de aplicação web com servidores HTTP,
bancos de dados, caches e assim por diante.

Os charts são criados como arquivos organizados em uma estrutura de diretórios
específica. Eles podem ser empacotados em arquivos compactados versionados para
serem implantados.

Se você deseja baixar e examinar os arquivos de um chart publicado, sem
instalá-lo, você pode fazer isso com `helm pull chartrepo/chartname`.

Este documento explica o formato de chart e fornece orientações básicas para
criar charts com o Helm.

## A Estrutura de Arquivos do Chart

Um chart é organizado como uma coleção de arquivos dentro de um diretório. O
nome do diretório é o nome do chart (sem informações de versão). Assim, um chart
que descreve o WordPress seria armazenado em um diretório `wordpress/`.

Dentro deste diretório, o Helm espera uma estrutura que corresponda a isto:

```text
wordpress/
  Chart.yaml          # Um arquivo YAML contendo informações sobre o chart
  LICENSE             # OPCIONAL: Um arquivo de texto simples contendo a licença do chart
  README.md           # OPCIONAL: Um arquivo README legível
  values.yaml         # Os valores de configuração padrão para este chart
  values.schema.json  # OPCIONAL: Um JSON Schema para impor uma estrutura ao arquivo values.yaml
  charts/             # Um diretório contendo quaisquer charts dos quais este chart depende.
  crds/               # Custom Resource Definitions
  templates/          # Um diretório de templates que, quando combinados com values,
                      # irão gerar arquivos de manifesto Kubernetes válidos.
  templates/NOTES.txt # OPCIONAL: Um arquivo de texto simples contendo notas de uso breves
```

O Helm reserva o uso dos diretórios `charts/`, `crds/` e `templates/`, e dos
nomes de arquivos listados. Outros arquivos serão deixados como estão.

## O Arquivo Chart.yaml

O arquivo `Chart.yaml` é obrigatório para um chart. Ele contém os seguintes
campos:

```yaml
apiVersion: A versão da API do chart (obrigatório)
name: O nome do chart (obrigatório)
version: A versão do chart (obrigatório)
kubeVersion: Um intervalo SemVer de versões compatíveis do Kubernetes (opcional)
description: Uma descrição de uma frase deste projeto (opcional)
type: O tipo do chart (opcional)
keywords:
  - Uma lista de palavras-chave sobre este projeto (opcional)
home: A URL da página inicial deste projeto (opcional)
sources:
  - Uma lista de URLs para o código-fonte deste projeto (opcional)
dependencies: # Uma lista das dependências do chart (opcional)
  - name: O nome do chart (nginx)
    version: A versão do chart ("1.2.3")
    repository: (opcional) A URL do repositório ("https://example.com/charts") ou alias ("@repo-name")
    condition: (opcional) Um caminho yaml que resolve para um booleano, usado para habilitar/desabilitar charts (ex: subchart1.enabled)
    tags: # (opcional)
      - Tags podem ser usadas para agrupar charts para habilitar/desabilitar juntos
    import-values: # (opcional)
      - ImportValues contém o mapeamento de valores de origem para a chave pai a ser importada. Cada item pode ser uma string ou par de itens de sublista filho/pai.
    alias: (opcional) Alias a ser usado para o chart. Útil quando você precisa adicionar o mesmo chart várias vezes
maintainers: # (opcional)
  - name: O nome do mantenedor (obrigatório para cada mantenedor)
    email: O email do mantenedor (opcional para cada mantenedor)
    url: Uma URL para o mantenedor (opcional para cada mantenedor)
icon: Uma URL para uma imagem SVG ou PNG para ser usada como ícone (opcional).
appVersion: A versão da aplicação que este contém (opcional). Não precisa ser SemVer. Aspas recomendadas.
deprecated: Se este chart está obsoleto (opcional, booleano)
annotations:
  example: Uma lista de anotações identificadas por nome (opcional).
```

A partir da [v3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2), campos
adicionais não são permitidos. A abordagem recomendada é adicionar metadados
personalizados em `annotations`.

### Charts e Versionamento

Cada chart deve ter um número de versão. Uma versão deve seguir o padrão
[SemVer 2](https://semver.org/spec/v2.0.0.html), mas não é rigorosamente
obrigatório. Diferente do Helm Classic, o Helm v2 e posteriores usam números de
versão como marcadores de release. Pacotes em repositórios são identificados por
nome mais versão.

Por exemplo, um chart `nginx` cujo campo de versão é definido como `version:
1.2.3` será nomeado:

```text
nginx-1.2.3.tgz
```

Nomes SemVer 2 mais complexos também são suportados, como `version:
1.2.3-alpha.1+ef365`. Mas nomes não-SemVer são explicitamente proibidos pelo
sistema. Exceções são feitas para versões no formato `x` ou `x.y`. Por exemplo,
se houver um `v` inicial ou uma versão listada sem todas as 3 partes (ex: v1.2),
o sistema tentará convertê-la para uma versão semântica válida (ex: v1.2.0).

**NOTA:** Enquanto o Helm Classic e o Deployment Manager eram muito orientados
ao GitHub quando se tratava de charts, o Helm v2 e posteriores não dependem ou
exigem GitHub ou mesmo Git. Consequentemente, ele não usa Git SHAs para
versionamento.

O campo `version` dentro do `Chart.yaml` é usado por muitas ferramentas do Helm,
incluindo a CLI. Ao gerar um pacote, o comando `helm package` usará a versão que
encontrar no `Chart.yaml` como um token no nome do pacote. O sistema assume que
o número da versão no nome do pacote do chart corresponde ao número da versão no
`Chart.yaml`. Se essa condição não for atendida, ocorrerá um erro.

### O Campo `apiVersion`

O campo `apiVersion` deve ser `v2` para charts Helm que requerem pelo menos Helm
3. Charts que suportam versões anteriores do Helm têm um `apiVersion` definido
como `v1` e ainda são instaláveis pelo Helm 3.

Mudanças de `v1` para `v2`:

- Um campo `dependencies` definindo dependências do chart, que estavam
  localizadas em um arquivo `requirements.yaml` separado para charts `v1` (veja
  [Dependências do Chart](#dependências-do-chart)).
- O campo `type`, discriminando charts de aplicação e biblioteca (veja [Tipos
  de Chart](#tipos-de-chart)).

### O Campo `appVersion`

Note que o campo `appVersion` não está relacionado ao campo `version`. É uma
forma de especificar a versão da aplicação. Por exemplo, o chart `drupal` pode
ter um `appVersion: "8.2.1"`, indicando que a versão do Drupal incluída no chart
(por padrão) é `8.2.1`. Este campo é informativo e não tem impacto nos cálculos
de versão do chart. Colocar a versão entre aspas é altamente recomendado. Isso
força o parser YAML a tratar o número da versão como uma string. Deixá-lo sem
aspas pode levar a problemas de parsing em alguns casos. Por exemplo, o YAML
interpreta `1.0` como um valor de ponto flutuante, e um SHA de commit git como
`1234e10` como notação científica.

A partir do Helm v3.5.0, `helm create` coloca o campo `appVersion` padrão entre
aspas.

### O Campo `kubeVersion`

O campo opcional `kubeVersion` pode definir restrições semver em versões
suportadas do Kubernetes. O Helm validará as restrições de versão ao instalar o
chart e falhará se o cluster executar uma versão não suportada do Kubernetes.

As restrições de versão podem incluir comparações AND separadas por espaços como
```
>= 1.13.0 < 1.15.0
```
que podem ser combinadas com o operador OR `||` como no exemplo a seguir
```
>= 1.13.0 < 1.14.0 || >= 1.14.1 < 1.15.0
```
Neste exemplo, a versão `1.14.0` é excluída, o que pode fazer sentido se um bug
em certas versões é conhecido por impedir o funcionamento adequado do chart.

Além das restrições de versão usando operadores `=` `!=` `>` `<` `>=` `<=`, as
seguintes notações abreviadas são suportadas:

 * intervalos com hífen para intervalos fechados, onde `1.1 - 2.3.4` é
   equivalente a `>= 1.1 <= 2.3.4`.
 * curingas `x`, `X` e `*`, onde `1.2.x` é equivalente a `>= 1.2.0 < 1.3.0`.
 * intervalos til (mudanças de versão patch permitidas), onde `~1.2.3` é
   equivalente a `>= 1.2.3 < 1.3.0`.
 * intervalos circunflexo (mudanças de versão minor permitidas), onde `^1.2.3` é
   equivalente a `>= 1.2.3 < 2.0.0`.

Para uma explicação detalhada das restrições semver suportadas, veja
[Masterminds/semver](https://github.com/Masterminds/semver).

### Descontinuando Charts

Ao gerenciar charts em um Repositório de Charts, às vezes é necessário
descontinuar um chart. O campo opcional `deprecated` no `Chart.yaml` pode ser
usado para marcar um chart como descontinuado. Se a **última** versão de um
chart no repositório estiver marcada como descontinuada, então o chart como um
todo é considerado descontinuado. O nome do chart pode ser reutilizado
posteriormente publicando uma versão mais nova que não esteja marcada como
descontinuada. O fluxo de trabalho para descontinuar charts é:

1. Atualizar o `Chart.yaml` do chart para marcá-lo como descontinuado,
   incrementando a versão
2. Publicar a nova versão do chart no Repositório de Charts
3. Remover o chart do repositório de código-fonte (ex: git)

### Tipos de Chart

O campo `type` define o tipo do chart. Existem dois tipos: `application` e
`library`. Application é o tipo padrão e é o chart padrão que pode ser operado
completamente. O [chart de biblioteca](/topics/library_charts.md) fornece
utilitários ou funções para o construtor do chart. Um chart de biblioteca
difere de um chart de aplicação porque não é instalável e geralmente não contém
objetos de recursos.

**Nota:** Um chart de aplicação pode ser usado como um chart de biblioteca. Isso
é habilitado definindo o tipo como `library`. O chart será então renderizado
como um chart de biblioteca onde todos os utilitários e funções podem ser
aproveitados. Todos os objetos de recursos do chart não serão renderizados.

## Chart LICENSE, README e NOTES

Os charts também podem conter arquivos que descrevem a instalação, configuração,
uso e licença de um chart.

Uma LICENSE é um arquivo de texto simples contendo a
[licença](https://en.wikipedia.org/wiki/Software_license) do chart. O chart pode
conter uma licença pois pode ter lógica de programação nos templates e,
portanto, não seria apenas configuração. Também pode haver licença(s) separadas
para a aplicação instalada pelo chart, se necessário.

Um README para um chart deve ser formatado em Markdown (README.md), e
geralmente deve conter:

- Uma descrição da aplicação ou serviço que o chart fornece
- Quaisquer pré-requisitos ou requisitos para executar o chart
- Descrições das opções em `values.yaml` e valores padrão
- Qualquer outra informação que possa ser relevante para a instalação ou
  configuração do chart

Quando hubs e outras interfaces de usuário exibem detalhes sobre um chart, esses
detalhes são extraídos do conteúdo do arquivo `README.md`.

O chart também pode conter um breve arquivo de texto simples
`templates/NOTES.txt` que será impresso após a instalação e ao visualizar o
status de uma release. Este arquivo é avaliado como um
[template](#templates-e-values), e pode ser usado para exibir notas de uso,
próximos passos ou qualquer outra informação relevante para uma release do
chart. Por exemplo, instruções podem ser fornecidas para conectar a um banco de
dados ou acessar uma interface web. Como este arquivo é impresso no STDOUT ao
executar `helm install` ou `helm status`, é recomendado manter o conteúdo breve
e apontar para o README para mais detalhes.

## Dependências do Chart

No Helm, um chart pode depender de qualquer número de outros charts. Essas
dependências podem ser vinculadas dinamicamente usando o campo `dependencies` no
`Chart.yaml` ou trazidas para o diretório `charts/` e gerenciadas manualmente.

### Gerenciando Dependências com o campo `dependencies`

Os charts requeridos pelo chart atual são definidos como uma lista no campo
`dependencies`.

```yaml
dependencies:
  - name: apache
    version: 1.2.3
    repository: https://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: https://another.example.com/charts
```

- O campo `name` é o nome do chart que você deseja.
- O campo `version` é a versão do chart que você deseja.
- O campo `repository` é a URL completa para o repositório de charts. Note que
  você também deve usar `helm repo add` para adicionar esse repositório
  localmente.
- Você pode usar o nome do repositório em vez da URL

```console
$ helm repo add fantastic-charts https://charts.helm.sh/incubator
```

```yaml
dependencies:
  - name: awesomeness
    version: 1.0.0
    repository: "@fantastic-charts"
```

Depois de definir as dependências, você pode executar `helm dependency update` e
ele usará seu arquivo de dependências para baixar todos os charts especificados
para o seu diretório `charts/`.

```console
$ helm dep up foochart
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "example" chart repository
...Successfully got an update from the "another" chart repository
Update Complete. Happy Helming!
Saving 2 charts
Downloading apache from repo https://example.com/charts
Downloading mysql from repo https://another.example.com/charts
```

Quando `helm dependency update` obtém os charts, ele os armazenará como arquivos
compactados de chart no diretório `charts/`. Então, para o exemplo acima, seria
esperado ver os seguintes arquivos no diretório charts:

```text
charts/
  apache-1.2.3.tgz
  mysql-3.2.1.tgz
```

#### Campo alias em dependencies

Além dos outros campos acima, cada entrada de requisitos pode conter o campo
opcional `alias`.

Adicionar um alias para um chart de dependência colocaria um chart nas
dependências usando o alias como nome da nova dependência.

Pode-se usar `alias` nos casos em que precisam acessar um chart com outro(s)
nome(s).

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-1
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-2
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
```

No exemplo acima, teremos 3 dependências no total para `parentchart`:

```text
subchart
new-subchart-1
new-subchart-2
```

A forma manual de conseguir isso é copiar/colar o mesmo chart no diretório
`charts/` várias vezes com nomes diferentes.

#### Campos Tags e Condition em dependencies

Além dos outros campos acima, cada entrada de requisitos pode conter os campos
opcionais `tags` e `condition`.

Todos os charts são carregados por padrão. Se os campos `tags` ou `condition`
estiverem presentes, eles serão avaliados e usados para controlar o carregamento
do(s) chart(s) aos quais são aplicados.

Condition - O campo condition contém um ou mais caminhos YAML (delimitados por
vírgulas). Se este caminho existir nos values do pai de nível superior e
resolver para um valor booleano, o chart será habilitado ou desabilitado com
base nesse valor booleano. Apenas o primeiro caminho válido encontrado na lista
é avaliado e se nenhum caminho existir, então a condição não tem efeito.

Tags - O campo tags é uma lista YAML de rótulos para associar com este chart.
Nos values do pai de nível superior, todos os charts com tags podem ser
habilitados ou desabilitados especificando a tag e um valor booleano.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart1.enabled,global.subchart1.enabled
    tags:
      - front-end
      - subchart1
  - name: subchart2
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart2.enabled,global.subchart2.enabled
    tags:
      - back-end
      - subchart2
```

```yaml
# parentchart/values.yaml

subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

No exemplo acima, todos os charts com a tag `front-end` seriam desabilitados,
mas como o caminho `subchart1.enabled` avalia para 'true' nos values do pai, a
condição sobrescreverá a tag `front-end` e `subchart1` será habilitado.

Como `subchart2` está marcado com `back-end` e essa tag avalia para `true`,
`subchart2` será habilitado. Note também que embora `subchart2` tenha uma
condição especificada, não há caminho e valor correspondente nos values do pai,
então essa condição não tem efeito.

##### Usando a CLI com Tags e Conditions

O parâmetro `--set` pode ser usado como de costume para alterar valores de tags
e conditions.

```console
helm install --set tags.front-end=true --set subchart2.enabled=false
```

##### Resolução de Tags e Condition

- **Conditions (quando definidas em values) sempre sobrescrevem tags.** O
  primeiro caminho de condition que existir vence e os subsequentes para esse
  chart são ignorados.
- Tags são avaliadas como 'se qualquer uma das tags do chart for true, então
  habilite o chart'.
- Valores de tags e conditions devem ser definidos nos values do pai de nível
  superior.
- A chave `tags:` nos values deve ser uma chave de nível superior. Globals e
  tabelas `tags:` aninhadas não são atualmente suportadas.

#### Importando Child Values via dependencies

Em alguns casos, é desejável permitir que os values de um chart filho se
propaguem para o chart pai e sejam compartilhados como padrões comuns. Um
benefício adicional de usar o formato `exports` é que ele permitirá que
ferramentas futuras inspecionem valores configuráveis pelo usuário.

As chaves contendo os valores a serem importados podem ser especificadas no
campo `import-values` nas `dependencies` do chart pai usando uma lista YAML.
Cada item na lista é uma chave que é importada do campo `exports` do chart
filho.

Para importar valores não contidos na chave `exports`, use o formato
[child-parent](#usando-o-formato-child-parent). Exemplos de ambos os formatos
são descritos abaixo.

##### Usando o formato exports

Se o arquivo `values.yaml` de um chart filho contiver um campo `exports` na
raiz, seu conteúdo pode ser importado diretamente para os values do pai
especificando as chaves a importar como no exemplo abaixo:

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - data
```

```yaml
# child's values.yaml file

exports:
  data:
    myint: 99
```

Como estamos especificando a chave `data` em nossa lista de importação, o Helm
procura no campo `exports` do chart filho pela chave `data` e importa seu
conteúdo.

Os values finais do pai conteriam nosso campo exportado:

```yaml
# parent's values

myint: 99
```

Note que a chave pai `data` não está contida nos values finais do pai. Se você
precisar especificar a chave pai, use o formato 'child-parent'.

##### Usando o formato child-parent

Para acessar valores que não estão contidos na chave `exports` dos values do
chart filho, você precisará especificar a chave de origem dos valores a serem
importados (`child`) e o caminho de destino nos values do chart pai (`parent`).

O `import-values` no exemplo abaixo instrui o Helm a pegar quaisquer valores
encontrados no caminho `child:` e copiá-los para os values do pai no caminho
especificado em `parent:`

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    ...
    import-values:
      - child: default.data
        parent: myimports
```

No exemplo acima, os valores encontrados em `default.data` nos values do
subchart1 serão importados para a chave `myimports` nos values do chart pai como
detalhado abaixo:

```yaml
# parent's values.yaml file

myimports:
  myint: 0
  mybool: false
  mystring: "helm rocks!"
```

```yaml
# subchart1's values.yaml file

default:
  data:
    myint: 999
    mybool: true
```

Os values resultantes do chart pai seriam:

```yaml
# parent's final values

myimports:
  myint: 999
  mybool: true
  mystring: "helm rocks!"
```

Os values finais do pai agora contêm os campos `myint` e `mybool` importados do
subchart1.

### Gerenciando Dependências manualmente via o diretório `charts/`

Se mais controle sobre as dependências for desejado, essas dependências podem
ser expressas explicitamente copiando os charts de dependência para o diretório
`charts/`.

Uma dependência deve ser um diretório de chart descompactado, mas seu nome não
pode começar com `_` ou `.`. Tais arquivos são ignorados pelo carregador de
charts.

Por exemplo, se o chart WordPress depende do chart Apache, o chart Apache (da
versão correta) é fornecido no diretório `charts/` do chart WordPress:

```yaml
wordpress:
  Chart.yaml
  # ...
  charts/
    apache/
      Chart.yaml
      # ...
    mysql/
      Chart.yaml
      # ...
```

O exemplo acima mostra como o chart WordPress expressa sua dependência do Apache
e MySQL incluindo esses charts dentro de seu diretório `charts/`.

**DICA:** _Para colocar uma dependência em seu diretório `charts/`, use o
comando `helm pull`_

### Aspectos operacionais do uso de dependências

As seções acima explicam como especificar dependências de charts, mas como isso
afeta a instalação de charts usando `helm install` e `helm upgrade`?

Suponha que um chart chamado "A" crie os seguintes objetos Kubernetes

- namespace "A-Namespace"
- statefulset "A-StatefulSet"
- service "A-Service"

Além disso, A é dependente do chart B que cria os objetos

- namespace "B-Namespace"
- replicaset "B-ReplicaSet"
- service "B-Service"

Após a instalação/atualização do chart A, uma única release Helm é
criada/modificada. A release criará/atualizará todos os objetos Kubernetes acima
na seguinte ordem:

- A-Namespace
- B-Namespace
- A-Service
- B-Service
- B-ReplicaSet
- A-StatefulSet

Isso ocorre porque quando o Helm instala/atualiza charts, os objetos Kubernetes
dos charts e todas as suas dependências são

- agregados em um único conjunto; então
- ordenados por tipo seguido de nome; e então
- criados/atualizados nessa ordem.

Portanto, uma única release é criada com todos os objetos do chart e suas
dependências.

A ordem de instalação dos tipos Kubernetes é dada pela enumeração InstallOrder
em kind_sorter.go (veja [o arquivo fonte do
Helm](https://github.com/helm/helm/blob/484d43913f97292648c867b56768775a55e4bba6/pkg/releaseutil/kind_sorter.go)).

## Templates e Values

Os templates de Chart Helm são escritos na [linguagem de template
Go](https://golang.org/pkg/text/template/), com a adição de 50 ou mais funções
de template adicionais [da biblioteca
Sprig](https://github.com/Masterminds/sprig) e algumas outras [funções
especializadas](/howto/charts_tips_and_tricks.md).

Todos os arquivos de template são armazenados na pasta `templates/` de um chart.
Quando o Helm renderiza os charts, ele passará cada arquivo nesse diretório pelo
motor de templates.

Os values para os templates são fornecidos de duas formas:

- Desenvolvedores de charts podem fornecer um arquivo chamado `values.yaml`
  dentro de um chart. Este arquivo pode conter valores padrão.
- Usuários de charts podem fornecer um arquivo YAML que contém values. Isso pode
  ser fornecido na linha de comando com `helm install`.

Quando um usuário fornece values personalizados, esses valores sobrescreverão os
valores no arquivo `values.yaml` do chart.

### Arquivos de Template

Os arquivos de template seguem as convenções padrão para escrever templates Go
(veja [a documentação do pacote Go
text/template](https://golang.org/pkg/text/template/) para detalhes). Um exemplo
de arquivo de template pode parecer algo assim:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

O exemplo acima, baseado livremente em
[https://github.com/deis/charts](https://github.com/deis/charts), é um template
para um replication controller do Kubernetes. Ele pode usar os seguintes quatro
valores de template (geralmente definidos em um arquivo `values.yaml`):

- `imageRegistry`: O registro de origem para a imagem Docker.
- `dockerTag`: A tag para a imagem docker.
- `pullPolicy`: A política de pull do Kubernetes.
- `storage`: O backend de armazenamento, cujo padrão é definido como `"minio"`

Todos esses valores são definidos pelo autor do template. O Helm não requer ou
determina parâmetros.

Para ver muitos charts funcionando, confira o [Artifact
Hub](https://artifacthub.io/packages/search?kind=0) da CNCF.

### Values Predefinidos

Values que são fornecidos via um arquivo `values.yaml` (ou via a flag `--set`)
são acessíveis a partir do objeto `.Values` em um template. Mas existem outros
dados predefinidos que você pode acessar em seus templates.

Os seguintes values são predefinidos, estão disponíveis para todo template, e
não podem ser sobrescritos. Como todos os values, os nomes diferenciam maiúsculas
de minúsculas.

- `Release.Name`: O nome da release (não o chart)
- `Release.Namespace`: O namespace em que o chart foi liberado.
- `Release.Service`: O serviço que conduziu a release.
- `Release.IsUpgrade`: Isso é definido como true se a operação atual for um
  upgrade ou rollback.
- `Release.IsInstall`: Isso é definido como true se a operação atual for uma
  instalação.
- `Chart`: O conteúdo do `Chart.yaml`. Assim, a versão do chart é obtida como
  `Chart.Version` e os mantenedores estão em `Chart.Maintainers`.
- `Files`: Um objeto semelhante a um mapa contendo todos os arquivos não especiais no
  chart. Isso não dará acesso a templates, mas dará acesso a arquivos adicionais
  que estão presentes (a menos que sejam excluídos usando `.helmignore`).
  Arquivos podem ser acessados usando `{{ index .Files "file.name" }}` ou usando
  a função `{{.Files.Get name }}`. Você também pode acessar o conteúdo do
  arquivo como `[]byte` usando `{{ .Files.GetBytes }}`
- `Capabilities`: Um objeto semelhante a um mapa que contém informações sobre as versões do
  Kubernetes (`{{ .Capabilities.KubeVersion }}`) e as versões de API do
  Kubernetes suportadas (`{{ .Capabilities.APIVersions.Has "batch/v1" }}`)

**NOTA:** Qualquer campo desconhecido do `Chart.yaml` será descartado. Eles não
serão acessíveis dentro do objeto `Chart`. Assim, `Chart.yaml` não pode ser
usado para passar dados estruturados arbitrariamente para o template. O arquivo
values pode ser usado para isso.

### Arquivos de Values

Considerando o template na seção anterior, um arquivo `values.yaml` que fornece
os valores necessários seria assim:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

Um arquivo de values é formatado em YAML. Um chart pode incluir um arquivo
`values.yaml` padrão. O comando helm install permite que um usuário sobrescreva
valores fornecendo valores YAML adicionais:

```console
$ helm install --generate-name --values=myvals.yaml wordpress
```

Quando os values são passados desta forma, eles serão mesclados no arquivo de
values padrão. Por exemplo, considere um arquivo `myvals.yaml` que se parece com
isto:

```yaml
storage: "gcs"
```

Quando isso é mesclado com o `values.yaml` no chart, o conteúdo gerado
resultante será:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"
```

Note que apenas o último campo foi sobrescrito.

**NOTA:** O arquivo de values padrão incluído dentro de um chart _deve_ ser
nomeado `values.yaml`. Mas arquivos especificados na linha de comando podem ter
qualquer nome.

**NOTA:** Se a flag `--set` for usada em `helm install` ou `helm upgrade`, esses
valores são simplesmente convertidos para YAML no lado do cliente.

**NOTA:** Se existirem entradas obrigatórias no arquivo de values, elas podem
ser declaradas como obrigatórias no template do chart usando a [função
'required'](/howto/charts_tips_and_tricks.md)

Qualquer um desses valores é então acessível dentro de templates usando o objeto
`.Values`:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

### Escopo, Dependências e Values

Arquivos de values podem declarar valores para o chart de nível superior, bem
como para qualquer um dos charts que estão incluídos no diretório `charts/`
desse chart. Ou, para colocar de outra forma, um arquivo de values pode fornecer
valores para o chart assim como para qualquer uma de suas dependências. Por
exemplo, o chart de demonstração WordPress acima tem tanto `mysql` quanto
`apache` como dependências. O arquivo de values poderia fornecer valores para
todos esses componentes:

```yaml
title: "My WordPress Site" # Enviado para o template WordPress

mysql:
  max_connections: 100 # Enviado para MySQL
  password: "secret"

apache:
  port: 8080 # Passado para Apache
```

Charts de níveis superiores têm acesso a todas as variáveis definidas abaixo.
Então o chart WordPress pode acessar a senha do MySQL como
`.Values.mysql.password`. Mas charts de níveis inferiores não podem acessar
coisas em charts pais, então MySQL não será capaz de acessar a propriedade
`title`. Nem, aliás, pode acessar `apache.port`.

Os values têm namespaces, mas os namespaces são podados. Então para o chart
WordPress, ele pode acessar o campo de senha do MySQL como
`.Values.mysql.password`. Mas para o chart MySQL, o escopo dos values foi
reduzido e o prefixo de namespace removido, então ele verá o campo password
simplesmente como `.Values.password`.

#### Global Values

A partir da versão 2.0.0-Alpha.2, o Helm suporta um "global" value especial.
Considere esta versão modificada do exemplo anterior:

```yaml
title: "My WordPress Site" # Enviado para o template WordPress

global:
  app: MyWordPress

mysql:
  max_connections: 100 # Enviado para MySQL
  password: "secret"

apache:
  port: 8080 # Passado para Apache
```

O acima adiciona uma seção `global` com o valor `app: MyWordPress`. Este valor
está disponível para _todos_ os charts como `.Values.global.app`.

Por exemplo, os templates `mysql` podem acessar `app` como `{{
.Values.global.app}}`, e assim pode o chart `apache`. Efetivamente, o arquivo de
values acima é regenerado assim:

```yaml
title: "My WordPress Site" # Enviado para o template WordPress

global:
  app: MyWordPress

mysql:
  global:
    app: MyWordPress
  max_connections: 100 # Enviado para MySQL
  password: "secret"

apache:
  global:
    app: MyWordPress
  port: 8080 # Passado para Apache
```

Isso fornece uma maneira de compartilhar uma variável de nível superior com
todos os subcharts, o que é útil para coisas como definir propriedades de
`metadata` como labels.

Se um subchart declarar uma variável global, essa global será passada _para
baixo_ (para os subcharts do subchart), mas não _para cima_ para o chart pai.
Não há como um subchart influenciar os values do chart pai.

Além disso, variáveis globais de charts pais têm precedência sobre as variáveis
globais de subcharts.

### Arquivos de Schema

Às vezes, um mantenedor de chart pode querer definir uma estrutura em seus
values. Isso pode ser feito definindo um schema no arquivo `values.schema.json`.
Um schema é representado como um [JSON Schema](https://json-schema.org/). Pode
parecer algo assim:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "properties": {
    "image": {
      "description": "Container Image",
      "properties": {
        "repo": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "name": {
      "description": "Service name",
      "type": "string"
    },
    "port": {
      "description": "Port",
      "minimum": 0,
      "type": "integer"
    },
    "protocol": {
      "type": "string"
    }
  },
  "required": [
    "protocol",
    "port"
  ],
  "title": "Values",
  "type": "object"
}
```

Este schema será aplicado aos values para validá-lo. A validação ocorre quando
qualquer um dos seguintes comandos é invocado:

- `helm install`
- `helm upgrade`
- `helm lint`
- `helm template`

Um exemplo de um arquivo `values.yaml` que atende aos requisitos deste schema
pode parecer algo assim:

```yaml
name: frontend
protocol: https
port: 443
```

Note que o schema é aplicado ao objeto `.Values` final, e não apenas ao arquivo
`values.yaml`. Isso significa que o seguinte arquivo `yaml` é válido, dado que o
chart é instalado com a opção `--set` apropriada mostrada abaixo.

```yaml
name: frontend
protocol: https
```

```console
helm install --set port=443
```

Além disso, o objeto `.Values` final é verificado contra *todos* os schemas de
subcharts. Isso significa que restrições em um subchart não podem ser
contornadas por um chart pai. Isso também funciona ao contrário - se um subchart
tem um requisito que não é atendido no arquivo `values.yaml` do subchart, o
chart pai *deve* satisfazer essas restrições para ser válido.

A validação de schema pode ser desabilitada definindo a opção mostrada abaixo.
Isso é particularmente útil em ambientes air-gapped quando o arquivo JSON Schema
de um chart contém referências remotas.
```console
helm install --skip-schema-validation
```

### Referências

Quando se trata de escrever templates, values e arquivos de schema, existem
várias referências padrão que ajudarão você.

- [Templates Go](https://godoc.org/text/template)
- [Funções de template extras](https://godoc.org/github.com/Masterminds/sprig)
- [O formato YAML](https://yaml.org/spec/)
- [JSON Schema](https://json-schema.org/)

## Custom Resource Definitions (CRDs)

O Kubernetes fornece um mecanismo para declarar novos tipos de objetos
Kubernetes. Usando CustomResourceDefinitions (CRDs), desenvolvedores Kubernetes
podem declarar tipos de recursos personalizados.

No Helm 3, CRDs são tratados como um tipo especial de objeto. Eles são
instalados antes do resto do chart e estão sujeitos a algumas limitações.

Arquivos YAML de CRD devem ser colocados no diretório `crds/` dentro de um
chart. Múltiplos CRDs (separados por marcadores de início e fim YAML) podem ser
colocados no mesmo arquivo. O Helm tentará carregar _todos_ os arquivos no
diretório CRD para o Kubernetes.

Arquivos CRD _não podem conter templates_. Eles devem ser documentos YAML
simples.

Quando o Helm instala um novo chart, ele fará upload dos CRDs, pausará até que
os CRDs estejam disponíveis pelo servidor de API, e então iniciará o motor de
templates, renderizará o resto do chart, e fará upload para o Kubernetes. Por
causa dessa ordenação, informações de CRD estão disponíveis no objeto
`.Capabilities` nos templates Helm, e templates Helm podem criar novas
instâncias de objetos que foram declarados em CRDs.

Por exemplo, se seu chart tiver um CRD para `CronTab` no diretório `crds/`, você
pode criar instâncias do kind `CronTab` no diretório `templates/`:

```text
crontabs/
  Chart.yaml
  crds/
    crontab.yaml
  templates/
    mycrontab.yaml
```

O arquivo `crontab.yaml` deve conter o CRD sem diretivas de template:

```yaml
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
```

Então o template `mycrontab.yaml` pode criar um novo `CronTab` (usando templates
como de costume):

```yaml
apiVersion: stable.example.com
kind: CronTab
metadata:
  name: {{ .Values.name }}
spec:
   # ...
```

O Helm garantirá que o kind `CronTab` foi instalado e está disponível no
servidor de API do Kubernetes antes de prosseguir instalando as coisas em
`templates/`.

### Limitações em CRDs

Diferente da maioria dos objetos no Kubernetes, CRDs são instalados globalmente.
Por essa razão, o Helm adota uma abordagem muito cautelosa no gerenciamento de
CRDs. CRDs estão sujeitos às seguintes limitações:

- CRDs nunca são reinstalados. Se o Helm determinar que os CRDs no diretório
  `crds/` já estão presentes (independentemente da versão), o Helm não tentará
  instalar ou atualizar.
- CRDs nunca são instalados em upgrade ou rollback. O Helm só criará CRDs em
  operações de instalação.
- CRDs nunca são deletados. Deletar um CRD automaticamente deleta todo o
  conteúdo do CRD em todos os namespaces no cluster. Consequentemente, o Helm
  não deletará CRDs.

Operadores que desejam atualizar ou deletar CRDs são encorajados a fazer isso
manualmente e com muito cuidado.

## Usando o Helm para Gerenciar Charts

A ferramenta `helm` tem vários comandos para trabalhar com charts.

Ela pode criar um novo chart para você:

```console
$ helm create mychart
Created mychart/
```

Uma vez que você tenha editado um chart, `helm` pode empacotá-lo em um arquivo
compactado de chart para você:

```console
$ helm package mychart
Archived mychart-0.1.-.tgz
```

Você também pode usar `helm` para ajudá-lo a encontrar problemas com a
formatação ou informações do seu chart:

```console
$ helm lint mychart
No issues found
```

## Repositórios de Charts

Um _repositório de charts_ é um servidor HTTP que hospeda um ou mais charts
empacotados. Embora `helm` possa ser usado para gerenciar diretórios de charts
locais, quando se trata de compartilhar charts, o mecanismo preferido é um
repositório de charts.

Qualquer servidor HTTP que pode servir arquivos YAML e tar e pode responder
requisições GET pode ser usado como um servidor de repositório. A equipe do Helm
testou alguns servidores, incluindo Google Cloud Storage com modo website
habilitado, e S3 com modo website habilitado.

Um repositório é caracterizado principalmente pela presença de um arquivo
especial chamado `index.yaml` que tem uma lista de todos os pacotes fornecidos
pelo repositório, junto com metadados que permitem obter e verificar esses
pacotes.

No lado do cliente, repositórios são gerenciados com os comandos `helm repo`. No
entanto, o Helm não fornece ferramentas para fazer upload de charts para
servidores de repositório remotos. Isso ocorre porque fazer isso adicionaria
requisitos substanciais a um servidor implementador, e assim aumentaria a
barreira para configurar um repositório.

## Chart Starter Packs

O comando `helm create` aceita uma opção opcional `--starter` que permite
especificar um "starter chart". A opção starter também tem um alias curto `-p`.

Exemplos de uso:

```console
helm create my-chart --starter starter-name
helm create my-chart -p starter-name
helm create my-chart -p /absolute/path/to/starter-name
```

Starters são apenas charts regulares, mas estão localizados em
`$XDG_DATA_HOME/helm/starters`. Como desenvolvedor de charts, você pode criar
charts que são especificamente projetados para serem usados como starters. Tais
charts devem ser projetados com as seguintes considerações em mente:

- O `Chart.yaml` será sobrescrito pelo gerador.
- Os usuários esperarão modificar o conteúdo de tal chart, então a documentação
  deve indicar como os usuários podem fazer isso.
- Todas as ocorrências de `<CHARTNAME>` serão substituídas pelo nome do chart
  especificado para que starter charts possam ser usados como templates, exceto
  para alguns arquivos variáveis. Por exemplo, se você usar arquivos
  personalizados no diretório `vars` ou certos arquivos `README.md`,
  `<CHARTNAME>` NÃO será substituído dentro deles. Além disso, a descrição do
  chart não é herdada.

Atualmente, a única maneira de adicionar um chart a `$XDG_DATA_HOME/helm/starters`
é copiá-lo manualmente para lá. Na documentação do seu chart, você pode querer
explicar esse processo.
