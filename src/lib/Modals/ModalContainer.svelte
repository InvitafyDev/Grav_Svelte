<script lang="ts">
    import { modals } from './modalConfig.js';
</script>

<div>
    {#each $modals as modal, index (modal.id + "-" + index)}
        <div class="modal-overlay">
            <svelte:component this={modal.component} {...modal.props} />
        </div>
    {/each}
</div>

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 500;
    }
</style>
