<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let idField: string;

    $: alignStyle = header.align === 'left' ? 'margin-right: auto;' :
                    header.align === 'right' ? 'margin-left: auto;' : '';

    $: hasText1 = header.textField1 && item[header.textField1];
    $: hasText2 = header.textField2 && item[header.textField2];
    $: isSingleState = (hasText1 && !hasText2) || (!hasText1 && hasText2);
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
        {#if hasText1}
            <div
                class="dual-text-1 {isSingleState ? 'rounded-bottom' : ''}"
                style="{header.colorField1 && item[header.colorField1] ? `background-color: ${item[header.colorField1]}; color: white;` : ''}"
            >
                {item[header.textField1]}
            </div>
        {/if}
        {#if hasText2}
            <div
                class="dual-text-2 {isSingleState ? 'rounded-bottom' : ''}"
                style="{header.colorField2 && item[header.colorField2] ? `background-color: ${item[header.colorField2]}; color: white;` : ''}"
            >
                {item[header.textField2]}
            </div>
        {/if}
    </button>
</div>
