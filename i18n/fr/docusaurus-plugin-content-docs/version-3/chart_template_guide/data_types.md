---
title: "Annexe : Types de données Go et Templates"
description: Un bref aperçu des variables dans les templates.
sidebar_position: 16
---

Le langage de template Helm est implémenté dans le langage de programmation Go, qui est fortement typé. Pour cette raison, les variables dans les templates sont _typées_. Généralement, les variables seront exposées comme l'un des types suivants :

- string : une chaîne de texte
- bool : un `true` ou `false`
- int : une valeur entière (il existe également des variantes signées et non signées sur 8, 16, 32 et 64 bits)
- float64 : une valeur à virgule flottante sur 64 bits (il existe également des variantes sur 8, 16 et 32 bits)
- un slice d'octets (`[]byte`), souvent utilisé pour stocker des données (potentiellement) binaires
- struct : un objet avec des propriétés et des méthodes
- un slice (liste indexée) de l'un des types précédents
- une map indexée par des chaînes (`map[string]interface{}`) où la valeur est l'un des types précédents

Il existe de nombreux autres types en Go, et vous devrez parfois effectuer des conversions entre eux dans vos templates. La façon la plus simple de déboguer le type d'un objet est de le passer à travers `printf "%T"` dans un template, ce qui affichera le type. Consultez également les fonctions `typeOf` et `kindOf`.
