<script lang="ts">
    import Select from "svelte-select";

    interface SelectValue {
        value: any;
        label: string;
    }

    export let value: SelectValue | null = null;
    export let justValue: any | null = null;
    export let res: any[] = [];
    export let changeFunction: (
        e: CustomEvent<SelectValue | null>
    ) => void = () => {};
    export let onClear: () => void = () => {};
    export let disabledVar = false;
    export let label = "";
</script>

<div class="select-container">
    <p class="select-label">{label}</p>
    <Select
        items={res}
        name="inCbArea"
        bind:value
        bind:justValue
        on:change={changeFunction}
        on:clear={onClear}
        disabled={disabledVar}
        class=""
        inputStyles="font-size: 12px; color: #000;"
        containerStyles="border:none;  font-size: 12px; "
        placeholder="Seleccione una opción "
        showChevron
    />
</div>

<style>
    .select-container {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid;
        width: 100%;
        margin-top: 0.25rem;
    }

    .select-label {
        font-size: 0.875rem;
        color: #1f2937; /* equivalent to text-gray-800 */
    }
</style>
