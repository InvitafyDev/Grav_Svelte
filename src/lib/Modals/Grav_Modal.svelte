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
        lg: "w-full min-h-screen",
        md: "sm:w-3/4 w-7/8 min-h-[80vh]",
        sm: "sm:w-1/3 w-3/4 min-h-[60vh]",
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
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
    on:keydown={handleKeydown}
    on:click={handleClick}
    tabindex="0"
>
    <!--content-->
    <div
        class="border-0 shadow-lg relative flex flex-col {currentSizeClass} bg-white outline-none focus:outline-none"
    >
        <!-- Encabezado Modal -->
        <div
            class="flex items-start justify-between p-4 border-b border-solid border-blueGray-200 rounded-t"
        >
            <h3 class="text-xl font-semibold">
                {title}
            </h3>
            <!-- Cerrar Modal -->
            <button
                class="p-1 cursor-pointer ml-auto bg-transparent border-0 text-black float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
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
            <div class="relative p-6 flex-1 flex justify-center items-center">
                <div class="flex justify-center text-4xl items-center">
                    <svg
                        class="animate-spin h-8 w-8 text-emerald-500"
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
            <div class="relative sm:p-4 p-2 flex-auto">
                <slot />
            </div>
            <!-- /Cuerpo Modal -->

            {#if !isVista}
                <!-- Pie Modal -->
                <div
                    class="flex items-center justify-end p-3 border-t border-solid border-blueGray-200"
                >
                    <!-- Btn Guardar -->
                    <button
                        class="bg-emerald-500 cursor-pointer disabled:bg-emerald-300 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        on:click={onSave}
                        disabled={saveButtonDisabled}
                    >
                        {saveButtonText}
                    </button>
                    <!-- /Btn Guardar -->
                    <!-- Cerrar Modal -->
                    <button
                        class=" disabled:bg-emerald-300 cursor-pointer text-red-500 font-bold uppercase text-sm px-6 py-3 rounded hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
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
<div class="opacity-25 fixed inset-0 z-40 bg-black" />
