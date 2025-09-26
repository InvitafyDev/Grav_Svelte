<script lang="ts">
    import { Grav_Modal, closeModal } from "$lib/Modals/index.js";
    export let src: string;
    const MODAL_ID = "crud-image-modal";
</script>

<Grav_Modal
    title="Imagen"
    size="lg"
    isVista={true}
    onClose={() => closeModal(MODAL_ID)}
>
    <div class="image-modal-container">
        <img {src} alt="image" class="image-modal-img" />
    </div>
</Grav_Modal>

<style>
    .image-modal-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .image-modal-img {
        max-height: 85vh;
        max-width: 100%;
        height: auto;
        width: auto;
        object-fit: contain;
    }
</style>
