---
title: "Role-based Access Control"
description: "Spiega come Helm interagisce con il Role-Based Access Control di Kubernetes."
aliases: ["/docs/rbac/"]
weight: 11
---

In Kubernetes, l'assegnazione di ruoli a un utente o a un account di servizio specifico per un'applicazione
è una pratica ottimale per garantire che l'applicazione operi nell'ambito
 specificato. Per saperne di più sui permessi dei service account  leggere la [
documentazione ufficiale di Kubernetes] (https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions).

A partire da Kubernetes 1.6, il Role-based Access Control è abilitato per impostazione predefinita.
RBAC consente di specificare quali tipi di azioni sono consentite a seconda dell'utente e del suo ruolo nell'organizzazione.

Con RBAC, è possibile

- concedere operazioni privilegiate (creazione di risorse a livello di cluster, come nuovi ruoli)
  agli amministratori
- limitare la capacità di un utente di creare risorse (pod, volumi persistenti,
  deployment) a specifici namespace o in ambiti a livello di cluster (quote di risorse, ruoli, definizioni di risorse personalizzate).
- limitare la capacità di un utente di visualizzare le risorse in namespace specifici o a livello di cluster.

Questa guida è destinata agli amministratori che desiderano limitare l'ambito di interazione di un utente con l'API Kubernetes.

## Gestione degli account utente

Tutti i cluster Kubernetes hanno due categorie di utenti: i service accounts gestiti da Kubernetes e gli utenti normali.

Si presume che gli utenti normali siano gestiti da un servizio esterno e indipendente. Un amministratore che distribuisce le chiavi private, uno user store come Keystone o Google
Accounts, persino un file con un elenco di nomi utente e password. A questo proposito, Kubernetes non dispone di oggetti che rappresentano i normali account utente. 
Gli utenti normali non possono essere aggiunti a un cluster tramite una chiamata API.

Al contrario, i service account sono utenti gestiti dall'API di Kubernetes. Sono
 vincolati a specifici namespace e creati automaticamente dal server API o
manualmente tramite chiamate API. I service account sono legati a un insieme di credenziali memorizzate come Secrets, che vengono montate nei pod e che consentono ai processi in cluster di
interagire con l'API di Kubernetes.

Le richieste API sono legate a un utente normale o a un service account, oppure sono trattate come richieste anonime.
 Questo significa che ogni processo all'interno o all'esterno del
cluster, dall'utente umano che digita `kubectl` su una workstation, alle kubelets sui nodi, ai membri del sistema di controllo devono autenticarsi quando effettuano richieste
al server API, o essere trattato come un utente anonimo.

## Ruoli, ClusterRoles, RoleBindings e ClusterRoleBindings

In Kubernetes, gli account utente e i service account possono visualizzare e modificare solo le risorse a cui è stato concesso l'accesso. Questo accesso viene concesso attraverso l'uso di Ruoli e RoleBindings. I ruoli e i RoleBindings sono vincolati a un particolare
namespace, che concedono agli utenti la possibilità di visualizzare e/o modificare le risorse all'interno di quel namespace a cui il ruolo fornisce l'accesso.

A livello di cluster, questi sono chiamati ClusterRoles e ClusterRoleBindings.
La concessione di un ClusterRole a un utente garantisce l'accesso alla visualizzazione e/o alla modifica di risorse nell'intero cluster. È inoltre necessario per visualizzare e/o modificare le risorse a livello del cluster (namespace, quote di risorse, nodi).

 I ClusterRole possono essere vincolati a un particolare namespace attraverso un riferimento in un
RoleBinding. I ClusterRoles predefiniti `admin`, `edit` e `view` sono comunemente utilizzati in questo modo.

Questi sono alcuni ClusterRoles disponibili di default in Kubernetes. Sono
 intesi come ruoli rivolti all'utente. Includono i ruoli di super-utente
(`cluster-admin`) e ruoli con accesso più granulare (`admin`, `edit`,
`view`).

| Default ClusterRole | Default ClusterRoleBinding | Description
|---------------------|----------------------------|-------------
| `cluster-admin`     | `system:masters` group     | Consente l'accesso al superutente per eseguire qualsiasi azione su qualsiasi risorsa. Se usato in un ClusterRoleBinding, dà il pieno controllo su ogni risorsa del cluster e su tutti i namespace. Se usato in un RoleBinding, dà il pieno controllo su ogni risorsa nel namespace del rolebinding, compreso namespace stesso.
| `admin`             | Nessuno                       | Consente l'accesso come amministratore, da concedere all'interno di un namespace utilizzando un RoleBinding. Se usato in un RoleBinding, consente l'accesso in lettura/scrittura alla maggior parte delle risorse di un namespace, compresa la possibilità di creare ruoli e rolebindings all'interno del namespace. Non consente l'accesso in scrittura alla quota di risorse o al namespace stesso.
| `edit`              | Nessuno                       | Consente l'accesso in lettura/scrittura alla maggior parte degli oggetti di un namespace. Non consente di visualizzare o modificare i ruoli o i rolebindings.
| `view`              | Nessuno                       | Consente l'accesso in sola lettura alla maggior parte degli oggetti di un namespace. Non consente di visualizzare i ruoli o i rolebindings. Non consente di visualizzare i secret, poiché questi sono a valore elevato.

## Limitare l'accesso di un account utente utilizzando RBAC

Ora che abbiamo compreso le basi del controllo degli accessi basato sui ruoli, discutiamo di come un amministratore può limitare l'accesso di un utente.

### Esempio: Concedere a un utente l'accesso in lettura/scrittura a un particolare namespace

Per limitare l'accesso di un utente a un particolare namespace, si può usare il ruolo
`edit` o il ruolo `admin`. Se i vostri chart creano o interagiscono con i Ruoli e i
Rolebindings, si vorrà utilizzare il ClusterRole `admin`.

Inoltre, è possibile creare un RoleBinding con accesso `cluster-admin`.
Concedere a un utente l'accesso `cluster-admin` all'ambito del namespace fornisce il pieno controllo su tutte le risorse del namespace, compreso il namespace stesso.

In questo esempio, creeremo un utente con il ruolo `edit`. Per prima cosa, creare il namespace:

```console
$ kubectl create namespace foo
```

Ora, creare un RoleBinding in questo namespace, assegnando all'utente il ruolo `edit`.

```console
$ kubectl create rolebinding sam-edit
    --clusterrole edit \​
    --user sam \​
    --namespace foo
```

### Esempio: Concedere a un utente l'accesso in lettura/scrittura all'ambito del cluster

Se un utente desidera installare un chart che installa risorse di ambito cluster (namespace, ruoli, definizioni di risorse personalizzate, ecc.) necessita di 
accesso in scrittura all'ambito del cluster.

Per farlo, si deve concedere all'utente l'accesso `admin` o `cluster-admin`.

Concedere a un utente l'accesso `cluster-admin` garantisce l'accesso a tutte le 
risorse disponibili in Kubernetes, compreso l'accesso ai nodi con `kubectl drain` e altri compiti amministrativi. Si raccomanda vivamente di considerare di fornire all'utente l'accesso `admin` o di creare un ClusterRole personalizzato per le sue esigenze.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

### Esempio: Concedere a un utente l'accesso in sola lettura a un particolare spazio dei nomi

Si sarà notato che non c'è un ClusterRole disponibile per visualizzare i secret. Il ClusterRole `view` non concede a un utente l'accesso in lettura ai secret, per motivi di escalation. Helm memorizza i metadati di rilascio come secret per impostazione predefinita.

Per poter eseguire `helm list`, un utente deve essere in grado di leggere i secret. Per questo, si creerà uno speciale ClusterRole `secret-reader`.

Creare il file `cluster-role-secret-reader.yaml` e scrivervi il seguente contenuto nel file:

```yaml
apiVersion: rbac.authorization.k8s.io/v1​
kind: ClusterRole​
metadata:​
  name: secret-reader​
rules:​
- apiGroups: [""]​
  resources: ["secrets"]​
  verbs: ["get", "watch", "list"]
```

Quindi, creare il ClusterRole usando

```console
$ kubectl create -f clusterrole-secret-reader.yaml​
```

Una volta fatto questo, possiamo concedere a un utente l'accesso in lettura alla maggior parte delle risorse, e poi l'accesso in lettura ai secrets:

```console
$ kubectl create namespace foo

$ kubectl create rolebinding sam-view
    --clusterrole view \​
    --user sam \​
    --namespace foo

$ kubectl create rolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam \​
    --namespace foo
```

### Esempio: Concedere a un utente l'accesso in sola lettura all'ambito del cluster

In alcuni scenari, può essere utile concedere a un utente l'accesso all'ambito del cluster.
Ad esempio, se un utente vuole eseguire il comando `helm list --all-namespaces`,
l'API richiede che l'utente abbia accesso in lettura all'ambito del cluster.

Per farlo, si deve concedere all'utente l'accesso `view` e `secret-reader` come descritto sopra, ma con un ClusterRoleBinding.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

## Riflessioni aggiuntive

Gli esempi mostrati sopra utilizzano i ClusterRoles predefiniti forniti con
Kubernetes. Per un controllo più dettagliato sulle risorse a cui gli utenti hanno accesso, si può consultare [la documentazione di Kubernetes
https://kubernetes.io/docs/reference/access-authn-authz/rbac/) sulla creazione di Roles e ClusterRoles personalizzati.
