---
title: "Guida ai Chart Repository"
description: "Come creare e lavorare coi repository per Helm chart."
aliases: ["/docs/chart_repository/"]
weight: 6
---

Questa sezione spiega come creare e lavorare con i repository dei chart Helm. Ad alto livello
un repository di chart è una posizione in cui i chart confezionati possono essere archiviati e condivisi.

Il repository distribuito della comunità di Helm si trova all'indirizzo
[Artifact Hub](https://artifacthub.io/packages/search?kind=0) e accoglie con favore la
partecipazione. Ma Helm permette anche di creare e gestire un proprio repository di chart. Questa guida spiega come farlo.

## Prerequisiti

* Leggere la guida [Quickstart]({{< relref path="quickstart.md" lang="en">}})
* Leggere il documento [Charts]({{< ref "/docs/topics/charts.md" >}})

## Creare un chart repository

Un _chart repository_ è un server HTTP che ospita un file `index.yaml` e
opzionalmente alcuni chart confezionati.  Quando si è pronti a condividere i propri chart, il modo
 modo preferibile è caricarli in un archivio di grafici.

A partire da Helm 2.2.0, è supportata l'autenticazione SSL lato client a un repository. Altri
protocolli di autenticazione possono essere disponibili come plugin.

Poiché un chart repository può essere un qualsiasi server HTTP in grado di servire file YAML e tar
e può rispondere a richieste GET, si ha una pletora di opzioni quando si tratta di ospitare il proprio chart repository.
Ad esempio, è possibile utilizzare un bucket di Google
Cloud Storage (GCS), Amazon S3, GitHub Pages o addirittura creare il proprio server web.

### La struttura del chart repository

Un chart repository è composto da chart pacchettizzati e da un file speciale chiamato`index.yaml` che contiene un indice di tutti i chart presenti nel repository.
Spesso, i chart che `index.yaml` descrive sono ospitati sullo stesso server, così come i [file di provenienza] ({{< ref "provenance.md" >}}).Per esempio, il layout del repository `https://example.com/charts` potrebbe essere così:

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

In questo caso, il file di indice conterrebbe informazioni su un chart, il chart Alpine, e fornirebbe l'URL per il download`https://example.com/charts/alpine-0.1.2.tgz` per quel chart.

Non è necessario che un pacchetto di chart si trovi sullo stesso server del file`index.yaml`. Tuttavia, spesso è la soluzione più semplice.

### Il file indice

Il file indice è un file yaml chiamato `index.yaml`. Contiene alcuni metadati
del pacchetto, compreso il contenuto del file `Chart.yaml` di un chart. A
chart repository valido deve avere un file di indice. Il file indice contiene
informazioni su ogni chart presente nel repository. Il comando `helm repo index`
genera un file di indice basato su una determinata directory locale che
contenente i chart pacchettizzati.

Questo è un esempio di file di indice:

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

## Ospitare i Chart Repositories

Questa parte mostra diversi modi per servire un chart repository..

### Google Cloud Storage

Il primo passo è quello di **creare il proprio bucket GCS**. Chiameremo il nostro
`fantastic-charts`.

![Creare un bucket GCS](https://helm.sh/img/create-a-bucket.png)

Quindi, rendete il vostro bucket pubblico **modificando i permessi del bucket**.

![Modifica permessi](https://helm.sh/img/edit-permissions.png)

Inserire questa voce per **rendere pubblico il bucket**:

![Rendi pubblico il bucket](https://helm.sh/img/make-bucket-public.png)

Congratulazioni, ora avete un bucket GCS vuoto pronto per servire i chart!

È possibile caricare il chart repository utilizzando lo strumento a riga di comando Google Cloud Storage
o utilizzando l'interfaccia web di GCS. È possibile accedere a un bucket GCS pubblico tramite
semplice HTTPS a questo indirizzo: `https://bucket-name.storage.googleapis.com/`.

### Cloudsmith

È anche possibile impostare chart repositories utilizzando Cloudsmith. Per saperne di più
chart repositories con Cloudsmith
[qui](https://help.cloudsmith.io/docs/helm-chart-repository)

### JFrog Artifactory

Allo stesso modo, è possibile impostare chart repositories utilizzando JFrog Artifactory. Per saperne di più
su chart repositories con JFrog Artifactory
[qui](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repository)

### Esempio con GitHub Pages

In modo simile è possibile creare charts repository utilizzando GitHub Pages.

GitHub consente di servire pagine web statiche in due modi diversi:

- Configurando un progetto per servire il contenuto della sua cartella `docs/`.
- Configurando un progetto per servire un particolare branch.

Noi adotteremo il secondo approccio, anche se il primo è altrettanto semplice.

Il primo passo sarà quello di **creare il branch gh-pages**.  È possibile farlo
localmente come.

```console
$ git checkout -b gh-pages
```

Oppure tramite browser web usando il pulsante **Branch** sul repository GitHub:

![Crea branch GitHub Pages](https://helm.sh/img/create-a-gh-page-button.png)

Successivamente, ci si deve assicurare che il branch **gh-pages** sia impostato come GitHub Pages,
cliccare sulle **Impostazioni** del proprio repository e scorrere fino alla sezione **Pagine GitHub** e
e impostare come indicato di seguito:

![Crea branch GitHub Pages](https://helm.sh/img/set-a-gh-page.png)

Per impostazione predefinita, **Source** viene solitamente impostato su **gh-pages branch**. Se questo non è
impostato per impostazione predefinita, selezionarlo.

È possibile utilizzare un **dominio personalizzato** se lo si desidera.

Verificare che **Enforce HTTPS** sia spuntato, in modo che **HTTPS** venga utilizzato quando vengono serviti i chart.

In questa configurazione si può usare il branch predefinito per memorizzare il codice dei chart e il branch **gh-pages** come repository dei chart. Ad esempio:
`https://USERNAME.github.io/REPONAME`. La dimostrazione [TS
Charts](https://github.com/technosophos/tscharts) è accessibile all'indirizzo
`https://technosophos.github.io/tscharts/`.

If you have decided to use GitHub pages to host the chart repository, check out
[Chart Releaser Action]({{< relref path="/docs/howto/chart_releaser_action.md" lang="en" >}}).
Chart Releaser Action is a GitHub Action workflow to turn a GitHub project into
a self-hosted Helm chart repo, using
[helm/chart-releaser](https://github.com/helm/chart-releaser) CLI tool.

### Ordinary web servers

To configure an ordinary web server to serve Helm charts, you merely need to do
the following:

- Put your index and charts in a directory that the server can serve
- Make sure the `index.yaml` file can be accessed with no authentication
  requirement
- Make sure `yaml` files are served with the correct content type (`text/yaml`
  or `text/x-yaml`)

Per esempio, se si vogliono servire i chart da `$WEBROOT/charts`, assicurarsi che ci sia una cartella `charts/` nella propria radice web e inserire il file indice e i chart
all'interno di quella cartella.

### ChartMuseum Repository Server

ChartMuseum è un server di repository Helm Chart open-source scritto in Go
(Golang), con supporto per backend di cloud storage, tra cui [Google Cloud
Storage](https://cloud.google.com/storage/), [Amazon
S3](https://aws.amazon.com/s3/), [Microsoft Azure Blob
Microsoft Azure](https://azure.microsoft.com/en-us/services/storage/blobs/), [Alibaba
Cloud OSS Storage](https://www.alibabacloud.com/product/oss), [Openstack Object
Storage](https://developer.openstack.org/api-ref/object-store/), [Oracle Cloud
Oracle Cloud](https://cloud.oracle.com/storage), [Baidu Cloud
BOS Storage](https://cloud.baidu.com/product/bos.html), [Tencent Cloud Object
Tencent](https://intl.cloud.tencent.com/product/cos), [DigitalOcean
Spaces](https://www.digitalocean.com/products/spaces/),
[Minio](https://min.io/) e [etcd](https://etcd.io/).

È inoltre possibile utilizzare il servizio
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
per ospitare un archivio di chart da un file system locale.

### Registro dei pacchetti GitLab

Con GitLab è possibile pubblicare i chart Helm nel Package Registry del progetto.
Per saperne di più sull'impostazione di un helm package repository con GitLab [qui](https://docs.gitlab.com/ee/user/packages/helm_repository/).

## Gestione dei repository dei grafici

Ora che si dispone di un chart repository, l'ultima parte di questa guida spiega come
come gestire i chart in quel repository.


### Memorizzare i chart nel chart repository

Ora che si dispone di un chart repository, carichiamo un chart e un file di indice nel repository.
I chart in un chart repository devono essere impacchettati (`helm package
nome-della-cartella/`) e correttamente versionati (seguendo le linee guida di [SemVer 2](https://semver.org/)).

I passi successivi compongono un flusso di lavoro di esempio, ma si può usare
qualsiasi flusso di lavoro per memorizzare e aggiornare i chart nel proprio repository.

Una volta pronto un chart pacchettizzato, creare una nuova directory e spostare il chart pacchettizzato in quella directory.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

L'ultimo comando prende il percorso della cartella locale appena creata e l'URL del repository grafico remoto.
l'URL del chart repository remoto e compone un file `index.yaml` all'interno della cartella indicata.

Ora è possibile caricare il chart e il file di indice nel chart repository, utilizzando uno strumento di sincronizzazione o manualmente.
Se si utilizza Google Cloud Storage, si può dare un'occhiata a questo [esempio di flusso di lavoro]({{< relref path="/docs/howto/chart_repository_sync_example.md" lang="en" >}}) utilizzando il client gsutil. Per GitHub, è sufficiente inserire i chart nel branch di destinazione appropriato.

### Aggiungere nuovi chart a un repository esistente

Ogni volta che si desidera aggiungere un nuovo chart al repository, è necessario rigenerare l'indice.

Il comando `helm repo index` ricostruisce completamente il file
`index.yaml` da zero, includendo solo i chart trovati localmente.

Tuttavia, è possibile utilizzare il flag `--merge` per aggiungere in modo incrementale nuovi chart a un file `index.yaml
 esistente (un'ottima opzione quando si lavora con un repository remoto come GCS).
 Eseguire `helm repo index --help` per saperne di più,

Assicurarsi di caricare sia il file `index.yaml` rivisto che il chart. E
se si è generato un file di provenienza, caricare anche quello.

### Condividere i chart con altri

Quando si è pronti a condividere i chart, è sufficiente comunicare a qualcuno l'URL del vostro repository.

Da lì, aggiungeranno il repository al loro client helm tramite il comando `helm repo
add [NAME] [URL]` con il nome che si desidera utilizzare per fare riferimento al repository.

 ``console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts https://fantastic-charts.storage.googleapis.com
```

Se i chart sono supportati dall'autenticazione di base HTTP, si possono fornire anche il nome utente e la password:

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts https://fantastic-charts.storage.googleapis.com
```

**Nota:** Un repository non verrà aggiunto se non contiene un valido file
`index.yaml`.

**Nota:** Se il proprio repository helm utilizza ad esempio un certificato autofirmato, si può usare `helm repo add --insecure-skip-tls-verify ...` per saltare la verifica della CA.

Dopodiché, i vostri utenti saranno in grado di cercare nei vostri chart. Dopo aver
aggiornato il repository, possono usare il comando `helm repo update` per ottenere le ultime
informazioni più recenti sui chart.

*Sotto il cofano, i comandi `helm repo add` e `helm repo update` 
recuperano il file index.yaml e lo memorizzano nella cartella
`$XDG_CACHE_HOME/helm/repository/cache/`. È qui che la funzione `helm
search` trova le informazioni sui chart.
