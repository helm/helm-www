---
title: "Helm Status"
---

## helm status

Affiche le statut de la release nommée

### Synopsis

Cette commande affiche l'état d'une release nommée. 
Le statut est composé de :
- heure du dernier déploiement
- namespace k8s dans lequel se trouve la release
- l'état de la release  (peut être : unknown, deployed, uninstalled, superseded, failed, uninstalling, pending-install, pending-upgrade or pending-rollback)
- révision de la release
- description de la release (peut être un message de complément ou un message d'erreur, besoin d'activer `--show-desc`)
- liste des ressources dont se compose cette release (besoin d'activer `--show-resources`)
- détails sur la dernière exécution de la suite de tests, si disponible
- notes supplémentaires fournies par le chart


```
helm status RELEASE_NAME [flags]
```

### Options

```
  -h, --help             Aide pour la commande status
  -o, --output format    Affiche la sortie dans le format spécifié. Valeurs autorisées : table, json, yaml (par défaut table)
      --revision int     Si fixé, affiche le statut de la release nommée avec la révision
      --show-desc        Si fixé, affiche la description de la release nommée
      --show-resources   Si fixé, affiche les ressources de la release nommée
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

* [helm](helm.md) - Le gestionnaire de package Helm pour Kubernetes
