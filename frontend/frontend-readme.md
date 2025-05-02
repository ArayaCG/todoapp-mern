# ToDo App - Frontend

Este es el frontend para la aplicación de tareas, desarrollado con React y utilizando TypeScript para un desarrollo con tipado estático.

## Características

-   Registro e inicio de sesión de usuarios.
-   Visualización de la lista de tareas del usuario.
-   Creación, edición y eliminación de tareas.
-   Interfaz de usuario responsiva diseñada con Tailwind CSS.
-   Manejo de estado eficiente con Zustand.
-   Notificaciones visuales de éxito y error mediante react-hot-toast.
-   Animaciones sutiles para una mejor experiencia de usuario con framer-motion.
-   Autenticación persistente utilizando localStorage.

## Tecnologías utilizadas

-   React para la construcción de la interfaz de usuario.
-   TypeScript para el tipado estático y una mejor calidad del código.
-   Vite como bundler para un desarrollo rápido.
-   React Router DOM para la gestión de la navegación.
-   Tailwind CSS para un diseño rápido y responsivo.
-   Axios para realizar peticiones HTTP al backend.
-   Zustand para la gestión del estado global de la aplicación.
-   react-hot-toast para mostrar notificaciones al usuario.
-   lucide-react para iconos consistentes.
-   framer-motion para animaciones fluidas.

## Estructura del proyecto

```bash
/frontend
├── public/
│   └── ... (assets estáticos)
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env
├── .gitignore
├── .eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.cjs
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Instalación y ejecución

1. **Clonar el repositorio**

Si aún no lo has hecho, clona el repositorio completo:

```bash
git clone [https://github.com/ArayaCG/todoapp-mern](https://github.com/ArayaCG/todoapp-mern)
cd todoapp-mern/frontend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**
   Crea un archivo .env.local en la raíz del directorio frontend con las siguientes variables (asegúrate de que coincidan con la configuración de tu backend):

```bash
VITE_API_BASE_URL=http://localhost:5000/api # O la URL de tu backend
VITE_API_CLIENT_ID=your_client_id_here      # Debe coincidir con la del backend
VITE_API_CLIENT_SECRET=your_client_secret_here # Debe coincidir con la del backend
```

-   Importante: Las variables de entorno en Vite deben comenzar con VITE\_.

4. **Ejecutar en desarrollo**

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo de Vite, generalmente en http://localhost:5173.

5. **Construir para producción**

```bash
npm run build
```

Esto generará una versión optimizada de la aplicación en el directorio dist.

6. **Previsualizar la construcción de producción**

```bash
npm run preview
```

Esto levanta un servidor local para probar la build de producción.

## Estructura de las Páginas

-   pages/LoginPage.tsx: Formulario de inicio de sesión y lógica de autenticación.

-   pages/RegisterPage.tsx: Formulario de registro de nuevos usuarios y lógica de autenticación.

-   pages/TasksPage.tsx: Página principal protegida que muestra la lista de tareas del usuario, permite crear, editar y eliminar tareas.

## Manejo de Estado (Zustand)

Se utiliza Zustand para gestionar el estado global de la aplicación, como la información del usuario autenticado y la lista de tareas. Los stores se encuentran en el directorio src/store.

## Llamadas a la API (Axios)

Las interacciones con el backend se realizan mediante la librería Axios. Los servicios relacionados con la API se encuentran en el directorio src/services. Se espera que estos servicios utilicen las API Keys configuradas en las variables de entorno para la autenticación con el backend.

## Diseño Responsivo (Tailwind CSS)

La interfaz de usuario está diseñada para ser responsiva, adaptándose a diferentes tamaños de pantalla gracias a la configuración y las clases de utilidad de Tailwind CSS. La configuración de Tailwind se encuentra en tailwind.config.js.

## Animaciones (framer-motion)

Se han implementado animaciones sutiles utilizando la librería framer-motion para mejorar la experiencia del usuario al interactuar con la aplicación.

## Autenticación Persistente

La información del usuario autenticado se persiste en localStorage para mantener la sesión activa incluso después de recargar la página o cerrar el navegador.

¡Espero que este README.md te sea de gran utilidad para tu proyecto frontend! Si tienes alguna otra pregunta o necesitas más detalles, no dudes en consultarme.
