<script lang="ts">
    import Select from "svelte-select";

    interface SelectValue {
        value: string;
        label: string;
    }

    export let value: SelectValue | null = null;
    export let justValue: string | null = null;
    export let res: any[] = [];
    export let changeFunction: (
        e: CustomEvent<SelectValue | null>
    ) => void = () => {};
    export let onClear: () => void = () => {};
    export let disabledVar = false;
    export let label = "";
</script>

<div class=" flex flex-col border-b w-full mt-1">
    <p class=" text-sm text-gray-800">{label}</p>
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
