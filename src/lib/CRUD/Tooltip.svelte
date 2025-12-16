<script lang="ts">
    import { fade } from "svelte/transition";

    let showTooltip = false;
    export let text: string;

    function handleMouseEnter(event: MouseEvent) {
        event.stopPropagation();
        showTooltip = true;
    }

    function handleMouseLeave(event: MouseEvent) {
        event.stopPropagation();
        showTooltip = false;
    }
</script>

<div class="tooltip-container">
    {#if showTooltip}
        <div class="tooltip" transition:fade={{ duration: 200 }}>
            {text}
        </div>
    {/if}
    <div
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
        role="button"
        tabindex="0"
    >
        <slot />
    </div>
</div>

<style>
    .tooltip-container {
        position: relative;
    }
    .tooltip {
        position: absolute;
        z-index: 10000;
        padding: 0.25rem;
        color: white;
        font-size: 0.75rem;
        background-color: var(--grav-crud-color-tooltip);
        border-radius: var(--grav-crud-tooltip-border-radius, 0.25rem);
        top: -1.25rem;
        left: -1.5rem;
        pointer-events: none;
    }
</style>