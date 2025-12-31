# Ufinet Autos - Sistema de Gestión Vehicular

Este proyecto es una solución Full Stack desarrollada como parte de la prueba técnica para el rol de Desarrollador Senior. La aplicación permite a los usuarios registrarse, autenticarse y gestionar un inventario de vehículos (CRUD) con validaciones de negocio y seguridad integrada.

El sistema implementa una arquitectura basada en microservicios monolíticos (Spring Boot) con un frontend reactivo (React + TypeScript), asegurando buenas prácticas de desarrollo, principios SOLID y una separación clara de responsabilidades.

## Arquitectura y Tecnologías

El proyecto está dividido en dos componentes principales:

### Backend (API REST)
- **Lenguaje:** Java 17+
- **Framework:** Spring Boot 3.x (Web, Data JPA, Security, Validation)
- **Seguridad:** JSON Web Tokens (JWT) con Spring Security
- **Base de Datos:** Microsoft SQL Server
- **Testing:** JUnit 5 y Mockito
- **Build Tool:** Maven

### Frontend (Cliente Web)
- **Framework:** React
- **Lenguaje:** TypeScript
- **Estilos:** CSS3 Moderno (Diseño Responsivo y componentes tipo Card UI)
- **Comunicación HTTP:** Axios con interceptores para manejo de tokens
- **Routing:** React Router DOM

## Características Implementadas

1. **Autenticación y Seguridad:**
   - Registro de usuarios con validación de existencia.
   - Login seguro retornando token JWT.
   - Protección de rutas en Backend y Frontend (Route Guards).
   - Encriptación de contraseñas con BCrypt.

2. **Gestión de Autos (CRUD):**
   - Creación de vehículos con validación estricta de placa (Formato AAA-123) y unicidad.
   - Listado de vehículos propios del usuario autenticado.
   - Edición de información y eliminación lógica/física.
   - Búsqueda y filtrado por placa, marca o modelo.
   - Previsualización de imágenes mediante URL.

3. **Interfaz de Usuario:**
   - Diseño responsivo adaptable a dispositivos móviles y escritorio.
   - Feedback visual para errores, cargas y acciones exitosas.

## Requisitos Previos

Para ejecutar este proyecto localmente, asegúrese de tener instalado:
- Java JDK 17 o superior.
- Node.js (v16+) y npm.
- Microsoft SQL Server (Instancia local o dockerizada).
- Maven (Opcional, se incluye wrapper).

## Configuración de la Base de Datos

El proyecto incluye un script SQL para la generación automática de la estructura de datos.

1. Localice el archivo `database.sql` ubicado en la carpeta raíz o dentro de `docs/`.
2. Abra su cliente de SQL Server (SQL Server Management Studio o Azure Data Studio).
3. Ejecute el contenido del script para crear las tablas `users` y `cars` y sus relaciones.
4. Verifique que la base de datos esté creada correctamente.

**Nota sobre conexión:**
Antes de iniciar el backend, asegúrese de que el archivo `src/main/resources/application.properties` tenga las credenciales correctas de su instancia local de SQL Server (url, username y password).

Parte 2: Instalación, Pruebas y API
Markdown

## Instrucciones de Instalación y Ejecución

### 1. Despliegue del Backend

El backend está configurado para ejecutarse en el puerto 8080 por defecto.

1. Abra una terminal y navegue a la carpeta raíz del proyecto (donde se encuentra el archivo `pom.xml`).
2. Instale las dependencias y construya el proyecto ejecutando:
   ```bash
   ./mvnw clean install
Inicie la aplicación:

Bash

./mvnw spring-boot:run
Una vez iniciado, la API estará disponible en http://localhost:8080/api.

2. Despliegue del Frontend
El cliente web utiliza Vite y se ejecuta comúnmente en el puerto 5173.

Abra una nueva terminal y navegue a la carpeta del frontend (asegúrese de estar en el directorio que contiene package.json y vite.config.ts).

Instale las dependencias de Node:

Bash

npm install
Inicie el servidor de desarrollo:

Bash

npm run dev
Abra su navegador web en la dirección indicada en la terminal (usualmente http://localhost:5173).

Pruebas Unitarias (Testing)
El proyecto cuenta con una suite de pruebas unitarias automatizadas diseñadas con JUnit 5 y Mockito para validar la lógica de negocio y asegurar la integridad de los datos. Se cubren servicios críticos como CarService y AuthenticationService.

Para ejecutar las pruebas:

Desde la terminal del backend, ejecute:

Bash

./mvnw test
Los reportes de ejecución mostrarán el estado de los tests, validando reglas como:

Prevención de duplicidad de placas.

Validación de usuarios inexistentes.

Integridad del flujo de registro.

Documentación de la API (Postman)
Se incluye una colección de Postman en la carpeta docs/ del proyecto. Esta colección contiene ejemplos preconfigurados para todos los endpoints disponibles (Auth y Cars).

Gestión Automática de Tokens: La colección implementa scripts de automatización en la pestaña "Tests" del endpoint de Login.

Al realizar un Login exitoso, Postman capturará automáticamente el Token JWT de la respuesta.

Este token se guarda en una variable de entorno llamada token.

Todas las peticiones protegidas (Crear, Listar, Editar, Eliminar) leen automáticamente esta variable, eliminando la necesidad de copiar y pegar el token manualmente.

Pasos para importar:

Abra Postman y seleccione "Import".

Seleccione el archivo .json ubicado en la carpeta docs.

Asegúrese de tener un entorno creado con la variable url apuntando a http://localhost:8080.

Estructura del Proyecto
src/main/java: Código fuente del Backend (Controladores, Servicios, Repositorios, Entidades).

src/test/java: Pruebas unitarias.

src/pages: Componentes de React, vistas y lógica de interfaz.

src/context: Manejo de estado global (AuthContext).

sql/: Documentación técnica, scripts SQL y colección de Postman.

Desarrollado para evaluación técnica