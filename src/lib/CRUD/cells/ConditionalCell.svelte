<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;
    export let idField: string;

    $: condition = header.conditionField ? item[header.conditionField] : false;
    $: config = condition ? header.whenTrue : header.whenFalse;
</script>

{#if config?.tipo === "Text"}
    <p
        class="cell-content {config.colorField
            ? item[config.colorField] ?? ''
            : ''} {header.biBold ? 'bold' : ''}"
        style="text-align: {header.align ?? 'left'}"
    >
        {config.textField ? item[config.textField] ?? "" : ""}
    </p>
{:else if config?.tipo === "DualTextButton"}
    <button
        type="button"
        class="dual-text-button"
        on:click={() => {
            if (header.onButtonClick) {
                header.onButtonClick(item[idField], item);
            }
        }}
    >
        {#if config.textField1 && item[config.textField1]}
            <div
                class="dual-text-1 {config.colorField1
                    ? item[config.colorField1] ?? ''
                    : ''}"
            >
                {item[config.textField1]}
            </div>
        {/if}
        {#if config.textField2 && item[config.textField2]}
            <div
                class="dual-text-2 {config.colorField2
                    ? item[config.colorField2] ?? ''
                    : ''}"
            >
                {item[config.textField2]}
            </div>
        {/if}
    </button>
{/if}
