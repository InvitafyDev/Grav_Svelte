<script context="module" lang="ts">
  let siguienteId = 0;
</script>

<script lang="ts">
  import "./Grav_Modal.css";
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { expoOut, cubicOut } from "svelte/easing";

  // Apple-like modal entrance: scale + slight translateY + opacity
  function appleModal(
    _node: Element,
    { duration = 400, reverse = false } = {},
  ) {
    return {
      duration,
      easing: reverse ? cubicOut : expoOut,
      css: (t: number) => {
        const scale = 0.92 + 0.08 * t;
        const translate = 16 * (1 - t);
        return `
          opacity: ${t};
          transform: scale(${scale}) translateY(${translate}px);
          transform-origin: center center;
        `;
      },
    };
  }

  // Define size type
  type ModalSize = "lg" | "md" | "sm" | "xs";

  // Props interface
  interface $$Props {
    title?: string;
    onClose?: () => void;
    onSave?: () => void;
    saveButtonText?: string;
    cancelButtonText?: string;
    saveButtonDisabled?: boolean;
    loading?: boolean;
    size?: ModalSize;
    isVista?: boolean;
  }

  // Default props
  export let title = "Modal Title";
  export let onClose = () => {};
  export let onSave = () => {};
  export let saveButtonText = "Guardar";
  export let cancelButtonText = "Cancelar";
  export let saveButtonDisabled = false;
  export let loading = false;
  export let size: ModalSize = "lg";
  export let isVista = false;

  // Size classes mapping
  const sizeClasses: Record<ModalSize, string> = {
    lg: "w-full min-h-screen",
    md: "sm:w-3/4 w-7/8 min-h-[80vh]",
    sm: "sm:w-1/3 w-3/4 min-h-[60vh]",
    xs: "sm:w-1/4 w-3/4 min-h-[40vh]",
  };

  // Get the current size class
  $: currentSizeClass = sizeClasses[size];

  const tituloId = `grav-modal-titulo-${++siguienteId}`;
  let dialogo: HTMLElement;

  // Al abrir, el foco entra al modal (así Escape y Tab funcionan sin un clic previo);
  // al cerrar, regresa a lo que lo tenía, normalmente el botón que lo abrió.
  // Se lee al crear el componente: el onMount del contenido corre antes que el de aquí.
  const focoPrevio: HTMLElement | null =
    typeof document !== "undefined" &&
    document.activeElement instanceof HTMLElement &&
    document.activeElement !== document.body
      ? document.activeElement
      : null;

  onMount(() => {
    // Si el contenido ya enfocó un campo (autofocus propio), se respeta.
    if (!dialogo.contains(document.activeElement)) dialogo.focus({ preventScroll: true });
  });

  onDestroy(() => {
    if (typeof document === "undefined") return;
    if (focoPrevio && focoPrevio.isConnected) focoPrevio.focus({ preventScroll: true });
  });

  const ENFOCABLES = [
    "a[href]",
    "button:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(",");

  function enfocables(): HTMLElement[] {
    return Array.from(dialogo.querySelectorAll<HTMLElement>(ENFOCABLES)).filter(
      (el) => el.getClientRects().length > 0,
    );
  }

  // Tab y Shift+Tab dan la vuelta dentro del modal, sin salirse a la página de atrás.
  function atraparTab(event: KeyboardEvent) {
    const lista = enfocables();
    const activo = document.activeElement;
    if (lista.length === 0) {
      event.preventDefault();
      dialogo.focus();
      return;
    }
    const primero = lista[0];
    const ultimo = lista[lista.length - 1];
    const fuera = !(activo instanceof Node) || !dialogo.contains(activo);
    if (event.shiftKey && (fuera || activo === primero || activo === dialogo)) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && (fuera || activo === ultimo)) {
      event.preventDefault();
      primero.focus();
    }
  }

  const TIPOS_SIN_TEXTO = [
    "checkbox", "radio", "button", "submit", "reset", "file", "color", "range", "image",
  ];

  // Enter guarda solo desde un campo donde se escribe. Sobre un botón (Cancelar, la X,
  // el ojo de la contraseña, el "+" del select) o un checkbox, Enter activa ese control.
  function esCampoDeTexto(el: EventTarget | null): boolean {
    if (!(el instanceof HTMLInputElement)) return false;
    return !TIPOS_SIN_TEXTO.includes(el.type);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.isComposing) return;
    // Con una alerta abierta (Error_Alert, Confirmacion_Alert) las teclas son suyas:
    // la alerta escucha en window y este handler no debe frenar el evento antes.
    if (document.querySelector(".modern-alert-dialog")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    } else if (event.key === "Tab") {
      event.stopPropagation();
      atraparTab(event);
    } else if (
      event.key === "Enter" &&
      !saveButtonDisabled &&
      !loading &&
      esCampoDeTexto(event.target)
    ) {
      event.preventDefault();
      event.stopPropagation();
      onSave();
    }
  }

  // Un clic en el fondo del overlay devuelve el foco al modal
  function handleClick(event: MouseEvent) {
    if (event.target === event.currentTarget) dialogo.focus({ preventScroll: true });
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events a11y_no_static_element_interactions a11y_click_events_have_key_events -->
<div class="modal-overlay" on:keydown={handleKeydown} on:click={handleClick}>
  <!--content-->
  <div
    bind:this={dialogo}
    class="modal-content {size}"
    role="dialog"
    aria-modal="true"
    aria-labelledby={tituloId}
    tabindex="-1"
    in:appleModal={{ duration: 400 }}
    out:appleModal={{ duration: 250, reverse: true }}
  >
    <!-- Encabezado Modal -->
    <div class="modal-header">
      <h3 class="modal-title" id={tituloId}>
        {title}
      </h3>
      <!-- Cerrar Modal -->
      <button class="modal-close-button" type="button" aria-label="Cerrar" on:click={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="modal-close-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <!-- /Cerrar Modal -->
    </div>
    <!-- Encabezado Modal -->

    {#if loading}
      <div class="modal-loading">
        <div class="modal-loading-spinner">
          <svg
            class="modal-loading-svg"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    {:else}
      <!-- Cuerpo Modal -->
      <div class="modal-body">
        <slot />
      </div>
      <!-- /Cuerpo Modal -->

      {#if !isVista}
        <!-- Pie Modal -->
        <div class="modal-footer">
          <!-- Cerrar Modal -->
          <button class="modal-cancel-button" type="button" on:click={onClose}>
            {cancelButtonText}
          </button>
          <!-- /Cerrar Modal -->
          <!-- Btn Guardar -->
          <button
            class="modal-save-button"
            type="button"
            on:click={onSave}
            disabled={saveButtonDisabled}
          >
            {saveButtonText}
          </button>
          <!-- /Btn Guardar -->
        </div>
        <!-- /Pie Modal -->
      {/if}
    {/if}
  </div>
</div>
<div
  class="modal-backdrop"
  in:fade={{ duration: 350, easing: expoOut }}
  out:fade={{ duration: 200, easing: cubicOut }}
/>
