<script lang="ts">
  import "../typography.css";

  export let valueVar: string = "";
  export let label: string;
  export let disabled = false;
  export let obligatory = false;
  export let icon: string | null = null;
</script>

<div class="input-container">
  {#if icon}
    <div class="icon-wrapper">
      <i class="{icon} icon"></i>
    </div>
  {/if}
  <div class="input-wrapper" class:has-value={!!valueVar}>
    <input
      {disabled}
      type="time"
      bind:value={valueVar}
      class="input-field"
    />

    <label class="input-label"
      >{label}
      {#if obligatory}
        <span class="required-mark"> *</span>
      {/if}</label
    >
  </div>
</div>

<style>
  .input-container {
    display: flex;
    align-items: center;
    border: var(--grav-crud-input-border-width) solid
      var(--grav-input-border-color, var(--grav-crud-color-neutral));
    border-radius: var(--grav-input-radius, 0.5rem);
    padding-left: var(--grav-input-padding-x, 0.5rem);
    padding-right: var(--grav-input-padding-x, 0.5rem);
    padding-top: var(--grav-input-padding-y, 0.2rem);
    padding-bottom: var(--grav-input-padding-y, 0.2rem);
    margin-top: 1.95rem;
    background: var(--grav-input-bg, transparent);
    transition: var(--grav-input-transition, all 0s);
    height: fit-content;
  }

  .input-container:hover {
    border-color: var(
      --grav-input-border-color-hover,
      var(--grav-input-border-color, var(--grav-crud-color-neutral))
    );
  }

  .input-container:focus-within {
    border-color: var(
      --grav-input-border-color-focus,
      var(--grav-input-border-color, var(--grav-crud-color-neutral))
    );
    box-shadow: var(--grav-input-focus-ring, none);
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
    color: var(--grav-input-icon-color, var(--grav-crud-color-neutral));
  }

  .input-wrapper {
    position: relative;
    z-index: 0;
    width: 100%;
  }

  .input-field {
    display: block;
    padding: 0.3rem;
    width: 100%;
    font-size: var(--grav-input-font-size, 1rem);
    color: var(--grav-input-color, var(--grav-crud-color-neutral));
    background: transparent;
    appearance: none;
  }

  /* Ocultar placeholder nativo (horas) cuando está vacío en WebKit/iOS */
  .input-field::-webkit-datetime-edit {
    color: transparent;
  }

  /* Mostrar el texto cuando hay valor o está en foco */
  .input-field:focus::-webkit-datetime-edit,
  .input-wrapper.has-value .input-field::-webkit-datetime-edit {
    color: var(--grav-crud-color-neutral);
  }

  .input-field::-webkit-calendar-picker-indicator {
    color: var(--grav-crud-color-neutral);
    cursor: pointer;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'%3E%3Cpath d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-image: none;
    background-color: var(--grav-crud-color-neutral);
    mask-type: match-source;
  }

  .input-field:focus {
    outline: none;
  }

  .input-label {
    position: absolute;
    font-size: var(--grav-input-label-font-size, 1rem);
    font-weight: var(--_grav-label-weight, inherit);
    text-align: left;
    color: var(--grav-input-label-color, var(--grav-crud-color-neutral));
    transition: all 0.3s;
    top: 0.25rem;
    left: 0.25rem;
    z-index: -10;
    transform-origin: left;
  }

  .input-field:focus + .input-label,
  .input-wrapper.has-value .input-label {
    left: 0;
    top: 0;
    color: var(
      --grav-input-label-float-color,
      var(--grav-input-label-color, var(--grav-crud-color-neutral))
    );
    translate: var(--grav-input-label-float-x, -0.6rem)
      var(--grav-input-label-float-y, -2.05rem);
    scale: 1;
    font-size: var(
      --grav-input-label-float-font-size,
      var(--grav-input-label-font-size, 1rem)
    );
    --_grav-label-weight: var(--grav-input-label-float-font-weight);
  }

  .input-wrapper:not(.has-value) .input-label {
    transform: translateY(0) scale(1);
  }

  .required-mark {
    color: #dc2626;
  }

  .no-margin {
    margin-top: 0;
  }

  .no-margin .input-field:focus + .input-label,
  .no-margin.has-value .input-label {
    translate: var(--grav-input-label-float-x, -0.6rem)
      var(--grav-input-label-float-y-compact, -1.4rem);
    font-size: var(--grav-input-label-float-font-size-compact, 0.7rem);
  }
</style>
