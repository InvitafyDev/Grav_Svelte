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

<div class=" min-h-screen">
    <CrudFilters
        bind:PageSize
        bind:Filtros
        on:filtrar={handleFiltroAplicado}
        on:add={handleAdd}
        {showAddButton}
        {showImportButton}
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

    <div class="flex gap-4 mt-4 justify-end">
        <button
            type="button"
            on:click={() => handleExport("excel")}
            class="bg-green-600 text-center cursor-pointer text-white p-4 rounded"
        >
            <i class="fas fa-file-excel pr-3"> </i>EXCEL
        </button>
        <button
            type="button"
            on:click={() => handleExport("pdf")}
            class="bg-orange-500 text-center cursor-pointer text-white p-4 rounded"
        >
            <i class="far fa-file-pdf pr-3"> </i>PDF
        </button>
    </div>
</div>
