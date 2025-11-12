<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let tableHeaders: TableHeader[];
    export let dragEnabled: boolean;
    export let expandEnabled: boolean;
    export let selectedSort: string;
    export let selectedAscOrDesc: "asc" | "desc";
    export let onSort: (field: string) => void;
</script>

<thead class="table-header">
    <tr>
        {#if dragEnabled}
            <th
                class="table-header-cell drag-header non-sortable header-sticky-intersection"
            >
                <div class="drag-handle-header">
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
                        <circle cx="9" cy="12" r="1"></circle>
                        <circle cx="9" cy="5" r="1"></circle>
                        <circle cx="9" cy="19" r="1"></circle>
                        <circle cx="15" cy="12" r="1"></circle>
                        <circle cx="15" cy="5" r="1"></circle>
                        <circle cx="15" cy="19" r="1"></circle>
                    </svg>
                </div>
            </th>
        {/if}
        {#if expandEnabled}
            <th
                class="table-header-cell expand-header non-sortable {!dragEnabled
                    ? 'header-sticky-intersection '
                    : ''}"
            >
            </th>
        {/if}
        {#each tableHeaders as tableHeader, index}
            {#if tableHeader.biSort == false}
                <th
                    class="table-header-cell {index == 0 &&
                    !dragEnabled &&
                    !expandEnabled
                        ? 'borderleft header-sticky-intersection'
                        : ''} non-sortable"
                    style="text-align: {tableHeader.align ?? 'center'}"
                >
                    {tableHeader.titulo}
                </th>
            {:else}
                <th
                    on:click={() => onSort(tableHeader.campo)}
                    class="table-header-cell {index == 0 &&
                    !dragEnabled &&
                    !expandEnabled
                        ? 'borderleft header-sticky-intersection'
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
                                    <polyline points="6 9 12 15 18 9"></polyline>
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
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                </svg>
                            </div>
                        {/if}
                    {/if}
                </th>
            {/if}
        {/each}
    </tr>
</thead>
