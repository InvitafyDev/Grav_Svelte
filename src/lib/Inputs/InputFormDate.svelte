<script lang="ts">
  import "../typography.css";

  export let valueVar: string = "";
  export let label: string;
  export let disabled = false;
  export let obligatory = false;
  export let icon: string | null = null;

  const inputId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `grav-date-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  /** Formatea YYYY-MM-DD a DD/MM/YYYY para mostrar. Evita depender del input nativo en pantalla. */
  function formatDisplayDate(iso: string): string {
    if (!iso || iso.length < 10) return "";
    const [y, m, d] = iso.slice(0, 10).split("-");
    if (!y || !m || !d) return "";
    return `${d}/${m}/${y}`;
  }

  $: displayValue = formatDisplayDate(valueVar);

  let nativeDateInputRef: HTMLInputElement;

  function openPicker(e?: MouseEvent | KeyboardEvent) {
    if (disabled) return;
    e?.preventDefault?.();
    const input = nativeDateInputRef ?? (document.getElementById(inputId) as HTMLInputElement | null);
    if (!input) return;
    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
      } else {
        input.focus();
        input.click();
      }
    } catch (_) {
      input.focus();
      input.click();
    }
  }
</script>

<div
  class="input-container"
  class:disabled
  role="button"
  tabindex="0"
  on:click={(e) => openPicker(e)}
  on:keydown={(e) => e.key === "Enter" && (e.preventDefault(), openPicker(e))}
>
  {#if icon}
    <div class="icon-wrapper">
      <i class="{icon} icon"></i>
    </div>
  {/if}
  <div
    class="input-wrapper"
    class:has-value={!!valueVar}
  >
    <!-- Texto visible -->
    <span class="display-text" aria-hidden="true">{displayValue || "\u00A0"}</span>
    <label for={inputId} class="input-label">
      {label}
      {#if obligatory}
        <span class="required-mark"> *</span>
      {/if}
    </label>
    <!-- Input encima y clickable: en móviles el toque va directo al input → abre el picker -->
    <input
      bind:this={nativeDateInputRef}
      id={inputId}
      type="date"
      bind:value={valueVar}
      {disabled}
      class="native-date-input"
      aria-label={label}
      tabindex="-1"
    />
  </div>
</div>

<style>
  .input-container {
    display: flex;
    align-items: center;
    border: var(--grav-crud-input-border-width) solid
      var(--grav-crud-color-neutral);
    border-radius: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    margin-top: 1.95rem;
    height: fit-content;
    min-height: 2.5rem;
    overflow: visible;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
  }

  .input-container.disabled {
    cursor: not-allowed;
  }

  .icon-wrapper {
    width: 1rem;
    position: relative;
    margin-right: 0.5rem;
  }

  .icon {
    position: absolute;
    top: -0.4rem;
    left: 0.25rem;
    color: var(--grav-crud-color-neutral);
  }

  .input-wrapper {
    position: relative;
    width: 100%;
    min-height: 2rem;
  }

  /* Texto visible de la fecha: sin pseudo-elementos WebKit */
  .display-text {
    display: block;
    padding: 0.3rem 0;
    width: 100%;
    font-size: 1rem;
    color: var(--grav-crud-color-neutral);
    pointer-events: none;
    min-height: 1.5rem;
    line-height: 1.5;
  }

  .input-wrapper.has-value .display-text {
    color: var(--grav-crud-color-neutral);
  }

  /* Input invisible y que no capture clicks: todo lo maneja el contenedor con openPicker() */
  .native-date-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    pointer-events: none;
    z-index: 0;
    font-size: 16px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .native-date-input:disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  .input-label {
    position: absolute;
    font-size: 1rem;
    text-align: left;
    color: var(--grav-crud-color-neutral);
    transition: transform 0.2s ease, top 0.2s ease, font-size 0.2s ease;
    top: 0.35rem;
    left: 0;
    z-index: 0;
    transform-origin: left;
    pointer-events: none;
  }

  .input-wrapper.has-value .input-label {
    top: -1.5rem;
    left: 0;
    font-size: 0.75rem;
    color: var(--grav-crud-color-neutral);
  }

  .required-mark {
    color: #dc2626;
  }
</style>
