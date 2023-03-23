![Header](docs/header-doc.png)

# Diálogo Legislativo - Backend 

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DemocraciaEnRed_dialogo-legislativo-core&metric=alert_status)](https://sonarcloud.io/dashboard?id=DemocraciaEnRed_dialogo-legislativo-core)
[![GitHub license](https://img.shields.io/github/license/DemocraciaEnRed/dialogo-legislativo-core)](https://github.com/DemocraciaEnRed/dialogo-legislativo-core/blob/master/LICENSE)

Este es uno de los cuatros modulos que se requieren descargar, hacer setup e instalar cada uno de los repositorios para poder utilizar Diálogo Legislativo.
Para saber mas del conjunto de modulos que compone Diálogo Legislativo, hace [click aqui](https://github.com/DemocraciaEnRed/dialogo-legislativo) 

---

## Setup dialogo-legislativo-core

> #### ⚠️ NOTAS IMPORTANTES
> 
> El siguiente conjunto de sistemas requiere de:
> - Mongo3.6
> - Keycloak > 4.4.x
> 
> Sobre Mongo3.6, es necesario que instales mongo 3.6 en tu computadora, con una base de datos llamada "dialogoLegislativo". No hace falta crear alguna collection, eso lo hace la app en inicio.
> 
> Keycloak es un sistema open source de identificación y gestión de acceso de usuarios. Es un sistema complejo y para fines de testing, en [Democracia en Red](https://democraciaenred.org) sabemos que la instalacion de Keycloak puede ser un bloqueo para intenciones de testing. Para eso, comunicate con nosotros y podemos ayudarte a hacer el setup y utilizar nuestro Keycloak de Democracia en Red. Envianos un correo electronico en [mailto:it@democraciaenred.org](it@democraciaenred.org) o contactanos a través de nuestro [Twitter](https://twitter.com/fundacionDER).


Ir a la carpeta del repo y instalar las dependencias.


```
dev/:$ cd dialogo-legislativo-core
dev/dialogo-legislativo-core:$ npm install
```

Ahora tenemos que crear un archivo `.env` que son nuestras variables de entorno

```env
PORT=4000
SESSION_SECRET=PleaseCreateASectretHERE
MONGO_URL=mongodb://localhost/dialogoLegislativo
AUTH_SERVER_URL=##############TODO
AUTH_REALM=###################TODO
AUTH_CLIENT=##################TODO
NOTIFIER_URL=http://localhost:5000/api
```

Comando para ejecutar:

```
dev/dialogo-legislativo-core:$ ./run-dev.sh
```

---

## Licencia

El siguiente repositorio es un desarrollo de codigo abierto bajo la licencia GNU General Public License v3.0. Pueden acceder a la haciendo [click aqui](./LICENSE).