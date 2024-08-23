---
title: "Installation"
weight: 2
---

## Installation

### Pourquoi n'y a-t-il pas de packages natifs de Helm pour Fedora et d'autres distributions Linux ?

Le projet Helm ne maintient pas de packages pour les systèmes d'exploitation et les environnements. La communauté Helm peut fournir des packages natifs et, si le projet Helm en est informé, ils seront listés. C'est ainsi que la formule Homebrew a été créée et répertoriée. Si vous êtes intéressé par la maintenance d'un package, nous serions ravis de vous accueillir.

### Pourquoi fournissez-vous un script `curl ...|bash` ?

Il y a un script dans notre dépôt (`scripts/get-helm-3`) qui peut être exécuté en tant que script `curl ..|bash`. Les transferts sont tous protégés par HTTPS, et le script effectue une certaine vérification des packages qu'il récupère. Cependant, le script présente tous les dangers habituels de tout script shell.

Nous le fournissons parce qu'il est utile, mais nous suggérons aux utilisateurs de lire attentivement le script avant de l'exécuter. Ce que nous aimerions vraiment, cependant, ce sont des versions de Helm mieux packagées.

### Comment puis-je placer les fichiers du client Helm à un autre endroit que les emplacements par défaut ?

Helm utilise la structure XDG pour stocker les fichiers. Il existe des variables d'environnement que vous pouvez utiliser pour remplacer ces emplacements :

- `$XDG_CACHE_HOME` : définir un emplacement alternatif pour stocker les fichiers en cache.
- `$XDG_CONFIG_HOME` : définir un emplacement alternatif pour stocker la configuration de Helm.
- `$XDG_DATA_HOME` : définir un emplacement alternatif pour stocker les données de Helm.

Notez que si vous avez des dépôts existants, vous devrez les ajouter à nouveau avec `helm repo add...`.

