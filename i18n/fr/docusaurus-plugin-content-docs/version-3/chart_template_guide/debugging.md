---
title: Débogage des templates
description: Dépannage des charts dont le déploiement échoue.
sidebar_position: 13
---

Le débogage des templates peut être délicat, car les templates rendus sont envoyés au serveur d'API Kubernetes, qui peut rejeter les fichiers YAML pour des raisons autres que le formatage.

Voici quelques commandes utiles pour le débogage.

- `helm lint` est votre outil de référence pour vérifier que votre chart respecte les bonnes pratiques
- `helm template --debug` permet de tester le rendu des templates de chart localement.
- `helm install --dry-run --debug` effectue également le rendu de votre chart localement sans l'installer, mais vérifie aussi si des ressources en conflit sont déjà en cours d'exécution sur le cluster. L'option `--dry-run=server` permet en plus d'exécuter toute fonction `lookup` de votre chart vers le serveur.
- `helm get manifest` : C'est un bon moyen de voir quels templates sont installés sur le serveur.

Lorsque votre fichier YAML ne parvient pas à être analysé, mais que vous souhaitez voir ce qui est généré, un moyen simple de récupérer le YAML est de commenter la section problématique dans le template, puis de relancer `helm install --dry-run --debug` :

```yaml
apiVersion: v2
# some: problem section
# {{ .Values.foo | quote }}
```

Le code ci-dessus sera rendu et retourné avec les commentaires intacts :

```yaml
apiVersion: v2
# some: problem section
#  "bar"
```

Cela permet de visualiser rapidement le contenu généré sans être bloqué par des erreurs d'analyse YAML.
