<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let isDatetime: boolean = false;
</script>

<p
    class="cell-content {header.biBold
        ? 'bold'
        : ''}"
    style="text-align: {header.align ?? 'left'}; {header.colorCampo && item[header.colorCampo] ? `background-color: ${item[header.colorCampo]}; color: white;` : ''}"
>
    {#if isDatetime}
        {item[header.campo]?.replace("T", ":") ?? ":"}
    {:else}
        {item[header.campo]?.split("T")[0] ?? ":"}
    {/if}
</p>
