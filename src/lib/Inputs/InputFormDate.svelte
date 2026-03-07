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

  function formatDisplayDate(iso: string): string {
    if (!iso || iso.length < 10) return "";
    const [y, m, d] = iso.slice(0, 10).split("-");
    if (!y || !m || !d) return "";
    return `${d}/${m}/${y}`;
  }

  $: displayValue = formatDisplayDate(valueVar);
</script>

<!-- Contenedor con position relative para que el input absoluto cubra todo -->
<div class="input-container" class:disabled>
  <!-- Contenido visible (debajo del input): icono, texto, label -->
  {#if icon}
    <div class="icon-wrapper">
      <i class="{icon} icon"></i>
    </div>
  {/if}
  <div class="input-wrapper" class:has-value={!!valueVar}>
    <span class="display-text" aria-hidden="true">{displayValue || "\u00A0"}</span>
    <label for={inputId} class="input-label">
      {label}
      {#if obligatory}
        <span class="required-mark"> *</span>
      {/if}
    </label>
  </div>
  <!-- Input nativo encima de todo: cubre el 100% del contenedor y recibe click/toque directo en PC y móvil -->
  <input
    id={inputId}
    type="date"
    bind:value={valueVar}
    {disabled}
    class="native-date-input"
    aria-label={label}
  />
</div>

<style>
  .input-container {
    position: relative;
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
    min-height: 2.75rem;
    overflow: visible;
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
    pointer-events: none;
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
    pointer-events: none;
  }

  .display-text {
    display: block;
    padding: 0.3rem 0;
    width: 100%;
    font-size: 1rem;
    color: var(--grav-crud-color-neutral);
    min-height: 1.5rem;
    line-height: 1.5;
  }

  .input-wrapper.has-value .display-text {
    color: var(--grav-crud-color-neutral);
  }

  .input-label {
    position: absolute;
    font-size: 1rem;
    text-align: left;
    color: var(--grav-crud-color-neutral);
    transition: transform 0.2s ease, top 0.2s ease, font-size 0.2s ease;
    top: 0.35rem;
    left: 0;
    transform-origin: left;
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

  /*
   * Input nativo encima de todo el contenedor (icono + wrapper).
   * inset: 0 + position absolute = cubre el 100% del .input-container.
   * El usuario toca/clica directamente este input → abre el picker en todos los dispositivos.
   */
  .native-date-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    opacity: 0;
    font-size: 16px;
    cursor: pointer;
    z-index: 1;
    -webkit-tap-highlight-color: transparent;
    color: transparent;
    caret-color: transparent;
  }

  .native-date-input::-webkit-calendar-picker-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    cursor: pointer;
    opacity: 0;
  }

  .native-date-input:disabled {
    cursor: not-allowed;
    pointer-events: none;
  }
</style>
