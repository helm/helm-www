---
title: "Trucs et astuces pour le développement de charts"
description: "Couvre certains des trucs et astuces que les développeurs de charts Helm ont appris en construisant des charts de qualité pour la production."
weight: 1
---

Couvre certains des trucs et astuces que les développeurs de charts Helm ont appris en construisant des charts de qualité pour la production.

## Connaitre les Fonctions de Template

Helm utilise les [templates Go](https://godoc.org/text/template) pour le templating de vos fichiers de ressources. Bien que Go propose plusieurs fonctions intégrées, nous en avons ajouté beaucoup d'autres.

Tout d'abord, nous avons ajouté toutes les fonctions de la [bibliothèque Sprig](https://masterminds.github.io/sprig/), à l'exception de `env` et `expandenv`, pour des raisons de sécurité.

Nous avons également ajouté deux fonctions de template spéciales : `include` et `required`. La fonction `include` vous permet d'incorporer un autre template, puis de passer les résultats à d'autres fonctions de template.

Par exemple, cet extrait de template inclut un template appelé `mytpl`, puis met le résultat en minuscules et l'entoure de guillemets doubles :

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

La fonction `required` vous permet de déclarer qu'une entrée de valeurs particulière est obligatoire pour le rendu du template. Si la valeur est vide, le rendu du template échouera et affichera un message d'erreur soumis par l'utilisateur.

L'exemple suivant de la fonction `required` qui déclare que l'entrée pour `.Values.who` est obligatoire et affichera un message d'erreur si cette entrée est manquante :

```yaml
value: {{ required "La valeur .Values.who est requise !" .Values.who }}
```

## Citez les chaînes de caractères, pas les entiers

Lorsque vous travaillez avec des données de type chaîne de caractères, il est toujours plus sûr de citer (`".."`) les chaînes de caractères plutôt que de les laisser sous forme de mots nus :

```yaml
name: {{ .Values.MyName | quote }}
```

Mais lorsqu'il s'agit de travailler avec des entiers, _ne citez pas les valeurs._ Cela peut, dans de nombreux cas, provoquer des erreurs d'analyse au sein de Kubernetes.

```yaml
port: {{ .Values.Port }}
```

Cette remarque ne s'applique pas aux valeurs des variables d'environnement qui sont attendues sous forme de chaînes de caractères, même si elles représentent des entiers :

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## Utilisation de la fonction 'include'

Go fournit un moyen d'inclure un modèle dans un autre en utilisant une directive intégrée `template`. Cependant, la fonction intégrée ne peut pas être utilisée dans les pipelines de modèles Go.

Pour rendre possible l'inclusion d'un modèle, puis effectuer une opération sur la sortie de ce modèle, Helm dispose d'une fonction spéciale `include` :

```
{{ include "toYaml" $value | indent 2 }}
```

L'exemple ci-dessus, inclut un modèle appelé `toYaml`, lui passe `$value`, puis transmet la sortie de ce modèle à la fonction `indent`.

Étant donné que YAML accorde de l'importance aux niveaux d'indentation et aux espaces, c'est une excellente manière d'inclure des extraits de code tout en gérant l'indentation dans un contexte pertinent.

## Utilisation de la fonction 'required'

Go fournit un moyen de définir des options de modèle pour contrôler le comportement lorsqu'un mapping est indexée avec une clé qui n'est pas présente dans le mapping. Cela se règle généralement avec `template.Options("missingkey=option")`, où `option` peut être `default`, `zero`, ou `error`. Tandis que le paramètre `error` arrête l'exécution en cas d'erreur, cela s'appliquerait à chaque clé manquante dans le mapping. Il peut y avoir des situations où un développeur de chart souhaite imposer ce comportement pour certaines valeurs dans le fichier `values.yaml`.

La fonction `required` permet aux développeurs de déclarer une entrée de valeur comme obligatoire pour le rendu du modèle. Si l'entrée est vide dans `values.yaml`, le modèle ne sera pas rendu et renverra un message d'erreur fourni par le développeur.

Pour exemple :

```
{{ required "Une valeur pour foo est obligatoire !" .Values.foo }}
```

L'exemple ci-dessus, rendra le modèle lorsque `.Values.foo` est défini, mais échouera à rendre le modèle et se terminera lorsque `.Values.foo` est indéfini.

## Utilisation de la fonction 'tpl'

La fonction `tpl` permet aux développeurs d'évaluer des chaînes de caractères comme des modèles à l'intérieur d'un modèle. Cela est utile pour passer une chaîne de modèle comme valeur à un chart ou pour rendre des fichiers de configuration externes. Syntaxe : `{{ tpl TEMPLATE_STRING VALUES }}`

Exemples :

```yaml
# values
template: "{{ .Values.name }}"
name: "Benjamin"

# template
{{ tpl .Values.template . }}

# output
Benjamin
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

## Création de Secrets de récupération d'images
Les secrets de récupération d'image (Image Pull Secrets) sont essentiellement une combinaison de _registry_, _username_, et _password_. Vous pourriez en avoir besoin dans une application que vous déployez, mais leur création nécessite d'exécuter `base64` plusieurs fois. Nous pouvons écrire un modèle d'assistance pour composer le fichier de configuration Docker à utiliser comme charge utile du Secret. Voici un exemple :

Tout d'abord, supposons que les informations d'identification sont définies dans le fichier `values.yaml` comme suit :
```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

Nous définissons ensuite notre modèle d'assistance comme suit :
```
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":\"%s\",\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username .password .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

Enfin, nous utilisons le modèle d'assistance dans un modèle plus large pour créer le manifeste du Secret :
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## Déploiements automatiques

Souvent, les ConfigMaps ou Secrets sont injectés comme fichiers de configuration dans les conteneurs, ou il y a d'autres modifications de dépendances externes qui nécessitent un roulage des pods. Selon l'application, un redémarrage peut être nécessaire si ces éléments sont mis à jour avec un `helm upgrade` ultérieur. Cependant, si la spec de déploiement elle-même n'a pas changée, l'application continue de fonctionner avec l'ancienne configuration, entraînant un déploiement incohérent.

La fonction `sha256sum` peut être utilisée pour garantir que la section des annotations d'un déploiement est mise à jour si un autre fichier change :

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

REMARQUE : Si vous ajoutez cela à un chart librairie vous ne pourrez pas accéder à votre fichier dans `$.Template.BasePath`. Vous pouvez plutôt référencer votre définition avec `{{ include ("mylibchart.configmap") . | sha256sum }}`.

Dans le cas où vous souhaitez toujours effectuer un roulage de votre déploiement, vous pouvez utiliser une étape d'annotation similaire à celle mentionnée ci-dessus, mais en la remplaçant par une chaîne aléatoire pour qu'elle change toujours et entraîne le roulage du déploiement :

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

Chaque appel de la fonction de modèle générera une chaîne aléatoire unique. Cela signifie que si vous devez synchroniser les chaînes aléatoires utilisées par plusieurs ressources, toutes les ressources pertinentes devront être dans le même fichier de modèle.

Ces deux méthodes permettent à votre Déploiement de tirer parti de la logique de stratégie de mise à jour intégrée pour éviter les temps d'arrêt.

REMARQUE : Par le passé, nous recommandions l'utilisation de l'argument `--recreate-pods` comme autre option. Cet argument a été marqué comme obsolète dans Helm 3 au profit de la méthode plus déclarative mentionnée ci-dessus.

## Indiquez à Helm de ne pas désinstaller une ressource

Parfois, certaines ressources ne doivent pas être désinstallées lorsque Helm exécute un `helm uninstall`. Les développeurs de chart peuvent ajouter une annotation à leurs ressources pour éviter leurs désinstallations.

```yaml
kind: Secret
metadata:
  annotations:
    helm.sh/resource-policy: keep
[...]
```

L'annotation `helm.sh/resource-policy: keep` indique à Helm de ne pas supprimer cette ressource lorsqu'une opération Helm (comme `helm uninstall`, `helm upgrade` ou `helm rollback`) entraînerait sa suppression. _Cependant_, cette ressource devient orpheline. Helm ne la gérera plus de quelque manière que ce soit. Cela peut entraîner des problèmes si vous utilisez `helm install --replace` sur une release qui a déjà été désinstallée, mais qui a conservé des ressources.

## Utilisation des "Partiels" et des Inclusion de Modèles

Parfois, vous souhaitez créer des parties réutilisables dans votre chart, qu'il s'agisse de blocs ou de modèles partiels. Il est souvent plus propre de les garder dans leurs propres fichiers.

Dans le répertoire `templates/`, tout fichier commençant par un underscore (`_`) n'est pas censé produire un fichier manifeste Kubernetes. Par conséquent, par convention, les modèles d'assistance et les partiels sont placés dans un fichier `_helpers.tpl`.

## Charts complexes avec de nombreuses dépendances

Beaucoup de charts sur le [Artifact Hub](https://artifacthub.io/packages/search?kind=0) de la CNCF sont des "blocs de construction" pour créer des applications plus avancées. Mais les charts peuvent aussi être utilisés pour créer des instances d'applications à grande échelle. Dans ces cas, un chart "parapluie" unique peut avoir plusieurs sous-charts, chacun fonctionnant comme une partie de l'ensemble.

La meilleure pratique actuelle pour composer une application complexe à partir de parties distinctes est de créer un chart "parapluie" de niveau supérieur qui expose les configurations globales, puis d'utiliser le sous-répertoire `charts/` pour intégrer chacun des composants.*

## YAML est un sur-ensemble de JSON

Selon la spécification YAML, YAML est un sur-ensemble de JSON. Cela signifie que toute structure JSON valide devrait également être valide en YAML.

Cela présente un avantage : il arrive que les développeurs de modèles trouvent plus facile d'exprimer une structure de données avec une syntaxe semblable à JSON plutôt que de gérer la sensibilité aux espaces de YAML.

En tant que bonne pratique, les modèles doivent suivre une syntaxe semblable à YAML _à moins que_ la syntaxe JSON ne réduise considérablement le risque de problème de formatage.

## Soyez vigilant avec la génération de valeurs aléatoires

Il existe des fonctions dans Helm qui vous permettent de générer des données aléatoires, des clés cryptographiques, etc. Ces fonctions sont utiles. Cependant, soyez conscient qu'au cours des mises à jour, les modèles sont réexécutés. Lorsque l'exécution d'un modèle génère des données différentes de celles de l'exécution précédente, cela déclenchera une mise à jour de cette ressource.

## Installer ou mettre à jour une release avec une seule commande

Helm offre un moyen d'effectuer une installation ou une mise à jour en une seule commande. Utilisez `helm upgrade` avec l'option `--install`. Cela amène Helm à vérifier si la release est déjà installée. Si ce n'est pas le cas, il effectuera une installation. Si elle l'est, la release existante sera mise à jour.

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
