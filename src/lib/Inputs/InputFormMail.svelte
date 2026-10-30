<script lang="ts">
  import "../typography.css";

  export let valueVar: string = "";
  export let label: string;
  export let disabled = false;
  export let obligatory = false;
  export let icon: string | null = null;
  export let validation: boolean = false;

  let validationMessage = "";
  let isValid = true;

  $: {
    if (valueVar) {
      // Email validation using standard regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(valueVar)) {
        validationMessage = "Invalid email format";
        isValid = false;
      } else {
        validationMessage = "Email is valid";
        isValid = true;
      }
    } else {
      if (obligatory) {
        validationMessage = "Email is required";
        isValid = false;
      } else {
        validationMessage = "";
        isValid = true;
      }
    }
  }
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
      type="email"
      bind:value={valueVar}
      placeholder=" "
      class="input-field"
    />

    <label for={valueVar} class="input-label"
      >{label}
      {#if obligatory}
        <span class="required-mark"> *</span>
      {/if}</label
    >
  </div>
</div>
{#if validation && validationMessage}
  <div
    class="validation-message"
    class:valid={isValid}
    class:invalid={!isValid}
  >
    {validationMessage}
  </div>
{/if}

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

  .validation-message {
    font-size: 0.875rem;
    margin-top: 0.25rem;
    color: var(--grav-crud-color-neutral);
  }

  .validation-message.valid {
    color: #10b981;
  }

  .validation-message.invalid {
    color: #dc2626;
  }
</style>
