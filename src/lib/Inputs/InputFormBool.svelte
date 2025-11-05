<script>
  import "../typography.css";

  export let valueVar = false;
  export let label;
  export let disabled = false;
</script>

<div class="input-container">
  {#if valueVar}
    <button
      aria-label="checkbox"
      {disabled}
      on:click={() => (valueVar = false)}
      class="checkbox-button checked"
    >
      <i class="fas fa-check checkwhite"></i>
    </button>
  {:else}
    <button
      aria-label="checkbox"
      {disabled}
      on:click={() => (valueVar = true)}
      class="checkbox-button"
    >
      <i class="fas fa-minus"></i>
    </button>
  {/if}
  <h1 class="label">{label}</h1>
</div>

<style>
  .input-container {
    display: flex;
    align-items: center;

    height: fit-content;

    margin-top: 1.95rem;
  }

  .checkbox-button {
    margin-right: 0.5rem;
    height: 2.7rem;
    width: 2.7rem;
    background: transparent;
    border: var(--grav-crud-input-border-width) solid
      var(--grav-crud-color-neutral);
    color: var(--grav-crud-color-neutral);
    cursor: pointer;
    border-radius: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
  }

  .checkbox-button.checked {
    background-color: var(--grav-crud-color-primary);
    color: var(--grav-crud-color-icon);
  }

  .label {
    font-size: 1rem;
    margin: 0;
    color: var(--grav-crud-color-neutral);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
