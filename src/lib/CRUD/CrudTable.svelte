<script lang="ts">
    import CrudTableButtons from "./CrudTableButtons.svelte";

    // COMPONENTES imports

    import { createEventDispatcher } from "svelte";
    import type { TableHeader } from "./interfaces.js";

    const dispatch = createEventDispatcher();

    // variable que captura la tabla para exportar a Excel o Pdf
    let tablaExport;

    export let todosLosRegistros: any[] = [];
    export let tableHeaders: TableHeader[];
    export let loading: boolean = false;

    let selectedAscOrDesc = "asc";
    let selectedSort = "";
    let selectedRowId: string | number | null = null;

    function handleRowClick(id: string | number) {
        selectedRowId = selectedRowId === id ? null : id;
        dispatch("rowClick", { id: selectedRowId });
    }

    function dispatchSort(selection: string) {
        if (selectedAscOrDesc == "asc") {
            selectedAscOrDesc = "desc";
        } else {
            selectedAscOrDesc = "asc";
        }
        selectedSort = selection;
        dispatch("selectedSort", {
            selectedSort: selection,
            selectedAsc: selectedAscOrDesc,
        });
    }
</script>

<div class="table-container">
    <div class="table-scroll">
        <table class="data-table" bind:this={tablaExport}>
            <thead class="table-header">
                <tr>
                    {#each tableHeaders as tableHeader, index}
                        {#if tableHeader.biSort == false}
                            <th
                                class="table-header-cell {index == 0
                                    ? 'borderleft'
                                    : ''} non-sortable"
                                style="text-align: {tableHeader.align ?? 'center'}"
                            >
                                {tableHeader.titulo}
                            </th>
                        {:else}
                            <th
                                on:click={() => dispatchSort(tableHeader.campo)}
                                class="table-header-cell {index == 0
                                    ? 'borderleft'
                                    : ''} sortable"
                                style="text-align: {tableHeader.align ?? 'left'}"
                            >
                                <h1>{tableHeader.titulo}</h1>
                                {#if selectedSort == tableHeader.campo}
                                    {#if selectedAscOrDesc == "asc"}
                                        <div class="sort-icon">
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
                                                class="sort-arrow"
                                            >
                                                <polyline
                                                    points="6 9 12 15 18 9"
                                                ></polyline>
                                            </svg>
                                        </div>
                                    {:else}
                                        <div class="sort-icon">
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
                                                class="sort-arrow"
                                            >
                                                <polyline
                                                    points="18 15 12 9 6 15"
                                                ></polyline>
                                            </svg>
                                        </div>
                                    {/if}
                                {/if}
                            </th>
                        {/if}
                    {/each}
                </tr>
            </thead>

            {#if todosLosRegistros && !loading}
                <tbody>
                    {#each todosLosRegistros as item, index}
                        <tr
                            class="table-row {selectedRowId === index
                                ? 'selected'
                                : ''}"
                            on:click={() => handleRowClick(index)}
                        >
                            {#each tableHeaders as tableBodyItem, i}
                                {#if tableBodyItem.tipo == "Text"}
                                    <td
                                        class="table-cell {i == 0
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {tableBodyItem.biBold
                                                ? 'bold'
                                                : ''}"
                                            style="text-align: {tableBodyItem.align ?? 'left'}"
                                        >
                                            {item[tableBodyItem.campo] ?? ""}
                                        </p>
                                    </td>
                                {:else if tableBodyItem.tipo == "Number"}
                                    <td
                                        class="table-cell {i == 0
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {tableBodyItem.biBold
                                                ? 'bold'
                                                : ''}"
                                            style="text-align: {tableBodyItem.align ?? 'left'}"
                                        >
                                            {item[tableBodyItem.campo] ?? ""}
                                        </p>
                                    </td>
                                {:else if tableBodyItem.tipo == "Bool"}
                                    <td
                                        class="table-cell {i == 0
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {tableBodyItem.biBold
                                                ? 'bold'
                                                : ''}"
                                            style="text-align: {tableBodyItem.align ?? 'left'}"
                                        >
                                            {#if item[tableBodyItem.campo] === true}
                                                <i class="fas fa-check"></i>
                                            {:else}
                                                -
                                            {/if}
                                        </p>
                                    </td>
                                {:else if tableBodyItem.tipo == "Image"}
                                    <td
                                        class="table-cell {i == 0
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <img
                                            class="crud-image"
                                            src={item[tableBodyItem.campo] ??
                                                ""}
                                            alt="image"
                                        />
                                    </td>
                                {:else if tableBodyItem.tipo == "Buttons"}
                                    <CrudTableButtons
                                        id={item[tableBodyItem.campo]}
                                        buttonsConfig={tableBodyItem.buttonsConfig ??
                                            []}
                                        align={tableBodyItem.align ?? 'center'}
                                    />
                                {/if}
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            {:else if !loading}
                <tbody>
                    <tr>
                        <td colspan={tableHeaders.length} class="no-data">
                            No hay datos disponibles
                        </td>
                    </tr>
                </tbody>
            {/if}
        </table>
        {#if loading}
            <div class="loading-container">
                <div class="loading-animation">
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line"></div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .table-container {
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: 0;
        word-break: break-word;
        z-index: 30;
        width: 100%;
        margin-bottom: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        margin-top: 0.75rem;
        background-color: white;
    }

    .table-scroll {
        overflow: auto;
        max-height: 80vh;
    }

    .data-table {
        width: 100%;
        background-color: transparent;
        border-collapse: collapse;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        table-layout: auto;
    }

    .table-header {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 20;
        background-color: white;
    }

    .table-header-cell {
        padding: 0.75rem;
        text-align: center;
        border: 1px solid #e0e0e0;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        font-size: 0.75rem;
        text-transform: uppercase;
        white-space: nowrap;
        font-weight: 600;
        background-color: #f5f5f5;
        color: #4a4a4a;
        border-left: 0;
        border-right: 1px solid #e0e0e0;
    }

    .non-sortable {
        cursor: not-allowed;
    }

    .sortable {
        cursor: pointer;
        text-align: left;
    }

    .borderleft {
        border-left: 1px solid #e0e0e0;
    }

    .sort-icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .sort-arrow {
        margin-left: 0.25rem;
    }

    .table-row {
        border-bottom: 2px solid #e0e0e0;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .table-row:hover {
        background-color: #f5f5f5;
    }

    /* ensure sticky cells follow row hover */
    .table-row:hover .sticky-cell {
        background-color: #f5f5f5;
    }

    .table-row.selected {
        background-color: #e8e8e8;
    }

    /* keep first column selected state consistent */
    .table-row.selected .sticky-cell {
        background-color: #e8e8e8;
    }

    .table-cell {
        border-top: 0;
        border-left: 0;
        border-right: 0;
        white-space: nowrap;
        vertical-align: middle;
        z-index: 10;
    }

    .sticky-cell {
        position: sticky;
        background-color: white;
        left: 0;
    }

    .cell-content {
        padding-left: 0.25rem;
        white-space: normal;
        word-break: break-word;
        font-size: 0.875rem;
        color: #4a4a4a;
    }

    .cell-content.bold {
        font-weight: bold;
    }

    .no-data {
        text-align: center;
        padding: 1rem 0;
    }

    .loading-container {
        margin: 0 auto;
        width: 100%;
        padding: 1rem;
    }

    .loading-animation {
        display: flex;
        flex-direction: column;
        width: 100%;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .loading-line {
        height: 1rem;
        border-radius: 0.25rem;
        background-color: #e0e0e0;
        margin-bottom: 0.5rem;
        width: 100%;
        margin: 0 0 0.5rem 0;
        flex: none;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    @media (min-width: 640px) {
        .cell-content {
            font-size: 1rem;
        }
    }

    .crud-image {
        max-width: 4rem;
        max-height: 4rem;
        object-fit: contain;
        margin: auto;
    }
</style>
