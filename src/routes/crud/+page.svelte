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
            service: async () => {
                await new Promise((res) => setTimeout(res, 500));
                return [
                    { value: "01", label: "Enero" },
                    { value: "02", label: "Febrero" },
                    { value: "03", label: "Marzo" },
                ];
            },
        },
    ];

    let todosLosObjetos: any[] = [];
    let totalRows = 0;
    let PageSize = 50;
    let currentPage = 1;
    let selectedSort = "noMesA";
    let selectedAscOrDesc: "asc" | "desc" = "desc";

    let tableH: TableHeader[] = [
        {
            titulo: "Mes con nombre",
            biSort: true,
            tipo: "Text",
            biBold: true,
            campo: "nvMesTxt",
            buttonsConfig: [],
        },
        {
            titulo: "Mes Numero",
            biSort: true,
            tipo: "Text",
            biBold: false,
            campo: "nvMesNumeros",
            buttonsConfig: [],
        },
        {
            titulo: "Mes",
            biSort: true,
            tipo: "Text",
            biBold: false,
            campo: "nvMes",
            buttonsConfig: [],
        },
        {
            titulo: "Año",
            biSort: true,
            tipo: "Number",
            biBold: false,
            campo: "inAnio",
            buttonsConfig: [],
        },
        {
            titulo: "Dias",
            biSort: true,
            tipo: "Number",
            biBold: false,
            campo: "inCantidadDias",
            buttonsConfig: [],
        },
        {
            titulo: "Comentarios",
            biSort: false,
            tipo: "Text",
            biBold: false,
            campo: "txComentariosMes",
            buttonsConfig: [],
        },
        {
            titulo: "Status",
            biSort: true,
            tipo: "Text",
            biBold: false,
            campo: "nvStatus",
            buttonsConfig: [],
        },
        {
            titulo: "Acciones",
            biSort: false,
            tipo: "Buttons",
            biBold: false,
            campo: "noMesA",
            buttonsConfig: [
                {
                    icon: "fa-solid fa-pencil",
                    tooltip: "Editar",
                    color: "bg-yellow-500 hover:bg-yellow-700",
                    action: (id: number) => {
                        alert("Editar");
                    },
                },
                {
                    icon: "fa-solid fa-trash",
                    tooltip: "Eliminar",
                    color: "bg-red-500 hover:bg-red-700",
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
                        inAnio: 2024,
                        inCantidadDias: 31,
                        txComentariosMes: "Primer mes del año",
                        nvStatus: "Activo",
                    },
                    {
                        noMesA: 2,
                        nvMesTxt: "Febrero",
                        nvMesNumeros: "02",
                        nvMes: "Feb",
                        inAnio: 2024,
                        inCantidadDias: 29,
                        txComentariosMes: "Mes bisiesto",
                        nvStatus: "Activo",
                    },
                    {
                        noMesA: 3,
                        nvMesTxt: "Marzo",
                        nvMesNumeros: "03",
                        nvMes: "Mar",
                        inAnio: 2024,
                        inCantidadDias: 31,
                        txComentariosMes: "Inicio de primavera",
                        nvStatus: "Activo",
                    },
                ],
                total: 3,
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

    // Initial data load
    onMount(async () => {
        await enlistar();
    });

    const codePreview = `<CrudWrapper
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
    showImportButton={false}
    onFilter={enlistar}
    onAdd={handleAdd}
/>`;
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
    showImportButton={false}
    onFilter={enlistar}
    onAdd={handleAdd}
/>
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
        <pre class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code>{codePreview}</code></pre>
    </div>
</div>