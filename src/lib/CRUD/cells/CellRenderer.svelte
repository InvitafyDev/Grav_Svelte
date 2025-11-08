<script lang="ts">
  import type { TableHeader } from "../interfaces.js";
  import CrudTableButtons from "../CrudTableButtons.svelte";
  import TextCell from "./TextCell.svelte";
  import TextAreaCell from "./TextAreaCell.svelte";
  import DateCell from "./DateCell.svelte";
  import BoolCell from "./BoolCell.svelte";
  import EditableBoolCell from "./EditableBoolCell.svelte";
  import EditableTextCell from "./EditableTextCell.svelte";
  import EditableNumberCell from "./EditableNumberCell.svelte";
  import ImageCell from "./ImageCell.svelte";
  import DynamicButtonCell from "./DynamicButtonCell.svelte";
  import ImageButtonCell from "./ImageButtonCell.svelte";
  import DualTextButtonCell from "./DualTextButtonCell.svelte";
  import ConditionalCell from "./ConditionalCell.svelte";
  import MultiTextButtonCell from "./MultiTextButtonCell.svelte";
  import ComponentCell from "./ComponentCell.svelte";

  export let item: any;
  export let header: TableHeader;
  export let idField: string;
  export let index: number;
  export let dragEnabled: boolean;
  export let expandEnabled: boolean;
  export let onImageClick: (src: string) => void;
</script>

<td
  class="table-cell {index == 0 && !dragEnabled && !expandEnabled
    ? 'sticky-cell'
    : ''} {header.tipo === 'TextArea' ? 'cell-textarea' : ''}"
  style="text-align: {header.align ?? 'center'}; {header.tipo === 'TextArea'
    ? `max-height: calc(${header.cellMaxHeight ?? '150px'} + 14px + 0.6rem);`
    : ''}"
>
  {#if header.tipo == "Text" || header.tipo == "Number"}
    <TextCell {item} {header} />
  {:else if header.tipo == "TextArea"}
    <TextAreaCell {item} {header} />
  {:else if header.tipo == "Date"}
    <DateCell {item} {header} isDatetime={false} />
  {:else if header.tipo == "Datetime"}
    <DateCell {item} {header} isDatetime={true} />
  {:else if header.tipo == "Bool"}
    <BoolCell {item} {header} />
  {:else if header.tipo == "EditableBool"}
    <EditableBoolCell {item} {header} {idField} />
  {:else if header.tipo == "EditableText"}
    <EditableTextCell {item} {header} {idField} />
  {:else if header.tipo == "EditableNumber"}
    <EditableNumberCell {item} {header} {idField} />
  {:else if header.tipo == "Image"}
    <ImageCell {item} {header} {onImageClick} />
  {:else if header.tipo == "Buttons"}
    <CrudTableButtons
      id={item[header.campo]}
      buttonsConfig={header.buttonsConfig ?? []}
      align={header.align ?? "center"}
      row={item}
    />
  {:else if header.tipo == "DynamicButton"}
    <DynamicButtonCell {item} {header} {idField} />
  {:else if header.tipo == "ImageButton"}
    <ImageButtonCell {item} {header} {idField} />
  {:else if header.tipo == "DualTextButton"}
    <DualTextButtonCell {item} {header} {idField} />
  {:else if header.tipo == "ConditionalCell"}
    <ConditionalCell {item} {header} {idField} />
  {:else if header.tipo == "MultiTextButton"}
    <MultiTextButtonCell {item} {header} {idField} />
  {:else if header.tipo == "Component"}
    <ComponentCell {item} {header} />
  {/if}
</td>
