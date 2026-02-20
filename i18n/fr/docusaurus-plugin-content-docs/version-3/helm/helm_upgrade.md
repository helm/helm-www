---
title: helm upgrade
---

Met à niveau une release

### Synopsis

Cette commande met à niveau une release vers une nouvelle version du chart.

Les arguments de mise à niveau doivent être une release et un chart. L'argument chart peut être soit : une référence de chart ('example/mariadb'), un chemin vers un répertoire de chart, un chart packagé, ou une URL complète. Pour les références de chart, la dernière version sera spécifiée à moins que l'argument `--version` soit défini.

Pour remplacer les valeurs dans un chart, utilisez soit l'argument `--values` et fournissez un fichier, soit utilisez l'argument `--set` et passez la configuration depuis la ligne de commande. Pour forcer les valeurs en chaîne de caractères, utilisez `--set-string`. Vous pouvez utiliser `--set-file` pour définir des valeurs individuelles depuis un fichier lorsque la valeur elle-même est trop longue pour la ligne de commande ou est générée dynamiquement. Vous pouvez également utiliser `--set-json` pour définir des valeurs JSON (scalaires/objets/tableaux) depuis la ligne de commande.

Vous pouvez spécifier l'argument `--values`/`-f` plusieurs fois. La priorité sera donnée au dernier fichier spécifié (le plus à droite). Par exemple, si `myvalues.yaml` et `override.yaml` contiennent tous deux une clé nommée 'Test', la valeur définie dans `override.yaml` sera prioritaire :

    $ helm upgrade -f myvalues.yaml -f override.yaml redis ./redis

Vous pouvez spécifier l'argument `--set` plusieurs fois. La priorité sera donnée à la dernière valeur spécifiée (la plus à droite). Par exemple, si les valeurs 'bar' et 'newbar' sont définies pour une clé nommée 'foo', la valeur 'newbar' sera prioritaire :

    $ helm upgrade --set foo=bar --set foo=newbar redis ./redis

Vous pouvez mettre à jour les valeurs d'une release existante avec cette commande via l'argument `--reuse-values`. Les arguments 'RELEASE' et 'CHART' doivent être définis avec les paramètres d'origine, et les valeurs existantes seront fusionnées avec toutes les valeurs définies via les arguments `--values`/`-f` ou `--set`. La priorité est donnée aux nouvelles valeurs.

    $ helm upgrade --reuse-values --set foo=bar --set foo=newbar redis ./redis

L'argument --dry-run affichera tous les manifests générés du chart, y compris les Secrets qui peuvent contenir des valeurs sensibles. Pour masquer les Secrets Kubernetes, utilisez l'argument --hide-secret. Veuillez considérer attentivement comment et quand ces arguments sont utilisés.


```
helm upgrade [RELEASE] [CHART] [flags]
```

### Options

```
      --atomic                                     si défini, le processus de mise à niveau annule les modifications effectuées en cas d'échec. L'argument --wait sera défini automatiquement si --atomic est utilisé
      --ca-file string                             vérifie les certificats des serveurs HTTPS en utilisant ce fichier de certificat racine (CA bundle)
      --cert-file string                           identifie le client HTTPS à l'aide de ce fichier de certificat SSL
      --cleanup-on-fail                            autorise la suppression des nouvelles ressources créées lors de cette mise à niveau en cas d'échec
      --create-namespace                           si --install est défini, crée le namespace de la release s'il n'est pas présent
      --dependency-update                          met à jour les dépendances si elles sont manquantes avant l'installation du chart
      --description string                         ajoute une description personnalisée
      --devel                                      utilise également les versions de développement. Équivalent à version '>0.0.0-0'. Si --version est défini, ceci est ignoré
      --disable-openapi-validation                 si défini, le processus de mise à niveau ne validera pas les templates générés par rapport au schéma OpenAPI de Kubernetes
      --dry-run string[="client"]                  simule une installation. Si '--dry-run' est défini sans option ou comme '--dry-run=client', aucune tentative de connexion au cluster ne sera effectuée. En définissant '--dry-run=server', des tentatives de connexion au cluster seront autorisées
      --enable-dns                                 active les recherches DNS lors du rendu des templates
      --force                                      force les mises à jour des ressources en utilisant une stratégie de remplacement
  -h, --help                                       aide pour upgrade
      --hide-notes                                 si défini, n'affiche pas les notes dans la sortie de mise à niveau. N'affecte pas la présence dans les métadonnées du chart
      --hide-secret                                masque les Secrets Kubernetes lors de l'utilisation de l'argument --dry-run
      --history-max int                            limite le nombre maximum de révisions sauvegardées par release. Utilisez 0 pour ne pas avoir de limite (par défaut 10)
      --insecure-skip-tls-verify                   ignore les vérifications de certificat TLS lors du téléchargement du chart
  -i, --install                                    si une release avec ce nom n'existe pas, lance une installation
      --key-file string                            identifie le client HTTPS en utilisant ce fichier de clé SSL
      --keyring string                             emplacement des clés publiques utilisées pour la vérification (par défaut "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      étiquettes qui seront ajoutées aux métadonnées de la release. Doivent être séparées par des virgules. Les étiquettes de la release originale seront fusionnées avec les étiquettes de mise à niveau. Vous pouvez supprimer une étiquette en utilisant null. (par défaut [])
      --no-hooks                                   désactive les hooks pre/post mise à niveau
  -o, --output format                              affiche la sortie dans le format spécifié. Valeurs autorisées : table, json, yaml (par défaut table)
      --pass-credentials                           transmet les identifiants à tous les domaines
      --password string                            mot de passe du dépôt de charts où se trouve le chart demandé
      --plain-http                                 utilise des connexions HTTP non sécurisées pour le téléchargement du chart
      --post-renderer postRendererString           chemin vers un exécutable à utiliser pour le post-rendu. S'il existe dans $PATH, le binaire sera utilisé, sinon il essaiera de rechercher l'exécutable au chemin spécifié
      --post-renderer-args postRendererArgsSlice   un argument pour le post-renderer (peut être spécifié plusieurs fois) (par défaut [])
      --render-subchart-notes                      si défini, génère les notes des sous-charts avec le chart parent
      --repo string                                URL du dépôt de charts où se trouve le chart demandé
      --reset-then-reuse-values                    lors de la mise à niveau, réinitialise les valeurs sur celles intégrées au chart, applique les valeurs de la dernière release et fusionne toutes les valeurs à partir de la ligne de commande via --set et -f. Si '--reset-values' ou '--reuse-values' est spécifié, ceci sera ignoré
      --reset-values                               lors de la mise à niveau, réinitialise les valeurs à celles intégrées au chart
      --reuse-values                               lors de la mise à niveau, réutilise les valeurs de la dernière release et fusionne toutes les valeurs depuis la ligne de commande via '--set' et '-f'. Si '--reset-values' est spécifié, ceci sera ignoré
      --set stringArray                            définit des valeurs en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=val1,key2=val2)
      --set-file stringArray                       définit des valeurs depuis un fichier spécifié en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=path1,key2=path2)
      --set-json stringArray                       définit des valeurs JSON en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    définit une valeur littérale de type STRING en ligne de commande
      --set-string stringArray                     définit des valeurs de type STRING en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=val1,key2=val2)
      --skip-crds                                  si défini, aucun CRD ne sera installé lors d'une mise à niveau avec l'option install activée. Par défaut, les CRD sont installés s'ils ne sont pas déjà présents
      --skip-schema-validation                     si défini, désactive la validation du schéma JSON
      --take-ownership                             si défini, la mise à niveau ignorera la vérification des annotations helm et prendra possession des ressources existantes
      --timeout duration                           temps d'attente pour chaque opération Kubernetes (comme les Jobs pour les hooks) (par défaut 5m0s)
      --username string                            nom d'utilisateur du dépôt de charts où se trouve le chart demandé
  -f, --values strings                             spécifie les valeurs dans un fichier YAML ou une URL (vous pouvez en spécifier plusieurs)
      --verify                                     vérifie le paquet avant de l'utiliser
      --version string                             spécifie une contrainte de version pour la version du chart à utiliser. Cette contrainte peut être un tag spécifique (par exemple 1.1.1) ou elle peut faire référence à une plage valide (par exemple ^2.0.0). Si cela n'est pas spécifié, la dernière version est utilisée
      --wait                                       si défini, attend que tous les Pods, PVCs, Services, et le nombre minimum de Pods d'un Deployment, StatefulSet ou ReplicaSet soient dans un état prêt avant de marquer la release comme réussie. Attend aussi longtemps que spécifié par '--timeout'
      --wait-for-jobs                              si défini et que '--wait' est activé, attend que tous les Jobs soient terminés avant de marquer la release comme réussie. Attend aussi longtemps que spécifié par '--timeout'
```

### Options héritées des commandes parentes

```
      --burst-limit int                 limite de régulation côté client (par défaut 100)
      --debug                           active la sortie détaillée
      --kube-apiserver string           adresse et port du serveur API Kubernetes
      --kube-as-group stringArray       groupe à utiliser pour l'opération, cet argument peut être répété pour spécifier plusieurs groupes
      --kube-as-user string             nom d'utilisateur à utiliser pour l'opération
      --kube-ca-file string             fichier de l'autorité de certification pour la connexion au serveur API Kubernetes
      --kube-context string             nom du contexte kubeconfig à utiliser
      --kube-insecure-skip-tls-verify   si true, le certificat du serveur API Kubernetes ne sera pas vérifié. Cela rendra vos connexions HTTPS non sécurisées
      --kube-tls-server-name string     nom du serveur utilisé pour la validation du certificat du serveur API Kubernetes. S'il n'est pas fourni, le nom d'hôte utilisé pour contacter le serveur sera utilisé
      --kube-token string               jeton bearer utilisé pour l'authentification
      --kubeconfig string               chemin vers le fichier de configuration kubeconfig
  -n, --namespace string                namespace à utiliser pour la requête
      --qps float32                     requêtes par seconde utilisées lors de la communication avec l'API Kubernetes, sans compter le bursting
      --registry-config string          chemin vers le fichier de configuration du registre (par défaut "~/.config/helm/registry/config.json")
      --repository-cache string         chemin vers le répertoire contenant les index de dépôts mis en cache (par défaut "~/.cache/helm/repository")
      --repository-config string        chemin vers le fichier contenant les noms et URLs des dépôts (par défaut "~/.config/helm/repositories.yaml")
```

### Voir également

* [helm](./helm.md)	 - Le gestionnaire de paquets Helm pour Kubernetes.

###### Auto generated by spf13/cobra on 14-Jan-2026
