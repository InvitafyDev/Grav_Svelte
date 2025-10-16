<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let onImageClick: (src: string) => void;
</script>

<img
    class="crud-image cursor-pointer"
    src={item[header.campo] ?? ""}
    alt="image"
    on:click={() => onImageClick(item[header.campo])}
/>
