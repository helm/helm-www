---
title: Instalar Helm
description: Aprenda a instalar y poner Helm en funcionamiento.
sidebar_position: 2
---

Esta guía muestra cómo instalar Helm CLI. Helm se puede instalar desde la fuente
o desde versiones binarias preconstruidas.

## Desde el Proyecto Helm

El proyecto Helm proporciona dos formas de obtener e instalar Helm. Estos son los
métodos oficiales para obtener lanzamientos de Helm. Además de eso, la comunidad
de Helm proporciona métodos para instalar Helm a través de diferentes administradores
de paquetes. La instalación a través de esos métodos se puede encontrar debajo
de los métodos oficiales.

### De los Lanzamientos Binarios

Cada [lanzamiento](https://github.com/helm/helm/releases) de Helm proporciona
binarios de lanzamiento para una variedad de sistemas operativos. Estas versiones
binarias se pueden descargar e instalar manualmente.

1. Descarga tu [versión deseada](https://github.com/helm/helm/releases)
2. Desempaquétala (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Encuentra el binario `helm` en el directorio desempaquetado, y muévelo a su
destino deseado (`mv linux-amd64/helm /usr/local/bin/helm`)

De ahí, debes ser capaz de correr el cliente y
[agregar repos estables](/intro/quickstart.md#initialize-a-helm-chart-repository):
`helm help`.

**Nota:** Las pruebas automatizadas de Helm se realizan para Linux AMD64 solo durante
las compilaciones y lanzamientes de GitHub Actions. Las pruebas de otros sistemas operativos
son responsabilidad de la comunidad que solicita Helm para el sistema operativo
en cuestión.

### Desde Script

Helm ahora tiene un script de instalación que automáticamente tomará la última versión
de Helm y [la instalará localmente](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3).

Puede recuperar ese script y luego ejecutarlo localmente. Está bien documentado para
que puedas leerlo y comprender lo que está haciendo antes de ejecutarlo.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Sí, puedes `curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash`si
quieres vivir al límite.

## A Través de Administradores de Paquetes

La comunidad de Helm ofrece la posibilidad de instalar Helm a través de administradores
de paquetes del sistema operativo. Estos no son soportados por el proyecto Helm y
no se consideran terceros de confianza.

### Desde Homebrew (macOS)

Los miembros de la comunidad de Helm han contribuido con una fórmula de Helm a Homebrew.
Esta fórmula generalmente está actualizada.

```console
brew install helm
```

(Nota: también hay una fórmula para emacs-helm, que es un proyecto diferente).

### Desde Chocolatey (Windows)

Los miembros de la comunidad Helm han contribuido con un
[paquete Helm](https://chocolatey.org/packages/kubernetes-helm) construido para
[Chocolatey](https://chocolatey.org/). Este paquete generalmente está actualizado.

```console
choco install kubernetes-helm
```

### Desde Winget (Windows)

Los miembros de la comunidad Helm han contribuido con un
[paquete Helm](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm) construido para
[Winget](https://learn.microsoft.com/en-us/windows/package-manager/). Este paquete generalmente está actualizado.

```console
winget install Helm.Helm
```

### Desde Apt (Debian/Ubuntu)

Los miembros de la comunidad Helm han contribuido con un
[paquete Helm](https://helm.baltorepo.com/stable/debian/) para Apt.
Este paquete generalmente está actualizado.

```console
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Desde Snap

La comunidad [Snapcrafters](https://github.com/snapcrafters) mantiene la
versión Snap del [paquete Helm](https://snapcraft.io/helm):

```console
sudo snap install helm --classic
```

### Desde pkg (FreeBSD)

Los miembros de la comunidad FreeBSD han contribuido con una compilación de
[paquete Helm](https://www.freshports.org/sysutils/helm) a la
[Colección de Ports de FreeBSD](https://man.freebsd.org/ports)

```console
pkg install helm
```

### Builds de Desarrollo

Además de los lanzamientos, puede descargar o instalar versiones de desarrollo de
Helm.

### Desde Canary Builds

Los "Canary" builds son versiones del software Helm que se crean a partir lo último
de la rama main. No son lanzamientos oficiales y pueden no ser estables. Sin embargo,
ofrecen la oportunidad de probar las funciones de vanguardia.

Los binarios Canary builds se guardan en [get.helm.sh](https://get.helm.sh). Aquí
hay enlaces a las compilaciones comunes:

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Windows Experimental AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### Desde los Fuentes (Linux, macOS)

Construir Helm desde los fuentes es un poco más complicado, pero es la mejor
manera de hacerlo si desea probar la última versión (prelanzamiento) de Helm.

Debe tener un entorno de trabajo de Go.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

Si es necesario, buscará las dependencias, las almacenará en caché y validará
la configuración. Luego compilará `helm` y lo colocará en `bin/helm`.

## Conclusión

En la mayoría de los casos, la instalación es tan simple como obtener un binario
`helm` preconstruido. Este documento cubre casos adicionales para aquellos que
desean hacer cosas más sofisticadas con Helm.

Una vez que tenga el cliente de Helm instalado correctamente, puede continuar con
el uso de Helm para administrar Charts y[agregar el repositorio
estable](/intro/quickstart.md#initialize-a-helm-chart-repository).
