<script lang="ts">
    import type { SidebarSection } from "./sidebarConfig.js";
    import SidebarItem from "./SidebarItem.svelte";
    // Props
    export let sections: SidebarSection[];
    export let brandName: string;
    export let brandLink: string;
    export let showLogout: boolean = true;
    export let logoutLink: string = "/";
    export let customClass: string = "";
    export let storefullScreen: boolean;

    // State Management
    let collapseShow = true;

    // Functions
    function toggleCollapseShow() {
        collapseShow = !collapseShow;
    }
</script>

<nav
    class="md:left-0 md:block bg-primary-500 z-[40] md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap shadow-xl flex flex-wrap items-center justify-between relative md:w-64 py-4 px-4 {customClass}"
>
    <div class="sm:absolute sm:block hidden right-5 z-[70]">
        <button
            aria-label="Toggle full screen"
            on:click={() => (storefullScreen = true)}
            class="text-xl cursor-pointer border-2 h-8 w-8 rounded-full flex justify-center items-center border-white"
        >
            <i class="fas fa-caret-left"></i>
        </button>
    </div>
    <div
        class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto"
    >
        <!-- Toggler -->
        <button
            aria-label="Toggle sidebar"
            on:click={toggleCollapseShow}
            class="cursor-pointer text-black md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
        >
            <i class="fa-solid fa-bars"></i>
        </button>

        <!-- Brand -->
        <a
            class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            href={brandLink}
        >
            {brandName}
        </a>

        <!-- Collapse -->
        <div
            class="{collapseShow
                ? 'hidden'
                : 'bg-primary-500 m-2 py-3 px-6 sm:py-0 sm:px-0 sm:m-0'} md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-5 md:shadow-none shadow absolute top-0 left-0 right-0 z-50 h-auto items-center flex-1 rounded"
        >
            <!-- Collapse header -->
            <div
                class="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200"
            >
                <div class="flex flex-wrap">
                    <div class="w-6/12">
                        <a
                            class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                            href={brandLink}
                        >
                            {brandName}
                        </a>
                    </div>
                    <div class="w-6/12 flex justify-end">
                        <button
                            aria-label="Toggle sidebar"
                            type="button"
                            on:click={toggleCollapseShow}
                            class="cursor-pointer text-black md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        >
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>

            <ul class="md:flex-col md:min-w-full flex flex-col list-none">
                {#each sections as section, index}
                    <li class="items-center border-b {index == 0 ? 'border-t' : ''} py-1">
                        {#if section.biActivado}
                            <button
                                on:click={() =>
                                    (section.biActivado = !section.biActivado)}
                                class="text-xs cursor-pointer uppercase py-3 font-bold block w-full text-left"
                            >
                                <i class="fas fa-caret-down mr-2 text-sm"></i>
                                {section.nombre}
                            </button>
                        {:else}
                            <button
                                on:click={() =>
                                    (section.biActivado = !section.biActivado)}
                                class="text-xs cursor-pointer uppercase py-3 font-bold block w-full text-left"
                            >
                                <i class="fas fa-caret-right mr-2 text-sm"></i>
                                {section.nombre}
                            </button>
                        {/if}
                        {#if section.biActivado}
                            {#each section.modules as module}
                                <SidebarItem
                                    nombreModulo={module.nombre}
                                    nombreRuta={module.ruta}
                                    nombreIcono={module.icono}
                                    notifiacion={module.notifiacion ?? null}
                                    permiso={module.permiso ?? true}
                                />
                            {/each}
                        {/if}
                    </li>
                {/each}

                {#if showLogout}
                    <li class="items-center mt-5">
                        <a
                            class="text-left md:pb-2 text-blueGray-600 mr-0 whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                            href={logoutLink}
                        >
                            Log Out <i class="fas fa-sign-out-alt ml-2"></i>
                        </a>
                    </li>
                {/if}
            </ul>
        </div>
    </div>
</nav>
