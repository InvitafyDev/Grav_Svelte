<script lang="ts">
    import { openModal } from "$lib/index.js";
    import FormModal from "./FormModal.svelte";
</script>

<svelte:head>
    <title>Forms - Grav Svelte</title>
    <meta name="description" content="Forms components for Grav Svelte" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Forms</h1>
        <p class="text-lg text-gray-600">
            Form components and utilities for creating interactive forms.
        </p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Form Modal Demo</h2>
        <p class="text-gray-600 mb-6">
            Click the button below to open the Form Modal.
        </p>

        <button
            class="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
            on:click={() => {
                openModal("formModal", FormModal, {});
            }}
        >
            Open Form Modal
        </button>
    </div>
</div>