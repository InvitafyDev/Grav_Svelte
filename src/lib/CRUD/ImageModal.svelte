<script lang="ts">
    import { Grav_Modal, closeModal } from '$lib/Modals/index.js';
    export let src: string;
    const MODAL_ID = 'crud-image-modal';
</script>

<Grav_Modal
    title="Imagen"
    size="md"
    isVista={true}
    onClose={() => closeModal(MODAL_ID)}
>
    <div class="flex items-center justify-center p-4">
        <img src={src} alt="image" class="max-w-full max-h-[80vh]" />
    </div>
</Grav_Modal>
