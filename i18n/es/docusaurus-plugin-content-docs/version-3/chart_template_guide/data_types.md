---
title: "Apéndice: Tipos de datos de Go y plantillas"
description: Un resumen rápido sobre las variables en las plantillas.
sidebar_position: 16
---

El lenguaje de plantillas de Helm está implementado en Go, un lenguaje de
programación fuertemente tipado. Por esta razón, las variables en las plantillas
tienen _tipos_. En la mayoría de los casos, las variables se expondrán como uno
de los siguientes tipos:

- string: Una cadena de texto
- bool: un valor `true` o `false`
- int: Un valor entero (también existen variantes de 8, 16, 32 y 64 bits con y
  sin signo)
- float64: un valor de punto flotante de 64 bits (también existen variantes de
  8, 16 y 32 bits)
- un slice de bytes (`[]byte`), que se usa frecuentemente para almacenar datos
  (potencialmente) binarios
- struct: un objeto con propiedades y métodos
- un slice (lista indexada) de cualquiera de los tipos anteriores
- un map con claves de tipo string (`map[string]interface{}`) donde el valor es
  cualquiera de los tipos anteriores

Existen muchos otros tipos en Go, y a veces será necesario convertir entre ellos
en las plantillas. La forma más fácil de depurar el tipo de un objeto es pasarlo
a través de `printf "%T"` en una plantilla, lo que imprimirá el tipo. También
puede consultar las funciones `typeOf` y `kindOf`.
