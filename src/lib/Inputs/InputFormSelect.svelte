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
    export let showPlusIcon = false;
    export let onPlusClick: () => void = () => {};
</script>

<div class="select-container">
    <p class="select-label">{label}</p>
    <div class="select-with-button">
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
            containerStyles="font-size: 12px; background-color: transparent; border: var(--grav-crud-input-border-width) solid currentColor; border-radius: 0.5rem;"
            placeholder="Seleccione una opción"
            --placeholder-color="currentColor"
            --chevron-color="currentColor"
            --item-color="black"
            --item-hover-bg=" lightgray"
            --item-is-active-bg="black"
            --list-z-index="9999"
            showChevron
        />
        {#if showPlusIcon}
            <button
                type="button"
                on:click={onPlusClick}
                class="plus-button"
                disabled={disabledVar}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            </button>
        {/if}
    </div>
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
        font-size: 1rem;
        color: var(--grav-crud-color-neutral);
        margin-bottom: 0.25rem;
    }

    .select-with-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
    }

    .plus-button {
        flex-shrink: 0;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: var(--grav-border-radius-md);
        border: var(--grav-crud-input-border-width) solid currentColor;
        background-color: transparent;
        color: var(--grav-crud-color-neutral);
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .plus-button:hover:not(:disabled) {
        background-color: var(--grav-crud-color-neutral);
        color: white;
    }

    .plus-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
