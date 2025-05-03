---
title: "Tests de Chart"
description: "Décrit comment exécuter et tester vos charts"
weight: 3
---

Un chart contient un certain nombre de ressources et de composants Kubernetes qui fonctionnent ensemble. En tant qu'auteur de chart, vous pouvez vouloir écrire des tests pour valider que votre chart fonctionne comme prévu lors de son installation. Ces tests aident également l'utilisateur du chart à comprendre ce que votre chart est censé faire.

Un **test** dans un chart Helm se trouve dans le répertoire `templates/` et est une définition de job qui spécifie un conteneur avec une commande à exécuter. Le conteneur doit se terminer avec succès (exit 0) pour que le test soit considéré comme réussi. La définition du job doit contenir l'annotation du hook de test Helm : `helm.sh/hook: test`.

Notez que jusqu'à Helm v3, la définition du job devait contenir l'une de ces annotations de hook de test : `helm.sh/hook: test-success` ou `helm.sh/hook: test-failure`. L'annotation `helm.sh/hook: test-success` est toujours acceptée comme alternative rétrocompatible à `helm.sh/hook: test`.

Exemple de tests :

- Valider que votre configuration du fichier values.yaml a été correctement injectée.
  - Assurez-vous que votre nom d'utilisateur et mot de passe fonctionnent correctement.
  - Vérifiez qu'un nom d'utilisateur ou mot de passe incorrect ne fonctionne pas.
- Vérifier que vos services sont actifs et assurent correctement l'équilibrage de charge.
- etc.

Vous pouvez exécuter les tests prédéfinis dans Helm sur une release en utilisant la commande `helm test <NOM_DE_LA_RELEASE>`. Pour l'utilisateur d'un chart, c'est un excellent moyen de vérifier que la release de son chart (ou application) fonctionne comme prévu.

## Exemple de test

La commande [helm create]({{< ref "/docs/helm/helm_create.md" >}}) créera automatiquement un certain nombre de dossiers et de fichiers. Pour essayer la fonctionnalité de test Helm, commencez par créer un chart Helm de démonstration.

```console
$ helm create demo
```

Vous pourrez maintenant voir la structure suivante dans votre chart Helm de démonstration.

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

Dans `demo/templates/tests/test-connection.yaml`, vous trouverez un test que vous pouvez essayer. Vous pouvez voir la définition du pod de test Helm ici :

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

Tout d'abord, installez le chart sur votre cluster pour créer une release. Vous devrez peut-être attendre que tous les pods deviennent actifs ; si vous testez immédiatement après cette installation, il est probable que vous rencontriez un échec transitoire, et vous devrez refaire le test.

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

- Vous pouvez définir autant de tests que vous le souhaitez dans un seul fichier yaml ou les répartir dans plusieurs fichiers yaml dans le répertoire `templates/`.
- Vous êtes libre de regrouper votre suite de tests sous un répertoire `tests/`, comme `<chart-name>/templates/tests/`, pour une meilleure isolation.
- Un test est un [hook Helm]({{< ref "/docs/topics/charts_hooks.md" >}}), donc des annotations telles que `helm.sh/hook-weight` et `helm.sh/hook-delete-policy` peuvent être utilisées avec les ressources de test.
