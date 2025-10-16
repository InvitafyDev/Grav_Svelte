<script lang="ts">
    import type { TableHeader } from "../interfaces.js";
    import CellRenderer from "../cells/CellRenderer.svelte";

    export let subRows: any[];
    export let subRowHeaders: TableHeader[];
    export let idField: string;
    export let onImageClick: (src: string) => void;
</script>

<table class="sub-table">
    <tbody>
        {#each subRows as subItem}
            <tr class="sub-row">
                {#each subRowHeaders as subHeader, i}
                    <CellRenderer
                        item={subItem}
                        header={subHeader}
                        {idField}
                        index={i}
                        dragEnabled={false}
                        expandEnabled={false}
                        {onImageClick}
                    />
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
