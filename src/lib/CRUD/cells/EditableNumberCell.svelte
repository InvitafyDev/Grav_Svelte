<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let idField: string;

    async function handleBlur(e: Event) {
        if (header.onUpdate) {
            const target = e.currentTarget as HTMLInputElement;
            const numValue = parseFloat(target.value);
            await header.onUpdate(
                item[idField],
                header.campo,
                isNaN(numValue) ? null : numValue
            );
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            (e.currentTarget as HTMLInputElement).blur();
        }
    }
</script>

<input
    type="number"
    class="editable-input"
    bind:value={item[header.campo]}
    on:blur={handleBlur}
    on:keydown={handleKeydown}
    style="text-align: {header.align ?? 'right'}"
/>
