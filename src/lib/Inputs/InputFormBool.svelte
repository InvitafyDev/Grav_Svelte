<script>
  import "../typography.css";

  export let valueVar = false;
  export let label;
  export let disabled = false;
</script>

<div class="input-container">
  <!-- role + aria-checked: sin ellos el estado marcado solo vivia en la clase
       CSS y no habia forma de saberlo salvo mirando la pantalla. Y el nombre sale
       del label, no de un "checkbox" fijo: en una matriz de permisos los 45
       controles se anunciaban todos igual. -->
  <button
    type="button"
    role="checkbox"
    aria-checked={valueVar}
    aria-label={label}
    {disabled}
    on:click={() => (valueVar = !valueVar)}
    class="checkbox-button {valueVar ? 'checked' : ''}"
  >
    <i class="fas {valueVar ? 'fa-check checkwhite' : 'fa-minus'}"></i>
  </button>
  <!-- La etiqueta también cambia la casilla, como un <label> nativo: antes solo
       respondía el cuadrito. Queda fuera del árbol accesible (el botón ya lleva
       el nombre) para que no se anuncie dos veces. -->
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <span
    class="label {disabled ? '' : 'label-clickable'}"
    aria-hidden="true"
    on:click={() => {
      if (!disabled) valueVar = !valueVar;
    }}>{label}</span
  >
</div>

<style>
  .input-container {
    display: flex;
    align-items: center;

    height: fit-content;

    margin-top: 1.95rem;
  }

  .checkbox-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: var(--grav-check-margin-right, 0.5rem);
    height: var(--grav-check-size, 2.7rem);
    width: var(--grav-check-size, 2.7rem);
    background: var(--grav-check-bg, transparent);
    border: var(--grav-crud-input-border-width) solid
      var(--grav-check-border-color, var(--grav-crud-color-neutral));
    color: var(--grav-check-color, var(--grav-crud-color-neutral));
    cursor: pointer;
    border-radius: var(--grav-check-radius, 0.5rem);
    padding: var(--grav-check-padding, 0.2rem 0.5rem);
  }

  .checkbox-button.checked {
    background-color: var(--grav-check-bg-checked, var(--grav-crud-color-neutral));
    border-color: var(
      --grav-check-border-color-checked,
      var(--grav-check-border-color, var(--grav-crud-color-neutral))
    );
    color: var(--grav-check-color-checked, var(--grav-crud-color-bg));
  }

  .label {
    font-size: 1rem;
    margin: 0;
    color: var(--grav-crud-color-neutral);
  }

  .label-clickable {
    cursor: pointer;
    user-select: none;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
