---
title: Hooks de chart
description: Décrit comment utiliser les hooks de chart.
sidebar_position: 2
default_lang_commit: 243c2d6ac95078256a4b2b56013aae454e67202a
---

Helm fournit un mécanisme de _hook_ qui permet aux développeurs de charts
d'intervenir à certains moments du cycle de vie d'une release. Par exemple,
vous pouvez utiliser les hooks pour :

- Charger un ConfigMap ou un Secret pendant l'installation, avant le chargement
  des autres charts.
- Exécuter un Job pour sauvegarder une base de données avant d'installer un
  nouveau chart, puis exécuter un second job après la mise à niveau pour
  restaurer les données.
- Exécuter un Job avant la suppression d'une release pour retirer proprement un
  service de la rotation avant de le supprimer.

Les hooks fonctionnent comme des templates classiques, mais ils possèdent des
annotations spéciales qui amènent Helm à les utiliser différemment. Cette
section présente l'utilisation de base des hooks.

## Les hooks disponibles {#the-available-hooks}

Les hooks suivants sont définis :

| Valeur de l'annotation | Description                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `pre-install`          | S'exécute après le rendu des templates, mais avant la création des ressources dans Kubernetes                                |
| `post-install`         | S'exécute après le chargement de toutes les ressources dans Kubernetes                                                       |
| `pre-delete`           | S'exécute lors d'une demande de suppression, avant la suppression des ressources de Kubernetes                               |
| `post-delete`          | S'exécute lors d'une demande de suppression, après la suppression de toutes les ressources de la release                     |
| `pre-upgrade`          | S'exécute lors d'une demande de mise à niveau, après le rendu des templates, mais avant la mise à jour des ressources        |
| `post-upgrade`         | S'exécute lors d'une demande de mise à niveau, après la mise à niveau de toutes les ressources                               |
| `pre-rollback`         | S'exécute lors d'une demande de restauration (rollback), après le rendu des templates, mais avant la restauration des ressources |
| `post-rollback`        | S'exécute lors d'une demande de restauration, après la modification de toutes les ressources                                 |
| `test`                 | S'exécute lorsque la sous-commande `test` de Helm est appelée ([voir la documentation des tests](/topics/chart_tests.md))    |

_Remarque : le hook `crd-install` a été supprimé au profit du répertoire
`crds/` dans Helm 3._

## Les hooks et le cycle de vie d'une release {#hooks-and-the-release-lifecycle}

Les hooks vous donnent, en tant que développeur de charts, la possibilité
d'effectuer des opérations à des moments stratégiques du cycle de vie d'une
release. Prenons par exemple le cycle de vie d'un `helm install`. Par défaut,
il se déroule ainsi :

1. L'utilisateur exécute `helm install foo`
2. L'API d'installation de la bibliothèque Helm est appelée
3. Après quelques vérifications, la bibliothèque effectue le rendu des templates de `foo`
4. La bibliothèque charge les ressources obtenues dans Kubernetes
5. La bibliothèque renvoie l'objet release (et d'autres données) au client
6. Le client se termine

Helm définit deux hooks pour le cycle de vie `install` : `pre-install` et
`post-install`. Si le développeur du chart `foo` implémente ces deux hooks, le
cycle de vie devient :

1. L'utilisateur exécute `helm install foo`
2. L'API d'installation de la bibliothèque Helm est appelée
3. Les CRD du répertoire `crds/` sont installées
4. Après quelques vérifications, la bibliothèque effectue le rendu des templates de `foo`
5. La bibliothèque se prépare à exécuter les hooks `pre-install` (chargement des
   ressources des hooks dans Kubernetes)
6. La bibliothèque trie les hooks par poids (avec un poids de 0 par défaut),
   puis par type de ressource et enfin par nom, dans l'ordre croissant.
7. La bibliothèque charge ensuite en premier le hook de poids le plus faible
   (du négatif vers le positif)
8. La bibliothèque attend que le hook soit « Ready » (sauf pour les CRD)
9. La bibliothèque charge les ressources obtenues dans Kubernetes. Notez que si
   l'option `--wait` est utilisée, la bibliothèque attend que toutes les
   ressources soient prêtes et n'exécute le hook `post-install` qu'une fois
   qu'elles le sont.
10. La bibliothèque exécute le hook `post-install` (chargement des ressources des hooks)
11. La bibliothèque attend que le hook soit « Ready »
12. La bibliothèque renvoie l'objet release (et d'autres données) au client
13. Le client se termine

Que signifie attendre qu'un hook soit prêt ? Cela dépend de la ressource
déclarée dans le hook. Si la ressource est de type `Job` ou `Pod`, Helm attend
qu'elle s'exécute avec succès jusqu'au bout. Et si le hook échoue, la release
échoue. Il s'agit d'une _opération bloquante_ : le client Helm reste en pause
pendant l'exécution du Job.

Pour tous les autres types, dès que Kubernetes marque la ressource comme chargée
(ajoutée ou mise à jour), la ressource est considérée comme « Ready ». Lorsque
plusieurs ressources sont déclarées dans un hook, elles sont exécutées en série.
Si elles ont des poids de hook (voir ci-dessous), elles sont exécutées dans
l'ordre de leurs poids.
Depuis Helm 3.2.0, les ressources des hooks de même poids sont installées dans le
même ordre que les ressources ordinaires (hors hooks). Sinon, l'ordre n'est pas
garanti. (À partir de Helm 2.3.0, elles sont triées par ordre alphabétique. Ce
comportement n'est toutefois pas considéré comme contractuel et pourrait changer
à l'avenir.) Une bonne pratique consiste à ajouter un poids de hook et à le
fixer à `0` si le poids n'a pas d'importance.

### Les ressources des hooks ne sont pas gérées avec les releases correspondantes {#hook-resources-are-not-managed-with-corresponding-releases}

Les ressources créées par un hook ne sont actuellement ni suivies ni gérées
comme faisant partie de la release. Une fois que Helm a vérifié que le hook
est prêt, il laisse la ressource du hook telle quelle. Le nettoyage
des ressources des hooks lors de la suppression de la release correspondante
pourrait être ajouté à Helm 3 à l'avenir. Toute ressource d'un hook à ne jamais
supprimer doit donc porter l'annotation
`helm.sh/resource-policy: keep`.

En pratique, cela signifie que si vous créez des ressources dans un hook, vous
ne pouvez pas compter sur `helm uninstall` pour les supprimer. Pour supprimer
ces ressources, vous devez soit [ajouter une annotation
`helm.sh/hook-delete-policy` personnalisée](#hook-deletion-policies) au fichier de template
du hook, soit [définir le champ de durée de vie (TTL) d'une ressource
Job](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/).

## Écrire un hook {#writing-a-hook}

Les hooks sont de simples manifestes Kubernetes avec des annotations
spéciales dans la section `metadata`. Comme ce sont des fichiers de template,
vous pouvez utiliser toutes les fonctionnalités habituelles des templates, y
compris la lecture de `.Values`, `.Release` et `.Template`.

Par exemple, ce template, enregistré dans `templates/post-install-job.yaml`,
déclare un job à exécuter en `post-install` :

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}"
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
    app.kubernetes.io/instance: {{ .Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  annotations:
    # This is what defines this resource as a hook. Without this line, the
    # job is considered part of the release.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{ .Release.Name }}"
      labels:
        app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
        app.kubernetes.io/instance: {{ .Release.Name | quote }}
        helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{ default "10" .Values.sleepyTime }}"]

```

C'est l'annotation suivante qui fait de ce template un hook :

```yaml
annotations:
  "helm.sh/hook": post-install
```

Une même ressource peut implémenter plusieurs hooks :

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

De même, le nombre de ressources différentes qui peuvent implémenter un hook
donné n'est pas limité. Par exemple, on peut déclarer à la fois un Secret et un
ConfigMap comme hook `pre-install`.

Lorsque des sous-charts déclarent des hooks, ceux-ci sont également évalués. Un
chart parent racine ne peut pas désactiver les hooks déclarés par ses
sous-charts.

Vous pouvez définir un poids pour un hook afin d'obtenir un ordre d'exécution
déterministe. Les poids sont définis avec l'annotation suivante :

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

Les poids de hook peuvent être des nombres positifs ou négatifs, mais doivent
être écrits sous forme de chaînes. Lorsque Helm commence le cycle d'exécution
des hooks d'un type donné, il les trie par ordre croissant.

### Politiques de suppression des hooks {#hook-deletion-policies}

Vous pouvez définir des politiques qui déterminent quand supprimer les
ressources des hooks correspondants. Les politiques de suppression des hooks sont
définies avec l'annotation suivante :

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

Vous pouvez choisir une ou plusieurs des valeurs d'annotation définies :

| Valeur de l'annotation | Description                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `before-hook-creation` | Supprime la ressource précédente avant le lancement d'un nouveau hook (par défaut) |
| `hook-succeeded`       | Supprime la ressource après l'exécution réussie du hook                             |
| `hook-failed`          | Supprime la ressource si le hook a échoué pendant son exécution                     |

Si aucune annotation de politique de suppression n'est indiquée, le
comportement `before-hook-creation` s'applique par défaut.
