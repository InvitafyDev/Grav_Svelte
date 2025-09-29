<script lang="ts">
    import {
        ModalContainer,
        openModal,
    } from "$lib/Modals/index.js";
    import ModalEx from "./modalEx.svelte";

    let modalConfig = {
        title: "Modal Title",
        size: "sm" as "sm" | "md" | "lg" | "xs",
        isVista: false,
        loading: false,
        saveButtonDisabled: false,
        saveButtonText: "Guardar",
        cancelButtonText: "Cancelar",
    };

    const sizes = ["sm", "md", "lg", "xs"] as const;

    // Function to generate code preview
    $: codePreview = `
   
    <!-- +layout.svelte -->
    import { ModalContainer } from "grav-svelte";
    <ModalContainer />
    
    <!-- component.svelte -->
    import { Grav_Modal, closeModal, openModal } from "grav-svelte";

    <Grav_Modal
    title="${modalConfig.title}"
    size="${modalConfig.size}"
    isVista={${modalConfig.isVista}}
    loading={${modalConfig.loading}}
    saveButtonDisabled={${modalConfig.saveButtonDisabled}}
    saveButtonText="${modalConfig.saveButtonText}"
    cancelButtonText="${modalConfig.cancelButtonText}"
    onClose={() => {
        closeModal("modalID");
    }}
    onSave={() => {
        // Your save logic
    }}
    >
        {/* Your modal content */}
    </Grav_Modal>`;
</script>

<div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Ejemplo de Modales</h1>

    <!-- Configuration Form -->
    <div class="bg-white p-6 rounded-lg  mb-6">
        <h2 class="text-xl font-semibold mb-4">Configuration</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
                <label class="block">
                    <span class="text-gray-700">Title</span>
                    <input
                        type="text"
                        bind:value={modalConfig.title}
                        class="mt-1 block w-full rounded-md border-gray-300  focus:border-emerald-500 focus:ring-emerald-500"
                    />
                </label>

                <label class="block">
                    <span class="text-gray-700">Size</span>
                    <select
                        bind:value={modalConfig.size}
                        class="mt-1 block w-full rounded-md border-gray-300  focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        {#each sizes as size}
                            <option value={size}>{size.toUpperCase()}</option>
                        {/each}
                    </select>
                </label>

                <label class="block">
                    <span class="text-gray-700">Save Button Text</span>
                    <input
                        type="text"
                        bind:value={modalConfig.saveButtonText}
                        class="mt-1 block w-full rounded-md border-gray-300  focus:border-emerald-500 focus:ring-emerald-500"
                    />
                </label>

                <label class="block">
                    <span class="text-gray-700">Cancel Button Text</span>
                    <input
                        type="text"
                        bind:value={modalConfig.cancelButtonText}
                        class="mt-1 block w-full rounded-md border-gray-300  focus:border-emerald-500 focus:ring-emerald-500"
                    />
                </label>
            </div>

            <div class="space-y-4">
                <label class="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        bind:checked={modalConfig.isVista}
                        class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span class="text-gray-700">Vista Mode (No Footer)</span>
                </label>

                <label class="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        bind:checked={modalConfig.loading}
                        class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span class="text-gray-700">Loading State</span>
                </label>

                <label class="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        bind:checked={modalConfig.saveButtonDisabled}
                        class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span class="text-gray-700">Disable Save Button</span>
                </label>
            </div>
        </div>
    </div>

    <!-- Demo Button -->
    <button
        class="bg-emerald-500 text-white px-6 py-3 rounded-md hover:bg-emerald-600 transition-colors"
        on:click={() => {
            openModal("modalEx", ModalEx, { modalConfig });
        }}
    >
        Open Modal Demo
    </button>

    <!-- Code Preview -->
    <div class="bg-white p-6 rounded-lg  mt-6">
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

    <ModalContainer />
</div>
