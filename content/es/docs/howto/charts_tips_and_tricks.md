---
title: "Consejos y Trucos para el Desarrollo de Charts"
description: "Covers some of the tips and tricks Helm chart developers have learned while building production-quality charts."
description: "Cubre algunos de los consejos y trucos que los desarrolladores de charts de Helm han aprendido al crear charts con calidad de producción."
weight: 1
---

Esta guía cubre algunos de los consejos y trucos que los desarrolladores de charts
de Helm han aprendido al crear charts con calidad de producción.

## Conozca las funciones de plantilla

Helm usa [plantillas Go](https://godoc.org/text/template) para crear plantillas
para sus archivos de recursos. Si bien Go incluye varias funciones integradas,
hemos agregado muchas otras.

Primero, agregamos todas las funciones en la [biblioteca
Sprig](https://masterminds.github.io/sprig/).

También agregamos dos funciones de plantilla especiales: `include` y
`required`. La función `include` le permite traer otra plantilla y luego pasar
los resultados a otras funciones de la plantilla.

Por ejemplo, este fragmento de plantilla incluye una plantilla llamada `mytpl`,
luego pone el resultado en minúsculas y luego lo envuelve entre comillas dobles.

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

La función `required` le permite declarar una entrada de valores particulares según
sea necesario para la representación de la plantilla. Si el valor está vacío,
la representación de la plantilla fallará con un mensaje de error enviado al
usuario.

The following example of the `required` function declares an entry for
.Values.who is required, and will print an error message when that entry is
missing:

El siguiente ejemplo de la función `required` declara que una entrada para
.Values.who es obligatoria e imprimirá un mensaje de error cuando falte esa entrada:

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## Envuelve en comillas Candeas, no Enteros

Cuando trabaja con cadenas de carácteres, siempre es más seguro envolverlas entre
comillas dobles que dejarlas como palabras sueltas:

```yaml
name: {{ .Values.MyName | quote }}
```

Pero cuando trabaje con números enteros, _no envuelva entre comillas dobles los
valores._ Eso puede, en muchos casos, causar errores de análisis dentro de Kubernetes.

```yaml
port: {{ .Values.Port }}
```

Esta observación no se aplica a los valores de las variables de entorno que se espera
que sean cadenas, incluso si representan números enteros:

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## Utilizar la Función 'include'

Go proporciona una forma de incluir una plantilla en otra utilizando la directiva
incorporada `template`. Sin embargo, la directiva incorporada no se puede utilizar
en las canalizaciones de plantilla de Go.

Para que sea posible incluir una plantilla y luego realizar una operación en la
salida de esa plantilla, Helm tiene una función `include` especial:

```
{{ include "toYaml" $value | indent 2 }}
```

Lo anterior incluye una plantilla llamada `toYaml`, le pasa `$value` y luego pasa
la salida de esa plantilla a la función `indent`.

Debido a que YAML atribuye importancia a los niveles de sangría y los espacios
en blanco, esta es una excelente manera de incluir fragmentos de código, pero
manejar la sangría en un contexto relevante.

## Utilizar la Función 'required'

Go proporciona una forma de configurar opciones de plantilla para controlar el
comportamiento cuando un mapa se indexa con una clave que no está presente en el
mapa. Por lo general, esto se establece con `template.Options("missingkey=option")`,
donde `option` puede ser `default`, `zero` o `error`. Si bien establecer esta opción
en error detendrá la ejecución con un error, esto se aplicaría a todas las claves
que faltan en el mapa. Puede haber situaciones en las que un desarrollador de charts
quiera aplicar este comportamiento para valores seleccionados en el archivo `values.yaml`.

La función `required` brinda a los desarrolladores la capacidad de declarar una
entrada de valor según sea necesario para la renderización de la plantilla. Si
la entrada está vacía en `values.yaml`, la plantilla no se procesará y devolverá
un mensaje de error proporcionado por el desarrollador.

Por ejemplo:

```
{{ required "A valid foo is required!" .Values.foo }}
```

Lo anterior renderizará la plantilla cuando se defina `.Values.foo`, pero fallará
en renderizar y se cerrará cuando `.Values.foo` no esté definido.

## Utilizar la Función 'tpl'

The `tpl` function allows developers to evaluate strings as templates inside a
template. This is useful to pass a template string as a value to a chart or
render external configuration files. Syntax: `{{ tpl TEMPLATE_STRING VALUES }}`

La función `tpl` permite a los desarrolladores evaluar cadenas como plantillas
dentro de una plantilla. Esto es útil para pasar una cadena de plantilla como
valor a un chart o representar archivos de configuración externos. Sintaxis:
`{{tpl TEMPLATE_STRING VALUES}}`

Ejemplos:

```yaml
# valores
template: "{{ .Values.name }}"
name: "Tom"

# plantilla
{{ tpl .Values.template . }}

# salida
Tom
```

Renderizar un archivo de configuración externo:

```yaml
# archivo de configuración externo conf/app.conf
firstName={{ .Values.firstName }}
lastName={{ .Values.lastName }}

# valores
firstName: Peter
lastName: Parker

# plantilla
{{ tpl (.Files.Get "conf/app.conf") . }}

# salida
firstName=Peter
lastName=Parker
```

## Creando Image Pull Secrets

Los Image Pull Secrets son esencialmente una combinación de _registro_,
_username_ y _password_. Es posible que los necesite en una aplicación que está
implementando, pero para crearlos es necesario ejecutar `base64` un par de veces.
Podemos escribir una plantilla auxiliar para componer el archivo de configuración
de Docker y usarlo como carga útil del Secret. Aquí hay un ejemplo:

Primero, suponga que las credenciales están definidas en el archivo `values.yaml`
así:

```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

Luego definimos nuestra plantilla auxiliar de la siguiente manera:

```
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":\"%s\",\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username .password .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

Finalmente, usamos la plantilla auxiliar en una plantilla más grande para crear
el manifiesto del Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## Despliegue de Deployments Automáticamente

Often times ConfigMaps or Secrets are injected as configuration files in
containers or there are other external dependency changes that require rolling
pods. Depending on the application a restart may be required should those be
updated with a subsequent `helm upgrade`, but if the deployment spec itself
didn't change the application keeps running with the old configuration resulting
in an inconsistent deployment.

A menudo, los ConfigMaps o Secrets se inyectan como archivos de configuración en
contenedores o hay otros cambios de dependencia externa que requieren recrear pods.
Dependiendo de la aplicación, es posible que sea necesario reiniciar si se actualizan
con un `helm upgrade` posterior, pero si el Deployments Spec en sí no cambia, la
aplicación sigue ejecutándose con la configuración anterior, lo que da como resultado
un despliegue inconsistente.

La función `sha256sum` se puede utilizar para garantizar que la sección de
anotaciones de una implementación se actualice si cambia otro archivo:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

En el caso de que siempre desee lanzar su Deployment, puede usar un paso de anotación
similar al anterior, en lugar de reemplazarlo con una cadena aleatoria para que siempre
cambie y haga que la implementación se lance:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

Cada invocación de la función de plantilla generará una cadena aleatoria única.
Esto significa que si es necesario sincronizar las cadenas aleatorias utilizadas
por varios recursos, todos los recursos relevantes deberán estar en el mismo
archivo de plantilla.

Ambos métodos permiten que su Deployment aproveche la lógica de la estrategia
de actualización incorporada para evitar tener tiempo de inactividad.

NOTA: En el pasado, recomendamos usar la marca `--recreate-pods` como otra opción.
Esta bandera se ha marcado como obsoleta en Helm 3 a favor del método más 
declarativo anterior.

## Dígale a Helm que No Desinstale un Recurso

A veces hay recursos que no deben desinstalarse cuando Helm ejecuta un
`helm uninstall`. Los desarrolladores de charts pueden agregar una anotación
a un recurso para evitar que se desinstale.

```yaml
kind: Secret
metadata:
  annotations:
    "helm.sh/resource-policy": keep
[...]
```

(Se requieren comillas)

La anotación `"helm.sh/resource-policy": keep` indica a Helm que omita la
eliminación de este recurso cuando una operación de helm (como `helm uninstall`,
`helm upgrade` o `helm rollback`) resulte en su eliminación. _Sin embargo_, este
recurso queda huérfano. Helm ya no lo administrará de ninguna manera. Esto puede
ocasionar problemas si se usa `helm install --replace` en una versión que ya se
ha desinstalado, pero que ha conservado los recursos.

## Utilizar "Parciales" (Partials) e Incluir Plantillas

A veces, desea crear algunas partes reutilizables en tus charts, ya sean bloques
o parciales de plantilla. Y, a menudo, es más limpio mantenerlos en sus propios archivos.

En el directorio `templates /`, no se espera que ningún archivo que comience con
un guión bajo (`_`) genere un archivo de manifiesto de Kubernetes. Entonces, por
convención, las plantillas auxiliares y los parciales se colocan en un archivo
`_helpers.tpl`.

## Charts Complejos con Muchas Dependencias

Muchos de los charts de [Artifact Hub](https://artifacthub.io/packages/search?kind=0)
de la CNCF son "bloques de construcción" para crear aplicaciones más avanzadas.
Pero los charts pueden usarse para crear instancias de aplicaciones a gran escala.
En tales casos, un solo chart general puede tener múltiples sub-charts, cada uno
de los cuales funciona como una parte del todo.

The current best practice for composing a complex application from discrete
parts is to create a top-level umbrella chart that exposes the global
configurations, and then use the `charts/` subdirectory to embed each of the
components.

La mejor práctica actual para componer una aplicación compleja a partir de partes
discretas es crear un chart general de nivel superior que exponga las configuraciones
globales, y luego usar el subdirectorio `charts/` para incrustar cada uno de los
componentes.

## YAML es un Superconjunto de JSON

Según la especificación YAML, YAML es un superconjunto de JSON. Eso significa que
cualquier estructura JSON válida debería ser válida en YAML.

Esto tiene una ventaja: a veces, a los desarrolladores de plantillas les puede
resultar más fácil expresar una estructura de datos con una sintaxis similar a
JSON en lugar de lidiar con la sensibilidad de los espacios en blanco de YAML.

Como práctica recomendada, las plantillas deben seguir una sintaxis similar a YAML,
_a menos que_ la sintaxis JSON reduzca sustancialmente el riesgo de problemas de
formato.

## Tenga Cuidado con la Generación de Valores Aleatorios

Hay funciones en Helm que le permiten generar datos aleatorios,
claves criptográficas, etc. Está bien usarlos. Pero tenga en cuenta que durante
las actualizaciones, las plantillas se vuelven a ejecutar. Cuando la ejecución de
una plantilla genera datos que difieren de la última ejecución, se activará una
actualización de ese recurso.

## Instalar o Actualizar un Release con un Comando

Helm proporciona una forma de realizar una instalación o actualización como un solo
comando. Utilice `helm upgrade` con el comando `--install`. Esto hará que Helm vea
si la versión ya está instalada. De lo contrario, ejecutará una instalación. Si es
así, se actualizará el Release existente.

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
