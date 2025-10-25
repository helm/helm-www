---
title: helm dependency
---
gestion des dépendances d'un chart

### Synopsis

Gère les dépendances d'un chart.

Les charts Helm stockent leurs dépendances dans le dossier `charts/`. Pour les développeurs de chart, Il est souvent plus facile de gérer les dépendances dans le fichier `Chart.yaml` qui déclare toutes les dépendances.

Les commandes de dépendance fonctionnent sur ce fichier, ce qui facilite la synchronisation  entre les dépendances souhaitées et les dépendances réelles stockées dans le répertoire `charts/`.

Par exemple, ce fichier Chart.yaml déclare deux dépendances :

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "https://example.com/charts"
    - name: memcached
      version: "3.2.1"
      repository: "https://another.example.com/charts"


Le 'name' doit être le nom d'un chart, où ce nom doit correspondre au nom dans le fichier `Chart.yaml` de ce chart.

Le champ 'version'  doit contenir une version sémantique ou une plage de version. 

L'URL du 'repository' doit pointer vers un dépôt de Chart. Helm s'attend à ce qu'en ajoutant `/index.yaml` à l'URL, il puisse récupérer l'index du dépôt de chart. Note : 'repository' peut être un alias. L'alias doit commencer par `alias:` ou `@`.

À partir de la version 2.2.0, le dépôt peut être défini comme le chemin d'accès au répertoire des charts dépendants stockés localement. Le chemin doit commencer par le préfixe `file://`. Par exemple :

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "file://../dependency_chart/nginx"

Si le chart dépendant est récupéré localement, il n'est pas nécessaire d'ajouter le dépôt à Helm avec la commande `helm add repo`. La correspondance des versions est également prise en charge pour ce cas.

### Options

```
  -h, --help   Aide pour la commande dependency
```

### Options héritées des commandes parents

```
      --burst-limit int                 Limite coté client de la bande passante (par défaut 100)
      --debug                           Active la sortie détaillée
      --kube-apiserver string           L'adresse et le port API du serveur Kubernetes
      --kube-as-group stringArray       Groupe à utiliser pour l'opération, cet argument peut être répété pour spécifier plusieurs groupes
      --kube-as-user string             Nom d'utilisateur à utiliser pour l'operation
      --kube-ca-file string             Le fichier de l'autorité de certification pour la connexion à l'API Kubernetes
      --kube-context string             Nom du contexte kubeconfig à utiliser
      --kube-insecure-skip-tls-verify   Si true, la validité du certificat du serveur API Kubernetes ne sera pas vérifiée. Cela fera les connexions HTTPS non sûres
      --kube-tls-server-name string     Nom du serveur utilisé pour la validation du certificat du serveur API Kubernetes. S'il n'est pas fourni, le nom de la machine cliente utilisée pour contacter le serveur sera utilisé
      --kube-token string               Jeton utilisé pour l'authentification
      --kubeconfig string               Chemin du fichier de configuration kubeconfig
  -n, --namespace string                Namespace à utilisé pour la requête
      --qps float32                     Requêtes par seconde utilisées lors de la communication avec l'API Kubernetes, sans compter le bursting
      --registry-config string          Chemin vers le fichier de configuration du registre (par défaut "~/.config/helm/registry/config.json")
      --repository-cache string         Chemin vers le fichier contenant les index du répertoire mis en cache (par défaut "~/.cache/helm/repository")
      --repository-config string        Chemin vers le fichier contenant les noms et URLs des répertoires (par défaut "~/.config/helm/repositories.yaml")
```

### Voir également

* [helm](/helm/helm.md) - Le gestionnaire de package Helm pour Kubernetes.
* [helm dependency build](/helm/helm_dependency_build.md) - Reconstruire le répertoire charts/ en fonction du fichier Chart.lock
* [helm dependency list](/helm/helm_dependency_list.md) - Lister les dépendances pour un chart donné
* [helm dependency update](/helm/helm_dependency_update.md) - Met à jour le répertoire charts/ basé sur le contenu du fichier Chart.yaml
