# spotQ Frontend

Frontend application for the **spotQ** platform, built with React and TypeScript.

## Tech Stack

* React
* TypeScript
* Vite
* pnpm
* Biome
* React Router
* Zustand
* Infisical
* Vercel

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

```text
src/
├── api/
├── assets/
├── components/
├── constants/
├── context/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── stores/
├── styles/
├── types/
└── utils/
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
