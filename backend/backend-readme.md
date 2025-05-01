# ToDo App - Backend

Este es el backend para la aplicación de tareas, desarrollado con el stack MERN (MongoDB, Express, React, Node.js) utilizando TypeScript.

## Características

-   Autenticación completa con JWT
-   CRUD completo para tareas
-   Validación de entradas
-   Middleware de rate-limiting
-   Sistema de logs
-   Autenticación con API Keys para el frontend

## Tecnologías utilizadas

-   Node.js y Express
-   TypeScript para tipado estático
-   MongoDB y Mongoose para la base de datos
-   JWT para autenticación
-   bcrypt para hash de contraseñas
-   express-validator para validación
-   winston para logs
-   express-rate-limit para limitar peticiones

## Estructura del proyecto

```
/backend
  /src
    /config      - Configuración de la base de datos
    /controllers - Controladores para las rutas
    /middlewares - Middlewares personalizados
    /models      - Modelos de datos
    /routes      - Definición de rutas
    /utils       - Utilidades (logger, validadores)
    app.ts       - Configuración de Express
    server.ts    - Punto de entrada
  .env          - Variables de entorno
  tsconfig.json - Configuración de TypeScript
  package.json  - Dependencias y scripts
```

## Instalación y ejecución

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/todo-app.git
cd todo-app/backend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del directorio backend con las siguientes variables:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todo_app
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
API_CLIENT_ID=your_client_id_here
API_CLIENT_SECRET=your_client_secret_here
```

4. **Iniciar MongoDB**

Asegúrate de tener MongoDB instalado y ejecutándose localmente, o ajusta la URI en el archivo `.env` para conectarte a una instancia remota.

5. **Ejecutar en desarrollo**

```bash
npm run dev
```

6. **Compilar para producción**

```bash
npm run build
```

7. **Ejecutar en producción**

```bash
npm start
```

## API Endpoints

### Autenticación

-   `POST /api/auth/register` - Registrar un nuevo usuario
-   `POST /api/auth/login` - Iniciar sesión
-   `GET /api/auth/me` - Obtener datos del usuario autenticado

### Tareas

-   `GET /api/tasks` - Obtener todas las tareas del usuario
-   `GET /api/tasks/:id` - Obtener una tarea específica
-   `POST /api/tasks` - Crear una nueva tarea
-   `PUT /api/tasks/:id` - Actualizar una tarea existente
-   `DELETE /api/tasks/:id` - Eliminar una tarea

## Seguridad

-   Las contraseñas se hashean usando bcrypt
-   JWT para autenticación segura
-   API Keys requeridas para acceder a la API desde el frontend
-   Rate limiting para evitar ataques de fuerza bruta
-   Validación de entradas para prevenir inyecciones

