# SpotQ Frontend Architecture Guide

This document defines the architectural principles, component guidelines, and standards for `spotq-frontend`.

---

## 1. Feature-Based Architecture

The application is structured into cohesive domain features located under `src/features/`. Each feature encapsulates its own business logic, presentation components, API communication, and state management.

### Directory Structure per Feature
```text
src/features/<feature-name>/
├── components/          # Feature-specific UI components & sub-views
├── hooks/               # TanStack Query hooks, form controllers, and local state hooks
├── services/            # Domain API client functions using Ky (zero direct JSX imports)
├── schemas/             # Zod validation schemas for forms and mutations
├── types/               # TypeScript interfaces, DTOs, and domain model contracts
├── constants/           # Centralized message strings, error messages, and preset values
└── pages/               # Route-level page components (composed of feature components)
```

### Separation of Concerns
1. **Presentation (Components & Pages)**: Pure presentation layer. Responsible for rendering layout, displaying states (loading, empty, error, success), and dispatching events. Must not execute Ky HTTP queries directly.
2. **State & Orchestration (Hooks)**: Encapsulates TanStack Query (`useQuery`, `useMutation`), form validation bindings (`useForm`), and local component state.
3. **Data Access (Services)**: Pure asynchronous functions delegating network communication to the centralized Ky HTTP client (`@/lib/api/ky-client`). Provides clean typing and API decoupling.
4. **Validation (Schemas)**: Centralized Zod schemas consumed by React Hook Form resolvers and runtime assertions.

---

## 2. Reusable Form Primitives

Standardized form primitives reside in `@/components/common/form/`:

- `FormField`: Accessible wrapper managing field labels, required asterisks, description hints, and inline error displays (`FormError`).
- `FormInput`: Composable text, email, and number input with leading/trailing icon support and `forwardRef` integration for React Hook Form.
- `PasswordField`: Accessible password input with integrated show/hide toggle and leading lock slot.
- `SubmitButton`: Action button with automated loading spinner (`Loader2`), `loadingText`, and `aria-busy` state.
- `FormError`: Accessible error container (`role="alert"`).

### Usage Example
```tsx
import { FormField, FormInput, PasswordField, SubmitButton } from "@/components/common/form";

<form onSubmit={handleSubmit(onSubmit)}>
  <FormField label="Email Address" required error={errors.email?.message}>
    <FormInput
      type="email"
      placeholder="user@example.com"
      {...register("email")}
    />
  </FormField>

  <FormField label="Password" required error={errors.password?.message}>
    <PasswordField
      placeholder="Enter password"
      {...register("password")}
    />
  </FormField>

  <SubmitButton isLoading={isSubmitting} loadingText="Signing in...">
    Sign In
  </SubmitButton>
</form>
```

---

## 3. Reusable Skeletons & Loaders

Loading states are standardized via shared skeleton primitives in `@/components/common/skeletons/`:

- `CardSkeleton`: For card layouts with configurable aspect ratio and line count.
- `TableSkeleton`: Configurable row and column count matching data table dimensions.
- `FormSkeleton`: 1 or 2 column field layout with button skeleton for edit screens.
- `ListSkeleton`: Avatar + multi-line row list skeleton.
- `DetailSkeleton`: Detail page banner, avatar header, and metrics grid.
- `PageSkeleton`: Top-level page layout skeleton variants (`cards`, `table`, `form`, `detail`).

---

## 4. Google Material Design 3 (M3) Standards

SpotQ adheres to Google Material Design 3 color and elevation principles:

### Surface Container Tokens (`src/styles/global.css`)
- `--color-surface-container-lowest`: Base surface for recessed elements.
- `--color-surface-container-low`: Low-elevation surface.
- `--color-surface-container`: Default surface level for cards and modals.
- `--color-surface-container-high`: Elevated dialogs, tooltips, and floating menus.
- `--color-surface-container-highest`: Highest container tier.

### SpotQ Warm Brand Palette
- Warm Surface: `--color-spotq-warm-surface` (`#faf7f5`)
- Warm Border: `--color-spotq-warm-border` (`#eddcd4`)
- Primary Brand Orange: `#e8631b` / Deep Brick: `#9a3412`

All interactive elements must provide visible hover, focus-visible ring (`ring-[#e8631b]`), active/pressed, and disabled states with accessible color contrast.

---

## 5. Component & File Decomposition (300-Line Guideline)

To maintain long-term maintainability, source files must adhere to a **300-line guideline**:

- Decompose complex pages into specialized subcomponents (e.g. stats cards, filter bars, column definitions, section cards).
- Extract table column definitions into dedicated hooks (e.g. `useRestaurantStaffColumns.tsx`).
- Extract multipart forms into section-level components (e.g. `MenuItemGeneralInfoSection.tsx`).

### Documented Exceptions
Files exceeding 300 lines are only permitted when splitting would introduce unnecessary fragmentation or impair readability:
- Static legal text pages (`RestaurantTermsPage.tsx`, `TermsAndConditionsPage.tsx`) containing continuous regulatory prose.
- Complex end-to-end component test suites (`DataTable.test.tsx`, `EditStaffProfilePage.test.tsx`) asserting extensive integration scenarios.

