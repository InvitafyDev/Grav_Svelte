<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let idField: string;

    $: alignStyle = header.align === 'left' ? 'margin-right: auto;' :
                    header.align === 'right' ? 'margin-left: auto;' : '';
</script>

<div style="display: inline-flex; {alignStyle}">
    <button
        type="button"
        class="dual-text-button"
        on:click={() => {
            if (header.onButtonClick) {
                header.onButtonClick(item[idField], item);
            }
        }}
    >
        {#if header.textField1 && item[header.textField1]}
            <div class="dual-text-1 {item[header.colorField1 ?? ''] ?? ''}">
                {item[header.textField1]}
            </div>
        {/if}
        {#if header.textField2 && item[header.textField2]}
            <div class="dual-text-2 {item[header.colorField2 ?? ''] ?? ''}">
                {item[header.textField2]}
            </div>
        {/if}
    </button>
</div>
