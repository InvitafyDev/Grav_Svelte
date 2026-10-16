<script lang="ts">
    import { onDestroy, tick } from "svelte";
    import { fade } from "svelte/transition";

    export let text: string;

    // El tooltip se pinta en <body> con position: fixed. Dentro de la tabla lo
    // recortaba el overflow: hidden de la celda (y el scroll de .table-scroll),
    // heredaba el corte de palabras de la celda ("Finaliza / r") y, al crecer a
    // varias líneas pegado al botón, tapaba el propio botón.
    const SEPARACION = 6; // px entre el botón y el tooltip
    const MARGEN = 8; // px mínimos contra el borde de la ventana

    let showTooltip = false;
    let trigger: HTMLDivElement;
    let tooltipEl: HTMLDivElement;
    let top = 0;
    let left = 0;
    let variables = "";
    let escuchando = false;

    async function show(event: PointerEvent) {
        // En pantallas táctiles no hay hover: el toque dejaba el tooltip pegado
        // encima de los botones.
        if (event.pointerType !== "mouse" || !text) return;
        // Fuera de su lugar en el DOM ya no hereda las variables del contenedor
        // (Grav_Modal pone su propio color de tooltip): se copian del botón.
        const estilos = getComputedStyle(trigger);
        variables = ["--grav-crud-color-tooltip", "--grav-crud-tooltip-border-radius"]
            .map((nombre) => [nombre, estilos.getPropertyValue(nombre).trim()])
            .filter(([, valor]) => valor)
            .map(([nombre, valor]) => `${nombre}: ${valor};`)
            .join(" ");
        showTooltip = true;
        await tick();
        if (!showTooltip) return;
        position();
        if (!escuchando) {
            // Con position: fixed se quedaría flotando si la tabla o la página
            // se desplazan.
            window.addEventListener("scroll", hide, true);
            window.addEventListener("resize", hide);
            escuchando = true;
        }
    }

    function hide() {
        showTooltip = false;
        if (escuchando) {
            window.removeEventListener("scroll", hide, true);
            window.removeEventListener("resize", hide);
            escuchando = false;
        }
    }

    // Arriba del botón y centrado; si no cabe arriba, abajo. Nunca encima del
    // botón, y sin salirse de la ventana por los lados.
    function position() {
        if (!trigger || !tooltipEl) return;
        const boton = trigger.getBoundingClientRect();
        const caja = tooltipEl.getBoundingClientRect();
        const arriba = boton.top - SEPARACION - caja.height;
        top = arriba >= MARGEN ? arriba : boton.bottom + SEPARACION;
        const centrado = boton.left + boton.width / 2 - caja.width / 2;
        // clientWidth no cuenta la barra de scroll; innerWidth sí.
        const ancho = document.documentElement.clientWidth;
        left = Math.max(MARGEN, Math.min(centrado, ancho - caja.width - MARGEN));
    }

    function portal(node: HTMLElement) {
        document.body.appendChild(node);
        // Al destruir la celda (p. ej. al refrescar la tabla) Svelte no siempre
        // quita el nodo, porque ya no está dentro de ella: se quita aquí.
        return { destroy: () => node.remove() };
    }

    onDestroy(hide);
</script>

<div class="tooltip-container">
    {#if showTooltip}
        <div
            bind:this={tooltipEl}
            use:portal
            class="grav-tooltip"
            style="top: {top}px; left: {left}px; {variables}"
            in:fade={{ duration: 150 }}
        >
            {text}
        </div>
    {/if}
    <!-- Sin role ni tabindex: este div solo escucha el mouse para mostrar el
         tooltip, no es un control. Ponerle role="button" anidaba un boton dentro
         de otro (el del slot), duplicaba la parada de tabulacion de cada boton de
         la tabla y hacia que un lector de pantalla anunciara "boton" dos veces.
         El nombre accesible ya lo pone el propio elemento del slot.
         pointerdown lo esconde porque el clic suele abrir un modal, y el tooltip
         (en <body>) quedaria encima de el. -->
    <div
        bind:this={trigger}
        on:pointerenter={show}
        on:pointerleave={hide}
        on:pointerdown={hide}
    >
        <slot />
    </div>
</div>

<style>
    .grav-tooltip {
        position: fixed;
        z-index: 10000;
        width: max-content;
        max-width: min(16rem, calc(100vw - 16px));
        padding: 0.25rem;
        color: white;
        font-size: 0.75rem;
        line-height: 1.25;
        text-align: center;
        white-space: normal;
        overflow-wrap: normal;
        word-break: normal;
        background-color: var(--grav-crud-color-tooltip);
        border-radius: var(--grav-crud-tooltip-border-radius, 0.25rem);
        pointer-events: none;
    }
</style>
