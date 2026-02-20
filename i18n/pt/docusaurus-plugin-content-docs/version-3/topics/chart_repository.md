---
title: Guia do Repositório de Charts
description: Como criar e trabalhar com repositórios de charts do Helm.
sidebar_position: 6
---

Esta seção explica como criar e trabalhar com repositórios de charts do Helm. De
forma geral, um repositório de charts é um local onde charts empacotados podem
ser armazenados e compartilhados.

O repositório comunitário distribuído de charts do Helm está localizado no
[Artifact Hub](https://artifacthub.io/packages/search?kind=0) e aceita
participação. Mas o Helm também permite criar e executar seu próprio repositório
de charts. Este guia explica como fazer isso. Se você está considerando criar um
repositório de charts, pode ser interessante considerar o uso de um
[registry OCI](/topics/registries.mdx) como alternativa.

## Pré-requisitos

* Consulte o guia de [Início Rápido](/intro/quickstart.md)
* Leia o documento sobre [Charts](/topics/charts.mdx)

## Criar um repositório de charts

Um _repositório de charts_ é um servidor HTTP que hospeda um arquivo
`index.yaml` e, opcionalmente, alguns charts empacotados. Quando você estiver
pronto para compartilhar seus charts, a forma preferida de fazer isso é
enviá-los para um repositório de charts.

A partir do Helm 2.2.0, há suporte para autenticação SSL do lado do cliente em
um repositório. Outros protocolos de autenticação podem estar disponíveis como
plugins.

Como um repositório de charts pode ser qualquer servidor HTTP capaz de servir
arquivos YAML e tar e responder a requisições GET, há diversas opções para
hospedar seu próprio repositório de charts. Por exemplo, você pode usar um
bucket do Google Cloud Storage (GCS), um bucket do Amazon S3, GitHub Pages, ou
até mesmo criar seu próprio servidor web.

### A estrutura do repositório de charts

Um repositório de charts consiste em charts empacotados e um arquivo especial
chamado `index.yaml` que contém um índice de todos os charts no repositório.
Frequentemente, os charts que o `index.yaml` descreve também são hospedados no
mesmo servidor, assim como os [arquivos de proveniência](/topics/provenance.mdx).

Por exemplo, o layout do repositório `https://example.com/charts` pode ser assim:

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

Neste caso, o arquivo de índice conteria informações sobre um chart, o chart
Alpine, e forneceria a URL de download
`https://example.com/charts/alpine-0.1.2.tgz` para esse chart.

Não é obrigatório que o pacote do chart esteja localizado no mesmo servidor que
o arquivo `index.yaml`. No entanto, fazer isso é frequentemente a opção mais
simples.

### O arquivo de índice

O arquivo de índice é um arquivo yaml chamado `index.yaml`. Ele contém alguns
metadados sobre o pacote, incluindo o conteúdo do arquivo `Chart.yaml` do chart.
Um repositório de charts válido deve ter um arquivo de índice. O arquivo de
índice contém informações sobre cada chart no repositório de charts. O comando
`helm repo index` gera um arquivo de índice com base em um diretório local que
contém charts empacotados.

Este é um exemplo de um arquivo de índice:

```yaml
apiVersion: v1
entries:
  alpine:
    - created: 2016-10-06T16:23:20.499814565-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 99c76e403d752c84ead610644d4b1c2f2b453a74b921f422b9dcb8a7c8b559cd
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.2.0.tgz
      version: 0.2.0
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 515c58e5f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cd78727
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.1.0.tgz
      version: 0.1.0
  nginx:
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Create a basic nginx HTTP server
      digest: aaff4545f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cdffffff
      home: https://helm.sh/helm
      name: nginx
      sources:
      - https://github.com/helm/charts
      urls:
      - https://technosophos.github.io/tscharts/nginx-1.1.0.tgz
      version: 1.1.0
generated: 2016-10-06T16:23:20.499029981-06:00
```

## Hospedando Repositórios de Charts

Esta parte mostra várias formas de servir um repositório de charts.

### Google Cloud Storage

O primeiro passo é **criar seu bucket GCS**. Vamos chamar o nosso de
`fantastic-charts`.

![Criar um Bucket GCS](/img/helm2/create-a-bucket.png)

Em seguida, torne seu bucket público **editando as permissões do bucket**.

![Editar Permissões](/img/helm2/edit-permissions.png)

Insira esta linha para **tornar seu bucket público**:

![Tornar o Bucket Público](/img/helm2/make-bucket-public.png)

Parabéns, agora você tem um bucket GCS vazio pronto para servir charts!

Você pode enviar seu repositório de charts usando a ferramenta de linha de
comando do Google Cloud Storage ou usando a interface web do GCS. Um bucket GCS
público pode ser acessado via HTTPS simples neste endereço:
`https://bucket-name.storage.googleapis.com/`.

### Cloudsmith

Você também pode configurar repositórios de charts usando o Cloudsmith. Leia
mais sobre repositórios de charts com Cloudsmith
[aqui](https://help.cloudsmith.io/docs/helm-chart-repository)

### JFrog Artifactory

Da mesma forma, você também pode configurar repositórios de charts usando o
JFrog Artifactory. Leia mais sobre repositórios de charts com JFrog Artifactory
[aqui](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories)

### Exemplo com GitHub Pages

De maneira semelhante, você pode criar um repositório de charts usando GitHub
Pages.

O GitHub permite servir páginas web estáticas de duas formas diferentes:

- Configurando um projeto para servir o conteúdo do seu diretório `docs/`
- Configurando um projeto para servir uma branch específica

Vamos usar a segunda abordagem, embora a primeira seja igualmente fácil.

O primeiro passo será **criar sua branch gh-pages**. Você pode fazer isso
localmente assim:

```console
$ git checkout -b gh-pages
```

Ou pelo navegador web usando o botão **Branch** no seu repositório GitHub:

![Criar branch GitHub Pages](/img/helm2/create-a-gh-page-button.png)

Em seguida, você vai querer ter certeza de que sua **branch gh-pages** está
configurada como GitHub Pages. Clique nas **Configurações** do seu repositório e
role para baixo até a seção **GitHub pages** e configure conforme abaixo:

![Criar branch GitHub Pages](/img/helm2/set-a-gh-page.png)

Por padrão, a **Source** geralmente é configurada para a **branch gh-pages**. Se
isso não estiver configurado por padrão, selecione-a.

Você pode usar um **domínio personalizado** ali, se desejar.

E verifique se **Enforce HTTPS** está marcado, para que o **HTTPS** seja usado
quando os charts forem servidos.

Com essa configuração, você pode usar sua branch padrão para armazenar o código
dos seus charts, e a **branch gh-pages** como repositório de charts, por
exemplo: `https://USERNAME.github.io/REPONAME`. O repositório de demonstração
[TS Charts](https://github.com/technosophos/tscharts) está acessível em
`https://technosophos.github.io/tscharts/`.

Se você decidiu usar o GitHub Pages para hospedar o repositório de charts,
consulte a [Chart Releaser Action](/howto/chart_releaser_action.md). A Chart
Releaser Action é um workflow do GitHub Action para transformar um projeto
GitHub em um repositório de charts Helm auto-hospedado, usando a ferramenta CLI
[helm/chart-releaser](https://github.com/helm/chart-releaser).

### Servidores web comuns

Para configurar um servidor web comum para servir charts do Helm, você
simplesmente precisa fazer o seguinte:

- Colocar seu índice e charts em um diretório que o servidor possa servir
- Garantir que o arquivo `index.yaml` possa ser acessado sem requisitos de
  autenticação
- Garantir que arquivos `yaml` sejam servidos com o tipo de conteúdo correto
  (`text/yaml` ou `text/x-yaml`)

Por exemplo, se você quiser servir seus charts a partir de `$WEBROOT/charts`,
certifique-se de que existe um diretório `charts/` na raiz web, e coloque o
arquivo de índice e os charts dentro dessa pasta.

### Servidor de Repositório ChartMuseum

O ChartMuseum é um servidor de Repositório de Charts Helm de código aberto
escrito em Go (Golang), com suporte para backends de armazenamento em nuvem,
incluindo [Google Cloud Storage](https://cloud.google.com/storage/), [Amazon
S3](https://aws.amazon.com/s3/), [Microsoft Azure Blob
Storage](https://azure.microsoft.com/en-us/services/storage/blobs/), [Alibaba
Cloud OSS Storage](https://www.alibabacloud.com/product/oss), [Openstack Object
Storage](https://developer.openstack.org/api-ref/object-store/), [Oracle Cloud
Infrastructure Object Storage](https://cloud.oracle.com/storage), [Baidu Cloud
BOS Storage](https://cloud.baidu.com/product/bos.html), [Tencent Cloud Object
Storage](https://intl.cloud.tencent.com/product/cos), [DigitalOcean
Spaces](https://www.digitalocean.com/products/spaces/),
[Minio](https://min.io/) e [etcd](https://etcd.io/).

Você também pode usar o servidor
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
para hospedar um repositório de charts a partir de um sistema de arquivos local.

### GitLab Package Registry

Com o GitLab, você pode publicar charts Helm no Package Registry do seu projeto.
Leia mais sobre como configurar um repositório de pacotes helm com o GitLab
[aqui](https://docs.gitlab.com/ee/user/packages/helm_repository/).

## Gerenciando Repositórios de Charts

Agora que você tem um repositório de charts, a última parte deste guia explica
como manter charts nesse repositório.

### Armazenar charts no seu repositório de charts

Agora que você tem um repositório de charts, vamos fazer upload de um chart e um
arquivo de índice para o repositório. Charts em um repositório de charts devem
ser empacotados (`helm package chart-name/`) e versionados corretamente
(seguindo as diretrizes do [SemVer 2](https://semver.org/)).

Os próximos passos compõem um exemplo de fluxo de trabalho, mas você pode usar
qualquer fluxo de trabalho que preferir para armazenar e atualizar charts no seu
repositório de charts.

Uma vez que você tenha um chart empacotado pronto, crie um novo diretório e mova
seu chart empacotado para esse diretório.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

O último comando pega o caminho do diretório local que você acabou de criar e a
URL do seu repositório de charts remoto e compõe um arquivo `index.yaml` dentro
do caminho do diretório fornecido.

Agora você pode fazer upload do chart e do arquivo de índice para seu
repositório de charts usando uma ferramenta de sincronização ou manualmente. Se
você estiver usando o Google Cloud Storage, confira este
[exemplo de fluxo de trabalho](/howto/chart_repository_sync_example.md)
usando o cliente gsutil. Para o GitHub, você pode simplesmente colocar os charts
na branch de destino apropriada.

### Adicionar novos charts a um repositório existente

Cada vez que você quiser adicionar um novo chart ao seu repositório, você deve
regenerar o índice. O comando `helm repo index` irá reconstruir completamente o
arquivo `index.yaml` do zero, incluindo apenas os charts que encontrar
localmente.

No entanto, você pode usar a flag `--merge` para adicionar incrementalmente
novos charts a um arquivo `index.yaml` existente (uma ótima opção ao trabalhar
com um repositório remoto como o GCS). Execute `helm repo index --help` para
saber mais.

Certifique-se de fazer upload tanto do arquivo `index.yaml` revisado quanto do
chart. E se você gerou um arquivo de proveniência, faça upload dele também.

### Compartilhar seus charts com outros

Quando estiver pronto para compartilhar seus charts, simplesmente informe a
alguém qual é a URL do seu repositório.

A partir daí, eles adicionarão o repositório ao seu cliente helm via o comando
`helm repo add [NOME] [URL]` com qualquer nome que desejarem usar para
referenciar o repositório.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

Se os charts estiverem protegidos por autenticação básica HTTP, você também pode
fornecer o nome de usuário e senha aqui:

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**Nota:** Um repositório não será adicionado se não contiver um `index.yaml`
válido.

**Nota:** Se seu repositório helm usa, por exemplo, um certificado
autoassinado, você pode usar `helm repo add --insecure-skip-tls-verify ...` para
ignorar a verificação de CA.

Depois disso, seus usuários poderão pesquisar seus charts. Após você atualizar o
repositório, eles podem usar o comando `helm repo update` para obter as
informações mais recentes do chart.

*Por baixo dos panos, os comandos `helm repo add` e `helm repo update` buscam o
arquivo index.yaml e o armazenam no diretório
`$XDG_CACHE_HOME/helm/repository/cache/`. É onde a função `helm search` encontra
informações sobre os charts.*
