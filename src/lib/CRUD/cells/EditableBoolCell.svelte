<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let idField: string;

    async function handleClick() {
        const newValue = !item[header.campo];
        item[header.campo] = newValue;
        if (header.onUpdate) {
            await header.onUpdate(item[idField], header.campo, newValue);
        }
    }
</script>

<button
    class="editable-checkbox {item[header.campo] ? 'checked' : ''}"
    on:click={handleClick}
>
    <i class="fas {item[header.campo] ? 'fa-check' : 'fa-minus'}"></i>
</button>
