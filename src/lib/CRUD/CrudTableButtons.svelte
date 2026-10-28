<script context="module" lang="ts">
  let avisado = false;
</script>

<script lang="ts">
  import type { ButtonConfig } from "./interfaces.js";
  import Tooltip from "./Tooltip.svelte";

  // Sin valor por defecto: con `id = 1`, un `campo` con errata hacía que
  // «Eliminar» apuntara al registro 1 desde cualquier renglón.
  export let id: any = undefined;
  export let buttonsConfig: ButtonConfig[];
  export let align: "left" | "right" | "center" = "center";
  export let row: any = undefined;

  $: if (id === undefined && row !== undefined && !avisado) {
    avisado = true;
    console.warn(
      "grav-svelte: el `campo` de la columna Buttons no existe en los datos; las acciones reciben id undefined.",
      row,
    );
  }

  $: visibleButtons = buttonsConfig.filter(
    (btn) => (btn.show ?? true) && (btn.showIf ? btn.showIf(row) : true),
  );

  function handleClick(event: MouseEvent, button: ButtonConfig) {
    event.stopPropagation();
    button.action(id, row);
  }
</script>

<div class="button-group" role="group">
  {#each visibleButtons as button, i (button.icon + id + i)}
    <Tooltip text={button.tooltip}>
      <button
        aria-label={button.tooltip}
        on:click={(e) => handleClick(e, button)}
        type="button"
        class="action-buttons-group {visibleButtons.length === 1
          ? 'rounded-left rounded-right'
          : i == 0
            ? 'rounded-left'
            : i == visibleButtons.length - 1
              ? 'rounded-right'
              : ''} {button.color}"
      >
        <i
          class={button.icon}
          data-fa-processed="true"
          data-fa-i2svg-processed="true"
        >
        </i>
      </button>
    </Tooltip>
  {/each}
</div>

<style>
  .button-group {
    display: inline-flex;
    border-radius: var(--grav-crud-button-border-radius, 0.5rem);
    gap: 0.1rem;
  }

  .action-buttons-group {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    color: white;
    padding: 0.5rem 0.75rem;
    min-height: 1.5rem;
    min-width: 1.25rem;
    font-size: 0.75rem;
    border-width: var(--grav-crud-button-border-width, 1.5px);
    border-style: solid;
    transition: all 0.2s ease;
  }

  @media (min-width: 640px) {
    .action-button {
      padding: 0.25rem 0.5rem;
    }
  }

  .rounded-left {
    border-top-left-radius: var(--grav-crud-button-border-radius, 0.5rem);
    border-bottom-left-radius: var(--grav-crud-button-border-radius, 0.5rem);
  }

  .rounded-right {
    border-top-right-radius: var(--grav-crud-button-border-radius, 0.5rem);
    border-bottom-right-radius: var(--grav-crud-button-border-radius, 0.5rem);
  }
</style>
