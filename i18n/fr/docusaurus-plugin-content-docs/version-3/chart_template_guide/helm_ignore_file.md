---
title: Le fichier .helmignore
description: Le fichier `.helmignore` permet de spécifier les fichiers que vous ne souhaitez pas inclure dans votre chart Helm.
sidebar_position: 12
---

Le fichier `.helmignore` permet de spécifier les fichiers que vous ne souhaitez
pas inclure dans votre chart Helm.

Si ce fichier existe, la commande `helm package` ignorera tous les fichiers qui
correspondent aux motifs spécifiés dans le fichier `.helmignore` lors de
l'empaquetage de votre application.

Cela permet d'éviter l'ajout de fichiers ou répertoires inutiles ou sensibles
dans votre chart Helm.

Le fichier `.helmignore` prend en charge les motifs de type glob Unix,
la correspondance de chemins relatifs, et la négation (préfixée par !). Chaque
ligne ne doit contenir qu'un seul motif.

Voici un exemple de fichier `.helmignore` :

```
# comment

# Match any file or path named .helmignore
.helmignore

# Match any file or path named .git
.git

# Match any text file
*.txt

# Match only directories named mydir
mydir/

# Match only text files in the top-level directory
/*.txt

# Match only the file foo.txt in the top-level directory
/foo.txt

# Match any file named ab.txt, ac.txt, or ad.txt
a[b-d].txt

# Match any file under subdir matching temp*
*/temp*

*/*/temp*
temp?
```

Quelques différences notables par rapport à .gitignore :
- La syntaxe '**' n'est pas prise en charge.
- La bibliothèque de correspondance utilisée est 'filepath.Match' de Go, et non fnmatch(3).
- Les espaces en fin de ligne sont toujours ignorés (aucune séquence d'échappement n'est prise en charge).
- Il n'y a pas de prise en charge de '\!' comme séquence spéciale de début de ligne.
- Le fichier ne s'exclut pas lui-même par défaut ; vous devez ajouter une entrée explicite pour `.helmignore`.


**Vous pouvez nous aider** à améliorer ce document. Pour ajouter, corriger ou supprimer
des informations, [créez un ticket](https://github.com/helm/helm-www/issues) ou envoyez-nous une
pull request.
