<script lang="ts">
    import { CrudWrapper } from "$lib/CRUD/index.js";
    import type { FiltrosI, TableHeader } from "$lib/CRUD/interfaces.js";
    import { openModal } from "$lib/index.js";
    import { onMount } from "svelte";
    import ModalCrud from "./ModalCrud.svelte";

    let Filtros: FiltrosI[] = [
        {
            label: "Mes",
            value: "",
            tipo: "select",
            options: [],
            service: fakeService,
        },
        {
            label: "Mes sin service",
            value: "",
            tipo: "select",
            options: [
                { value: "01", label: "Enero" },
                { value: "02", label: "Febrero" },
                { value: "03", label: "Marzo" },
            ],
        },
        {
            label: "Text",
            value: "",
            tipo: "text",
            options: [],
        },
        {
            label: "Number",
            value: "",
            tipo: "number",
            options: [],
        },
        {
            label: "Boolean",
            value: "",
            tipo: "bool",
            options: [],
        },
        {
            label: "Date",
            value: "",
            tipo: "date",
            options: [],
        },
        {
            label: "Date and Hours",
            value: "",
            tipo: "datetime",
            options: [],
        },
    ];

    async function fakeService() {
        await new Promise((res) => setTimeout(res, 500));
        console.log("fakeService");
        return [
            { value: "01", label: "Enero" },
            { value: "02", label: "Febrero" },
            { value: "03", label: "Marzo" },
            { value: "04", label: "Abril" },
            { value: "05", label: "Mayo" },
            { value: "06", label: "Junio" },
            { value: "07", label: "Julio" },
            { value: "08", label: "Agosto" },
            { value: "09", label: "Septiembre" },
            { value: "10", label: "Octubre" },
        ];
    }

    let todosLosObjetos: any[] = [];
    let totalRows = 0;
    let PageSize = 10;
    let currentPage = 1;
    let selectedSort = "noMesA";
    let selectedAscOrDesc: "asc" | "desc" = "desc";

    let tableH: TableHeader[] = [
        {
            titulo: "Nombre",
            biSort: true,
            tipo: "Text",
            biBold: true,
            align: "left",
            campo: "nvMesTxt",
            colorCampo: "colorMesTxt",
            buttonsConfig: [],
        },
        {
            titulo: "Mes Numero",
            biSort: true,
            tipo: "Text",
            biBold: false,
            align: "left",
            campo: "nvMesNumeros",
            buttonsConfig: [],
        },
        {
            titulo: "Mes",
            biSort: true,
            tipo: "Text",
            biBold: false,
            align: "left",
            campo: "nvMes",
            buttonsConfig: [],
        },
        {
            titulo: "Año",
            biSort: true,
            tipo: "Number",
            biBold: false,
            align: "right",
            campo: "inAnio",
            buttonsConfig: [],
        },
        {
            titulo: "Fecha",
            biSort: true,
            tipo: "Date",
            biBold: false,
            align: "left",
            campo: "fecha",
            buttonsConfig: [],
        },
        {
            titulo: "Dias",
            biSort: true,
            tipo: "Number",
            colorCampo: "colorCantidadDias",
            biBold: false,
            align: "right",
            campo: "inCantidadDias",
            buttonsConfig: [],
        },
        {
            titulo: "Comentarios",
            biSort: false,
            tipo: "Text",
            biBold: false,
            align: "left",
            campo: "txComentariosMes",
            buttonsConfig: [],
        },
        {
            titulo: "Meses Faltantes",
            biSort: true,
            tipo: "Number",
            biBold: false,
            align: "center",
            campo: "inMesesFaltantes",
            buttonsConfig: [],
        },
        {
            titulo: "Status",
            biSort: true,
            tipo: "Text",
            biBold: false,
            align: "left",
            campo: "nvStatus",
            buttonsConfig: [],
        },
        {
            titulo: "Activo",
            biSort: false,
            tipo: "EditableBool",
            biBold: false,
            align: "center",
            campo: "biActivo",
            buttonsConfig: [],
        },
        {
            titulo: "Estado",
            biSort: false,
            tipo: "DynamicButton",
            biBold: false,
            align: "center",
            campo: "noMesA",
            textField: "statusText",
            colorField: "statusColor",
            iconField: "statusIcon",
            iconPosition: "left",
            buttonsConfig: [],
            onButtonClick: (id, row) => {
                alert(`Estado cambiado para: ${row.nvMesTxt} (ID: ${id})`);
                console.log("Row data:", row);
            },
        },
        {
            titulo: "Acción",
            biSort: false,
            tipo: "DynamicButton",
            biBold: false,
            align: "center",
            campo: "noMesA",
            colorField: "actionColor",
            iconField: "actionIcon",
            buttonsConfig: [],
            onButtonClick: (id, row) => {
                alert(`Acción ejecutada para: ${row.nvMesTxt}`);
            },
        },
        {
            titulo: "Imagen",
            biSort: false,
            tipo: "Image",
            biBold: false,
            campo: "image",
            buttonsConfig: [],
        },
        {
            titulo: "Acciones",
            biSort: false,
            tipo: "Buttons",
            biBold: false,
            align: "right",
            campo: "noMesA",
            buttonsConfig: [
                {
                    icon: "fa-solid fa-pencil",
                    tooltip: "Editar",
                    color: " text-[#fe6b91] border-white bg-white hover:text-white",
                    show: true,
                    action: (id: number) => {
                        alert("Editar");
                    },
                },
                {
                    icon: "fa-solid fa-trash",
                    tooltip: "Eliminar",
                    color: " text-[#fe6b91] border-white bg-white hover:text-white",
                    show: true,
                    action: (id: number) => {
                        alert("Eliminar");
                    },
                },
            ],
        },
    ];

    let loading = false;

    // Simulated API response
    interface ApiResponse {
        data: {
            noMesA: number;
            nvMesTxt: string;
            colorMesTxt: string;
            nvMesNumeros: string;
            nvMes: string;
            inAnio: number;
            inCantidadDias: number;
            colorCantidadDias: string;
            txComentariosMes: string;
            nvStatus: string;
            biActivo: boolean;
            image: string;
            inOrden: number;
            fecha: string;
            inMesesFaltantes: number;
            statusText: string;
            statusColor: string;
            statusIcon: string;
            actionIcon: string;
            actionColor: string;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }

    let apiData: ApiResponse | null = null;
    let error: string | null = null;

    // Simulated API call
    async function enlistar() {
        loading = true;
        error = null;

        console.log(PageSize);
        

        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Simulate API response
            apiData = {
                data: [
                    {
                        noMesA: 1,
                        nvMesTxt: "Enero",
                        colorMesTxt: "!text-white bg-red-500",
                        nvMesNumeros: "01",
                        nvMes: "Ene",
                        fecha: "2024-01-01T00:00:00",
                        inAnio: 2024,
                        inCantidadDias: 31,
                        colorCantidadDias: "!text-white bg-blue-500",
                        txComentariosMes: "Primer mes del año",
                        nvStatus: "Activo",
                        biActivo: true,
                        image: "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
                        inOrden: 1,
                        inMesesFaltantes: 4,
                        statusText: "Aprobado",
                        statusColor: "!bg-green-500 !text-white",
                        statusIcon: "fa-solid fa-check",
                        actionIcon: "fa-solid fa-download",
                        actionColor: "!bg-purple-500 !text-white",
                    },
                    {
                        noMesA: 2,
                        nvMesTxt: "Febrero",
                        colorMesTxt: "!text-white bg-red-500",
                        nvMesNumeros: "02",
                        nvMes: "Feb",
                        fecha: "2024-02-01T00:00:00",
                        inAnio: 2024,
                        inCantidadDias: 29,
                        colorCantidadDias: "!text-white bg-red-500",
                        txComentariosMes: "Mes bisiesto",
                        nvStatus: "Activo",
                        biActivo: false,
                        image: "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
                        inOrden: 2,
                        inMesesFaltantes: 5,
                        statusText: "Pendiente",
                        statusColor: "!bg-yellow-500 !text-white",
                        statusIcon: "fa-solid fa-clock",
                        actionIcon: "fa-solid fa-edit",
                        actionColor: "!bg-orange-500 !text-white",
                    },
                    {
                        noMesA: 3,
                        nvMesTxt: "Marzo",
                        colorMesTxt: "!text-white bg-blue-500",
                        nvMesNumeros: "03",
                        nvMes: "Mar",
                        fecha: "2024-03-01T00:00:00",
                        inAnio: 2024,
                        inCantidadDias: 31,
                        colorCantidadDias: "!text-white bg-blue-500",
                        txComentariosMes: "Inicio de primavera",
                        nvStatus: "Activo",
                        biActivo: true,
                        image: "https://catalogowebapi.kibi.com.mx/img/subformProductosImagenes/227_x2.png",
                        inOrden: 3,
                        inMesesFaltantes: 6,
                        statusText: "Rechazado",
                        statusColor: "!bg-red-500 !text-white",
                        statusIcon: "fa-solid fa-times",
                        actionIcon: "fa-solid fa-trash",
                        actionColor: "!bg-red-500 !text-white",
                    },
                    {
                        noMesA: 4,
                        nvMesTxt: "Abril",
                        colorMesTxt: "!text-white bg-blue-500",
                        nvMesNumeros: "04",
                        nvMes: "Abr",
                        fecha: "2024-04-01T00:00:00",
                        inAnio: 2024,
                        inCantidadDias: 30,
                        colorCantidadDias: "!text-white bg-red-500",
                        txComentariosMes: "Mes de primavera",
                        nvStatus: "Activo",
                        biActivo: true,
                        image: "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
                        inOrden: 4,
                        inMesesFaltantes: 7,
                        statusText: "En Revisión",
                        statusColor: "!bg-blue-500 !text-white",
                        statusIcon: "fa-solid fa-eye",
                        actionIcon: "fa-solid fa-search",
                        actionColor: "!bg-blue-500 !text-white",
                    },
                    {
                        noMesA: 5,
                        nvMesTxt: "Mayo",
                        colorMesTxt: "!text-white bg-blue-500",
                        nvMesNumeros: "05",
                        nvMes: "May",
                        fecha: "2024-05-01T00:00:00",
                        inAnio: 2024,
                        inCantidadDias: 31,
                        colorCantidadDias: "!text-white bg-blue-500",
                        txComentariosMes: "Mes de las madres",
                        nvStatus: "Activo",
                        biActivo: true,
                        image: "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
                        inOrden: 5,
                        inMesesFaltantes: 8,
                        statusText: "Aprobado",
                        statusColor: "!bg-green-500 !text-white",
                        statusIcon: "fa-solid fa-check",
                        actionIcon: "fa-solid fa-share",
                        actionColor: "!bg-teal-500 !text-white",
                    },
                ],
                total: 5,
                page: 1,
                pageSize: 10,
            };
            todosLosObjetos = apiData.data;
            totalRows = apiData.total;
        } catch (e) {
            error = "Failed to fetch data";
            console.error(e);
        } finally {
            loading = false;
        }
    }

    function handleAdd() {
        alert("Agregar");
    }

    function handleImport() {
        alert("Importar");
    }

    function handleReorder(reorderedItems: any[]) {
        console.log("Reordered items:", reorderedItems);
    }

    async function handleCellUpdate(id: number | string, campo: string, newValue: any) {
        console.log("Cell updated:", { id, campo, newValue });
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log("Guardado exitoso!");
    }

    // Initial data load
    onMount(async () => {
        await enlistar();
    });

    const codePreview = `<CrudWrapper
    Titulo_Crud="Catálogo Meses"
    {todosLosObjetos}
    {tableH}
    {totalRows}
    bind:Filtros
    bind:PageSize
    bind:currentPage
    bind:selectedAscOrDesc
    bind:selectedSort
    {loading}
    showAddButton={true}
    showImportButton={true}
    dragEnabled={true}
    orderField="inOrden"
    idField="noMesA"
    onFilter={enlistar}
    onAdd={handleAdd}
    onImport={handleImport}
    onReorder={handleReorder}
    onCellUpdate={handleCellUpdate}
/>

// Handler for drag and drop reordering
function handleReorder(reorderedItems: any[]) {
    console.log("Reordered items:", reorderedItems);
    // Here you would typically send the reordered items to your API
}

// Handler for editable cell updates
async function handleCellUpdate(id: number | string, campo: string, newValue: any) {
    console.log("Cell updated:", { id, campo, newValue });
    // Simular llamada a API
    await fetch('/api/update', {
        method: 'POST',
        body: JSON.stringify({ id, [campo]: newValue })
    });
}`;
</script>

<svelte:head>
    <title>Ejemplo de CRUD</title>
</svelte:head>

<div class="p-4 bg-gradient-to-br from-[#ff9878] to-[#fe6b91]">
    <CrudWrapper
        Titulo_Crud="Ejemplo de CRUD"
        {todosLosObjetos}
        {tableH}
        {totalRows}
        bind:Filtros
        bind:PageSize
        bind:currentPage
        bind:selectedAscOrDesc
        bind:selectedSort
        {loading}
        showAddButton={true}
        showImportButton={true}
        dragEnabled={true}
        orderField="inOrden"
        idField="noMesA"
        onFilter={enlistar}
        onAdd={handleAdd}
        onImport={handleImport}
        onReorder={handleReorder}
        onCellUpdate={handleCellUpdate}
    />

    <div class="bg-white p-6 rounded-lg mt-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Drag and Drop Feature</h2>
        </div>
        <div class="mb-4">
            <p class="text-gray-700 mb-2">
                The table now supports drag and drop reordering! Try dragging
                rows using the drag handle (⋮⋮) in the first column.
            </p>
            <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Click and drag the handle to reorder rows</li>
                <li>Visual feedback shows when dragging and dropping</li>
                <li>
                    The <code>onReorder</code> event returns an array of items that
                    changed position
                </li>
                <li>
                    Each item includes the original data plus the new <code
                        >inOrden</code
                    > value
                </li>
            </ul>
        </div>
    </div>
    <div class="bg-white p-6 rounded-lg mt-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Code Preview</h2>
            <button
                class="text-emerald-500 hover:text-emerald-600 text-sm font-medium"
                on:click={() => {
                    navigator.clipboard.writeText(codePreview);
                }}
            >
                Copy Code
            </button>
        </div>
        <pre
            class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                >{codePreview}</code
            ></pre>
    </div>
</div>

<style>
    .bg-blue-500 {
        background-color: #0284c7;
    }
</style>
