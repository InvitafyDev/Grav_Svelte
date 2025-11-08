<script lang="ts">
  import type { TableHeader } from "../interfaces.js";

  export let item: any;
  export let header: TableHeader;

  // Altura máxima para TextArea (150px por defecto, puede ser personalizada con cellMaxHeight)
  $: maxHeight = header.cellMaxHeight ?? "180px";
</script>

<div
  class="cell-content-textarea {header.biBold ? 'bold' : ''}"
  style="text-align: {header.align ?? 'left'}; {header.colorCampo &&
  item[header.colorCampo]
    ? `background-color: ${item[header.colorCampo]}; color: white;`
    : ''} max-height: {maxHeight};"
>
  {item[header.campo] ?? ""}
</div>
