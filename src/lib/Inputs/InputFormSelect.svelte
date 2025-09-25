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
        class="select-input"
        inputStyles="font-size: 12px; color: currentColor !important; background-color: transparent;"
        containerStyles="font-size: 12px; background-color: transparent; border: 1px solid currentColor;"
        placeholder="Seleccione una opción"
        --placeholder-color="currentColor"
        --chevron-color="currentColor"
        --item-color="black"
        --item-hover-bg=" lightgray"
        --item-is-active-bg="black"
        showChevron
    />
</div>

<style>
    .select-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 0.25rem;
        color: var(--grav-crud-color-neutral);
    }

    .select-label {
        font-size: 0.875rem;
        color: var(--grav-crud-color-neutral); 
    }
</style>
