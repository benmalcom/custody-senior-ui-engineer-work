# Custody Senior UI Engineer Take-Home

A React + TypeScript transfer form application built with Vite, Tailwind CSS, and TanStack Form.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Build](#build)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Architecture Decisions](#architecture-decisions)

---

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **pnpm** (v9.15.3 or higher)

---

## Installation

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
   cd custody-senior-ui-work
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

---

## Development

Start the development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

---

## Build

Create a production build:

```bash
pnpm build
```

The built files will be output to the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
pnpm preview
```

---

## Code Quality

Run linting and formatting:

```bash
pnpm lint
```

Auto-fix linting issues:

```bash
pnpm format
```

---

## Testing

Run tests in watch mode:

```bash
pnpm test
```

Run tests with UI:

```bash
pnpm test:ui
```

Run tests once (CI mode):

```bash
pnpm test:run
```

---

## Tech Stack

| Technology              | Purpose                    |
| ----------------------- | -------------------------- |
| **React 19**            | UI framework               |
| **TypeScript**          | Type safety                |
| **Vite**                | Build tool and dev server  |
| **Tailwind CSS v4**     | Styling                    |
| **TanStack Form**       | Form state management      |
| **TanStack Query**      | Data fetching              |
| **Zod**                 | Schema validation          |
| **Biome**               | Linting and formatting     |
| **Vitest**              | Unit and integration tests |
| **Testing Library**     | Component testing utilities|

---

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # React components
│   ├── icons/        # Icon components
│   ├── transfer/     # Transfer form components
│   └── ui/           # Reusable UI components
├── constants/        # Application constants
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── schemas/          # Zod validation schemas
```

---

## Key Features

- **Multi-step transfer form** with visual stepper
- **Real-time form validation** powered by Zod schemas
- **Asset selection** with search and filtering capabilities
- **Balance and fee calculation** with live updates
- **Responsive design** optimized for mobile, tablet, and desktop
- **Accessible form controls** following WCAG guidelines
- **Type-safe API integration** with full TypeScript coverage

---

## Architecture Decisions

### Form Management

TanStack Form was chosen for its excellent TypeScript support, fine-grained reactivity, and seamless integration with validation libraries like Zod.

### Styling

Tailwind CSS v4 provides utility-first styling with improved performance and smaller bundle sizes compared to previous versions.

### Data Fetching

TanStack Query handles server state management, providing automatic caching, background refetching, and optimistic updates.

### Validation

Zod schemas provide runtime validation with automatic TypeScript type inference, ensuring consistency between runtime checks and compile-time types.

---

## License

This project was created as part of a take-home assessment.