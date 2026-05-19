---
title: helm template
---

Rendu local de modèles

### Synopsis


Rendu local de modèle de chart et affiche le résultat.

Toutes les valeurs qui seraient normalement recherchées ou récupérées dans le cluster seront simulées localement. De plus, aucun des tests côté serveur de validité ne sera effectué (par exemple, si une API est prise en charge).


```
helm template [NAME] [CHART] [flags]
```

### Options

```
  -a, --api-versions strings                       Versions de l'API Kubernetes utilisées pour Capabilities.APIVersions
      --atomic                                     Si défini, le processus d'installation supprimera l'installation en cas d'échec. L'argument --wait sera défini automatiquement si --atomic est utilisé
      --ca-file string                             Vérifie les certificats des serveurs compatibles HTTPS à l'aide de ce bundle CA
      --cert-file string                           Identifie le client HTTPS à l'aide de ce fichier de certificat SSL
      --create-namespace                           Créer le namespace de release s'il n'est pas présent
      --dependency-update                          Met à jour les dépendances si elles sont manquantes avant l'installation du chart
      --description string                         Ajoute une description personnalisée
      --devel                                      Utiliser également les versions de développement. Équivalent à version '>0.0.0-0'. Si --version est défini, ceci est ignoré
      --disable-openapi-validation                 Si défini, le processus d'installation ne validera pas les modèles générés par rapport au schéma OpenAPI de Kubernetes
      --dry-run string[="client"]                  Simule une installation. Si '--dry-run' est défini sans option ou comme '--dry-run=client', aucune tentative de connexion au cluster ne sera effectuée. En définissant '--dry-run=server', des tentatives de connexion au cluster seront autorisées
      --enable-dns                                 Active les recherches DNS lors du rendu des modèles
      --force                                      Force les mises à jour des ressources en utilisant une stratégie de remplacement
  -g, --generate-name                              Génère le nom (et omet le paramètre NAME)
  -h, --help                                       Aide pour la commande template
      --hide-notes                                 Si défini, ne pas afficher les notes dans la sortie de l'installation. N'affecte pas la présence dans les métadonnées du chart
      --include-crds                               Inclure les CRDs dans la sortie du modèle
      --insecure-skip-tls-verify                   Ignore les vérifications de certificat TLS lors du téléchargement du chart
      --is-upgrade                                 Définit .Release.IsUpgrade à la place de .Release.IsInstall
      --key-file string                            Identifie le client HTTPS en utilisant ce fichier de clé SSL
      --keyring string                             Emplacement des clés publiques utilisé pour la vérification (par défaut "~/.gnupg/pubring.gpg")
      --kube-version string                        Version de Kubernetes utilisée pour Capabilities.KubeVersion
  -l, --labels stringToString                      Étiquettes qui seront ajoutées aux métadonnées de la release. Doit être séparé par des virgules. (par défaut [])
      --name-template string                       Spécifie un modèle à utiliser pour le nom de la release
      --no-hooks                                   Empêche les hooks de fonctionner pendant l'installation
      --output-dir string                          Écrit les modèles exécutés dans des fichiers dans le dossier de sortie au lieu de la sortie standard (stdout)
      --pass-credentials                           Transmet les informations d'identification à tous les domaines
      --password string                            Mot de passe pour le dépôt de chart où se trouve le chart demandé
      --plain-http                                 Utilise une connexion HTTP non sécurisée pour le téléchargement du chart
      --post-renderer postRendererString           Chemin vers un exécutable à utiliser pour le post-rendu. S'il existe dans $PATH, le binaire sera utilisé, sinon il essaiera de rechercher l'exécutable au chemin spécifié
      --post-renderer-args postRendererArgsSlice   Un argument pour le post-rendu (peut être spécifié plusieurs fois) (par défaut [])
      --release-name                               Utilise le nom de la release dans le chemin du dossier de sortie
      --render-subchart-notes                      Si défini, génère les notes du sous-chart avec le chart parent
      --replace                                    Réutilise le nom donné, uniquement si ce nom correspond à une release supprimée qui reste dans l'historique. Ceci n'est pas sûr en production
      --repo string                                URL du dépôt du chart demandé
      --set stringArray                            Définit des valeurs en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=val1,key2=val2)
      --set-file stringArray                       Définit des valeurs depuis un fichier spécifique en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=path1,key2=path2)
      --set-json stringArray                       Définit des valeurs en JSON en ligne de commande (vous pouvez spécifier plusieurs ou séparer les valeurs par des virgules : key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    Définit une valeur littérale de type STRING en ligne de commande
      --set-string stringArray                     Définit des valeurs de type STRING en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=val1,key2=val2)
  -s, --show-only stringArray                      Affiche uniquement les manifestes rendus à partir des modèles donnés
      --skip-crds                                  Si défini, aucun CRD ne sera installé. Par défaut, les CRD sont installés s'ils ne sont pas déjà présents
      --skip-schema-validation                     Si défini, désactive la validation du schéma JSON
      --skip-tests                                 Exclut les tests de la sortie du modèle
      --take-ownership                             Si défini, l'installation ignorera la vérification des annotations Helm et prendra possession des ressources existantes
      --timeout duration                           Temps d'attente pour chaque opération Kubernetes (comme les Jobs pour les hooks) (par défaut 5m0s)
      --username string                            Nom d'utilisateur pour le dépôt du chart demandé
      --validate                                   Valide vos manifestes par rapport au cluster Kubernetes sur lequel vous êtes actuellement connecté. Il s'agit de la même validation effectuée lors d'une installation
  -f, --values strings                             Spécifie les valeurs dans un fichier YAML ou une URL (vous pouvez en spécifier plusieurs)
      --verify                                     Vérifie le package avant de l'utiliser
      --version string                             Spécifie la contrainte de version pour la version du chart à utiliser. Cette contrainte peut être un tag spécifique (ex : 1.1.1) ou elle peut faire référence à une plage valide (ex : ^2.0.0). Si non spécifié, la dernière version sera utilisée
      --wait                                       Si défini, attendra que tous les Pods, PVCs, Services, et le nombre minimum de Pods d'un Deployment, StatefulSet ou ReplicaSet soient dans un état prêt avant de marquer la release comme réussie. Attendra aussi longtemps que spécifié par '--timeout'
      --wait-for-jobs                              Si défini et que '--wait' est activé, attendra que tous les Jobs soient terminés avant de marquer la release comme réussie. Attendra aussi longtemps que spécifié par '--timeout'
```

### Options héritées des commandes parentes

```
      --burst-limit int                 Limite côté client de la bande passante (par défaut 100)
      --debug                           Active la sortie détaillée
      --kube-apiserver string           L'adresse et le port du serveur API Kubernetes
      --kube-as-group stringArray       Groupe à utiliser pour l'opération, cet argument peut être répété pour spécifier plusieurs groupes
      --kube-as-user string             Nom d'utilisateur à utiliser pour l'opération
      --kube-ca-file string             Le fichier de l'autorité de certification pour la connexion au serveur API Kubernetes
      --kube-context string             Nom du contexte kubeconfig à utiliser
      --kube-insecure-skip-tls-verify   Si true, la validité du certificat du serveur API Kubernetes ne sera pas vérifiée. Cela rendra les connexions HTTPS non sécurisées
      --kube-tls-server-name string     Nom du serveur utilisé pour la validation du certificat du serveur API Kubernetes. S'il n'est pas fourni, le nom de la machine utilisée pour contacter le serveur sera utilisé
      --kube-token string               Jeton utilisé pour l'authentification
      --kubeconfig string               Chemin du fichier de configuration kubeconfig
  -n, --namespace string                Namespace à utiliser pour la requête
      --qps float32                     Requêtes par seconde utilisées lors de la communication avec l'API Kubernetes, sans compter le bursting
      --registry-config string          Chemin vers le fichier de configuration du registre (par défaut "~/.config/helm/registry/config.json")
      --repository-cache string         Chemin vers le répertoire contenant les index du dépôt mis en cache (par défaut "~/.cache/helm/repository")
      --repository-config string        Chemin vers le fichier contenant les noms et URLs des dépôts (par défaut "~/.config/helm/repositories.yaml")
```

### Voir également

* [helm](./helm.md)	 - Le gestionnaire de packages Helm pour Kubernetes.

###### Auto généré par spf13/cobra le 14-Jan-2026
