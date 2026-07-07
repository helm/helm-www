---
title: "Sincronizar tu Repositorio de Charts"
description: "Describe cómo sincronizar tus repositorios de charts locales y remotos."
weight: 2
---

*Nota: Este ejemplo es específico para un bucket de Google Cloud Storage (GCS)
que sirve como repositorio de charts.*

## Requisitos Previos

* Instalar la herramienta [gsutil](https://cloud.google.com/storage/docs/gsutil).
  *Dependemos en gran medida de la funcionalidad de gsutil rsync*
* Asegúrese de tener acceso al binario de Helm
* _Opcional: Le recomendamos que establezca [control de versiones del
  objeto](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page)
  en su bucket de GCS en caso de que elimine algo accidentalmente._

## Configurar un directorio de repositorio de charts local

Cree un directorio local como lo hicimos en [la guía del repositorio de charts]({{< relref path="/docs/topics/chart_repository.md" lang="en" >}})
, y coloque sus charts empaquetados en ese directorio.

Por ejemplo:

```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## Genere un index.yaml actualizado

Utilice Helm para generar un archivo index.yaml actualizado pasando la ruta del
directorio y la URL del repositorio remoto al comando `helm repo index` de esta
manera:

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```

Esto generará un archivo index.yaml actualizado y lo colocará en el directorio
`fantastic-charts /`.

## Sincronice sus repositorios de charts locales y remotos

Sube el contenido del directorio a tu bucket de GCS ejecutando `scripts/sync-repo.sh`
y pase el nombre del directorio local y el nombre del bucket de GCS.

Por ejemplo:

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

## Actualizar su repositorio de chart

Querrá mantener una copia local del contenido de su repositorio de chart o usar
`gsutil rsync` para copiar el contenido de su repositorio de chart remoto a un
directorio local.

Por ejemplo:

```console
$ gsutil rsync -d -n gs://bucket-name local-dir/    # la bandera -n hace un ensayo
Building synchronization state...
Starting synchronization
Would copy gs://bucket-name/alpine-0.1.0.tgz to file://local-dir/alpine-0.1.0.tgz
Would copy gs://bucket-name/index.yaml to file://local-dir/index.yaml

$ gsutil rsync -d gs://bucket-name local-dir/       # realiza las acciones de copia
Building synchronization state...
Starting synchronization
Copying gs://bucket-name/alpine-0.1.0.tgz...
Downloading file://local-dir/alpine-0.1.0.tgz:                        740 B/740 B
Copying gs://bucket-name/index.yaml...
Downloading file://local-dir/index.yaml:                              346 B/346 B
```

Enlaces Útiles:

* Documentación sobre [gsutil rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
* [La Guía del Repositorio de Charts]({{< relref path="/docs/topics/chart_repository.md" lang="en" >}})
* Documentación sobre [Control de versiones de objetos y control de 
  simultaneidad](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview)
  en Google Cloud Storage
