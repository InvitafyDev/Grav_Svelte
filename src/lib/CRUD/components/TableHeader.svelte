<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { TableHeader } from "../interfaces.js";

  export let tableHeaders: TableHeader[];
  export let dragEnabled: boolean;
  export let expandEnabled: boolean;
  export let selectedSort: string;
  export let selectedAscOrDesc: "asc" | "desc";
  export let onSort: (field: string) => void;
  export let columnDragEnabled: boolean = false;

  const dispatch = createEventDispatcher();

  let colDraggedIndex: number | null = null;
  let colDragOverIndex: number | null = null;

  function handleColDragStart(e: DragEvent, index: number) {
    if (!columnDragEnabled) return;
    colDraggedIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "col-" + index);
    }
  }

  function handleColDragOver(e: DragEvent, index: number) {
    if (!columnDragEnabled || colDraggedIndex === null) return;
    e.preventDefault();
    colDragOverIndex = index;
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  }

  function handleColDragLeave() {
    colDragOverIndex = null;
  }

  function handleColDrop(e: DragEvent, dropIndex: number) {
    if (!columnDragEnabled || colDraggedIndex === null) return;
    e.preventDefault();
    if (colDraggedIndex !== dropIndex) {
      dispatch("columnReorder", { from: colDraggedIndex, to: dropIndex });
    }
    colDraggedIndex = null;
    colDragOverIndex = null;
  }

  function handleColDragEnd() {
    colDraggedIndex = null;
    colDragOverIndex = null;
  }
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
      <th
        on:click={() => { if (tableHeader.biSort) onSort(tableHeader.campo); }}
        class="table-header-cell {index == 0 && !dragEnabled && !expandEnabled
          ? 'first-column-limited'
          : ''} {tableHeader.biSort ? 'sortable' : 'non-sortable'} {columnDragEnabled ? 'column-draggable' : ''} {colDragOverIndex === index && colDraggedIndex !== null && colDraggedIndex !== index ? 'column-drag-over' : ''} {colDraggedIndex === index ? 'column-dragging' : ''}"
        style="text-align: {tableHeader.align ?? (tableHeader.biSort ? 'left' : 'center')}"
        draggable={columnDragEnabled}
        on:dragstart={(e) => handleColDragStart(e, index)}
        on:dragover={(e) => handleColDragOver(e, index)}
        on:dragleave={handleColDragLeave}
        on:drop={(e) => handleColDrop(e, index)}
        on:dragend={handleColDragEnd}
      >
        {#if tableHeader.biSort}
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
        {:else}
          {tableHeader.titulo}
        {/if}
      </th>
    {/each}
  </tr>
</thead>

<style>
  .column-draggable {
    cursor: grab;
    transition: all 0.3s ease;
  }
  .column-draggable:active {
    cursor: grabbing;
  }
  .column-dragging {
    opacity: 0.5;
    transform: scale(0.98);
    background-color: var(--grav-crud-color-light);
    cursor: grabbing;
  }
  .column-drag-over {
    background-color: var(--grav-crud-color-light);
    border-left: 2px solid var(--grav-crud-color-light);
    border-right: 2px solid var(--grav-crud-color-light);
  }
</style>
