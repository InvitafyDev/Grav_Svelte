import * as XLSX from "xlsx";

export { html_table_to_excel, createPDF };

function html_table_to_excel(type, nombreArchivo, tablaExport) {
    // Crear una matriz para almacenar solo los datos limpios
    const cleanData = [];

    // Recorrer las filas de la tabla
    tablaExport.querySelectorAll("tr").forEach((row) => {
        const rowData = [];

        // Recorrer las celdas de cada fila
        row.querySelectorAll("td, th").forEach((cell) => {
            rowData.push(cell.textContent.trim()); // Extraer solo el texto limpio de cada celda
        });

        cleanData.push(rowData); // Añadir la fila limpia a la matriz de datos
    });

    // Crear un workbook con los datos limpios
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(cleanData); // Convertir la matriz en una hoja
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Añadir la hoja al libro

    // Exportar el archivo Excel
    XLSX.writeFile(workbook, `${nombreArchivo}.${type}`);
}

/**
 * @param {HTMLElement} tablaExport
 * @param {string} nombreArchivo
 */
function createPDF(tablaExport, nombreArchivo = "PDF") {
    // Crear un nuevo contenido solo con los datos limpios
    let cleanTable = "<table>";

    // Recorrer las filas de la tabla
    tablaExport.querySelectorAll("tr").forEach((row) => {
        cleanTable += "<tr>";

        // Recorrer las celdas de cada fila
        row.querySelectorAll("td, th").forEach((cell) => {
            cleanTable += `<td>${cell.textContent.trim()}</td>`; // Extraer solo el texto limpio
        });

        cleanTable += "</tr>";
    });

    cleanTable += "</table>";

    // Estilos para el PDF
    const style = `
        <style>
            table {width: 100%; font: 17px Calibri;}
            table, th, td {border: solid 1px #DDD; border-collapse: collapse; padding: 2px 3px; text-align: center;}
        </style>
    `;

    // Crear una nueva ventana para el contenido limpio
    const win = window.open("", "", "height=700,width=700");
    win.document.write(`<html><head><title>${nombreArchivo}</title>`);
    win.document.write(style); // Agregar estilos
    win.document.write("</head><body>");
    win.document.write(cleanTable); // Insertar la tabla limpia
    win.document.write("</body></html>");

    win.document.close(); // Cerrar el documento
    win.print(); // Imprimir o guardar como PDF
}
