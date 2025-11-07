---
title: Guia de Início Rápido
description: >-
  Como instalar e começar com os primeiros passos no Helm, incluindo instruções para Distros, Perguntas Frequentes e
  plugins.
sidebar_position: 1
---

Esse guia cobre como você rapidamente pode começar a utilizar o Helm.

## Pré-requisitos

Os pré-requisitos a seguir são exigidos para uma experiência bem sucedida e segura
do uso do Helm.

1. Ter acesso a um cluster Kubernetes
2. Decidir quais configurações de segurança serão aplicadas durante a instalação,
se houver alguma
3. Instalar e configurar o Helm.

### Instale o Kubernetes ou tenha acesso a um cluster

- Você deve ter o Kubernetes instalado. Para a utilização da última versão do Helm,
  nós recomendamos a última versão estável do Kubernetes, que geralmente é a penúltima
  _minor version_.
- Você deve ter também instalado localmente a ferramenta `kubectl`.

Consulte a [Política de Suporte de Versões do Helm](https://helm.sh/docs/topics/version_skew/)
para a máxima diferença de versões suportadas entre o Helm e o Kubernetes.

## Instalando o Helm

Faça o download do binário do cliente Helm. Você pode utilizar ferramentas
como o `homebrew` ou pesquisar na [página oficial de _releases_ do Helm](https://github.com/helm/helm/releases).

Para mais detalhes ou outras opções veja o [guia de instalação](/intro/install.md).

## Inicialize um Repositório para os Charts do Helm {#initialize-a-helm-chart-repository}

Depois de tudo pronto com a instalação do Helm você pode adicionar um repositório
de Charts. Dê uma olhada no [Artifact Hub](https://artifacthub.io/packages/search?kind=0)
para encontrar repositórios de Charts do Helm disponíveis.

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

Você poderá listar os Charts que deseja instalar do repositório recém adicionado:

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## Instalando um Chart de exemplo

Para instalar um Chart você pode rodar o comando `helm install`. O Helm
tem diversas formas de encontrar e instalar Charts, porém a mais fácil é utilizar
os Charts da `bitnami`.

```console
$ helm repo update              # Make sure we get the latest list of charts
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

No exemplo acima o Chart `bitnami/mysql` foi aplicado no cluster e o
nome da nossa nova _release_ é `mysql-1612624192`.

Você pode ter uma ideia das funcionalidades deste Chart MySQL ao rodar o comando
`helm show chart bitnami/mysql`. Se você quiser ter uma visão completa execute o
comando `helm show all bitnami/mysql` para mais informações do Chart.

Sempre que você instalar um Chart uma nova _release_ é criada. Dessa forma um mesmo
Chart pode ser instalado diversas vezes em um mesmo cluster. Assim cada Chart pode
ser gerenciado e atualizado de forma independente.

O comando `helm install` é bem poderoso e com muitas funcionalidades. Para saber
mais acesse o [Guia de Utilização do Helm](/intro/using_helm.md)

## Saiba mais sobre _Releases_

É fácil visualizar o que foi aplicado utilizando o Helm:

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

O comando `helm list` (ou `helm ls`) irá lhe mostrar uma lista de todos os Charts
aplicados.

## Desinstalando uma Release

Para desinstalar uma _release_ utilize o comando `helm uninstall`:

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

O comando desinstalará o Chart `mysql-1612624192` do Kubernetes, assim como
todos os recursos associados a _release_, além  do histórico da _release_.

Se o argumento `--keep-history` for passado, o histórico da _release_ será mantido.
Assim será possível recuperar informações sobre a _release_ específica:

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

Pelo fato do Helm monitorar as _releases_ até mesmo depois de desinstalá-las com
o argumento `--keep-history`, é possível auditar o histórico do cluster,
sendo até mesmo capaz de recuperar a _release_ (com o comando `helm rollback`).

## Ajuda no Cliente Helm

Use `helm help`ou digite um comando seguido pelo argumento `-h`
para saber mais sobre os comandos disponíveis no cliente Helm:

```console
$ helm get -h
```
