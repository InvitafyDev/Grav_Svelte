<script lang="ts">
    import { base } from "$app/paths";

    export let nombreModulo;
    export let nombreRuta;
    export let nombreIcono;
    export let notifiacion: number | null;
    export let permiso: boolean;
</script>

{#if permiso == true}
    <li class="items-center flex">
        <a
            href="{base}/administracion/{nombreRuta}"
            class="text-xs uppercase py-3 font-bold block"
        >
            <i class="{nombreIcono}  mr-2 text-sm"> </i>
            {nombreModulo}
        </a>
        {#if notifiacion != null}
            <span
                class="bg-white flex justify-center items-center rounded-full text-sm text-black w-5 h-5 ml-1 p-1"
                >{notifiacion}</span
            >
        {/if}
    </li>
{/if}
