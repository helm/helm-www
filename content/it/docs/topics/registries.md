---
title: "Utilizzare registry OCI-based"
description: "Descrive come utilizzare OCI per la distribuzione dei chart."
aliases: ["/docs/registries/"]
weight: 7
---

A partire da Helm 3, è possibile utilizzare i registry dei container con supporto [OCI](https://www.opencontainers.org/) per memorizzare e condividere i pacchetti di chart. A partire da Helm v3.8.0, il supporto OCI è abilitato per impostazione predefinita. 

## Supporto OCI prima della v3.8.0

Con Helm v3.8.0 il supporto OCI è passato da sperimentale a disponibile in generale. Nelle versioni precedenti di Helm, il supporto OCI si comportava in modo diverso. Se si utilizzava il supporto OCI prima di Helm v3.8.0, è importante capire cosa è cambiato con le diverse versioni di Helm.

### Abilitazione del supporto OCI prima della v3.8.0

Prima di Helm v3.8.0, il supporto OCI è *sperimentale* e deve essere abilitato.

Per abilitare il supporto sperimentale di OCI per le versioni di Helm precedenti alla v3.8.0, impostare la variabile d'ambiente `HELM_EXPERIMENTAL_OCI`. Ad esempio:

```console
export HELM_EXPERIMENTAL_OCI=1
```

### Deprecazione di funzioni OCI e cambiamenti di comportamento con la versione 3.8.0

Con il rilascio di [Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0), le seguenti caratteristiche e comportamenti sono diversi dalle versioni precedenti di Helm:

- Quando si imposta un chart nelle dipendenze come OCI, la versione può essere impostata su un intervallo come le altre dipendenze.
- I tag SemVer che includono informazioni sulla compilazione possono essere pushed e utilizzati. I registries OCI non supportano il carattere `+` come tag. Helm traduce il `+` in `_` quando viene memorizzato come tag.
- Il comando `helm registry login` segue ora la stessa struttura della Docker CLI per la memorizzazione delle credenziali. Lo stesso path per la configurazione del registry può essere passato sia a Helm che alla Docker CLI.

### Deprecazione di funzioni OCI e cambiamenti di comportamento con la v3.7.0

Il rilascio di [Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) ha incluso l'implementazione di [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) per il supporto di OCI. Di conseguenza, le seguenti caratteristiche e comportamenti sono diversi dalle versioni precedenti di Helm:

- Il sottocomando `helm chart` è stato rimosso.
- La cache dei chart è stata rimossa (niente `helm chart list` ecc.).
- I riferimenti al registry OCI sono ora sempre preceduti da `oci://`.
- Il nome di base del riferimento al registry deve *sempre* corrispondere al nome del chart.
- Il tag del riferimento al registry deve *sempre* corrispondere alla versione semantica del chart (quindi nessun tag `latest`).
- Il tipo di supporto del chart è stato cambiato da `application/tar+gzip` a `application/vnd.cncf.helm.chart.content.v1.tar+gzip`.


## Utilizzo di un registry OCI-based

### Helm repositories in registry OCI-based

Un [repository Helm] ({{< ref "chart_repository.md" >}}) è un modo per ospitare e distribuire i chart Helm pacchettizzati. Un registry basato su OCI può contenere zero o più repository Helm e ognuno di questi repository può contenere zero o più chart Helm pacchettizzati.

### Use hosted registries

Esistono diversi registri di container ospitati con supporto OCI che si possono usare per i chart di Helm. Ad esempio:

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)
  

Seguire la documentazione del fornitore del container registry ospitati per creare e configurare un registry con supporto OCI. 

**Nota:** È possibile eseguire [Docker Registry](https://docs.docker.com/registry/deploying/) o [`zot`](https://github.com/project-zot/zot), che sono registries basati su OCI, sul computer di sviluppo. L'esecuzione di un registry basato su OCI sul computer di sviluppo deve essere utilizzata solo a scopo di test.

### Usare sigstore per firmare i chart basati su OCI

Il plugin [`helm-sigstore`](https://github.com/sigstore/helm-sigstore) permette di usare [Sigstore](https://sigstore.dev/) per firmare i chart Helm con gli stessi strumenti usati per firmare le immagini dei container.  Questo fornisce un'alternativa alla [Provenienza basata su GPG]({{< ref "provenance.md" >}}) supportata dai classici [chart repository]({{< ref "chart_repository.md" >}}).

Per maggiori dettagli sull'uso del plugin `helm sigstore`, vedere [la documentazione del progetto](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md).

## Comandi per lavorare con i registries

### il sottocomando `registry`

#### `login`

accesso a un registry (con inserimento manuale della password)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

logout da un registry

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### Il sottocomando `push`

Carica un chart in un registry basato su OCI:

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

Il sottocomando `push` può essere utilizzato solo per i file `.tgz
creati in anticipo con `helm package`.

Quando si usa `helm push` per caricare un chart in un registro OCI, il riferimento
deve essere preceduto da `oci://` e non deve contenere il nome di base o il tag.

Il nome di base del registry viene dedotto dal nome del chart,
e il tag viene dedotto dalla versione semantica del chart. Questo è
attualmente un requisito rigoroso.

Alcuni registry richiedono che il repository e/o lo spazio dei nomi (se specificato).
siano stati creati in precedenza. In caso contrario, verrà prodotto un errore durante l'operazione `helm push`.

Se è stato creato un [file di provenienza] ({{< ref "provenance.md" >}}) (`.prov`), ed è presente accanto al file `.tgz` del chart, esso sarà
 automaticamente caricato nel registry al momento del `push`. Questo comporta
un livello in più nel [Helm chart manifest] (#helm-chart-manifest).

Gli utenti del plugin [helm-push](https://github.com/chartmuseum/helm-push) (per caricare i chart su [ChartMuseum]({{< ref "chart_repository.md" >}}#chartmuseum-repository-server))
potrebbe avere dei problemi, poiché il plugin va in conflitto con il nuovo `push` integrato.
A partire dalla versione v0.10.0, il plugin è stato rinominato in `cm-push`.

### Altri sottocomandi

Il supporto per il protocollo `oci://` è disponibile anche in vari altri sottocomandi.
Ecco un elenco completo:

- `helm pull`
- `helm show `
- `helm template`
- `helm install`
- `helm upgrade`

Il nome di base (nome del chart) del riferimento al registry *è* incluso in ogni tipo di azione che comporta il download di un chart
(rispetto a `helm push` dove viene omesso).

Ecco alcuni esempi di utilizzo dei sottocomandi sopra elencati contro
grafici basati su OCI:

```
$ helm pull oci://localhost:5000/helm-charts/mychart --version 0.1.0
Pulled: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:0be7ec9fb7b962b46d81e4bb74fdcdb7089d965d3baca9f85d64948b05b402ff

$ helm show all oci://localhost:5000/helm-charts/mychart --version 0.1.0
apiVersion: v2
appVersion: 1.16.0
description: A Helm chart for Kubernetes
name: mychart
...

$ helm template myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
---
# Source: mychart/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
...

$ helm install myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...

$ helm upgrade myrelease oci://localhost:5000/helm-charts/mychart --version 0.2.0
Release "myrelease" has been upgraded. Happy Helming!
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
NOTES:
...
```

## Specificare le dipendenze

Le dipendenze di un chart possono essere recuperate da un registry usando il sottocomando `dependency update`.

Il `repository` per una data voce in `Chart.yaml` è specificato come riferimento al registry senza il nome di base:

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
Questo recupererà `oci://localhost:5000/myrepo/mychart:2.7.0` quando viene eseguito `dependency update`.

## Helm chart manifest

Esempio di manifest del chart Helm rappresentato in un registry
(notare i campi `mediaType`):

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

Il seguente esempio contiene un 
[provenance file]({{< ref "provenance.md" >}})
(notare il layer extra):

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

## Migrazione da un chart repo

La migrazione dai classici [chart repository]({{< ref "chart_repository.md" >}})
(repository basati su index.yaml) è semplice usando `helm pull`, poi `helm push` per caricare i file `.tgz` in un registry.


