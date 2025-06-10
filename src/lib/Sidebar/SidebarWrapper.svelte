<script lang="ts">
    import type { SidebarSection } from "./sidebarConfig.js";
    import SidebarItem from "./SidebarItem.svelte";
    import "./SidebarWrapper.css";
    import { onMount } from 'svelte';
    // Props
    export let sections: SidebarSection[];
    export let brandName: string;
    export let brandLink: string;
    export let baseRoute: string;
    export let showLogout: boolean = true;
    export let logoutLink: string = "/";
    export let customClass: string = "";
    export let storefullScreen: boolean;

    // State Management
    let collapseShow = true;

    onMount(() => {
        // Check if screen width is mobile size (less than 640px)
        collapseShow = window.innerWidth >= 640;
    });

    // Functions
    function toggleCollapseShow() {
        console.log("toggleCollapseShow");
        collapseShow = !collapseShow;
    }
</script>

<nav class="sidebar {customClass}">
    <div class="fullscreen-toggle">
        <button
            aria-label="Toggle full screen"
            on:click={() => (storefullScreen = true)}
            class="fullscreen-button"
        >
            <i class="fas fa-caret-left"></i>
        </button>
    </div>
    <div class="sidebar-container">
        <div class="sidebar-header">
            <button
                aria-label="Toggle sidebar"
                on:click={toggleCollapseShow}
                class="sidebar-toggler"
                type="button"
            >
                <i class="fa-solid fa-bars"></i>
            </button>
    
            <!-- Brand -->
            <a class="brand-link" href={brandLink}>
                {brandName}
            </a>
        </div>
        <!-- Toggler -->

        <!-- Collapse -->
        {#if collapseShow}
            <div class="collapse-container">
                <!-- Collapse header -->

                <ul class="sidebar-list">
                    {#each sections as section, index}
                        <li
                            class="sidebar-section"
                            class:border-t={index === 0}
                        >
                            {#if section.biActivado}
                                <button
                                    on:click={() =>
                                        (section.biActivado =
                                            !section.biActivado)}
                                    class="section-button"
                                >
                                    <i class="fas fa-caret-down mr-2 text-sm"
                                    ></i>
                                    {section.nombre}
                                </button>
                            {:else}
                                <button
                                    on:click={() =>
                                        (section.biActivado =
                                            !section.biActivado)}
                                    class="section-button"
                                >
                                    <i class="fas fa-caret-right mr-2 text-sm"
                                    ></i>
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
                                        baseRoute={baseRoute}
                                    />
                                {/each}
                            {/if}
                        </li>
                    {/each}

                    {#if showLogout}
                        <li class="logout-item">
                            <a class="logout-link" href={logoutLink}>
                                Log Out <i class="fas fa-sign-out-alt ml-2"></i>
                            </a>
                        </li>
                    {/if}
                </ul>
            </div>
        {/if}
    </div>
</nav>
