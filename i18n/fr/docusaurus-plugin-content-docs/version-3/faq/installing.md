---
title: Installation
sidebar_position: 2
---

## Installation

### Pourquoi n'y a-t-il pas de paquets natifs de Helm pour Fedora et d'autres distributions Linux ?

Le projet Helm ne maintient pas de paquets pour les systèmes d'exploitation et les environnements. La communauté Helm peut fournir des paquets natifs et si le projet Helm en est informé, ils seront listés. C'est ainsi que la formule Homebrew a été créée et listée. Si vous êtes intéressé par la maintenance d'un paquet, nous serions ravis de vous accompagner.

### Pourquoi fournissez-vous un script `curl ...|bash` ?

Il existe un script dans notre dépôt (`scripts/get-helm-3`) qui peut être exécuté sous la forme d'un script `curl ..|bash`. Les transferts sont tous protégés par HTTPS et le script effectue quelques vérifications sur les paquets qu'il télécharge. Cependant, le script présente tous les dangers habituels de tout script shell.

Nous le fournissons parce qu'il est utile, mais nous suggérons aux utilisateurs de lire attentivement le script avant de l'exécuter. Ce que nous souhaiterions vraiment, cependant, ce sont de meilleures versions de Helm sous forme de paquets.

### Comment puis-je placer les fichiers du client Helm ailleurs que dans leurs emplacements par défaut ?

Helm utilise la structure XDG pour le stockage des fichiers. Il existe des variables d'environnement que vous pouvez utiliser pour remplacer ces emplacements :

- `$XDG_CACHE_HOME` : définit un emplacement alternatif pour le stockage des fichiers mis en cache.
- `$XDG_CONFIG_HOME` : définit un emplacement alternatif pour le stockage de la configuration Helm.
- `$XDG_DATA_HOME` : définit un emplacement alternatif pour le stockage des données Helm.

Notez que si vous avez des dépôts existants, vous devrez les ajouter à nouveau avec `helm repo add...`.
