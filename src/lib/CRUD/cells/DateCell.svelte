<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let isDatetime: boolean = false;
</script>

<p
    class="cell-content {item[header.colorCampo ?? ''] ?? ''} {header.biBold
        ? 'bold'
        : ''}"
    style="text-align: {header.align ?? 'left'}"
>
    {#if isDatetime}
        {item[header.campo]?.replace("T", ":") ?? ":"}
    {:else}
        {item[header.campo]?.split("T")[0] ?? ":"}
    {/if}
</p>
