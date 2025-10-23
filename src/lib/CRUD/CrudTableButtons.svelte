<script lang="ts">
    import type { ButtonConfig } from "./interfaces.js";
    import Tooltip from "./Tooltip.svelte";

    export let id = 1;
    export let buttonsConfig: ButtonConfig[];
    export let align: "left" | "right" | "center" = "center";
    export let row: any = undefined;

    $: visibleButtons = buttonsConfig.filter((btn) => btn.show ?? true);
</script>

<div class="button-group" role="group">
    {#each visibleButtons as button, i}
        <Tooltip text={button.tooltip}>
            <button
                aria-label={button.tooltip}
                on:click={() => button.action(id, row)}
                type="button"
                class="action-buttons-group {visibleButtons.length === 1
                    ? 'rounded-left rounded-right'
                    : i == 0
                      ? 'rounded-left'
                      : i == visibleButtons.length - 1
                        ? 'rounded-right'
                        : ''} {button.color}"
            >
                <i class={button.icon}> </i>
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
        background-color: var(--grav-crud-color-icon-hover);
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

    .action-buttons-group:hover {
        background-color: rgba(0, 0, 0, 0.05);
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
