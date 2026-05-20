<script lang="ts">
    import InputFormText from "./../Inputs/InputFormText.svelte";
    import InputFormBool from "../Inputs/InputFormBool.svelte";
    import InputFormSelect from "../Inputs/InputFormSelect.svelte";
    import InputFormNumber from "../Inputs/InputFormNumber.svelte";
    import InputFormDateAndHours from "../Inputs/InputFormDateAndHours.svelte";
    import InputFormDate from "../Inputs/InputFormDate.svelte";
    import { slide } from "svelte/transition";
    import "./CrudFilters.css";
    import "../typography.css";
    import Tooltip from "./Tooltip.svelte";

    import { createEventDispatcher, onMount, tick } from "svelte";
    import type { FiltrosI } from "./interfaces.js";
    const dispatch = createEventDispatcher();

    export let PageSize = 50;
    let localPageSize = 50;
    let localPageSizeStr = "50";
    let showFilters = false;
    let isLoading = false;
    let clearKey = 0;

    export let Filtros: FiltrosI[];
    export let showAddButton: boolean = true;
    export let showImportButton: boolean = true;
    export let showSettingsButton: boolean = false;
    export let showMostrandoInput: boolean = true;
    export let Titulo_Crud: string;
    export let tooltipAgregar: string = 'Agregar';
    export let tooltipImportarExcel: string = 'Importar Excel';
    export let tooltipVerFiltros: string = 'Ver filtros';
    export let tooltipConfiguracion: string = 'Configuración';
    export let tooltipLimpiar: string = 'Borrar filtro';
    export let labelLimpiar: string = 'Limpiar';
    export let tooltipFiltrar: string = 'Aplicar filtro';
    export let labelFiltrar: string = 'Filtrar';
    export let labelMostrando: string = 'Showing:';

    // Dynamic grid columns calculation
    $: gridColumns = Math.min(Filtros.length, 6);

    // Force PageSize to 50 if showMostrandoInput is false
    $: if (!showMostrandoInput) {
        PageSize = 50;
        localPageSize = 50;
        localPageSizeStr = "50";
    }

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
        Filtros = Filtros.map((filtro) => ({
            ...filtro,
            value: filtro.tipo === "bool" ? false : null,
        }));
        clearKey++; // Force re-render of select components
        dispatch("filtrar", { filtros: Filtros }); // puedes pasar los filtros actualizados
    }

    function actualizarFiltro() {
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

    let containerEl: HTMLDivElement;
    let currentAnim: Animation | null = null;

    async function toggleFilters() {
        if (!containerEl) {
            showFilters = !showFilters;
            return;
        }
        if (currentAnim) {
            currentAnim.cancel();
            currentAnim = null;
        }

        const isMobile = window.matchMedia("(max-width: 640px)").matches;
        const startRect = containerEl.getBoundingClientRect();
        const startWidth = startRect.width;
        const startHeight = startRect.height;

        const willOpen = !showFilters;
        showFilters = willOpen;
        await tick();

        // Measure end state with content's natural fit-content size
        const prevWidth = containerEl.style.width;
        const prevHeight = containerEl.style.height;
        const prevMaxWidth = containerEl.style.maxWidth;
        const prevOverflow = containerEl.style.overflow;
        containerEl.style.width = "fit-content";
        containerEl.style.height = "auto";
        containerEl.style.maxWidth = "100%";
        const endRect = containerEl.getBoundingClientRect();
        const endWidth = endRect.width;
        const endHeight = endRect.height;
        containerEl.style.width = prevWidth;
        containerEl.style.height = prevHeight;
        containerEl.style.maxWidth = prevMaxWidth;

        containerEl.style.overflow = "hidden";
        const fromKf = isMobile
            ? { height: `${startHeight}px` }
            : { width: `${startWidth}px`, height: `${startHeight}px` };
        const toKf = isMobile
            ? { height: `${endHeight}px` }
            : { width: `${endWidth}px`, height: `${endHeight}px` };
        currentAnim = containerEl.animate([fromKf, toKf], {
            duration: 380,
            easing: "ease-in-out",
            fill: "none",
        });
        currentAnim.onfinish = () => {
            containerEl.style.overflow = prevOverflow;
            currentAnim = null;
        };
        currentAnim.oncancel = () => {
            containerEl.style.overflow = prevOverflow;
        };
    }

    let dataFetched: { value: any; label: string }[][] = [];
    onMount(async () => {
        if (Filtros.length > 0) {
            isLoading = true;
            try {
                const promises = Filtros.map(async (filtro) => {
                    if (filtro.service) {
                        const data = await filtro.service();
                        return data;
                    }
                    return [];
                });

                dataFetched = await Promise.all(promises);
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
    bind:this={containerEl}
    on:keydown={handleKeydown}
    on:click={handleClick}
    tabindex="0"
>
    <!-- Filtros CORE -->
    <!--------------------------------------------------------------------->
    <div class="filters-core">
        <div class="filters-header">
            <h1 class="filters-title">{Titulo_Crud}</h1>
        </div>
        <div class="filters-controls">
            <div class="filters-actions">
                {#if showAddButton}
                    <Tooltip text={tooltipAgregar}>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                            class="action-button"
                            type="button"
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
                    </Tooltip>
                {/if}
                {#if showImportButton}
                    <Tooltip text={tooltipImportarExcel}>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                            class="action-button"
                            type="button"
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
                    </Tooltip>
                {/if}
                {#if Filtros && Filtros.length > 0}
                    <Tooltip text={tooltipVerFiltros}>
                        {#if showFilters}
                            <button
                                type="button"
                                on:click={toggleFilters}
                                class="filter-button filter-button-active"
                            >
                                <i class="fa-solid fa-sliders"></i>
                            </button>
                        {:else}
                            <button
                                type="button"
                                on:click={toggleFilters}
                                class="filter-button"
                            >
                                <i class="fa-solid fa-sliders"></i>
                            </button>
                        {/if}
                    </Tooltip>
                {/if}
                {#if showSettingsButton}
                    <Tooltip text={tooltipConfiguracion}>
                        <button
                            type="button"
                            on:click={() => dispatch("settings")}
                            class="filter-button"
                        >
                            <i class="fas fa-cog"></i>
                        </button>
                    </Tooltip>
                {/if}
            </div>
            <!-- Show Filters Button -->
            <div class="filter-group" role="group"></div>
        </div>
    </div>
    <!-- Filtros Dynamic -->
    {#if showFilters}
        <div class="filters-animated-wrapper">
        <div class="filters-grid" style="--grid-columns: {gridColumns}">
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
                                {#key clearKey}
                                    <InputFormSelect
                                        {label}
                                        res={dataFetched[i]}
                                        bind:justValue={Filtros[i].value}
                                        placeholder={Filtros[i].placeholder}
                                    />
                                {/key}
                            {/if}
                        {:else}
                            {#key clearKey}
                                <InputFormSelect
                                    {label}
                                    res={options}
                                    bind:justValue={Filtros[i].value}
                                    placeholder={Filtros[i].placeholder}
                                />
                            {/key}
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
            <!-- Filtro 2 -->
            {#if showMostrandoInput}
                <div class="filter-item">
                    <InputFormText
                        label={labelMostrando}
                        bind:valueVar={localPageSizeStr}
                    />
                </div>
            {/if}
            <!-- /Filtro 2 -->
        </div>
        <!-- Btn de aplicar filtro -->
        <div class="filters-actions">
            <!-- Btn de limpiar filtros -->
            <Tooltip text={tooltipLimpiar}>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button
                    type="button"
                    on:click={() => clearFilters()}
                    class="filter-button"
                >
                    {labelLimpiar}
                </button>
            </Tooltip>
            <Tooltip text={tooltipFiltrar}>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button
                    type="button"
                    on:click={() => actualizarFiltro()}
                    class="filter-button filter-apply-button"
                    aria-label={tooltipFiltrar}
                >
                    {labelFiltrar}
                </button>
            </Tooltip>
        </div>
        </div>
    {/if}
</div>

<style>
    .filters-animated-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        overflow: visible;
    }

    .filters-animated-wrapper :global(.filters-grid > *) {
        opacity: 0;
        animation: filterItemIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    .filters-animated-wrapper :global(.filters-grid > *:nth-child(1)) { animation-delay: 0.10s; }
    .filters-animated-wrapper :global(.filters-grid > *:nth-child(2)) { animation-delay: 0.16s; }
    .filters-animated-wrapper :global(.filters-grid > *:nth-child(3)) { animation-delay: 0.22s; }
    .filters-animated-wrapper :global(.filters-grid > *:nth-child(4)) { animation-delay: 0.28s; }
    .filters-animated-wrapper :global(.filters-grid > *:nth-child(5)) { animation-delay: 0.34s; }
    .filters-animated-wrapper :global(.filters-grid > *:nth-child(6)) { animation-delay: 0.40s; }
    .filters-animated-wrapper :global(.filters-grid > *:nth-child(7)) { animation-delay: 0.46s; }
    .filters-animated-wrapper :global(.filters-grid > *:nth-child(n+8)) { animation-delay: 0.52s; }

    .filters-animated-wrapper > .filters-actions {
        opacity: 0;
        animation: filterItemIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-delay: 0.55s;
    }

    @keyframes filterItemIn {
        from {
            opacity: 0;
            transform: translateY(-8px);
            filter: blur(3px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
        }
    }
</style>
