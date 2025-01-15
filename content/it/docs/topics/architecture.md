---
title: "Architettura di Helm"
description: "Descrive l'architettura di Helm ad alto livello."
aliases: ["/docs/architecture/"]
weight: 8
---

# Architettura di Helm

Questo documento descrive l'architettura di Helm ad alto livello.

## Lo scopo di Helm

Helm è uno strumento per la gestione dei pacchetti Kubernetes chiamati _charts_. Helm può fare quanto segue:

- Creare nuovi chart da zero
- Pacchettizzare i chart in file archivi (tgz)
- Interagire con i repository dei chart, dove questi sono memorizzati
- installare e disinstallare chart in un cluster Kubernetes esistente
- Gestire il ciclo di rilascio dei chart installati con Helm.

Per Helm, ci sono tre concetti importanti:

1. Il _chart_ è un insieme di informazioni necessarie per creare un'istanza di un'applicazione Kubernetes.
2. Il _config_ contiene informazioni di configurazione che possono essere unite in un chart impacchettato per creare un oggetto rilasciabile.
3. Una _release_ è un'istanza in esecuzione di un _chart_, combinato con una specifica
   _config_.

## Componenti

Helm è un eseguibile implementato in due parti distinte:

Il **Client Helm** è un client a riga di comando per gli utenti finali. Il client è
responsabile di quanto segue:

- Sviluppo del chart locale
- Gestione dei repository
- Gestione dei rilasci
- Interfacciamento con la libreria Helm
  - Invio di chart da installare
  - Richiedere l'aggiornamento o la disinstallazione di release esistenti.

La **Libreria Helm** fornisce la logica per l'esecuzione di tutte le operazioni di Helm. Si
si interfaccia con il server API di Kubernetes e fornisce le seguenti funzionalità:

- Combinazione di un chart e di una configurazione per costruire un rilascio.
- Installazione dei chart in Kubernetes e fornitura del successivo oggetto di rilascio.
- Aggiornamento e disinstallazione dei chart interagendo con Kubernetes.

La libreria Helm standalone incapsula la logica Helm in modo che possa essere sfruttata da diversi client.

## Implementazione

Il client e la libreria Helm sono scritti nel linguaggio di programmazione Go.

La libreria utilizza il client Kubernetes per comunicare con Kubernetes.
Attualmente, questa libreria utilizza REST+JSON. Memorizza le informazioni in Secrets situatiall'interno di Kubernetes. Non ha bisogno di un proprio database.

I file di configurazione sono, quando possibile, scritti in YAML.