---
title: "Library Charts"
description: "Spiega i library charts e gli esempi di utilizzo"
aliases: ["docs/library_charts/"]
weight: 4
---

Un library chart è un tipo di [[Helm chart]] ({{< ref "/docs/topics/charts.md" >}})
che definisce primitive o definizioni di chart che possono essere condivise dai template di Helm in altri chart. 
Questo permette agli utenti di condividere frammenti di codice che possono essere
riutilizzabili tra i vari chart, evitando ripetizioni e mantenendo i chart
[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Il library chart è stato introdotto in Helm 3 per riconoscere formalmente i chart comuni o
 di aiuto che sono stati utilizzati dai manutentori dei chart a partire da Helm 2. Includendolo come
 tipo di chartrafico, fornisce:
- un mezzo per distinguere esplicitamente tra chart comuni e chart applicativi
- Una logica per impedire l'installazione di un chart comune
- Nessun rendering di template in un chart comune, che potrebbe contenere artefatti di rilascio.
- Permettere ai chart dipendenti di utilizzare il contesto dell'importatore.

Un manutentore di chart può definire un chart comune come un library chart ed essere sicuro che Helm gestirà il chart in modo standard e coerente. Ciò significa anche che
 che le definizioni in un chart applicativo possono essere condivise cambiando
il tipo di chart.

## Creare un Simple Library Chart

 Come accennato in precedenza, un library chart è un tipo di [Helm chart]({{< ref "/docs/topics/charts.md" >}}).  
Ciò significa che si può iniziare creando un chart:

```console
$ helm create mylibchart
Creating mylibchart
```

Si rimuoveranno prima tutti i file nella cartella `templates`, poiché in questo esempio si creeranno le
 le nostre definizioni di template.

```console
$ rm -rf mylibchart/templates/*
```

Anche il file values non sarà necessario.

```console
$ rm -f mylibchart/values.yaml
```

Prima di lanciarci nella creazione di codice comune, facciamo un rapido ripasso di alcuni concetti rilevanti di Helm. Un [named template]({{< relref path="/docs/chart_template_guide/named_templates.md" lang="en" >}}) (talvolta chiamato partial
o un subtemplate) è semplicemente un template definito all'interno di un file e a cui viene dato un nome.
Nella cartella `templates/`, qualsiasi file che inizia con un trattino basso(_)
non è previsto come output di un file manifest di Kubernetes. Quindi, per convenzione, i template
e partials sono inseriti in un file `_*.tpl` o `_*.yaml`.

In questo esempio, si codificherà un ConfigMap comune che crea una risorsa
ConfigMap vuota. Si definirà il ConfigMap comune nel file
`mylibchart/templates/_configmap.yaml` come segue:

```yaml
{{- define "mylibchart.configmap.tpl" -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data: {}
{{- end -}}
{{- define "mylibchart.configmap" -}}
{{- include "mylibchart.util.merge" (append . "mylibchart.configmap.tpl") -}}
{{- end -}}
```

Il costrutto ConfigMap è definito nel template `mylibchart.configmap.tpl`. Si tratta di un semplice ConfigMap con una risorsa vuota, `data`.All'interno di questo file c'è
un altro modello denominato `mylibchart.configmap`. Questo named template
include un altro template chiamato `mylibchart.util.merge` che prenderà come argomenti due named template
 il template che chiama `mylibchart.configmap` e
`mylibchart.configmap.tpl`.

La helper function `mylibchart.util.merge` è un named template in
`mylibchart/templates/_util.yaml`. Si tratta di un pratico utility di [The Common Helm
Helper Chart](#the-common-helm-helper-chart) perché fonde i due template
e sovrascrive qualsiasi parte comune in entrambi:

```yaml
{{- /*
mylibchart.util.merge will merge two YAML templates and output the result.
This takes an array of three values:
- the top context
- the template name of the overrides (destination)
- the template name of the base (source)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

Questo è importante quando un chart vuole utilizzare codice comune che deve essere personalizzato con la sua configurazione.

Infine, cambiamo il tipo di grafico in `library`. Questo richiede la modifica di
`mylibchart/Chart.yaml` come segue:

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
# type: application
type: library

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
version: 0.1.0

# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application and it is recommended to use it with quotes.
appVersion: "1.16.0"
```

Il library chart è ora pronto per essere condiviso e la sua definizione di ConfigMap può essere riutilizzata.

Prima di andare avanti, vale la pena di verificare se Helm riconosce il chart come un library chart:

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## Utilizzare il Simple Library Chart

È il momento di utilizzare il library chart. Ciò significa creare nuovamente un chart:

```console
$ helm create mychart
Creating mychart
```

Ripuliamo di nuovo i file dei template, perché vogliamo creare solo una ConfigMap:

```console
$ rm -rf mychart/templates/*
```

Quando si vuole creare una semplice ConfigMap in un template di Helm, si potrebbe avere un aspetto
simile al seguente:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

Tuttavia, riutilizzeremo il codice comune già creato in `mylibchart`.
La ConfigMap può essere creata nel file `mychart/templates/configmap.yaml`
come segue:

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

Si può notare che si semplifica il lavoro da fare, ereditando la definizione comune di
ConfigMap, che aggiunge proprietà standard per ConfigMap. Nel nostro modello
aggiungiamo la configurazione, in questo caso la chiave dati `myvalue` e il suo valore.
valore. La configurazione sovrascrive la risorsa vuota del ConfigMap comune.
Questo è possibile grazie alla funzione helper `mylibchart.util.merge` di cui abbiamo parlato nella sezione precedente.

Per poter utilizzare il codice comune, è necessario aggiungere `mylibchart` come dipendenza.
Aggiungere quanto segue alla fine del file `mychart/Chart.yaml`:

```yaml
# My common code in my library chart
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

Questo include il library chart come dipendenza dinamica dal filesystem
che si trova nello stesso percorso padre del nostro chart dell'applicazione. Poiché stiamo includendo
il library chart come dipendenza dinamica, è necessario eseguire `helm dependency update`. 
Questo copierà il library chart nella cartella `charts/`.

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

Ora siamo pronti a distribuire il nostro chart. Prima dell'installazione, vale la pena di controllare
il template renderizzato.

```console
$ helm install mydemo mychart/ --debug --dry-run
install.go:159: [debug] Original chart version: ""
install.go:176: [debug] CHART PATH: /root/test/helm-charts/mychart

NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:48:47 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
mylibchart:
  global: {}
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  annotations: {}
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
```

Questa sembra la ConfigMap che vogliamo, con la sovrascrittura dei dati di `myvalue: Hello
World`. Installiamolo:

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Possiamo recuperare il rilascio e vedere che il template effettivo è stato caricato.

```console
$ helm get manifest mydemo
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
  ```

## Vantaggi dei Library Chart

A causa della loro incapacità di agire come chart autonomi, i library charts possono sfruttare le seguenti funzionalità:
- L'oggetto `.Files` fa riferimento ai percorsi dei file del chart padre, anziché al percorso locale del library charts.
- L'oggetto `.Values` è lo stesso del chart padre, a differenza dei 
[subcharts]({{< relref path="/docs/chart_template_guide/subcharts_and_globals.md" lang="en" >}}) dell'applicazione che ricevono la sezione di valori configurata sotto la loro intestazione nel chart padre.


## The Common Helm Helper Chart

```markdown
Note: Il repo Common Helm Helper Chart su Github non è più mantenuto attivamente e il repo è stato deprecato e archiviato.
```

Questo [chart] (https://github.com/helm/charts/tree/master/incubator/common) era
il pattern originale per i chart comuni. Fornisce utilità che riflettono le best practice
 di sviluppo dei chart Kubernetes. Soprattutto, può essere utilizzato
quando si sviluppano i chart, in modo da avere a disposizione un pratico codice condiviso.

Ecco un modo rapido per usarlo. Per maggiori dettagli, consultare il file
[README](https://github.com/helm/charts/blob/master/incubator/common/README.md).

Creare di nuovo un chart:

```console
$ helm create demo
Creating demo
```

Utilizziamo il codice comune della tabella degli helper. Per prima cosa, modificare il file di deployment
`demo/templates/deployment.yaml` come segue:

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Define overrides for your Deployment resource here, e.g.
apiVersion: apps/v1
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "demo.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "demo.selectorLabels" . | nindent 8 }}

{{- end -}}
```

E ora il file del service, `demo/templates/service.yaml`, come segue:

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Define overrides for your Service resource here, e.g.
# metadata:
#   labels:
#     custom: label
# spec:
#   ports:
#   - port: 8080
{{- end -}}
```

Questi template mostrano come l'ereditarietà del codice comune dal helper chart
semplifica la codifica fino alla configurazione o alla personalizzazione delle risorse.

Per poter utilizzare il codice comune, occorre aggiungere `common` come dipendenza. Aggiungere
quanto segue alla fine del file `demo/Chart.yaml`:

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

Nota: è necessario aggiungere il repo `incubator` all'elenco dei repository Helm
(`helm repo add`).

Poiché stiamo includendo il chart come dipendenza dinamica, dobbiamo eseguire 
`helm dependency update`. Questo copierà il chart helper nella cartella `charts/`.

Poiché l'helper chart utilizza alcuni costrutti di Helm 2, è necessario aggiungere il file
a `demo/values.yaml` per consentire il caricamento dell'immagine `nginx`, che 
è stata aggiornata nello scaffold chart di Helm 3:

```yaml
image:
  tag: 1.16.0
```

Si può verificare che i chart template siano corretti prima di distribuirli usando i comandi `helm lint` e `helm template`.

Se è tutto a posto, si può procedere al deploy con `helm install`!

