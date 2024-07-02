---
title: "Gestione delle autorizzazioni per SQL storage backend"
description: "Scoprite come impostare le autorizzazioni quando si utilizza SQL storage backend."
aliases: ["/docs/permissions_sql_storage_backend/"]
---

Questo documento ha lo scopo di fornire agli utenti una guida per l'impostazione e la gestione dei permessi nell'utilizzo del SQL storage backend.

## Introduzione

Per gestire i permessi, Helm sfrutta la funzione RBAC di Kubernetes. Quando si utilizza
SQL storage backend, i ruoli di Kubernetes non possono essere utilizzati per determinare se un utente può accedere o meno a una determinata risorsa. 
Questo documento mostra come creare e
gestire questi permessi.

## Inizializzazione

La prima volta che la CLI di Helm si connetterà al database, il client si accerterà che sia stato
precedentemente inizializzato. Se così non fosse, si occuperà automaticamente dell'impostazione necessaria.
Questa inizializzazione richiede i privilegi di amministratore
sullo schema pubblico, o almeno per essere in grado di:

* creare una tabella
* concedere i privilegi sullo schema pubblico

Dopo l'esecuzione della migrazione sul database, tutti gli altri ruoli possono utilizzare il client.

## Concedere i privilegi a un utente non amministratore in PostgreSQL

Per gestire i permessi, il driver del backend SQL sfrutta l'opzione
[RLS](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html) (Row Security
Security Level) di PostgreSQL. RLS consente a tutti gli utenti di poter leggere/scrivere
dalla/alla stessa tabella, senza poter manipolare le stesse righe se non ne sono esplicitamente autorizzati a farlo. Per impostazione predefinita, qualsiasi ruolo che non sia stato
concesso esplicitamente con i giusti privilegi restituirà sempre un elenco vuoto
quando si esegue `helm list` e non sarà in grado di recuperare o modificare alcuna risorsa nel cluster.

Vediamo come concedere a un determinato ruolo l'accesso a specifici spazi dei nomi:

```sql
CREATE POLICY <name> ON releases_v1 FOR ALL TO <role> USING (namespace = 'default');
```

Questo comando concederà i permessi di lettura e scrittura a tutte le risorse che
soddisfano la condizione `namespace = 'default'' al ruolo `role'. Dopo aver creato
questa politica, l'utente che si connette al database per conto del ruolo
`role` sarà quindi in grado di vedere tutti i rilasci che risiedono nel namespace`default`.
quando si esegue `helm list`, e di modificarle e cancellarle.

I privilegi possono essere gestiti in modo granulare con RLS, e si potrebbe essere interessati a
limitare l'accesso alle diverse colonne della tabella:
* key
* type
* body
* name
* namespace
* version
* status
* owner
* createdAt
* modifiedAt
