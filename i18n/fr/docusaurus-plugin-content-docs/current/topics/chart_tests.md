---
title: Tests de chart
description: Décrit comment exécuter et tester vos charts.
sidebar_position: 3
default_lang_commit: 2398582c5664d14efac9a7a7fc391725e575931a
---

Un chart contient un certain nombre de ressources et de composants Kubernetes qui
fonctionnent ensemble. En tant qu'auteur de chart, vous voudrez peut-être écrire
des tests qui vérifient que votre chart fonctionne comme prévu une fois installé.
Ces tests aident aussi les utilisateurs du chart à comprendre ce que celui-ci est
censé faire.

Un **test** dans un chart Helm se trouve dans le répertoire `templates/` : c'est
la définition d'une charge de travail (le plus souvent un Pod ou un Job) qui
indique un conteneur et la commande qu'il doit exécuter. Le conteneur doit se
terminer avec succès (exit 0) pour que le test soit considéré comme réussi. La
définition doit contenir l'annotation de hook de test Helm : `helm.sh/hook: test`.

Notez que jusqu'à Helm v3, la définition du Job devait contenir l'une de ces
annotations de hook de test Helm : `helm.sh/hook: test-success` ou
`helm.sh/hook: test-failure`. L'annotation `helm.sh/hook: test-success` est
toujours acceptée comme alternative rétrocompatible à `helm.sh/hook: test`.

Exemples de tests :

- Vérifier que la configuration de votre fichier values.yaml a bien été
  injectée.
  - Vérifier que votre nom d'utilisateur et votre mot de passe fonctionnent
  - Vérifier qu'un nom d'utilisateur et un mot de passe incorrects ne
    fonctionnent pas
- Vérifier que vos services sont opérationnels et répartissent correctement la charge
- etc.

Vous pouvez lancer les tests prédéfinis sur une release avec la commande
`helm test <RELEASE_NAME>`. Pour un utilisateur du chart, c'est un excellent
moyen de vérifier que sa release du chart (ou de l'application) fonctionne comme
prévu.

## Exemple de test {#example-test}

La commande [helm create](/helm/helm_create.md) crée automatiquement un certain
nombre de dossiers et de fichiers. Pour essayer la fonctionnalité de test de Helm,
créez d'abord un chart Helm de démonstration.

```console
$ helm create demo
```

Votre chart de démonstration a maintenant la structure suivante.

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

Dans `demo/templates/tests/test-connection.yaml`, vous trouverez un test à
essayer. Voici la définition du pod de test Helm :

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

## Lancer une suite de tests sur une release {#steps-to-run-a-test-suite-on-a-release}

Commencez par installer le chart sur votre cluster pour créer une release. Vous
devrez peut-être attendre que tous les pods soient actifs : si vous lancez le
test juste après l'installation, il risque d'échouer de façon passagère, et il
faudra alors le relancer.

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

## Remarques {#notes}

- Vous pouvez définir autant de tests que vous le souhaitez, dans un seul
  fichier YAML ou répartis dans plusieurs fichiers YAML du répertoire
  `templates/`.
- Vous pouvez tout à fait regrouper votre suite de tests dans un sous-répertoire
  `tests/`, comme `<chart-name>/templates/tests/`, pour mieux l'isoler.
- Un test est un [hook Helm](/topics/charts_hooks.md) : vous pouvez donc utiliser
  des annotations comme `helm.sh/hook-weight` et `helm.sh/hook-delete-policy` sur
  les ressources de test.
