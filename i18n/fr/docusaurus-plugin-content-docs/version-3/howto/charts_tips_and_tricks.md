---
title: Trucs et astuces pour le développement de charts
description: Présente des trucs et astuces que les développeurs de charts Helm ont appris lors de la création de charts de qualité production.
sidebar_position: 1
---

Ce guide présente des trucs et astuces que les développeurs de charts Helm ont appris lors de la création de charts de qualité production.

## Connaître vos fonctions de template

Helm utilise les [templates Go](https://godoc.org/text/template) pour créer vos fichiers de ressources. Go est livré avec plusieurs fonctions intégrées, mais nous en avons ajouté beaucoup d'autres.

Tout d'abord, nous avons ajouté toutes les fonctions de la [bibliothèque Sprig](https://masterminds.github.io/sprig/), à l'exception de `env` et `expandenv`, pour des raisons de sécurité.

Nous avons également ajouté deux fonctions de template spéciales : `include` et `required`. La fonction `include` vous permet d'intégrer un autre template, puis de passer les résultats à d'autres fonctions de template.

Par exemple, ce fragment de template inclut un template appelé `mytpl`, puis convertit le résultat en minuscules, puis l'entoure de guillemets doubles.

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

La fonction `required` vous permet de déclarer une entrée de values particulière comme obligatoire pour le rendu du template. Si la valeur est vide, le rendu du template échouera avec un message d'erreur soumis par l'utilisateur.

L'exemple suivant de la fonction `required` déclare qu'une entrée pour `.Values.who` est requise, et affichera un message d'erreur lorsque cette entrée est manquante :

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## Mettre les chaînes entre guillemets, pas les entiers

Lorsque vous travaillez avec des données de type chaîne de caractères, il est toujours plus sûr de mettre les chaînes entre guillemets plutôt que de les laisser comme des mots bruts :

```yaml
name: {{ .Values.MyName | quote }}
```

Mais lorsque vous travaillez avec des entiers, _ne mettez pas les valeurs entre guillemets._ Cela peut, dans de nombreux cas, provoquer des erreurs d'analyse dans Kubernetes.

```yaml
port: {{ .Values.Port }}
```

Cette remarque ne s'applique pas aux valeurs des variables d'environnement qui sont censées être des chaînes, même si elles représentent des entiers :

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## Utiliser la fonction 'include'

Go fournit un moyen d'inclure un template dans un autre en utilisant une directive `template` intégrée. Cependant, la fonction intégrée ne peut pas être utilisée dans les pipelines de templates Go.

Pour permettre d'inclure un template, puis d'effectuer une opération sur la sortie de ce template, Helm dispose d'une fonction spéciale `include` :

```
{{ include "toYaml" $value | indent 2 }}
```

Ce qui précède inclut un template appelé `toYaml`, lui passe `$value`, puis passe la sortie de ce template à la fonction `indent`.

Parce que YAML accorde de l'importance aux niveaux d'indentation et aux espaces blancs, c'est un excellent moyen d'inclure des fragments de code, tout en gérant l'indentation dans un contexte approprié.

## Utiliser la fonction 'required'

Go fournit un moyen de définir des options de template pour contrôler le comportement lorsqu'une map est indexée avec une clé qui n'est pas présente dans la map. Cela se fait généralement avec `template.Options("missingkey=option")`, où `option` peut être `default`, `zero` ou `error`. Bien que définir cette option sur error arrêtera l'exécution avec une erreur, cela s'appliquera à chaque clé manquante dans la map. Il peut y avoir des situations où un développeur de chart souhaite appliquer ce comportement pour certaines valeurs sélectionnées dans le fichier `values.yaml`.

La fonction `required` donne aux développeurs la possibilité de déclarer une entrée de valeur comme obligatoire pour le rendu du template. Si l'entrée est vide dans `values.yaml`, le template ne sera pas rendu et retournera un message d'erreur fourni par le développeur.

Par exemple :

```
{{ required "A valid foo is required!" .Values.foo }}
```

Ce qui précède rendra le template lorsque `.Values.foo` est défini, mais échouera au rendu et quittera lorsque `.Values.foo` n'est pas défini.

## Utiliser la fonction 'tpl'

La fonction `tpl` permet aux développeurs d'évaluer des chaînes comme des templates à l'intérieur d'un template. C'est utile pour passer une chaîne de template comme valeur à un chart ou rendre des fichiers de configuration externes. Syntaxe : `{{ tpl TEMPLATE_STRING VALUES }}`

Exemples :

```yaml
# values
template: "{{ .Values.name }}"
name: "Tom"

# template
{{ tpl .Values.template . }}

# output
Tom
```

Rendu d'un fichier de configuration externe :

```yaml
# external configuration file conf/app.conf
firstName={{ .Values.firstName }}
lastName={{ .Values.lastName }}

# values
firstName: Peter
lastName: Parker

# template
{{ tpl (.Files.Get "conf/app.conf") . }}

# output
firstName=Peter
lastName=Parker
```

## Créer des Image Pull Secrets

Les image pull secrets sont essentiellement une combinaison de _registry_, _username_ et _password_. Vous pouvez en avoir besoin dans une application que vous déployez, mais les créer nécessite d'exécuter `base64` plusieurs fois. Nous pouvons écrire un template helper pour composer le fichier de configuration Docker à utiliser comme contenu du Secret. Voici un exemple :

Tout d'abord, supposons que les identifiants sont définis dans le fichier `values.yaml` comme suit :

```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

Nous définissons ensuite notre template helper comme suit :

```
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":%s,\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username (.password | quote) .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

Enfin, nous utilisons le template helper dans un template plus large pour créer le manifeste Secret :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## Déclencher automatiquement le redéploiement des Deployments

Souvent, les ConfigMaps ou Secrets sont injectés comme fichiers de configuration dans les conteneurs, ou il existe d'autres changements de dépendances externes qui nécessitent le redémarrage des pods. Selon l'application, un redémarrage peut être nécessaire si ceux-ci sont mis à jour avec un `helm upgrade` ultérieur, mais si la spec du deployment elle-même n'a pas changé, l'application continue de fonctionner avec l'ancienne configuration, résultant en un déploiement incohérent.

La fonction `sha256sum` peut être utilisée pour s'assurer qu'une section d'annotation d'un deployment est mise à jour si un autre fichier change :

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

NOTE : Si vous ajoutez ceci à un library chart, vous ne pourrez pas accéder à votre fichier dans `$.Template.BasePath`. À la place, vous pouvez référencer votre définition avec `{{ include ("mylibchart.configmap") . | sha256sum }}`.

Dans le cas où vous voulez toujours déclencher le redéploiement, vous pouvez utiliser une étape d'annotation similaire à celle ci-dessus, en remplaçant par une chaîne aléatoire afin qu'elle change toujours et provoque le redéploiement :

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

Chaque invocation de la fonction de template générera une chaîne aléatoire unique. Cela signifie que s'il est nécessaire de synchroniser les chaînes aléatoires utilisées par plusieurs ressources, toutes les ressources concernées devront être dans le même fichier de template.

Ces deux méthodes permettent à votre Deployment d'exploiter la logique de stratégie de mise à jour intégrée pour éviter les temps d'arrêt.

NOTE : Par le passé, nous recommandions d'utiliser le flag `--recreate-pods` comme autre option. Ce flag a été marqué comme déprécié dans Helm 3 en faveur de la méthode déclarative ci-dessus.

## Indiquer à Helm de ne pas désinstaller une ressource

Parfois, certaines ressources ne doivent pas être désinstallées lorsque Helm exécute un `helm uninstall`. Les développeurs de charts peuvent ajouter une annotation à une ressource pour empêcher sa désinstallation.

```yaml
kind: Secret
metadata:
  annotations:
    helm.sh/resource-policy: keep
[...]
```

L'annotation `helm.sh/resource-policy: keep` indique à Helm d'ignorer la suppression de cette ressource lorsqu'une opération helm (comme `helm uninstall`, `helm upgrade` ou `helm rollback`) entraînerait sa suppression. _Cependant_, cette ressource devient orpheline. Helm ne la gérera plus d'aucune manière. Cela peut poser des problèmes si vous utilisez `helm install --replace` sur une release qui a déjà été désinstallée, mais qui a conservé des ressources.

## Utiliser les « Partials » et les includes de templates

Parfois, vous souhaitez créer des éléments réutilisables dans votre chart, qu'il s'agisse de blocs ou de partials de templates. Et souvent, il est plus propre de les conserver dans leurs propres fichiers.

Dans le répertoire `templates/`, tout fichier commençant par un underscore (`_`) n'est pas censé produire un fichier manifeste Kubernetes. Par convention, les templates helpers et les partials sont placés dans un fichier `_helpers.tpl`.

## Charts complexes avec de nombreuses dépendances

De nombreux charts sur [Artifact Hub](https://artifacthub.io/packages/search?kind=0) de la CNCF sont des « blocs de construction » pour créer des applications plus avancées. Mais les charts peuvent également être utilisés pour créer des instances d'applications à grande échelle. Dans de tels cas, un seul chart parapluie peut avoir plusieurs sous-charts, chacun fonctionnant comme une pièce de l'ensemble.

La meilleure pratique actuelle pour composer une application complexe à partir d'éléments discrets est de créer un chart parapluie de niveau supérieur qui expose les configurations globales, puis d'utiliser le sous-répertoire `charts/` pour intégrer chacun des composants.

## YAML est un sur-ensemble de JSON

Selon la spécification YAML, YAML est un sur-ensemble de JSON. Cela signifie que toute structure JSON valide devrait être valide en YAML.

Cela présente un avantage : parfois, les développeurs de templates peuvent trouver plus facile d'exprimer une structure de données avec une syntaxe de type JSON plutôt que de gérer la sensibilité aux espaces blancs de YAML.

En tant que bonne pratique, les templates devraient suivre une syntaxe de type YAML _sauf si_ la syntaxe JSON réduit substantiellement le risque de problème de formatage.

## Attention à la génération de valeurs aléatoires

Il existe des fonctions dans Helm qui vous permettent de générer des données aléatoires, des clés cryptographiques, etc. C'est bien de les utiliser. Mais sachez que lors des mises à niveau, les templates sont ré-exécutés. Lorsqu'une exécution de template génère des données qui diffèrent de la dernière exécution, cela déclenchera une mise à jour de cette ressource.

## Installer ou mettre à niveau une release avec une seule commande

Helm fournit un moyen d'effectuer une installation ou une mise à niveau en une seule commande. Utilisez `helm upgrade` avec la commande `--install`. Cela amènera Helm à vérifier si la release est déjà installée. Si ce n'est pas le cas, il exécutera une installation. Si elle l'est, alors la release existante sera mise à niveau.

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
