<script lang="ts">
    import type { SidebarSection } from "./sidebarConfig.js";
    import SidebarItem from "./SidebarItem.svelte";
    import "./SidebarWrapper.css";
    import { Confirmacion_Alert } from "$lib/index.js";
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

    // State: same pattern as Invitafy - string class for collapse (hidden vs overlay)
    let collapseShow = 'hidden';

    onMount(() => {
        if (window.innerWidth >= 1024) {
            collapseShow = '';
        }
    });

    function toggleCollapseShow(classes: string) {
        collapseShow = classes;
    }

    function handleLogout(event: MouseEvent) {
        event.preventDefault();
        Confirmacion_Alert(
            "Confirmar cierre de sesión",
            "¿Desea cerrar sesión?",
            () => {
                window.location.href = logoutLink;
            }
        );
    }
</script>

<nav class="sidebar grav-sidebar-entrance {customClass}">
    <div class="sidebar-fullscreen-wrap">
        <button
            type="button"
            aria-label="Ocultar sidebar"
            class="sidebar-fullscreen-btn"
            on:click={() => (storefullScreen = true)}
        >
            <i class="fas fa-chevron-left" aria-hidden="true"></i>
        </button>
    </div>
    <div class="sidebar-inner">
        <button
            type="button"
            aria-label="Abrir menú"
            class="sidebar-toggler"
            on:click={() => toggleCollapseShow('sidebar-collapse-visible')}
        >
            <i class="fas fa-bars" aria-hidden="true"></i>
        </button>

        <a class="sidebar-brand" href={brandLink}>
            {brandName}
        </a>

        <div class="sidebar-menu {collapseShow}">
            <div class="sidebar-collapse-header">
                <a class="sidebar-collapse-brand" href={brandLink}>
                    {brandName}
                </a>
                <button
                    type="button"
                    aria-label="Cerrar menú"
                    class="sidebar-close-btn"
                    on:click={() => toggleCollapseShow('hidden')}
                >
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>

            <ul class="sidebar-list">
                {#each sections as section}
                    <li class="sidebar-section-item">
                        {#if section.biActivado}
                            <button
                                type="button"
                                class="sidebar-section-btn"
                                on:click={() => (section.biActivado = !section.biActivado)}
                            >
                                <i class="fas fa-caret-down sidebar-section-icon" aria-hidden="true"></i>
                                {section.nombre}
                            </button>
                        {:else}
                            <button
                                type="button"
                                class="sidebar-section-btn"
                                on:click={() => (section.biActivado = !section.biActivado)}
                            >
                                <i class="fas fa-caret-right sidebar-section-icon" aria-hidden="true"></i>
                                {section.nombre}
                            </button>
                        {/if}
                        {#if section.biActivado}
                            <ul class="sidebar-sublist">
                                {#each section.modules as _module}
                                    <li class="sidebar-menu-item">
                                    <SidebarItem
                                        nombreModulo={_module.nombre}
                                        nombreRuta={_module.ruta}
                                        nombreIcono={_module.icono}
                                        notifiacion={_module.notifiacion ?? null}
                                        permiso={_module.permiso ?? true}
                                        baseRoute={baseRoute}
                                        onLinkClick={() => toggleCollapseShow('hidden')}
                                    />
                                    </li>
                                {/each}
                            </ul>
                        {/if}
                    </li>
                {/each}

                {#if showLogout}
                    <li class="sidebar-menu-item sidebar-logout-item">
                        <a
                            class="sidebar-logout-link"
                            href={logoutLink}
                            on:click|preventDefault={handleLogout}
                        >
                            Salir
                            <i class="fas fa-sign-out-alt sidebar-logout-icon" aria-hidden="true"></i>
                        </a>
                    </li>
                {/if}
            </ul>
        </div>
    </div>
</nav>
