<script lang="ts">
    export let base64Preview: string = "";

    export let inputFile: HTMLInputElement;

    // Manejar carga desde archivo
    function onFileChange(): void {
        const file = inputFile.files?.[0];

        if (file) {
            processFile(file);
        } else {
            base64Preview = "";
        }
    }

    // Manejar imágenes pegadas
    function onPaste(event: ClipboardEvent): void {
        const items = event.clipboardData?.items;

        if (items) {
            for (let item of items) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) {
                        updateInputFile(file);
                        processFile(file);
                    }
                }
            }
        }
    }

    // Manejar arrastrar y soltar
    function onDrop(event: DragEvent): void {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file && file.type.startsWith("image/")) {
            updateInputFile(file);
            processFile(file);
        }
    }

    // Prevenir comportamientos predeterminados para "dragover" y "drop"
    function preventDefaults(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    // Procesar archivo (generalizado para diferentes métodos)
    function processFile(file: File): void {
        const reader = new FileReader();
        reader.onload = () => {
            base64Preview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    // Actualizar el input de archivo (simulado)
    function updateInputFile(file: File): void {
        // Crear un objeto DataTransfer para asignar el archivo al input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputFile.files = dataTransfer.files;
    }

    // Resetear la vista previa y el input
    function reset(): void {
        base64Preview = "";
        inputFile.value = "";
    }
</script>

<div
    class="image-container"
    on:paste={onPaste}
    on:dragover={preventDefaults}
    on:dragenter={preventDefaults}
    on:drop={onDrop}
>
    <div>
        <!-- Input para cargar archivos -->
        <label
            class="file-label"
            for="fileInput"
        >
            Selecciona, arrastra o pega una imagen (Ctrl+V)
        </label>
        <input
            id="fileInput"
            bind:this={inputFile}
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            on:change={onFileChange}
            class="file-input"
        />
        <button
            type="button"
            on:click={() => inputFile.click()}
            class="load-button"
        >
            Cargar Imagen
        </button>
    </div>

    <!-- Vista previa de la imagen -->
    <div class="preview-container">
        {#if base64Preview}
            <img
                src={base64Preview}
                alt="Preview"
                class="preview-image"
            />
            <button
                type="button"
                class="remove-button"
                on:click={reset}
            >
                Eliminar Imagen
            </button>
        {:else}
            <div
                class="drop-zone"
                on:dragover={preventDefaults}
                on:dragenter={preventDefaults}
                on:drop={onDrop}
            >
                <h1 class="drop-zone-text">
                    Arrastra, pega o carga una imagen para previsualizar
                </h1>
            </div>
        {/if}
    </div>
</div>

<style>
    .image-container {
        width: 100%;
        padding: 1rem;
        border: 2px solid var(--grav-crud-color-neutral);
        border-radius: 0.5rem;
        background-color: #f9fafb;
        margin: 0.5rem 0;
    }

    .image-container:focus {
        outline: none;
    }

    .file-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--grav-crud-color-neutral);
        margin-bottom: 0.5rem;
        cursor: pointer;
    }

    .file-input {
        display: none;
    }

    .load-button {
        padding: 0.5rem 1rem;
        border: var(--grav-crud-input-border-width) solid var(--grav-crud-color-neutral);
        border-radius: 0.5rem;
        color: var(--grav-crud-color-neutral);
        background-color: white;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .load-button:hover {
        background-color: #f3f4f6;
    }

    .preview-container {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .preview-image {
        width: 100%;
        max-width: 24rem;
    }

    .remove-button {
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        border: var(--grav-crud-input-border-width) solid #dc2626;
        color: #dc2626;
        border-radius: 0.5rem;
        background-color: transparent;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .remove-button:hover {
        background-color: #fef2f2;
    }

    .drop-zone {
        width: 100%;
        max-width: 24rem;
        min-height: 150px;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed var(--grav-crud-color-neutral);
        border-radius: 0.5rem;
        color: #9ca3af;
    }

    .drop-zone-text {
        text-align: center;
        margin: 0;
    }
</style>
