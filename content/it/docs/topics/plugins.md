---
title: "Guida ai plugin di Helm"
description: "Introduce all'uso e alla creazione di plugin per estendere le funzionalità di Helm."
aliases: ["/docs/plugins/"]
weight: 12
---

Un plugin di Helm è uno strumento a cui si può accedere tramite la CLI `helm`, ma che 
non fa parte della base di codice di Helm.

I plugin esistenti possono essere trovati nella sezione 
[related]({{< relref path="related.md#helm-plugins" lang="en" >}}) o cercando su
[GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories).

Questa guida spiega come usare e creare i plugin.

## Una panoramica

I plugin di Helm sono strumenti aggiuntivi che si integrano perfettamente con Helm. Forniscono
un modo per estendere il set di funzionalità principali di Helm, senza però richiedere che ogni nuova
funzionalità sia scritta in in Go e di aggiungerle al core dello strumento.

I plugin di Helm hanno le seguenti caratteristiche:

- Possono essere aggiunti e rimossi da un'installazione di Helm senza impattare lo
  strumento principale.
- Possono essere scritti in qualsiasi linguaggio di programmazione.
- Si integrano con Helm e vengono visualizzati in `helm help` e in altri luoghi.

I plugin di Helm si trovano in `$HELM_PLUGINS`. È possibile trovarne il valore corrente,
compreso il valore predefinito quando non è impostato nell'ambiente, usando il comando
`helm env`.

Il modello a plugin di Helm è parzialmente basato sul modello a plugin di Git. A tal fine,
a volte si sente parlare di `helm` come il  _porcelain_ layer, mentre i plugin sono il _plumbing_. Questo è un modo abbreviato per suggerire che Helm fornisce
l'esperienza dell'utente e la logica di elaborazione di primo livello, mentre i plugin svolgono il
"lavoro di dettaglio" per eseguire un'azione desiderata.

## Installazione di un plugin

I plugin vengono installati con il comando `$ helm plugin install <path|url>`. È possibile
 inserire il percorso di un plugin sul file system locale o l'url di un repo VCS remoto.
Il comando `helm plugin install` clona o copia il plugin nel 
percorso/url indicato in `$HELM_PLUGINS`

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

Se si dispone di una distribuzione tar del plugin, è sufficiente decomprimere il plugin nella cartella
`$HELM_PLUGINS`. È anche possibile installare i plugin in formato tar
 direttamente da url, lanciando `helm plugin install
https://domain/path/to/plugin.tar.gz`

## Building Plugins

Per molti versi, un plugin è simile a un chart. Ogni plugin ha una cartella di primo livello
 e un file `plugin.yaml`.

```
$HELM_PLUGINS/
  |- last/
      |
      |- plugin.yaml
      |- last.sh

```

Nell'esempio precedente, il plugin `last` è contenuto in una cartella
chiamata `last`. Ha due file:  `plugin.yaml` (obbligatorio) e uno script eseguibile, `last.sh` (opzionale).

Il core di un plugin è un semplice file YAML chiamato `plugin.yaml`. Ecco un file YAML per un plugin che aiuta a ottenere il nome dell'ultimo rilascio:

```yaml
name: "last"
version: "0.1.0"
usage: "get the last release name"
description: "get the last release name"
ignoreFlags: false
command: "$HELM_BIN --host $TILLER_HOST list --short --max 1 --date -r"
platformCommand:
  - os: linux
    arch: i386
    command: "$HELM_BIN list --short --max 1 --date -r"
  - os: linux
    arch: amd64
    command: "$HELM_BIN list --short --max 1 --date -r"
  - os: windows
    arch: amd64
    command: "$HELM_BIN list --short --max 1 --date -r"
```

Il `name` è il nome del plugin. Quando Helm esegue questo plugin, questo è il nome che che utilizzerà (ad esempio, `helm NAME` invocherà questo plugin).

_`name` deve corrispondere al nome della cartella._ Nell'esempio precedente, ciò significa che il plugin
con `name: last` dovrebbe essere contenuto in una cartella chiamata `last`.

Restrizioni su `name`:

- `name` non può duplicare uno dei comandi di primo livello esistenti `helm`.
- `name` deve essere limitato ai caratteri ASCII a-z, A-Z, 0-9, `_` e `-`.

`version` è la versione SemVer 2 del plugin. `usage` e `description` sono
utilizzati per generare il testo di aiuto di un comando.

Lo switch `ignoreFlags` indica a Helm di non passare flag al plugin. Quindi, se un plugin viene chiamato con `helm myplugin --foo` e `ignoreFlags: true`, allora
`--foo` viene silenziosamente scartato.

Infine, cosa più importante, `platformCommand` o `command` è il comando
che questo plugin eseguirà quando viene chiamato. La sezione `platformCommand`
definisce le varianti di un comando specifiche per sistema operativo/architettura. Le seguenti
regole per decidere quale comando utilizzare:

- Se `platformCommand` è presente, verrà cercato per primo.
- Se sia `os` che `arch` corrispondono alla piattaforma corrente, la ricerca si interrompe e viene utilizzato il comando.
- Se `os` corrisponde e non c'è una corrispondenza più specifica con `arch`, il comando verrà utilizzato.
- Se non viene trovata alcuna corrispondenza con `platformCommand`, verrà utilizzato il comando predefinito `command`.
- Se non vengono trovate corrispondenze in `platformCommand` e non è presente alcun `comando`, Helm   uscirà con un errore.

Le variabili d'ambiente vengono interpolate prima dell'esecuzione del plugin. Il modello
illustra la via preferenziale per indicare dove risiede il programma del plugin.

Esistono alcune strategie per lavorare con i comandi dei plugin:

- Se un plugin include un eseguibile, l'eseguibile per un `platformCommand:` o un `command:` deve essere impacchettato nella directory del plugin.
- La linea `platformCommand:` o `command:` avrà le variabili d'ambiente espanse prima dell'esecuzione. 
`$HELM_PLUGIN_DIR` punterà alla cartella dei plugin.
- Il comando stesso non viene eseguito in una shell. Quindi non è possibile eseguire uno script.
- Helm inietta molte configurazioni nelle variabili d'ambiente. 
Date un occhiata  per vedere quali informazioni sono disponibili.
- Helm non fa alcuna ipotesi sul linguaggio del plugin. È possibile scriverlo
  in qualsiasi linguaggio si preferisca.
- I comandi sono responsabili dell'implementazione di testi di aiuto specifici per `-h` e
  `--help`. Helm userà `usage` e `description` per `helm help` e `helm
  help myplugin`, ma non gestirà `helm myplugin --help`.

## Downloader Plugins
Per impostazione predefinita, Helm è in grado di estrarre i chart tramite HTTP/S. A partire da Helm 2.4.0, i plugin 
possono avere una capacità speciale di scaricare chart da fonti arbitrarie.

I plugin devono dichiarare questa capacità speciale nel file `plugin.yaml` (livello superiore):

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

Se tale plugin è installato, Helm può interagire con il repository usando lo schema di protocollo specificato invocando il `comand`.
 Il repository speciale 
deve essere aggiunto in modo simile a quelli normali: `helm repo add favoritemyprotocol://example.com/` Le regole per i repository speciali sono le stesse di quelli regolari: Helm deve essere in grado di scaricare il file `index.yaml` per poter
scoprire e memorizzare nella cache l'elenco dei chart disponibili.

Il comando definito sarà invocato con il seguente schema: `command certFile
keyFile caFile full-URL`. Le credenziali SSL provengono dalla definizione del repo
memorizzate in `$HELM_REPOSITORY_CONFIG`.
(cioè, `$HELM_CONFIG_HOME/repositories.yaml`). Un downloader plugin 
dovrebbe scaricare il contenuto grezzo su stdout e segnalare gli errori su stderr.

Il comando downloader supporta anche subcommands o argomenti, consentendo di
specificare ad esempio il subcommand `bin/mydownloader -d` nel file `plugin.yaml`. Questo
è utile se si vuole usare lo stesso eseguibile per il comando principale del plugin e per
il comando downloader, ma con un subcommand diverso per ciascuno.

## Variabili d'ambiente

Quando Helm esegue un plugin, passa l'environment esterno al plugin e inietta alcune variabili d'ambiente aggiuntive.

Variabili come `KUBECONFIG` sono impostate per il plugin se sono impostate nell'ambiente esterno.

Viene garantito che le seguenti variabili siano impostate:

- `HELM_PLUGINS`:Il percorso della cartella dei plugin.
- `HELM_PLUGIN_NAME`: Il nome del plugin, come invocato da `helm`. Quindi `helm
  myplug` avrà il nome breve `myplug`.
- `HELM_PLUGIN_DIR`: La directory che contiene il plugin.
- `HELM_BIN`: Il percorso del comando `helm` (come eseguito dall'utente).
- `HELM_DEBUG`: Indica se il flag di debug è stato impostato da helm.
- `HELM_REGISTRY_CONFIG`: Il percorso della configurazione del registry (se
  se si usa). Si noti che l'uso di Helm con i registry è una funzione sperimentale.
- `HELM_REPOSITORY_CACHE`: Il percorso dei file della cache del repository.
- `HELM_REPOSITORY_CONFIG`: Il percorso del file di configurazione del repository.
- `HELM_NAMESPACE`: Il namespace dato al comando `helm` (generalmente usando il flag
  il flag `-n`).
- `HELM_KUBECONTEXT`: Il nome del contesto di configurazione di Kubernetes dato al comando
  `helm`.

Inoltre, se è stato specificato esplicitamente un file di configurazione di Kubernetes, esso verrà
sarà impostato come variabile `KUBECONFIG`.

## Una nota sul flag parsing

Quando si esegue un plugin, Helm analizza i flag globali per il proprio uso. Nessuno di questi
 flag viene passato al plugin.

- `--debug`: Se viene specificato, `$HELM_DEBUG` viene impostato a `1`.
- `--registry-config`: Viene convertito in `$HELM_REGISTRY_CONFIG`.
- `--repository-cache`: Viene convertito in `$HELM_REPOSITORY_CACHE`.
- `--repository-config`: Viene convertito in `$HELM_REPOSITORY_CONFIG`.
- `--namespace` e `-n`: Viene convertito in `$HELM_NAMESPACE`.
- `--kube-context`: Viene convertito in `$HELM_KUBECONTEXT`.
- `--kubeconfig`: Viene convertito in `$KUBECONFIG`.

I plugin dovrebbero mostrare un testo di aiuto e poi uscire per `-h` e `--help`. In tutti gli
altri casi, i plugin possono usare i flag come meglio credono.

## Supporto per l'autocompletamento della shell

A partire da Helm 3.2, un plugin può opzionalmente fornire il supporto per il completamento automatico della shell come parte del meccanismo di autocompletamento di Helm.
 
### Autocompletamento statico

Se un plugin fornisce i propri flag e/o sotto-comandi, può informare Helm di questi, disponendo di un file `completion.yaml` che si trova nella cartella principale del plugin.
Il file `completion.yaml` ha la forma:

```yaml
name: <pluginName>
flags:
- <flag 1>
- <flag 2>
validArgs:
- <arg value 1>
- <arg value 2>
commands:
  name: <commandName>
  flags:
  - <flag 1>
  - <flag 2>
  validArgs:
  - <arg value 1>
  - <arg value 2>
  commands:
     <and so on, recursively>
```

Note:
1. Tutte le sezioni sono facoltative ma devono essere fornite se applicabili.
2. I flag non devono includere il prefisso `-` o `--`.
3. Possono e devono essere specificati flag sia brevi che lunghi. Un flag breve non deve necessariamente
 essere associato alla corrispondente forma lunga, ma entrambe le forme devono essere
   elencate.
4. I flag non devono essere ordinati in alcun modo, ma devono essere elencati nel punto corretto della gerarchia dei sottocomandi del file.
5. I flag globali esistenti di Helm sono già gestiti dal meccanismo di autocompletamento di Helm, quindi i plugin non devono specificare i seguenti flag `--debug`,
`--namespace` o `-n`, `--kube-context` e `--kubeconfig`, o qualsiasi altro flag globale.

6. L'elenco `validArgs` fornisce un elenco statico di possibili completamenti del
   primo parametro di un sottocomando.  Non è sempre possibile
   fornire tale elenco in anticipo (vedere la sezione [Completamento dinamico](#completamento-dinamico)), nel qual caso la sezione
`validArgs` può essere omessa.

Il file `completion.yaml` è del tutto opzionale.  Se non viene fornito, Helm
non fornirà semplicemente il completamento automatico della shell per il plugin (a meno che [Completamento dinamico](#completamento-dinamico) sia supportato dal plugin).  Inoltre, aggiungendo un file
`completion.yaml` è compatibile con le versioni precedenti e non avrà alcun impatto sul comportamento del plugin quando si utilizzano versioni precedenti di helm.

A titolo di esempio, per il [`fullstatus
](https://github.com/marckhouzam/helm-fullstatus) che non ha sottocomandi, ma accetta gli stessi flag del comando `helm status`, il file
file `completion.yaml` è:

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

Un esempio più complesso per il 
[`2to3`](https://github.com/helm/helm-2to3), ha un file `completion.yaml` del tipo:

```yaml
name: 2to3
commands:
- name: cleanup
  flags:
  - config-cleanup
  - dry-run
  - l
  - label
  - release-cleanup
  - s
  - release-storage
  - tiller-cleanup
  - t
  - tiller-ns
  - tiller-out-cluster
- name: convert
  flags:
  - delete-v2-releases
  - dry-run
  - l
  - label
  - s
  - release-storage
  - release-versions-max
  - t
  - tiller-ns
  - tiller-out-cluster
- name: move
  commands:
  - name: config
    flags:
    - dry-run
```

### Completamento dinamico

Sempre a partire da Helm 3.2, i plugin possono fornire il proprio completamento automatico della shell. 
L'autocompletamento dinamico della shell è il completamento dei valori dei parametri o dei flag che non possono essere
definiti in anticipo.  Ad esempio,
il completamento dei nomi delle release di helm attualmente disponibili sul cluster.

Affinché il plugin supporti l'autocompletamento dinamico, deve fornire un file
 **eseguibile** chiamato `plugin.complete` nella sua directory principale. Quando lo script di completamento di
Helm richiede un completamento dinamico per il plugin, eseguirà il file `plugin.complete`., passandogli la riga di comando che deve essere completata.  L'eseguibile `plugin.complete` dovrà avere la logica per
determinare quali siano le scelte corrette per il completamento e inviarle allo standard
per essere utilizzato dallo script di completamento di Helm.

Il file `plugin.complete` è del tutto opzionale.  Se non viene fornito, Helm
non fornirà il completamento automatico dinamico per il plugin.  Inoltre, l'aggiunta di un file `plugin.complete` è compatibile con le versioni precedenti e non avrà alcun impatto sul comportamento del plugin quando si utilizza
con versioni precedenti di Helm.

L'output dello script `plugin.complete` dovrebbe essere un elenco separato da new-line char
come ad esempio:

```
rel1
rel2
rel3
```

Quando viene richiamato `plugin.complete`, l'ambiente del plugin viene impostato come quando viene richiamato lo script principale del plugin.
Pertanto, le variabili `$HELM_NAMESPACE`,
`$HELM_KUBECONTEXT` e tutte le altre variabili del plugin saranno già impostate e i corrispondenti flag globali saranno rimossi.

Il file `plugin.complete` può essere in qualsiasi forma eseguibile; può essere uno script di shell, un programma Go o qualsiasi altro tipo di programma che Helm può eseguire. Il file
 `plugin.complete` ***deve*** avere i permessi di esecuzione per l'utente. Il file
 `plugin.complete` ***deve*** terminare con codice di successo (valore 0).

In alcuni casi, il completamento dinamico richiederà di ottenere informazioni dal cluster Kubernetes.Ad esempio, il plugin `helm fullstatus` richiede come input il nome di una release.
Nel plugin `fullstatus`, per il suo script `plugin.complete`
fornisce il completamento per i nomi dei rilasci correnti, può semplicemente eseguire `helm list -q` e produrre il risultato.

Se si vuole usare lo stesso eseguibile per l'esecuzione del plugin e per il suo completamento, lo script
`plugin.complete` deve richiamare l'eseguibile del plugin principale  con qualche parametro o flag speciale; quando l'eseguibile principale del plugin
rileva il parametro o il flag speciale, saprà di dover eseguire il completamento. Nel nostro
 esempio, `plugin.complete` potrebbe essere implementato in questo modo:

```sh
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

Il vero script del plugin `fullstatus` (`status.sh`) deve quindi cercare il flag `--complete`
e, se lo trova, stampare il completamento corretto.

### Suggerimenti e trucchi

1. La shell filtra automaticamente le scelte di completamento che non corrispondono all'input dell'utente. Un plugin può quindi restituire tutti i completamenti rilevanti senza
   rimuovere quelli che non corrispondono all'input dell'utente.  Ad esempio, se la riga di comando è `helm fullstatus ngin<TAB>`, lo script `plugin.complete` può
   stampare *tutti* i nomi dei rilasci (dello spazio dei nomi `default`), non solo quelli che iniziano con `ngin`.
; la shell manterrà solo quelli che iniziano con
   `ngin`.
2. Per semplificare il supporto al completamento dinamico, specialmente se si ha un plugin complesso, 
   si può fare in modo che lo script `plugin.complete` chiami lo script principale del plugin e richieda le scelte di completamento.
 Si veda la sezione [Completamento dinamico](#completamento-dinamico) per un esempio.
3. Per eseguire il debug del completamento dinamico e del file `plugin.complete`, si può eseguire il comando
   seguente per vedere i risultati del completamento:
    - `helm __complete <nomeplugin> <argomenti da completare>`.  Per esempio:
    - `helm __complete fullstatus --output js<ENTER>`,
    - `helm __complete fullstatus -o json ""<ENTER>`.
