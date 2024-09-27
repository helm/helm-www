---
title: "Fichier .helmignore"
description: "Le fichier `.helmignore` est utilisé pour spécifier les fichiers que vous ne souhaitez pas inclure dans votre graphique Helm"
weight: 12
---

Le fichier `.helmignore` est utilisé pour spécifier les fichiers que vous ne souhaitez pas inclure dans votre graphique Helm.

Si ce fichier existe, la commande `helm package` ignorera tous les fichiers qui correspondent aux motifs spécifiés dans le fichier `.helmignore` lors de l'emballage de votre application.

Cela peut aider à éviter que des fichiers ou des répertoires inutiles ou sensibles ne soient ajoutés à votre chart Helm.

Le fichier `.helmignore` prend en charge la correspondance de motifs de type glob Unix, la correspondance de chemins relatifs et la négation (préfixée par !). Seul un motif par ligne est pris en compte.

Voici un exemple de fichier `.helmignore` :

Voici la traduction des commentaires du fichier `.helmignore` :

```
# Commentaire

# Correspond à tout fichier ou chemin nommé .helmignore
.helmignore

# Correspond à tout fichier ou chemin nommé .git
.git

# Correspond à tout fichier texte
*.txt

# Correspond uniquement aux répertoires nommés mydir
mydir/

# Correspond uniquement aux fichiers texte dans le répertoire de premier niveau
/*.txt

# Correspond uniquement au fichier foo.txt dans le répertoire de premier niveau
/foo.txt

# Correspond à tout fichier nommé ab.txt, ac.txt ou ad.txt
a[b-d].txt

# Correspond à tout fichier sous un sous-répertoire correspondant à temp*
*/temp*

# Correspond à tout fichier sous n'importe quel sous-répertoire se terminant par temp
*/*/temp*
temp?
```

Quelques différences notables par rapport à `.gitignore` :
- La syntaxe `**` n'est pas prise en charge.
- La bibliothèque de correspondance utilise `filepath.Match` de Go, et non `fnmatch(3)`.
- Les espaces à la fin sont toujours ignorés (il n'y a pas de séquence d'échappement prise en charge).
- Il n'y a pas de support pour `\!` en tant que séquence spéciale de début.
- Il ne s'exclut pas par défaut ; vous devez ajouter une entrée explicite pour `.helmignore`.

**Nous aimerions votre aide** pour améliorer ce document. Pour ajouter, corriger ou supprimer des informations, [signalez un problème](https://github.com/helm/helm-www/issues) ou envoyez-nous une demande de pull request.
