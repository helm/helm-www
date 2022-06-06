---
title: "Glossário" 
description: "Termos utilizados para descrever a arquitetura do Helm."
weight: 9
---

# Glossário

## Chart

É um pacote Helm que contém as informações necessárias para instalar
uma série de recursos e manifestos do Kubernetes em um cluster.

Os Charts contém um arquivo `Chart.yaml` bem como _templates_ dos manifestos,
valores padrão (`values.yaml`), e outras dependêncas.

Os Charts são desenvolvidos dentro de uma estrutura de diretório bem definida,
e depois empacotados em um formato de arquivo chamado _chart archive_.

## Chart Archive

Um _chart archive_ é um Chart compactado, em tar e gzip, (e opcionalmente
assinado).

## Dependência de Charts (Subcharts)

Charts podem depender de outros Charts. Há duas maneiras que dependência de Charts
podem ocorrer:

- _Soft dependency_: Um Chart pode não funcionar se um outro Chart não estiver instalado
  no cluster. O Helm não fornece ferramental para resolver esse caso. Nesse
  cenário as dependências são gerenciadas separadamente.
- _Hard dependency_: Um Chart pode conter (dentro do diretório `charts/`)
  outro Chart no qual seja dependente. Nesse caso, ao instalar o Chart também
  será instalado todas as suas dependências. Os Charts e suas dependências são gerenciadas
  como uma coleção.

Quando um Chart é empacotado (via `helm package`) todas as suas
_hard dependencies_ são agrupadas com ele.

## Versão do Chart

Charts são versionados de acordo com as [especificações da SemVer 2](https://semver.org).
Um número de versão é necessário para cada Chart.

## Chart.yaml

Informações sobre o Chart são armazenadas num arquivo específico chamado `Chart.yaml`.
Cada Chart deve ter esse arquivo.

## Helm (e o cliente helm)

Helm é o gerenciador de pacotes para o Kubernetes. Assim como gerenciadores de
pacotes facilitam a instalação de ferramentas para sistemas operacionais, o Helm
facilita a instalação de aplicações nos clusters Kubernetes.

Enquanto _Helm_ (em maiúsculo) é o nome do projeto, a ferramenta de linha de comando
também se chama `helm`. Por convenção utiliza-se _Helm_ em maiúsculo ao falar do
projeto. Quando se faz referência ao cliente utiliza-se _helm_ em mínusculo.

## Arquivos de configuração do Helm (XDG)

O Helm armazena suas configurações em arquivos de diretórios XDG. Esses diretórios
são criados quando o `helm` é executado pela primeira vez.

## Kube Config (KUBECONFIG)

O cliente helm tenta encontrar as configurações do cluster Kubernetes utilizando
como base o arquivo no formato _Kube config_. Por padrão o helm tentará localizá-lo
no mesmo local que o `kubectl` o cria (`$HOME/.kube/config`).

## Lint (Formatação de Charts)

Formatar um Chart significa validar se este segue as converções e requerimentos
padrões de um Chart do Helm. O Helm tem ferramentas de formatação através do comando
`helm lint`.

## Linhagem (Arquivo de Linhagem)

Os Charts Helm podem ser acompanhados de _arquivos de linhagem_ o qual provêm informações
a cerca da origem do Chart e o que ele contém.

Arquivos de Linhagem fazem parte do histórico de segurança do Helm. Uma linhagem
contém um hash criptografado do arquivo _chart archive_, dados do Chart.yaml, e,
um bloco de assinatura (um bloco "clearsign" OpenPGP). Quando utilizados em conjuto
com uma chave habilita o usuário a:

- Validar se o Chart foi assinado por uma entidade acreditada
- Validar se o arquivo do Chart não foi modificado
- Validar o conteúdo dos metadados do Chart (`Chart.yaml`)
- Correlacionar rapidamente o Chart com os seus dados de linhagem

Arquivos de linhagem tem a extensão `.prov`, e podem ser servidos a partir de um
_repositório de Charts_ ou qualquer outro servidor HTTP.

## Release

Quando um Chart é instalado, a biblioteca do Helm cria uma _release_  para monitorar
aquela instalação em particular.

Um mesmo Chart pode ser instalado diversas vezes em um mesmo cluster e criar _releases_
diferentes. Por exemplo, uma pessoa pode instalar três bancos de dados PostgreSQL,
a partir de um mesmo Chart, rodando o comando `helm install` três vezes com diferentes
nomes para cada _release_.

## Número da _Release_ (Versão da _Release_)

Uma única _release_  pode ser atualizada diversas vezes. Um contador sequencial
é utilizado para monitorar as alterações da _release_. Após o primerio `helm install`
do Chart, a _release_ terá um número de _release_ igual a 1. A cada vez que uma release
for atualizada ou regredida, a versão da release será **incrementada**.

## Regressão (Rollback)

Uma _release_ pode ser atualizada para uma nova configuração do chart. Contudo é
possível regredir a uma versão anterior da release, uma vez que o histórico de
_releases_ é armazenado. Essa operação é realizada com o comando `helm rollback`.

Importante: uma _release_ regredida recebe um novo número de _release_.

| Operação   | Número da Release                                    |
|------------|------------------------------------------------------|
| install    | release 1                                            |
| upgrade    | release 2                                            |
| upgrade    | release 3                                            |
| rollback 1 | release 4 (mantendo a configuração da release 1)     |

A tabela acima ilustra como as versões de release são incrementadas entre as
operações de instalação, atualização e regressão.

## Biblioteca do Helm (SDK)

A biblioteca do Helm (SDK) refere-se ao código em Go que interage diretamente com
o API Server do Kubernetes para instalar, atualizar, buscar e remover recursos
do Kubernetes. Ela pode ser importada em um projeto para utilizar o Helm como cliente
ao invés da CLI.

## Repositório (Repo, Repositório de Charts)

Os Charts do Helm podem ser armazenados em servidores dedicados HTTP chamados
_repositório de Charts_ (_repositórios_, ou somente _repos_).

Um repositório de Charts é simplesmente um servidor HTTP que retorna um arquivo `index.yaml`
o qual descreve um grupo de Charts e identifica onde cada Chart pode ser baixado.
(Muitos repositórios também hospedam os Charts para serem baixados, além do arquivo
`index.yaml`.)

O cliente helm pode apontar para zero ou mais repositórios de Charts. Por padrão
o cliente helm não é pré-configurado com nenhum repositório. Um repositório pode
ser adicionado a qualquer momento através do comando `helm repo add`.

## Valores de Configuração (values.yaml)

Valores de configuração são uma forma de sobrescrever valores padrão dos templates
com seu próprio conteúdo.

Os Charts do Helm são "parametrizados", o que significa dizer que um desenvolvedor
pode expôr configurações padrão que podem ser sobrescritas durante a instalação.
Por exemplo, um chart pode expôr o campo `username` que permite configurar um nome
de usuário para um serviço.

Essas variáveis expostas são chamados de _values_ no linguajar do Helm.

Os valores podem ser configurados durante as operações de `helm install` e
`helm upgrade`, tanto passando-as diretamente como argumentos de linha de comando,
ou, usando um arquivo `values.yaml`.
