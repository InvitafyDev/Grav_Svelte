<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let idField: string;

    $: alignStyle = header.align === 'left' ? 'margin-right: auto;' :
                    header.align === 'right' ? 'margin-left: auto;' : '';

    function handleClick(event: MouseEvent) {
        event.stopPropagation();
        if (header.onButtonClick) {
            header.onButtonClick(item[idField], item);
        }
    }
</script>

<div style="display: inline-flex; {alignStyle}">
    <button
        type="button"
        class="dynamic-button"
        style="{header.colorField && item[header.colorField] ? `background-color: ${item[header.colorField]}; color: white;` : ''} {header.styleField ? (item[header.styleField] ?? '') : ''}"
        on:click={handleClick}
    >
        {#if header.iconField && item[header.iconField]}
            {#if !header.iconPosition || header.iconPosition === "left"}
                <i class="{item[header.iconField]} dynamic-button-icon-left" data-fa-processed="true" data-fa-i2svg-processed="true"></i>
            {/if}
        {/if}
        {#if header.textField && item[header.textField]}
            <span>{item[header.textField]}</span>
        {/if}
        {#if header.iconField && item[header.iconField]}
            {#if header.iconPosition === "right"}
                <i class="{item[header.iconField]} dynamic-button-icon-right" data-fa-processed="true" data-fa-i2svg-processed="true"></i>
            {/if}
        {/if}
    </button>
</div>
