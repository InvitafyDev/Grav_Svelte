<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let idField: string;
</script>

<button
    type="button"
    class="dynamic-button {item[header.colorField ?? ''] ?? ''}"
    on:click={() => {
        if (header.onButtonClick) {
            header.onButtonClick(item[idField], item);
        }
    }}
>
    {#if header.iconField && item[header.iconField]}
        {#if !header.iconPosition || header.iconPosition === "left"}
            <i class="{item[header.iconField]} dynamic-button-icon-left"></i>
        {/if}
    {/if}
    {#if header.textField && item[header.textField]}
        <span>{item[header.textField]}</span>
    {/if}
    {#if header.iconField && item[header.iconField]}
        {#if header.iconPosition === "right"}
            <i class="{item[header.iconField]} dynamic-button-icon-right"></i>
        {/if}
    {/if}
</button>
