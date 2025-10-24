---
title: "Helm Upgrade"
---

## helm upgrade

Met à niveau une release

### Synopsis

Cette commande met à niveau une release vers une nouvelle version du chart.

Cette commande prend une release et un chart. L'argument 'CHART' peut être soit :  une référence de chart ('example/mariadb'), un chemin vers un répertoire de chart,
un chart packagé, ou une URL complète. Pour les références de chart, la dernière version sera spécifiée à moins que l'argument `--version` soit défini.

Pour remplacer les valeurs dans un chart, utilisez soit l'argument `--values` et donnez un fichier ou utilisez l'argument `--set` et donnez une configuration depuis la console, pour forcer les valeurs en string, utilisez `--set-string`. Vous pouvez utiliser `--set-file` pour fixer les valeurs depuis un fichier, quand les valeurs son trop longues pour la ligne de commande ou si elles sont générées dynamiquement. Vous pouvez également utiliser `--set-json` pour fixer les valeurs en JSON (scalars/objects/arrays) dans la ligne de commande.

Vous pouvez spécifier l'argument `--values` / `-f` plusieurs fois. La priorité sera donnée au dernier spécifié (à l'extreme droite). Par exemple, si `myvalues.yaml` et `override.yaml` contiennent une clé nommée 'Test', la valeur fixée dans `override.yaml` sera prioritaire :

    $ helm upgrade -f myvalues.yaml -f override.yaml redis ./redis

Vous pouvez spécifier l'argument `--set` plusieurs fois. La priorité sera donnée au dernier spécifié (à l'extreme droite). Par exemple, si les valeurs 'bar' et 'newbar' sont fixé pour la clé nommée 'newbar', la valeur 'newbar' sera prioritaire : 

    $ helm upgrade --set foo=bar --set foo=newbar redis ./redis

Vous pouvez également remplacer les valeurs d'une release existante avec cette commande via l'argument `--reuse-values`. Les arguments 'RELEASE' et 'CHART' doivent être fixés comme paramètres et les valeurs existantes seront fusionnés avec toutes les valeurs fixés via les arguments `--values` / `-f` ou `--set`. La priorité est donnée aux nouvelles valeurs.

    $ helm upgrade --reuse-values --set foo=bar --set foo=newbar redis ./redis


```
helm upgrade [RELEASE] [CHART] [flags]
```

### Options

```
      --atomic                                     Si fixé, le processus d'installation supprimera l'installation en cas d'échec. L'argument --wait sera défini automatiquement si --atomic est utilisé
      --ca-file string                             Vérifie les certificats des serveurs ayant activé HTTPS en utilisant ce fichier de certificat racine (CA bundle)
      --cert-file string                           Identifie le client HTTPS à l'aide de ce fichier de certificat SSL
      --cleanup-on-fail                            Autoriser la suppression des nouvelles ressources créées dans cette release en cas d'échec de la mise à niveau
      --create-namespace                           Si --install est fixé, Créer le namespace de la version s'il n'est pas présent
      --dependency-update                          Met à jour les dépendances si elles sont manquantes avant l'installation du chart
      --description string                         Ajoute une description personnalisée
      --devel                                      Utiliser également les versions de développement. Équivalent à version '>0.0.0-0'. Si --versions est fixé, ceci est ignoré
      --disable-openapi-validation                 Si fixé, le processus de mise à niveau ne validera pas les modèles générés par rapport au schéma OpenAPI de Kubernetes
      --dry-run string[="client"]                  Simule une installation. Si '--dry-run' est fixé sans option ou comme '--dry-run=client', aucune tentative de connexion au cluster ne sera éffectuée. En définissant '--dy-run=server', des tentatives de connexion au cluster seront autorisées
      --enable-dns                                 Active les recherches DNS lors du rendu des modèles
      --force                                      Force les mise à jour des ressources en utilisant une stratègie de remplacement
  -h, --help                                       Aide pour la commande upgrade
      --history-max int                            Limite le nombre maximum de révisions sauvegardées par release. Utiliser 0 pour pas avoir de limite (par défaut 10)
      --insecure-skip-tls-verify                   Ignore les vérifications de certificat TLS lors du téléchargement du chart
  -i, --install                                    Si une release avec ce nom n'existe pas, lance une installation
      --key-file string                            Identifie le client HTTPS en utilisant ce fichier de clé SSL
      --keyring string                             Emplacement des clés publiques utilisées pour la vérification (par defaut "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      Étiquettes qui seront ajoutées aux métadonnées de la publication. Doit être séparé par des virgules. (par defaut [])
      --no-hooks                                   Empêche les hooks de fonctionner pendant l'installation
  -o, --output format                              Affiche la sortie dans un format spécifique. Valeurs possibles : table, json, yaml (par defaut table)
      --pass-credentials                           Affiche la sortie dans un format spécifique. Valeurs possibles : table, json, yaml (par defaut table)
      --password string                            Mot de passe du dépôt de chart où est localisé le chart demandé
      --plain-http                                 Utiliser des connexion HTTP non sécurisées pour le téléchargement du chart
      ```fallback
--post-renderer postRendererString                 Chemin vers un éxécutable à utiliser pour le post-rendu. S'il existe dans $PATH, le binaire sera utilisé, sinon il essaiera de rechercher l'exécutable au chemin spécifié. 
      --post-renderer-args postRendererArgsSlice   Un argument pour le post-rendu (peut être spécifié plusieurs fois) (par défaut [])
      --render-subchart-notes                      Si défini, génère les notes du sous-chart avec le chart parent
      --repo string                                Url du dépôt de chart où est localisé le chart demandé
      --reset-then-reuse-values                    Lors de la mise à niveau, réinitialise les valeurs sur celles intégrées au chart, applique les valeurs de la dernières version et fussionne tout les valeurs à partir de la ligne de commande via --set et -f. Si '--reset-values' ou '--reuse-values' sont spécifié, ceci sera ignoré
      --reset-values                               Lors de la mise à niveau, réinitialise les valeurs à celles intégrées au chart
      --reuse-values                               Lors de la mise à niveau, réutilise les valeurs de la dernière version et fussionne toutes les valeurs depuis la ligne de commande via '--set' et '-f'. Si '--reset-values' est spécifié, ceci sera ignoré
      --set stringArray                            Défini des valeurs en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=val1,key2=val2)
      --set-file stringArray                       Défini des valeurs depuis un fichier spécifique en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=path1,key2=path2)
      --set-json stringArray                       Défini des valeurs en JSON en ligne de commande (vous pouvez spécifier plusieurs ou séparer les valeurs par des virgules : key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    Défini une valeur littérale de type STRING en ligne de commande
      --set-string stringArray                     Défini des valeurs de type STRING en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=val1,key2=val2)
      --skip-crds                                  Si défini, aucun CRD ne sera installé. Par défaut, les CRD sont installés s'ils ne sont pas déjà présents, lorsqu'une mise à niveau est effectuée avec l'indicateur d'installation activé
      --timeout duration                           Temps d'attente pour chaque opération Kubernetes (comme les Jobs pour les hooks) (par défaut 5m0s)
      --username string                            Nom d'utilisateur du dépôt de chart où est localisé le chart demandé
  -f, --values strings                             Spécifie les valeurs dans un fichier YAML ou une URL (vous pouvez en spécifier plusieurs)
      --verify                                     vVérifie le paquet avant de l'utiliser
      --version string                             Spécifier une contrainte de version pour la version du chart à utiliser. Cette contrainte peut être un tag spécifique (par exemple, 1.1.1) ou elle peut faire référence à une plage valide (par exemple, ^2.0.0). Si cela n'est pas spécifié, la dernière version est utilisée
      --wait                                       Si défini, cela attendra que tous les pods, PVCs, services, et le nombre minimum de pods d'un déploiement, StatefulSet ou ReplicaSet soient dans un état prêt avant de marquer la publication comme réussie. Il attendra aussi longtemps que spécifié par '--timeout'
      --wait-for-jobs                              Si défini et que '--wait' est activé, cela attendra que tous les Jobs soient terminés avant de marquer la publication comme réussie. Il attendra aussi longtemps que spécifié par '--timeout'
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

