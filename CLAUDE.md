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

### CrudWrapper — Props de traducción (i18n)

Los componentes de la librería NO usan `svelte-i18n` internamente. El patrón es: exportar props string con valores por defecto en inglés; el consumidor pasa `$_('clave')` desde su propio sistema de i18n.

Props traducibles de `CrudWrapper` (completos):
```svelte
<!-- Tooltips de botones de acción -->
tooltipAgregar="Add"
tooltipImportarExcel="Import Excel"
tooltipVerFiltros="View filters"
tooltipConfiguracion="Settings"
tooltipLimpiar="Clear filters"
tooltipFiltrar="Apply filter"
<!-- Labels visibles -->
labelLimpiar="Clear"
labelFiltrar="Filter"
labelMostrando="Showing:"   <!-- texto antes del rango en paginación -->
labelDe="of"                <!-- separador en "1 - 50 of 100" -->
labelRegistros="records"    <!-- al final de la línea de paginación -->
```

Estos props se pasan en cascada internamente: `CrudWrapper` → `CrudFilters` (labelMostrando, labelFiltrar, etc.) y `CrudWrapper` → `PaginationCRUD` (labelMostrando, labelDe, labelRegistros).

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

### PhoneMockup — Preview iframe (`src/lib/Preview/`)
- Muestra un iframe con proporción móvil; en desktop usa `--phone-mockup-h` (CSS custom prop, default `90vh`), en mobile (≤768px) muestra iframe directo centrado.
- **Sandbox debe incluir `allow-forms`**: sin él, el usuario no puede interactuar con formularios ni botones dentro del iframe.
- **Scrollbar hiding**: usa patrón clip — contenedor con `pointer-events: none` + `overflow: hidden`, iframe sobredimensionado `+20px` con `pointer-events: auto`. No intentar ocultar scrollbar del iframe con CSS (es cross-origin).

## Gotchas

- **`npm run check` tiene errores pre-existentes**: `generics.js` tiene implicit `any` types, varios Input components tienen warnings de a11y y unused CSS selectors. Estos NO son bloqueantes — `npm run build` compila correctamente. No investigar estos errores a menos que se pida explícitamente.
- **Cambios en `src/lib/` requieren copiar manualmente a `node_modules` del consumidor**: Editar fuente en `Grav_Svelte/src/lib/CRUD/*.svelte` no afecta a `plataforma.invitafy` hasta copiar los archivos a `plataforma.invitafy/node_modules/grav-svelte/dist/CRUD/`. La librería no se reconstruye automáticamente en desarrollo.
- **NUNCA copiar `src/` sobre `dist/` o `node_modules/`**: Los archivos en `src/lib/` usan `$lib/` aliases (ej: `$lib/index.js`) que solo resuelve SvelteKit. Los archivos en `dist/` y `node_modules/` usan paths relativos (ej: `../index.js`). Copiar `src/` sobre `dist/` rompe todos los imports. Siempre aplicar el fix directamente en `dist/` o copiar desde `dist/` hacia `node_modules/`.
- **Sidebar usa estilos en dos ubicaciones**: Estilos globales del layout en `SidebarWrapper.css`, estilos de cada item con `<style>` scoped en los `.svelte` individuales (ej: `SidebarItem.svelte`). Al modificar sidebar, verificar ambos archivos.

## CrudWrapper — prop `customButtons` (botones extra en la barra) — v0.1.249

Además del slot `headerActions`, `CrudWrapper`/`CrudFilters` aceptan una prop **`customButtons: CustomButtonI[]`**
que renderiza botones extra dentro de `.filters-actions` (junto a Ver filtros / engranaje), con el estilo
nativo `.filter-button` y un **badge de conteo** opcional. Interfaz en `interfaces.ts`:
```ts
export interface CustomButtonI { icon: string; tooltip?: string; badge?: number; onClick: () => void; }
```
Render en `CrudFilters.svelte` (clase `filter-button custom-button` + `<span class="custom-button-badge">`
cuando `badge > 0`; CSS en `CrudFilters.css`). Se pasa en cascada desde `CrudWrapper`.
Uso: `<CrudWrapper customButtons={[{icon:'fas fa-pause', tooltip:'En Espera', badge:n, onClick:fn}]} ... />`.
Preferir esta prop sobre `headerActions` cuando quieras look nativo + badge sin replicar CSS.

**Gotcha — celdas `tipo:'Component'` solo reciben `row`:** `ComponentCell.svelte` hace
`<svelte:component this={header.component} row={item} />`. **`componentProps` del `TableHeader` NO se
propaga** al componente de la celda. Para pasarle datos/callbacks, usar un store de módulo, o una columna
`tipo:'Buttons'` cuyo `action(id)` abra un modal.

**Versión:** estos cambios están en grav-svelte **0.1.249**. admin.invitafy quedó en `^0.1.249` (local vía
symlink). **Para prod hay que publicar la librería a npm** (`npm publish`) antes de desplegar al consumidor.