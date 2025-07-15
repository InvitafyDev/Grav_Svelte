<script lang="ts">
    import { CrudWrapper } from "$lib/CRUD/index.js";
    import type { FiltrosI, TableHeader } from "$lib/CRUD/interfaces.js";
    import { onMount } from "svelte";

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
    let PageSize = 50;
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
            tipo: "Bool",
            biBold: false,
            align: "center",
            campo: "biActivo",
            buttonsConfig: [],
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
            align: "center",
            campo: "noMesA",
            buttonsConfig: [
                {
                    icon: "fa-solid fa-pencil",
                    tooltip: "Editar",
                    color: "bg-yellow-500 hover:bg-yellow-700",
                    show: true,
                    action: (id: number) => {
                        alert("Editar");
                    },
                },
                {
                    icon: "fa-solid fa-trash",
                    tooltip: "Eliminar",
                    color: "bg-red-500 hover:bg-red-700",
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
            nvMesNumeros: string;
            nvMes: string;
            inAnio: number;
            inCantidadDias: number;
            txComentariosMes: string;
            nvStatus: string;
            biActivo: boolean;
            image: string;
            inOrden: number;
            fecha: string;
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

        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Simulate API response
            apiData = {
                data: [
                    {
                        noMesA: 1,
                        nvMesTxt: "Enero",
                        nvMesNumeros: "01",
                        nvMes: "Ene",
                        fecha: "2024-01-01T00:00:00",
                        inAnio: 2024,
                        inCantidadDias: 31,
                        txComentariosMes: "Primer mes del año",
                        nvStatus: "Activo",
                        biActivo: true,
                        image: "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
                        inOrden: 1,
                    },
                    {
                        noMesA: 2,
                        nvMesTxt: "Febrero",
                        nvMesNumeros: "02",
                        nvMes: "Feb",
                        fecha: "2024-02-01T00:00:00",
                        inAnio: 2024,
                        inCantidadDias: 29,
                        txComentariosMes: "Mes bisiesto",
                        nvStatus: "Activo",
                        biActivo: false,
                        image: "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
                        inOrden: 2,
                    },
                    {
                        noMesA: 3,
                        nvMesTxt: "Marzo",
                        nvMesNumeros: "03",
                        nvMes: "Mar",
                        fecha: "2024-03-01T00:00:00",
                        inAnio: 2024,
                        inCantidadDias: 31,
                        txComentariosMes: "Inicio de primavera",
                        nvStatus: "Activo",
                        biActivo: true,
                        image: "https://catalogowebapi.kibi.com.mx/img/subformProductosImagenes/227_x2.png",
                        inOrden: 3,
                    },
                    {
                        noMesA: 4,
                        nvMesTxt: "Abril",
                        nvMesNumeros: "04",
                        nvMes: "Abr",
                        fecha: "2024-04-01T00:00:00",
                        inAnio: 2024,
                        inCantidadDias: 30,
                        txComentariosMes: "Mes de primavera",
                        nvStatus: "Activo",
                        biActivo: true,
                        image: "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
                        inOrden: 4,
                    },
                    {
                        noMesA: 5,
                        nvMesTxt: "Mayo",
                        nvMesNumeros: "05",
                        nvMes: "May",
                        fecha: "2024-05-01T00:00:00",
                        inAnio: 2024,
                        inCantidadDias: 31,
                        txComentariosMes: "Mes de las madres",
                        nvStatus: "Activo",
                        biActivo: true,
                        image: "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
                        inOrden: 5,
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

    function handleReorder(reorderedItems: any[]) {
        console.log("Reordered items:", reorderedItems);
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
    onFilter={enlistar}
    onAdd={handleAdd}
    onReorder={handleReorder}
/>

// Handler for drag and drop reordering
function handleReorder(reorderedItems: any[]) {
    console.log("Reordered items:", reorderedItems);
    // Here you would typically send the reordered items to your API
    // For this demo, we'll just log them
}`;
</script>

<svelte:head>
    <title>Catálogo Meses</title>
</svelte:head>

<div class="min-h-screen p-4 bg-white">
    <CrudWrapper
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
        onFilter={enlistar}
        onAdd={handleAdd}
        onReorder={handleReorder}
    />
    <div class="bg-white p-6 rounded-lg shadow-md mt-6">
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
    <div class="bg-white p-6 rounded-lg shadow-md mt-6">
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
