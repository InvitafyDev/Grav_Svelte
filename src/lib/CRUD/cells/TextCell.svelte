<script lang="ts">
    import type { TableHeader } from "../interfaces.js";

    export let item: any;
    export let header: TableHeader;

    // Una columna "Number" se lee con separador de miles (99,999 y no 99999).
    // Solo si el valor ES número: un texto ya formateado se respeta tal cual.
    const formato = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 3 });
    $: valor = item[header.campo];
    $: texto =
        header.tipo === "Number" && typeof valor === "number" && Number.isFinite(valor)
            ? formato.format(valor)
            : (valor ?? "");
</script>

<p
    class="cell-content {header.biBold ? 'bold' : ''}"
    style="text-align: {header.align ?? 'left'}; {header.colorCampo && item[header.colorCampo] ? `background-color: ${item[header.colorCampo]}; color: white;` : ''}"
>
    {texto}
</p>
