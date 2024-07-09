---
title: "Chart Hooks"
description: "Descrive come lavorare con i chart hooks."
aliases: ["/docs/charts_hooks/"]
weight: 2
---

Helm fornisce un meccanismo di _hook_ per consentire agli sviluppatori di chart di intervenire in determinati punti del ciclo di vita di una release. Ad esempio, è possibile utilizzare gli hook per:

- Caricare una ConfigMap o un Segreto durante l'installazione prima che vengano caricati altri chart.
- Eseguire un Job per eseguire il backup di un database prima dell'installazione di un nuovo chart e poi eseguire un secondo Job dopo l'aggiornamento per ripristinare i dati.
- Eseguire un Job prima di eliminare una release per togliere in modod gracefully un service dalla rotation prima di rimuoverlo.

Gli hook funzionano come i normali templates, ma hanno annotazioni speciali che fanno sì che Helm li utilizzi in modo diverso.
In questa sezione si illustra il modello d'uso di base degli hook.

## Gli Hook disponibili

Sono definiti i seguenti hook:

| Valore Annotation | Descrizione |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `pre-install` | Viene eseguito dopo il rendering dei modelli, ma prima che vengano create le risorse in Kubernetes |
| `post-install` | Viene eseguita dopo che tutte le risorse sono state caricate in Kubernetes |
| `pre-delete` | Viene eseguito su una richiesta di cancellazione prima che qualsiasi risorsa venga eliminata da Kubernetes |
| `post-delete` | Viene eseguita su una richiesta di cancellazione dopo che tutte le risorse della release sono state cancellate |
| `pre-upgrade` | Viene eseguita una richiesta di aggiornamento dopo che i template sono stati renderizzati, ma prima che le risorse siano aggiornate   |
|`post-upgrade` | Viene eseguita una richiesta di aggiornamento dopo che tutte le risorse sono state aggiornate |
| `pre-rollback` | Viene eseguita una richiesta di rollback dopo che i template sono stati renderizzati, ma prima che le risorse siano state rollbackate |
| `post-rollback` | Viene eseguita una richiesta di rollback dopo che tutte le risorse sono state modificate |
| `test` | Viene eseguita quando viene invocato il sottocomando Helm test ([view test docs](/docs/chart_tests/))              |

Si noti che l'hook `crd-install` è stato rimosso a favore della directory `crds/`.
in Helm 3._

## Hooks e Release Lifecycle

Gli hook consentono allo sviluppatore del chart di eseguire operazioni in punti strategici del ciclo di vita della release. 
Ad esempio, si consideri il ciclo di vita di
un'installazione di `helm`. Per impostazione predefinita, il ciclo di vita appare come segue:

1. L'utente esegue `helm install foo`
2. Viene richiamata l'API di installazione della libreria Helm3. 
Dopo alcune verifiche, la libreria restituisce i manifest `foo`.
4. La libreria carica le risorse risultanti in Kubernetes
5. La libreria restituisce l'oggetto di rilascio (e altri dati) al client.
6. Il client esce

Helm definisce due hook per il ciclo di vita di `install`: `pre-install` e `post-install`.
 Se lo sviluppatore della chart `foo` implementa entrambi gli hook, il ciclo di vita
viene modificato in questo modo:

1. L'utente esegue `helm install foo`
2. Viene richiamata l'API di installazione della libreria Helm
3. Vengono installati i CRD nella directory `crds/`.
4. Dopo alcune verifiche, la libreria esegue il rendering dei template `foo`.
5. La libreria si prepara a eseguire gli hook `pre-install` (caricamento delle risorse hook
   in Kubernetes)
6. La libreria ordina gli hook per peso (assegnando un peso pari a 0 per impostazione predefinita), 
   per tipo di risorsa e infine per nome in ordine crescente.
7. La libreria carica quindi per primo hook con il peso più basso (da negativo a positivo).
8. La libreria attende finché l'hook non è "pronto" (tranne che per i CRD).

9. La libreria carica le risorse risultanti in Kubernetes. Si noti che se il flag
   `--wait` è impostato, la libreria aspetterà che tutte le risorse siano in uno stato di
   ready e non eseguirà l'hook `post-install` finché non saranno pronte.
10. La libreria esegue l'hook `post-install` (caricando le risorse dell'hook).
11. La libreria attende finché l'hook non è "pronto".
12. La libreria restituisce l'oggetto release (e altri dati) al client.
13. Il client esce

Cosa significa aspettare che un hook sia pronto? Dipende dalla risorsa
dichiarata nell'hook. Se la risorsa è del tipo `Job` o `Pod`, Helm attenderà
finché non viene eseguita con successo fino al completamento. Se l'hook fallisce, il rilascio
fallirà. Si tratta di un'operazione _bloccante_, quindi il client Helm si metterà in pausa durante l'esecuzione del Job.

Per tutti gli altri tipi, non appena Kubernetes contrassegna la risorsa come caricata (aggiunta o aggiornata), la risorsa è considerata come caricata.
o aggiornata), la risorsa è considerata "pronta". Quando molte risorse sono
dichiarate in un hook, le risorse vengono eseguite in serie. Se hanno un peso
(vedere sotto), vengono eseguite in ordine ponderato. 
A partire da Helm 3.2.0 le risorse hook con lo stesso peso vengono installate nello stesso delle normali risorse non hook. Altrimenti, l'ordine non è
garantito. (In Helm 2.3.0 e successivi, sono ordinate alfabeticamente. Questo
comportamento, tuttavia, non è considerato vincolante e potrebbe cambiare in futuro). È considerata una buona pratica aggiungere un peso all'hook e impostarlo a `0` se il peso non è importante.

### Le risorse degli hook non sono gestite con i rilasci corrispondenti

Le risorse create da un hook non sono attualmente tracciate o gestite come parte del rilascio.
Una volta che Helm ha verificato che l'hook ha raggiunto lo stato di ready, lascerà la risorsa hook da sola. Il garbage collection delle risorse hook quando
il rilascio corrispondente viene cancellato, potrebbe essere aggiunto a Helm 3 in futuro, per cui
le risorse hook che non devono mai essere cancellate dovrebbero essere annotate con
`helm.sh/resource-policy: keep`.

In pratica, ciò significa che se si creano delle risorse in un hook, non si può fare affidamento su `helm uninstall` per rimuovere le risorse. Per distruggere tali
risorse, è necessario o [aggiungere un'annotazione personalizzata `helm.sh/hook-delete-policy
personalizzata](#politiche-di-cancellazione-degli-hook) al file template dell'hook, oppure [impostare il campo time
to live (TTL) di una risorsa Job](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/).

## Scrivere un hook

Gli hook sono semplicemente file manifest di Kubernetes con annotazioni speciali nella sezione
`metadati`.Essendo file di template, si possono usare tutte le normali funzionalità dei template, tra cui la lettura di `.Values`, `.Release` e
`.Template`.

Per esempio, questo modello, memorizzato in `templates/post-install-job.yaml`,
dichiara un job da eseguire su `post-install`:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}"
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
    app.kubernetes.io/instance: {{ .Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  annotations:
    # This is what defines this resource as a hook. Without this line, the
    # job is considered part of the release.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{ .Release.Name }}"
      labels:
        app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
        app.kubernetes.io/instance: {{ .Release.Name | quote }}
        helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{ default "10" .Values.sleepyTime }}"]

```

Ciò che rende questo template un hook è l'annotazione:

```yaml
annotations:
  "helm.sh/hook": post-install
```

Una risorsa può implementare più hook:

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

Allo stesso modo, non c'è limite al numero di risorse diverse che possono
implementare un determinato hook. Per esempio, si potrebbero dichiarare sia un segreto che una config map
come pre-install hook.

Quando i chart secondari dichiarano degli hook, anche questi vengono valutati. Non c'è modo per un chart di
di livello superiore di disabilitare gli hook dichiarati dai sottochart.

È possibile definire un peso per un hook, che aiuterà a costruire un ordine di esecuzione deterministico. I pesi si definiscono utilizzando la seguente
annotazione:

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

I pesi degli hook possono essere numeri positivi o negativi, ma devono essere rappresentati come
stringhe. Quando Helm avvia il ciclo di esecuzione degli hook di un particolare tipo, li ordina modo crescente.

### Politiche di cancellazione degli hook

È possibile definire delle politiche che determinano quando eliminare le
risorse degli hook corrispondenti. Le politiche di cancellazione degli hook sono definite usando la seguente
annotazione:

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

È possibile scegliere uno o più valori di annotazione definiti:

| Annotation Value       | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `before-hook-creation` | Elimina la risorsa precedente prima che venga lanciato un nuovo hook (impostazione predefinita) |
| `hook-succeeded`       | Eliminare la risorsa dopo che l' hook è stato eseguito con successo          |
| `hook-failed`          | Elimina la risorsa se l'hook fallisce durante l'esecuzione              |

Se non è specificata alcuna annotazione relativa alla politica di cancellazione degli hook, si applica il comportamento `before-hook-creation` per impostazione predefinita.
