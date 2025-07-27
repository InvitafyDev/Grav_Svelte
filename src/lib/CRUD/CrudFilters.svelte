<script lang="ts">
    import InputFormText from "./../Inputs/InputFormText.svelte";
    import InputFormBool from "../Inputs/InputFormBool.svelte";
    import InputFormSelect from "../Inputs/InputFormSelect.svelte";
    import InputFormNumber from "../Inputs/InputFormNumber.svelte";
    import InputFormDateAndHours from "../Inputs/InputFormDateAndHours.svelte";
    import InputFormDate from "../Inputs/InputFormDate.svelte";
    import { slide } from "svelte/transition";
    import "./CrudFilters.css";

    import { createEventDispatcher, onMount } from "svelte";
    import type { FiltrosI } from "./interfaces.js";
    const dispatch = createEventDispatcher();

    let showTooltip = "";
    export let PageSize = 50;
    let localPageSize = 50;
    let localPageSizeStr = "50";
    let showFilters = false;
    let isLoading = false;

    export let Filtros: FiltrosI[];
    export let showAddButton: boolean = true;
    export let showImportButton: boolean = true;
    export let Titulo_Crud: string;

    // Convert string to number and ensure it's never 0
    $: {
        const num = parseInt(localPageSizeStr);
        if (!isNaN(num)) {
            const newValue = num === 0 ? 1 : num;
            if (newValue !== localPageSize) {
                localPageSize = newValue;
            }
        }
    }

    function clearFilters() {
        console.log("clearFilters");

        Filtros = Filtros.map((filtro) => ({
            ...filtro,
            value: filtro.tipo === "bool" ? false : "",
        }));
        console.log(Filtros);
        dispatch("filtrar", { filtros: Filtros }); // puedes pasar los filtros actualizados
    }

    function actualizarFiltro() {
        console.log(Filtros);
        PageSize = localPageSize;
        dispatch("filtrar", { filtros: Filtros }); // puedes pasar los filtros actualizados
    }

    // Handle keydown event
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
            actualizarFiltro();
        }
    }

    // Handle click to focus the modal
    function handleClick(event: MouseEvent) {
        // Only focus if clicking directly on the modal container
        if (event.target === event.currentTarget) {
            (event.target as HTMLElement).focus();
        }
    }

    function handlePageSizeInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input) {
            localPageSizeStr = input.value;
        }
    }

    let dataFetched: { value: any; label: string }[][] = [];
    onMount(async () => {
        console.log("Filtros", Filtros);
        if (Filtros.length > 0) {
            isLoading = true;
            try {
                const promises = Filtros.map(async (filtro) => {
                    console.log("filtro", filtro);
                    if (filtro.service) {
                        const data = await filtro.service();
                        return data;
                    }
                    return [];
                });
                
                dataFetched = await Promise.all(promises);
                console.log("dataFetched", dataFetched);
            } finally {
                isLoading = false;
            }
        }
    });
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="crud-filters-container"
    on:keydown={handleKeydown}
    on:click={handleClick}
    tabindex="0"
>
    <!-- Filtros CORE -->
    <!--------------------------------------------------------------------->
    <div class="filters-core">
        <div class="filters-header">
            <h1 class="filters-title">{Titulo_Crud}</h1>
            <div class="filters-actions">
                {#if showAddButton}
                    <div>
                        <div class="tooltip-container">
                            {#if showTooltip == "Agregar"}
                                <div class="tooltip">Agregar</div>
                            {/if}
                        </div>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                            class="action-button"
                            type="button"
                            on:mouseenter={() => (showTooltip = "Agregar")}
                            on:mouseleave={() => (showTooltip = "")}
                            on:click={() => dispatch("add")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                {/if}
                {#if showImportButton}
                    <div>
                        <div class="tooltip-container">
                            {#if showTooltip == "Importar"}
                                <div class="tooltip">Importar Excel</div>
                            {/if}
                        </div>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                            class="action-button"
                            type="button"
                            on:mouseenter={() => (showTooltip = "Importar")}
                            on:mouseleave={() => (showTooltip = "")}
                            on:click={() => dispatch("import")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                ></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </button>
                    </div>
                {/if}
            </div>
        </div>
        <div class="filters-controls">
            <!-- Show Filters Button -->
            <div class="filter-group" role="group">
                {#if Filtros && Filtros.length > 0}
                    {#if showFilters}
                        <button
                            type="button"
                            on:click={() => (showFilters = !showFilters)}
                            class="filter-button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="mr-1"
                            >
                                <polygon
                                    points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
                                ></polygon>
                            </svg>
                            {showFilters ? "▲" : "▼"}
                        </button>
                    {:else}
                        <button
                            type="button"
                            on:click={() => (showFilters = !showFilters)}
                            class="filter-button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="mr-1"
                            >
                                <polygon
                                    points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
                                ></polygon>
                            </svg>
                            {showFilters ? "▲" : "▼"}
                        </button>
                    {/if}

                    <!-- Btn de limpiar filtros -->
                    <div class="tooltip-container">
                        {#if showTooltip == "Borrar"}
                            <div class="tooltip">Borrar filtro</div>
                        {/if}
                    </div>
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button
                        type="button"
                        on:click={() => clearFilters()}
                        on:mouseenter={() => (showTooltip = "Borrar")}
                        on:mouseleave={() => (showTooltip = "nada")}
                        class="filter-button filter-button-right"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path
                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                            ></path>
                        </svg>
                    </button>
                {/if}
            </div>

            <!-- Filtro 2 -->
            <div class="page-size-input">
                <InputFormText
                    label="Mostrando:"
                    valueVar={localPageSizeStr}
                    on:input={handlePageSizeInput}
                />
            </div>
            <!-- /Filtro 2 -->

            <!-- Btn de aplicar filtro (siempre visible) -->
            <div class="filter-group" role="group">
                <div class="tooltip-container">
                    {#if showTooltip == "Aplicar"}
                        <div class="tooltip">Aplicar filtro</div>
                    {/if}
                </div>
                <button
                    type="button"
                    on:click={() => actualizarFiltro()}
                    on:mouseenter={() => (showTooltip = "Aplicar")}
                    on:mouseleave={() => (showTooltip = "nada")}
                    class="apply-filter-button">Filtrar</button
                >
            </div>
            <!-- /Btn de aplicar filtro -->
        </div>
    </div>
    <!-- Filtros Dynamic -->
    {#if showFilters}
        <div
            class="filters-grid"
        >
            {#each Filtros as { tipo, label, options, service }, i}
                {#if tipo == "text"}
                    <div class="filter-item">
                        <InputFormText
                            {label}
                            bind:valueVar={Filtros[i].value}
                        />
                    </div>
                {:else if tipo == "number"}
                    <div class="filter-item filter-item-number">
                        <InputFormNumber
                            {label}
                            bind:valueVar={Filtros[i].value}
                        />
                    </div>
                {:else if tipo == "datetime"}
                    <div class="filter-item filter-item-datetime">
                        <InputFormDateAndHours
                            {label}
                            bind:valueVar={Filtros[i].value}
                        />
                    </div>
                {:else if tipo == "date"}
                    <div class="filter-item filter-item-date">
                        <InputFormDate
                            {label}
                            bind:valueVar={Filtros[i].value}
                        />
                    </div>
                {:else if tipo == "select"}
                    <div class="filter-item filter-item-select">
                        {#if service}
                            {#if isLoading}
                                <div class="loading-spinner">
                                    <div class="spinner"></div>
                                </div>
                            {:else}
                                <InputFormSelect
                                    {label}
                                    res={dataFetched[i]}
                                    bind:justValue={Filtros[i].value}
                                />
                            {/if}
                        {:else}
                            <InputFormSelect
                                {label}
                                res={options}
                                bind:justValue={Filtros[i].value}
                            />
                        {/if}
                    </div>
                {:else if tipo == "bool"}
                    <div class="filter-item filter-item-bool">
                        <InputFormBool
                            {label}
                            bind:valueVar={Filtros[i].value}
                        />
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>
