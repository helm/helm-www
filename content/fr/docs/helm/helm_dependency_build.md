---
title: "Helm Dependency Build"
---

## helm dependency build

reconstruire le répertoire charts/ à partir du fichier Chart.lock

### Synopsis

Reconstruire le répertoire charts/ à partir du fichier Chart.lock.

Build est utilisé pour reconstruire les dépendances d'un chart selon l'état spécifié dans le fichier lock. Cela ne renégociera pas les dépendances, comme le fait la commande `helm dependency update`.

Si aucun fichier lock n'est trouvé, la commande `helm dependency build` aura le même comportement que la commande `helm dependency update`.

```
helm dependency build CHART [flags]
```

### Options

```
  -h, --help             Aide pour la commande build
      --keyring string   Porte-clés contenant des clés publiques (par defaut "~/.gnupg/pubring.gpg")
      --skip-refresh     Ne pas actualiser le cache du dépôt local
      --verify           Vérifier les paquets par rapport aux signatures
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

* [helm dependency](helm_dependency.md) - Gérer les dépendances d'un chart
