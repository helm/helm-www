---
title: "Instalando o  Helm"
description: "Aprenda como instalar e rodar o Helm."
weight: 2
---

Esse guia ensina como instalar a CLI do Helm. O Helm pode ser instalado
a partir do código-fonte, ou mesmo de um binário pré-buildado.

## A partir do Projeto Helm

O projeto Helm disponibiliza duas maneiras de baixar e instalar o Helm. Essas são
as formas oficiais de se obter as versões do Helm. Além disso, a comunidade do Helm
disponibiliza alternativas de download através de diversos gerenciadores de pacotes.
A seção de instalação pelos gerenciadores de pacotes se encontra abaixo dos métodos
oficiais.

### A partir das _Releases_ dos Binários

Cada [_release_](https://github.com/helm/helm/releases) do Helm gera distribuições
do binário para uma gama de sistemas operacionais. Essas versões de binários podem
ser baixadas manualmente e instaladas.

1. Baixe uma [versão desejada](https://github.com/helm/helm/releases)
2. Descompacte-a (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Encontre o binário `helm` no diretório descompactado e mova-o para um diretório
de destino (`mv linux-amd64/helm /usr/local/bin/helm`)

A partir daí, você já deve conseguir rodar o cliente e [adicionar
um repositório dos Charts do Helm](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository):
`helm help`.

**Nota:** Os testes automatizados do Helm são realizados para a plataforma Linux
AMD64 somente durante os _builds_ e _releases_ do GitHub Actions. Testes para outros
sistemas operacionais não estão cobertos e são de responsabilidade da comunidade
em solicitá-los.

### A partir do _Script_

O Helm agora conta com um _script_ que automaticamente baixará a última versão disponível
do Helm e [instalará localmente](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3).

Baixe o _script_ e execute-o localmente. O _script_ está bem escrito e documentado,
podendo ser verificado e revisado antes de proceder com a instalação local.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Sim, você pode executar `curl
https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` se
você gosta de viver perigosamente.

## Através de Gerenciadores de Pacote

A comunidade do Helm disponibiliza a instalação através de diversos gerenciadores
de pacotes para diferentes sistemas operacionais. Eles não são mantidos pelo projeto
Helm e não são considerados provedores terceiros acreditados.

### Homebrew (macOS)

Membros da comunidade Helm adicionaram uma formula do Helm ao Homebrew.
A fórmula geralmente está atualizada.

```console
brew install helm
```

(Nota: Atenção, existe uma fórmula do emacs-helm, que é um projeto distinto!)

### Chocolatey (Windows)

Membros da comunidade Helm contribuíram com um build do [pacote Helm](https://chocolatey.org/packages/kubernetes-helm)
para o [Chocolatey](https://chocolatey.org/). Esse pacote geralmente está atualizado.

```console
choco install kubernetes-helm
```

### Winget (Windows)

Membros da comunidade Helm contribuíram com um build do [pacote Helm](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm)
para o [Winget](https://learn.microsoft.com/en-us/windows/package-manager/). Esse pacote geralmente está atualizado.

```console
winget install Helm.Helm
```

### Apt (Debian/Ubuntu)

Membros da comunidade Helm contribuíram com um [pacote do Helm](https://helm.baltorepo.com/stable/debian/)
para o Apt. Esse pacote geralmente está atualizado.

```console
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Snap

A comunidade dos [_Snapcrafters_](https://github.com/snapcrafters) mantém a versão
do [pacote Helm](https://snapcraft.io/helm) para o Snap:

```console
sudo snap install helm --classic
```

### pkg (FreeBSD)

Membros da comunidade do FreeBSD contribuíram com um [pacote Helm](https://www.freshports.org/sysutils/helm)
buildado para o [_FreeBSD Ports Collection_](https://man.freebsd.org/ports).
Esse pacote geralmente está atualizado.

```console
pkg install helm
```

### _Builds_ de Desenvolvimento

Além das releases estáveis é possíbel baixar e instalar versões de desenvolvimento
do Helm.

### _Canary Builds_

_Builds "Canary"_ são versões do Helm construídas a partir das últimas atualizações
da _brach master_. Eles não são releases oficiais e podem não ser estáveis!
Contudo, oferecem a oportunidade de testar as funcionalidades mais recentes do Helm.

Os binários _Canary_ do Helm são armazenados em [get.helm.sh](https://get.helm.sh).
Estes são alguns links de _builds_ comuns:

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows
  AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### A partir do Código-Fonte (Linux, macOS)

_Buildar_ o Helm a partir do código-fonte é mais trabalhoso, mas é a melhor forma
de testar as últimas versões (pré-release) do Helm.

Você deve ter um ambiente de execução Go instalado em seu host.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

Se necessário, essa abordagem irá baixar as dependências, armazená-las em cache
e validará a configuração. Irá compilar o `helm` e o mover para `bin/helm` também.

## Conclusão

Na maioria dos casos a instalação é simples como baixar um binário pré-buildado
do `helm`. Este documento cobre casos de pessoas que querem executar cargas de
trabalho mais sofisticadas com o Helm.

Uma vez instalado com sucesso o cliente Helm você pode seguir com o uso do Helm
para o gerenciamento de charts [adição de um repositório estável](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository).
