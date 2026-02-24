---
title: Guía de inicio rápido
description: Cómo instalar y comenzar con Helm, incluidas instrucciones para distribuciones, preguntas frecuentes y plugins.
sidebar_position: 1
---

Esta guía explica cómo empezar a utilizar Helm rápidamente.

## Prerrequisitos

Para usar Helm de forma exitosa y segura, necesita lo siguiente:

1. Un clúster de Kubernetes
2. Decidir qué configuraciones de seguridad aplicar a su instalación, si corresponde
3. Instalar y configurar Helm.

### Instalar Kubernetes o tener acceso a un clúster

- Debe tener Kubernetes instalado. Para la última versión de Helm, recomendamos
  la última versión estable de Kubernetes, que en la mayoría de los casos es la
  segunda versión menor más reciente.
- También debe tener una copia de `kubectl` configurada localmente.

Consulte la [Política de Soporte de Versiones de Helm](https://helm.sh/docs/topics/version_skew/)
para conocer la máxima diferencia de versiones soportada entre Helm y Kubernetes.

## Instalar Helm

Descargue una versión binaria del cliente Helm. Puede usar herramientas como
`homebrew`, o consultar [la página de releases oficiales](https://github.com/helm/helm/releases).

Para más detalles u otras opciones, consulte [la guía de instalación](/intro/install.md).

## Inicializar un Repositorio de Charts de Helm {#initialize-a-helm-chart-repository}

Una vez que tenga Helm listo, puede agregar un repositorio de charts. Consulte
[Artifact Hub](https://artifacthub.io/packages/search?kind=0) para ver los
repositorios de charts de Helm disponibles.

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

Una vez instalado, podrá listar los charts disponibles para instalar:

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... y muchos más
```

## Instalar un Chart de Ejemplo

Para instalar un chart, puede ejecutar el comando `helm install`. Helm tiene
varias formas de buscar e instalar un chart, pero la más fácil es utilizar los
charts de `bitnami`.

```console
$ helm repo update              # Asegúrese de obtener la última lista de charts
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

En el ejemplo anterior, se desplegó el chart `bitnami/mysql` y el nombre de
nuestro nuevo release es `mysql-1612624192`.

Puede ver las características básicas de este chart de MySQL ejecutando
`helm show chart bitnami/mysql`. O puede ejecutar `helm show all bitnami/mysql`
para obtener toda la información sobre el chart.

Siempre que instale un chart, se crea un nuevo release. Por lo tanto, un chart
se puede instalar varias veces en el mismo clúster. Y cada uno se puede
administrar y actualizar de forma independiente.

El comando `helm install` es muy potente y tiene muchas capacidades. Para más
información, consulte la [Guía de Uso de Helm](/intro/using_helm.md).

## Más Información sobre Releases

Con Helm puede ver fácilmente lo que se ha desplegado:

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

El comando `helm list` (o `helm ls`) le mostrará una lista de todos los releases desplegados.

## Desinstalar un Release

Para desinstalar un release, utilice el comando `helm uninstall`:

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

Esto desinstalará `mysql-1612624192` de Kubernetes, eliminando todos los
recursos asociados con el release, así como el historial del release.

Si proporciona la bandera `--keep-history`, se conservará el historial del
release. Podrá solicitar información sobre ese release:

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

Dado que Helm realiza un seguimiento de sus releases incluso después de
haberlos desinstalado, puede auditar el historial de un clúster e incluso
recuperar un release (con `helm rollback`).

## Leer el Texto de Ayuda

Para más información sobre los comandos disponibles de Helm, utilice
`helm help` o escriba un comando seguido de la bandera `-h`:

```console
$ helm get -h
```
