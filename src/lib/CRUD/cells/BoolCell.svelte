<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
</script>

{#if item[header.campo] == true}
    <div
        class="cell-content {header.biBold
            ? 'bold'
            : ''}"
        style="text-align: {header.align ?? 'left'}; {header.colorCampo && item[header.colorCampo] ? `background-color: ${item[header.colorCampo]}; color: white;` : ''}"
    >
        <i class="fas fa-check"></i>
    </div>
{:else}
    <div
        class="cell-content {header.biBold
            ? 'bold'
            : ''}"
        style="text-align: {header.align ?? 'left'}; {header.colorCampo && item[header.colorCampo] ? `background-color: ${item[header.colorCampo]}; color: white;` : ''}"
    >
        <i class="fas fa-minus"></i>
    </div>
{/if}
