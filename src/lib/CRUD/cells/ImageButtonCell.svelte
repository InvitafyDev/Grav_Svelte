<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let idField: string;
</script>

<button
    type="button"
    class="image-button-wrapper"
    on:click={() => {
        if (header.action) {
            header.action(item[idField]);
        }
    }}
>
    <img
        src={item[header.imageField ?? ""] ?? ""}
        alt="button"
        class="image-button image-button-{header.imageSize ?? 'md'}"
    />
</button>
