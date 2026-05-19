---
title: "Apéndice: Técnicas de YAML"
description: Una mirada más detallada a la especificación YAML y cómo se aplica a Helm.
sidebar_position: 15
---

La mayor parte de esta guía se ha centrado en escribir el lenguaje de plantillas.
Aquí veremos el formato YAML. YAML tiene algunas características útiles que
nosotros, como autores de plantillas, podemos usar para hacer nuestras plantillas
menos propensas a errores y más fáciles de leer.

## Escalares y Colecciones

Según la [especificación YAML](https://yaml.org/spec/1.2/spec.html), hay dos
tipos de colecciones y muchos tipos escalares.

Los dos tipos de colecciones son mapas y secuencias:

```yaml
map:
  one: 1
  two: 2
  three: 3

sequence:
  - one
  - two
  - three
```

Los valores escalares son valores individuales (a diferencia de las colecciones)

### Tipos Escalares en YAML

En el dialecto de YAML de Helm, el tipo de dato escalar de un valor se determina
por un conjunto complejo de reglas, incluyendo el esquema de Kubernetes para las
definiciones de recursos. Pero al inferir tipos, las siguientes reglas tienden
a aplicarse.

Si un entero o flotante es una palabra sin comillas, normalmente se trata como
un tipo numérico:

```yaml
count: 1
size: 2.34
```

Pero si están entre comillas, se tratan como cadenas:

```yaml
count: "1" # <-- cadena, no int
size: '2.34' # <-- cadena, no float
```

Lo mismo aplica para los booleanos:

```yaml
isGood: true   # bool
answer: "true" # cadena
```

El valor nulo se representa como `null` (no `nil`).

Tenga en cuenta que `port: "80"` es YAML válido y pasará tanto por el motor de
plantillas como por el analizador YAML, pero fallará si Kubernetes espera que
`port` sea un entero.

En algunos casos, puede forzar una inferencia de tipo particular usando etiquetas
de nodo YAML:

```yaml
coffee: "yes, please"
age: !!str 21
port: !!int "80"
```

En el ejemplo anterior, `!!str` le dice al analizador que `age` es una cadena,
aunque parezca un int. Y `port` se trata como un int, aunque esté entre comillas.


## Cadenas en YAML

Gran parte de los datos que colocamos en documentos YAML son cadenas. YAML tiene
más de una forma de representar una cadena. Esta sección explica las formas y
demuestra cómo usar algunas de ellas.

Hay tres formas "en línea" de declarar una cadena:

```yaml
way1: bare words
way2: "double-quoted strings"
way3: 'single-quoted strings'
```

Todos los estilos en línea deben estar en una sola línea.

- Las palabras sin comillas no están entre comillas y no se escapan. Por esta
  razón, debe tener cuidado con los caracteres que usa.
- Las cadenas entre comillas dobles pueden tener caracteres específicos escapados
  con `\`. Por ejemplo `"\"Hello\", she said"`. Puede escapar saltos de línea con `\n`.
- Las cadenas entre comillas simples son cadenas "literales" y no usan `\` para
  escapar caracteres. La única secuencia de escape es `''`, que se decodifica
  como una sola `'`.

Además de las cadenas de una línea, puede declarar cadenas multilínea:

```yaml
coffee: |
  Latte
  Cappuccino
  Espresso
```

El ejemplo anterior trata el valor de `coffee` como una sola cadena equivalente
a `Latte\nCappuccino\nEspresso\n`.

Tenga en cuenta que la primera línea después de `|` debe tener la indentación
correcta. Podríamos causar un error en el ejemplo anterior haciendo esto:

```yaml
coffee: |
         Latte
  Cappuccino
  Espresso

```

Como `Latte` tiene una indentación incorrecta, obtendríamos un error como este:

```
Error parsing file: error converting YAML to JSON: yaml: line 7: did not find expected key
```

En las plantillas, a veces es más seguro poner una "primera línea" falsa de
contenido en un documento multilínea solo para protegerse del error anterior:

```yaml
coffee: |
  # Commented first line
         Latte
  Cappuccino
  Espresso

```

Tenga en cuenta que cualquiera que sea esa primera línea, se conservará en la
salida de la cadena. Entonces, si está usando esta técnica para inyectar el
contenido de un archivo en un ConfigMap, el comentario debe ser del tipo
esperado por lo que esté leyendo esa entrada.

### Control de Espacios en Cadenas Multilínea

En el ejemplo anterior, usamos `|` para indicar una cadena multilínea. Pero
observe que el contenido de nuestra cadena fue seguido por un `\n` final. Si
queremos que el procesador YAML elimine el salto de línea final, podemos agregar
un `-` después del `|`:

```yaml
coffee: |-
  Latte
  Cappuccino
  Espresso
```

Ahora el valor de `coffee` será: `Latte\nCappuccino\nEspresso` (sin `\n` final).

Otras veces, podríamos querer que se conserven todos los espacios en blanco
finales. Podemos hacer esto con la notación `|+`:

```yaml
coffee: |+
  Latte
  Cappuccino
  Espresso


another: value
```

Ahora el valor de `coffee` será `Latte\nCappuccino\nEspresso\n\n\n`.

La indentación dentro de un bloque de texto se conserva, y también resulta en
la conservación de los saltos de línea:

```yaml
coffee: |-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

En el caso anterior, `coffee` será `Latte\n  12 oz\n  16
oz\nCappuccino\nEspresso`.

### Indentación y Plantillas

Al escribir plantillas, es posible que desee inyectar el contenido de un archivo
en la plantilla. Como vimos en capítulos anteriores, hay dos formas de hacer esto:

- Use `{{ .Files.Get "FILENAME" }}` para obtener el contenido de un archivo en
  el chart.
- Use `{{ include "TEMPLATE" . }}` para renderizar una plantilla y luego colocar
  su contenido en el chart.

Al insertar archivos en YAML, es bueno entender las reglas de multilínea
anteriores. A menudo, la forma más fácil de insertar un archivo estático es
hacer algo como esto:

```yaml
myfile: |
{{ .Files.Get "myfile.txt" | indent 2 }}
```

Observe cómo hacemos la indentación anterior: `indent 2` le dice al motor de
plantillas que indente cada línea en "myfile.txt" con dos espacios. Tenga en
cuenta que no indentamos esa línea de plantilla. Eso es porque si lo hiciéramos,
el contenido del archivo de la primera línea estaría indentado dos veces.

### Cadenas Multilínea Plegadas (Folded)

A veces quiere representar una cadena en su YAML con múltiples líneas, pero
quiere que se trate como una sola línea larga cuando se interprete. A esto se
le llama "folding" (plegado). Para declarar un bloque plegado, use `>` en lugar de `|`:

```yaml
coffee: >
  Latte
  Cappuccino
  Espresso


```

El valor de `coffee` anterior será `Latte Cappuccino Espresso\n`. Tenga en
cuenta que todos los saltos de línea excepto el último se convertirán en
espacios. Puede combinar los controles de espacios en blanco con el marcador
de texto plegado, así que `>-` reemplazará o recortará todos los saltos de línea.

Tenga en cuenta que en la sintaxis plegada, indentar texto hará que las líneas
se conserven.

```yaml
coffee: >-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

Lo anterior producirá `Latte\n  12 oz\n  16 oz\nCappuccino Espresso`. Observe
que tanto los espacios como los saltos de línea siguen ahí.

## Incrustando Múltiples Documentos en Un Archivo

Es posible colocar más de un documento YAML en un solo archivo. Esto se hace
prefijando un nuevo documento con `---` y terminando el documento con `...`

```yaml

---
document: 1
...
---
document: 2
...
```

En muchos casos, se puede omitir ya sea `---` o `...`.

Algunos archivos en Helm no pueden contener más de un documento. Si, por ejemplo,
se proporciona más de un documento dentro de un archivo `values.yaml`, solo se
usará el primero.

Sin embargo, los archivos de plantilla pueden tener más de un documento. Cuando
esto sucede, el archivo (y todos sus documentos) se trata como un objeto durante
el renderizado de la plantilla. Pero luego el YAML resultante se divide en
múltiples documentos antes de enviarse a Kubernetes.

Recomendamos usar múltiples documentos por archivo solo cuando sea absolutamente
necesario. Tener múltiples documentos en un archivo puede ser difícil de depurar.

## YAML es un Superconjunto de JSON

Debido a que YAML es un superconjunto de JSON, cualquier documento JSON válido
_debería_ ser YAML válido.

```json
{
  "coffee": "yes, please",
  "coffees": [
    "Latte", "Cappuccino", "Espresso"
  ]
}
```

Lo anterior es otra forma de representar esto:

```yaml
coffee: yes, please
coffees:
- Latte
- Cappuccino
- Espresso
```

Y los dos se pueden mezclar (con cuidado):

```yaml
coffee: "yes, please"
coffees: [ "Latte", "Cappuccino", "Espresso"]
```

Los tres deberían analizarse en la misma representación interna.

Si bien esto significa que archivos como `values.yaml` pueden contener datos
JSON, Helm no trata la extensión de archivo `.json` como un sufijo válido.

## Anclas YAML

La especificación YAML proporciona una forma de almacenar una referencia a un
valor y luego referirse a ese valor por referencia. YAML llama a esto "anclaje":

```yaml
coffee: "yes, please"
favorite: &favoriteCoffee "Cappuccino"
coffees:
  - Latte
  - *favoriteCoffee
  - Espresso
```

En lo anterior, `&favoriteCoffee` establece una referencia a `Cappuccino`. Más
tarde, esa referencia se usa como `*favoriteCoffee`. Entonces `coffees` se
convierte en `Latte, Cappuccino, Espresso`.

Si bien hay algunos casos donde las anclas son útiles, hay un aspecto de ellas
que puede causar errores sutiles: La primera vez que se consume el YAML, la
referencia se expande y luego se descarta.

Entonces, si decodificáramos y luego recodificáramos el ejemplo anterior, el
YAML resultante sería:

```yaml
coffee: yes, please
favorite: Cappuccino
coffees:
- Latte
- Cappuccino
- Espresso
```

Debido a que Helm y Kubernetes a menudo leen, modifican y luego reescriben
archivos YAML, las anclas se perderán.
