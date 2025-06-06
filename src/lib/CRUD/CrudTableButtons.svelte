<script lang="ts">
    import type { ButtonConfig } from "./interfaces.js";

    export let id = 1;
    export let buttonsConfig: ButtonConfig[];
    let showTooltip = "";
</script>

<td class="text-xs text-center">
    <div class="inline-flex rounded-md shadow-sm" role="group">
        {#each buttonsConfig as button, i}
            <div class="relative">
                {#if showTooltip == button.tooltip}
                    <div
                        class="absolute z-[10000] p-1 text-white text-xs bg-gray-500 rounded shadow -top-6 -right-10"
                    >
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
                class="inline-flex items-center cursor-pointer sm:px-2 sm:py-1 px-3 py-2 min-h-6 min-w-5 sm:text-xs text-xs border border-gray-200 text-white {i ==
                0
                    ? 'rounded-l-lg'
                    : i == buttonsConfig.length - 1
                      ? 'rounded-r-lg'
                      : ''} {button.color}  "
            >
                <i class={button.icon}> </i>
            </button>
        {/each}
    </div>
</td>
