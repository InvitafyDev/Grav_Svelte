<script lang="ts">
    import { base } from "$app/paths";
    import { onMount, afterUpdate, onDestroy } from "svelte";
    import { cleanIconDuplicates } from "$lib/utils/fontAwesomeHelper.js";

    export let nombreModulo;
    export let nombreRuta;
    export let nombreIcono;
    export let notifiacion: number | null;
    export let permiso: boolean;
    export let baseRoute: string;
    /** En móvil, cerrar el menú al tocar el enlace */
    export let onLinkClick: (() => void) | undefined = undefined;

    let sidebarItemElement: HTMLElement;
    let mutationObserver: MutationObserver | null = null;

    onMount(() => {
        if (sidebarItemElement) {
            cleanIconDuplicates(sidebarItemElement);
            
            // Observar cambios para limpiar duplicados
            mutationObserver = new MutationObserver(() => {
                setTimeout(() => {
                    cleanIconDuplicates(sidebarItemElement);
                }, 10);
            });
            
            mutationObserver.observe(sidebarItemElement, {
                childList: true,
                subtree: true
            });
        }
    });

    afterUpdate(() => {
        if (sidebarItemElement) {
            setTimeout(() => {
                cleanIconDuplicates(sidebarItemElement);
            }, 10);
        }
    });

    onDestroy(() => {
        if (mutationObserver) {
            mutationObserver.disconnect();
        }
    });
</script>

{#if permiso == true}
    <div class="sidebar-item" bind:this={sidebarItemElement}>
        <a
            href={nombreRuta.startsWith('http') ? nombreRuta : `${base}/${baseRoute}/${nombreRuta}`}
            class="sidebar-link"
            target={nombreRuta.startsWith('http') ? '_blank' : undefined}
            rel={nombreRuta.startsWith('http') ? 'noopener' : undefined}
            on:click={() => onLinkClick?.()}
        >
            <i class="sidebar-icon {nombreIcono}" data-fa-processed="true" data-fa-i2svg-processed="true"></i>
            {nombreModulo}
            {#if nombreRuta.startsWith('http')}
                <i class="fas fa-external-link-alt external-icon" data-fa-processed="true" data-fa-i2svg-processed="true"></i>
            {/if}
        </a>
        {#if notifiacion != null}
            <span class="notification-badge">{notifiacion}</span>
        {/if}
    </div>
{/if}

<style>
    .sidebar-item {
        display: flex;
        align-items: center;
    }

    .sidebar-link {
        text-transform: uppercase;
        font-size: 0.75rem;
        padding: 0.75rem 0;
        font-weight: bold;
        display: block;
    }

    .sidebar-icon {
        margin-right: 0.5rem;
        font-size: 0.875rem;
    }

    .external-icon {
        font-size: 0.6rem;
        margin-left: 0.25rem;
    }

    .notification-badge {
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 9999px;
        font-size: 0.875rem;
        color: black;
        width: 1.25rem;
        height: 1.25rem;
        margin-left: 0.25rem;
        padding: 0.25rem;
    }
</style>
