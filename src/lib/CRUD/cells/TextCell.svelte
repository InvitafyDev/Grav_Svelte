<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
</script>

<p
    class="cell-content {header.biBold ? 'bold' : ''}"
    style="text-align: {header.align ?? 'left'}; {header.colorCampo && item[header.colorCampo] ? `background-color: ${item[header.colorCampo]}; color: white;` : ''}"
>
    {item[header.campo] ?? ""}
</p>
