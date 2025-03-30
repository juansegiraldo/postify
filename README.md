# 🚀 Postify

Postify es una aplicación web moderna para la gestión y programación de contenido en redes sociales, construida con Next.js y TypeScript.

## 📋 Características

- 📱 Interfaz responsive y moderna
- 📊 Dashboard con métricas de engagement
- 📅 Programación de publicaciones
- 📈 Análisis de rendimiento
- ⚡ Acciones rápidas para crear y gestionar contenido

## 🛠️ Tecnologías

- [Next.js 15](https://nextjs.org/)
- [React 19](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

## 🚀 Inicio Rápido

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   pnpm dev
   ```

4. **Abrir el navegador**
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
│   ├── analytics/     # Página de análisis
│   └── settings/      # Página de configuración
├── components/        # Componentes reutilizables
├── styles/           # Estilos globales
├── public/           # Archivos estáticos
└── lib/             # Utilidades y configuraciones
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

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, asegúrate de:

1. Hacer fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 