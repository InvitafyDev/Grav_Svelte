<script lang="ts">
  import "../typography.css";

  interface CountryOption {
    value: string;
    label: string;
  }

  // Exported values - component always provides all 3
  export let valueVar: string = "";        // Concatenated: "+528444612811"
  export let dialCode: string = "";        // Dial code only: "+52"
  export let phoneNumber: string = "";     // Phone number only: "8444612811"

  // Common props
  export let label: string;
  export let disabled = false;
  export let obligatory = false;
  export let defaultDialCode: string = "+52";
  export let validation: boolean = false;

  // Internal state
  let selectedDialCode: string = defaultDialCode;
  let internalPhoneNumber: string = "";
  let validationMessage = "";
  let isValid = true;

  // Country list with flag emojis (only flag + dial code)
  const countries: CountryOption[] = [
    { value: "+1", label: "🇺🇸 +1" },
    { value: "+1", label: "🇨🇦 +1" },
    { value: "+52", label: "🇲🇽 +52" },
    { value: "+34", label: "🇪🇸 +34" },
    { value: "+54", label: "🇦🇷 +54" },
    { value: "+56", label: "🇨🇱 +56" },
    { value: "+57", label: "🇨🇴 +57" },
    { value: "+51", label: "🇵🇪 +51" },
    { value: "+58", label: "🇻🇪 +58" },
    { value: "+593", label: "🇪🇨 +593" },
    { value: "+55", label: "🇧🇷 +55" },
    { value: "+598", label: "🇺🇾 +598" },
    { value: "+595", label: "🇵🇾 +595" },
    { value: "+591", label: "🇧🇴 +591" },
    { value: "+506", label: "🇨🇷 +506" },
    { value: "+502", label: "🇬🇹 +502" },
    { value: "+504", label: "🇭🇳 +504" },
    { value: "+505", label: "🇳🇮 +505" },
    { value: "+507", label: "🇵🇦 +507" },
    { value: "+503", label: "🇸🇻 +503" },
    { value: "+1", label: "🇩🇴 +1" },
    { value: "+1", label: "🇵🇷 +1" },
    { value: "+53", label: "🇨🇺 +53" },
    { value: "+44", label: "🇬🇧 +44" },
    { value: "+33", label: "🇫🇷 +33" },
    { value: "+49", label: "🇩🇪 +49" },
    { value: "+39", label: "🇮🇹 +39" },
    { value: "+351", label: "🇵🇹 +351" },
    { value: "+31", label: "🇳🇱 +31" },
    { value: "+32", label: "🇧🇪 +32" },
  ];

  // Hidratar el estado interno desde un valor entrante (edición / prellenado).
  // DEBE correr antes del bloque reactivo de abajo: de lo contrario ese bloque
  // sobrescribiría valueVar con el dial code por defecto al montar.
  const valorInicial =
    valueVar || (phoneNumber ? (dialCode || defaultDialCode) + phoneNumber : "");
  if (valorInicial) {
    const dialCodes = [...new Set(countries.map((c) => c.value))].sort(
      (a, b) => b.length - a.length
    );
    const codigo = dialCodes.find((c) => valorInicial.startsWith(c));
    if (codigo) {
      selectedDialCode = codigo;
      internalPhoneNumber = valorInicial.slice(codigo.length).replace(/\D/g, "");
    } else {
      internalPhoneNumber = valorInicial.replace(/\D/g, "");
    }
  }

  // Update all exported values reactively
  $: {
    const cleanNumber = internalPhoneNumber.replace(/\D/g, "");

    // Update separate values
    dialCode = selectedDialCode;
    phoneNumber = cleanNumber;

    // Update concatenated value
    if (selectedDialCode && cleanNumber) {
      valueVar = selectedDialCode + cleanNumber;
    } else if (selectedDialCode) {
      valueVar = selectedDialCode;
    } else {
      valueVar = "";
    }

    // Validation logic
    if (validation) {
      if (internalPhoneNumber && !/^\d+$/.test(cleanNumber)) {
        validationMessage = "Phone number must contain only digits";
        isValid = false;
      } else if (cleanNumber && cleanNumber.length < 7) {
        validationMessage = "Phone number must be at least 7 digits";
        isValid = false;
      } else if (cleanNumber && cleanNumber.length > 15) {
        validationMessage = "Phone number must not exceed 15 digits";
        isValid = false;
      } else if (cleanNumber) {
        validationMessage = "Phone number is valid";
        isValid = true;
      } else {
        validationMessage = "";
        isValid = true;
      }
    }
  }

  // Clean phone number input (only allow digits)
  function handlePhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/\D/g, "");
    internalPhoneNumber = cleaned;
  }
</script>

<div class="phone-container">
  <label class="phone-label">
    {label}
    {#if obligatory}
      <span class="required-mark"> *</span>
    {/if}
  </label>

  <div class="phone-input-wrapper">
    <div class="country-select-wrapper">
      <select
        bind:value={selectedDialCode}
        {disabled}
        class="country-select"
        aria-label="Country code"
      >
        {#each countries as country}
          <option value={country.value}>{country.label}</option>
        {/each}
      </select>
    </div>

    <div class="phone-number-wrapper">
      <input
        type="tel"
        bind:value={internalPhoneNumber}
        on:input={handlePhoneInput}
        {disabled}
        placeholder="Phone number"
        class="phone-input"
        autocomplete="tel"
        inputmode="tel"
        aria-label="Phone number"
      />
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
</div>

<style>
  .phone-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 1.95rem;
  }

  .phone-label {
    font-size: 1rem;
    color: var(--grav-crud-color-neutral);
    margin-bottom: 0.25rem;
  }

  .required-mark {
    color: #dc2626;
  }

  .phone-input-wrapper {
    display: grid;
    grid-template-columns: 80px 1fr;
    border: var(--grav-crud-input-border-width) solid
      var(--grav-crud-color-neutral);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .country-select-wrapper {
    border-right: var(--grav-crud-input-border-width) solid
      var(--grav-crud-color-neutral);
    background-color: transparent;
  }

  .country-select {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    padding-right: 0.25rem;
    font-size: 1rem;
    color: var(--grav-crud-color-neutral);
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .country-select:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .phone-number-wrapper {
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
  }

  .phone-input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    color: var(--grav-crud-color-neutral);
    background: transparent;
    border: none;
    outline: none;
  }

  .phone-input::placeholder {
    color: var(--grav-crud-color-neutral);
    opacity: 0.5;
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
