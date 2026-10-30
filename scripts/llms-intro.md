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
- **Marca de una app:** se define solo con variables en el `:root` de su `app.css`, sin `!important`
  ni reglas sobre las clases internas. Cada variable tiene su valor por defecto en el componente:
  - Campos: `--grav-input-bg`, `-border-color`, `-border-color-hover`, `-border-color-focus`,
    `-focus-ring`, `-radius`, `-textarea-radius`, `-padding-x`, `-padding-y`, `-textarea-padding-y`,
    `-color`, `-font-size`, `-icon-color`, `-transition`, `-label-color`, `-label-font-size`,
    `-label-float-color`, `-label-float-font-size`, `-label-float-font-weight`, `-label-float-x`,
    `-label-float-y`, `-label-float-y-compact`, `-label-float-font-size-compact`,
    `-date-label-font-size`.
  - Select: usa las de campos para borde, fondo y foco, y además `--grav-select-radius`,
    `-min-height`, `-padding`, `-label-color`, `-label-font-size`, `-label-font-weight`,
    `-list-radius`, `-list-border`, `-list-shadow`, `-list-padding`, `-plus-radius`,
    `-plus-border-color`.
  - Casilla (`InputFormBool`): `--grav-check-size`, `-radius`, `-padding`, `-margin-right`, `-bg`,
    `-bg-checked`, `-border-color`, `-border-color-checked`, `-color`, `-color-checked`.
  - Modal: `--grav-modal-radius`, `-header-padding`, `-header-border-color`, `-footer-padding`,
    `-footer-border-color`, `-title-font-size`, `-title-font-weight`, `-button-radius`,
    `-button-padding`, `-button-font-family`, `-button-text-transform`, `-save-bg`, `-save-bg-hover`,
    `-save-bg-disabled`, `-save-color`, `-save-shadow`, `-cancel-bg`, `-cancel-bg-hover`,
    `-cancel-color`, `-cancel-color-hover`, `-cancel-border-color`, `-cancel-border-color-hover`.
  - Sidebar: `--grav-sidebar-link-*` (`color`, `color-hover`, `bg-hover`, `font-size`, `font-weight`,
    `padding`, `margin`, `radius`, `display`, `align-items`, `gap`, `width`, `text-transform`,
    `transition`), `--grav-sidebar-icon-color`, `-icon-color-hover`, `--grav-sidebar-active-bg`,
    `-active-color`, `-active-shadow`, `-active-icon-color`, `--grav-sidebar-brand-color`,
    `-brand-font-size`, `-brand-padding` y `--grav-sidebar-logout-*` (`color`, `color-hover`,
    `font-size`, `letter-spacing`, `padding`). La sección actual lleva `aria-current="page"`.
  - CRUD: `--grav-crud-filters-bg`, `-filters-padding`, `-filters-shadow`, `-filters-margin-bottom`,
    `-title-color`, `-title-font-size-mobile`, `-action-bg`, `-action-bg-hover`, `-action-color`,
    `-action-border-color`, `-action-border-color-hover`, `-action-width`, `-action-transition`,
    `-table-bg`, `-table-border`, `-table-container-radius`, `-table-margin-top`, `-table-overflow`,
    `-header-bg`, `-header-shadow`, `-header-padding-y`, `-cell-padding-y`.
  - Alertas y toasts: `--grav-alert-bg`, `-radius`, `-backdrop`, `-title-color`, `-message-color`,
    `-button-radius`, `-cancel-bg`, `-cancel-bg-hover`, `-cancel-color`, `-confirm-bg`,
    `-confirm-bg-hover`, `-confirm-color`, `-confirm-shadow`, `-confirm-shadow-hover`,
    `-destructive-bg`, `-destructive-bg-hover`, `-destructive-shadow`, `-destructive-shadow-hover`;
    por tipo (`success`, `error`, `warning`, `info`): `--grav-alert-<tipo>-bg`, `-color`, `-ring`,
    `-shadow` y `--grav-alert-toast-<tipo>-color`; del toast: `--grav-alert-toast-radius`,
    `-toast-close-color`, `-toast-close-color-hover`, `-toast-close-bg-hover`. En modo oscuro, la
    misma variable con `-dark` al final.
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
