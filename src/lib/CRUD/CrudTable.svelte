<script lang="ts">
  import { openModal, closeModal } from "$lib/Modals/index.js";
  import ImageModal from "./ImageModal.svelte";
  import { createEventDispatcher } from "svelte";
  import type { TableHeader } from "./interfaces.js";
  import TableHeaderComponent from "./components/TableHeader.svelte";
  import TableRow from "./components/TableRow.svelte";
  import SubRowsTable from "./components/SubRowsTable.svelte";
  import { useTableSort } from "./composables/useTableSort.js";
  import { useTableExpand } from "./composables/useTableExpand.js";
  import "../typography.css";
  import "./styles/CrudTable.css";

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
  export let columnDragEnabled: boolean = false;

  let selectedRowId: string | number | null = null;

  // Local column order (indices into tableHeaders). Null = use original order.
  let columnOrder: number[] | null = null;

  $: if (tableHeaders && (!columnOrder || columnOrder.length !== tableHeaders.length)) {
    columnOrder = tableHeaders.map((_, i) => i);
  }

  $: orderedHeaders = columnOrder
    ? columnOrder.map((i) => tableHeaders[i]).filter(Boolean)
    : tableHeaders;

  function handleColumnReorder(event: CustomEvent<{ from: number; to: number }>) {
    if (!columnOrder) return;
    const { from, to } = event.detail;
    const newOrder = [...columnOrder];
    const [moved] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, moved);
    columnOrder = newOrder;
    dispatch("columnReorderChange", {
      order: newOrder.map((i) => tableHeaders[i]?.campo).filter(Boolean),
    });
  }

  // Use custom subRowHeaders if provided, otherwise use parent headers
  $: effectiveSubRowHeaders = subRowHeaders || tableHeaders;

  // Drag and drop state
  let draggedIndex: number | null = null;
  let dragOverIndex: number | null = null;
  let isDragging = false;

  // Sort composable
  const sortComposable = useTableSort(
    (field: string, direction: "asc" | "desc") => {
      dispatch("selectedSort", {
        selectedSort: field,
        selectedAsc: direction,
      });
    },
  );

  const { selectedAscOrDesc, selectedSort, dispatchSort } = sortComposable;

  // Expand composable
  const expandComposable = useTableExpand();
  const { expandedRows, toggleExpand } = expandComposable;

  function handleRowClick(id: string | number) {
    selectedRowId = selectedRowId === id ? null : id;
    dispatch("rowClick", { id: selectedRowId });
  }

  function handleSort(field: string) {
    dispatchSort(field, $selectedAscOrDesc);
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
    if (!dragEnabled || draggedIndex === null || draggedIndex === dropIndex) {
      resetDragState();
      return;
    }

    if (!todosLosRegistros || todosLosRegistros.length === 0 || loading) {
      resetDragState();
      return;
    }

    event.preventDefault();

    const newItems = [...todosLosRegistros];
    const draggedItem = newItems[draggedIndex];

    newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

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

      item[orderField] = newOrder;
    });

    todosLosRegistros = newItems;

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
      <TableHeaderComponent
        tableHeaders={orderedHeaders}
        {dragEnabled}
        {expandEnabled}
        {columnDragEnabled}
        selectedSort={$selectedSort}
        selectedAscOrDesc={$selectedAscOrDesc}
        onSort={handleSort}
        on:columnReorder={handleColumnReorder}
      />

      {#if todosLosRegistros && !loading}
        <tbody>
          {#each todosLosRegistros as item, index}
            <TableRow
              {item}
              {index}
              tableHeaders={orderedHeaders}
              {idField}
              {dragEnabled}
              {expandEnabled}
              {subRowsField}
              {selectedRowId}
              {draggedIndex}
              {dragOverIndex}
              {loading}
              expandedRows={$expandedRows}
              onRowClick={handleRowClick}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onToggleExpand={toggleExpand}
              onImageClick={openImageModal}
            />

            <!-- Subrows as nested table -->
            {#if expandEnabled && $expandedRows.has(item[idField]) && item[subRowsField] && item[subRowsField].length > 0}
              <tr class="sub-row-container">
                <td
                  colspan={tableHeaders.length +
                    (dragEnabled ? 1 : 0) +
                    (expandEnabled ? 1 : 0)}
                  class="sub-row-cell"
                  style="--sub-table-offset: {(dragEnabled ? 40 : 0) +
                    (expandEnabled ? 50 : 0)}px"
                >
                  <SubRowsTable
                    subRows={item[subRowsField]}
                    subRowHeaders={effectiveSubRowHeaders}
                    {idField}
                    onImageClick={openImageModal}
                  />
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
