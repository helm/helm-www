---
title: helm rollback
---
Restaurer une release vers une révision précédente

### Synopsis

Cette commande restaure une release vers une révision précédente.

Le premier argument de cette commande est le nom de la release  et le second est la révision (numéro de version). Si cette argument est omis ou défini sur 0, la release précédente sera restaurée.

Pour voir les numéro de révision, lancez la commande `helm history <RELEASE>`.


```
helm rollback <RELEASE> [REVISION] [flags]
```

### Options

```
      --cleanup-on-fail    Suppression des nouvelles ressources créées lors de cette restauration en cas d'échec de la restauration
      --dry-run            Simule une restauration
      --force              Force la mise à jour des ressources en les supprimant/recréant si nécessaire
  -h, --help               Aide pour la commande rollback
      --history-max int    Limite le nombre maximum de révision sauvegardé par release. Utilisez 0 pour ne pas fixer de limite (par défaut 10)
      --no-hooks           Empêche les hooks de fonctionner pendant la restauration
      --recreate-pods      Effectue le redémarrage des pods pour la ressource, le cas échéant
      --timeout duration   Temps d'attente pour chaque opération Kubernetes (comme les Jobs pour les hooks) (par défaut 5m0s)
      --wait               Si fixé, attendra que tous les pods, PVC, services et le nombre minimum de pods d'un déploiement, d'un StatefulSet ou d'un ReplicatSet soient à l'état prêt avant de marquer la release comme réussie. Il attendra aussi longtemps que la valeur de --timeout
      --wait-for-jobs      Si fixé et --wait activé, il attendra que tous les jobs soient terminés avant de marquer la release comme réussie. Il attendra aussi longtemps que la valeur de --timeout
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

* [helm](/helm/helm.md) - Le gestionnaire de package Helm pour Kubernetes

