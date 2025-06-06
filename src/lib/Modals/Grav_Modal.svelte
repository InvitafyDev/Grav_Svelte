<script lang="ts">
    // Define size type
    type ModalSize = "lg" | "md" | "sm";

    // Props interface
    interface $$Props {
        title?: string;
        onClose?: () => void;
        onSave?: () => void;
        saveButtonText?: string;
        cancelButtonText?: string;
        saveButtonDisabled?: boolean;
        loading?: boolean;
        size?: ModalSize;
        isVista?: boolean;
    }

    // Default props
    export let title = "Modal Title";
    export let onClose = () => {};
    export let onSave = () => {};
    export let saveButtonText = "Guardar";
    export let cancelButtonText = "Cancelar";
    export let saveButtonDisabled = false;
    export let loading = false;
    export let size: ModalSize = "lg";
    export let isVista = false;

    // Size classes mapping
    const sizeClasses: Record<ModalSize, string> = {
        lg: "modal-lg",
        md: "modal-md",
        sm: "modal-sm",
    };

    // Get the current size class
    $: currentSizeClass = sizeClasses[size];

    // Handle keydown event
    function handleKeydown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;
        const isInputElement = target.tagName === "TEXTAREA";

        if (
            event.key === "Enter" &&
            !saveButtonDisabled &&
            !loading &&
            !isInputElement
        ) {
            event.preventDefault();
            event.stopPropagation();
            onSave();
        } else if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onClose();
        }
    }

    // Handle click to focus the modal
    function handleClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const currentTarget = event.currentTarget as HTMLElement;

        // Only focus if clicking directly on the modal container
        if (target === currentTarget) {
            target.focus();
        }
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
    class="modal"
    on:keydown={handleKeydown}
    on:click={handleClick}
    tabindex="0"
>
    <!--content-->
    <div
        class="modal-content {currentSizeClass}"
    >
        <!-- Encabezado Modal -->
        <div
            class="modal-header"
        >
            <h3 class="modal-title">
                {title}
            </h3>
            <!-- Cerrar Modal -->
            <button
                class="close-btn"
                on:click={onClose}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <!-- /Cerrar Modal -->
        </div>
        <!-- Encabezado Modal -->

        {#if loading}
            <div class="modal-body" style="display:flex; justify-content:center; align-items:center;">
                <div>
                    <svg
                        class="spinner"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </div>
            </div>
        {:else}
            <!-- Cuerpo Modal -->
            <div class="modal-body">
                <slot />
            </div>
            <!-- /Cuerpo Modal -->

            {#if !isVista}
                <!-- Pie Modal -->
                <div class="modal-footer">
                    <!-- Btn Guardar -->
                    <button
                        class="btn-save"
                        type="button"
                        on:click={onSave}
                        disabled={saveButtonDisabled}
                    >
                        {saveButtonText}
                    </button>
                    <!-- /Btn Guardar -->
                    <!-- Cerrar Modal -->
                    <button
                        class="btn-cancel"
                        type="button"
                        on:click={onClose}
                    >
                        {cancelButtonText}
                    </button>
                    <!-- /Cerrar Modal -->
                </div>
                <!-- /Pie Modal -->
            {/if}
        {/if}
    </div>
</div>
<div class="overlay" />
