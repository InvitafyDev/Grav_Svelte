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
    <!-- Sin role ni tabindex: este div solo escucha el mouse para mostrar el
         tooltip, no es un control. Ponerle role="button" anidaba un boton dentro
         de otro (el del slot), duplicaba la parada de tabulacion de cada boton de
         la tabla y hacia que un lector de pantalla anunciara "boton" dos veces.
         El nombre accesible ya lo pone el propio elemento del slot. -->
    <div on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
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