# HireFlow

HireFlow is a single-page application for managing tool hire businesses. It helps teams keep track of tools, customers, hires, and reports with an offline-friendly LocalStorage data store.

## Getting started

```bash
npm install
npm run dev
```

The development server runs at http://localhost:5173 by default.

## Scripts

- `npm run dev` – start the Vite dev server
- `npm run build` – type-check and build the production bundle
- `npm run preview` – preview the production build locally
- `npm run test` – run unit tests with Vitest
- `npm run lint` – run ESLint across the source files
- `npm run format` – format the codebase with Prettier

## Architecture

- **React + TypeScript** for the UI
- **Tailwind CSS** for styling
- **Zod** for runtime validation
- **LocalStorage adapter** for persistence (Supabase adapter scaffold included)
- **Vitest + React Testing Library** for tests

## Testing

Run the test suite with:

```bash
npm run test
```

## Accessibility

- Semantic markup and labeled form fields
- Keyboard-accessible modals with focus trapping
- Visible focus states via Tailwind utility classes

## Data import/export

Use the Settings page to export a JSON backup or import JSON/CSV data. CSV import accepts a header row matching tool fields.
