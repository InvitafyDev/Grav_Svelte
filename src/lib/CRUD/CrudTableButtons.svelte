<script lang="ts">
  import type { ButtonConfig } from "./interfaces.js";
  import Tooltip from "./Tooltip.svelte";
  import { onMount, afterUpdate, onDestroy } from "svelte";

  export let id = 1;
  export let buttonsConfig: ButtonConfig[];
  export let align: "left" | "right" | "center" = "center";
  export let row: any = undefined;

  $: visibleButtons = buttonsConfig.filter((btn) => btn.show ?? true);

  function handleClick(event: MouseEvent, button: ButtonConfig) {
    event.stopPropagation();
    button.action(id, row);
  }

  // Prevenir que Font Awesome procese iconos múltiples veces
  function preventIconDuplication(element: HTMLElement) {
    if (!element) return;

    const buttons = element.querySelectorAll("button");
    buttons.forEach((button) => {
      // Buscar todos los iconos (tanto <i> como SVGs generados por Font Awesome)
      const iconElements = button.querySelectorAll(
        'i[class*="fa-"], svg[data-icon]',
      );
      const iconClasses = new Set<string>();

      iconElements.forEach((icon, index) => {
        const iconClass = icon.getAttribute("class") || "";
        const faClasses = iconClass.split(" ").filter((c) => c.startsWith("fa-"));

        // Si es un elemento <i> con clase fa-
        if (icon.tagName === "I" && faClasses.length > 0) {
          const iconName = faClasses[faClasses.length - 1];
          const existingSvg =
            button.querySelector(`svg[data-icon="${iconName}"]`) ||
            button.querySelector(`svg[data-icon="${iconName.replace(/^fa-/, "")}"]`);

          if (existingSvg) {
            icon.remove();
            return;
          }

          const faKey = faClasses.join(" ");
          if (!iconClasses.has(faKey)) {
            iconClasses.add(faKey);
            icon.setAttribute("data-fa-processed", "true");
            icon.setAttribute("data-fa-i2svg-processed", "true");
          } else {
            icon.remove();
          }
        }

        // Si es un SVG duplicado (más de uno con el mismo data-icon)
        if (icon.tagName === "SVG") {
          const dataIcon = icon.getAttribute("data-icon");
          if (dataIcon) {
            const existingSvgs = button.querySelectorAll(
              `svg[data-icon="${dataIcon}"]`,
            );
            if (existingSvgs.length > 1) {
              // Mantener solo el primero, eliminar los demás
              for (let i = 1; i < existingSvgs.length; i++) {
                existingSvgs[i].remove();
              }
            }
          }
        }
      });

      // Limpiar iconos <i> que ya tienen SVG correspondiente
      const allIcons = button.querySelectorAll('i[class*="fa-"]');
      allIcons.forEach((icon) => {
        const iconClass = icon.getAttribute("class") || "";
        const faClasses = iconClass.split(" ").filter((c) => c.startsWith("fa-"));
        if (faClasses.length > 0) {
          const iconName = faClasses[faClasses.length - 1];
          const svg =
            button.querySelector(`svg[data-icon="${iconName}"]`) ||
            button.querySelector(`svg[data-icon="${iconName.replace(/^fa-/, "")}"]`);
          if (svg) {
            icon.remove();
          }
        }
      });
    });
  }

  let buttonGroupElement: HTMLDivElement;
  let mutationObserver: MutationObserver | null = null;

  onMount(() => {
    if (buttonGroupElement) {
      preventIconDuplication(buttonGroupElement);

      // Observar cambios en el DOM para detectar cuando Font Awesome agrega SVGs
      mutationObserver = new MutationObserver((mutations) => {
        let shouldClean = false;
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                // Element node
                const element = node as Element;
                if (element.tagName === "SVG" || element.querySelector("svg")) {
                  shouldClean = true;
                }
              }
            });
          }
        });

        if (shouldClean) {
          // Usar setTimeout para evitar procesar múltiples veces en el mismo ciclo
          setTimeout(() => {
            preventIconDuplication(buttonGroupElement);
          }, 0);
        }
      });

      mutationObserver.observe(buttonGroupElement, {
        childList: true,
        subtree: true,
      });
    }
  });

  afterUpdate(() => {
    if (buttonGroupElement) {
      // Usar setTimeout para evitar procesar en medio de una actualización
      setTimeout(() => {
        preventIconDuplication(buttonGroupElement);
      }, 0);
    }
  });

  // Limpiar el observer cuando el componente se destruya
  onDestroy(() => {
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
  });
</script>

<div class="button-group" role="group" bind:this={buttonGroupElement}>
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

  .tooltip-container {
    position: relative;
  }

  .tooltip {
    position: absolute;
    z-index: 10000;
    padding: 0.25rem;
    color: white;
    text-align: center;
    font-size: 0.75rem;
    background-color: var(--grav-crud-color-tooltip);
    border-radius: var(--grav-crud-tooltip-border-radius, 0.25rem);
    top: -1.8rem;
    right: -2.5rem;
    pointer-events: none;
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
