---
title: El archivo .helmignore
description: El archivo `.helmignore` se usa para especificar archivos que no desea incluir en su chart de Helm.
sidebar_position: 12
---

El archivo `.helmignore` se usa para especificar archivos que no desea incluir
en su chart de Helm.

Si este archivo existe, el comando `helm package` ignorará todos los archivos
que coincidan con el patrón especificado en el archivo `.helmignore` al
empaquetar su chart.

Esto puede ayudar a evitar que se agreguen archivos o directorios innecesarios
o sensibles en su chart de Helm.

El archivo `.helmignore` soporta coincidencia de patrones glob de shell Unix,
coincidencia de rutas relativas y negación (con prefijo !). Solo se considera
un patrón por línea.

Aquí hay un ejemplo de un archivo `.helmignore`:

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

Algunas diferencias notables con respecto a .gitignore:
- La sintaxis '**' no está soportada.
- La biblioteca de coincidencia de patrones es 'filepath.Match' de Go, no fnmatch(3)
- Los espacios finales siempre se ignoran (no hay secuencia de escape soportada)
- No hay soporte para '\!' como secuencia inicial especial.
- No se excluye a sí mismo de forma predeterminada, debe agregar una entrada explícita para `.helmignore`


**Nos encantaría su ayuda** para mejorar este documento. Para agregar, corregir
o eliminar información, [abra un issue](https://github.com/helm/helm-www/issues)
o envíenos un pull request.
