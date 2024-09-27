---
title: "Déboguer les modèles."
description: "Résolution des problèmes des charts qui échouent à se déployer"
weight: 13
---

Déboguer les modèles peut être délicat, car les modèles rendus sont envoyés au serveur API Kubernetes, qui peut rejeter les fichiers YAML pour des raisons autres que le formatage.

Il existe quelques commandes qui peuvent vous aider à déboguer :

- `helm lint` est votre outil de référence pour vérifier que votre chart suit les meilleures pratiques.
- `helm template --debug` testera le rendu des modèles de chart localement.
- `helm install --dry-run --debug` rendra également votre chart localement sans l'installer, mais vérifiera aussi si des ressources conflictuelles sont déjà en cours d'exécution sur le cluster. En définissant `--dry-run=server`, il exécutera également toute opération `lookup` dans votre chart vers le serveur.
- `helm get manifest` : C'est un bon moyen de voir quels modèles sont installés sur le serveur.

Lorsque votre YAML échoue à se parser, mais que vous souhaitez voir ce qui est généré, une manière simple de récupérer le YAML est de commenter la section problématique dans le modèle, puis de relancer `helm install --dry-run --debug` :

```yaml
apiVersion: v2
# some: problem section
# {{ .Values.foo | quote }}
```

Ce qui précède sera rendu et renvoyé avec les commentaires intacts :

```yaml
apiVersion: v2
# some: problem section
#  "bar"
```

Cela fournit un moyen rapide de visualiser le contenu généré sans que les erreurs de parsing YAML ne bloquent.
