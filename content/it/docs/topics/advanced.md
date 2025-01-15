---
title: "Tecniche Avanzate di Helm"
description: "Spiega varie funzioni avanzate per i power user di Helm"
aliases: ["/docs/advanced_helm_techniques"]
weight: 9
---

Questa sezione illustra varie funzioni e tecniche avanzate di utilizzo di Helm.
Le informazioni contenute in questa sezione sono destinate ai "power user" di Helm che desiderano
personalizzare e manipolare in modo avanzato i charts e le release. Ognuna di queste funzioni avanzate comporta dei compromessi e degli avvertimenti, per cui
ognuna di esse deve essere utilizzata con attenzione e con una conoscenza approfondita di Helm. O in altre parole,
ricordate il [principio di Peter Parker](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility)

## Post Rendering
Il post rendering offre agli installatori di Charts la possibilità di manipolare manualmente,
configurare e/o convalidare i manifesti renderizzati prima che vengano installati da Helm.
Questo permette agli utenti con esigenze di configurazione avanzate di poter usare strumenti come [`kustomize`](https://kustomize.io) per applicare le modifiche alla configurazione senza la necessità di dover fare il fork di un chart pubblico o senza richiedere ai manutentori del chart di specificare ogni singola opzione di
per un pezzo di software. Esistono anche casi d'uso per iniettare strumenti comuni e macchine secondarie in ambienti aziendali o l'analisi dei manifesi prima della distribuzione.

### Prerequisiti
- Helm 3.1+

### Utilizzo
Un post-renderer può essere un qualsiasi eseguibile che accetta manifest Kubernetes renderizzati
su STDIN e restituisce manifest Kubernetes validi su STDOUT. Dovrebbe restituire
un codice di uscita non-0 in caso di fallimento. Questa è l'unica "API" tra i
due componenti. Permette una grande flessibilità in ciò che si può fare con il processo di
post-rendering.

Un post renderer può essere usato con `install`, `upgrade` e `template`. Per usare un
post-renderer, usare il flag `--post-renderer` con il percorso del renderer
che si desidera utilizzare:

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

Se il percorso non contiene separatori, la ricerca verrà effettuata in $PATH, altrimenti
risolverà qualsiasi percorso relativo in un percorso completamente qualificato.

Se si desidera utilizzare più post-renderizzatori, richiamateli tutti in uno script o
insieme in un qualsiasi strumento binario con cui è stato implementato. In bash, questo potrebbe essere
semplice come `renderer1 | renderer2 | renderer3`.

Si può vedere un esempio di utilizzo di `kustomize` come renderizzatore di post
[qui](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render).

### Avvertenze
Quando si usano i postrenderer, ci sono diverse cose importanti da tenere a mente.
La più importante è che quando si usa un post renderer, tutte le persone che modificano quella release **DOVREBBERO** usare lo stesso renderizzatore per poter essere
ripetibili. Questa caratteristica è stata costruita appositamente per consentire a qualsiasi utente di
cambiare il renderer che sta utilizzando o di smettere di usare un renderer, ma questo
dovrebbe essere fatto deliberatamente per evitare modifiche accidentali o perdite di dati.

Un'altra nota importante riguarda la sicurezza. Se si usa un post-renderer, bisogna assicurarsi che provenga da una fonte affidabile (come nel caso di qualsiasi altro eseguibile arbitrario
). L'uso di renderizzatori non affidabili o non verificati NON è raccomandato, in quanto hanno pieno accesso ai modelli renderizzati, che spesso contengono dati
dati segreti.

### Post renderer personalizzati
La fase di post renderer offre una flessibilità ancora maggiore se utilizzata con l'SDK Go. Ogni post renderer deve solo implementare la seguente interfaccia di Go:

```go
type PostRenderer interface {
    // Run expects a single buffer filled with Helm rendered manifests. It
    // expects the modified results to be returned on a separate buffer or an
    // error if there was an issue or failure while running the post render step
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

Per ulteriori informazioni sull'uso di Go SDK, vedere la sezione [Go SDK](#go-sdk).

## Go SDK
Helm 3 ha presentato un SDK per Go completamente ristrutturato per una migliore esperienza nella
di creazione di software e strumenti che sfruttano Helm. La documentazione completa è disponibile
all'indirizzo [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3), ma
una breve panoramica di alcuni dei pacchetti più comuni e di un semplice esempio qui di seguito.

## Storage backends

Helm 3 ha cambiato il default in cui memorizzare le informazioni sul rilascio in Secrets nel namespace della release. Helm 2 per impostazione predefinita memorizza le informazioni della release in
ConfigMaps nel namespace dell'istanza di Tiller. Le sottosezioni che seguono
mostrano come configurare i diversi backend. Questa configurazione si basa sulla 
variabile d'ambiente `HELM_DRIVER`. Può essere impostata su uno dei valori:
`[configmap, secret, sql]`.

###  Storage backend ConfigMap

Per abilitare il backend ConfigMap, è necessario impostare la variabile d'ambiente
`HELM_DRIVER` a `configmap`.

Si può impostare in una shell come segue:

```shell
export HELM_DRIVER=configmap
```

Se si vuole passare dal backend predefinito a quello ConfigMap, si 
dovrà fare la migrazione autonomamente. È possibile recuperare le informazioni sulla release
con il seguente comando:

```shell
kubectl get secret --all-namespaces -l “owner=helm”
```

**NOTE DI PRODUZIONE**: Le informazioni sulla release includono il contenuto dei chart e dei values file, e quindi potrebbero contenere dati sensibili (come
password, chiavi private e altre credenziali) che devono essere protetti dall'accesso non autorizzato. Quando si gestisce l'autorizzazione di Kubernetes, ad esempio con
[RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), è possibile
concedere un accesso più ampio alle risorse ConfigMap, mentre si limita l'accesso alle risorse Secret. 
Ad esempio, il ruolo predefinito [user-facing
utente](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)
“view” garantisce l'accesso alla maggior parte delle risorse, ma non ai Secret. Inoltre, i dati dei Secret
possono essere configurati per [archiviazione criptata](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/).
Si tenga presente questo aspetto se si decide di passare al backend ConfigMap, perché potrebbe esporre i dati sensibili dell'applicazione.

### Storage backend SQL

Esiste uno storage backend SQL ***beta*** che memorizza le informazioni di rilascio in un database SQL.

L'uso di uno storage backend di questo tipo è particolarmente utile se le informazioni sulla release
pesano più di 1 MB (nel qual caso non possono essere memorizzate in ConfigMaps/Secrets).
a causa dei limiti nello storage key-values di etcd in Kubernetes).

Per abilitare il backend SQL, è necessario distribuire un database SQL e impostare la variabile d'ambiente `HELM_DRIVER' a `sql`. I dettagli del DB sono impostati con la variabile d'ambiente `HELM_DRIVER_SQL_CONNECTION_STRING`.

È possibile impostarla in una shell come segue:

``shell
esportare HELM_DRIVER=sql
export HELM_DRIVER_SQL_CONNECTION_STRING=postgresql://helm-postgres:5432/helm?user=helm&password=changeme
```

> Nota: al momento è supportato solo PostgreSQL.

**NOTE DI PRODUZIONE**: Si raccomanda di:
- Preparare il database alla produzione. Per PostgreSQL, consultare i documenti di [Server Administration](https://www.postgresql.org/docs/12/admin.html) per maggiori dettagli.
- Abilitare la [gestione dei permessi](/docs/permissions_sql_storage_backend/) per
rispecchiare le RBAC di Kubernetes per le informazioni della release

Se si vuole passare dal backend predefinito al backend SQL, si dovrà
fare la migrazione in autonomia. È possibile recuperare le informazioni sulla release
con il seguente comando:

``shell
kubectl get secret --all-namespaces -l “owner=helm”
```