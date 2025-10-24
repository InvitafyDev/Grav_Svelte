<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let idField: string;

    $: items = header.itemsField ? item[header.itemsField] ?? [] : [];
    $: layout = header.multiLayout ?? "horizontal";
</script>

<button
    type="button"
    class="multi-text-button multi-text-{layout}"
    on:click={() => {
        if (header.onButtonClick) {
            header.onButtonClick(item[idField], item);
        }
    }}
>
    {#each items as multiItem}
        <div
            class="multi-text-item"
            style="{multiItem.color ? `background-color: ${multiItem.color}; color: white;` : ''}"
        >
            {multiItem.text ?? ""}
        </div>
    {/each}
</button>
