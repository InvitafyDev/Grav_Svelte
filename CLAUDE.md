# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the package for production (includes prepack step)
- `npm run preview` - Preview production build locally
- `npm run check` - Run TypeScript type checking with svelte-check
- `npm run check:watch` - Run type checking in watch mode
- `npm run prepack` - Prepare package for publishing (runs svelte-package and publint)

## Architecture Overview

Grav Svelte is a component library built with **SvelteKit** and **TypeScript** that provides reusable UI components. The project is structured as an npm package that exports modular component groups.

### Core Structure
- **Package Type**: Component library for publication to npm
- **Framework**: SvelteKit 2.x with Svelte 5.x
- **Styling**: Tailwind CSS 4.x with custom CSS
- **Build Tool**: Vite with SvelteKit plugin
- **TypeScript**: Strict mode enabled with NodeNext module resolution

### Component Organization
The library is organized into 5 main component modules, each with its own export path:

1. **Modals** (`./Modals`) - Modal dialogs with store-based state management
2. **Inputs** (`./Inputs`) - Form input components (text, number, date, image, etc.)
3. **CRUD** (`./CRUD`) - Data table and CRUD operation components
4. **Sidebar** (`./Sidebar`) - Navigation sidebar components
5. **Alerts** (`./Alerts`) - Alert/notification components using SweetAlert2

### Key Dependencies
- `sweetalert2` - For alert components
- `xlsx` - For Excel export functionality in CRUD components
- `svelte-select` - Peer dependency for select components
- `tailwindcss` - For styling system

### Configuration Files
- `svelte.config.js` - Uses static adapter for documentation site
- `vite.config.ts` - Includes SvelteKit and Tailwind plugins
- `tsconfig.json` - Extends SvelteKit's generated config with strict settings

### Component Interface Patterns
Components follow consistent patterns:
- **ButtonConfig interface** - For configurable action buttons with show/hide logic
- **TableHeader interface** - For CRUD table column definitions with sorting and alignment
- **Modal store pattern** - Centralized modal state management using Svelte stores

### InputFormSelect — Props (svelte-select wrapper)
- `res`: `{ value: any, label: string }[]` — items del dropdown (NO usar `options`)
- `value`: `{ value, label } | null` — binding objeto completo
- `justValue`: `any | null` — binding solo del valor (para IDs)
- `label`: string — etiqueta del campo
- `disabledVar`: boolean
- `changeFunction`: `(e: CustomEvent) => void`
- `onClear`: `() => void`
- `showPlusIcon` / `onPlusClick`: botón "+" al lado del select

### CrudWrapper — Expandable Rows (subrows)
Props for showing child data inline when expanding a row:
- `expandEnabled={true}` — Enables expand/collapse arrows on each row
- `subRowsField="subRows"` — Field name in each item containing the child array
- `subRowHeaders: TableHeader[]` — Column definitions for subrows (if omitted, uses parent headers)
- `idField="noFormularioA"` — Unique ID field for expand tracking

Data must include a `subRows` array in each item. SubRows render using `SubRowsTable.svelte` with their own `CellRenderer` (supports Buttons, Text, etc.). Button `action` callback receives `(id, row)` — the `row` is the subrow item itself.

### CrudWrapper — Drag-and-Drop Reorder
Props for enabling drag-to-reorder rows:
- `dragEnabled={true}` — Enables drag handles on each row
- `orderField="nvOrden"` — Field name that stores the sort order (gets updated on drop)
- `idField="noSeccionA"` — Unique ID field
- `onReorder={(reorderedItems) => ...}` — Callback with only the items whose order changed

**Important:** Drag only works on main rows, NOT on subrows. For reorderable child items, use a separate modal with its own CrudWrapper + `dragEnabled`.

The `onReorder` callback receives items with updated `[orderField]` values. Typical pattern: map to `{ id, newOrder }[]` and POST to a bulk reorder endpoint.

### Development Workflow
This is both a component library AND a documentation site. The `src/routes/` contains demo pages for each component group, while `src/lib/` contains the actual exportable components.