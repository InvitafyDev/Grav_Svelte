# grav-svelte

Componentes de UI para SvelteKit: formularios, tablas CRUD, modales, alertas, sidebar,
acordeón y un mockup de teléfono. Funcionan en Svelte 3, 4 y 5 (peer dependency).

> Este archivo se genera con `node scripts/llms.mjs` desde el código de `src/lib`:
> las props, eventos, slots y tipos de abajo son los reales. La introducción vive en
> `scripts/llms-intro.md`.

## Instalación

```bash
npm install grav-svelte svelte-select   # svelte-select es peer dependency (InputFormSelect, InputFormCascade)
```

Cada módulo tiene su ruta: `grav-svelte/Inputs`, `grav-svelte/CRUD`, `grav-svelte/Modals`,
`grav-svelte/Alerts`, `grav-svelte/Sidebar`, `grav-svelte/Accordion` y `grav-svelte/Preview`.
Todo se exporta también desde `grav-svelte`. Los componentes importan su propia tipografía;
`grav-svelte/typography.css` está disponible para usarla en el resto de la app.

## Convenciones

- **Inputs:** el valor va en `bind:valueVar` (texto, número, fecha, teléfono…). `InputFormSelect`
  es la excepción: `bind:value` con el objeto `{ value, label }`, o `bind:justValue` con solo el ID.
  Sus opciones van en `res` (no `options`).
- **Colores y medidas:** variables CSS `--grav-*` en el contenedor (por ejemplo
  `--grav-crud-color-neutral`, `--grav-crud-color-bg`, `--grav-border-radius-md`,
  `--grav-font-family`). No son clases de Tailwind.
- **Textos:** los componentes no traen i18n; los textos visibles son props con valor por defecto
  y la app pasa los suyos.

## Modales

`ModalContainer` va una sola vez en el layout. Un modal es un componente propio que envuelve su
contenido en `Grav_Modal`, se abre con `openModal(id, Componente, props)` y se cierra con
`closeModal(id)`. Sin `onClose`, la X, Cancelar y Escape no cierran nada:

```svelte
<!-- ModalEditar_Cliente.svelte -->
<script>
  import { Grav_Modal, closeModal } from 'grav-svelte/Modals';
  export let cliente;   // lo pasa openModal('editar-cliente', ModalEditar_Cliente, { cliente })

  async function guardar() { /* … */ closeModal('editar-cliente'); }
</script>

<Grav_Modal title="Editar cliente" size="md" onClose={() => closeModal('editar-cliente')} onSave={guardar}>
  …campos…
</Grav_Modal>
```

## Alertas

`Exito_Alert`, `Error_Alert` y `Confirmacion_Alert` son funciones que montan un componente propio
(no SweetAlert2). `Confirmacion_Alert(titulo, texto, callback)` corre el callback una sola vez,
solo si se confirma.

## Sidebar

`SidebarWrapper` arma cada enlace como `${base}/${baseRoute}/${nombreRuta}`, así que `baseRoute`
es obligatoria (sin ella, los enlaces salen `/undefined/…`). Con `bind:storefullScreen` la app
recuerda si el sidebar está oculto en escritorio.
