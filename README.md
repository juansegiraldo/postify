# 🚀 Postify

Postify es una aplicación web para gestionar y programar publicaciones en Instagram. Permite a los usuarios gestionar múltiples cuentas de Instagram, crear y programar publicaciones, y analizar el rendimiento de sus posts.

## 📋 Características

- 📱 Interfaz responsive y moderna
- 📊 Dashboard con métricas de engagement
- 📅 Programación de publicaciones
- 📈 Análisis de rendimiento
- ⚡ Acciones rápidas para crear y gestionar contenido
- 🔄 Vista de cuadrícula y lista para visualizar publicaciones
- 📤 Carga de imágenes con indicador de progreso
- 🔔 Notificaciones toast para feedback al usuario
- 🖱️ Funcionalidad de arrastrar y soltar para reorganizar publicaciones
- 🛠️ Manejo robusto de errores y validación de datos
- **Gestión de múltiples cuentas de Instagram**: Añade, edita y elimina cuentas de Instagram con facilidad.
- **Selector de cuentas**: Cambia rápidamente entre tus diferentes cuentas de Instagram.
- **Creación de posts**: Crea y programa publicaciones para tus cuentas de Instagram.
- **Feed de Instagram**: Visualiza tus publicaciones en un formato similar al de Instagram.
- **Calendario**: Organiza tus publicaciones programadas en un calendario visual.
- **Analíticas**: Obtén información sobre el rendimiento de tus publicaciones.
- **Persistencia de datos**: Tus cuentas y configuraciones se guardan localmente.

## 🛠️ Tecnologías

- [Next.js 15](https://nextjs.org/)
- [React 19](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Supabase](https://supabase.com/) (Base de datos y autenticación)
- [DND Kit](https://dnd-kit.com/) (Drag and Drop)
- **Context API**: Para la gestión de estado global.
- **LocalStorage**: Para la persistencia de datos.

## 🚀 Inicio Rápido

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/postify.git
   cd postify
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   Edita el archivo `.env.local` con tus credenciales de Supabase.

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

5. **Abrir el navegador**
   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm start` - Inicia la aplicación en modo producción
- `pnpm lint` - Ejecuta el linter

## 🏗️ Estructura del Proyecto

```
postify/
├── app/                # Rutas y páginas de la aplicación
│   ├── feed/          # Página del feed
│   ├── create/        # Página de creación de posts
│   ├── edit/          # Página de edición de posts
│   ├── analytics/     # Página de análisis
│   └── settings/      # Página de configuración
├── components/        # Componentes reutilizables
│   ├── ui/           # Componentes de UI (shadcn)
│   └── post-preview.tsx # Componente de vista previa de post
├── lib/              # Utilidades y configuraciones
│   ├── utils.ts      # Funciones de utilidad
│   └── supabase.ts   # Cliente de Supabase
├── public/           # Archivos estáticos
└── styles/           # Estilos globales
```

## 🔧 Configuración

La aplicación utiliza varias bibliotecas de Radix UI para componentes de interfaz de usuario. La configuración principal se puede encontrar en:

- `tailwind.config.ts` - Configuración de Tailwind CSS
- `next.config.mjs` - Configuración de Next.js
- `components.json` - Configuración de componentes UI

## 📱 Diseño Responsive

La aplicación está diseñada para ser completamente responsive:
- Vista móvil: Barra lateral colapsada con iconos
- Vista desktop: Barra lateral expandida con texto completo
- Vista de cuadrícula y lista para visualizar publicaciones

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios que te gustaría hacer.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 