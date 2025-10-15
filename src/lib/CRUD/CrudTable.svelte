<script lang="ts">
    import CrudTableButtons from "./CrudTableButtons.svelte";
    import { openModal, closeModal } from "$lib/Modals/index.js";
    import ImageModal from "./ImageModal.svelte";

    // COMPONENTES imports

    import { createEventDispatcher } from "svelte";
    import type { TableHeader } from "./interfaces.js";
    import "../typography.css";

    const dispatch = createEventDispatcher();

    // variable que captura la tabla para exportar a Excel o Pdf
    let tablaExport;

    export let todosLosRegistros: any[] = [];
    export let tableHeaders: TableHeader[];
    export let loading: boolean = false;
    export let dragEnabled: boolean = false;
    export let orderField: string = "inOrden";
    export let idField: string = "id";
    export let expandEnabled: boolean = false;
    export let subRowsField: string = "subRows";
    export let subRowHeaders: TableHeader[] | undefined = undefined;

    let selectedAscOrDesc = "asc";
    let selectedSort = "";
    let selectedRowId: string | number | null = null;
    let expandedRows = new Set<string | number>();

    // Use custom subRowHeaders if provided, otherwise use parent headers
    $: effectiveSubRowHeaders = subRowHeaders || tableHeaders;

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

    function toggleExpand(id: string | number) {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(id)) {
            newExpandedRows.delete(id);
        } else {
            newExpandedRows.add(id);
        }
        expandedRows = newExpandedRows;
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
                        <th class="table-header-cell drag-header non-sortable header-sticky-intersection">
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
                        <th class="table-header-cell expand-header non-sortable {!dragEnabled ? 'header-sticky-intersection borderleft' : ''}">
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
                                style="text-align: {tableHeader.align ??
                                    'center'}"
                            >
                                {tableHeader.titulo}
                            </th>
                        {:else}
                            <th
                                on:click={() => dispatchSort(tableHeader.campo)}
                                class="table-header-cell {index == 0 &&
                                !dragEnabled &&
                                !expandEnabled
                                    ? 'borderleft header-sticky-intersection'
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
                            {#if expandEnabled}
                                <td
                                    class="table-cell expand-cell {!dragEnabled ? 'sticky-cell' : ''}"
                                >
                                    {#if item[subRowsField] && item[subRowsField].length > 0}
                                        <button
                                            type="button"
                                            class="expand-button"
                                            on:click|stopPropagation={() => toggleExpand(item[idField])}
                                        >
                                            <svg
                                                class="chevron-icon {expandedRows.has(item[idField]) ? 'expanded' : ''}"
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
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </button>
                                    {/if}
                                </td>
                            {/if}
                            {#each tableHeaders as tableBodyItem, i}
                                {#if tableBodyItem.tipo == "Text"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled &&
                                        !expandEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {item[
                                                tableBodyItem.colorCampo ?? ''
                                            ] ?? ''} {tableBodyItem.biBold
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
                                        !dragEnabled &&
                                        !expandEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {item[
                                                tableBodyItem.colorCampo ?? ''
                                            ] ?? ''} {tableBodyItem.biBold
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
                                        !dragEnabled &&
                                        !expandEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {item[
                                                tableBodyItem.colorCampo ?? ''
                                            ] ?? ''} {tableBodyItem.biBold
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
                                        !dragEnabled &&
                                        !expandEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <p
                                            class="cell-content {item[
                                                tableBodyItem.colorCampo ?? ''
                                            ] ?? ''} {tableBodyItem.biBold
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
                                        !dragEnabled &&
                                        !expandEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        {#if item[tableBodyItem.campo] === true}
                                            <p
                                                class="cell-content {item[
                                                    tableBodyItem.colorCampo ??
                                                        ''
                                                ] ?? ''} {tableBodyItem.biBold
                                                    ? 'bold'
                                                    : ''}"
                                                style="text-align: {tableBodyItem.align ??
                                                    'left'}"
                                            >
                                                <i class="fas fa-check"></i>
                                            </p>
                                        {:else}
                                            <p
                                                class="cell-content {item[
                                                    tableBodyItem.colorCampo ??
                                                        ''
                                                ] ?? ''} {tableBodyItem.biBold
                                                    ? 'bold'
                                                    : ''}"
                                                style="text-align: {tableBodyItem.align ??
                                                    'left'}"
                                            >
                                                <i class="fas fa-minus"></i>
                                            </p>
                                        {/if}
                                    </td>
                                {:else if tableBodyItem.tipo == "EditableBool"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled &&
                                        !expandEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                        style="text-align: {tableBodyItem.align ??
                                            'center'}"
                                    >
                                        {#if item[tableBodyItem.campo]}
                                            <button
                                                class="editable-checkbox {item[
                                                    tableBodyItem.campo
                                                ]
                                                    ? 'checked'
                                                    : ''}"
                                                on:click={async () => {
                                                    const newValue =
                                                        !item[
                                                            tableBodyItem.campo
                                                        ];
                                                    item[tableBodyItem.campo] =
                                                        newValue;
                                                    if (
                                                        tableBodyItem.onUpdate
                                                    ) {
                                                        await tableBodyItem.onUpdate(
                                                            item[idField],
                                                            tableBodyItem.campo,
                                                            newValue
                                                        );
                                                    }
                                                }}
                                            >
                                                <i class="fas fa-check"></i>
                                            </button>
                                        {:else}
                                            <button
                                                class="editable-checkbox {item[
                                                    tableBodyItem.campo
                                                ]
                                                    ? 'checked'
                                                    : ''}"
                                                on:click={async () => {
                                                    const newValue =
                                                        !item[
                                                            tableBodyItem.campo
                                                        ];
                                                    item[tableBodyItem.campo] =
                                                        newValue;
                                                    if (
                                                        tableBodyItem.onUpdate
                                                    ) {
                                                        await tableBodyItem.onUpdate(
                                                            item[idField],
                                                            tableBodyItem.campo,
                                                            newValue
                                                        );
                                                    }
                                                }}
                                            >
                                                <i class="fas fa-minus"></i>
                                            </button>
                                        {/if}
                                    </td>
                                {:else if tableBodyItem.tipo == "EditableText"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled &&
                                        !expandEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <input
                                            type="text"
                                            class="editable-input"
                                            bind:value={
                                                item[tableBodyItem.campo]
                                            }
                                            on:blur={async (e) => {
                                                if (tableBodyItem.onUpdate) {
                                                    await tableBodyItem.onUpdate(
                                                        item[idField],
                                                        tableBodyItem.campo,
                                                        e.currentTarget.value
                                                    );
                                                }
                                            }}
                                            on:keydown={async (e) => {
                                                if (e.key === "Enter") {
                                                    e.currentTarget.blur();
                                                }
                                            }}
                                            style="text-align: {tableBodyItem.align ??
                                                'left'}"
                                        />
                                    </td>
                                {:else if tableBodyItem.tipo == "EditableNumber"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled &&
                                        !expandEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                    >
                                        <input
                                            type="number"
                                            class="editable-input"
                                            bind:value={
                                                item[tableBodyItem.campo]
                                            }
                                            on:blur={async (e) => {
                                                if (tableBodyItem.onUpdate) {
                                                    const numValue = parseFloat(
                                                        e.currentTarget.value
                                                    );
                                                    await tableBodyItem.onUpdate(
                                                        item[idField],
                                                        tableBodyItem.campo,
                                                        isNaN(numValue)
                                                            ? null
                                                            : numValue
                                                    );
                                                }
                                            }}
                                            on:keydown={async (e) => {
                                                if (e.key === "Enter") {
                                                    e.currentTarget.blur();
                                                }
                                            }}
                                            style="text-align: {tableBodyItem.align ??
                                                'right'}"
                                        />
                                    </td>
                                {:else if tableBodyItem.tipo == "Image"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled &&
                                        !expandEnabled
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
                                {:else if tableBodyItem.tipo == "DynamicButton"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled &&
                                        !expandEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                        style="text-align: {tableBodyItem.align ??
                                            'center'}"
                                    >
                                        <button
                                            type="button"
                                            class="dynamic-button {item[
                                                tableBodyItem.colorField ?? ''
                                            ] ?? ''}"
                                            on:click={() => {
                                                if (tableBodyItem.onButtonClick) {
                                                    tableBodyItem.onButtonClick(
                                                        item[idField],
                                                        item
                                                    );
                                                }
                                            }}
                                        >
                                            {#if tableBodyItem.iconField && item[tableBodyItem.iconField]}
                                                {#if (!tableBodyItem.iconPosition || tableBodyItem.iconPosition === 'left')}
                                                    <i class="{item[tableBodyItem.iconField]} dynamic-button-icon-left"></i>
                                                {/if}
                                            {/if}
                                            {#if tableBodyItem.textField && item[tableBodyItem.textField]}
                                                <span>{item[tableBodyItem.textField]}</span>
                                            {/if}
                                            {#if tableBodyItem.iconField && item[tableBodyItem.iconField]}
                                                {#if tableBodyItem.iconPosition === 'right'}
                                                    <i class="{item[tableBodyItem.iconField]} dynamic-button-icon-right"></i>
                                                {/if}
                                            {/if}
                                        </button>
                                    </td>
                                {:else if tableBodyItem.tipo == "ImageButton"}
                                    <td
                                        class="table-cell {i == 0 &&
                                        !dragEnabled &&
                                        !expandEnabled
                                            ? 'sticky-cell'
                                            : ''}"
                                        style="text-align: {tableBodyItem.align ??
                                            'center'}"
                                    >
                                        <button
                                            type="button"
                                            class="image-button-wrapper"
                                            on:click={() => {
                                                if (tableBodyItem.action) {
                                                    tableBodyItem.action(
                                                        item[idField]
                                                    );
                                                }
                                            }}
                                        >
                                            <img
                                                src={item[tableBodyItem.imageField ?? ''] ?? ''}
                                                alt="button"
                                                class="image-button image-button-{tableBodyItem.imageSize ?? 'md'}"
                                            />
                                        </button>
                                    </td>
                                {/if}
                            {/each}
                        </tr>

                        <!-- Subrows as nested table -->
                        {#if expandEnabled && expandedRows.has(item[idField]) && item[subRowsField] && item[subRowsField].length > 0}
                            <tr class="sub-row-container">
                                <td
                                    colspan={tableHeaders.length + (dragEnabled ? 1 : 0) + (expandEnabled ? 1 : 0)}
                                    class="sub-row-cell"
                                >
                                    <table class="sub-table">
                                        <tbody>
                                            {#each item[subRowsField] as subItem, subIndex}
                                                <tr class="sub-row">
                                                    {#each effectiveSubRowHeaders as subHeader, i}
                                                                        {#if subHeader.tipo == "Text"}
                                                            <td class="table-cell">
                                                                <p
                                                                    class="cell-content {subItem[subHeader.colorCampo ?? ''] ?? ''} {subHeader.biBold ? 'bold' : ''}"
                                                                    style="text-align: {subHeader.align ?? 'left'}"
                                                                >
                                                                    {subItem[subHeader.campo] ?? ""}
                                                </p>
                                                            </td>
                                                                        {:else if subHeader.tipo == "Number"}
                                                            <td class="table-cell">
                                                                <p
                                                                    class="cell-content {subItem[subHeader.colorCampo ?? ''] ?? ''} {subHeader.biBold ? 'bold' : ''}"
                                                                    style="text-align: {subHeader.align ?? 'left'}"
                                                                >
                                                                    {subItem[subHeader.campo] ?? ""}
                                                </p>
                                                            </td>
                                                        {:else if subHeader.tipo == "Date"}
                                            <td class="table-cell">
                                                                <p
                                                                    class="cell-content {subItem[subHeader.colorCampo ?? ''] ?? ''} {subHeader.biBold ? 'bold' : ''}"
                                                                    style="text-align: {subHeader.align ?? 'left'}"
                                                                >
                                                                    {subItem[subHeader.campo]?.split("T")[0] ?? ":"}
                                                </p>
                                                            </td>
                                                        {:else if subHeader.tipo == "Datetime"}
                                            <td class="table-cell">
                                                                <p
                                                                    class="cell-content {subItem[subHeader.colorCampo ?? ''] ?? ''} {subHeader.biBold ? 'bold' : ''}"
                                                                    style="text-align: {subHeader.align ?? 'left'}"
                                                                >
                                                                    {subItem[subHeader.campo]?.replace("T", ":") ?? ":"}
                                                </p>
                                                            </td>
                                                        {:else if subHeader.tipo == "Bool"}
                                            <td class="table-cell">
                                                                {#if subItem[subHeader.campo] === true}
                                                                    <p
                                                        class="cell-content {subItem[subHeader.colorCampo ?? ''] ?? ''} {subHeader.biBold ? 'bold' : ''}"
                                                        style="text-align: {subHeader.align ?? 'left'}"
                                                    >
                                                        <i class="fas fa-check"></i>
                                                    </p>
                                                                {:else}
                                                                    <p
                                                        class="cell-content {subItem[subHeader.colorCampo ?? ''] ?? ''} {subHeader.biBold ? 'bold' : ''}"
                                                        style="text-align: {subHeader.align ?? 'left'}"
                                                    >
                                                        <i class="fas fa-minus"></i>
                                                    </p>
                                                {/if}
                                                            </td>
                                                        {:else if subHeader.tipo == "Image"}
                                                            <td class="table-cell">
                                                                <img
                                                                    class="crud-image cursor-pointer"
                                                                    src={subItem[subHeader.campo] ?? ""}
                                                                    alt="image"
                                                                    on:click={() => openImageModal(subItem[subHeader.campo])}
                                                                />
                                                            </td>
                                                        {:else if subHeader.tipo == "Buttons"}
                                                            <CrudTableButtons
                                                                id={subItem[subHeader.campo]}
                                                                buttonsConfig={subHeader.buttonsConfig ?? []}
                                                                align={subHeader.align ?? "center"}
                                                            />
                                                        {:else if subHeader.tipo == "DynamicButton"}
                                                            <td class="table-cell" style="text-align: {subHeader.align ?? 'center'}">
                                                                <button
                                                                    type="button"
                                                                    class="dynamic-button {subItem[subHeader.colorField ?? ''] ?? ''}"
                                                    on:click={() => {
                                                        if (subHeader.onButtonClick) {
                                                            subHeader.onButtonClick(subItem[idField], subItem);
                                                        }
                                                    }}
                                                >
                                                    {#if subHeader.iconField && subItem[subHeader.iconField]}
                                                        {#if (!subHeader.iconPosition || subHeader.iconPosition === 'left')}
                                                            <i class="{subItem[subHeader.iconField]} dynamic-button-icon-left"></i>
                                                        {/if}
                                                    {/if}
                                                    {#if subHeader.textField && subItem[subHeader.textField]}
                                                        <span>{subItem[subHeader.textField]}</span>
                                                    {/if}
                                                    {#if subHeader.iconField && subItem[subHeader.iconField]}
                                                        {#if subHeader.iconPosition === 'right'}
                                                            <i class="{subItem[subHeader.iconField]} dynamic-button-icon-right"></i>
                                                        {/if}
                                                    {/if}
                                                </button>
                                                            </td>
                                                        {:else if subHeader.tipo == "ImageButton"}
                                            <td class="table-cell" style="text-align: {subHeader.align ?? 'center'}">
                                                <button
                                                    type="button"
                                                    class="image-button-wrapper"
                                                    on:click={() => {
                                                        if (subHeader.action) {
                                                            subHeader.action(subItem[idField]);
                                                        }
                                                    }}
                                                >
                                                    <img
                                                        src={subItem[subHeader.imageField ?? ''] ?? ''}
                                                        alt="button"
                                                        class="image-button image-button-{subHeader.imageSize ?? 'md'}"
                                                    />
                                                </button>
                                            </td>
                                                        {:else}
                                                            <td class="table-cell"></td>
                                                        {/if}
                                                    {/each}
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            {:else if !loading}
                <tbody>
                    <tr>
                        <td
                            colspan={tableHeaders.length +
                                (dragEnabled ? 1 : 0) +
                                (expandEnabled ? 1 : 0)}
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
        margin-top: 0.75rem;
    }

    .table-scroll {
        overflow: auto;
        max-height: 80vh;
    }

    /* Scrollbar Styles for WebKit browsers (Chrome, Safari, Edge) */
    .table-scroll::-webkit-scrollbar {
        width: var(--grav-crud-scrollbar-width);
        height: var(--grav-crud-scrollbar-width);
    }

    .table-scroll::-webkit-scrollbar-track {
        background: var(--grav-crud-scrollbar-track);
        border-radius: var(--grav-border-radius-sm);
    }

    .table-scroll::-webkit-scrollbar-thumb {
        background: var(--grav-crud-scrollbar-thumb);
        border-radius: var(--grav-border-radius-sm);
        transition: background-color 0.2s ease;
    }

    .table-scroll::-webkit-scrollbar-thumb:hover {
        background: var(--grav-crud-scrollbar-thumb-hover);
    }

    /* Scrollbar Styles for Firefox */
    .table-scroll {
        scrollbar-width: thin;
        scrollbar-color: var(--grav-crud-scrollbar-thumb)
            var(--grav-crud-scrollbar-track);
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: auto;
    }

    .table-header {
        position: sticky;
        top: 0;
        z-index: 20;
        border-bottom-style: solid;
        border-bottom-color: var(--grav-crud-color-border);
        border-bottom-width: var(--grav-crud-cell-border-width, 1.5px);
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    @supports (backdrop-filter: blur(8px)) or (-webkit-backdrop-filter: blur(8px)) {
        .table-header {
            background-color: var(--grav-crud-color-bg, rgba(255, 255, 255, 0.85));
        }
    }

    .table-header-cell {
        padding: 0.75rem;
        text-align: center;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        font-family: var(--grav-crud-header-font-family, "mundial", sans-serif);
        font-size: var(--grav-crud-header-font-size, 0.75rem);
        font-weight: var(--grav-crud-header-font-weight, 400);
        line-height: var(--grav-crud-header-line-height, 1.5);
        text-transform: uppercase;
        white-space: nowrap;
        background-color: inherit;
        color: var(--grav-crud-color-neutral);
        border-left: 0;
    }

    .non-sortable {
        cursor: not-allowed;
    }

    .sortable {
        cursor: pointer;
        text-align: left;
    }

    .borderleft {
        border-left-width: var(--grav-crud-table-border-width, 1.5px);
        border-left-style: solid;
        border-left-color: var(--grav-crud-color-border);
    }

    /* Special class for header cells that are sticky on both axes (top + left) */
    .header-sticky-intersection {
        background-color: var(--grav-crud-color-bg, rgba(255, 255, 255, 0.95)) !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
    }

    /* When header-sticky-intersection is applied to first column header (not drag-header) */
    .borderleft.header-sticky-intersection {
        position: sticky;
        left: 0;
        z-index: 25;
        padding-right: 1rem;
        margin-right: 0.5rem;
        box-shadow:
            inset -1.5px 0 0 var(--grav-crud-color-border),
            2px 0 6px rgba(0, 0, 0, 0.08);
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
        border-bottom-width: var(--grav-crud-cell-border-width, 1.5px);
        border-bottom-style: solid;
        border-bottom-color: var(--grav-crud-color-border);
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .table-row:hover {
        background-color: var(--grav-crud-color-light);
    }

    .table-row.selected {
        background-color: var(--grav-crud-color-drag);
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
        left: 0;
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 15;
        border-bottom: inherit;
        box-shadow:
            inset -1.5px 0 0 var(--grav-crud-color-border),
            2px 0 6px rgba(0, 0, 0, 0.08);
    }

    @supports (backdrop-filter: blur(8px)) or (-webkit-backdrop-filter: blur(8px)) {
        .sticky-cell {
            background-color: var(--grav-crud-color-bg, rgba(255, 255, 255, 0.85));
        }
    }

    .cell-content {
        padding-left: 0.25rem;
        white-space: normal;
        word-break: break-word;
        font-family: var(--grav-crud-cell-font-family, "mundial", sans-serif);
        font-size: var(--grav-crud-cell-font-size, 0.875rem);
        font-weight: var(--grav-crud-cell-font-weight, 400);
        line-height: var(--grav-crud-cell-line-height, 1.5);
        color: var(--grav-crud-color-neutral);
        margin-left: 3px;
        margin-right: 3px;
        padding-right: 0.3rem;
        padding-left: 0.3rem;
        border-radius: 0.375rem;
    }

    .cell-content.bold {
        font-weight: bold;
    }

    .no-data {
        text-align: center;
        padding: 1rem 0;
        font-family: var(--grav-crud-cell-font-family, "mundial", sans-serif);
        font-size: var(--grav-crud-cell-font-size, 0.875rem);
        font-weight: var(--grav-crud-cell-font-weight, 400);
        line-height: var(--grav-crud-cell-line-height, 1.5);
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
        background-color: var(--grav-crud-color-border);
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
        width: 4rem;
        height: 4rem;
        object-fit: cover;
        margin: 0.5rem auto;
        border-radius: var(--grav-crud-image-border-radius, 0.25rem);
        display: block;
    }

    /* Drag and drop styles */
    .drag-header {
        width: 40px;
        text-align: center;
        cursor: default;
        position: sticky;
        left: 0;
        z-index: 25;
        padding-right: 0.75rem;
        box-shadow:
            inset -1.5px 0 0 var(--grav-crud-color-border),
            2px 0 6px rgba(0, 0, 0, 0.08);
    }

    .drag-handle-header {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--grav-crud-color-icon);
    }

    .drag-handle-cell {
        width: 40px;
        text-align: center;
        padding: 0.5rem;
        padding-right: 0.75rem;
        cursor: grab;
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 15;
        border-bottom: inherit;
        box-shadow:
            inset -1.5px 0 0 var(--grav-crud-color-border),
            2px 0 6px rgba(0, 0, 0, 0.08);
    }

    @supports (backdrop-filter: blur(8px)) or (-webkit-backdrop-filter: blur(8px)) {
        .drag-handle-cell {
            background-color: var(--grav-crud-color-bg, rgba(255, 255, 255, 0.85));
        }
    }

    .drag-handle {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--grav-crud-color-icon);
        transition: color 0.2s;
        padding: 0.25rem;
    }

    .draggable-row {
        transition: all 0.3s ease;
    }

    .draggable-row.dragging {
        opacity: 0.5;
        transform: scale(0.98);
        background-color: var(--grav-crud-color-drag);
        cursor: grabbing;
    }

    .draggable-row.dragging .drag-handle {
        cursor: grabbing;
    }

    .draggable-row.drag-over {
        background-color: var(--grav-crud-color-drag);
        border-top: 2px solid var(--grav-crud-color-drag);
        border-bottom: 2px solid var(--grav-crud-color-drag);
    }

    /* Editable cell styles */
    .editable-checkbox {
        width: 2rem;
        height: 2rem;
        background: transparent;
        border: 1.5px solid var(--grav-crud-color-neutral);
        color: var(--grav-crud-color-neutral);
        cursor: pointer;
        border-radius: 0.375rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        padding: 0;
    }

    .editable-checkbox:hover {
        background-color: var(--grav-crud-color-light);
    }

    .editable-checkbox.checked {
        background-color: var(--grav-crud-color-primary);
        color: var(--grav-crud-color-icon);
        border-color: var(--grav-crud-color-primary);
    }

    .editable-input {
        width: 100%;
        padding: 0.5rem;
        border: 1.5px solid transparent;
        background: transparent;
        border-radius: 0.375rem;
        font-family: var(--grav-crud-cell-font-family, "mundial", sans-serif);
        font-size: var(--grav-crud-cell-font-size, 0.875rem);
        color: var(--grav-crud-color-neutral);
        transition: all 0.2s ease;
    }

    .editable-input:hover {
        border-color: var(--grav-crud-color-border);
        background-color: var(--grav-crud-color-light);
    }

    .editable-input:focus {
        outline: none;
        border-color: var(--grav-crud-color-primary);
        background-color: var(--grav-crud-color-bg);
    }

    /* Remove number input arrows */
    .editable-input[type="number"]::-webkit-outer-spin-button,
    .editable-input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .editable-input[type="number"] {
        -moz-appearance: textfield;
    }

    /* Dynamic Button Styles */
    .dynamic-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-family: var(--grav-crud-cell-font-family, "mundial", sans-serif);
        font-size: var(--grav-crud-cell-font-size, 0.875rem);
        font-weight: 500;
        border: 1.5px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        background-color: var(--grav-crud-color-neutral);
        color: var(--grav-crud-color-button);
    }

    .dynamic-button:hover {
        opacity: 0.8;
        transform: translateY(-1px);
    }

    .dynamic-button:active {
        transform: translateY(0);
    }

    .dynamic-button-icon-left {
    }

    .dynamic-button-icon-right {
    }

    /* Image Button Styles */
    .image-button-wrapper {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .image-button {
        border-radius: 50%;
        object-fit: cover;
        transition: all 0.2s ease;
        border: none;
    }

    .image-button:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .image-button:active {
        transform: scale(1.05);
    }

    .image-button-sm {
        width: 32px;
        height: 32px;
    }

    .image-button-md {
        width: 48px;
        height: 48px;
    }

    .image-button-lg {
        width: 64px;
        height: 64px;
    }

    /* Expand/Collapse Styles */
    .expand-header {
        width: 50px;
        text-align: center;
    }

    .expand-cell {
        width: 50px;
        text-align: center;
        padding: 0.5rem;
        vertical-align: middle;
    }

    .expand-button {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.25rem;
        transition: all 0.2s ease;
    }

    .expand-button:hover {
        background-color: var(--grav-crud-color-light);
    }

    .chevron-icon {
        color: var(--grav-crud-color-neutral);
        transition: transform 0.3s ease;
        transform: rotate(0deg);
    }

    .chevron-icon.expanded {
        transform: rotate(90deg);
    }

    .expand-button:hover .chevron-icon {
        color: var(--grav-crud-color-primary, var(--grav-crud-color-neutral));
        transform: scale(1.15) rotate(0deg);
    }

    .expand-button:hover .chevron-icon.expanded {
        transform: scale(1.15) rotate(90deg);
    }

    /* Subrow Styles */
    .sub-row-container {
        background-color: rgba(0, 0, 0, 0.02);
    }

    .sub-row-cell {
        padding: 0 !important;
    }

    .sub-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.02);
    }

    .sub-table .sub-row {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .sub-table .sub-row:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }

    .sub-table .table-cell {
        padding: 0.5rem;
        vertical-align: middle;
        border: none;
    }

    .sub-table .cell-content {
        padding-left: 0.5rem;
    }
</style>
