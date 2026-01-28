---
title: "Testare i Chart"
description: "Descrive come eseguire e testare i chart."
aliases: ["/docs/chart_tests/"]
weight: 3
---

Un chart contiene una serie di risorse e componenti Kubernetes che lavorano insieme. Come autore di un chart, potresti voler scrivere alcuni test che convalidino che il tuo chart funzioni come previsto quando viene installato. Questi test aiutano anche l'utente del chart a capire cosa dovrebbe fare il chart.

Un **test** in un chart helm si trova nella cartella `templates/` ed è una definizione di lavoro che specifica un container con un determinato comando da eseguire. Il container
deve terminare con successo (exit 0) perché il test sia considerato superato. La definizione del job deve contenere l'annotazione helm test hook: `helm.sh/hook: test`.

Si noti che fino a Helm v3, la definizione del job doveva contenere una di queste annotazioni helm test hook: `helm.sh/hook: test-success` o `helm.sh/hook: test-failure`.
`helm.sh/hook: test-success` è ancora accettato come alternativa retro-compatibile a `helm.sh/hook: test`.

Test di esempio:

- Validare che la configurazione del file values.yaml sia stata iniettata correttamente.
  - Verificare che il nome utente e la password funzionino correttamente
  - Assicurarsi che un nome utente e una password non corretti non funzionino.
- Verificare che i servizi siano attivi e che il bilanciamento del carico sia corretto
- ecc.

È possibile eseguire i test predefiniti in Helm su una release utilizzando il comando `helm
test <NOME_RELEASE>`. Per un utente del chart, questo è un ottimo modo per verificare che la propria release di un chart (o di un'applicazione) funzioni come previsto.

## Esempio di test

Il comando [helm create](/docs/helm/helm_create) creerà automaticamente una serie di cartelle e file. Per provare la funzionalità di test di helm, creare prima un chart demo. 

```console
$ helm create demo
```

Ora sarà possibile vedere la seguente struttura nel chart demo.

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

In `demo/templates/tests/test-connection.yaml` si trova un test che si può provare. È possibile vedere la definizione del pod di test di helm qui:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "demo.fullname" . }}-test-connection"
  labels:
    {{- include "demo.labels" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "demo.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never

```

## Passi per eseguire una suite di test su una release

Per prima cosa, installare il chart sul cluster per creare una release. Potrebbe essere necessario
attendere che tutti i pod siano attivi; se si esegue il test subito dopo l'installazione, è probabile che si verifichi un errore transitivo e che si debba ripetere il test.

```console
$ helm install demo demo --namespace default
$ helm test demo
NAME: demo
LAST DEPLOYED: Mon Feb 14 20:03:16 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     demo-test-connection
Last Started:   Mon Feb 14 20:35:19 2022
Last Completed: Mon Feb 14 20:35:23 2022
Phase:          Succeeded
[...]
```

## Note

- È possibile definire tutti i test che si desidera in un singolo file yaml o distribuirli in diversi file yaml nella cartella `templates/`.
- È possibile annidare la propria suite di test sotto una cartella `tests/`, come ad esempio   `<nome-cartella>/templates/tests/` per un maggiore isolamento.
- Un test è un [hook] di Helm (/docs/charts_hooks/), quindi annotazioni come `helm.sh/hook-weight` e `helm.sh/hook-delete-policy` possono essere usate con le risorse dei test.
