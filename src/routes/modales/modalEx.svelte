<script>
    import { closeModal, Grav_Modal } from "$lib/index.js";
    import { onMount } from "svelte";
    export let modalConfig;

    onMount(() => {
        console.log(modalConfig);
    });
</script>

<Grav_Modal
    {...modalConfig}
    onClose={() => {
        closeModal("modalEx");
    }}
    onSave={() => {
        alert("Save clicked!");
    }}
>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Modal Content</h2>
        <p class="text-gray-600">
            This is a dynamic example of the Modal component. You can modify all
            its properties using the configuration form above.
        </p>
    </div>
</Grav_Modal>
