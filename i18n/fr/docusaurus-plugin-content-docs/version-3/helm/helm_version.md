---
title: helm version
---
Affiche les informations sur la version du client

### Synopsis

Affiche la version de Helm.

Cela affiche une représentation de la version de Helm.
Le résultat ressemblera à ceci :

`version.BuildInfo{Version:"v3.2.1", GitCommit:"fe51cd1e31e6a202cba7dead9552a6d418ded79a", GitTreeState:"clean", GoVersion:"go1.13.10"}`

- Version : est la version sémantique de la release.
- GitCommit est le hash SHA pour le commit à partir duquel cette version a été construite.
- GitTreeState est a "clean" s'il n'y a pas de changement de code local lorsque ce binaire a été construit, et "dirty" si le binaire a été construit à partir de code modifié localement.
- GoVersion est la version de Go qui a été utilisé pour compiler Helm.

Lorsque vous utilisez l'indicateur `--template`, les propriétés suivantes peuvent être utilisées dans le modèle :

- .Version contient la version sémantique de Helm.
- .GitCommit est le commit git.
- .GitTreeState est l'état du git tree quand Helm a été construit.
- .GoVersion contient la version de Go qui a été utilisé pour compiler Helm.

Par exemple : `--template='Version: {{.Version}}'` retournera : 'Version: v3.2.1'.


```
helm version [flags]
```

### Options

```
  -h, --help              Aide pour la commande version
      --short             Affiche le numéro de version
      --template string   Modèle pour le format de version
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

