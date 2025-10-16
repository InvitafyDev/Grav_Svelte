<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
</script>

<p
    class="cell-content {item[header.colorCampo ?? ''] ?? ''} {header.biBold
        ? 'bold'
        : ''}"
    style="text-align: {header.align ?? 'left'}"
>
    {item[header.campo] ?? ""}
</p>
