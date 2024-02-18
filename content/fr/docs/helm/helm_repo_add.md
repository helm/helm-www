---
title: "Helm Repo Add"
---

## helm repo add

Ajouter un répertoire de chart

```
helm repo add [NAME] [URL] [flags]
```

### Options

```
      --allow-deprecated-repos     Par défaut, cette commande ne permettra pas d'ajouter des dépôts officiels qui ont été définitivement supprimés. Cela désactive ce comportement
      --ca-file string             Vérifie les certificats des serveurs compatibles HTTPS à l'aide de ce bundle CA
      --cert-file string           Identifie le client HTTPS à l'aide de ce fichier de certificat SSL
      --force-update               Remplace (réécrit) le repo s'il existe déjà
  -h, --help                       Aide pour la commande add
      --insecure-skip-tls-verify   Passe les vérifications du certificat TLS pour le transfert du chart
      --key-file string            Identifie le client HTTPS à l'aide de ce fichier de clé SSL
      --no-update                  Ignoré. Auparavant, cela désactivait les mises à jour forcées. Il est obsolète et remplacé par --force-update.
      --pass-credentials           Transmettre les informations d'identification à tous les domaines
      --password string            Mot de passe du répertoire
      --password-stdin             Lis le mot de passe depuis la sortie standard
      --username string            Nom d'utilisateur du répertoire
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

* [helm repo](helm_repo.md) - Ajouter, lister, supprimer, mettre à jour et indexer des répertoires de charts

