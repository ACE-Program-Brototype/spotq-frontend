# spotQ Frontend

Frontend application for the **spotQ** platform, built with React and TypeScript.

## Tech Stack

* React
* TypeScript
* Vite
* pnpm
* Biome
* React Router v7
* Zustand
* Infisical
* Vercel
* Ky http - client
* Tailwind / shadcn


## Getting Started

### Prerequisites

Make sure you have:

* Node.js
* pnpm
* Infisical CLI

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd spotq-frontend
```

Install dependencies:

```bash
pnpm install
```

### Run Locally

Environment variables are managed using Infisical.

```bash
infisical run -- pnpm dev
```

The application will be available at:

```text
http://localhost:5173
```

## Available Commands

```bash
pnpm dev       # Start development server
pnpm build     # Create production build
pnpm preview   # Preview production build
pnpm lint      # Run Biome lint checks
pnpm format    # Format code using Biome
pnpm check     # Run Biome checks=
```

## Project Structure

The frontend follows a feature-based architecture. Business functionality is organized by feature/epic, while application-wide infrastructure and reusable components remain outside the feature folders.

```text
src/
├── app/
│   ├── App.tsx
│   │
│   ├── providers/
│   │   ├── AppProviders.tsx
│   │   └── QueryProvider.tsx
│   │
│   └── router/
│       ├── index.tsx
│       ├── routes.tsx
│       └── *.routes.tsx
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── restaurant/
│   │   └── ...
│   │
│   ├── queue/
│   │   └── ...
│   │
│   ├── order/
│   │   └── ...
│   │
│   └── payment/
│       └── ...
│
├── components/
│   ├── ui/
│   │   └── shadcn-components
│   │
│   └── common/
│       ├── ErrorBoundary.tsx
│       └── ...
│
├── layouts/
│   ├── RootLayout.tsx
│   ├── AuthLayout.tsx
│   └── ProtectedLayout.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   └── hooks/
│   │       ├── beforeRequest.ts
│   │       ├── afterResponse.ts
│   │       ├── beforeRetry.ts
│   │       └── beforeError.ts
│   │
│   └── utils/
│       └── cn.ts
│
├── hooks/
│
├── constants/
│
├── types/
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── logos/
│
└── styles/
    └── global.css

public/
│
├── favicon.ico
└── ...

components.json
vite.config.ts
tsconfig.json
biome.json
package.json
```

## Environment Variables

Required environment variables are documented in:

```text
.env.example
```

Actual environment values are managed through **Infisical** and should not be committed to the repository.

## Deployment

The application is configured for deployment on **Vercel**.

Production builds are created using:

```bash
pnpm build
```

## Branches

```text
development → staging → main
```

* `development` — active development
* `staging` — testing/pre-production
* `main` — production
