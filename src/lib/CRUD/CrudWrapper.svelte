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

    // Event handlers from parent
    export let onFilter: (filters: FiltrosI[]) => void;
    export let onAdd: () => void;
    export let onImport: (() => void) | undefined = undefined;
    export let onSettings: (() => void) | undefined = undefined;
    export let onReorder: (reorderedItems: any[]) => void = () => {};
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

    // Apply global onCellUpdate to headers that don't have their own onUpdate
    $: processedTableHeaders = tableH.map(header => {
        if ((header.tipo === 'EditableBool' || header.tipo === 'EditableText' || header.tipo === 'EditableNumber') && !header.onUpdate && onCellUpdate) {
            return { ...header, onUpdate: onCellUpdate };
        }
        return header;
    });
</script>

<div class="crud-wrapper" class:min-height-screen={minHeightScreen}>
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
    <div class="crud-table-container">
        <CrudTable
            tableHeaders={processedTableHeaders}
            todosLosRegistros={todosLosObjetos}
            on:selectedSort={handleSort}
            on:reorderChange={handleReorder}
            {loading}
            {dragEnabled}
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
        <div class="export-buttons">
            <div class="buttons-right">
                {#if showExcelButton}
                    <button
                        type="button"
                        on:click={() => handleExport("excel")}
                        class="export-button excel-button"
                    >
                        <i class="fas fa-file-excel"></i> EXCEL
                    </button>
                {/if}
                {#if showPdfButton}
                    <button
                        type="button"
                        on:click={() => handleExport("pdf")}
                        class="export-button pdf-button"
                    >
                        <i class="far fa-file-pdf"></i> PDF
                    </button>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
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
    }

    .export-button:hover {
        transition: all 0.2s ease;
        background-color: transparent;
        color: var(--grav-crud-color-bg);
    }

    .export-button i {
        margin-right: 0.75rem;
    }
</style>