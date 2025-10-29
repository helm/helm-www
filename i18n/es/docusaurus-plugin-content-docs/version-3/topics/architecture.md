---
title: Arquitectura Helm
description: Describe la arquitectura de Helm a alto nivel.
sidebar_position: 8
---

# Arquitectura de Helm

Este documento describe la arquitectura de Helm a alto nivel.

## El propósito de Helm

Helm es una herramienta para gestionar paquetes Kubernetes llamados _charts_. Helm puede hacer lo siguiente:

- Crear nuevos charts desde cero.
- Empaquetar charts en archivos de charts (tgz).
- Interactuar con repositorios de charts donde se almacenan charts.
- Instalar y desinstalar charts en un clúster Kubernetes existente.
- Gestionar el ciclo de lanzamiento de los charts instalados con Helm.

Para Helm, hay tres conceptos importantes:

1. El _chart_ es un conjunto de información necesaria para crear una instancia de una aplicación de aplicación Kubernetes.
2. El _config_ contiene información de configuración que puede fusionarse en un chart empaquetado para crear un objeto releaseable.
3. Un _release_ es una instancia en ejecución de un _chart_, combinado con un _config_ específico.

## Componentes

Helm es un ejecutable que se implementa en dos partes distintas:

**El cliente Helm** es un cliente de línea de comandos para usuarios finales. El cliente es responsable de lo siguiente

- Desarrollo de charts locales
- Gestión de repositorios
- Gestión de release
- Interfaz con la librería Helm
  - Envío de charts para su instalación
  - Solicitud de actualización o desinstalación de releases existentes

**La biblioteca Helm** proporciona la lógica para ejecutar todas las operaciones de Helm. Interactúa con el servidor API de Kubernetes y proporciona la siguiente capacidad:

- Combinación de una chart y una configuración para construir una release.
- Instalar charts en Kubernetes y proporcionar el objeto de release subsiguiente.
- Actualizar y desinstalar charts interactuando con Kubernetes.

La biblioteca standalone de Helm encapsula la lógica de Helm para que pueda ser aprovechada por diferentes clientes.

## Implementación

El cliente y la biblioteca Helm están escritos en el lenguaje de programación Go.

La librería utiliza la librería cliente de Kubernetes para comunicarse con Kubernetes. Actualmente, esa librería utiliza REST+JSON. Almacena información en Secrets ubicados dentro de Kubernetes. No necesita su propia base de datos.

Los archivos de configuración se escriben, cuando es posible, en YAML.
