---
title: Hooks de chart
description: Décrit comment utiliser les hooks de chart.
sidebar_position: 2
---

Helm fournit un mécanisme de _hook_ permettant aux développeurs de charts
d'intervenir à certains moments du cycle de vie d'une release. Par exemple,
vous pouvez utiliser les hooks pour :

- Charger un ConfigMap ou un Secret pendant l'installation avant le chargement
  des autres charts.
- Exécuter un Job pour sauvegarder une base de données avant l'installation d'un
  nouveau chart, puis exécuter un second job après la mise à niveau pour restaurer
  les données.
- Exécuter un Job avant la suppression d'une release pour retirer proprement un
  service de la rotation avant de le supprimer.

Les hooks fonctionnent comme des templates classiques, mais possèdent des
annotations spéciales qui amènent Helm à les utiliser différemment. Cette section
couvre les principes de base de l'utilisation des hooks.

## Les hooks disponibles

Les hooks suivants sont définis :

| Valeur de l'annotation | Description                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `pre-install`          | S'exécute après le rendu des templates, mais avant la création des ressources dans Kubernetes                |
| `post-install`         | S'exécute après le chargement de toutes les ressources dans Kubernetes                                       |
| `pre-delete`           | S'exécute lors d'une demande de suppression, avant la suppression des ressources de Kubernetes               |
| `post-delete`          | S'exécute lors d'une demande de suppression, après la suppression de toutes les ressources de la release     |
| `pre-upgrade`          | S'exécute lors d'une mise à niveau, après le rendu des templates, mais avant la mise à jour des ressources   |
| `post-upgrade`         | S'exécute lors d'une mise à niveau, après la mise à jour de toutes les ressources                            |
| `pre-rollback`         | S'exécute lors d'un rollback, après le rendu des templates, mais avant le rollback des ressources            |
| `post-rollback`        | S'exécute lors d'un rollback, après la modification de toutes les ressources                                 |
| `test`                 | S'exécute lorsque la sous-commande test de Helm est invoquée ([voir la documentation des tests](/topics/chart_tests.md)) |

_Note : le hook `crd-install` a été supprimé au profit du répertoire `crds/`
dans Helm 3._

## Les hooks et le cycle de vie d'une release

Les hooks vous permettent, en tant que développeur de charts, d'effectuer des
opérations à des moments stratégiques du cycle de vie d'une release. Par exemple,
considérons le cycle de vie d'un `helm install`. Par défaut, celui-ci se déroule
ainsi :

1. L'utilisateur exécute `helm install foo`
2. L'API d'installation de la bibliothèque Helm est appelée
3. Après quelques vérifications, la bibliothèque effectue le rendu des templates de `foo`
4. La bibliothèque charge les ressources résultantes dans Kubernetes
5. La bibliothèque renvoie l'objet release (et d'autres données) au client
6. Le client se termine

Helm définit deux hooks pour le cycle de vie de l'installation : `pre-install` et
`post-install`. Si le développeur du chart `foo` implémente ces deux hooks, le
cycle de vie est modifié ainsi :

1. L'utilisateur exécute `helm install foo`
2. L'API d'installation de la bibliothèque Helm est appelée
3. Les CRDs du répertoire `crds/` sont installés
4. Après quelques vérifications, la bibliothèque effectue le rendu des templates de `foo`
5. La bibliothèque prépare l'exécution des hooks `pre-install` (chargement des
   ressources du hook dans Kubernetes)
6. La bibliothèque trie les hooks par poids (attribuant un poids de 0 par défaut),
   puis par type de ressource et enfin par nom dans l'ordre croissant
7. La bibliothèque charge ensuite le hook ayant le poids le plus faible en premier
   (du négatif vers le positif)
8. La bibliothèque attend que le hook soit « Ready » (sauf pour les CRDs)
9. La bibliothèque charge les ressources résultantes dans Kubernetes. Notez que si
   le drapeau `--wait` est défini, la bibliothèque attendra que toutes les ressources
   soient dans un état prêt et n'exécutera pas le hook `post-install` tant qu'elles
   ne le seront pas.
10. La bibliothèque exécute le hook `post-install` (chargement des ressources du hook)
11. La bibliothèque attend que le hook soit « Ready »
12. La bibliothèque renvoie l'objet release (et d'autres données) au client
13. Le client se termine

Que signifie attendre qu'un hook soit prêt ? Cela dépend de la ressource déclarée
dans le hook. Si la ressource est de type `Job` ou `Pod`, Helm attendra qu'elle
s'exécute avec succès jusqu'à son terme. Et si le hook échoue, la release échouera.
Il s'agit d'une _opération bloquante_, le client Helm se mettra donc en pause
pendant l'exécution du Job.

Pour tous les autres types, dès que Kubernetes marque la ressource comme chargée
(ajoutée ou mise à jour), la ressource est considérée comme « Ready ». Lorsque
plusieurs ressources sont déclarées dans un hook, elles sont exécutées en série.
Si elles possèdent des poids de hook (voir ci-dessous), elles sont exécutées dans
l'ordre de leurs poids.
À partir de Helm 3.2.0, les ressources de hook ayant le même poids sont installées
dans le même ordre que les ressources normales (non-hook). Sinon, l'ordre n'est pas
garanti. (Dans Helm 2.3.0 et versions ultérieures, elles étaient triées par ordre
alphabétique. Ce comportement n'est toutefois pas considéré comme contraignant et
pourrait changer à l'avenir.) Une bonne pratique consiste à ajouter un poids de hook
et à le définir à `0` si le poids n'est pas important.

### Les ressources de hook ne sont pas gérées avec les releases correspondantes

Les ressources créées par un hook ne sont actuellement pas suivies ni gérées dans
le cadre de la release. Une fois que Helm a vérifié que le hook a atteint son état
prêt, il ne touche plus à la ressource du hook. Le nettoyage des ressources de hook
lors de la suppression de la release correspondante pourrait être ajouté à Helm 3
dans le futur, donc toute ressource de hook qui ne doit jamais être supprimée doit
être annotée avec `helm.sh/resource-policy: keep`.

En pratique, cela signifie que si vous créez des ressources dans un hook, vous ne
pouvez pas compter sur `helm uninstall` pour les supprimer. Pour détruire ces
ressources, vous devez soit [ajouter une annotation personnalisée
`helm.sh/hook-delete-policy`](#politiques-de-suppression-de-hook) au fichier
template du hook, soit [définir le champ TTL (time to live) d'une ressource
Job](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/).

## Écrire un hook

Les hooks sont simplement des fichiers manifeste Kubernetes avec des annotations
spéciales dans la section `metadata`. Comme ce sont des fichiers template, vous
pouvez utiliser toutes les fonctionnalités habituelles des templates, y compris
la lecture de `.Values`, `.Release` et `.Template`.

Par exemple, ce template, stocké dans `templates/post-install-job.yaml`, déclare
un job à exécuter lors du `post-install` :

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
    # C'est ce qui définit cette ressource comme un hook. Sans cette ligne,
    # le job est considéré comme faisant partie de la release.
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

Ce qui fait de ce template un hook, c'est l'annotation :

```yaml
annotations:
  "helm.sh/hook": post-install
```

Une ressource peut implémenter plusieurs hooks :

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

De même, il n'y a pas de limite au nombre de ressources différentes pouvant
implémenter un hook donné. Par exemple, on pourrait déclarer à la fois un secret
et un config map comme hook de pre-install.

Lorsque des sous-charts déclarent des hooks, ceux-ci sont également évalués. Il
n'y a aucun moyen pour un chart parent de désactiver les hooks déclarés par les
sous-charts.

Il est possible de définir un poids pour un hook afin de construire un ordre
d'exécution déterministe. Les poids sont définis à l'aide de l'annotation suivante :

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

Les poids de hook peuvent être des nombres positifs ou négatifs, mais doivent être
représentés sous forme de chaînes de caractères. Lorsque Helm commence le cycle
d'exécution des hooks d'un type particulier, il trie ces hooks par ordre croissant.

### Politiques de suppression de hook

Il est possible de définir des politiques qui déterminent quand supprimer les
ressources de hook correspondantes. Les politiques de suppression de hook sont
définies à l'aide de l'annotation suivante :

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

Vous pouvez choisir une ou plusieurs valeurs d'annotation parmi celles définies :

| Valeur de l'annotation | Description                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- |
| `before-hook-creation` | Supprime la ressource précédente avant le lancement d'un nouveau hook (défaut) |
| `hook-succeeded`       | Supprime la ressource après l'exécution réussie du hook                        |
| `hook-failed`          | Supprime la ressource si le hook a échoué pendant l'exécution                  |

Si aucune annotation de politique de suppression de hook n'est spécifiée, le
comportement `before-hook-creation` s'applique par défaut.
