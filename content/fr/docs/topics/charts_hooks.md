---
title: "Les Hooks de Chart"
description: "Décrit comment travailler avec les hooks de chart"
weight: 2
---

Helm fournit un mécanisme de _hook_ permettant aux développeurs de charts d'intervenir à certains moments du cycle de vie d'une release. Par exemple, vous pouvez utiliser des hooks pour :

- Charger un ConfigMap ou un Secret lors de l'installation avant que d'autres charts ne soient chargés.
- Exécuter un Job pour sauvegarder une base de données avant d'installer un nouveau chart, puis exécuter un deuxième job après la mise à niveau afin de restaurer les données.
- Exécuter un Job avant de supprimer une release pour retirer un service de manière ordonnée avant de le supprimer.

Les hooks fonctionnent comme des templates réguliers, mais ils ont des annotations spéciales qui font que Helm les utilise différemment. Dans cette section, nous couvrons le modèle d'utilisation de base des hooks.

## Les Hooks disponibles

Les hooks suivants sont définis :

| Valeur de l'annotation | Description                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `pre-install`            | S'exécute après le rendu des templates, mais avant que les ressources ne soient créées dans Kubernetes               |
| `post-install`           | S'exécute après que toutes les ressources aient été chargées dans Kubernetes                                         |
| `pre-delete`             | S'exécute lors d'une demande de suppression avant que les ressources ne soient supprimées de Kubernetes              |
| `post-delete`            | S'exécute lors d'une demande de suppression après que toutes les ressources de la release aient été supprimées       |
| `pre-upgrade`            | S'exécute lors d'une demande de mise à niveau après le rendu des templates, mais avant la mise à jour des ressources |
| `post-upgrade`           | S'exécute après la mise à jour de toutes les ressources                                                              |
| `pre-rollback`           | S'exécute lors d'une demande de restauration après le rendu des templates, mais avant la restauration des ressources |
| `post-rollback`          | S'exécute après que toutes les ressources aient été modifiées lors d'une restauration                                |
| `test`                  | S'exécute lorsque la sous-commande de test Helm est invoquée ([voir la documentation des tests](/docs/chart_tests/)) |

_Remarquez que le hook `crd-install` a été supprimé au profit du répertoire `crds/` dans Helm 3._

## Les hooks et le cycle de vie d'une release

Les hooks vous permettent, en tant que développeur de chart, d'effectuer des opérations à des points stratégiques du cycle de vie d'une release. Par exemple, considérons le cycle de vie d'une `helm install`. Par défaut, le cycle de vie ressemble à ceci :

1. L'utilisateur exécute `helm install foo`
2. L'API d'installation de la bibliothèque Helm est appelée
3. Après une vérification, la bibliothèque rend les templates de `foo`
4. La bibliothèque charge les ressources résultantes dans Kubernetes
5. La bibliothèque retourne l'objet de la release (et d'autres données) au client
6. Le client se termine

Helm définit deux hooks pour le cycle de vie de `install` : `pre-install` et `post-install`. Si le développeur du chart `foo` implémente les deux hooks, le cycle de vie est modifié comme suit :

1. L'utilisateur exécute `helm install foo`
2. L'API d'installation de la bibliothèque Helm est appelée
3. Les CRD dans le répertoire `crds/` sont installées
4. Après vérification, la bibliothèque rend les templates de `foo`
5. La bibliothèque se prépare à exécuter les hooks `pre-install` (chargement des ressources de hook dans Kubernetes)
6. La bibliothèque trie les hooks par poids (attribuant un poids de 0 par défaut), par type de ressource et enfin par nom en ordre croissant
7. La bibliothèque charge ensuite le hook avec le poids le plus bas en premier (de négatif à positif)
8. La bibliothèque attend que le hook soit "prêt" (à l'exception des CRD)
9. La bibliothèque charge les ressources résultantes dans Kubernetes. Notez que si le drapeau `--wait` est défini, la bibliothèque attendra que toutes les ressources soient dans un état prêt et ne exécutera pas le hook `post-install` tant qu'elles ne sont pas prêtes.
10. La bibliothèque exécute le hook `post-install` (chargement des ressources de hook)
11. La bibliothèque attend que le hook soit "prêt"
12. La bibliothèque retourne l'objet de la release (et d'autres données) au client
13. Le client se termine

Qu'est-ce que cela signifie d'attendre qu'un hook soit prêt ? Cela dépend du type de ressource déclaré dans le hook. Si la ressource est de type `Job` ou `Pod`, Helm attendra jusqu'à ce qu'elle s'exécute avec succès jusqu'à son terme. Et si le hook échoue, la release échouera. Il s'agit d'une _opération bloquante_, donc le client Helm se mettra en pause pendant que le Job est exécuté.

Pour tous les autres types, dès que Kubernetes marque la ressource comme chargée (ajoutée ou mise à jour), la ressource est considérée comme "prête". Lorsque plusieurs ressources sont déclarées dans un hook, elles sont exécutées de manière séquentielle. Si elles ont des poids de hook (voir ci-dessous), elles sont exécutées dans l'ordre des poids. 

À partir de Helm 3.2.0, les ressources de hook ayant le même poids sont installées dans le même ordre que les ressources non-hook normales. Sinon, l'ordre n'est pas garanti. (Dans Helm 2.3.0 et versions ultérieures, elles étaient triées par ordre alphabétique. Ce comportement n'est pas considéré comme contraignant et pourrait changer à l'avenir.) Il est considéré comme une bonne pratique d'ajouter un poids de hook et de le définir à 0 si le poids n'est pas important.

### Les ressources de hook ne sont pas gérées avec les releases correspondantes

Les ressources créées par un hook ne sont actuellement pas suivies ni gérées dans le cadre de la release. Une fois que Helm vérifie que le hook a atteint son état prêt, il laissera la ressource de hook telle quelle. La collecte des ressources de hook lors de la suppression de la release correspondante pourrait être ajoutée à Helm 3 à l'avenir, donc toute ressource de hook qui ne doit jamais être supprimée doit être annotée avec `helm.sh/resource-policy: keep`.

En pratique, cela signifie que si vous créez des ressources dans un hook, vous ne pouvez pas compter sur `helm uninstall` pour supprimer les ressources. Pour détruire ces ressources, vous devez soit [ajouter une annotation personnalisée `helm.sh/hook-delete-policy`](#hook-deletion-policies) au fichier template du hook, soit [définir le champ de durée de vie (TTL) d'une ressource Job](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/).

## Écrire un Hook

Les hooks sont simplement des fichiers de manifeste Kubernetes avec des annotations spéciales dans la section `metadata`. Étant donné qu'ils sont des fichiers de template, vous pouvez utiliser toutes les fonctionnalités de template normales, y compris la lecture de `.Values`, `.Release`, et `.Template`.

Par exemple, ce template, stocké dans `templates/post-install-job.yaml`, déclare un job à exécuter lors du `post-install` :

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
    # C'est ce qui définit cette ressource comme un hook. Sans cette ligne, le
    # job est considéré comme faisant partie de la release.
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

Ce qui rend ce template un hook est l'annotation :

```yaml
annotations:
  "helm.sh/hook": post-install
```

Une ressource peut implémenter plusieurs hooks :

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

De même, il n'y a pas de limite au nombre de ressources différentes qui peuvent implémenter un hook donné. Par exemple, on pourrait déclarer à la fois un secret et une config map comme un hook `pre-install`.

Lorsque les sous-charts déclarent des hooks, ceux-ci sont également évalués. Il n'est pas possible pour un chart de niveau supérieur de désactiver les hooks déclarés par les sous-charts.

Il est possible de définir un poids pour un hook, ce qui aidera à établir un ordre d'exécution déterministe. Les poids sont définis à l'aide de l'annotation suivante :

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

Les poids des hooks peuvent être des nombres positifs ou négatifs mais doivent être représentés sous forme de chaînes de caractères. Lorsque Helm commence le cycle d'exécution des hooks d'un type particulier, il triera ces hooks par ordre croissant.

### Politiques de suppression des hooks

Il est possible de définir des politiques qui déterminent quand supprimer les ressources de hook correspondantes. Les politiques de suppression des hooks sont définies à l'aide de l'annotation suivante :

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

Vous pouvez choisir une ou plusieurs valeurs d'annotation définies :

| Valeur d'annotation     | Description                                                             |
| ----------------------- | ----------------------------------------------------------------------- |
| `before-hook-creation`     | Supprimer la ressource précédente avant qu'un nouveau hook ne soit lancé (par défaut) |
| `hook-succeeded`          | Supprimer la ressource après l'exécution réussie du hook                  |
| `hook-failed`             | Supprimer la ressource si le hook a échoué pendant l'exécution            |

Si aucune politique de suppression de hook n'est spécifiée, le comportement `before-hook-creation` s'applique par défaut..
