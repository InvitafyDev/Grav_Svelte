<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
</script>

{#if header.component}
    <svelte:component this={header.component} row={item} />
{/if}
