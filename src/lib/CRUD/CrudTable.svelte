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
        if (id === 0) return;
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

<div
    class="relative flex flex-col min-w-0 break-words z-30 w-full mb-3 shadow-lg rounded mt-3 p-1 bg-white"
>
    <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden">
        <div class="relative rounded-xl overflow-auto">
            <div class=" bg-white shadow-xl overflow-hidden">
                <div class="overflow-scroll grid max-h-[80vh]">
                    <table
                        class="items-center w-full bg-transparent border-collapse shadow-xs table-auto"
                        bind:this={tablaExport}
                    >
                        <thead class="shadow-lg sticky top-0 z-20 bg-white">
                            <tr class="relative">
                                {#each tableHeaders as tableHeader}
                                    {#if tableHeader.biSort == false}
                                        <th
                                            class="px-3 align-middle cursor-not-allowed text-center border border-solid py-1 text-xs uppercase border-l-0 border-r whitespace-nowrap font-semibold bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        >
                                            {tableHeader.titulo}
                                        </th>
                                    {:else}
                                        <th
                                            on:click={() =>
                                                dispatchSort(tableHeader.campo)}
                                            class="px-3 border-r cursor-pointer align-middle border border-solid py-1 text-xs uppercase border-l-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        >
                                            <h1 class="relative">
                                                {tableHeader.titulo}
                                            </h1>
                                            {#if selectedSort == tableHeader.campo}
                                                {#if selectedAscOrDesc == "asc"}
                                                    <div
                                                        class="flex items-center justify-center"
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
                                                            class="ml-1"
                                                        >
                                                            <polyline
                                                                points="6 9 12 15 18 9"
                                                            ></polyline>
                                                        </svg>
                                                    </div>
                                                {:else}
                                                    <div
                                                        class="flex items-center justify-center"
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
                                                            class="ml-1"
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
                                        class="border-b-2 cursor-pointer transition-colors duration-200 {selectedRowId ===
                                        index
                                            ? 'bg-gray-100'
                                            : 'hover:bg-gray-50'}"
                                        on:click={() => handleRowClick(index)}
                                    >
                                        {#each tableHeaders as tableBodyItem, i}
                                            {#if tableBodyItem.tipo == "Text"}
                                                <td
                                                    class="border-t-0 {i == 0
                                                        ? 'sticky bg-white'
                                                        : ''} {selectedRowId ===
                                                    index
                                                        ? 'bg-gray-100'
                                                        : 'hover:bg-gray-50'} z-10 left-0 align-middle border-l-0 border-r-0 whitespace-nowrap"
                                                >
                                                    <p
                                                        class=" pl-1 whitespace-normal break-word sm:text-base text-xs {tableBodyItem.biBold
                                                            ? 'font-bold'
                                                            : ''} text-blueGray-500"
                                                    >
                                                        {item[
                                                            tableBodyItem.campo
                                                        ] ?? ""}
                                                    </p>
                                                </td>
                                            {:else if tableBodyItem.tipo == "Number"}
                                                <td
                                                    class="border-t-0 {i == 0
                                                        ? 'sticky bg-white'
                                                        : ''} {selectedRowId ===
                                                    index
                                                        ? 'bg-gray-100'
                                                        : 'hover:bg-gray-50'} z-10 left-0 align-middle border-l-0 border-r-0 whitespace-nowrap"
                                                >
                                                    <p
                                                        class=" pl-1 whitespace-normal break-word sm:text-base text-xs {tableBodyItem.biBold
                                                            ? 'font-bold'
                                                            : ''} text-blueGray-500"
                                                    >
                                                        {item[
                                                            tableBodyItem.campo
                                                        ] ?? ""}
                                                    </p>
                                                </td>
                                            {:else if tableBodyItem.tipo == "Buttons"}
                                                <CrudTableButtons
                                                    id={item[
                                                        tableBodyItem.campo
                                                    ]}
                                                    buttonsConfig={tableBodyItem.buttonsConfig ??
                                                        []}
                                                />
                                            {/if}
                                        {/each}
                                    </tr>
                                {/each}
                            </tbody>
                        {:else if !loading}
                            <tbody>
                                <tr>
                                    <td
                                        colspan={tableHeaders.length}
                                        class="text-center py-4"
                                    >
                                        No hay datos disponibles
                                    </td>
                                </tr>
                            </tbody>
                        {/if}
                    </table>
                    {#if loading}
                        <div class="mx-auto w-full rounded-md p-4">
                            <div class="flex animate-pulse space-x-4">
                                <div class="flex-1 space-y-6 py-1">
                                    <div class="space-y-4">
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                        <div class="h-4 rounded bg-gray-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
