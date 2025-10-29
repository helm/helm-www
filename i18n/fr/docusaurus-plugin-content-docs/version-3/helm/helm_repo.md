---
title: helm repo
---
Ajoute, supprime, liste, met à jour et index les référentiels de charts

### Synopsis

Cette commande se compose de plusieurs sous-commandes pour interagir avec des référentiels de charts.

Elle peut être utilisé pour ajouter, supprimer, lister et indexer des référentiels de charts.


### Options

```
  -h, --help   Aide pour la commande repo
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

* [helm](/helm/helm.md) - Le gestionnaire de packages Helm pour Kubernetes
* [helm repo add](/helm/helm_repo_add.md) - Ajoute un référentiel de charts
* [helm repo index](/helm/helm_repo_index.md) - Génère un fichier d'index à partir d'un référentiel contenant des charts packagés
* [helm repo list](/helm/helm_repo_list.md) - Liste les référentiels
* [helm repo remove](/helm/helm_repo_remove.md) - Supprime un ou plusieurs référentiels
* [helm repo update](/helm/helm_repo_update.md) - Met à jour les informations des charts disponible localement à partir des référentiels

