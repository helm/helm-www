---
title: "Migrazione Helm da v2 a v3"
description: "Scoprite come migrare Helm da v2 a v3."
weight: 13
---

Questa guida mostra come migrare Helm da v2 a v3. Helm v2 deve essere installato e gestire le release in uno o più cluster.

## Panoramica dei cambiamenti di Helm 3

L'elenco completo dei cambiamenti da Helm 2 a 3 è documentato nella sezione [FAQ
(https://v3.helm.sh/docs/faq/#changes-since-helm-2). Di seguito è riportato un estratto
di alcuni di questi cambiamenti che l'utente dovrebbe conoscere prima e durante la migrazione:

1. Rimozione di Tiller:
   - Sostituisce l'architettura client/server con quella client/library (solo binary `helm`).
   - La sicurezza è ora basata sull'utente (delegata al cluster di utenti Kubernetes). 
   - I rilasci sono ora memorizzati come secrets all'interno del cluster e i metadati dell'oggetto release sono cambiati.
   - I rilasci sono persistiti in base al namespace della release e non più nel Tiller namespace.
2. Aggiornamento del repository dei chart:
   - `helm search` ora supporta sia la ricerca nel repository locale che l'esecuzione di query di ricerca
 nell'Hub degli artefatti
3. Chart apiVersion spostato a "v2" per le modifiche alle specifiche:
   - Dipendenze del chart collegate dinamicamente spostate in `Chart.yaml`.
     (`requirements.yaml` rimosso e requisiti --> dipendenze)
   - I library chart (chart helper/comuni) possono ora essere aggiunti come dipendenze di chart collegati dinamicamente
   - I chart hanno un campo di metadati `type` per definire che il chart è di tipo
     "applicazione" o "libreria". È un'applicazione per impostazione predefinita, il che significa che
     è renderizzabile e installabile
   - I chart di Helm 2 (apiVersion=v1) sono ancora installabili.
4. Aggiunta della specifica di directory XDG:
   - La home di Helm è stata rimossa e sostituita con una specifica di directory XDG per la memorizzazione dei file di configurazione.
   - Non è più necessario inizializzare Helm
   - Rimossi `helm init` e `helm home`.
5. Ulteriori modifiche:
   - L'installazione/set-up di Helm è semplificata:
     - Solo client Helm (helm binary) (senza Tiller).        
     - Paradigma Run-as-is
   - i repository `local` o `stable` non sono impostati di default
   - L'hook `crd-install` è stato rimosso e sostituito con la directory `crds` in chart
dove tutti i CRD in essa definiti saranno installati prima di qualsiasi rendering del chart.
   - il valore dell'annotazione del hook `test-failure` è stato rimosso e `test-success` è stato deprecato.
     Usare invece `test`
   - Comandi rimossi/sostituiti/aggiunti:
       - delete --> uninstall : rimuove tutta la cronologia dei rilasci per impostazione predefinita
         (in precedenza era necessario `--purge`)
       - fetch --> pull
       - home (rimosso)
       - init (rimosso)
       - install: richiede il nome dela release o l'argomento `--generate-name`.
       - inspect --> show
       - reset (rimosso)
       - serve (rimosso)
       - template: l'argomento `-x`/`--execute` è stato rinominato in `-s`/`--show-only`.
       - upgrade: Aggiunto l'argomento `--history-max` che limita il numero massimo di revisioni salvate per rilascio (0 per nessun limite)
   - La libreria Go di Helm 3 ha subito molte modifiche ed è incompatibile con
     la libreria Helm 2
   - I binari di rilascio sono ora ospitati su `get.helm.sh`.

## Casi d'uso per migrazione

I casi d'uso della migrazione sono i seguenti:

1. Helm v2 e v3 gestiscono lo stesso cluster:
   - Questo caso d'uso è consigliato solo se si intende eliminare gradualmente Helm v2 e non si richiede a v3 di gestire le release distribuite da v2. Tutte le nuove release in fase di distribuzione dovrebbero essere eseguite dalla v3 e le release esistenti distribuite dalla v2
     esistenti sono aggiornate/rimosse solo dalla v2.
   - Helm v2 e v3 possono tranquillamente gestire lo stesso cluster. Le versioni di Helm
     possono essere installate sullo stesso sistema o su sistemi separati
   - Se si installa Helm v3 sullo stesso sistema, è necessario eseguire un passaggio aggiuntivo 
     per garantire che entrambe le versioni del client possano coesistere fino alla rimozione del client Helm v2.Rinominare o collocare il binario di Helm v3 in una cartella diversa per evitare conflitti.
   
   - Altrimenti non ci sono conflitti tra le due versioni grazie alle
     seguenti distinzioni:
     - I file di archiviazione delle release (cronologia) v2 e v3 sono indipendenti l'uno dall'altro. Le
       modifiche includono la risorsa Kubernetes per la memorizzazione e i metadati dell'oggetto
       contenuti nella risorsa. I rilasci saranno anche su un namespace per
       utente invece di utilizzare namespace di Tiller (ad esempio, v2
       namespace predefinito di Tiller kube-system). v2 utilizza "ConfigMaps" o "Secrets"
       sotto namespace Tiller e la ownership `TILLER`. v3 usa "Secrets" nel namespace utente e ownership `helm`. I rilasci sono incrementali sia in
       v2 e v3
     - L'unico problema potrebbe esserci se le risorse Kubernetes con scope di cluster (ad es.
       `clusterroles.rbac`) sono definite in un chart. La distribuzione v3 fallirebbe 
       anche se unico nel namespace, perché le risorse si scontrerebbero.
     - La configurazione della v3 non usa più `$HELM_HOME` e utilizza invece le specifiche delle directory XDG Viene anche creata al volo, se necessario. È
       quindi indipendente dalla configurazione v2. Questo è applicabile solo quando
       entrambe le versioni sono installate sullo stesso sistema

2. Migrazione di Helm v2 a Helm v3:
   - Questo caso d'uso si applica quando si desidera che Helm v3 gestisca le release Helm v2 esistenti.    
   - Va notato che un client Helm v2:     
     - può gestire da 1 a molti cluster Kubernetes
     - può connettersi a 1 o più istanze di Tiller per un cluster.
   - Questo significa che bisogna essere consapevoli di questo quando si esegue la migrazione, in quanto le release
     vengono distribuite nei cluster da Tiller e dal suo namespace. È necessario
     quindi essere consapevoli della migrazione per ogni cluster e ogni istanza Tiller
     gestita dall'istanza del client Helm v2.
   - Il percorso di migrazione dei dati consigliato è il seguente:
     1. Backup dei dati v2
     2. Migrare la configurazione di Helm v2
     3. Migrare le release di Helm v2
     4. Quando si è certi che Helm v3 stia gestendo tutti i dati di Helm v2 (per tutti i cluster e le istanze Tiller dell'istanza client di Helm v2) come
 ci si aspetta, si procede alla pulizia dei dati di Helm v2.
   - Il processo di migrazione è automatizzato da Helm v3
     [2to3](https://github.com/helm/helm-2to3).

## Riferimenti

   - Plugin Helm v3 [2to3](https://github.com/helm/helm-2to3)
   - Blog [post](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)    
che spiega l'uso del plugin `2to3` con degli esempi
