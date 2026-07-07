---
title: "Ganchos de Chart"
description: "Describe como trabajar con ganchos de chart."
weight: 2
---

Helm proporciona un mecanismo de _gancho_ (hook) que permite a los desarrolladores
de charts intervenir en determinados puntos del ciclo de vida de un release. Por
ejemplo, puede utilizar ganchos para:

- Cargue un ConfigMap o un Secret durante la instalación antes de que se carguen
  otros charts.
- Ejecute un trabajo para hacer una copia de seguridad de una base de datos antes
  de instalar un nuevo chart y luego ejecute un segundo trabajo después de la
  actualización para restaurar los datos.
- Ejecute un trabajo antes de eliminar un release para retirar un servicio de
  rotación antes de eliminarlo.

Los ganchos funcionan como plantillas normales, pero tienen anotaciones especiales
que hacen que Helm los utilice de manera diferente. En esta sección, cubrimos el
patrón de uso básico de los ganchos.

## Los Ganchos Disponibles

Se definen los siguientes ganchos:

| Valor de Anotación | Descripción                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `pre-install`      | Se ejecuta después de que se procesan las plantillas, pero antes de que se creen recursos en Kubernetes                              |
| `post-install`     | Se ejecuta después de que todos los recursos se cargan en Kubernetes                                                                 |
| `pre-delete`       | Ejecuta en una solicitud de eliminación antes de que se eliminen los recursos de Kubernetes                                          |
| `post-delete`      | Se ejecuta en una solicitud de eliminación después de que se hayan eliminado todos los recursos del release                          |
| `pre-upgrade`      | Se ejecuta en una solicitud de actualización después de que se procesan las plantillas, pero antes de que se actualicen los recursos |
| `post-upgrade`     | Se ejecuta en una solicitud de actualización después de que se hayan actualizado todos los recursos.                                 |
| `pre-rollback`     | Se ejecuta en una solicitud de reversión después de renderizar las plantillas, pero antes de revertir los recursos                   |
| `post-rollback`    | Se ejecuta en una solicitud de reversión después de que se hayan modificado todos los recursos.                                      |
| `test`             | Se ejecuta cuando se invoca el subcomando Helm test ([ver documentos de prueba](/docs/chart_tests/))                                 |

_Note que el gancho `crd-install` se ha eliminado a favor del directorio `crds/`
en Helm 3._

## Ganchos y el Ciclo de Vida del Release

Los ganchos le brindan a usted, el desarrollador de charts, la oportunidad de
realizar operaciones en puntos estratégicos del ciclo de vida de un release. Por
ejemplo, considere el ciclo de vida de un `helm install`. De forma predeterminada,
el ciclo de vida se ve así:

1. El usuario ejecuta `helm install foo`
2. La API de instalación de la biblioteca Helm se llama
3. Después de cierta verificación, la biblioteca renderiza las plantillas de `foo`
4. La biblioteca carga los recursos resultantes en Kubernetes.
5. La biblioteca devuelve el objeto de release (y otros datos) al cliente.
6. El cliente sale

Helm define dos ganchos para el ciclo de vida de `install`: `pre-install` y
`post-install`. Si el desarrollador del chart `foo` implementa ambos ganchos, el
ciclo de vida se modifica así:

1. El usuario ejecuta `helm install foo`
2. La API de instalación de la biblioteca Helm se llama
3. Se instalan los CRD del directorio `crds/`
4. Después de cierta verificación, la biblioteca renderiza las plantillas de `foo`
5. La biblioteca se prepara para ejecutar los ganchos de `pre-install` (cargando
   los recursos del gancho en Kubernetes)
6. La biblioteca ordena los ganchos por peso (asignando un peso de 0 de forma predeterminada),
   por tipo de recurso y finalmente por nombre en orden ascendente.
7. Luego, la biblioteca carga primero el gancho con el peso más bajo (negativo a
   positivo)
8. La biblioteca espera hasta que el enlace esté "Listo" (excepto para los CRD).
9. La biblioteca carga los recursos resultantes en Kubernetes. Tenga en cuenta
   que si la bandera `--wait` está configurada, la biblioteca esperará hasta que
   todos los recursos estén en un estado "Listo" y no ejecutará el gancho `post-install`
   hasta que estén listos.
10. La biblioteca ejecuta el gancho `post-install` (cargando recursos del gancho)
11. La biblioteca espera hasta que el gancho esté "Listo".
12. La biblioteca devuelve el objeto de release (y otros datos) al cliente.
13. El cliente sale

¿Qué significa esperar hasta que un gancho esté listo? Esto depende del recurso
declarado en el gancho. Si el recurso es del tipo `Job` o `Pod`, Helm esperará
hasta que se complete correctamente. Y si el gancho falla, el release fallará.
Esta es una _operación de bloqueo_, por lo que el cliente de Helm se detendrá
mientras se ejecuta el Job.

Para todos los demás tipos, tan pronto como Kubernetes marca el recurso como
cargado (agregado o actualizado), el recurso se considera "Listo". Cuando se
declaran muchos recursos en un gancho, los recursos se ejecutan en serie. Si
tienen pesos de gancho (ver más abajo), se ejecutan en orden ponderado. A partir
de Helm 3.2.0, los recursos de ganchos con el mismo peso se instalan en el mismo
orden que los recursos normales que no son de gancho. De lo contrario, el ordenamiento
no está garantizado. (En Helm 2.3.0 y posteriores, se ordenan alfabéticamente.
Sin embargo, ese comportamiento no se considera vinculante y podría cambiar en
el futuro). Se considera una buena práctica agregar un peso de gancho y establecerlo
en `0` si el peso no es importante.

### Los recursos del gancho no se administran con los releases correspondientes

Los recursos que crea un gancho no se rastrean ni administran actualmente como parte
del release. Una vez que Helm verifica que el gancho ha alcanzado su estado listo,
dejará solo el recurso de gancho. La recolección de basura de los recursos del
gancho cuando se elimina el release correspondiente se puede agregar a Helm 3 en
el futuro, por lo que cualquier recurso del gancho que nunca deba eliminarse debe
anotarse con `helm.sh/resource-policy: keep`.

En términos prácticos, esto significa que si crea recursos en un gancho, no puede
confiar en `helm uninstall` para eliminar los recursos. Para destruir dichos
recursos, debe [agregar una anotación personalizada `helm.sh/hook-delete-policy`](#políticas-de-eliminación-de-ganchos)
al archivo de plantilla de gancho, o [establecer el campo de tiempo de vida (TTL)
de un recurso Job](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/).

## Escribir un Gancho

Los enganches son solo archivos de manifiesto de Kubernetes con anotaciones
especiales en la sección `metadata`. Debido a que son archivos de plantilla,
puede utilizar todas las funciones normales de la plantilla, incluida la lectura
de `.Values`, `.Release` y `.Template`.

Por ejemplo, esta plantilla, almacenada en `templates/post-install-job.yaml`,
declara que un Job se ejecutará en `post-install`:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}"
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
    app.kubernetes.io/instance: {{ .Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  annotations:
    # Esto es lo que define este recurso como un gancho. Sin esta línea, 
    # el trabajo se considera parte del release.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{ .Release.Name }}"
      labels:
        app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
        app.kubernetes.io/instance: {{ .Release.Name | quote }}
        helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{ default "10" .Values.sleepyTime }}"]

```

Lo que hace que esta plantilla sea un gancho es la anotación:

```yaml
annotations:
  "helm.sh/hook": post-install
```

Un recurso puede implementar varios ganchos:

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

De manera similar, no hay límite para la cantidad de recursos diferentes que
pueden implementar un gancho determinado. Por ejemplo, uno podría declarar tanto
un ConfigMap y un Secret como un gancho de pre-install.

Cuando los sub-charts declaran ganchos, también se evalúan. No hay forma de que
un chart de nivel superior deshabilite los ganchos declarados por los sub-charts.

Es posible definir un peso para un gancho que ayudará a construir un orden de
ejecución determinista. Los pesos se definen mediante la siguiente anotación:

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

Los pesos de los ganchos pueden ser números positivos o negativos, pero deben
representarse como cadenas. Cuando Helm inicia el ciclo de ejecución de ganchos
de un tipo particular, los ordenará en orden ascendente.

### Políticas de eliminación de ganchos

Es posible definir políticas que determinen cuándo eliminar los recursos de
gancho correspondientes. Las políticas de eliminación de ganchos se definen
mediante la siguiente anotación:

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

Puede elegir uno o más valores de anotación definidos:

| Valor de Anotación     | Descripción                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `before-hook-creation` | Elimina el recurso anterior antes de que se lance un nuevo gancho (predeterminado) |
| `hook-succeeded`       | Eliminar el recurso después de que el gancho se ejecute correctamente              |
| `hook-failed`          | Eliminar el recurso si el gancho falló durante la ejecución                        |

Si no se especifica ninguna anotación de política de eliminación de ganchos, el
comportamiento `before-hook-creation` se aplica de forma predeterminada.
