<script lang="ts">
    import type { ButtonConfig } from "./interfaces.js";

    export let id = 1;
    export let buttonsConfig: ButtonConfig[];
    let showTooltip = "";
</script>

<td class="table-cell">
    <div class="button-group" role="group">
        {#each buttonsConfig as button, i}
            <div class="tooltip-container">
                {#if showTooltip == button.tooltip}
                    <div class="tooltip">
                        {button.tooltip}
                    </div>
                {/if}
            </div>
            <button
                aria-label={button.tooltip}
                on:click={() => button.action(id)}
                on:mouseenter={() => (showTooltip = button.tooltip)}
                on:mouseleave={() => (showTooltip = "")}
                type="button"
                class="action-buttons-group {i == 0 ? 'rounded-left' : i == buttonsConfig.length - 1 ? 'rounded-right' : ''} {button.color}"
            >
                <i class={button.icon}> </i>
            </button>
        {/each}
    </div>
</td>

<style>
    .table-cell {
        font-size: 0.75rem;
        text-align: center;
    }

    .button-group {
        display: inline-flex;
        border-radius: 0.375rem;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .tooltip-container {
        position: relative;
    }

    .tooltip {
        position: absolute;
        z-index: 10000;
        padding: 0.25rem;
        color: white;
        font-size: 0.75rem;
        background-color: #6b7280;
        border-radius: 0.25rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        top: -1.5rem;
        right: -2.5rem;
    }

    .action-buttons-group {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem 0.75rem;
        min-height: 1.5rem;
        min-width: 1.25rem;
        font-size: 0.75rem;
        border: 1px solid #e5e7eb;
        color: white;
    }

    @media (min-width: 640px) {
        .action-button {
            padding: 0.25rem 0.5rem;
        }
    }

    .rounded-left {
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
    }

    .rounded-right {
        border-top-right-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
    }
</style>
