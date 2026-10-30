<script lang="ts">
  import { onMount, tick } from "svelte";
  import { expoOut, cubicOut } from "svelte/easing";

  export let title: string = "";
  export let message: string = "";
  export let icon: "success" | "error" | "warning" | "info" | "none" = "none";
  export let confirmText: string = "OK";
  export let cancelText: string | null = null;
  export let destructive: boolean = false;
  export let onConfirm: () => void = () => {};
  export let onCancel: () => void = () => {};
  export let onDestroy: () => void = () => {};

  let visible = false;
  let cerrando = false;
  let dialogo: HTMLElement;
  let botonCancelar: HTMLButtonElement;
  let botonConfirmar: HTMLButtonElement;

  // Lo que tenía el foco antes de la alerta (un campo de un modal, el botón de
  // eliminar…): se le devuelve al cerrar.
  const focoPrevio: HTMLElement | null =
    typeof document !== "undefined" &&
    document.activeElement instanceof HTMLElement &&
    document.activeElement !== document.body
      ? document.activeElement
      : null;

  // Una sola vez: un doble clic, o Enter después de un clic, durante la animación
  // de salida ya no vuelve a correr la acción (un DELETE o un POST repetidos).
  function close(callback: () => void) {
    if (cerrando) return;
    cerrando = true;
    visible = false;
    setTimeout(() => {
      if (focoPrevio && focoPrevio.isConnected) focoPrevio.focus({ preventScroll: true });
      try {
        callback();
      } finally {
        onDestroy();
      }
    }, 240);
  }

  function handleConfirm() {
    close(onConfirm);
  }

  function handleCancel() {
    close(onCancel);
  }

  function handleBackdropClick() {
    if (cancelText !== null) handleCancel();
  }

  function enfocarBotonSeguro() {
    // En una confirmación, el seguro es «No»; en un aviso solo hay «OK».
    const boton = cancelText !== null ? botonCancelar : botonConfirmar;
    if (boton) boton.focus({ preventScroll: true });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (cerrando || e.isComposing) return;
    const enfocado = document.activeElement;
    const dentro = !!dialogo && enfocado instanceof Node && dialogo.contains(enfocado);

    if (e.key === "Enter") {
      // Con el foco en uno de los botones, Enter lo activa como a cualquier botón:
      // el click nativo llama a handleConfirm o a handleCancel.
      if (dentro && enfocado instanceof HTMLButtonElement) return;
      e.preventDefault();
      // Fuera de los botones, Enter solo cierra un aviso de un botón; una
      // confirmación nunca se acepta sin el foco en «Sí».
      if (cancelText === null) handleConfirm();
      else enfocarBotonSeguro();
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (cancelText !== null) handleCancel();
      else handleConfirm();
    } else if (e.key === "Tab") {
      // El foco no se sale a la página de atrás, que el fondo tapa.
      e.preventDefault();
      const botones = [botonCancelar, botonConfirmar].filter(Boolean);
      const i = botones.indexOf(enfocado as HTMLButtonElement);
      const siguiente = e.shiftKey ? i - 1 : i + 1;
      botones[(siguiente + botones.length) % botones.length].focus();
    }
  }

  onMount(() => {
    // Disparar el {#if} en el siguiente frame garantiza que la transición de entrada se ejecute
    requestAnimationFrame(async () => {
      visible = true;
      await tick();
      enfocarBotonSeguro();
    });
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  // Spring con overshoot visible — easing custom (más fuerte que backOut)
  // Se aplica al SCALE/TRANSLATE para que el sobrepaso se note
  function strongSpring(t: number): number {
    const c = 2.4;
    return 1 + c * Math.pow(t - 1, 3) + (c - 1) * Math.pow(t - 1, 2);
  }

  function dialogIn(_node: Element, { duration = 550 } = {}) {
    return {
      duration,
      css: (t: number) => {
        const sp = strongSpring(t);
        const scale = 0.7 + 0.3 * sp;
        const translate = 30 * (1 - sp);
        const opacity = Math.min(1, t * 2.5);
        return `
          opacity: ${opacity};
          transform: scale(${scale}) translateY(${translate}px);
          transform-origin: center center;
        `;
      },
    };
  }

  function dialogOut(_node: Element, { duration = 220 } = {}) {
    return {
      duration,
      easing: cubicOut,
      css: (t: number) => `
        opacity: ${t};
        transform: scale(${0.94 + 0.06 * t}) translateY(${10 * (1 - t)}px);
        transform-origin: center center;
      `,
    };
  }

  // Backdrop: fade + blur progresivo (pequeña animación de entrada)
  function backdropIn(_node: Element, { duration = 400 } = {}) {
    return {
      duration,
      easing: expoOut,
      css: (t: number) => `
        opacity: ${t};
        backdrop-filter: blur(${8 * t}px) saturate(${100 + 40 * t}%);
        -webkit-backdrop-filter: blur(${8 * t}px) saturate(${100 + 40 * t}%);
      `,
    };
  }

  function backdropOut(_node: Element, { duration = 220 } = {}) {
    return {
      duration,
      easing: cubicOut,
      css: (t: number) => `
        opacity: ${t};
        backdrop-filter: blur(${8 * t}px) saturate(${100 + 40 * t}%);
        -webkit-backdrop-filter: blur(${8 * t}px) saturate(${100 + 40 * t}%);
      `,
    };
  }
</script>

{#if visible}
  <div class="modern-alert-root" role="alertdialog" aria-modal="true">
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div
      class="modern-alert-backdrop"
      in:backdropIn={{ duration: 400 }}
      out:backdropOut={{ duration: 220 }}
      on:click={handleBackdropClick}
    ></div>

    <div
      bind:this={dialogo}
      class="modern-alert-dialog"
      in:dialogIn={{ duration: 550 }}
      out:dialogOut={{ duration: 220 }}
    >
      {#if icon !== "none"}
        <div class="modern-alert-icon-wrap modern-alert-icon-{icon}">
          <div class="modern-alert-icon-ring"></div>
          <div class="modern-alert-icon-circle">
            {#if icon === "success"}
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <path
                  class="check-path"
                  d="M14 27 l8 8 l16 -16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            {:else if icon === "error"}
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <path
                  class="cross-path-1"
                  d="M17 17 L35 35"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3.5"
                  stroke-linecap="round"
                />
                <path
                  class="cross-path-2"
                  d="M35 17 L17 35"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3.5"
                  stroke-linecap="round"
                />
              </svg>
            {:else if icon === "warning"}
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <path
                  class="warn-stem"
                  d="M26 14 L26 30"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3.5"
                  stroke-linecap="round"
                />
                <circle
                  class="warn-dot"
                  cx="26"
                  cy="37"
                  r="2"
                  fill="currentColor"
                />
              </svg>
            {:else if icon === "info"}
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <path
                  class="info-stem"
                  d="M26 22 L26 38"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3.5"
                  stroke-linecap="round"
                />
                <circle
                  class="info-dot"
                  cx="26"
                  cy="15"
                  r="2"
                  fill="currentColor"
                />
              </svg>
            {/if}
          </div>
        </div>
      {/if}

      <div class="modern-alert-content">
        {#if title}
          <h3 class="modern-alert-title">{title}</h3>
        {/if}
        {#if message}
          <p class="modern-alert-message">{message}</p>
        {/if}
      </div>

      <div class="modern-alert-actions" class:single={cancelText === null}>
        {#if cancelText !== null}
          <button
            type="button"
            class="modern-alert-btn modern-alert-btn-cancel"
            bind:this={botonCancelar}
            on:click={handleCancel}>{cancelText}</button
          >
        {/if}
        <button
          type="button"
          class="modern-alert-btn modern-alert-btn-confirm"
          bind:this={botonConfirmar}
          class:destructive={destructive || icon === "error"}
          on:click={handleConfirm}>{confirmText}</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .modern-alert-root {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    font-family:
      "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", sans-serif;
  }

  .modern-alert-backdrop {
    position: absolute;
    inset: 0;
    background: var(--grav-alert-backdrop, rgba(15, 23, 42, 0.3));
    backdrop-filter: blur(8px) saturate(140%);
    -webkit-backdrop-filter: blur(8px) saturate(140%);
    cursor: pointer;
  }

  .modern-alert-dialog {
    position: relative;
    width: 100%;
    max-width: 420px;
    background: var(--grav-alert-bg, #ffffff);
    border-radius: var(--grav-alert-radius, 20px);
    box-shadow:
      0 30px 60px -15px rgba(0, 0, 0, 0.3),
      0 12px 24px -10px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(0, 0, 0, 0.04);
    padding: 2rem 1.75rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.25rem;
    transform-origin: center center;
    will-change: transform, opacity;
    text-align: center;
  }

  /* Icono grande centrado en la parte superior */
  .modern-alert-icon-wrap {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modern-alert-icon-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    opacity: 0.18;
    animation: ring-pulse 1.6s ease-out infinite;
  }

  .modern-alert-icon-circle {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modern-alert-icon-circle svg {
    width: 56px;
    height: 56px;
  }

  /* Color schemes */
  .modern-alert-icon-success .modern-alert-icon-ring {
    background: radial-gradient(
      circle,
      rgba(34, 197, 94, 0.45) 0%,
      rgba(34, 197, 94, 0) 70%
    );
  }
  .modern-alert-icon-success .modern-alert-icon-circle {
    background: var(
      --grav-alert-success-bg,
      linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)
    );
    color: var(--grav-alert-success-color, #15803d);
    box-shadow: var(
      --grav-alert-success-shadow,
      0 8px 24px -6px rgba(34, 197, 94, 0.35)
    );
  }

  .modern-alert-icon-error .modern-alert-icon-ring {
    background: var(
      --grav-alert-error-ring,
      radial-gradient(
      circle,
      rgba(239, 68, 68, 0.45) 0%,
      rgba(239, 68, 68, 0) 70%
      )
    );
  }
  .modern-alert-icon-error .modern-alert-icon-circle {
    background: var(
      --grav-alert-error-bg,
      linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)
    );
    color: var(--grav-alert-error-color, #b91c1c);
    box-shadow: var(
      --grav-alert-error-shadow,
      0 8px 24px -6px rgba(239, 68, 68, 0.35)
    );
  }

  .modern-alert-icon-warning .modern-alert-icon-ring {
    background: var(
      --grav-alert-warning-ring,
      radial-gradient(
      circle,
      rgba(245, 158, 11, 0.45) 0%,
      rgba(245, 158, 11, 0) 70%
      )
    );
  }
  .modern-alert-icon-warning .modern-alert-icon-circle {
    background: var(
      --grav-alert-warning-bg,
      linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)
    );
    color: var(--grav-alert-warning-color, #b45309);
    box-shadow: var(
      --grav-alert-warning-shadow,
      0 8px 24px -6px rgba(245, 158, 11, 0.35)
    );
  }

  .modern-alert-icon-info .modern-alert-icon-ring {
    background: var(
      --grav-alert-info-ring,
      radial-gradient(
      circle,
      rgba(59, 130, 246, 0.45) 0%,
      rgba(59, 130, 246, 0) 70%
      )
    );
  }
  .modern-alert-icon-info .modern-alert-icon-circle {
    background: var(
      --grav-alert-info-bg,
      linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)
    );
    color: var(--grav-alert-info-color, #1d4ed8);
    box-shadow: var(
      --grav-alert-info-shadow,
      0 8px 24px -6px rgba(59, 130, 246, 0.35)
    );
  }

  /* Animación de dibujo de los iconos SVG */
  .check-path {
    stroke-dasharray: 36;
    stroke-dashoffset: 36;
    animation: draw-stroke 0.5s 0.15s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }
  .cross-path-1,
  .cross-path-2 {
    stroke-dasharray: 26;
    stroke-dashoffset: 26;
    animation: draw-stroke 0.32s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }
  .cross-path-1 {
    animation-delay: 0.15s;
  }
  .cross-path-2 {
    animation-delay: 0.3s;
  }
  .warn-stem,
  .info-stem {
    stroke-dasharray: 16;
    stroke-dashoffset: 16;
    animation: draw-stroke 0.32s 0.15s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }
  .warn-dot,
  .info-dot {
    transform: scale(0);
    transform-origin: center;
    transform-box: fill-box;
    animation: pop-dot 0.25s 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  @keyframes draw-stroke {
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes pop-dot {
    to {
      transform: scale(1);
    }
  }
  @keyframes ring-pulse {
    0% {
      transform: scale(0.85);
      opacity: 0.25;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.05;
    }
    100% {
      transform: scale(0.85);
      opacity: 0.25;
    }
  }

  /* Contenido */
  .modern-alert-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0 0.5rem;
  }

  .modern-alert-title {
    margin: 0;
    padding: 0;
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.3;
    color: var(--grav-alert-title-color, #0f172a);
    letter-spacing: -0.02em;
  }

  .modern-alert-message {
    margin: 0;
    padding: 0;
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--grav-alert-message-color, #64748b);
  }

  /* Acciones — botones centrados, mismo ancho */
  .modern-alert-actions {
    display: flex;
    justify-content: center;
    gap: 0.625rem;
    margin-top: 0.5rem;
  }

  .modern-alert-actions.single {
    justify-content: stretch;
  }

  .modern-alert-actions.single .modern-alert-btn {
    flex: 1;
  }

  .modern-alert-actions:not(.single) .modern-alert-btn {
    flex: 1;
  }

  .modern-alert-btn {
    height: 44px;
    padding: 0 1.25rem;
    border-radius: var(--grav-alert-button-radius, 10px);
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      transform 0.08s ease,
      box-shadow 0.15s ease;
    border: 1px solid transparent;
    font-family: inherit;
    letter-spacing: -0.005em;
  }

  .modern-alert-btn:active {
    transform: scale(0.97);
  }

  .modern-alert-btn-cancel {
    background: var(--grav-alert-cancel-bg, #f1f5f9);
    color: var(--grav-alert-cancel-color, #334155);
  }
  .modern-alert-btn-cancel:hover {
    background: var(--grav-alert-cancel-bg-hover, #e2e8f0);
  }

  .modern-alert-btn-confirm {
    background: var(--grav-alert-confirm-bg, #0f172a);
    color: var(--grav-alert-confirm-color, #ffffff);
    box-shadow: var(
      --grav-alert-confirm-shadow,
      0 4px 12px -2px rgba(15, 23, 42, 0.3)
    );
  }
  .modern-alert-btn-confirm:hover {
    background: var(--grav-alert-confirm-bg-hover, #1e293b);
    box-shadow: var(
      --grav-alert-confirm-shadow-hover,
      0 6px 16px -2px rgba(15, 23, 42, 0.4)
    );
  }

  .modern-alert-btn-confirm.destructive {
    background: var(
      --grav-alert-destructive-bg,
      linear-gradient(180deg, #ef4444 0%, #dc2626 100%)
    );
    box-shadow: var(
      --grav-alert-destructive-shadow,
      0 4px 12px -2px rgba(220, 38, 38, 0.4)
    );
  }
  .modern-alert-btn-confirm.destructive:hover {
    background: var(
      --grav-alert-destructive-bg-hover,
      linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)
    );
    box-shadow: var(
      --grav-alert-destructive-shadow-hover,
      0 6px 16px -2px rgba(220, 38, 38, 0.5)
    );
  }

  @media (prefers-color-scheme: dark) {
    .modern-alert-dialog {
      background: var(--grav-alert-bg-dark, #18181b);
      box-shadow:
        0 30px 60px -15px rgba(0, 0, 0, 0.7),
        0 12px 24px -10px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.06);
    }
    .modern-alert-title {
      color: var(--grav-alert-title-color-dark, #fafafa);
    }
    .modern-alert-message {
      color: var(--grav-alert-message-color-dark, #a1a1aa);
    }
    .modern-alert-icon-success .modern-alert-icon-circle {
      background: var(
        --grav-alert-success-bg-dark,
        linear-gradient(
        135deg,
        rgba(34, 197, 94, 0.2) 0%,
        rgba(34, 197, 94, 0.1) 100%
        )
      );
      color: var(--grav-alert-success-color-dark, #4ade80);
    }
    .modern-alert-icon-error .modern-alert-icon-circle {
      background: var(
        --grav-alert-error-bg-dark,
        linear-gradient(
        135deg,
        rgba(239, 68, 68, 0.2) 0%,
        rgba(239, 68, 68, 0.1) 100%
        )
      );
      color: var(--grav-alert-error-color-dark, #f87171);
    }
    .modern-alert-icon-warning .modern-alert-icon-circle {
      background: var(
        --grav-alert-warning-bg-dark,
        linear-gradient(
        135deg,
        rgba(245, 158, 11, 0.2) 0%,
        rgba(245, 158, 11, 0.1) 100%
        )
      );
      color: var(--grav-alert-warning-color-dark, #fbbf24);
    }
    .modern-alert-icon-info .modern-alert-icon-circle {
      background: var(
        --grav-alert-info-bg-dark,
        linear-gradient(
        135deg,
        rgba(59, 130, 246, 0.2) 0%,
        rgba(59, 130, 246, 0.1) 100%
        )
      );
      color: var(--grav-alert-info-color-dark, #60a5fa);
    }
    .modern-alert-btn-cancel {
      background: var(--grav-alert-cancel-bg-dark, #27272a);
      color: var(--grav-alert-cancel-color-dark, #e4e4e7);
    }
    .modern-alert-btn-cancel:hover {
      background: var(--grav-alert-cancel-bg-hover-dark, #3f3f46);
    }
    .modern-alert-btn-confirm {
      background: var(--grav-alert-confirm-bg-dark, #fafafa);
      color: var(--grav-alert-confirm-color-dark, #0f172a);
      box-shadow: var(
        --grav-alert-confirm-shadow-dark,
        0 4px 12px -2px rgba(255, 255, 255, 0.15)
      );
    }
    .modern-alert-btn-confirm:hover {
      background: var(--grav-alert-confirm-bg-hover-dark, #e4e4e7);
    }
  }
</style>
