<script lang="ts">
  import type { TableHeader } from "../interfaces.js";
  import CellRenderer from "../cells/CellRenderer.svelte";

  export let item: any;
  export let index: number;
  export let tableHeaders: TableHeader[];
  export let idField: string;
  export let dragEnabled: boolean;
  export let expandEnabled: boolean;
  export let subRowsField: string;
  export let selectedRowId: string | number | null;
  export let draggedIndex: number | null;
  export let dragOverIndex: number | null;
  export let loading: boolean;
  export let expandedRows: Set<string | number>;
  export let onRowClick: (id: string | number) => void;
  export let onDragStart: (e: DragEvent, index: number) => void;
  export let onDragOver: (e: DragEvent, index: number) => void;
  export let onDragLeave: () => void;
  export let onDrop: (e: DragEvent, index: number) => void;
  export let onDragEnd: () => void;
  export let onToggleExpand: (id: string | number) => void;
  export let onImageClick: (src: string) => void;
</script>

<tr
  class="table-row {selectedRowId === index ? 'selected' : ''} {dragEnabled &&
  !loading
    ? 'draggable-row'
    : ''} {draggedIndex === index ? 'dragging' : ''} {dragOverIndex === index
    ? 'drag-over'
    : ''}"
  draggable={dragEnabled && !loading}
  on:click={() => onRowClick(index)}
  on:dragstart={(e) => onDragStart(e, index)}
  on:dragover={(e) => onDragOver(e, index)}
  on:dragleave={onDragLeave}
  on:drop={(e) => onDrop(e, index)}
  on:dragend={onDragEnd}
>
  {#if dragEnabled}
    <td class="table-cell drag-handle-cell sticky-cell">
      <div class="drag-handle" title="Drag to reorder">
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
    </td>
  {/if}
  {#if expandEnabled}
    <td class="table-cell expand-cell {!dragEnabled ? 'sticky-cell' : ''}">
      {#if item[subRowsField] && item[subRowsField].length > 0}
        <button
          type="button"
          class="expand-button"
          on:click|stopPropagation={() => onToggleExpand(item[idField])}
        >
          <svg
            class="chevron-icon {expandedRows.has(item[idField])
              ? 'expanded'
              : ''}"
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
  {#each tableHeaders as header, i}
    <CellRenderer
      {item}
      {header}
      {idField}
      index={i}
      {dragEnabled}
      {expandEnabled}
      {onImageClick}
    />
  {/each}
</tr>
