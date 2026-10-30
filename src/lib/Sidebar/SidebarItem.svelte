<script lang="ts">
    import { base } from "$app/paths";
    import { page } from "$app/stores";

    export let nombreModulo;
    export let nombreRuta;
    export let nombreIcono;
    export let notifiacion: number | null;
    export let permiso: boolean;
    export let baseRoute: string;
    /** En móvil, cerrar el menú al tocar el enlace */
    export let onLinkClick: (() => void) | undefined = undefined;

    const sinBarraFinal = (ruta: string) => ruta.replace(/\/+$/, "");

    $: externo = nombreRuta.startsWith('http');
    $: destino = externo ? nombreRuta : `${base}/${baseRoute}/${nombreRuta}`;
    $: activo = !externo && sinBarraFinal(destino) === sinBarraFinal($page.url.pathname);
</script>

{#if permiso == true}
    <div class="sidebar-item">
        <a
            href={destino}
            class="sidebar-link"
            aria-current={activo ? 'page' : undefined}
            target={externo ? '_blank' : undefined}
            rel={externo ? 'noopener' : undefined}
            on:click={() => onLinkClick?.()}
        >
            <i class="sidebar-icon {nombreIcono}" data-fa-processed="true" data-fa-i2svg-processed="true"></i>
            {nombreModulo}
            {#if externo}
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
        text-transform: var(--grav-sidebar-link-text-transform, none);
        font-size: var(--grav-sidebar-link-font-size, 0.8rem);
        padding: var(--grav-sidebar-link-padding, 0.75rem 0);
        font-weight: var(--grav-sidebar-link-font-weight, 500);
        display: var(--grav-sidebar-link-display, block);
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
