---
title: helm install
---
installe un chart

### Synopsis

Cette commande installe une archive de chart.

L'argument d'installation doit être une référence, un chemin d'accès vers un chart compressé, un chemin d'accès vers un chart décompressé ou une URL.

Pour remplacer les valeurs dans un chart, utilisez soit l'argument `--values` et passez-y un fichier ou utilisez l'argument `--set` et passez-y la configuration à partir de la ligne de commande, pour forcer l'utilisation d'une valeur en chaine de caractères, utilisez `--set-string`. Vous pouvez utilisez `--set-file` pour fixer individuellement les valeurs à partir d'un fichier lorsque les valeurs sont trop longues pour être en ligne de commande ou parce qu'elles sont généré dynamiquement. Vous pouvez aussi utiliser `--set-json` pour fixer des valeurs au format JSON (scalars/objects/arrays) depuis la ligne de commande.

    $ helm install -f myvalues.yaml myredis ./redis

ou

    $ helm install --set name=prod myredis ./redis

ou

    $ helm install --set-string long_int=1234567890 myredis ./redis

ou

    $ helm install --set-file my_script=dothings.sh myredis ./redis

ou

    $ helm install --set-json 'master.sidecars=[{"name":"sidecar","image":"myImage","imagePullPolicy":"Always","ports":[{"name":"portname","containerPort":1234}]}]' myredis ./redis


Vous pouvez spécifier l'argument `--values` (abrégé en `-f`) plusieurs fois. La priorité sera donnée au dernier fichier spécifié (à l'extreme droite). Par exemple, si `myvalues.yaml` et `override.yaml` contiennent une clé nommée 'Test', la valeurs fixé dans le fichier `override.yaml` aura priorité :

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

Vous pouvez spécifier l'argument `--set` plusieurs fois. La priorité sera donnée au dernier spécifié (à l'extreme droite).  Par exemple, si les valeurs 'bar' et 'newbar' sont fixées pour la clé nommé 'foo', la valeur 'newbar' sera prioritaire :

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis

De même, dans l'exemple suivant, 'foo' est défini sur '["four"]' :

    $ helm install --set-json='foo=["one", "two", "three"]' --set-json='foo=["four"]' myredis ./redis

Et dans l'exemple suivant, 'foo' est défini sur '{"key1":"value1","key2":"bar"}' :

    $ helm install --set-json='foo={"key1":"value1","key2":"value2"}' --set-json='foo.key2="bar"' myredis ./redis

Pour vérifier les manifestes générés d'une version sans installer le chart, les arguments `--debug` et `--dry-run` peuvent être combinés.

Si l'argument `--verify` est fixé, le chart DOIT avoir un fichier de provenance, et le fichier de provenance DOIT passer toutes les étapes de vérification.

Il y a six manières différentes d'exprimer le chart que vous souhaitez installer :

1. Par référence du chart : `helm install mymaria example/mariadb`
2. Par le chemin d'accès vers un chart compressé : `helm install mynginx ./nginx-1.2.3.tgz`
3. Par le chemin d'accès vers un chart décompressé : `helm install mynginx ./nginx`
4. Par l'URL absolue : `helm install mynginx https://example.com/charts/nginx-1.2.3.tgz`
5. Par référence du chart et l'URL du dépôt : `helm install --repo https://example.com/charts/ mynginx nginx`
6. Par les registres OCI : `helm install mynginx --version 1.2.3 oci://example.com/charts/nginx`

RÉFÉRENCES DES CHARTS

Une référence de chart est un moyen pratique de référencer un chart dans un référentiel de charts.

Lorsque vous utilisez une référence de chart avec un préfixe de dépôt ('example/mariadb'), Helm va rechercher dans la configuration locale, si un dépôt nommé 'example' et recherchera ensuite si un chart dans ce référentiel dont le nom est 'mariadb'. Il installera la dernière version stable de ce chart jusqu'à ce que vous le spécifiiez avec l'argument `--devel` pour inclure également la version de développement (alpha, beta et les versions candidates), ou fournissez un numéro de version avec l'argument `--version`.

Pour voir la liste des dépôts, utilisez la commande `helm repo list`. Pour chercher un chart dans un dépôt, utilisez la commande `helm search`.


```
helm install [NAME] [CHART] [flags]
```

### Options

```
      --rollback-on-failure                        Si fixé, le processus d'installation supprimera l'installation en cas d'échec. L'argument --wait sera défini automatiquement si --rollback-on-failure est utilisé
      --ca-file string                             Vérifie les certificats des serveurs ayant activé HTTPS en utilisant ce fichier de certificat racine (CA bundle)
      --cert-file string                           Identifie le client HTTPS à l'aide de ce fichier de certificat SSL
      --create-namespace                           Créer le namespace de la version s'il n'est pas présent
      --dependency-update                          Met à jour les dépendances si elles sont manquantes avant l'installation du chart
      --description string                         Ajoute une description personnalisée
      --devel                                      Utiliser également les versions de développement. Équivalent à version '>0.0.0-0'. Si --versions est fixé, ceci est ignoré
      --disable-openapi-validation                 Si défini, le processus d'installation ne validera pas les modèles générés par rapport au schéma OpenAPI de Kubernetes
      --dry-run string[="client"]                  Simule une installation. Si '--dry-run' est fixé sans option ou comme '--dry-run=client', aucune tentative de connexion au cluster ne sera éffectuée. En définissant '--dy-run=server', des tentatives de connexion au cluster seront autorisées
      --enable-dns                                 Active les recherches DNS lors du rendu des modèles
      --force                                      Force les mise à jour des ressources en utilisant une stratègie de remplacement
  -g, --generate-name                              Génère le nom (et omet le paramètre NAME)
  -h, --help                                       Aide pour la commande install
      --insecure-skip-tls-verify                   Ignore les vérifications de certificat TLS lors du téléchargement du chart
      --key-file string                            Identifie le client HTTPS en utilisant ce fichier de clé SSL
      --keyring string                             Emplacement des clés publiques utilisées pour la vérification (par defaut "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      Étiquettes qui seront ajoutées aux métadonnées de la publication. Doit être séparé par des virgules. (par defaut [])
      --name-template string                       Spécifie un modèle à utiliser pour le nom de la publication
      --no-hooks                                   Empêche les hooks de fonctionner pendant l'installation
  -o, --output format                              Affiche la sortie dans un format spécifique. Valeurs possibles : table, json, yaml (par defaut table)
      --pass-credentials                           Transmet les informations d'identification à tous les domaines
      --password string                            Mot de passe du dépôt de chart où est localisé le chart demandé
      --plain-http                                 Utiliser des connexion HTTP non sécurisées pour le téléchargement du chart
      --post-renderer postRendererString           Chemin vers un éxécutable à utiliser pour le post-rendu. S'il existe dans $PATH, le binaire sera utilisé, sinon il essaiera de rechercher l'exécutable au chemin spécifié.
      --post-renderer-args postRendererArgsSlice   Un argument pour le post-rendu (peut être spécifié plusieurs fois) (par défaut [])
      --render-subchart-notes                      Si défini, génère les notes du sous-chart avec le chart parent
      --replace                                    Réutilise le nom donné, uniquement si ce nom correspond à une publication supprimé qui reste dans l'historique. Ceci n'est pas sûre en production
      --repo string                                Url du dépôt de chart où est localisé le chart demandé
      --set stringArray                            Défini des valeurs en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=val1,key2=val2)
      --set-file stringArray                       Défini des valeurs depuis un fichier spécifique en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=path1,key2=path2)
      --set-json stringArray                       Défini des valeurs en JSON en ligne de commande (vous pouvez spécifier plusieurs ou séparer les valeurs par des virgules : key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    Défini une valeur littérale de type STRING en ligne de commande
      --set-string stringArray                     Défini des valeurs de type STRING en ligne de commande (vous pouvez en spécifier plusieurs ou séparer les valeurs par des virgules : key1=val1,key2=val2)
      --skip-crds                                  Si défini, aucun CRD ne sera installé. Par défaut, les CRD sont installés s'ils ne sont pas déjà présents
      --timeout duration                           Temps d'attente pour chaque opération Kubernetes (comme les Jobs pour les hooks) (par défaut 5m0s)
      --username string                            Nom d'utilisateur du dépôt de chart où est localisé le chart demandé
  -f, --values strings                             Spécifie les valeurs dans un fichier YAML ou une URL (vous pouvez en spécifier plusieurs)
      --verify                                     Vérifie le paquet avant de l'utiliser
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

* [helm](/helm/helm.md) - Le gestionnaire de package Helm pour Kubernetes.
