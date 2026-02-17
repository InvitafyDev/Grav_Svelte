<script lang="ts">
  import { CrudWrapper } from "$lib/CRUD/index.js";
  import type { FiltrosI, TableHeader } from "$lib/CRUD/interfaces.js";
  import { openModal } from "$lib/index.js";
  import { onMount } from "svelte";
  import ModalCrud from "./ModalCrud.svelte";
  import fakeComponent from "./fakeComponent.svelte";

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

  // Custom headers for subrows (semanas) - Completamente diferentes a los headers padre
  let subRowH: TableHeader[] = [
    {
      titulo: "Foto",
      biSort: false,
      tipo: "Image",
      biBold: false,
      align: "center",
      campo: "imagen",
      buttonsConfig: [],
    },
    {
      titulo: "Semana",
      biSort: false,
      tipo: "Text",
      biBold: true,
      align: "left",
      campo: "nvMesTxt",
      colorCampo: "colorSemana",
      buttonsConfig: [],
    },
    {
      titulo: "Código",
      biSort: false,
      tipo: "Text",
      biBold: false,
      align: "center",
      campo: "nvMesNumeros",
      buttonsConfig: [],
    },
    {
      titulo: "Días",
      biSort: false,
      tipo: "Number",
      biBold: false,
      align: "right",
      campo: "inCantidadDias",
      buttonsConfig: [],
    },
    {
      titulo: "Activa",
      biSort: false,
      tipo: "Bool",
      biBold: false,
      align: "right",
      campo: "activa",
      buttonsConfig: [],
    },
    {
      titulo: "Estado",
      biSort: false,
      tipo: "DynamicButton",
      biBold: false,
      align: "right",
      campo: "noMesA",
      textField: "estadoText",
      colorField: "estadoColor",
      iconField: "estadoIcon",
      buttonsConfig: [],
      onButtonClick: (id, row) => {
        alert(`Estado de semana: ${row.estadoText}`);
      },
    },
    {
      titulo: "País",
      biSort: false,
      tipo: "ImageButton",
      biBold: false,
      align: "center",
      campo: "noMesA",
      imageField: "paisBandera",
      imageSize: "sm",
      buttonsConfig: [],
      action: (id) => {
        alert(`País seleccionado en semana con ID: ${id}`);
      },
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
          icon: "fa-solid fa-eye",
          tooltip: "Ver detalles",
          color:
            "text-blue-500 border-blue-500 bg-white hover:bg-blue-500 hover:text-white",
          show: true,
          action: (id: number) => {
            alert(`Ver detalles de semana ${id}`);
          },
        },
        {
          icon: "fa-solid fa-edit",
          tooltip: "Editar semana",
          color:
            "text-green-500 border-green-500 bg-white hover:bg-green-500 hover:text-white",
          show: true,
          action: (id: number) => {
            alert(`Editar semana ${id}`);
          },
        },
      ],
    },
  ];

  let tableH: TableHeader[] = [
    {
      titulo: "Nombre",
      biSort: true,
      tipo: "Text",
      biBold: true,
      align: "center",
      campo: "nvMesTxt",
      colorCampo: "colorMesTxt",
      buttonsConfig: [],
    },
    {
      titulo: "Mes Numero",
      biSort: true,
      tipo: "TextArea",
      biBold: false,
      align: "center",
      campo: "nvMesNumeros",
      buttonsConfig: [],
    },
    {
      titulo: "Mes",
      biSort: true,
      tipo: "TextArea",
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
      titulo: "Dual Estado",
      biSort: false,
      tipo: "DualTextButton",
      biBold: false,
      align: "center",
      campo: "noMesA",
      textField1: "dualText1",
      textField2: "dualText2",
      colorField1: "dualColor1",
      colorField2: "dualColor2",
      separator: " / ",
      buttonsConfig: [],
      onButtonClick: (id, row) => {
        alert(
          `Dual button clicked para: ${row.nvMesTxt} (ID: ${id})\nTexto 1: ${row.dualText1}\nTexto 2: ${row.dualText2}`,
        );
      },
    },
    {
      titulo: "Estado Condicional",
      biSort: false,
      tipo: "ConditionalCell",
      biBold: false,
      align: "center",
      campo: "noMesA",
      conditionField: "biActivo",
      whenTrue: {
        tipo: "DualTextButton",
        textField1: "dualText1",
        textField2: "dualText2",
        colorField1: "dualColor1",
        colorField2: "dualColor2",
        separator: " | ",
      },
      whenFalse: {
        tipo: "Text",
        textField: "nvStatus",
        colorField: "colorMesTxt",
      },
      buttonsConfig: [],
      onButtonClick: (id, row) => {
        alert(`Condicional clicked: ${row.nvMesTxt} - Activo: ${row.biActivo}`);
      },
    },
    {
      titulo: "Estados Múltiples",
      biSort: false,
      tipo: "MultiTextButton",
      biBold: false,
      align: "center",
      campo: "noMesA",
      itemsField: "statusList",
      multiLayout: "horizontal",
      multiSeparator: "•",
      buttonsConfig: [],
      onButtonClick: (id, row) => {
        const statuses =
          row.statusList?.map((s: any) => s.text).join(", ") || "ninguno";
        alert(`Multi estados para ${row.nvMesTxt}:\n${statuses}`);
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
      titulo: "País",
      biSort: false,
      tipo: "ImageButton",
      biBold: false,
      align: "center",
      campo: "noMesA",
      imageField: "flagUrl",
      imageSize: "md",
      buttonsConfig: [],
      action: (id) => {
        alert(`País seleccionado con ID: ${id}`);
      },
    },
    {
      titulo: "Componente Custom",
      biSort: false,
      tipo: "Component",
      biBold: false,
      align: "center",
      campo: "noMesA",
      component: fakeComponent,
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
          color: " text-white border-white bg-yellow-500 hover:bg-yellow-700",
          show: true,
          action: (id: number) => {
            alert("Editar");
          },
        },
        {
          icon: "fa-solid fa-trash",
          tooltip: "Eliminar",
          color: " text-white border-white bg-red-500 hover:bg-red-700",
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
      flagUrl: string;
      dualText1?: string | null;
      dualText2?: string | null;
      dualColor1?: string | null;
      dualColor2?: string | null;
      statusList?: Array<{ text: string; color: string }>;
      subRows?: any[] | null;
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
            colorMesTxt: "#fc0303",
            nvMesNumeros: "01",
            nvMes:
              "Ene esto es un ejemplo de un texto muy largo para ver como se comporta la tabla cuando el texto es muy largo, quisiera prevenir varias cosas y me gustaria ver en cuales seldas puede fallar el ancho de la celdaEne esto es un ejemplo de un texto muy largo para ver como se comporta la tabla cuando el texto es muy largo, quisiera prevenir varias cosas y me gustaria ver en cuales seldas puede fallar el ancho de la celdaEne esto es un ejemplo de un texto muy largo para ver como se comporta la tabla cuando el texto es muy largo, quisiera prevenir varias cosas y me gustaria ver en cuales seldas puede fallar el ancho de la celda Ene esto es un ejemplo de un texto muy largo para ver como se comporta la tabla cuando el texto es muy largo, quisiera prevenir varias cosas y me gustaria ver en cuales seldas puede fallar el ancho de la celdaEne esto es un ejemplo de un texto muy largo para ver como se comporta la tabla cuando el texto es muy largo, quisiera prevenir varias cosas y me gustaria ver en cuales seldas puede fallar el ancho de la celdaEne esto es un ejemplo de un texto muy largo para ver como se comporta la tabla cuando el texto es muy largo, quisiera prevenir varias cosas y me gustaria ver en cuales seldas puede fallar el ancho de la celda",
            fecha: "2024-01-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 31,
            colorCantidadDias: "#0341fc",
            txComentariosMes: "Primer mes del año",
            nvStatus: "Activo",
            biActivo: true,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
            inOrden: 1,
            inMesesFaltantes: 4,
            statusText: "Aprobado",
            statusColor: "#22c55e",
            statusIcon: "fa-solid fa-check",
            actionIcon: "fa-solid fa-download",
            actionColor: "#a855f7",
            flagUrl: "https://flagcdn.com/w80/mx.png",
            dualText1: "Activo",
            dualText2: "Verificado",
            dualColor1: "#16a34a",
            dualColor2: "#2563eb",
            statusList: [
              { text: "1", color: "#9333ea" },
              { text: "3", color: "#16a34a" },
              { text: "2", color: "#2563eb" },
            ],
            subRows: [
              {
                noMesA: 11,
                nvMesTxt: "Semana 1",
                colorSemana: "#a855f7",
                nvMesNumeros: "01-W1",
                nvMes: "Ene-S1",
                inAnio: 2024,
                inCantidadDias: 7,
                activa: true,
                imagen:
                  "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275.jpg",
                estadoText: "Completada",
                estadoColor: "#16a34a",
                estadoIcon: "fa-solid fa-check-circle",
                paisBandera: "https://flagcdn.com/w80/br.png",
              },
              {
                noMesA: 12,
                nvMesTxt: "Semana 2",
                colorSemana: "#f97316",
                nvMesNumeros: "01-W2",
                nvMes: "Ene-S2",
                inAnio: 2024,
                inCantidadDias: 7,
                activa: false,
                imagen:
                  "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
                estadoText: "En Progreso",
                estadoColor: "#eab308",
                estadoIcon: "fa-solid fa-spinner",
                paisBandera: "https://flagcdn.com/w80/ar.png",
              },
              {
                noMesA: 13,
                nvMesTxt: "Semana 3",
                colorSemana: "#14b8a6",
                nvMesNumeros: "01-W3",
                nvMes: "Ene-S3",
                inAnio: 2024,
                inCantidadDias: 7,
                activa: true,
                imagen:
                  "https://catalogowebapi.kibi.com.mx/img/subformProductosImagenes/227_x2.png",
                estadoText: "Pendiente",
                estadoColor: "#ef4444",
                estadoIcon: "fa-solid fa-clock",
                paisBandera: "https://flagcdn.com/w80/cl.png",
              },
            ],
          },
          {
            noMesA: 2,
            nvMesTxt: "Febrero",
            colorMesTxt: "#0341fc",
            nvMesNumeros: "02",
            nvMes: "Feb",
            fecha: "2024-02-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 29,
            colorCantidadDias: "#0341fc",
            txComentariosMes: "Mes bisiesto",
            nvStatus: "Activo",
            biActivo: false,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
            inOrden: 2,
            inMesesFaltantes: 5,
            statusText: "Pendiente",
            statusColor: "#eab308",
            statusIcon: "fa-solid fa-clock",
            actionIcon: "fa-solid fa-edit",
            actionColor: "#f97316",
            flagUrl: "https://flagcdn.com/w80/us.png",
            dualText1: "Inactivo",
            dualText2: "Bloqueado",
            dualColor1: "#dc2626",
            dualColor2: "#6b7280",
            statusList: [
              {
                text: "Pendiente",
                color: "#eab308",
              },
              {
                text: "Bloqueado",
                color: "#dc2626",
              },
            ],
          },
          {
            noMesA: 1,
            nvMesTxt: "Enero",
            colorMesTxt: "#0341fc",
            nvMesNumeros: "01",
            nvMes: "Ene",
            fecha: "2024-01-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 31,
            colorCantidadDias: "#3b82f6",
            txComentariosMes: "Primer mes del año",
            nvStatus: "Activo",
            biActivo: true,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
            inOrden: 1,
            inMesesFaltantes: 4,
            statusText: "Aprobado",
            statusColor: "#22c55e",
            statusIcon: "fa-solid fa-check",
            actionIcon: "fa-solid fa-download",
            actionColor: "#a855f7",
            flagUrl: "https://flagcdn.com/w80/mx.png",
            dualText1: "Activo",
            dualText2: "Verificado",
            dualColor1: "#16a34a",
            dualColor2: "#2563eb",
          },
          {
            noMesA: 2,
            nvMesTxt: "Febrero",
            colorMesTxt: "#0341fc",
            nvMesNumeros: "02",
            nvMes: "Feb",
            fecha: "2024-02-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 29,
            colorCantidadDias: "#0341",
            txComentariosMes: "Mes bisiesto",
            nvStatus: "Activo",
            biActivo: false,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
            inOrden: 2,
            inMesesFaltantes: 5,
            statusText: "Pendiente",
            statusColor: "#eab308",
            statusIcon: "fa-solid fa-clock",
            actionIcon: "fa-solid fa-edit",
            actionColor: "#f97316",
            flagUrl: "https://flagcdn.com/w80/us.png",
            dualText1: "Inactivo",
            dualText2: "Bloqueado",
            dualColor1: "#dc2626",
            dualColor2: "#4b5563",
            subRows: [
              {
                noMesA: 11,
                nvMesTxt: "Semana 1",
                colorSemana: "#a855f7",
                nvMesNumeros: "01-W1",
                nvMes: "Ene-S1",
                inAnio: 2024,
                inCantidadDias: 7,
                activa: true,
                imagen:
                  "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275.jpg",
                estadoText: "Completada",
                estadoColor: "#16a34a",
                estadoIcon: "fa-solid fa-check-circle",
                paisBandera: "https://flagcdn.com/w80/br.png",
              },
              {
                noMesA: 12,
                nvMesTxt: "Semana 2",
                colorSemana: "#f97316",
                nvMesNumeros: "01-W2",
                nvMes: "Ene-S2",
                inAnio: 2024,
                inCantidadDias: 7,
                activa: false,
                imagen:
                  "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
                estadoText: "En Progreso",
                estadoColor: "#eab308",
                estadoIcon: "fa-solid fa-spinner",
                paisBandera: "https://flagcdn.com/w80/ar.png",
              },
              {
                noMesA: 13,
                nvMesTxt: "Semana 3",
                colorSemana: "#14b8a6",
                nvMesNumeros: "01-W3",
                nvMes: "Ene-S3",
                inAnio: 2024,
                inCantidadDias: 7,
                activa: true,
                imagen:
                  "https://catalogowebapi.kibi.com.mx/img/subformProductosImagenes/227_x2.png",
                estadoText: "Pendiente",
                estadoColor: "#ef4444",
                estadoIcon: "fa-solid fa-clock",
                paisBandera: "https://flagcdn.com/w80/cl.png",
              },
            ],
          },
          {
            noMesA: 1,
            nvMesTxt: "Enero",
            colorMesTxt: "#0341fc",
            nvMesNumeros: "01",
            nvMes: "Ene",
            fecha: "2024-01-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 31,
            colorCantidadDias: "#3b82f6",
            txComentariosMes: "Primer mes del año",
            nvStatus: "Activo",
            biActivo: true,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
            inOrden: 1,
            inMesesFaltantes: 4,
            statusText: "Aprobado",
            statusColor: "#22c55e",
            statusIcon: "fa-solid fa-check",
            actionIcon: "fa-solid fa-download",
            actionColor: "#a855f7",
            flagUrl: "https://flagcdn.com/w80/mx.png",
            dualText1: "Activo",
            dualText2: "Verificado",
            dualColor1: "#16a34a",
            dualColor2: "#2563eb",
          },
          {
            noMesA: 2,
            nvMesTxt: "Febrero",
            colorMesTxt: "#0341fc",
            nvMesNumeros: "02",
            nvMes: "Feb",
            fecha: "2024-02-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 29,
            colorCantidadDias: "#0341",
            txComentariosMes: "Mes bisiesto",
            nvStatus: "Activo",
            biActivo: false,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
            inOrden: 2,
            inMesesFaltantes: 5,
            statusText: "Pendiente",
            statusColor: "#eab308",
            statusIcon: "fa-solid fa-clock",
            actionIcon: "fa-solid fa-edit",
            actionColor: "#f97316",
            flagUrl: "https://flagcdn.com/w80/us.png",
            dualText1: "Inactivo",
            dualText2: "Bloqueado",
            dualColor1: "#dc2626",
            dualColor2: "#4b5563",
          },
          {
            noMesA: 1,
            nvMesTxt: "Enero",
            colorMesTxt: "#0341fc",
            nvMesNumeros: "01",
            nvMes: "Ene",
            fecha: "2024-01-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 31,
            colorCantidadDias: "#3b82f6",
            txComentariosMes: "Primer mes del año",
            nvStatus: "Activo",
            biActivo: true,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
            inOrden: 1,
            inMesesFaltantes: 4,
            statusText: "Aprobado",
            statusColor: "#22c55e",
            statusIcon: "fa-solid fa-check",
            actionIcon: "fa-solid fa-download",
            actionColor: "#a855f7",
            flagUrl: "https://flagcdn.com/w80/mx.png",
            dualText1: "Activo",
            dualText2: "Verificado",
            dualColor1: "#16a34a",
            dualColor2: "#2563eb",
          },
          {
            noMesA: 2,
            nvMesTxt: "Febrero",
            colorMesTxt: "#0341fc",
            nvMesNumeros: "02",
            nvMes: "Feb",
            fecha: "2024-02-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 29,
            colorCantidadDias: "#0341",
            txComentariosMes: "Mes bisiesto",
            nvStatus: "Activo",
            biActivo: false,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
            inOrden: 2,
            inMesesFaltantes: 5,
            statusText: "Pendiente",
            statusColor: "#eab308",
            statusIcon: "fa-solid fa-clock",
            actionIcon: "fa-solid fa-edit",
            actionColor: "#f97316",
            flagUrl: "https://flagcdn.com/w80/us.png",
            dualText1: "Inactivo",
            dualText2: "Bloqueado",
            dualColor1: "#dc2626",
            dualColor2: "#4b5563",
          },
          {
            noMesA: 1,
            nvMesTxt: "Enero",
            colorMesTxt: "#0341fc",
            nvMesNumeros: "01",
            nvMes: "Ene",
            fecha: "2024-01-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 31,
            colorCantidadDias: "#3b82f6",
            txComentariosMes: "Primer mes del año",
            nvStatus: "Activo",
            biActivo: true,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
            inOrden: 1,
            inMesesFaltantes: 4,
            statusText: "Aprobado",
            statusColor: "#22c55e",
            statusIcon: "fa-solid fa-check",
            actionIcon: "fa-solid fa-download",
            actionColor: "#a855f7",
            flagUrl: "https://flagcdn.com/w80/mx.png",
            dualText1: "Activo",
            dualText2: "Verificado",
            dualColor1: "#16a34a",
            dualColor2: "#2563eb",
          },
          {
            noMesA: 2,
            nvMesTxt: "Febrero",
            colorMesTxt: "#0341fc",
            nvMesNumeros: "02",
            nvMes: "Feb",
            fecha: "2024-02-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 29,
            colorCantidadDias: "#0341",
            txComentariosMes: "Mes bisiesto",
            nvStatus: "Activo",
            biActivo: false,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
            inOrden: 2,
            inMesesFaltantes: 5,
            statusText: "Pendiente",
            statusColor: "#eab308",
            statusIcon: "fa-solid fa-clock",
            actionIcon: "fa-solid fa-edit",
            actionColor: "#f97316",
            flagUrl: "https://flagcdn.com/w80/us.png",
            dualText1: "Inactivo",
            dualText2: "Bloqueado",
            dualColor1: "#dc2626",
            dualColor2: "#4b5563",
          },
          {
            noMesA: 1,
            nvMesTxt: "Enero",
            colorMesTxt: "#0341fc",
            nvMesNumeros: "01",
            nvMes: "Ene",
            fecha: "2024-01-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 31,
            colorCantidadDias: "#3b82f6",
            txComentariosMes: "Primer mes del año",
            nvStatus: "Activo",
            biActivo: true,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
            inOrden: 1,
            inMesesFaltantes: 4,
            statusText: "Aprobado",
            statusColor: "#22c55e",
            statusIcon: "fa-solid fa-check",
            actionIcon: "fa-solid fa-download",
            actionColor: "#a855f7",
            flagUrl: "https://flagcdn.com/w80/mx.png",
            dualText1: "Activo",
            dualText2: "Verificado",
            dualColor1: "#16a34a",
            dualColor2: "#2563eb",
          },
          {
            noMesA: 2,
            nvMesTxt: "Febrero",
            colorMesTxt: "#0341fc",
            nvMesNumeros: "02",
            nvMes: "Feb",
            fecha: "2024-02-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 29,
            colorCantidadDias: "#0341",
            txComentariosMes: "Mes bisiesto",
            nvStatus: "Activo",
            biActivo: false,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
            inOrden: 2,
            inMesesFaltantes: 5,
            statusText: "Pendiente",
            statusColor: "#eab308",
            statusIcon: "fa-solid fa-clock",
            actionIcon: "fa-solid fa-edit",
            actionColor: "#f97316",
            flagUrl: "https://flagcdn.com/w80/us.png",
            dualText1: "Inactivo",
            dualText2: "Bloqueado",
            dualColor1: "#dc2626",
            dualColor2: "#4b5563",
          },
          {
            noMesA: 3,
            nvMesTxt: "Marzo",
            colorMesTxt: "#22c55e",
            nvMesNumeros: "03",
            nvMes: "Mar",
            fecha: "2024-03-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 31,
            colorCantidadDias: "#3b82f6",
            txComentariosMes: "Inicio de primavera",
            nvStatus: "Activo",
            biActivo: true,
            image:
              "https://catalogowebapi.kibi.com.mx/img/subformProductosImagenes/227_x2.png",
            inOrden: 3,
            inMesesFaltantes: 6,
            statusText: "Rechazado",
            statusColor: "#ef4444",
            statusIcon: "fa-solid fa-times",
            actionIcon: "fa-solid fa-trash",
            actionColor: "#ef4444",
            flagUrl: "https://flagcdn.com/w80/es.png",
            dualText1: "",
            dualText2: "",
            dualColor1: "#16a34a",
            dualColor2: "#2563eb",
          },
          {
            noMesA: 4,
            nvMesTxt: "Abril",
            colorMesTxt: "#3b82f6",
            nvMesNumeros: "04",
            nvMes: "Abr",
            fecha: "2024-04-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 30,
            colorCantidadDias: "#0341",
            txComentariosMes: "Mes de primavera",
            nvStatus: "Activo",
            biActivo: true,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/hotel1-10e275e1.jpg",
            inOrden: 4,
            inMesesFaltantes: 7,
            statusText: "En Revisión",
            statusColor: "#3b82f6",
            statusIcon: "fa-solid fa-eye",
            actionIcon: "fa-solid fa-search",
            actionColor: "#3b82f6",
            flagUrl: "https://flagcdn.com/w80/ca.png",
          },
          {
            noMesA: 5,
            nvMesTxt: "Mayo",
            colorMesTxt: "#3b82f6",
            nvMesNumeros: "05",
            nvMes: "May",
            fecha: "2024-05-01T00:00:00",
            inAnio: 2024,
            inCantidadDias: 31,
            colorCantidadDias: "#3b82f6",
            txComentariosMes: "Mes de las madres",
            nvStatus: "Activo",
            biActivo: true,
            image:
              "https://invitafy.com.mx/portafolio/Boda/PremiumBodaDestino/XimenaYAlberto/_app/immutable/assets/iglesia-85dad591.jpg",
            inOrden: 5,
            inMesesFaltantes: 8,
            statusText: "Aprobado",
            statusColor: "#22c55e",
            statusIcon: "fa-solid fa-check",
            actionIcon: "fa-solid fa-share",
            actionColor: "#14b8a6",
            flagUrl: "https://flagcdn.com/w80/fr.png",
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
  function handleSettings() {
    alert("Configuración");
  }

  function handleReorder(reorderedItems: any[]) {
    console.log("Reordered items:", reorderedItems);
  }

  async function handleCellUpdate(
    id: number | string,
    campo: string,
    newValue: any,
  ) {
    console.log("Cell updated:", { id, campo, newValue });
    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 300));
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
    expandEnabled={true}
    subRowsField="subRows"
    subRowHeaders={subRowH}
    orderField="inOrden"
    idField="noMesA"
    showSettingsButton={true}
    onFilter={enlistar}
    onAdd={handleAdd}
    onImport={handleImport}
    onSettings={handleSettings}
    onReorder={handleReorder}
    onCellUpdate={handleCellUpdate}
  />

  <div class="bg-white p-6 rounded-lg mt-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Drag and Drop Feature</h2>
    </div>
    <div class="mb-4">
      <p class="text-gray-700 mb-2">
        The table now supports drag and drop reordering! Try dragging rows using
        the drag handle (⋮⋮) in the first column.
      </p>
      <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
        <li>Click and drag the handle to reorder rows</li>
        <li>Visual feedback shows when dragging and dropping</li>
        <li>
          The <code>onReorder</code> event returns an array of items that changed
          position
        </li>
        <li>
          Each item includes the original data plus the new <code>inOrden</code>
          value
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
