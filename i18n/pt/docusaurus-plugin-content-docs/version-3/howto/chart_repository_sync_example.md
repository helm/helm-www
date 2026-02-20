---
title: Sincronizando Seu Repositório de Charts
description: Como sincronizar seus repositórios de charts local e remoto.
sidebar_position: 2
---

*Nota: Este exemplo é especificamente para um bucket do Google Cloud Storage (GCS)
que hospeda um repositório de charts.*

## Pré-requisitos
* Instale a ferramenta [gsutil](https://cloud.google.com/storage/docs/gsutil). *Este
  processo depende fortemente da funcionalidade gsutil rsync*
* Certifique-se de ter acesso ao binário do Helm
* _Opcional: Recomendamos que você ative o [versionamento de
  objetos](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page)
  no seu bucket do GCS para o caso de excluir algo acidentalmente._

## Configure um diretório de repositório de charts local
Crie um diretório local como fizemos no [guia do repositório de charts](/topics/chart_repository.md), e coloque seus charts empacotados nesse
diretório.

Por exemplo:
```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## Gere um index.yaml atualizado
Use o Helm para gerar um arquivo index.yaml atualizado passando o caminho do diretório
e a URL do repositório remoto para o comando `helm repo index` assim:

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```
Isso gerará um arquivo index.yaml atualizado e o colocará no
diretório `fantastic-charts/`.

## Sincronize seus repositórios de charts local e remoto
Faça upload do conteúdo do diretório para seu bucket do GCS executando
`scripts/sync-repo.sh` e passando o nome do diretório local e o nome do bucket
do GCS.

Por exemplo:
```console
$ pwd
/Users/me/code/go/src/helm.sh/helm
$ scripts/sync-repo.sh fantastic-charts/ fantastic-charts
Getting ready to sync your local directory (fantastic-charts/) to a remote repository at gs://fantastic-charts
Verifying Prerequisites....
Thumbs up! Looks like you have gsutil. Let's continue.
Building synchronization state...
Starting synchronization
Would copy file://fantastic-charts/alpine-0.1.0.tgz to gs://fantastic-charts/alpine-0.1.0.tgz
Would copy file://fantastic-charts/index.yaml to gs://fantastic-charts/index.yaml
Are you sure you would like to continue with these changes?? [y/N]} y
Building synchronization state...
Starting synchronization
Copying file://fantastic-charts/alpine-0.1.0.tgz [Content-Type=application/x-tar]...
Uploading   gs://fantastic-charts/alpine-0.1.0.tgz:              740 B/740 B
Copying file://fantastic-charts/index.yaml [Content-Type=application/octet-stream]...
Uploading   gs://fantastic-charts/index.yaml:                    347 B/347 B
Congratulations your remote chart repository now matches the contents of fantastic-charts/
```
## Atualizando seu repositório de charts
Você vai querer manter uma cópia local do conteúdo do seu repositório de charts ou usar
`gsutil rsync` para copiar o conteúdo do seu repositório de charts remoto para um diretório
local.

Por exemplo:
```console
$ gsutil rsync -d -n gs://bucket-name local-dir/    # the -n flag does a dry run
Building synchronization state...
Starting synchronization
Would copy gs://bucket-name/alpine-0.1.0.tgz to file://local-dir/alpine-0.1.0.tgz
Would copy gs://bucket-name/index.yaml to file://local-dir/index.yaml

$ gsutil rsync -d gs://bucket-name local-dir/       # performs the copy actions
Building synchronization state...
Starting synchronization
Copying gs://bucket-name/alpine-0.1.0.tgz...
Downloading file://local-dir/alpine-0.1.0.tgz:                        740 B/740 B
Copying gs://bucket-name/index.yaml...
Downloading file://local-dir/index.yaml:                              346 B/346 B
```

Links Úteis:
* Documentação sobre o [gsutil
  rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
* [O Guia do Repositório de Charts](/topics/chart_repository.md)
* Documentação sobre [versionamento de objetos e controle de
  concorrência](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview)
  no Google Cloud Storage
