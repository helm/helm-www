---
title: Instalación
sidebar_position: 2
---

## Instalación

### ¿Por qué no hay paquetes nativos de Helm para Fedora y otras distribuciones de Linux?

El proyecto Helm no mantiene paquetes para sistemas operativos y entornos. La comunidad de Helm puede proporcionar paquetes nativos y, si el proyecto Helm tiene conocimiento de ellos, se incluirán en la lista. Así es como se inició y agregó la fórmula de Homebrew. Si está interesado en mantener un paquete, nos encantaría contar con su ayuda.

### ¿Por qué proporcionan un script `curl ...|bash`?

Hay un script en nuestro repositorio (`scripts/get-helm-3`) que se puede ejecutar como un script `curl ..|bash`. Todas las transferencias están protegidas por HTTPS, y el script realiza algunas verificaciones de los paquetes que descarga. Sin embargo, el script tiene todos los riesgos habituales de cualquier script de shell.

Lo proporcionamos porque es útil, pero sugerimos que los usuarios lean cuidadosamente el script primero. Lo que realmente nos gustaría, sin embargo, son mejores versiones empaquetadas de Helm.

### ¿Cómo puedo colocar los archivos del cliente de Helm en un lugar diferente a sus ubicaciones predeterminadas?

Helm utiliza la estructura XDG para almacenar archivos. Hay variables de entorno que puede usar para anular estas ubicaciones:

- `$XDG_CACHE_HOME`: establece una ubicación alternativa para almacenar archivos en caché.
- `$XDG_CONFIG_HOME`: establece una ubicación alternativa para almacenar la configuración de Helm.
- `$XDG_DATA_HOME`: establece una ubicación alternativa para almacenar los datos de Helm.

Tenga en cuenta que si tiene repositorios existentes, deberá volver a agregarlos con `helm repo add...`.
