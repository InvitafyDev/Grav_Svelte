<script lang="ts">
  import "../typography.css";

  export let valueVar: string = "";
  export let label: string;
  export let disabled = false;
  export let obligatory = false;
  export let icon: string | null = null;
  export let validation: boolean = false;
  export let showToggle: boolean = true; // Show/hide eye toggle button

  const inputId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `grav-input-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  let validationMessage = "";
  let isValid = true;
  let showPassword = false;

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  $: {
    if (valueVar) {
      // Password validation rules
      const hasMinLength = valueVar.length >= 8;
      const hasUpperCase = /[A-Z]/.test(valueVar);
      const hasLowerCase = /[a-z]/.test(valueVar);
      const hasNumbers = /\d/.test(valueVar);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(valueVar);

      if (!hasMinLength) {
        validationMessage = "La contraseña debe tener al menos 8 caracteres";
        isValid = false;
      } else if (!hasUpperCase) {
        validationMessage =
          "La contraseña debe contener al menos una letra mayúscula";
        isValid = false;
      } else if (!hasLowerCase) {
        validationMessage =
          "La contraseña debe contener al menos una letra minúscula";
        isValid = false;
      } else if (!hasNumbers) {
        validationMessage = "La contraseña debe contener al menos un número";
        isValid = false;
      } else if (!hasSpecialChar) {
        validationMessage =
          "La contraseña debe contener al menos un carácter especial";
        isValid = false;
      } else {
        validationMessage = "Contraseña válida";
        isValid = true;
      }
    } else {
      validationMessage = "";
      isValid = true;
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
      id={inputId}
      {disabled}
      type={showPassword ? "text" : "password"}
      value={valueVar}
      on:input={(e) => valueVar = e.currentTarget.value}
      placeholder=" "
      class="input-field"
      style={showToggle ? "padding-right: 2.5rem;" : ""}
    />

    <label for={inputId} class="input-label"
      >{label}
      {#if obligatory}
        <span class="required-mark"> *</span>
      {/if}</label
    >

    {#if showToggle}
      <button
        type="button"
        class="toggle-button"
        on:click={togglePasswordVisibility}
        disabled={disabled}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {#if showPassword}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            ></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        {/if}
      </button>
    {/if}
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
    display: flex;
    align-items: center;
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

  .toggle-button {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    color: var(--grav-crud-color-neutral);
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    z-index: 1;
  }

  .toggle-button:hover:not(:disabled) {
    opacity: 1;
  }

  .toggle-button:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  .toggle-button:focus {
    outline: 2px solid var(--grav-crud-color-neutral);
    outline-offset: 2px;
    border-radius: 0.25rem;
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
