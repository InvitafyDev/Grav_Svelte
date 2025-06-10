<script lang="ts">
    import { base } from "$app/paths";

    export let nombreModulo;
    export let nombreRuta;
    export let nombreIcono;
    export let notifiacion: number | null;
    export let permiso: boolean;
    export let baseRoute: string;
</script>

{#if permiso == true}
    <div class="sidebar-item">
        <a
            href="{base}/{baseRoute}/{nombreRuta}"
            class="sidebar-link"
        >
            <i class="sidebar-icon {nombreIcono}"></i>
            {nombreModulo}
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
