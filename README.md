# Postify - Social Media Post Management System

Postify is a modern web application for managing and scheduling social media posts across multiple platforms. Built with Next.js and TypeScript, it provides a user-friendly interface for creating, editing, and organising social media content.

## Features

- Create and edit social media posts
- Support for multiple platforms (Instagram, Facebook, Twitter, LinkedIn, YouTube)
- Drag-and-drop image upload
- Post scheduling and drafts
- Grid and list view options
- Real-time preview
- Post reordering with drag-and-drop

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- pnpm (Package Manager)
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd postify
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Add any environment variables here
```

## Required Dependencies

### Core Dependencies
- `next`: ^14.0.0
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `typescript`: ^5.0.0

### UI Components
- `@radix-ui/react-*`: Various UI primitives
- `class-variance-authority`: For styling variants
- `clsx`: For conditional class names
- `tailwind-merge`: For merging Tailwind classes
- `tailwindcss`: ^3.0.0
- `postcss`: ^8.0.0
- `autoprefixer`: ^10.0.0

### State Management & Utilities
- `@dnd-kit/core`: For drag-and-drop functionality
- `@dnd-kit/sortable`: For sortable lists
- `@dnd-kit/utilities`: DnD utilities
- `uuid`: For generating unique IDs
- `date-fns`: For date manipulation

### Development Dependencies
- `@types/node`: ^20.0.0
- `@types/react`: ^18.2.0
- `@types/react-dom`: ^18.2.0
- `eslint`: ^8.0.0
- `eslint-config-next`: ^14.0.0
- `prettier`: ^3.0.0
- `typescript`: ^5.0.0

## Project Structure

```
postify/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── feed/              # Feed page
│   └── [mode]/[id]/      # Post creation/editing
├── components/            # Reusable components
├── public/               # Static assets
├── data/                 # JSON data storage
└── styles/              # Global styles
```

## Running the Application

1. Start the development server:
```bash
pnpm dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

1. Build the application:
```bash
pnpm build
```

2. Start the production server:
```bash
pnpm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 