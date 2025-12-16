<script lang="ts">
    import type { ButtonConfig } from "./interfaces.js";
    import Tooltip from "./Tooltip.svelte";
    import { onMount, afterUpdate } from "svelte";

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
        
        const buttons = element.querySelectorAll('button');
        buttons.forEach((button) => {
            const icons = button.querySelectorAll('i[class*="fa-"]');
            // Si hay más de un icono, eliminar los duplicados (mantener solo el primero)
            if (icons.length > 1) {
                for (let i = 1; i < icons.length; i++) {
                    icons[i].remove();
                }
            }
            // Marcar como procesado para evitar que Font Awesome lo procese de nuevo
            icons.forEach((icon) => {
                if (!icon.hasAttribute('data-fa-processed')) {
                    icon.setAttribute('data-fa-processed', 'true');
                }
                // Prevenir que Font Awesome convierta a SVG si ya es SVG
                const svg = icon.querySelector('svg');
                if (svg && icon.parentElement) {
                    // Si ya hay un SVG, eliminar el icono original
                    icon.style.display = 'none';
                }
            });
        });
    }

    let buttonGroupElement: HTMLDivElement;
    
    onMount(() => {
        if (buttonGroupElement) {
            preventIconDuplication(buttonGroupElement);
        }
    });

    afterUpdate(() => {
        if (buttonGroupElement) {
            preventIconDuplication(buttonGroupElement);
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
                <i class={button.icon} data-fa-processed="true" data-fa-i2svg-processed="true"> </i>
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
        border-bottom-left-radius: var(
            --grav-crud-button-border-radius,
            0.5rem
        );
    }

    .rounded-right {
        border-top-right-radius: var(--grav-crud-button-border-radius, 0.5rem);
        border-bottom-right-radius: var(
            --grav-crud-button-border-radius,
            0.5rem
        );
    }
</style>
