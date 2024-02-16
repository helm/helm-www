---
title: "Helm Package"
---

## helm package

emballe un dossier de chart dans une archive de chart 

### Synopsis

Cette commande, emballe un chart dans un fichier archive versionné.
Si un chemin est donné, elle regardera si ce chemin est un chemin vers un chart (qui doit contenir un fichier Chart.yaml) puis emballe ce dossier.

Les archives de chart versionnés sont utilisées par les dépôts de paquets Helm.

Pour signer un chart, utilisez l'argument '--sign'. Dans la plupart des cas, vous devez également fournir  '--keyring path/to/secret/keys' et '--key keyname'.

  `$ helm package --sign ./mychart --key mykey --keyring ~/.gnupg/secring.gpg`

Si l'argument '--keyring' n'est pas spécifié, Helm utilisera généralement par défaut le trousseau de clés public, sauf si votre environnement est configuré autrement.


```
helm package [CHART_PATH] [...] [flags]
```

### Options

```
      --app-version string       Définit l'appVersion du chart pour cette version
  -u, --dependency-update        Met à jour les dépendances depuis le fichier "Chart.yaml" vers le dossier "charts/" avant de l'emballer
  -d, --destination string       Emplacement pour écrire le chart. (par défaut ".")
  -h, --help                     Aide pour la commande package
      --key string               Nom de la clé à utiliser lors de la signature. Utilisé si '--sign' est vrai
      --keyring string           Emplacement du porte clé public (par défaut "~/.gnupg/pubring.gpg")
      --passphrase-file string   Emplacement du fichier qui contient la passphrase utilisée lors de la signature. Utilisez "-" pour lire depuis stdin
      --sign                     Utilise une clé privée PGP pour signer ce paquet
      --version string           Définit la version de ce chart (semver version)
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

* [helm](helm.md) - Le gestionnaire de package Helm pour Kubernetes.
