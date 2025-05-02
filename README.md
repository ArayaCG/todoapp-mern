# TaskMaster - ToDo App Fullstack MERN

Aplicación de tareas con autenticación JWT que permite a los usuarios gestionar sus tareas personales de forma segura y eficiente.

## 📌 Links

-   **Frontend (Vercel):** [https://taskmaster-mern.vercel.app/](https://taskmaster-mern.vercel.app/)
-   **Backend (Railway):** [https://todoapp-mern-production.up.railway.app/](https://todoapp-mern-production.up.railway.app/)
-   **Repositorio:** [https://github.com/ArayaCG/todoapp-mern](https://github.com/ArayaCG/todoapp-mern)

## 🧪 Cómo probarlo

-   Puedes registrarte como nuevo usuario con un email y contraseña
-   O iniciar sesión si ya tienes una cuenta
-   Una vez autenticado, podrás crear, editar, eliminar y listar tus tareas
-   Cada usuario solo puede ver y manipular sus propias tareas

## 🚀 Tecnologías utilizadas

### Backend

-   **Node.js y Express:** Como base del servidor
-   **TypeScript:** Para tipado estático y mayor seguridad en el desarrollo
-   **MongoDB y Mongoose:** Para la base de datos NoSQL y modelado de datos
-   **JWT:** Para autenticación basada en tokens
-   **bcrypt:** Para el hashing seguro de contraseñas
-   **express-validator:** Para validación robusta de entradas
-   **express-rate-limit y helmet:** Para protección contra ataques de fuerza bruta y otras vulnerabilidades comunes
-   **winston y express-winston:** Para registro de logs estructurados
-   **cors:** Para habilitar CORS de forma segura

### Frontend

-   **React 19 y TypeScript:** Para la construcción de una interfaz robusta y tipada
-   **Vite:** Como bundler para un desarrollo rápido y optimizado
-   **Tailwind CSS:** Para estilos rápidos, consistentes y responsivos
-   **React Router DOM v7:** Para navegación entre páginas
-   **Axios:** Para peticiones HTTP al backend
-   **Zustand:** Para gestión ligera y eficiente del estado global
-   **React Hot Toast:** Para notificaciones elegantes y no intrusivas
-   **Lucide React:** Para iconografía moderna y consistente
-   **Framer Motion:** Para animaciones fluidas y mejora de UX

## ⚙️ Instrucciones de instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/ArayaCG/todoapp-mern
cd todoapp-mern
```

2. **Configurar variables de entorno**

En cada carpeta (backend y frontend) hay un archivo `.env.example`.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Completa los siguientes valores:

**Backend (.env)**

```
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=tu_secreto_jwt_seguro
JWT_EXPIRES_IN=7d
API_CLIENT_ID=tu_client_id
API_CLIENT_SECRET=tu_client_secret
```

**Frontend (.env)**

```
VITE_API_CLIENT_ID=tu_client_id
VITE_API_CLIENT_SECRET=tu_client_secret
VITE_API_URL=http://localhost:4000
NODE_ENV=development
```

3. **Instalar dependencias y ejecutar**

```bash
# Instalar y ejecutar Backend
cd backend
npm install
npm run dev

# Instalar y ejecutar Frontend (en otra terminal)
cd ../frontend
npm install
npm run dev
```

## 🧠 Decisiones Técnicas

### Seguridad y Autenticación

-   **Autenticación robusta basada en JWT:** Al registrarse o iniciar sesión, el backend genera un token JWT con el id del usuario como payload. Este token tiene una expiración configurable y se almacena en localStorage para mantener sesiones persistentes. Las rutas protegidas del backend validan este token mediante un middleware que decodifica y autoriza cada petición.

-   **Hasheo de contraseñas con bcrypt:** Las contraseñas de los usuarios se hashean automáticamente en un hook pre("save") del modelo de Mongoose utilizando bcrypt con 10 salt rounds. Este enfoque garantiza que la lógica de seguridad esté encapsulada en el modelo y no se repita en los servicios. La comparación de contraseñas también se realiza dentro del modelo con un método comparePassword().

-   **Doble capa de seguridad en API:** Además del JWT, el backend requiere que todas las rutas del CRUD de tareas incluyan los headers API_CLIENT_ID y API_CLIENT_SECRET, validados por un middleware adicional (apiAuth). Esto permite limitar el acceso incluso desde el frontend, agregando una defensa anticipada contra uso indebido.

### Arquitectura y Organización

-   **Arquitectura backend modular:** El backend sigue una estructura clara basada en capas:

    ```
    backend/
    ├── src/
    │   ├── config/       # Configuraciones y variables de entorno
    │   ├── controllers/  # Lógica de los endpoints
    │   ├── middlewares/  # Middlewares de autenticación, validación, etc.
    │   ├── models/       # Modelos de Mongoose
    │   ├── routes/       # Definición de rutas API
    │   ├── utils/        # Utilidades, error handling, etc.
    │   ├── app.ts        # Configuración de Express
    │   └── server.ts     # Entrada principal del servidor
    └── ...
    ```

-   **Arquitectura frontend organizada:**
    ```
    frontend/
    ├── src/
    │   ├── components/   # Componentes reutilizables
    │   ├── pages/        # Páginas/vistas
    │   ├── services/     # Lógica de comunicación con API
    │   ├── store/        # Estados globales con Zustand
    │   ├── App.tsx       # Componente principal
    │   └── main.tsx      # Punto de entrada
    └── ...
    ```

### Manejo de Errores y Validación

-   **Manejo de errores centralizado:** Se utiliza una clase AppError para definir errores operacionales personalizados, junto con un middleware errorHandler que captura, loguea y devuelve errores al cliente con un formato consistente. También se manejan errores específicos de Mongoose como duplicados o validaciones malformadas.

-   **Validaciones desacopladas:** La validación de entradas se realiza con express-validator y se centraliza en un archivo validator.ts, facilitando su reutilización y manteniendo los controladores limpios y enfocados solo en la lógica de negocio.

### Estado y Gestión Frontend

-   **Estado global con Zustand:** El frontend utiliza Zustand para manejar el estado global del usuario y sus tareas. Este estado se sincroniza con localStorage, permitiendo mantener la sesión activa al recargar la página. Zustand fue elegido por su simplicidad frente a alternativas más complejas como Redux.

-   **Lógica de red desacoplada:** Todas las interacciones con la API están encapsuladas en la carpeta services/, lo que permite reutilizar la lógica y mantener los componentes limpios. El estado se actualiza con useState y useEffect tras cada operación.

-   **Protección de rutas:** Un componente ProtectedRoute.tsx actúa como guardia para las rutas que requieren autenticación. Verifica si hay un token válido en localStorage y redirige a login en caso de ausencia o expiración.

### UX/UI

-   **UI moderna y responsiva:** La interfaz está construida con Tailwind CSS y pensada para dispositivos móviles. Se incorporaron animaciones suaves con Framer Motion, íconos con Lucide React, y notificaciones visuales con react-hot-toast.

-   **Modales de confirmación:** Para acciones destructivas como eliminar tareas, se implementaron modales de confirmación para evitar eliminaciones accidentales.

-   **Modo claro/oscuro:** Se implementó un sistema de temas con Tailwind que permite al usuario cambiar entre modo claro y oscuro según sus preferencias, mejorando la accesibilidad y experiencia de usuario.

## 📝 Funcionalidades Implementadas

-   ✅ **Autenticación completa:** Registro, login y logout con JWT
-   ✅ **CRUD de tareas:** Crear, listar, editar y eliminar tareas
-   ✅ **Seguridad por usuario:** Cada usuario solo accede a sus datos
-   ✅ **Validación robusta:** En frontend y backend
-   ✅ **Notificaciones:** Feedback visual para todas las acciones
-   ✅ **Confirmaciones modales:** Al eliminar tareas
-   ✅ **Animaciones:** Para mejorar la experiencia de usuario
-   ✅ **Persistencia:** Sesión guardada en localStorage
-   ✅ **Responsive:** Diseño adaptable a todos los dispositivos
-   ✅ **Tema claro/oscuro:** Posibilidad de cambiar entre temas según preferencia del usuario
-   ✅ **Seguridad adicional:** API Client y Secret + rate limiting
-   ✅ **Logs:** Registro detallado de errores y acciones
