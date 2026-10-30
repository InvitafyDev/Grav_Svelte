<script lang="ts">
  import "../typography.css";

  export let valueVar: string = "";
  export let label: string;
  export let disabled = false;
  export let obligatory = false;
  export let icon: string | null = null;

  const inputId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `grav-input-${Date.now()}-${Math.random().toString(36).slice(2)}`;
</script>

<div class="input-container">
  {#if icon}
    <div class="icon-wrapper">
      <i class="{icon} icon"></i>
    </div>
  {/if}
  <div class="input-wrapper">
    <input
      id={inputId}
      {disabled}
      type="color"
      bind:value={valueVar}
      placeholder=" "
      class="input-field"
    />

    <label for={inputId} class="input-label"
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

    height: fit-content;

    margin-top: 1.95rem;
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
    width: 100%;
    font-size: var(--grav-input-font-size, 1rem);
    height: 1.8rem;
    color: var(--grav-input-color, var(--grav-crud-color-neutral));
    background: transparent;
    appearance: none;
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
  .input-field:not(:placeholder-shown) + .input-label {
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

  .input-field:placeholder-shown + .input-label {
    transform: translateY(0) scale(1);
  }

  .required-mark {
    color: #dc2626;
  }

  .no-margin {
    margin-top: 0;
  }

  .no-margin .input-field:focus + .input-label,
  .no-margin .input-field:not(:placeholder-shown) + .input-label {
    translate: var(--grav-input-label-float-x, -0.6rem)
      var(--grav-input-label-float-y-compact, -1.4rem);
    font-size: var(--grav-input-label-float-font-size-compact, 0.7rem);
  }
</style>
