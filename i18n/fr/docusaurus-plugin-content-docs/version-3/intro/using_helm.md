---
title: Utilisation de Helm
description: Explique la base de Helm.
sidebar_position: 3
---

Ce guide explique les bases de l'utilisation de Helm pour gérer les packages sur votre cluster Kubernetes. Nous partons du principe que vous avez déjà [installé](/intro/install.md) le client Helm.

Si vous souhaitez simplement exécuter quelques commandes rapides, vous pouvez commencer par le [Guide de démarrage rapide](/intro/quickstart.md). Ce chapitre couvre les différentes commandes Helm et explique comment les utiliser.

## Trois grands concepts

Un *Chart* est un package Helm. Il contient toutes les définitions des ressources nécessaires pour exécuter une application, un outil ou un service à l'intérieur d'un cluster Kubernetes. Voyez cela comme l'équivalent Kubernetes d'une formule pour Homebrew, d'un dpkg pour Apt , ou d'un fichier RPM pour Yum.

Un *Dépot* est le lieu où les charts peuvent être collectés et partagés. C'est comme les [archives CPAN de Perl](https://www.cpan.org) ou la [base de données de packages Fedora](https://src.fedoraproject.org/), mais pour les packages de Kubernetes.

Une *Release* est une instance d'un chart s'exécutant dans un cluster Kubernetes. Un chart peut être installé plusieurs fois dans le même cluster. Et à chaque fois qu'il est à nouveau installé, une nouvelle _release_ est créé. Prenons un chart MySQL, si vous voulez deux bases de données s'exécutant dans votre cluster, vous pouvez installer ce chart deux fois. Chacune aura sa propre _release_, qui à son tour aura son propre _release name_.

Maintenant que vous maîtrisez ces concepts, nous pouvons aborder Helm de la manière suivante :

Helm installe des _charts_ dans Kubernetes, créant une nouvelle _release_ pour chaque installation. Et pour trouver de nouveaux charts, vous pouvez rechercher des _repositories_ (dépots) de charts Helm.

## 'helm search': La recherche de charts

Helm est livré avec une puissante commande de recherche. Elle peut être utilisée pour rechercher deux différents types de ressources :

- `helm search hub` recherche sur le [Artifact Hub](https://artifacthub.io), qui liste les charts Helm depuis une douzaines de dépôts.
- `helm search repo` recherche sur les dépots que vous avez ajouté a votre config (via `helm repo add`). Cette recherche est faite sur le réseau privé et ne nécessite pas de connexion à internet.

Vous pouvez trouver un chart sur les dépôts publique avec la commande `helm search hub`:

```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      A Helm chart for deploying a WordPress site on ...
```

La commande ci-dessus recherche toutes les charts `wordpress` sur Artifact Hub.

En utilisant `helm search repo`, vous pouvez trouver les noms des charts dans les dépots que vous avez ajouté manuellement :

```console
$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                          CHART VERSION APP VERSION DESCRIPTION
brigade/brigade               1.3.2         v1.2.1      Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app    0.4.1         v0.2.1      The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth  0.2.0         v0.20.0     The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway   0.1.0                     A Helm chart for Kubernetes
brigade/brigade-project       1.0.0         v1.0.0      Create a Brigade project
brigade/kashti                0.4.0         v0.4.0      A Helm chart for Kubernetes
```

La commande de recherche de Helm utilise un algorithme de correspondance de chaîne de charactères, vous pouvez donc saisir des mots ou une partie de phrase :

```console
$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes
```

La recherche est un bon moyen de trouver les packages disponibles. Une fois que vous avez trouvé une application que vous souhaitez installer, vous pouvez utiliser `helm install` pour l'installer.

## 'helm install': Installation d'un package

Pour installer un nouveau package, utilisez la commande `helm install`. Dans sa forme la plus simple, elle prend deux arguments: le nom de la version voulue et le nom du chart que vous
voulez installer. 

```console
$ helm install happy-panda bitnami/wordpress
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Le chart `wordpress` est maintenant installé. Notez que l'installation d'un chart crée un nouvel objet _release_. La version ci-dessus est nommée «happy-panda». (Si vous voulez que Helm génère un nom pour vous, oubliez le nom de la version et utilisez `--generate-name`.)

Lors de l'installation, le client `helm` affichera des informations utiles sur les ressources qui ont été créées, l'état de la version et si il y a des étapes de configurations supplémentaires que vous pouvez ou devez suivre.

Helm n'attend pas que toutes les ressources soient en cours d'exécution avant de quitter. De nombreuses charts nécessitent des images Docker de plus de 600 Mo et peuvent prendre du temps à s'installer dans le cluster.

Pour suivre l'état d'une release ou pour relire les informations de configuration, vous pouvez utiliser `helm status`:

```console
$ helm status happy-panda
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

La commande ci-dessus montre l'état actuel de votre release.

### Personnalisation d'un chart avant son installation

L'installation comme nous l'avons fait ici n'utilisera que les options de configuration par défaut. Il peut arriver que vous souhaitiez personnaliser le chart pour utiliser une
configuration personalisée.

Pour voir quelles options sont configurables sur un chart, utilisez `helm show values`:
```console
$ helm show values bitnami/wordpress
## Global Docker image parameters
## Please, note that this will override the image parameters, including dependencies, configured to use the global value
## Current available global Docker image parameters: imageRegistry and imagePullSecrets
##
# global:
#   imageRegistry: myRegistryName
#   imagePullSecrets:
#     - myRegistryKeySecretName
#   storageClass: myStorageClass

## Bitnami WordPress image version
## ref: https://hub.docker.com/r/bitnami/wordpress/tags/
##
image:
  registry: docker.io
  repository: bitnami/wordpress
  tag: 5.6.0-debian-10-r35
  [..]
```

Vous pouvez ensuite ecraser la configuration par défaut grâce à un fichier YAML que vous passerez en paramètre lors de l'installation.

```console
$ echo '{mariadb.auth.database: user0db, mariadb.auth.username: user0}' > values.yaml
$ helm install -f values.yaml bitnami/wordpress --generate-name
```

La commande ci-dessus créera un utilisateur MariaDB par défaut avec le nom `user0`, et accordera à cet utilisateur l'accès à la base de données `user0db` nouvellement créée, mais prendra le reste des valeurs par défaut pour l'installation du chart.

Il existe deux façons de transmettre les données de configuration lors de l'installation:

- `--values` (ou `-f`): Spécifie un fichier YAML personnalisé. Vous pouvez spécifier plusieurs fichiers, celui le plus à droite prévaudra.
- `--set`: Spécifie une valeur personnalisée en ligne de commande.

Si les deux paramètes sont utilisés, les valeurs de `--set` sont fusionnés dans ` --values` avec une priorité plus élevée. Les remplacements spécifiés avec `--set` sont conservés dans un fichier ConfigMap.
Les valeurs qui ont été `--set` peuvent être visualisées pour une release donnée avec ` helm get values <nom-de-release> `. 
Les valeurs qui ont été `--set` peuvent être effacées en exécutant `helm upgrade` avec ` --reset-values` spécifié.

#### Le format et les limites de `--set`

L'option `--set` prend zéro ou plusieurs paires de nom/valeur. La manière la plus simple d'utilisation est :  
`--set name = value`. L'équivalent YAML serait :

```yaml
name: value
```

Vous pouvez entrer plusieurs valeurs en les séparant par une virgule `,` . Ainsi `--set a=b,c=d` devient l'équivalent YAML de :

```yaml
a: b
c: d
```

Des expressions plus complexes sont acceptés. Par exemple l'équivalent de `--set outer.inner=value` en YAML est :

```yaml
outer:
  inner: value
```

Vous pouvez définir des listes grâce à des accolades `{` et `}`. Exemple: `--set name={a, b, c}` devient :

```yaml
name:
  - a
  - b
  - c
```

Depuis Helm 2.5.0, il est possible d'accéder aux éléments d'une liste en utilisant l'index du tableau.  
Exemple : `--set servers[0].port=80` correspond à :

```yaml
servers:
  - port: 80
```

Plusieurs valeurs peuvent être définit de cette manière.  
La ligne suivante `--set servers[0].port=80,servers[0].host=example` devient:

```yaml
servers:
  - port: 80
    host: example
```

Il peut arriver que vous ayez besoin d'utiliser un charactère spécial avec `--set`. Pour ce faire vous pouvez utiliser un backslash `\`.  
Exemple : `--set name=value1\,value2` devient :

```yaml
name: "value1,value2"
```

De la même manière, vous pouvez l'utiliser pour une séquence commençant par un point, ce qui peut être utile lorsque les charts utilisent la fonction `toYaml` pour analyser les annotations, les étiquettes et les nœuds sélecteurs.  
La syntaxe de `--set nodeSelector." Kubernetes \ .io / role "= master` devient:

```yaml
nodeSelector:
  kubernetes.io/role: master
```

Les structures de données profondément imbriquées peuvent être difficiles à exprimer en utilisant `--set`. Les concepteurs de charts sont encouragés à utiliser un fichier de valeurs au format YAML : ` values.yaml` lorsqu'il y a beaucoup de valeurs à configurer (en savoir plus sur [les fichiers de valeurs](/chart_template_guide/values_files.md)).

### Autres methodes d'installations

La commande `helm install` peut installer un package depuis différentes sources:

- Un dépot de charts (Comme vu précédemment)
- Une archive local d'un chart (`helm install foo foo-0.1.1.tgz`)
- Un dossier contenant un chart décompressé (`helm install foo path/to/foo`)
- Une URL pointant vers un chart (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' et 'helm rollback': Mettre à jour une Release, et récupération d'un Echec

Lorsqu'une nouvelle release d'un chart est publiée, ou lorsque vous souhaitez modifier la configuration de votre release, vous pouvez utiliser la commande `helm upgrade`.

Une mise à niveau prend une release existante et la met à niveau en fonction des informations que vous fournissez. Étant donné que les charts Kubernetes peuvent être volumineuses et complexes, Helm essaie d'effectuer la mise à niveau la moins invasive. Ainsi il essaiera de mettre à jour uniquement les éléments qui ont changé depuis la dernière version.

```console
$ helm upgrade -f panda.yaml happy-panda bitnami/wordpress
```

Dans le cas ci-dessus la release `happy-panda`  est mis à jour depuis la même chart mais avec un fichier de config YAML différent :

```yaml
mariadb.auth.username: user1
```

Vous pouvez utiliser `helm get values` pour voir si votre nouvelle configuration à pris effet ou non :

```console
$ helm get values happy-panda
mariadb:
  auth:
    username: user1
```

La commande `helm get` est un outil utile pour voir les informations d'une release dans le cluster. Et comme nous venons de le voir ci-dessus, la commande peut également être utilisée pour voir si les nouvelles valeurs de `panda.yaml` sont bien déployées sur le cluster.

Maintenant admettons que quelque chose ne se passe pas comme prévu lors d'une release, il est facile de revenir à une version précédente en utilisant `helm rollback [RELEASE_NAME] [VERSION]`.

```console
$ helm rollback happy-panda 1
```

la commande précédente ramène notre happy-panda à sa toute première version. Une version de release est une révision incrémentielle. Chaque fois qu'une installation, qu'une mise à jour ou qu'une restauration est faite, le numéro de révision est incrémenté de 1. La première release est toujours la version numéro 1. Et vous pouvez utiliser `helm history [RELEASE]` pour voir les versions d'une release.

## Options utiles pour l'installation / la mise à jour / la restauration

Il existe d'autres options utiles que vous pouvez spécifier pour personnaliser le comportement de Helm lors d'une installation / d'une mise à jour / d'une restauration. Veuillez noter que la liste qui suit n'est pas exhaustive. Pour voir une description de tous les flags, exécutez simplement `helm <commande> --help`.

- `--timeout`: Une [durée Go](https://golang.org/pkg/time/#ParseDuration) maximale avant de terminer la commande Kubernetes. La valeur par défaut est `5m0s`.
- `--wait`: Attend que tous les pods soient dans un état prêt, les PVCs sont liés, les déploiements ont un minimum (`Desired` moins ` maxUnavailable`) de pods prêts et les services ont une adresse IP (et une entrée si il y a un `LoadBalancer`) avant de marquer la release comme réussie. Il attendra au maximum la valeur de `--timeout`. Si le délai d'expiration est atteint, la release sera marquée comme «FAILED». Remarque: dans les scénarios où le déploiement a `réplicas` défini sur 1 et ` maxUnavailable` n'est pas défini à 0 dans le cadre de la stratégie de mise à jour progressive, `--wait` sera marqué comme prêt dès qu'il aura satisfait son nombre minimum de Pods en état prêt.
- `--no-hooks`: Permet d'ignorer l'exécution des hooks pour la commande
- `--recreate-pods` (seulement disponible pour les `upgrade` et les `rollback`): Ce flag permet de recréer tous les pods (à l'exception des pods de deploiements). (DEPRECIE depuis Helm 3)

## 'helm uninstall': Désinstallation d'une Release

Quand sera venu le jour ou vous devrez désinstaller une release de votre cluster, utilisez la commande `helm uninstall` :

```console
$ helm uninstall happy-panda
```

Cela supprimera la release du cluster. Vous pouvez voir toutes vos releases actuellement déployées avec la commande `helm list`:

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

À partir du résultat ci-dessus, nous pouvons voir que la version `happy-panda` a bien été désinstallé.

Dans les versions précédentes de Helm, lorsqu'une release était supprimée, l'historique entier restait disponible. Depuis Helm 3, la désinstallation supprime également l'historique de la release.
Si vous souhaitez tout de même conserver un enregistrement de l'historique, utilisez `helm uninstall --keep-history`.  
L'utilisation de `helm list --uninstalled` affichera uniquement les release qui ont été désinstallés avec l'indicateur `--keep-history`.

L'indicateur `helm list --all` vous montrera tous les historique de release que Helm a conservés, y compris les historiques des éléments ayant échoué ou ayant été supprimé (si `--keep-history` était spécifié):

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     wordpress-10.4.5.6.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

Notez que les historiques de release étant désormais supprimées par défaut, il n'est plus possible de restaurer une ressource désinstallée.

## 'helm repo': Travailler avec des Dépôts

Helm 3 n'est plus livré avec un dépôt de charts par défaut. La commande `helm repo` vous permet entre autre d'ajouter, de répertorier et de supprimer des dépôts.

Vous pouvez voir quels dépôts sont configurés en utilisant `helm repo list`:

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

Vous pouvez bien entendu ajouter de nouveaux dépôts avec `helm repo add`:

```console
$ helm repo add dev https://example.com/dev-charts
```

Étant donné que les dépôts de charts changent fréquemment, vous pouvez à tout moment vous assurer que dépot Helm est à jour en exécutant `helm repo update`.

Les dépôts peuvent être supprimés avec `helm repo remove`.

## Création de vos propres charts

Le [Guide de développement de charts](/topics/charts.md) explique comment développer vos propres charts. Mais vous pouvez vous lancer rapidement dans la création de charts avec la commande `helm create`:

```console
$ helm create deis-workflow
Creating deis-workflow
```

Il y a maintenant un chart dans `./deis-workflow`. Vous pouvez le modifier et créer vôtre modèles personalisé.

Lorsque vous modifiez votre chart, vous pouvez vérifier la syntaxe en exécutant `helm lint`.

Quand vous aurez besoin de packager le chart pour la distribution, vous pourrez exécuter `helm package`:

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

Le chart est maintenant prêt à l'installation `helm install`:

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

Les charts packagés peuvent être uploadés dans des dépôts. Jetez un oeil à la
[documentation des dépôts](/topics/chart_repository.md) de charts Helm pour plus de détails.

## Conclusion

Ce chapitre a couvert les utilisations de base du client `helm`, y compris la recherche, l'installation, la mise à jour et la désinstallation. Nous avons également vu les commandes utilitaires telles que `helm status`,` helm get` ou encore `helm repo`.

Pour plus d'informations sur ces commandes, consultez l'aide intégrée de Helm: `helm help`.

Dans le [chapitre suivant](/howto/charts_tips_and_tricks.md), nous verrons le processus de développement des charts.
