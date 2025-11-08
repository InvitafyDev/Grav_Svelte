<script lang="ts">
  import CrudWrapper from "$lib/CRUD/CrudWrapper.svelte";
  import { closeModal, Grav_Modal, type FiltrosI } from "$lib/index.js";

  let todosLosObjetos: any[] = [
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
      image:
        "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
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
      image:
        "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
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
      image:
        "https://catalogowebapi.kibi.com.mx/img/subformProductosImagenes/227_x2.png",
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
      image:
        "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
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
      image:
        "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
      inOrden: 5,
    },
  ];

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

  let totalRows = 0;
  let PageSize = 50;
  let currentPage = 1;
  let selectedSort = "noMesA";
  let selectedAscOrDesc: "asc" | "desc" = "desc";

  let Filtros: FiltrosI[] = [
    {
      label: "Mes",
      value: "",
      tipo: "select",
      options: [],
      service: () => {
        return new Promise((resolve) => {
          resolve([]);
        });
      },
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

  let loading = false;

  function handleAdd() {
    alert("Agregar");
  }

  function handleImport() {
    alert("Importar");
  }

  function handleReorder(reorderedItems: any[]) {
    console.log("Reordered items:", reorderedItems);
  }
</script>

<Grav_Modal title="ModalCrud" size="lg" onClose={() => closeModal("ModalCrud")}>
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
    onFilter={() => {}}
    onAdd={handleAdd}
    onImport={handleImport}
    onReorder={handleReorder}
  />
</Grav_Modal>
