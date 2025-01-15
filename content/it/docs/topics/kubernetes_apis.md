---
title: "API Kubernetes Deprecate"
description: "Spiega le API Kubernetes deprecate in Helm"
aliases: ["docs/k8s_apis/"]
---

Kubernetes è un sistema basato su API e l'API si evolve nel tempo per riflettere l'evoluzione della 
comprensione dello spazio problematico. Questa è una pratica comune a tutti i
sistemi e le loro API. Una parte importante dell'evoluzione delle API è una buona politica e un processo di deprecazione
e un processo che informi gli utenti sulle modalità di implementazione delle modifiche alle API. In altre parole, i consumatori della vostra API devono sapere in anticipo e in quale release
un'API sarà rimossa o modificata. 
In questo modo si elimina l'elemento sorpresa e
di cambiamenti che possono causare interruzioni per i consumatori.

Il [Kubernetes deprecation
policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)
documenta come Kubernetes gestisce le modifiche alle versioni delle sue API. La politica di
deprecazione indica l'arco di tempo in cui le versioni delle API saranno supportate in seguito a un
annuncio di deprecazione. È quindi importante essere a conoscenza degli annunci di deprecazione e sapere quando le versioni delle API
e verranno rimosse, per ridurre al minimo l'effetto.

Questo è un esempio di annuncio [per la rimozione di versioni API deprecate
deprecate in Kubernetes
1.16](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/) ed è stato
pubblicizzato alcuni mesi prima del rilascio. Queste API sarebbero state
annunciate per la deprecazione prima di questo rilascio. Questo dimostra che esiste una buona
politica che informa i consumatori sul supporto delle versioni delle API.

I template di Helm specificano un [Kubernetes API 
group](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups)
quando si definisce un oggetto Kubernetes, simile a un file manifest Kubernetes. Viene
specificato nel campo `apiVersion` del template e identifica la versione dell'API
dell'oggetto Kubernetes. Questo significa che gli utenti di Helm e i manteiner dei chart 
Helm devono sapere quando le versioni delle API di Kubernetes sono state deprecate e in quale versione di Kubernetes saranno rimosse.

## Maintainers dei chart

È necessario controllare i chart per verificare la presenza di versioni dell'API Kubernetes che siano
deprecate o rimosse in una versione di Kubernetes. Le versioni dell'API trovate come deprecate
o che non sono più supportate, dovrebbero essere aggiornate alla versione supportata e rilasciata una nuova versione del chart. La versione dell'API è definita dai parametri 
`kind` e `apiVersion`. Ad esempio, un oggetto `Deployment` rimosso
nella versione API di Kubernetes 1.16:

```yaml
apiVersion: apps/v1beta1
kind: Deployment
```

## Utenti Helm

È necessario verificare i chart che si utilizzano (in modo simile a [chart
maintainers](#maintainers-dei-chart)) e identificare tutti i chart in cui le versioni delle API sono
deprecate o rimosse in una versione di Kubernetes. Per i chart identificati, è necessario verificare l'ultima versione del chart (che ha versioni API supportate) o aggiornare il chart da soli.

Inoltre, è necessario verificare tutti i chart distribuiti (ad esempio, i rilasci di Helm).
verificando nuovamente la presenza di versioni API deprecate o rimosse. Questo può essere fatto
ottenendo i dettagli di una release con il comando `helm get manifest`.

I mezzi per aggiornare una release di Helm alle API supportate dipendono dalle vostre scoperte
come segue:

1. Se si trovano versioni API deprecate solo allora:
  - Eseguire un `aggiornamento` con una versione del chart con versioni API di Kubernetes supportate.
  
- Aggiungere una descrizione nell'aggiornamento, qualcosa del tipo di non eseguire un     rollback a una versione di Helm precedente a quella attuale.

2.  Se si trova una o più versioni di API che sono state rimosse in una versione di Kubernetes
    allora:
  - Se si sta eseguendo una versione di Kubernetes in cui la versione o le versioni API sono ancora
    disponibili (ad esempio, si è su Kubernetes 1.15 e si è scoperto di utilizzare API
    che saranno rimosse in Kubernetes 1.16):
    - Seguire la procedura del passo 1
  - In caso contrario (ad esempio, si sta già utilizzando una versione di Kubernetes dove
    alcune versioni di API segnalate da `helm get manifest` non sono più disponibili):
    - È necessario modificare il manifest di rilascio memorizzato nel cluster per
      aggiornare le versioni delle API a quelle supportate. Vedere [Aggiornamento delle versioni API di un Release Manifest](#aggiornamento-delle-versioni-api-di-un-release-manifest) per maggiori dettagli.

> Nota: in tutti i casi di aggiornamento di una release di Helm con API supportate, non si dovrebbe
mai eseguire il rollback della release a una versione precedente a quella con le API supportate.

> Raccomandazione: La pratica migliore è quella di aggiornare le release che utilizzano API deprecate     alle versioni API supportate, prima di eseguire l'aggiornamento a un cluster kubernetes che rimuove tali versioni API.

Se non si aggiorna una release come suggerito in precedenza, si verificherà un errore
simile al seguente quando si tenta di aggiornare una release in una versione Kubernetes
in cui la versione o le versioni API sono state rimosse:

```
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s)
for this kubernetes version and it is therefore unable to build the kubernetes
objects for performing the diff. error from kubernetes: unable to recognize "":
no matches for kind "Deployment" in version "apps/v1beta1"
```

Helm fallisce in questo scenario perché tenta di creare una patch diff tra la release correntemente distribuita (che contiene le API di Kubernetes che vengono

rimosse in questa versione di Kubernetes) rispetto al chart che si sta passando con le 
versioni aggiornate/supportate delle API. Il motivo del fallimento è che quando     Kubernetes rimuove una versione dell'API, la libreria client di Kubernetes Go non è più in grado di analizzare gli oggetti deprecati e quindi Helm fallisce quando chiama la libreria.
 Helm purtroppo non è in grado di riprendersi da questa situazione e non è più in grado di gestire un simile rilascio. 
 Vedere [Aggiornamento delle versioni API di un Release Manifest](#aggiornamento-delle-versioni-api-di-un-release-manifest) per maggiori dettagli su come recuperare da questo scenario.

## Aggiornamento delle versioni API di un Release Manifest

Il manifest è una proprietà dell'oggetto Helm release che viene memorizzata nel campo  dati di un Secret (predefinito) o di ConfigMap nel cluster. Il campo dati 
contiene un oggetto gzipped codificato in base 64 (c'è un'ulteriore codifica in base 64 per un Secret). 
Esiste un Secret/ConfigMap per release nel namespace della release.

È possibile utilizzare il plugin Helm [mapkubeapis](https://github.com/helm/helm-mapkubeapis)
per eseguire l'aggiornamento di una release alle API supportate. Consultare il readme
per maggiori dettagli.

In alternativa, si possono seguire i seguenti passaggi manuali per eseguire l'aggiornamento delle versioni APIdi un manifest di rilascio. 
A seconda della configurazione, si seguiranno
i passi per il backend Secret o la ConfigMap.

- Ottenere il nome del Segreto o della Configmap associata all'ultima release distribuita :
  - backend Secrets: `kubectl get secret -l 
    owner=helm,status=deployed,name=<nome_release> --namespace
    <namespace_di_rilascio> | awk '{print $1}' | grep -v NAME`   
- ConfigMap backend: `kubectl get configmap -l
    owner=helm,status=deployed,name=<nome_rilasciato> --namespace
    <namespace_di_rilascio> | awk '{print $1}' | grep -v NAME`
- Ottenere i dettagli dell'ultimo rilascio distribuito:
  - Secrets backend: `kubectl get secret <nome_segreto_di_rilascio> -n
    <release_namespace> -o yaml > release.yaml`
  - ConfigMap Backend: `kubectl get configmap <release_configmap_name> -n
    <namespace_di_rilascio> -o yaml > release.yaml`
- Eseguire il backup del rilascio, nel caso sia necessario ripristinarlo se qualcosa va storto:
  - `cp release.yaml release.bak`
  - In caso di emergenza, ripristinare: `kubectl apply -f release.bak -n
    <namespace_di_rilascio>`
- Decodificare l'oggetto release:
  - Secrets backend:`cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d
    | base64 -d | gzip -d > release.data.decoded`
  - ConfigMap backend: `cat release.yaml | grep -oP '(?<=release: ).*' | base64
    -d | gzip -d > release.data.decoded`
- Cambia le versioni API dei manifest. Si può usare qualsiasi strumento (per esempio un editor) per apportare le modifiche. 
Questo si trova nel campo `manifest` dell'oggetto release decodificato (`release.data.decoded`)
- Codifica l'oggetto release: 
  - Secrets backend: `cat release.data.decoded | gzip | base64 | base64`
  - ConfigMap backend: `cat release.data.decoded | gzip | base64`
- Sostituire il valore della proprietà `data.release` nel file di rilascio distribuito   
(`release.yaml`) con il nuovo oggetto di rilascio codificato
- Applicare il file allo nel namespace: `kubectl apply -f release.yaml -n
  <namespace_di_rilascio>`
- Eseguire un `helm upgrade` con una versione del chart con le versioni supportate di API Kubernetes
- Aggiungere una descrizione nell'aggiornamento, qualcosa del tipo di non eseguire un
  rollback a una versione di Helm precedente a questa versione attuale
