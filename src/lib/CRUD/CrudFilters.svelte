<script lang="ts">
    import InputFormText from "./../Inputs/InputFormText.svelte";
    import InputFormBool from "../Inputs/InputFormBool.svelte";
    import InputFormSelect from "../Inputs/InputFormSelect.svelte";
    import InputFormNumber from "../Inputs/InputFormNumber.svelte";
    import InputFormDateAndHours from "../Inputs/InputFormDateAndHours.svelte";
    import InputFormDate from "../Inputs/InputFormDate.svelte";
    import { slide } from "svelte/transition";

    import { createEventDispatcher } from "svelte";
    import type { FiltrosI } from "./interfaces.js";
    const dispatch = createEventDispatcher();

    let showTooltip = "";
    export let PageSize = 50;
    let localPageSize = 50;
    let showFilters = false;

    export let Filtros: FiltrosI[];
    export let showAddButton: boolean = true;
    export let showImportButton: boolean = true;

    // Ensure localPageSize is never 0
    $: if (localPageSize == 0) {
        localPageSize = 1;
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
    function handleKeydown(event) {
        // Check if the event target is a textarea or input
        // const isInputElement = event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT';

        if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
            actualizarFiltro();
        }
    }

    // Handle click to focus the modal
    function handleClick(event) {
        // Only focus if clicking directly on the modal container
        if (event.target === event.currentTarget) {
            event.target.focus();
        }
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="sm:mb-0 sm:mt-1 p-2"
    on:keydown={handleKeydown}
    on:click={handleClick}
    tabindex="0"
>
    <!-- Filtros CORE -->
    <!--------------------------------------------------------------------->
    <div class="sm:flex sm:space-x-3 w-full">
        <div class=" flex items-center space-x-3">
            <h1 class=" font-bold text-2xl">Transacciones</h1>
            <div class="flex justify-start items-center space-x-3 w-full">
                {#if showAddButton}
                    <div>
                        <div class="relative">
                            {#if showTooltip == "Agregar"}
                                <div
                                    class="absolute z-[10000] p-1 text-white text-xs bg-gray-500 rounded shadow -top-5 -left-10"
                                >
                                    Agregar
                                </div>
                            {/if}
                        </div>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                            class=" flex justify-center items-center cursor-pointer border border-black w-12 h-12 rounded-lg shadow-md"
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
                        <div class="relative">
                            {#if showTooltip == "Importar"}
                                <div
                                    class="absolute z-[10000] p-1 text-white text-xs bg-gray-500 rounded shadow -top-5 -left-10"
                                >
                                    Importar Excel
                                </div>
                            {/if}
                        </div>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                            class=" flex justify-center items-center border border-black w-12 h-12 rounded-lg shadow-md"
                            type="button"
                            on:mouseenter={() => (showTooltip = "Importar")}
                            on:mouseleave={() => (showTooltip = "")}
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
        <div class=" flex items-center space-x-3 mt-2 sm:mt-0">
            <!-- Show Filters Button -->
            <div class="inline-flex shadow-sm" role="group">
                {#if Filtros && Filtros.length > 0}
                    {#if showFilters}
                        <button
                            type="button"
                            on:click={() => (showFilters = !showFilters)}
                            class="inline-flex items-center cursor-pointer h-12 sm:px-4 sm:py-3 px-3 py-2 sm:text-sm text-xs font-medium border border-black text-black rounded-l-lg"
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
                            class="inline-flex items-center cursor-pointer h-12 sm:px-4 sm:py-3 px-3 py-2 sm:text-sm text-xs font-medium border border-black text-black rounded-l-lg"
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

                    <div class="relative">
                        {#if showTooltip == "Borrar"}
                            <div
                                class="absolute z-[10000] p-1 text-white text-xs bg-gray-500 rounded shadow -top-5 -left-10"
                            >
                                Borrar filtro
                            </div>
                        {/if}
                    </div>
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button
                        type="button"
                        on:click={() => clearFilters()}
                        on:mouseenter={() => (showTooltip = "Borrar")}
                        on:mouseleave={() => (showTooltip = "nada")}
                        class="inline-flex items-center cursor-pointer sm:px-4 sm:py-3 px-3 py-2 sm:text-sm text-xs font-medium border border-black rounded-r-lg text-black"
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
            <div class=" w-16">
                <InputFormText
                    label="Mostrando:"
                    bind:valueVar={localPageSize}
                />
            </div>
            <!-- /Filtro 2 -->

            <!-- Btn de aplicar filtro (siempre visible) -->
            <div class="inline-flex rounded-md shadow-sm" role="group">
                <div class="relative">
                    {#if showTooltip == "Aplicar"}
                        <div
                            class="absolute z-[10000] p-1 transition-all ease-in duration-200 text-white text-xs bg-gray-500 rounded shadow -top-5 -left-10"
                        >
                            Aplicar filtro
                        </div>
                    {/if}
                </div>
                <button
                    type="button"
                    on:click={() => actualizarFiltro()}
                    on:mouseenter={() => (showTooltip = "Aplicar")}
                    on:mouseleave={() => (showTooltip = "nada")}
                    class="inline-flex h-12 cursor-pointer items-center shadow-md sm:px-4 sm:py-3 px-3 py-2 sm:text-sm text-xs font-medium border border-black text-black rounded-lg"
                    >Filtrar</button
                >
            </div>
            <!-- /Btn de aplicar filtro -->
        </div>
    </div>
    <!-- Filtros Dynamic -->
    {#if showFilters}
        <div
            class="grid sm:grid-cols-5 grid-cols-1 gap-3 mt-4"
            transition:slide|local={{ duration: 300, delay: 100 }}
        >
            {#each Filtros as { tipo, label, options }, i}
                {#if tipo == "text"}
                    <div class="relative z-0 my-auto">
                        <InputFormText
                            {label}
                            bind:valueVar={Filtros[i].value}
                        />
                    </div>
                {:else if tipo == "number"}
                    <div class="z-50">
                        <InputFormNumber
                            {label}
                            bind:valueVar={Filtros[i].value}
                        />
                    </div>
                {:else if tipo == "datetime"}
                    <div class="z-50">
                        <InputFormDateAndHours
                            {label}
                            bind:valueVar={Filtros[i].value}
                        />
                    </div>
                {:else if tipo == "date"}
                    <div class="z-50">
                        <InputFormDate
                            {label}
                            bind:valueVar={Filtros[i].value}
                        />
                    </div>
                {:else if tipo == "select"}
                    <div class="z-50">
                        <InputFormSelect
                            {label}
                            res={options}
                            bind:justValue={Filtros[i].value}
                        />
                    </div>
                {:else if tipo == "bool"}
                    <div class="my-auto">
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
