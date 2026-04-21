# Unseen Archive

A Chrome side panel extension for organizing and archiving links and notes locally.

## Features

- **Links & Notes** — save URLs (with favicon display) or rich-text notes via Quill editor
- **Categories** — create color-coded categories to organize items
- **Drag-and-drop reordering** — sort items in any order using dnd-kit
- **Filter by category** — filter the list by category; selection persists via URL hash
- **Local-only storage** — everything stays on your machine via `chrome.storage.local`
- **Keyboard shortcut** — toggle the side panel with `Ctrl+Shift+U` / `Cmd+Shift+U`

## Tech Stack

| Area | Libraries |
|---|---|
| Framework | React 19, TypeScript, React Router v7 |
| State | Redux Toolkit, auto-persisted to `chrome.storage.local` |
| UI | PrimeReact, PrimeIcons, Tailwind CSS, SCSS |
| Drag & drop | dnd-kit |
| Rich text | Quill |
| Validation | Zod |
| Build | Vite, ESBuild (service worker), Sharp (icon generation) |
| Tests | Vitest, Testing Library, Playwright |

## Getting Started

### Prerequisites

- Node.js + npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite dev server on port 3000. Useful for iterating on UI outside the extension context.

### Build the Extension

```bash
npm run build:extension
```

This runs the full build pipeline:
1. Generates `icon-16.png`, `icon-48.png`, `icon-128.png` from `logo.png`
2. Type-checks and bundles the app with Vite → `dist/`
3. Bundles the service worker with ESBuild
4. Copies `manifest.json` and icons into `dist/`

### Load in Chrome

1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `dist/` directory

The extension opens as a side panel. Click the toolbar icon or press `Ctrl+Shift+U` / `Cmd+Shift+U` to toggle it.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build:extension` | Full extension build |
| `npm run build` | TypeScript check + Vite bundle only |
| `npm run build:icons` | Regenerate icons from `logo.png` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI dashboard |
| `npm run test:coverage` | Run tests with coverage report |

Makefile aliases are also available (`make build`, `make test`, `make test-coverage`, etc.).

## Project Structure

```
src/
├── App.tsx               # Root component + routing
├── main.tsx              # React entry point
├── service-worker.ts     # Background worker (shortcuts, icon click)
├── pages/
│   ├── ListPage.tsx      # Item list with filtering and drag-drop
│   ├── AddPage.tsx       # Add link or note
│   └── SettingsPage.tsx  # Settings
└── components/
    └── Layout.tsx        # Navigation wrapper

lib/
├── store/
│   ├── store.ts          # Redux store with chrome.storage persistence
│   ├── itemsSlice.ts     # Items state (add, remove, reorder)
│   ├── categoriesSlice.ts
│   └── listPageSlice.ts  # Active filter state
└── services/
    └── configuration.ts

public/
└── manifest.json         # Chrome Manifest v3
```

## Data & Persistence

State is stored in Redux and auto-synced to `chrome.storage.local` under the key `persist:ua`. In a non-extension context (e.g. the dev server), it falls back to `localStorage`.

**Items** have a `type` of `link` or `note`, an optional `categoryId`, and a `createdAt` timestamp. IDs are UUIDv7.

**Categories** have a `name`, a hex `color`, and a `createdAt` timestamp.

## Permissions

| Permission | Purpose |
|---|---|
| `storage` | Persist items and categories locally |
| `sidePanel` | Render as a Chrome side panel |
