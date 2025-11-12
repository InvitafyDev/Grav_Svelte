<script lang="ts">
    import { fade } from "svelte/transition";

    let showTooltip = false;
    export let text: string;
</script>

<div class="tooltip-container">
    {#if showTooltip}
        <div class="tooltip" transition:fade={{ duration: 200 }}>
            {text}
        </div>
    {/if}
    <div
        on:mouseenter={() => (showTooltip = true)}
        on:mouseleave={() => (showTooltip = false)}
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