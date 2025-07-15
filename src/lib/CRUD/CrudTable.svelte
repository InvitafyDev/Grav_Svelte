<script lang="ts">
    import CrudTableButtons from "./CrudTableButtons.svelte";
    import { openModal, closeModal } from "$lib/Modals/index.js";
    import ImageModal from "./ImageModal.svelte";

    // COMPONENTES imports

    import { createEventDispatcher } from "svelte";
    import type { TableHeader } from "./interfaces.js";

    const dispatch = createEventDispatcher();

    // variable que captura la tabla para exportar a Excel o Pdf
    let tablaExport;

    export let todosLosRegistros: any[] = [];
    export let tableHeaders: TableHeader[];
    export let loading: boolean = false;
    export let dragEnabled: boolean = false;
    export let orderField: string = "inOrden";

    let selectedAscOrDesc = "asc";
    let selectedSort = "";
    let selectedRowId: string | number | null = null;

    // Drag and drop variables
    let draggedIndex: number | null = null;
    let dragOverIndex: number | null = null;
    let isDragging = false;
    let reorderedItems: any[] = [];

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

    function openImageModal(src: string) {
        closeModal("crud-image-modal");
        openModal("crud-image-modal", ImageModal, { src });
    }

    // Drag and drop functions
    function handleDragStart(event: DragEvent, index: number) {
        if (
            !dragEnabled ||
            !todosLosRegistros ||
            todosLosRegistros.length === 0 ||
            loading
        ) {
            event.preventDefault();
            return;
        }

        draggedIndex = index;
        isDragging = true;

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/html", "");
        }
    }

    function handleDragOver(event: DragEvent, index: number) {
        if (!dragEnabled || draggedIndex === null) return;

        event.preventDefault();
        dragOverIndex = index;

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "move";
        }
    }

    function handleDragLeave() {
        dragOverIndex = null;
    }

    function handleDrop(event: DragEvent, dropIndex: number) {
        if (
            !dragEnabled ||
            draggedIndex === null ||
            draggedIndex === dropIndex
        ) {
            resetDragState();
            return;
        }

        // Prevent reordering if there's no data or data is still loading
        if (!todosLosRegistros || todosLosRegistros.length === 0 || loading) {
            resetDragState();
            return;
        }

        event.preventDefault();

        // Create a new array with reordered items
        const newItems = [...todosLosRegistros];
        const draggedItem = newItems[draggedIndex];

        // Remove the dragged item from its original position
        newItems.splice(draggedIndex, 1);

        // Insert the dragged item at the new position
        newItems.splice(dropIndex, 0, draggedItem);

        // Update the order values and track changes
        const changes: any[] = [];

        newItems.forEach((item, index) => {
            const newOrder = index + 1;
            const originalOrder = item[orderField];

            if (originalOrder !== newOrder) {
                changes.push({
                    ...item,
                    [orderField]: newOrder,
                });
            }

            // Update the item's order in the array
            item[orderField] = newOrder;
        });

        // Update the items array
        todosLosRegistros = newItems;
        reorderedItems = changes;

        // Emit the reorder event
        dispatch("reorderChange", { reorderedItems: changes });

        resetDragState();
    }

    function handleDragEnd() {
        resetDragState();
    }

    function resetDragState() {
        draggedIndex = null;
        dragOverIndex = null;
        isDragging = false;
    }
</script>

<div class="table-container">
    <div class="table-scroll">
        <table class="data-table" bind:this={tablaExport}>
            <thead class="table-header">
                <tr>
                    {#if dragEnabled}
                        <th
                            class="table-header-cell drag-header borderleft non-sortable"
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
                    {#each tableHeaders as tableHeader, index}
                        {#if tableHeader.biSort == false}
                            <th
                                class="table-header-cell {index == 0 &&
                                !dragEnabled
                                    ? 'borderleft'
                                    : ''} non-sortable"
                                style="text-align: {tableHeader.align ??
                                    'center'}"
                            >
                                {tableHeader.titulo}
                            </th>
                        {:else}
                            <th
                                on:click={() => dispatchSort(tableHeader.campo)}
                                class="table-header-cell {index == 0 &&
                                !dragEnabled
                                    ? 'borderleft'
                                    : ''} sortable"
                                style="text-align: {tableHeader.align ??
                                    'left'}"
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
                                : ''} {dragEnabled &&
                            !loading &&
                            todosLosRegistros.length > 0
                                ? 'draggable-row'
                                : ''} {draggedIndex === index
                                ? 'dragging'
                                : ''} {dragOverIndex === index
                                ? 'drag-over'
                                : ''}"
                            draggable={dragEnabled &&
                                !loading &&
                                todosLosRegistros.length > 0}
                            on:click={() => handleRowClick(index)}
                            on:dragstart={(e) => handleDragStart(e, index)}
                            on:dragover={(e) => handleDragOver(e, index)}
                            on:dragleave={handleDragLeave}
                            on:drop={(e) => handleDrop(e, index)}
                            on:dragend={handleDragEnd}
                        >
                            {#if dragEnabled}
                                <td
                                    class="table-cell drag-handle-cell sticky-cell"
                                >
                                    <div
                                        class="drag-handle"
                                        title="Drag to reorder"
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
                                            <circle cx="9" cy="12" r="1"
                                            ></circle>
                                            <circle cx="9" cy="5" r="1"
                                            ></circle>
                                            <circle cx="9" cy="19" r="1"
                                            ></circle>
                                            <circle cx="15" cy="12" r="1"
                                            ></circle>
                                            <circle cx="15" cy="5" r="1"
                                            ></circle>
                                            <circle cx="15" cy="19" r="1"
                                            ></circle>
                                        </svg>
                                    </div>
                                </td>
                            {/if}
                            {#each tableHeaders as tableBodyItem, i}
                                {#if tableBodyItem.tipo == "Text"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {tableBodyItem.biBold
                                                ? 'bold'
                                                : ''}"
                                            style="text-align: {tableBodyItem.align ??
                                                'left'}"
                                        >
                                            {item[tableBodyItem.campo] ?? ""}
                                        </p>
                                    </td>
                                {:else if tableBodyItem.tipo == "Number"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {tableBodyItem.biBold
                                                ? 'bold'
                                                : ''}"
                                            style="text-align: {tableBodyItem.align ??
                                                'left'}"
                                        >
                                            {item[tableBodyItem.campo] ?? ""}
                                        </p>
                                    </td>
                                {:else if tableBodyItem.tipo == "Datetime"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {tableBodyItem.biBold
                                                ? 'bold'
                                                : ''}"
                                            style="text-align: {tableBodyItem.align ??
                                                'left'}"
                                        >
                                            {item[tableBodyItem.campo]?.replace(
                                                "T",
                                                ":"
                                            ) ?? ":"}
                                        </p>
                                    </td>
                                {:else if tableBodyItem.tipo == "Date"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {tableBodyItem.biBold
                                                ? 'bold'
                                                : ''}"
                                            style="text-align: {tableBodyItem.align ??
                                                'left'}"
                                        >
                                            {item[tableBodyItem.campo]?.split(
                                                "T"
                                            )[0] ?? ":"}
                                        </p>
                                    </td>
                                {:else if tableBodyItem.tipo == "Bool"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {tableBodyItem.biBold
                                                ? 'bold'
                                                : ''}"
                                            style="text-align: {tableBodyItem.align ??
                                                'left'}"
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
                                        class="table-cell {i == 0 &&
                                        !dragEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <img
                                            class="crud-image cursor-pointer"
                                            src={item[tableBodyItem.campo] ??
                                                ""}
                                            alt="image"
                                            on:click={() =>
                                                openImageModal(
                                                    item[tableBodyItem.campo]
                                                )}
                                        />
                                    </td>
                                {:else if tableBodyItem.tipo == "Buttons"}
                                    <CrudTableButtons
                                        id={item[tableBodyItem.campo]}
                                        buttonsConfig={tableBodyItem.buttonsConfig ??
                                            []}
                                        align={tableBodyItem.align ?? "center"}
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
                            colspan={tableHeaders.length +
                                (dragEnabled ? 1 : 0)}
                            class="no-data"
                        >
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

    /* Drag and drop styles */
    .drag-header {
        width: 40px;
        text-align: center;
        cursor: default;
    }

    .drag-handle-header {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ca3af;
    }

    .drag-handle-cell {
        width: 40px;
        text-align: center;
        padding: 0.5rem;
        cursor: grab;
        border-right: 1px solid #e0e0e0;
    }

    .drag-handle {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ca3af;
        transition: color 0.2s;
        padding: 0.25rem;
    }

    .drag-handle:hover {
        color: #6b7280;
    }

    .draggable-row {
        transition: all 0.3s ease;
    }

    .draggable-row:hover .drag-handle {
        color: #4b5563;
    }

    .draggable-row.dragging {
        opacity: 0.5;
        transform: scale(0.98);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        background-color: #f9fafb;
        cursor: grabbing;
    }

    .draggable-row.dragging .drag-handle {
        cursor: grabbing;
    }

    .draggable-row.drag-over {
        background-color: #e0f2fe;
        border-top: 2px solid #0284c7;
        border-bottom: 2px solid #0284c7;
        box-shadow: 0 4px 8px -2px rgba(2, 132, 199, 0.2);
    }

    .draggable-row.drag-over .sticky-cell {
        background-color: #e0f2fe;
    }

    .draggable-row.drag-over .drag-handle-cell {
        background-color: #e0f2fe;
    }

    .draggable-row.selected.drag-over {
        background-color: #bfdbfe;
    }

    .draggable-row.selected.drag-over .sticky-cell {
        background-color: #bfdbfe;
    }

    .draggable-row.selected.drag-over .drag-handle-cell {
        background-color: #bfdbfe;
    }

    /* Ensure sticky cells follow drag states */
    .draggable-row.dragging .sticky-cell {
        background-color: #f9fafb;
    }

    .draggable-row.dragging .drag-handle-cell {
        background-color: #f9fafb;
    }

    .draggable-row:hover .drag-handle-cell {
        background-color: #f5f5f5;
    }

    .draggable-row.selected .drag-handle-cell {
        background-color: #e8e8e8;
    }
</style>
