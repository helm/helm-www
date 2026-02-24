---
title: Tests de chart
description: Décrit comment exécuter et tester vos charts.
sidebar_position: 3
---

Un chart contient de nombreuses ressources et composants Kubernetes qui
fonctionnent ensemble. En tant qu'auteur de chart, vous souhaiterez peut-être
écrire des tests pour valider que votre chart fonctionne comme prévu lors de
son installation. Ces tests aident également les utilisateurs du chart à
comprendre ce que celui-ci est censé faire.

Un **test** dans un chart Helm se trouve dans le répertoire `templates/` et
consiste en une définition de Job spécifiant un conteneur avec une commande
donnée à exécuter. Le conteneur doit se terminer avec succès (exit 0) pour que
le test soit considéré comme réussi. La définition du Job doit contenir
l'annotation de hook de test Helm : `helm.sh/hook: test`.

Notez que jusqu'à Helm v3, la définition du Job devait contenir l'une de ces
annotations de hook de test Helm : `helm.sh/hook: test-success` ou
`helm.sh/hook: test-failure`. L'annotation `helm.sh/hook: test-success` est
toujours acceptée comme alternative rétrocompatible à `helm.sh/hook: test`.

Exemples de tests :

- Valider que votre configuration provenant du fichier values.yaml a été
  correctement injectée.
  - Vérifier que votre nom d'utilisateur et votre mot de passe fonctionnent
    correctement
  - Vérifier qu'un nom d'utilisateur et un mot de passe incorrects ne
    fonctionnent pas
- Vérifier que vos services sont opérationnels et répartissent correctement
  la charge
- etc.

Vous pouvez exécuter les tests prédéfinis dans Helm sur une release à l'aide de
la commande `helm test <RELEASE_NAME>`. C'est un excellent moyen pour les
utilisateurs de vérifier que leur release d'un chart (ou application)
fonctionne comme prévu.

## Exemple de test

La commande [helm create](/helm/helm_create.md) crée automatiquement un certain
nombre de dossiers et fichiers. Pour essayer la fonctionnalité de test Helm,
créez d'abord un chart de démonstration.

```console
$ helm create demo
```

Vous verrez maintenant la structure suivante dans votre chart de démonstration.

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

Dans `demo/templates/tests/test-connection.yaml`, vous trouverez un test que
vous pouvez essayer. Voici la définition du pod de test Helm :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "demo.fullname" . }}-test-connection"
  labels:
    {{- include "demo.labels" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "demo.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never

```

## Étapes pour exécuter une suite de tests sur une release

Tout d'abord, installez le chart sur votre cluster pour créer une release. Vous
devrez peut-être attendre que tous les pods deviennent actifs ; si vous lancez
le test immédiatement après l'installation, un échec transitoire est probable,
et vous voudrez relancer le test.

```console
$ helm install demo demo --namespace default
$ helm test demo
NAME: demo
LAST DEPLOYED: Mon Feb 14 20:03:16 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     demo-test-connection
Last Started:   Mon Feb 14 20:35:19 2022
Last Completed: Mon Feb 14 20:35:23 2022
Phase:          Succeeded
[...]
```

## Notes

- Vous pouvez définir autant de tests que vous le souhaitez dans un seul fichier
  yaml ou les répartir dans plusieurs fichiers yaml dans le répertoire
  `templates/`.
- Vous pouvez placer votre suite de tests dans un sous-répertoire `tests/` comme
  `<nom-du-chart>/templates/tests/` pour plus d'isolation.
- Un test est un [hook Helm](/topics/charts_hooks.md), donc les annotations telles
  que `helm.sh/hook-weight` et `helm.sh/hook-delete-policy` peuvent être utilisées
  avec les ressources de test.
