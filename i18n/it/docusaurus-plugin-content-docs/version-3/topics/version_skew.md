---
title: "Helm Version Support Policy"
description: "Descrive la politica di rilascio delle patch di Helm e lo scostamento massimo di versione supportato tra Helm e Kubernetes."
---

Questo documento descrive il massimo scarto di versione supportato tra Helm e
Kubernetes.

## Versioni supportate

Le versioni di Helm sono espresse come `x.y.z`, dove `x` è la versione maggiore, `y` è la versione minore e `z` è la versione della patch, secondo la terminologia di [Semantic
Versioning](https://semver.org/spec/v2.0.0.html).

Il progetto Helm mantiene un branch di rilascio per la versione minore più recente.
Le correzioni applicabili, comprese quelle per la sicurezza, vengono raccolte nel ramo di rilascio, 
a seconda della gravità e della fattibilità. Maggiori dettagli si trovano in 
[Politica di rilascio di Helm](release_policy.md).

## Sfasamento della versione supportata

Quando viene rilasciata una nuova versione di Helm, questa viene compilata per una particolare
versione minore di Kubernetes. Ad esempio, Helm 3.0.0 interagisce con Kubernetes
utilizzando il client Kubernetes 1.16.2, quindi è compatibile con Kubernetes 1.16.

A partire da Helm 3, si presume che Helm sia compatibile con `n-3` versioni di Kubernetes con cui è stato compilato. A causa dei cambiamenti di Kubernetes tra le versioni minori, la politica di supporto di Helm
2 è leggermente più restrittiva, in quanto si presume che sia compatibile con `n-1` versioni di Kubernetes.

Ad esempio, se si utilizza una versione di Helm 3 compilata con la versione client di
API Kubernetes 1.17, allora dovrebbe essere sicuro l'utilizzo con Kubernetes 1.17,
1.16, 1.15 e 1.14. Se si sta utilizzando una versione di Helm 2 compilata
con le API client di Kubernetes 1.16, dovrebbe essere sicuro l'uso con 
Kubernetes 1.16 e 1.15.

Non è consigliabile utilizzare Helm con una versione di Kubernetes più recente di quella con cui è stato compilato in quanto Helm non fornisce alcuna garanzia di compatibilità.

Se si sceglie di utilizzare Helm con una versione di Kubernetes non supportata,
l'utilizzo avviene a proprio rischio e pericolo.

Per determinare quale versione di Helm è compatibile con il vostro cluster, consultate la tabella seguente.

| Helm Version | Supported Kubernetes Versions |
|--------------|-------------------------------|
| 3.16.x       | 1.31.x - 1.28.x               |
| 3.15.x       | 1.30.x - 1.27.x               |
| 3.14.x       | 1.29.x - 1.26.x               |
| 3.13.x       | 1.28.x - 1.25.x               |
| 3.12.x       | 1.27.x - 1.24.x               |
| 3.11.x       | 1.26.x - 1.23.x               |
| 3.10.x       | 1.25.x - 1.22.x               |
| 3.9.x        | 1.24.x - 1.21.x               |
| 3.8.x        | 1.23.x - 1.20.x               |
| 3.7.x        | 1.22.x - 1.19.x               |
| 3.6.x        | 1.21.x - 1.18.x               |
| 3.5.x        | 1.20.x - 1.17.x               |
| 3.4.x        | 1.19.x - 1.16.x               |
| 3.3.x        | 1.18.x - 1.15.x               |
| 3.2.x        | 1.18.x - 1.15.x               |
| 3.1.x        | 1.17.x - 1.14.x               |
| 3.0.x        | 1.16.x - 1.13.x               |
| 2.16.x       | 1.16.x - 1.15.x               |
| 2.15.x       | 1.15.x - 1.14.x               |
| 2.14.x       | 1.14.x - 1.13.x               |
| 2.13.x       | 1.13.x - 1.12.x               |
| 2.12.x       | 1.12.x - 1.11.x               |
| 2.11.x       | 1.11.x - 1.10.x               |
| 2.10.x       | 1.10.x - 1.9.x                |
| 2.9.x        | 1.10.x - 1.9.x                |
| 2.8.x        | 1.9.x - 1.8.x                 |
| 2.7.x        | 1.8.x - 1.7.x                 |
| 2.6.x        | 1.7.x - 1.6.x                 |
| 2.5.x        | 1.6.x - 1.5.x                 |
| 2.4.x        | 1.6.x - 1.5.x                 |
| 2.3.x        | 1.5.x - 1.4.x                 |
| 2.2.x        | 1.5.x - 1.4.x                 |
| 2.1.x        | 1.5.x - 1.4.x                 |
| 2.0.x        | 1.4.x - 1.3.x                 |
