---
title: "Charts"
description: "Spiega il formato dei chart e fornisce indicazioni di base per la creazione di chart con Helm."
aliases: [
  "docs/developing_charts/",
  "developing_charts"
]
weight: 1
---

Helm utilizza un formato di packaging chiamato _charts_. Un chart è un insieme di file
che descrivono un insieme correlato di risorse Kubernetes. Un singolo chart potrebbe essere usato per distribuire qualcosa di semplice, come un pod memcached, o qualcosa di complesso,
come uno stack completo di app web con server HTTP, database, cache e così via.

I chart vengono creati come file disposti in un particolare albero di directory. Possono essere
in archivi versionati per essere distribuiti.

Se si desidera scaricare e consultare i file di un chart pubblicato, senza installarlo, è possibile farlo con `helm pull chartrepo/nome del chart`.

Questo documento spiega il formato del chart e fornisce una guida di base per
costruire chart con Helm.

## La struttura dei file del chart

Un chart è organizzato come una raccolta di file all'interno di una directory. Il nome della directory
è il nome del chart (senza informazioni sulla versione). Quindi,
un chart che descrive WordPress verrebbe memorizzato in una directory `wordpress/`.

All'interno di questa directory, Helm si aspetta una struttura che corrisponde a questa:

```text
wordpress/
  Chart.yaml          # Un file YAML contenente informazioni sul chart
  LICENSE             # OPZIONALE: un file di testo semplice contenente la licenza per il chart.
  README.md           # OPZIONALE: un file README human-readable
  values.yaml         # I valori di configurazione predefiniti per questo chart
  values.schema.json  # OPZIONALE: Uno schema JSON per imporre una struttura al file values.yaml
  charts/             # Una directory contenente i chart da cui dipende questo chart.
  crds/               # Custom Resource Definitions
  templates/          # Una directory di template che, se combinati con i values,
                      # genereranno file manifest Kubernetes validi.
  templates/NOTES.txt # OPZIONALE: un file di testo semplice contenente brevi note d'uso.
```

Helm si riserva l'uso delle directory `charts/`, `crds/` e `templates/` e dei nomi dei file elencati.
Gli altri file saranno lasciati così come sono.

## Il file Chart.yaml

Il file `Chart.yaml` è necessario per un chart. Contiene i seguenti campi:

```yaml
apiVersion: La versione dell'API del chart (obbligatorio)
name: il nome del chart (obbligatorio)
version: Una versione di SemVer 2 (obbligatorio)
kubeVersion: Un intervallo SemVer di versioni Kubernetes compatibili (opzionale)
description: Una descrizione di una sola frase di questo progetto (opzionale)
type: Il tipo di chart (opzionale)
keywords:
  - Un elenco di parole chiave relative a questo progetto (opzionale)
home: L'URL della pagina iniziale di questo progetto (facoltativo)
sources:
  - Un elenco di URL al codice sorgente di questo progetto (facoltativo)
dependencies: # Un elenco dei requisiti del chart (opzionale)
  - name: il nome del chart (nginx)
    version: La versione del chart ("1.2.3")
    repository: (opzionale) L'URL del repository ("https://example.com/charts") o l'alias ("@repo-name")
    condition: (facoltativo) Un percorso yaml che si risolve in un booleano, usato per abilitare/disabilitare i chart (ad esempio, subchart1.enabled).
    tag: # (opzionale)
      - I tag possono essere usati per raggruppare i chart da abilitare/disabilitare insieme
    import-values: # (opzionale)
      - ImportValues contiene la mappatura dei valori di origine con la chiave padre da importare. Ogni elemento può essere una stringa o una coppia di elementi di sottoelenco padre/figlio.
    alias: (opzionale) Alias da usare per il chart. Utile quando si deve aggiungere lo stesso chart più volte.
maintainer: # (opzionale)
  - name: il nome del maintainer (obbligatorio per ogni maintainer)
    email: L'email del maintainer (opzionale per ogni maintainer)
    url: Un URL per il maintainer ( opzionale per ogni maintainer)
icon: Un URL a un'immagine SVG o PNG da usare come icona (opzionale).
appVersion: La versione dell'applicazione che contiene (opzionale). Non è necessario che sia SemVer. Si consigliano le citazioni.
deprecated: Se questo chart è deprecato (opzionale, booleano).
annotations:
  example: Un elenco di annotazioni con chiave per nome (opzionale).
```

A partire da [v3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2), non sono consentiti campi aggiuntivi.
L'approccio consigliato è quello di aggiungere metadati personalizzati in `annotations`.

### Chart e versioni

Ogni chart deve avere un numero di versione. Una versione deve seguire lo standard [SemVer 2](https://semver.org/spec/v2.0.0.html). A differenza di Helm Classic, Helm v2
e successivi utilizza i numeri di versione come marcatori di release. I pacchetti nei repository sono
identificati dal nome più versione.

Per esempio, un chart `nginx` il cui campo versione è impostato a `version: 1.2.3`
si chiamerà:

```testo
nginx-1.2.3.tgz
```

Sono supportati anche nomi SemVer 2 più complessi, come `version:
1.2.3-alpha.1+ef365`. Ma i nomi non SemVer sono esplicitamente rifiutati dal sistema.

**NOTA:** Mentre Helm Classic e Deployment Manager erano entrambi molto orientati a GitHub
quando si trattava di chart, Helm v2 e successivi non si basano su GitHub e nemmeno su Git.
Di conseguenza, non utilizza gli SHA di Git per il versioning.

Il campo `version` all'interno di `Chart.yaml` è usato da molti strumenti di Helm, compresa la CLI. Quando si genera un pacchetto, il comando `helm package`
utilizzerà la versione trovata in `Chart.yaml` come token nel nome del pacchetto.
Il sistema presume che il numero di versione nel nome del pacchetto del chart
corrisponda al numero di versione presente in `Chart.yaml`. Il mancato rispetto di questa ipotesi
causerà un errore.

### Il campo `apiVersion`

Il campo `apiVersion` dovrebbe essere `v2` per i chart Helm che richiedono almeno Helm
3. I chart che supportano versioni precedenti di Helm hanno una `apiVersion` impostata a `v1` e sono ancora installabili con Helm 3.

Cambiamenti dalla `v1` alla `v2`:

- Un campo `dependencies` che definisce le dipendenze del chart, che erano situate in un file `requirements.yaml` separato per i chart della `v1` (vedere [Dipendenze dei Chart](#dipendenze-dei-chart)).
- Il campo `type`, che discrimina i chart di applicazione da quelli di libreria (vedere [Tipi di chart](#tipi-di-chart)).

### Il campo `appVersion`

Si noti che il campo `appVersion` non è correlato al campo `version`. È un
modo di specificare la versione dell'applicazione. Per esempio, la tabella `drupal`
può avere una `appVersion: "8.2.1"`, che indica che la versione di Drupal inclusa nel chart (per impostazione predefinita) è `8.2.1`. Questo campo è informativo e non ha alcun impatto sul calcolo della versione del chart. Si consiglia di racchiudere la versione tra virgolette. Questo costringe il parser YAML a trattare il numero di versione come una stringa. Lasciarlo senza virgolette può causare problemi di parsing in alcuni casi. Per esempio, YAML interpreta `1.0` come un valore in virgola mobile e un SHA di git commit come `1234e10` come notazione scientifica.

A partire da Helm v3.5.0, `helm create` avvolge il campo predefinito `appVersion` tra virgolette.

### Il campo `kubeVersion` 

Il campo opzionale `kubeVersion` può definire i vincoli di semver sulle versioni supportate di Kubernetes. Helm convaliderà i vincoli di versione al momento dell'installazione del chart e fallirà se il cluster esegue una versione di Kubernetes non supportata.

I vincoli di versione possono comprendere confronti AND separati da spazi, come ad esempio

```
>= 1.13.0 < 1.15.0
```
che possono essere combinati con l'operatore OR `||` come nel seguente esempio

```
>= 1.13.0 < 1.14.0 || >= 1.14.1 < 1.15.0
```

In questo esempio la versione `1.14.0` viene esclusa, il che può avere senso se è noto un bug
in certe versioni che impediscono il corretto funzionamento del chart.

Oltre ai vincoli di versione che impiegano gli operatori `=` `!=` `>` `<` `>=` `<=`, sono supportate le seguenti notazioni stenografiche

 * intervalli di trattini per intervalli chiusi, dove `1.1 - 2.3.4` è equivalente a `>=
   1.1 <= 2.3.4`.
 * caratteri jolly `x`, `X` e `*`, dove `1.2.x` equivale a `>= 1.2.0 <= 1.3.0`.
   1.3.0`.
 * intervalli di tilde (sono consentite modifiche alla versione della patch), dove `~1.2.3` equivale a
   `>= 1.2.3 < 1.3.0`.
 * intervalli di caret (sono ammessi cambiamenti di versione minori), dove `^1.2.3` equivale a
   `>= 1.2.3 < 2.0.0`.

Per una spiegazione dettagliata dei vincoli di semver supportati, vedere
[Masterminds/semver](https://github.com/Masterminds/semver).

### Deprecazione dei chart

Quando si gestiscono i chart in un Chart Repository, a volte è necessario deprecare un chart.
Il campo opzionale `deprecated` in `Chart.yaml` può essere utilizzato
per contrassegnare un chart come deprecato. Se la versione **più recente** di un chart nel repository
è contrassegnata come deprecata, allora il chart nel suo insieme è considerato
deprecato. Il nome del chart può essere riutilizzato in seguito pubblicando una versione più recente
che non sia contrassegnata come deprecata. Il flusso di lavoro per la deprecazione dei chart è il seguente:

1. Aggiornare il file `Chart.yaml` del grafico per contrassegnarlo come deprecato, eliminando la versione
2. Rilasciare la nuova versione del chart nel Chart Repository.
3. Rimuovere il chart dal repository dei sorgenti (p.e. git)

### Tipi di chart

Il campo `type` definisce il tipo di chart. Esistono due tipi:`application`
e `library`. Application è il tipo predefinito e rappresenta il chart standard
che può essere utilizzato completamente. Il [Chart di tipo Library]({{< ref
"/docs/topics/library_charts.md" >}}) fornisce utilità o funzioni per il costruttore di chart.
Un chart library si differenzia da un chart applicativo perché non è
installabile e di solito non contiene oggetti risorsa.

**Nota:** Un chart di tipo application può essere usato come chart di tipo library. Questo viene abilitato impostando il tipo a `library`. 
Il chart sarà quindi reso come un chart di libreria
dove si possono sfruttare tutte le utilità e le funzioni. Tutti gli oggetti risorsa
del chart non saranno renderizzati.

## LICENZA, README e NOTE

I chart possono contenere anche file che descrivono l'installazione, la configurazione,
e la licenza d'uso di un chart.

La LICENZA è un file di testo semplice che contiene il codice di[licenza](https://en.wikipedia.org/wiki/Software_license) per il chart.Il chart può contenere una licenza perché può contenere logica di programmazione nei modelli e quindi non sarebbe solo di configurazione. Ci possono essere anche licenze separate per l'applicazione installata dal chart, se necessario.

Un README per un chart dovrebbe essere formattato in Markdown (README.md) e dovrebbe contenere generalmente:
- una descrizione dell'applicazione o del servizio che il chart fornisce
- Eventuali prerequisiti o requisiti per eseguire il chart
- Descrizioni delle opzioni in `values.yaml` e dei valori predefiniti
- Qualsiasi altra informazione che possa essere rilevante per l'installazione o la configurazione del chart.

Quando gli hub e le altre interfacce utente visualizzano i dettagli di un chart, tali dettagli vengono
dal contenuto del file `README.md`.

Il chart può anche contenere un breve file di testo semplice `templates/NOTES.txt` che verrà stampato dopo l'installazione e quando si visualizza lo stato di una release.
Questo file viene valutato come un [template](#templates-e-values) e può essere
usato per visualizzare le note d'uso, i passi successivi o qualsiasi altra informazione relativa a una
un rilascio del chart. Ad esempio, si possono fornire istruzioni per connessione a un database o l'accesso a un'interfaccia web. Poiché questo file viene stampato su STDOUT quando si esegue `helm install` o `helm status`, è consigliabile mantenere il contenuto breve e rimandare al README per maggiori dettagli.

## Dipendenze dei chart

In Helm, un chart può dipendere da un numero qualsiasi di altri chart. Queste dipendenze
possono essere collegate dinamicamente utilizzando il campo `dependencies` in `Chart.yaml` o
nella cartella `charts/` e gestite manualmente.

### Gestione delle dipendenze con il campo `dipendenze

I chart richiesti dal chart corrente sono definiti come un elenco nel campo
`dipendenze`.

```yaml
dependencies:
  - name: apache
    version: 1.2.3
    repository: https://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: https://another.example.com/charts
```

- Il campo `name` è il nome del chart desiderato.
- Il campo `version` è la versione del chart desiderata.
- Il campo `repository` è l'URL completo del repository del chart. Si noti che
  deve essere usato anche `helm repo add` per aggiungere quel repo localmente.
- Si può usare il nome del repo invece dell'URL

```console
$ helm repo add fantastic-charts https://charts.helm.sh/incubator
```

```yaml
dependencies:
  - name: awesomeness
    version: 1.0.0
    repository: "@fantastic-charts"
```
Una volta definite le dipendenze, è possibile eseguire `helm dependency update` e il programma utilizzerà il file delle dipendenze per scaricare tutti i chart specificati nel file delle dipendenze per scaricare tutti i chart specificati nella cartella
`charts/`.

```console
$ helm dep up foochart
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "example" chart repository
...Successfully got an update from the "another" chart repository
Update Complete. Happy Helming!
Saving 2 charts
Downloading apache from repo https://example.com/charts
Downloading mysql from repo https://another.example.com/charts
```

Quando `helm dependency update` recupera i chart, li memorizza come archivi di chart nella directory `charts/`. Quindi, per l'esempio precedente, ci si aspetterebbe
di vedere i seguenti file nella cartella charts:

```text
charts/
  apache-1.2.3.tgz
  mysql-3.2.1.tgz
```

#### Campo Alias nelle dipendenze

Oltre agli altri campi sopra citati, ogni voce relativa alle dipendenze può contenere il campo opzionale`alias`.

L'aggiunta di un alias per un dependency chart inserisce un chart nelle dipendenze usando
alias come nome della nuova dipendenza.

Si può usare `alias` nel caso in cui si debba accedere a un chart con altri nomi.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-1
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-2
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
```

Nell'esempio precedente, avremo 3 dipendenze in tutto per `parentchart`:

```text
subchart
new-subchart-1
new-subchart-2
```

Il modo manuale per ottenere questo risultato è copiare/incollare lo stesso chart nella directory
`charts/` più volte con nomi diversi.

#### Tag e Condition fields nelle dipendenze

Oltre agli altri campi sopra citati, ogni voce di requisiti può contenere i campi opzionali
`tags` e `condition`.

Tutti i campi sono caricati per impostazione predefinita. Se i campi `tags` o `condition` sono presenti,
vengono valutati e utilizzati per controllare il caricamento dei chart a cui sono applicati.

Condition - Il campo condition contiene uno o più percorsi YAML (delimitati da virgole). 
Se questo percorso esiste nei valori del genitore superiore e si risolve in un valore
valore booleano, il grafico verrà attivato o disattivato in base a quel valore booleano.
Viene valutato solo il primo percorso valido trovato nell'elenco; se non esistono percorsi, la condizione non ha effetto.

Tags - Il campo tags è un elenco YAML di etichette da associare a questo chart. In
valori del parent superiore, tutti i chart con tag possono essere attivati o disattivati
specificando il tag e un valore booleano.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart1.enabled,global.subchart1.enabled
    tags:
      - front-end
      - subchart1
  - name: subchart2
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart2.enabled,global.subchart2.enabled
    tags:
      - back-end
      - subchart2
```

```yaml
# parentchart/values.yaml

subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

Nell'esempio precedente, tutti i chart con il tag `front-end` sarebbero disabilitati ma
poiché il percorso `subchart1.enabled` valuta 'true' nei valori del parent,
la condizione sovrascrive il tag `front-end` e `subchart1` viene abilitato.

Poiché `subchart2` è etichettato con `back-end` e tale tag valuta a `true`,
`subchart2` sarà abilitato. Si noti anche che, sebbene `subchart2` abbia una condizione

specificata, non c'è alcun percorso e valore corrispondente nei valori del parent, per cui questa
condizione non ha alcun effetto.

##### Uso della CLI con tag e condizioni

Il parametro `--set' può essere usato come di consueto per modificare i valori dei tag e delle condizioni.

```console
helm install --set tags.front-end=true --set subchart2.enabled=false
```

##### Risoluzione di tag e condizioni

- **Le conditions (se impostate in valori) sovrascrivono sempre i tag.** La prima condition path
  che esiste vince e le successive per quel chart vengono ignorate.
- I tag vengono valutati come "se uno qualsiasi dei tag del chart è vero, allora abilita il chart".
- I valori dei tag e delle condition devono essere impostati nei value del chart superiore.
- La chiave `tags:` nei value deve essere una chiave di livello superiore. I globals e le tabelle `tags:` annidate non sono attualmente supportati.

#### Importare i Values dei figli tramite le dipendenze

In alcuni casi è auspicabile che i valori di un chart figlio si propaghino al chart padre e siano condivisi come values predefiniti comuni. 
Un ulteriore vantaggio di
utilizzare il formato `exports` è che consentirà ai futuri strumenti di introspezione dei values impostabili dall'utente.

Le chiavi che contengono i valori da importare possono essere specificate nel chart
padre, nel campo `import-values`, utilizzando un elenco YAML. Ogni elemento
dell'elenco è una chiave che viene importata dal campo `exports` del chart figlio.

Per importare valori non contenuti nella chiave `exports`, utilizzare il metodo
[child-parent](#usare-il-formato-child-parent). Esempi di entrambi i formati
sono descritti di seguito.

##### Usare il formato exports

Se il file `values.yaml` di un chart figlio contiene un campo `exports` nella root, 
il suo contenuto può essere importato direttamente nei valori del parent, specificando le chiavi da importare, come nell'esempio seguente:

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - data
```

```yaml
# child's values.yaml file

exports:
  data:
    myint: 99
```

Dal momento che stiamo specificando la chiave `data` nella nostra lista di importazione, Helm cerca nel campo `exports` del chart figlio la chiave `data` e importa il suo contenuto.

I valori finali del parent conterranno il nostro campo esportato:

```yaml
# parent's values

myint: 99
```

Si noti che la chiave del parent `data' non è contenuta nei values finali del parent.

Se è necessario specificare la chiave del parent, utilizzare il formato 'child-parent'.

##### Usare il formato child-parent

Per accedere ai values che non sono contenuti nella chiave `exports` dei values del chart figlio, sarà necessario specificare la chiave di origine dei valori da
da importare (`child`) e il percorso di destinazione nei valori del chart padre
(`parent`).

L'opzione `import-values` nell'esempio seguente indica a Helm di prendere tutti i valori trovati nel percorso `child:` e di copiarli nei valori del parent nel percorso specificato in
`parent:`

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    ...
    import-values:
      - child: default.data
        parent: myimports
```

Nell'esempio precedente, i valori trovati in `default.data` nei valori del subchart1
saranno importati nella chiave `myimports` nei valori del chart padre, come descritto di seguito:

```yaml
# parent's values.yaml file

myimports:
  myint: 0
  mybool: false
  mystring: "helm rocks!"
```

```yaml
# subchart1's values.yaml file

default:
  data:
    myint: 999
    mybool: true
```

I valori risultanti del chart padre saranno:

```yaml
# parent's final values

myimports:
  myint: 999
  mybool: true
  mystring: "helm rocks!"
```

I valori finali del parent contengono ora i campi `myint` e `mybool` importati da subchart1.

### Gestione manuale delle dipendenze tramite la directory `charts/`

Se si desidera un maggiore controllo sulle dipendenze, queste possono essere
esplicitate copiando i chart delle dipendenze nella cartella `charts/`.

Una dipendenza deve essere una cartella di chart scompattati, ma il suo nome non può iniziare con 
con `_` o `.`. Tali file vengono ignorati dal caricatore del chart.

Per esempio, se il chart di WordPress dipende dal grafico di Apache, il chart di Apache
(della versione corretta) viene fornito nella cartella `charts/` del chart WordPress:

```yaml
wordpress:
  Chart.yaml
  # ...
  charts/
    apache/
      Chart.yaml
      # ...
    mysql/
      Chart.yaml
      # ...
```

L'esempio precedente mostra come il chart di WordPress esprima la sua dipendenza da
Apache e MySQL includendo questi chart all'interno della cartella `charts/`.

**TIP:** _Per inserire una dipendenza nella cartella `charts/`, usare il comando `helm pull".

### Aspetti operativi dell'uso delle dipendenze

Le sezioni precedenti spiegano come specificare le dipendenze dei chart, ma come influiscono sull'installazione dei chart con `helm install` e `helm upgrade`?

Supponiamo che un chart chiamato "A" crei i seguenti oggetti Kubernetes

- namespace "A-Namespace"
- statefulset "A-StatefulSet"
- service "A-Service"

Inoltre, A dipende dal chart B, che crea gli oggetti

- namespace "B-Namespace"
- replicaset "B-ReplicaSet"
- service "B-Service"

Dopo l'installazione/aggiornamento del chart A viene creata/modificata una singola release di Helm.
Il rilascio creerà/aggiornerà tutti gli oggetti Kubernetes di cui sopra nel seguente ordine:

- A-Namespace
- B-Namespace
- A-Service
- B-Service
- B-ReplicaSet
- A-StatefulSet

Questo perché quando Helm installa/aggiorna i chart, gli oggetti Kubernetes del
chart e tutte le sue dipendenze sono

- aggregati in un unico insieme; quindi
- ordinati per tipo seguito dal nome; e poi
- creati/aggiornati in questo ordine.

Quindi viene creata una singola release con tutti gli oggetti per il chart e le sue dipendenze.

L'ordine di installazione dei tipi di Kubernetes è dato dall'enumerazione InstallOrder
in kind_sorter.go (si veda [il file sorgente di Helm](https://github.com/helm/helm/blob/484d43913f97292648c867b56768775a55e4bba6/pkg/releaseutil/kind_sorter.go)).

## Templates e Values

I template di Helm Chart sono scritti nel linguaggio [Go template](https://golang.org/pkg/text/template/), con l'aggiunta di una cinquantina di
funzioni template [dalla libreria Sprig](https://github.com/Masterminds/sprig) e alcune altre [funzioni specializzate]({{< relref path="/docs/howto/charts_tips_and_tricks.md" lang="en" >}}).

Tutti i file dei template sono memorizzati nella cartella `templates/` di un chart. Quando Helm
esegue il rendering dei chart, passerà ogni file in quella cartella attraverso il motore dei
 template.

I values dei template possono essere forniti in due modi:
- Gli sviluppatori dei chart possono fornire un file chiamato `values.yaml` all'interno di di un chart. Questo file può contenere valori predefiniti.
- Gli utenti dei chart possono fornire un file YAML contenente i valori. Questo può essere fornito a riga di comando con helm install.

Quando un utente fornisce valori personalizzati, questi valori sovrascrivono quelli del file values.yaml del chart.

### File Template

I file template seguono le convenzioni standard per la scrittura dei template di Go (vedi
[il pacchetto Go text/templatedocumentazione](https://golang.org/pkg/text/template/) per i dettagli). 
Un esempio dipotrebbe essere simile a questo:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

L'esempio precedente, basato vagamente su
[https://github.com/deis/charts](https://github.com/deis/charts), è un template
per un replica controller Kubernetes. Può utilizzare i seguenti quattro valori
(solitamente definiti in un file `values.yaml`):

- `imageRegistry`: Il registry di origine dell'immagine Docker.
- `dockerTag`: Il tag per l'immagine Docker.
- `pullPolicy`: La politica di pull di Kubernetes.
- `storage`: Il backend dello storage, il cui valore predefinito è impostato su `"minio"`.

Tutti questi valori sono definiti dall'autore del template. Helm non richiede o deficita di
parametri.

Per vedere chart funzionanti, consultare il CNCF [Artifact Hub](https://artifacthub.io/packages/search?kind=0).

### Valori predefiniti

I valori forniti tramite un file `values.yaml` (o tramite il flag `--set`) sono
accessibili dall'oggetto `.Values` di un template. Ma ci sono altri
dati predefiniti a cui si può accedere nei template.

I seguenti valori sono predefiniti, sono disponibili per ogni template e non possono essere sovrascritti. Come per tutti i valori, i nomi sono _sensibili alle maiuscole_.

- `Release.Name`: Il nome della release (non il chart).
- `Release.Namespace`: il namespace in cui è stato rilasciato il chart
- `Release.Service`: Il servizio che ha effettuato il rilascio.
- `Release.IsUpgrade`: Viene impostato a true se l'operazione corrente è un
  aggiornamento o rollback.
- `Release.IsInstall`: È impostato su true se l'operazione corrente è un'installazione.
- `Chart`: Il contenuto di `Chart.yaml`. Pertanto, la versione del chart è
  ottenibile come `Chart.Version` e i manutentori sono in `Chart.Maintainers`.
- `Files`: Un oggetto simile a una mappa che contiene tutti i file non speciali del chart. Questo oggetto
  non darà accesso ai template, ma darà accesso ai file aggiuntivi presenti (a meno che non siano esclusi usando `.helmignore`). Ai file
  si può accedere utilizzando `{{ index .Files "file.name" }}` o utilizzando il comando
  `{{.Files.Get name }}` Si può anche accedere al contenuto del file
  come `[]byte` usando `{{ .Files.GetBytes }}`.
- `Capabilities`: Un oggetto simile a una mappa che contiene informazioni sulle versioni
  di Kubernetes (`{{ .Capabilities.KubeVersion }}`) e le versioni di Kubernetes
  API supportate (`{{ .Capabilities.APIVersions.Has "batch/v1" }}`).

**NOTA:** Qualsiasi campo `Chart.yaml` sconosciuto verrà eliminato.Non saranno
accessibili all'interno dell'oggetto `Chart`. Pertanto, `Chart.yaml` non può essere usato per
passare dati strutturati in modo arbitrario nel template. Il file values può essere usato
per questo, però.

### Values Files

Considerando il modello della sezione precedente, un file `values.yaml` che fornisce i valori necessari
avrebbe il seguente aspetto:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

Un file di valori è formattato in YAML. Un chart può includere un file `values.yaml` predefinito. Il comando di installazione di Helm permette all'utente di sovrascrivere i valori fornendo
values YAML aggiuntivi:

```console
$ helm install --generate-name --values=myvals.yaml wordpress
```

Quando i valori vengono passati in questo modo, verranno uniti nel file dei valori
di default. Per esempio, si consideri un file `myvals.yaml` che assomiglia a questo:

```yaml
storage: "gcs"
```

Quando questo viene unito con il file `values.yaml` nel chart, il contenuto generato risultante sarà: 

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"
```

Si noti che solo l'ultimo campo è stato sovrascritto.

**NOTA:** Il file dei valori predefiniti incluso in un chart _deve_ essere chiamato
`values.yaml`. Ma i file specificati sulla riga di comando possono avere qualsiasi nome.

**NOTA:** Se il flag `--set` è usato in `helm install` o `helm upgrade`, quei valori sono semplicemente convertiti in YAML.

**NOTA:** Se esistono voci richieste nel file dei valori, queste possono essere dichiarate
come richieste nel template del chart, utilizzando la funzione ['required']({{< relref path="/docs/howto/charts_tips_and_tricks.md" lang="en" >}})

Tutti questi valori sono poi accessibili all'interno dei template utilizzando l'oggetto `.Values`:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

### Ambito, dipendenze e valori

I file Values possono dichiarare valori per il chart di primo livello e per tutti i chart inclusi nella cartella `charts/` di quel chart. Oppure, per dirla 
in modo diverso, un file di values può fornire valori al chart così come a qualsiasi
delle sue dipendenze. Per esempio, il chart dimostrativo di WordPress qui sopra ha sia `mysql` che `apache` come dipendenze. Il file dei valori potrebbe fornire i valori
a tutti questi componenti:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

I chart di livello superiore hanno accesso a tutte le variabili definite sotto. Quindi il chart di WordPress può accedere alla password di MySQL come `.Values.mysql.password`.
Ma i chart di livello inferiore non possono accedere alle variabili dei chart padre, quindi MySQL non sarà in grado di accedere alla proprietà `title`. Né, a questo proposito, può accedere a
`apache.port`.

I valori sono inseriti in namespace, ma i namespace vengono eliminati. Quindi, per il chart di WordPress,
può accedere al campo della password di MySQL come `.Values.mysql.password`. Ma per il chart
MySQL, l'ambito dei valori è stato ridotto e il prefisso dello spazio dei nomi è stato
rimosso, per cui il campo password viene visualizzato semplicemente come `.Values.password`.

#### Valori globali

A partire dalla versione 2.0.0-Alpha.2, Helm supporta valori speciali "globali". Si consideri questa
versione modificata dell'esempio precedente:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

Quanto sopra aggiunge una sezione `global` con il valore `app: MyWordPress`. Questo valore
è disponibile per _tutti_ i chart come `.Values.global.app`.

Per esempio, i template `mysql` possono accedere a `app` come `{{.Values.global.app}}`, così come il chart `apache`. In effetti, il file values
di cui sopra viene rigenerato in questo modo:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  global:
    app: MyWordPress
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  global:
    app: MyWordPress
  port: 8080 # Passed to Apache
```

Questo permette di condividere una variabile di primo livello con tutti i chart secondari che
è utile per impostare proprietà di `metadati` come le etichette.

Se un subchart dichiara una variabile globale, questa sarà passata _verso il basso_ (ai subchart del subchart), ma non _verso l'alto_ al chart padre. Non c'è
modo che un subchart possa influenzare i valori del chart padre.

Inoltre, le variabili globali del chart padre hanno la precedenza sulle variabili globali dei subchart.

### Schema Files

A volte, il maintainer di un chart potrebbe voler definire una struttura per i suoi values.
Questo può essere fatto definendo uno schema nel file `values.schema.json`. Uno schema
è rappresentato come un [JSON Schema] (https://json-schema.org/). Potrebbe assomigliare a 
qualcosa del genere:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "properties": {
    "image": {
      "description": "Container Image",
      "properties": {
        "repo": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "name": {
      "description": "Service name",
      "type": "string"
    },
    "port": {
      "description": "Port",
      "minimum": 0,
      "type": "integer"
    },
    "protocol": {
      "type": "string"
    }
  },
  "required": [
    "protocol",
    "port"
  ],
  "title": "Values",
  "type": "object"
}
```

Questo schema verrà applicato ai valori per convalidarli. La convalida avviene quando
uno dei seguenti comandi:

- `helm install`
- `helm upgrade`
- `helm lint`
- `helm template`

Un esempio di file `values.yaml` che soddisfa i requisiti di questo schema
potrebbe assomigliare a questo:

```yaml
name: frontend
protocol: https
port: 443
```

Si noti che lo schema viene applicato all'oggetto finale `.Values` e non solo al file `values.yaml`. Questo significa che il seguente file `yaml` è valido,
dato che lo schema è stato installato con l'appropriata opzione `--set` mostrata
sotto.

```yaml
name: frontend
protocol: https
```

```console
helm install --set port=443
```

Inoltre, l'oggetto finale `.Values` viene controllato rispetto a *tutti* gli schemi dei subchart.Questo significa che le restrizioni di un subchart non possono essere aggirate da un chart padre. Questo funziona anche al contrario: se un subchart ha un requisito che
non è soddisfatto nel file `values.yaml` del subchart, il chart padre *deve* soddisfare 
tali restrizioni per essere valido.

### Riferimenti

Quando si tratta di scrivere template, values e schema, esistono diversi
riferimenti standard che vi aiuteranno.

- [Go templates](https://godoc.org/text/template)
- [Extra template functions](https://godoc.org/github.com/Masterminds/sprig)
- [The YAML format](https://yaml.org/spec/)
- [JSON Schema](https://json-schema.org/)
## Definizioni di risorse personalizzate (CRD)

Kubernetes fornisce un meccanismo per dichiarare nuovi tipi di oggetti Kubernetes.
Utilizzando le CustomResourceDefinitions (CRDs), gli sviluppatori Kubernetes possono dichiarare tipi di risorse personalizzate.

In Helm 3, i CRD sono trattati come un tipo speciale di oggetto. Vengono installati
prima del resto del chart e sono soggetti ad alcune limitazioni.

I file YAML dei CRD devono essere collocati nella cartella `crds/` all'interno di un chart.
Più CRD (separati da marcatori YAML di inizio e fine) possono essere inseriti nello stesso file. 
Helm tenterà di caricare _tutti_ i file nella directory CRD
in Kubernetes.

I file CRD _non possono essere "templetizzati"_. Devono essere semplici documenti YAML.

Quando Helm installa un nuovo chart, caricherà i CRD, si fermerà fino a quando i CRD
sono resi disponibili dal server API, quindi avvia il motore dei template, esegue il rendering del resto del chart e lo carica su Kubernetes. A causa di questo ordine,
le informazioni sui CRD sono disponibili nell'oggetto `.Capabilities` nei template Helm,
e i template di Helm possono creare nuove istanze di oggetti che sono stati dichiarati in
CRD.

Ad esempio, se il chart ha una CRD per `CronTab` nella cartella `crds/`,
si possono creare istanze del tipo `CronTab` nella cartella `templates/`:

```text
crontabs/
  Chart.yaml
  crds/
    crontab.yaml
  templates/
    mycrontab.yaml
```

Il file `crontab.yaml` deve contenere la CRD senza direttive di template:

```yaml
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
```

Quindi il template `mycrontab.yaml` può creare una nuova `CronTab` (usando i template
come di consueto):

```yaml
apiVersion: stable.example.com
kind: CronTab
metadata:
  name: {{ .Values.name }}
spec:
   # ...
```

Helm si assicurerà che il tipo `CronTab` sia stato installato e che sia disponibile
dal server API di Kubernetes prima di procedere all'installazione degli elementi in
`templates/`.

### Limitazioni dei CRD

A differenza della maggior parte degli oggetti in Kubernetes, i CRD sono installati globalmente. Per questo motivo,
Helm adotta un approccio molto cauto nella gestione dei CRD. I CRD sono soggetti alle
seguenti limitazioni:

- I CRD non vengono mai reinstallati. Se Helm determina che i CRD presenti nella directory `crds/`
  sono già presenti (indipendentemente dalla versione), Helm non tenterà di installarli o aggiornarli.
- I CRD non vengono mai installati in caso di aggiornamento o rollback. Helm creerà i CRD solo durante le
  operazioni di installazione.
- I CRD non vengono mai eliminati. L'eliminazione di un CRD cancella automaticamente tutti i contenuti del CRD in tutti i namespace del cluster.
 
Di conseguenza, Helm non
  eliminerà i CRD.

Gli operatori che desiderano aggiornare o eliminare i CRD sono invitati a farlo manualmente e con molta attenzione.

## Usare Helm per gestire i chart

Lo strumento `helm` ha diversi comandi per lavorare con i chart.

Può creare un nuovo chart:

```console
$ helm create mychart
Created mychart/
```

Una volta modificato un chart, `helm` può impacchettarlo in un archivio di chart
per l'utente:

```console
$ helm package mychart
Archived mychart-0.1.-.tgz
```

Si può anche usare `helm` per trovare problemi con la formattazione o le informazioni del chart.

```console
$ helm lint mychart
No issues found
```

## Chart Repositories

Un _chart repository_  è un server HTTP che ospita uno o più chart confezionati.
Mentre `helm` può essere utilizzato per gestire le directory locali di chart, quando si tratta di
condividere i chart, il meccanismo preferito è un chart repository.

Qualsiasi server HTTP in grado di servire file YAML e file tar e di rispondere alle richieste GET
può essere utilizzato come server di repository. Il team di Helm ha testato alcuni
server, tra cui Google Cloud Storage con modalità website abilitata e S3 con modalità website  abilitata.

Un repository è caratterizzato principalmente dalla presenza di un file speciale chiamato
`index.yaml` che contiene un elenco di tutti i pacchetti forniti dal repository,
insieme ai metadati che permettono di recuperare e verificare tali pacchetti.

Sul lato client, i repository sono gestiti con i comandi `helm repo`.
Tuttavia, Helm non fornisce strumenti per il caricamento di grafici su server di repository remoti.
 Questo perché ciò comporterebbe l'aggiunta di requisiti sostanziali per un server
server e quindi aumenterebbe la barriera per la creazione di un repository.

## Chart Starter Packs

Il comando `helm create` accetta un'opzione `--starter` che permette di
specificare un "chart iniziale". Inoltre, l'opzione starter ha un alias breve `-p`.

Esempi di utilizzo:

```console
helm create my-chart --starter starter-name
helm create my-chart -p starter-name
helm create my-chart -p /absolute/path/to/starter-name
```

Gli starter sono dei normali chart, ma si trovano in
`$XDG_DATA_HOME/helm/starters`. Come sviluppatore di chart, si possono creare chart 
che sono specificamente progettati per essere usati come starter. Tali chart devono essere progettati
con le seguenti considerazioni:

- Il file `Chart.yaml` sarà sovrascritto dal generatore.
- Gli utenti si aspetteranno di poter modificare i contenuti di un chart di questo tipo, quindi la documentazione dovrebbe
  indicare come gli utenti possono farlo.
- Tutte le occorrenze di `<nome del chart>` saranno sostituite con il nome del chart specificato, in modo che i chart di partenza possano essere usati come modelli, tranne che per alcuni file variabili. Ad esempio, se si utilizzano file personalizzati nella cartella `vars` o alcuni file `README.md`, `<CHARTNAME>` NON verrà sovrascritto al loro interno. Inoltre, la descrizione del chart non viene ereditata.

Attualmente l'unico modo per aggiungere un chart a `$XDG_DATA_HOME/helm/starters` è copiarlo manualmente. Nella documentazione del chart, si potrebbe spiegare
questo processo.
