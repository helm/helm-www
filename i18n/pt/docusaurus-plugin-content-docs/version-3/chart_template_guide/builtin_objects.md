---
title: Objetos Embutidos
description: Objetos embutidos disponíveis para templates.
sidebar_position: 3
---

Objetos são passados para um template pelo motor de templates. Seu código também pode
passar objetos adiante (veremos exemplos quando analisarmos as instruções `with` e `range`).
Existem até algumas formas de criar novos objetos dentro dos seus templates, como
com a função `tuple` que veremos mais adiante.

Objetos podem ser simples e ter apenas um valor. Ou podem conter outros objetos
ou funções. Por exemplo, o objeto `Release` contém vários objetos (como
`Release.Name`) e o objeto `Files` possui algumas funções.

Na seção anterior, usamos `{{ .Release.Name }}` para inserir o nome de um release
em um template. `Release` é um dos objetos de nível superior que você pode
acessar nos seus templates.

- `Release`: Este objeto descreve o próprio release. Ele contém vários objetos:
  - `Release.Name`: O nome do release
  - `Release.Namespace`: O namespace no qual o release será instalado (se o
    manifesto não sobrescrever)
  - `Release.IsUpgrade`: Este valor é definido como `true` se a operação atual
    for um upgrade ou rollback.
  - `Release.IsInstall`: Este valor é definido como `true` se a operação atual
    for uma instalação.
  - `Release.Revision`: O número de revisão deste release. Na instalação, este
    valor é 1, e é incrementado a cada upgrade e rollback.
  - `Release.Service`: O serviço que está renderizando o template atual. No
    Helm, este valor é sempre `Helm`.
- `Values`: Valores passados para o template a partir do arquivo `values.yaml` e
  de arquivos fornecidos pelo usuário. Por padrão, `Values` está vazio.
- `Chart`: O conteúdo do arquivo `Chart.yaml`. Qualquer dado em `Chart.yaml`
  estará acessível aqui. Por exemplo, `{{ .Chart.Name }}-{{ .Chart.Version }}`
  exibirá `mychart-0.1.0`.
  - Os campos disponíveis estão listados no [Guia de Charts](/topics/charts.md#the-chartyaml-file)
- `Subcharts`: Fornece acesso ao escopo (.Values, .Charts, .Releases etc.) dos
  subcharts para o chart pai. Por exemplo, `.Subcharts.mySubChart.myValue` para
  acessar o valor `myValue` no chart `mySubChart`.
- `Files`: Fornece acesso a todos os arquivos não especiais em um chart. Embora
  você não possa usá-lo para acessar templates, pode usá-lo para acessar outros
  arquivos no chart. Consulte a seção [Acessando Arquivos](/chart_template_guide/accessing_files.md)
  para mais informações.
  - `Files.Get` é uma função para obter um arquivo pelo nome (`.Files.Get
    config.ini`)
  - `Files.GetBytes` é uma função para obter o conteúdo de um arquivo como um
    array de bytes em vez de uma string. Isso é útil para coisas como imagens.
  - `Files.Glob` é uma função que retorna uma lista de arquivos cujos nomes
    correspondem ao padrão glob fornecido.
  - `Files.Lines` é uma função que lê um arquivo linha por linha. Isso é útil
    para iterar sobre cada linha de um arquivo.
  - `Files.AsSecrets` é uma função que retorna o conteúdo dos arquivos como
    strings codificadas em Base 64.
  - `Files.AsConfig` é uma função que retorna o conteúdo dos arquivos como um
    mapa YAML.
- `Capabilities`: Fornece informações sobre as capacidades que o cluster
  Kubernetes suporta.
  - `Capabilities.APIVersions` é um conjunto de versões.
  - `Capabilities.APIVersions.Has $version` indica se uma versão (por exemplo,
    `batch/v1`) ou recurso (por exemplo, `apps/v1/Deployment`) está disponível
    no cluster.
  - `Capabilities.KubeVersion` e `Capabilities.KubeVersion.Version` é a versão
    do Kubernetes.
  - `Capabilities.KubeVersion.Major` é a versão major do Kubernetes.
  - `Capabilities.KubeVersion.Minor` é a versão minor do Kubernetes.
  - `Capabilities.HelmVersion` é o objeto que contém os detalhes da versão do Helm, o mesmo resultado de `helm version`.
  - `Capabilities.HelmVersion.Version` é a versão atual do Helm no formato semver.
  - `Capabilities.HelmVersion.GitCommit` é o sha1 do git do Helm.
  - `Capabilities.HelmVersion.GitTreeState` é o estado da árvore git do Helm.
  - `Capabilities.HelmVersion.GoVersion` é a versão do compilador Go utilizado.
- `Template`: Contém informações sobre o template atual que está sendo executado
  - `Template.Name`: Um caminho de arquivo com namespace para o template atual
    (por exemplo, `mychart/templates/mytemplate.yaml`)
  - `Template.BasePath`: O caminho com namespace para o diretório de templates
    do chart atual (por exemplo, `mychart/templates`).

Os valores embutidos sempre começam com letra maiúscula. Isso segue a convenção
de nomenclatura do Go. Quando você cria seus próprios nomes, você é livre para
usar uma convenção que se adeque à sua equipe. Algumas equipes, como muitas
cujos charts você pode ver no [Artifact Hub](https://artifacthub.io/packages/search?kind=0),
escolhem usar apenas letras minúsculas iniciais para distinguir nomes locais
daqueles embutidos. Neste guia, seguimos essa convenção.
