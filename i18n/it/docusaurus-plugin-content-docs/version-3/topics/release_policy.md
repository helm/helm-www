---
title: "Politica sui rilasci pianificati"
description: "Descrive la politica dei programmi di rilascio di Helm."
---

A beneficio dei suoi utenti, Helm definisce e annuncia in anticipo le date di rilascio.
Questo documento descrive la politica che regola il programma di rilascio di Helm.

## Calendario dei rilasci

Il calendario pubblico dei prossimi rilasci di Helm è disponibile [qui] (https://helm.sh/calendar/release).

## Versioni semantiche

Le versioni di Helm sono espresse come `x.y.z`, dove `x` è la versione maggiore, `y` è la versione minore e `z` è la versione della patch, secondo [Semantic
Versioning](https://semver.org/spec/v2.0.0.html).

## Rilasci di patch

Le patch release forniscono agli utenti correzioni di bug e di sicurezza.  Non
contengono nuove funzionalità.

Il rilascio di una nuova patch relativa all'ultima minor/major release avverrà di norma una volta al mese, il secondo mercoledì di ogni mese.

Un rilascio di patch per correggere una regressione ad alta priorità o un problema di sicurezza può essere effettuato ogni volta che è necessario.

Il rilascio di una patch sarà annullato per uno dei seguenti motivi:
- se non ci sono nuovi contenuti dal rilascio precedente
- se la data di rilascio della patch cade una settimana prima della release candidate (RC1) di una prossima release minore
- se la data di rilascio della patch cade entro le quattro settimane successive a una release minore

## Rilasci minori

I rilasci minori contengono correzioni di sicurezza e bug, oltre a nuove funzionalità.  Sono retrocompatibili per quanto riguarda l'API e l'uso della CLI.

Per allinearsi con i rilasci di Kubernetes, verrà rilasciata una minor release di helm ogni 4 mesi (3 release all'anno).Se necessario, è possibile effettuare ulteriori rilasci minori, che non influenzeranno la tempistica di un rilascio futuro annunciato, a meno che la release annunciata non sia a meno di 7 giorni di distanza.

In concomitanza con la pubblicazione di una release, la data della prossima release minore
sarà annunciata e pubblicata sulla pagina web principale di Helm.

## Rilasci maggiori

Le versioni maggiori contengono cambiamenti radicali.  Tali rilasci sono rari, ma a volte sono necessarie per consentire a helm di continuare a evolversi in nuove e importanti direzioni.

Le major release possono essere difficili da pianificare.  Per questo motivo, la data di rilascio finale definitiva sarà scelta e annunciata solo dopo che sarà disponibile la prima versione beta di tale release.