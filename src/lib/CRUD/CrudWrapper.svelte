<script lang="ts">
    import { createPDF, html_table_to_excel } from "$lib/generics.js";
    import CrudFilters from "./CrudFilters.svelte";
    import CrudTable from "./CrudTable.svelte";
    import type { FiltrosI, TableHeader, CrudWrapperProps } from "./interfaces.js";
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
    export let Titulo_Crud: string;

    // Event handlers from parent
    export let onFilter: (filters: FiltrosI[]) => void;
    export let onAdd: () => void;

    function handleFiltroAplicado() {
        onFilter(Filtros);
    }

    function handleAdd() {
        onAdd();
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

    function handleClearFilters() {
        // Reset sorting when filters are cleared
        selectedSort = "";
        selectedAscOrDesc = "asc";
    }

    function handleExport(type: "excel" | "pdf") {
        const table = document.querySelector("table");
        if (!table) return;

        if (type === "excel") {
            html_table_to_excel("xlsx", "Date Report", table);
        } else {
            createPDF(table);
        }
    }
</script>

<div class="crud-wrapper">
    <CrudFilters
        bind:PageSize
        bind:Filtros
        on:filtrar={handleFiltroAplicado}
        on:clearFilters={handleClearFilters}
        on:add={handleAdd}
        {showAddButton}
        {showImportButton}
        {Titulo_Crud}
    />
    <CrudTable
        tableHeaders={tableH}
        todosLosRegistros={todosLosObjetos}
        on:selectedSort={handleSort}
        {loading}
    />
    <PaginationCrud
        perPage={PageSize}
        {totalRows}
        bind:currentPage
        on:pageChange={handlePageChange}
    />

    <div class="export-buttons">
        <button
            type="button"
            on:click={() => handleExport("excel")}
            class="export-button excel-button"
        >
            <i class="fas fa-file-excel pr-3"> </i>EXCEL
        </button>
        <button
            type="button"
            on:click={() => handleExport("pdf")}
            class="export-button pdf-button"
        >
            <i class="far fa-file-pdf pr-3"> </i>PDF
        </button>
    </div>
</div>

<style>
    .crud-wrapper {
        min-height: 100vh;
    }

    .export-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        justify-content: flex-end;
    }

    .export-button {
        text-align: center;
        cursor: pointer;
        color: white;
        padding: 1rem;
        border-radius: 0.25rem;
    }

    .excel-button {
        background-color: #16a34a; /* green-600 */
    }

    .pdf-button {
        background-color: #f97316; /* orange-500 */
    }
</style>
