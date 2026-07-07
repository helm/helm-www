---
title: "Guía de inicio rápido"
description: "Cómo instalar y comenzar con Helm, incluidas instrucciones para distribuciones, preguntas frecuentes y complementos."
weight: 1
---

Esta guía explica cómo empezar a utilizar Helm rápidamente.

## Requisitos Previos

Los siguientes requisitos previos son necesarios para un uso exitoso y seguro
de Helm.

1. Un cluster Kubernetes
2. Decidir qué configuraciones de seguridad aplicar a su instalación, si corresponde
3. Instalar y configurar Helm.

### Instalar Kubernetes o tener acceso a un clúster

- Debe tener Kubernetes instalado. Para la última versión de Helm, recomendamos
la última versión estable de Kubernetes, que en la mayoría de los casos es la
segunda versión menor más reciente.
- También debe tener una copia configurada localmente de `kubectl`.

Consulte la [Política de Soporte de Versión de Helm](https://helm.sh/docs/topics/version_skew/)
para conocer el sesgo de versión máximo admitido entre Helm y Kubernetes.

## Instalar Helm

Descargue una versión binaria del cliente Helm. Puedes usar herramientas como
`homebrew`, o mirar [la página de lanzamientos
oficiales](https://github.com/helm/helm/releases).

Para obtener más detalles u otras opciones, consulte [la guía de
instalación]({{< ref "install.md" >}}).

## Inicializar un Repositorio de Helm Chart

Una vez que tengas Helm listo, puede agregar un repositorio de Charts. Consulta
[Artifact Hub](https://artifacthub.io/packages/search?kind=0) para conocer los
repositorios de Helm Chart disponibles.

```console
$ helm repo add stable https://charts.helm.sh/stable
```

Una vez que esté instalado, podrá enumerar los Charts que puedes instalar:

```console
$ helm search repo stable
NAME                                    CHART VERSION   APP VERSION                     DESCRIPTION
stable/acs-engine-autoscaler            2.2.2           2.1.1                           DEPRECATED Scales worker nodes within agent pools
stable/aerospike                        0.2.8           v4.5.0.5                        A Helm chart for Aerospike in Kubernetes
stable/airflow                          4.1.0           1.10.4                          Airflow is a platform to programmatically autho...
stable/ambassador                       4.1.0           0.81.0                          A Helm chart for Datawire Ambassador
# ... y muchos más
```

## Instalar un Chart de Ejemplo

Para instalar un chart, puede ejecutar el comando `helm install`. Helm tiene varias
formas de buscar e instalar un chart, pero la más fácil es utilizar uno de los charts
`stable` oficiales.

```console
$ helm repo update              # Asegúrese de obtener la última lista de charts
$ helm install stable/mysql --generate-name
Released smiling-penguin
```

En el ejemplo anterior, se lanzó el chart `stable/mysql` y el nombre de nuestro
nuevo release es `smiling-penguin`.

Puedes obtener una idea simple de las características de este chart de MySQL ejecutando
`helm show chart stable/mysql`. O puedes ejecutar `helm show all stable/mysql`
para obtener toda la información sobre el chart.

Siempre que instales un chart, se crea un nuevo release. Por lo tanto, un chart
se puede instalar varias veces en el mismo cluster. Y cada uno se puede administrar
y actualizar de forma independiente.

El comando `helm install` es un comando muy poderoso con muchas capacidades.
Para obtener más información al respecto, consulte la [Guía de Uso de
Helm]({{< ref "using_helm.md" >}})

## Más Información sobre Releases

Es fácil ver lo que se ha lanzado utilizando Helm:

```console
$ helm ls
NAME             VERSION   UPDATED                   STATUS    CHART
smiling-penguin  1         Wed Sep 28 12:59:46 2016  DEPLOYED  mysql-0.1.0
```

La función `helm list` le mostrará una lista de todos los releases desplegados.

## Desinstalar un Release

Para desinstalar un release, utilice el comando `helm uninstall`:

```console
$ helm uninstall smiling-penguin
Removed smiling-penguin
```

Esto desinstalará `smiling-penguin` de Kubernetes, lo que eliminará todos los
recursos asociados con el release, así como el historial del release.

Si la bandera `--keep-history` es utilizada, el historial del release será mantenido.
Podrás solicitar información sobre ese release:

```console
$ helm status smiling-penguin
Status: UNINSTALLED
...
```

Debido a que Helm realiza un seguimiento de sus releases incluso después de haberlos
desinstalado, puede auditar el historial de un clúster e incluso recuperar un release
(con `helm rollback`).

## Leer el Texto de Ayuda

Para obtener más información sobre los comandos disponibles de Helm, utiliza
`helm help` o escribe un comando seguido de la bandera `-h`:

```console
$ helm get -h
```
