<script lang="ts">
  import "../typography.css";

  export let valueVar: number = 0;
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
  <div class="input-wrapper">
    <input
      {disabled}
      type="number"
      bind:value={valueVar}
      placeholder=" "
      class="input-field"
    />

    <label for="input-number" class="input-label"
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
      var(--grav-crud-color-neutral);
    border-radius: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    margin-top: 1.95rem;
    height: fit-content;
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
    z-index: 0;
    width: 100%;
  }

  .input-field {
    display: block;
    padding: 0.3rem;
    width: 100%;
    font-size: 1rem;
    color: var(--grav-crud-color-neutral);
    background: transparent;
    appearance: none;
  }

  .input-field:focus {
    outline: none;
  }

  .input-label {
    position: absolute;
    font-size: 1rem;
    text-align: left;
    color: var(--grav-crud-color-neutral);
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
    color: var(--grav-crud-color-neutral);
    translate: -0.6rem -2.05rem;
    scale: 1;
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
    translate: -0.6rem -1.4rem;
    font-size: 0.7rem;
  }
</style>
