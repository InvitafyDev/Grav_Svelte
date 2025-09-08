<script lang="ts">
    import {
        Confirmacion_Alert,
        Error_Alert,
        Exito_Alert,
    } from "$lib/index.js";

    // Example usage of Exito_Alert:
    // Exito_Alert('¡Operación exitosa!');
    // Parameters:
    // - titulo: string (optional) - Default: 'Se guardo correctamente'
    function handleSuccess() {
        Exito_Alert("¡Operación exitosa!");
    }

    // Example usage of Error_Alert:
    // Error_Alert('Ha ocurrido un error');
    // Parameters:
    // - titulo: string (optional) - Default: 'Algo salió mal'
    function handleError() {
        Error_Alert("Ha ocurrido un error");
    }

    // Example usage of Confirmacion_Alert:
    // Confirmacion_Alert(
    //     'Confirmar acción',           // titulo (optional)
    //     '¿Está seguro?',             // texto (optional)
    //     () => {                      // callback function
    //         // Your code here
    //     }
    // );
    // Parameters:
    // - titulo: string (optional) - Default: 'Confirmación'
    // - texto: string (optional) - Default: 'Desea guardar los cambios?'
    // - callback: () => void - Function to execute when confirmed
    function handleConfirmation() {
        Confirmacion_Alert(
            "Confirmar acción",
            "¿Está seguro que desea proceder?",
            () => {
                // This function will be called if the user clicks "Yes"
                Exito_Alert("¡Acción confirmada!");
            }
        );
    }
</script>

<div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Ejemplo de Alertas</h1>

    <div class="space-y-4">
        <div class="p-4 bg-white rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">Alerta de Éxito</h2>
            <div class="mb-4 p-4 bg-gray-100 rounded">
                {@html "Exito_Alert('¡Operación exitosa!');"}
            </div>
            <button
                on:click={handleSuccess}
                class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
            >
                Mostrar Alerta de Éxito
            </button>
        </div>

        <div class="p-4 bg-white rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">Alerta de Error</h2>
            <div class="mb-4 p-4 bg-gray-100 rounded">
                {@html "Error_Alert('Ha ocurrido un error');"}
            </div>
            <button
                on:click={handleError}
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
                Mostrar Alerta de Error
            </button>
        </div>

        <div class="p-4 bg-white rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">Alerta de Confirmación</h2>
            <div class="mb-4 p-4 bg-gray-100 rounded">
                {@html `Confirmacion_Alert(
    'Confirmar acción',
    '¿Está seguro?',
    () => {
        // Your code here
    }
);`}
            </div>
            <button
                on:click={handleConfirmation}
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
                Mostrar Alerta de Confirmación
            </button>
        </div>
    </div>
</div>
