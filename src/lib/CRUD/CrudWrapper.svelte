<script lang="ts">
    import { createPDF, html_table_to_excel } from "$lib/generics.js";
    import CrudFilters from "./CrudFilters.svelte";
    import CrudTable from "./CrudTable.svelte";
    import type {
        FiltrosI,
        TableHeader,
    } from "./interfaces.js";
    import PaginationCrud from "./PaginationCRUD.svelte";

    export let Filtros: FiltrosI[];
    export let todosLosObjetos: any[];
    export let tableH: TableHeader[];
    export let totalRows: number;
    export let PageSize: number;
    export let currentPage: number;
    export let selectedAscOrDesc: string;
    export let selectedSort: string;
    export let loading: boolean = false;
    export let showAddButton: boolean = true;
    export let showImportButton: boolean = true;
    export let showExcelButton: boolean = true;
    export let showPdfButton: boolean = true;
    export let showSettingsButton: boolean = false;
    export let showMostrandoInput: boolean = true;
    export let Titulo_Crud: string;
    export let dragEnabled: boolean = false;
    export let orderField: string = "inOrden";
    export let minHeightScreen: boolean = false;
    export let idField: string = "id";
    export let expandEnabled: boolean = false;
    export let subRowsField: string = "subRows";
    export let subRowHeaders: TableHeader[] | undefined = undefined;
    export let columnDragEnabled: boolean = false;

    // Event handlers from parent
    export let onFilter: (filters: FiltrosI[]) => void;
    export let onAdd: () => void;
    export let onImport: (() => void) | undefined = undefined;
    export let onSettings: (() => void) | undefined = undefined;
    export let onReorder: (reorderedItems: any[]) => void = () => {};
    export let onColumnReorder: (orderedFields: string[]) => void = () => {};
    export let onCellUpdate: ((id: number | string, campo: string, newValue: any) => Promise<void> | void) | undefined = undefined;

    function handleFiltroAplicado() {
        onFilter(Filtros);
    }

    function handleAdd() {
        onAdd();
    }

    function handleImport() {
        if (onImport) {
            onImport();
        }
    }

    function handleSettings() {
        if (onSettings) {
            onSettings();
        }
    }

    interface PageChangeEvent {
        detail: {
            page: number;
        };
    }

    interface SortEvent {
        detail: {
            selectedSort: string;
            selectedAsc: string;
        };
    }

    function handlePageChange(event: PageChangeEvent) {
        currentPage = event.detail.page;
        onFilter(Filtros);
    }

    function handleSort(event: SortEvent) {
        selectedSort = event.detail.selectedSort;
        selectedAscOrDesc = event.detail.selectedAsc;
        onFilter(Filtros);
    }

    function generateFileName(title: string): string {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, ''); // Remove special chars
        return `${cleanTitle} - ${dateStr}`;
    }

    function handleExport(type: "excel" | "pdf") {
        const table = document.querySelector("table");
        if (!table) return;

        const fileName = generateFileName(Titulo_Crud);

        if (type === "excel") {
            html_table_to_excel("xlsx", fileName, table);
        } else {
            createPDF(table, fileName);
        }
    }

    interface ReorderEvent {
        detail: {
            reorderedItems: any[];
        };
    }

    function handleReorder(event: ReorderEvent) {
        onReorder(event.detail.reorderedItems);
    }

    function handleColumnReorder(event: CustomEvent<{ order: string[] }>) {
        onColumnReorder(event.detail.order);
    }

    // Apply global onCellUpdate to headers that don't have their own onUpdate
    $: processedTableHeaders = tableH.map(header => {
        if ((header.tipo === 'EditableBool' || header.tipo === 'EditableText' || header.tipo === 'EditableNumber') && !header.onUpdate && onCellUpdate) {
            return { ...header, onUpdate: onCellUpdate };
        }
        return header;
    });
</script>

<div class="crud-wrapper" class:min-height-screen={minHeightScreen}>
    <div class="crud-anim-item crud-anim-filters">
    <CrudFilters
        bind:PageSize
        bind:Filtros
        on:filtrar={handleFiltroAplicado}
        on:add={handleAdd}
        on:import={handleImport}
        on:settings={handleSettings}
        {showAddButton}
        {showImportButton}
        {showSettingsButton}
        {showMostrandoInput}
        {Titulo_Crud}
    />
    </div>
    <div class="crud-table-container crud-anim-item crud-anim-table">
        <CrudTable
            tableHeaders={processedTableHeaders}
            todosLosRegistros={todosLosObjetos}
            on:selectedSort={handleSort}
            on:reorderChange={handleReorder}
            on:columnReorderChange={handleColumnReorder}
            {loading}
            {dragEnabled}
            {columnDragEnabled}
            {orderField}
            {idField}
            {expandEnabled}
            {subRowsField}
            {subRowHeaders}
        /> 
        <PaginationCrud
            perPage={PageSize}
            {totalRows}
            bind:currentPage
            on:pageChange={handlePageChange}
        />
    </div>

    {#if showExcelButton || showPdfButton}
        <div class="export-buttons crud-anim-item crud-anim-export">
            <div class="buttons-right">
                {#if showExcelButton}
                    <button
                        type="button"
                        on:click={() => handleExport("excel")}
                        class="export-button excel-button"
                    >
                        <span class="export-button-icon"><i class="fas fa-file-excel"></i></span> EXCEL
                    </button>
                {/if}
                {#if showPdfButton}
                    <button
                        type="button"
                        on:click={() => handleExport("pdf")}
                        class="export-button pdf-button"
                    >
                        <span class="export-button-icon"><i class="far fa-file-pdf"></i></span> PDF
                    </button>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    @keyframes -global-grav-crud-fade-up {
        from {
            opacity: 0;
            transform: translateY(14px);
            filter: blur(4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
        }
    }

    @keyframes -global-grav-crud-scale-in {
        from {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
            filter: blur(3px);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
        }
    }

    @keyframes -global-grav-crud-row-in {
        from {
            opacity: 0;
            transform: translateY(6px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .crud-anim-item {
        opacity: 0;
        animation: grav-crud-fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        will-change: transform, opacity, filter;
    }

    .crud-anim-filters { animation-delay: 40ms; }

    .crud-anim-table {
        animation: grav-crud-scale-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-delay: 140ms;
        transform-origin: top center;
    }

    .crud-anim-export { animation-delay: 280ms; }

    /* Stagger row entry inside the table (works on any consumer page) */
    :global(.crud-anim-table table tbody tr) {
        opacity: 0;
        animation: grav-crud-row-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    :global(.crud-anim-table table tbody tr:nth-child(1))  { animation-delay: 0.30s; }
    :global(.crud-anim-table table tbody tr:nth-child(2))  { animation-delay: 0.35s; }
    :global(.crud-anim-table table tbody tr:nth-child(3))  { animation-delay: 0.40s; }
    :global(.crud-anim-table table tbody tr:nth-child(4))  { animation-delay: 0.45s; }
    :global(.crud-anim-table table tbody tr:nth-child(5))  { animation-delay: 0.50s; }
    :global(.crud-anim-table table tbody tr:nth-child(6))  { animation-delay: 0.55s; }
    :global(.crud-anim-table table tbody tr:nth-child(7))  { animation-delay: 0.60s; }
    :global(.crud-anim-table table tbody tr:nth-child(8))  { animation-delay: 0.65s; }
    :global(.crud-anim-table table tbody tr:nth-child(9))  { animation-delay: 0.70s; }
    :global(.crud-anim-table table tbody tr:nth-child(n+10)) { animation-delay: 0.75s; }

    @media (prefers-reduced-motion: reduce) {
        .crud-anim-item,
        :global(.crud-anim-table table tbody tr) {
            animation: none;
            opacity: 1;
        }
    }

    .crud-wrapper {
        min-height: auto;
    }

    .crud-wrapper.min-height-screen {
        min-height: 100vh;
    }

    .crud-table-container {
        background-color: var(--grav-crud-color-bg);
        padding: 0.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--grav-crud-box-shadow);
    }

    .export-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        justify-content: flex-end;
    }

    .buttons-right {
        display: flex;
        gap: 1rem;
    }

    .export-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        color: white;
        padding: 1rem;
        border-radius: 0.25rem;
        background-color: var(--grav-crud-color-bg);
        color: var(--grav-crud-color-button);
        border: 1px solid var(--grav-crud-color-bg);
        transition:
            transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
            background-color 0.2s ease,
            color 0.2s ease,
            box-shadow 0.2s ease;
    }

    .export-button:hover {
        background-color: transparent;
        color: var(--grav-crud-color-bg);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }

    .export-button:active {
        transform: translateY(0) scale(0.97);
        transition-duration: 0.1s;
    }

    .export-button i,
    .export-button .export-button-icon {
        margin-right: 0.5rem;
    }

    .export-button .export-button-icon {
        display: inline-flex;
        align-items: center;
    }
</style>