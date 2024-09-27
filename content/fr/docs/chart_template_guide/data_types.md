---
title: "Annexe : Types de données Go et modèles."
description: "Un aperçu rapide sur les variables dans les modèles"
weight: 16
---

Le langage des modèles Helm est implémenté dans le langage de programmation Go, qui est fortement typé. Pour cette raison, les variables dans les modèles sont _typées_. Dans l'ensemble, les variables seront exposées comme l'un des types suivants :

- string : Une chaîne de texte
- bool : un `true` ou `false`
- int : Une valeur entière (il existe également des variantes signées et non signées de 8, 16, 32 et 64 bits)
- float64 : Une valeur à virgule flottante de 64 bits (il existe également des variétés de 8, 16 et 32 bits)
- un tableau d'octets (`[]byte`), souvent utilisé pour contenir des données (potentiellement) binaires
- struct : un objet avec des propriétés et des méthodes
- un slice (liste indexée) d'un des types précédents
- une map avec des clés de type chaîne (`map[string]interface{}`) où la valeur est l'un des types précédents

Il existe de nombreux autres types en Go, et il vous faudra parfois convertir entre eux dans vos modèles. La façon la plus simple de déboguer le type d'un objet est de le passer à travers `printf "%t"` dans un modèle, ce qui imprimera le type. Consultez également les fonctions `typeOf` et `kindOf`.
