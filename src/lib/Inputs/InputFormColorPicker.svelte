<script lang="ts">
  import "../typography.css";

  export let valueVar: string = "";
  export let label: string;
  export let disabled = false;
  export let obligatory = false;
  export let icon: string | null = null;

  // Preset colors - 8 distinct colors
  const presetColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#8B5CF6", // Purple
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#84CC16", // Lime
  ];

  function selectColor(color: string) {
    if (!disabled) {
      valueVar = color;
    }
  }

  function handleHexInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = target.value;

    // Auto-add # if not present
    if (value && !value.startsWith("#")) {
      value = "#" + value;
      target.value = value;
    }

    // Validate hex format
    if (value.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      valueVar = value;
    }
  }
</script>

<div class="color-picker-container">
  {#if icon}
    <div class="icon-wrapper">
      <i class="{icon} icon"></i>
    </div>
  {/if}

  <div class="color-picker-wrapper">
    <!-- Label -->
    <label class="main-label">
      {label}
      {#if obligatory}
        <span class="required-mark"> *</span>
      {/if}
    </label>

    <!-- Preset Colors Section -->
    <div class="section-label">Colores predefinidos</div>
    <div class="preset-colors-grid">
      {#each presetColors as color}
        <button
          type="button"
          class="color-swatch"
          class:selected={valueVar.toUpperCase() === color.toUpperCase()}
          style="background-color: {color};"
          on:click={() => selectColor(color)}
          {disabled}
          aria-label="Select {color}"
        >
          {#if valueVar.toUpperCase() === color.toUpperCase()}
            <svg
              class="checkmark"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Custom Color Section -->
    <div class="section-label custom-section">Color personalizado</div>
    <div class="custom-color-picker">
      <button
        type="button"
        class="color-preview"
        style="background-color: {valueVar};"
        on:click={() =>
          !disabled && document.getElementById("color-input-" + label)?.click()}
        {disabled}
        aria-label="Open color picker"
      >
        <input
          id="color-input-{label}"
          {disabled}
          type="color"
          bind:value={valueVar}
          class="hidden-color-input"
        />
      </button>
      <input
        type="text"
        class="hex-input"
        value={valueVar.toUpperCase()}
        on:input={handleHexInput}
        placeholder="#3B82F6"
        {disabled}
        maxlength="7"
      />
    </div>
  </div>
</div>

<style>
  .color-picker-container {
    display: flex;
    align-items: flex-start;
    width: 100%;
    margin-top: 1rem;
    gap: 0.5rem;
  }

  .icon-wrapper {
    width: 1rem;
    position: relative;
    margin-top: 0.5rem;
  }

  .icon {
    position: absolute;
    top: 0;
    left: 0.25rem;
    color: var(--grav-crud-color-neutral);
  }

  .color-picker-wrapper {
    flex: 1;
    width: 100%;
  }

  .main-label {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--grav-crud-color-neutral);
    margin-bottom: 1rem;
  }

  .section-label {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--grav-crud-color-neutral);
    margin-bottom: 0.75rem;
    margin-top: 1.25rem;
  }

  .section-label:first-of-type {
    margin-top: 0;
  }

  .preset-colors-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    max-width: 140px;
  }

  .color-swatch {
    aspect-ratio: 1;
    border-radius: 0.625rem;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-height: 20px;
  }

  .color-swatch:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .color-swatch.selected {
    border-color: var(--grav-crud-color-neutral);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.2),
      0 4px 6px -2px rgba(0, 0, 0, 0.1);
  }

  .color-swatch:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .checkmark {
    width: 12px;
    height: 12px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }

  .custom-color-picker {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 600px;
  }

  .color-preview {
    width: 50px;
    height: 50px;
    border-radius: 0.75rem;
    border: 2px solid var(--grav-crud-color-border);
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  .color-preview:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .color-preview:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .hidden-color-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    border: none;
  }

  .hex-input {
    flex: 1;
    padding: 0.625rem 0.875rem;
    font-size: 0.95rem;
    border: 2px solid var(--grav-crud-color-border);
    border-radius: 0.75rem;
    background: var(--grav-crud-color-light);
    color: var(--grav-crud-color-neutral);
    font-weight: 500;
    transition: all 0.2s ease;
    text-transform: uppercase;
  }

  .hex-input:focus {
    outline: none;
    border-color: var(--grav-crud-color-neutral);
  }

  .hex-input:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .required-mark {
    color: #dc2626;
  }

  @media (max-width: 640px) {
    .preset-colors-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 0.4rem;
    }

    .color-swatch {
      min-height: 18px;
    }

    .color-preview {
      width: 45px;
      height: 45px;
    }

    .hex-input {
      font-size: 0.875rem;
      padding: 0.625rem 0.75rem;
    }
  }
</style>
