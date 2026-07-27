<script lang="ts">
    import './Grav_Accordion.css';
    import { slide, fly } from 'svelte/transition';
    import { tick, onMount } from 'svelte';
    import type { AccordionItemI } from './interfaces.js';

    export let items: AccordionItemI[] = [];
    /** Minimapa flotante a la derecha (estilo VS Code): click = ir a la sección; toggle = abrir/cerrar. */
    export let showMinimap = false;
    export let minimapTitle = 'Contenido';
    /** Permite tener varios items abiertos a la vez. */
    export let multiple = true;
    /** Muestra el toggle de check (realizado) en cada item. */
    export let showCheck = true;
    /** Muestra la barra superior con Expandir/Colapsar todo y el resumen. */
    export let showToolbar = true;
    /** Abre todos los items al montar. */
    export let startExpanded = false;
    /** Callback al hacer clic en el check de un item. */
    export let onCheck: (item: AccordionItemI) => void = () => {};
    /** Callback al expandir un item (útil para carga lazy del contenido). */
    export let onExpand: (item: AccordionItemI) => void = () => {};
    // Labels traducibles (mismo patrón que CrudWrapper)
    export let labelExpandir = 'Expandir todo';
    export let labelColapsar = 'Colapsar todo';
    export let labelResumen = 'realizadas';
    export let tooltipCheckOn = 'Marcar como no realizado';
    export let tooltipCheckOff = 'Marcar como realizado';

    let expandedIds: Array<string | number> = [];
    let initialized = false;
    $: if (!initialized && items.length > 0) {
        initialized = true;
        if (startExpanded) {
            expandedIds = items.map((i) => i.id);
            items.forEach((i) => onExpand(i));
        }
    }

    $: totalChecked = items.filter((i) => i.checked).length;

    function toggle(item: AccordionItemI) {
        if (expandedIds.indexOf(item.id) !== -1) {
            expandedIds = expandedIds.filter((x) => x !== item.id);
        } else {
            expandedIds = multiple ? [...expandedIds, item.id] : [item.id];
            onExpand(item);
        }
    }

    function expandAll() {
        const nuevos = items.filter((i) => expandedIds.indexOf(i.id) === -1);
        expandedIds = items.map((i) => i.id);
        nuevos.forEach((i) => onExpand(i));
    }

    function collapseAll() {
        expandedIds = [];
    }

    function handleCheck(item: AccordionItemI, event: Event) {
        event.stopPropagation();
        onCheck(item);
    }

    // Refs a los items para el scroll del minimapa.
    let itemEls: Record<string | number, HTMLElement> = {};

    // El minimapa es colapsable. En PC (dispositivo con cursor/hover) inicia colapsado como
    // botón flotante y se ABRE al pasar el cursor por encima (flyout). En touch conserva el
    // comportamiento por ancho: abierto en pantallas anchas, botón flotante en angostas.
    let minimapAbierto = true;
    let hoverCapaz = false;

    // Ancho del minimapa redimensionable (solo PC): se arrastra el borde izquierdo y se
    // recuerda en localStorage. En touch/angosto manda el CSS (no se aplica ancho inline).
    const MINIMAP_ANCHO_DEFAULT = 208; // 13rem
    const MINIMAP_ANCHO_MIN = 150;
    const MINIMAP_ANCHO_MAX = 460;
    let minimapAncho = MINIMAP_ANCHO_DEFAULT;
    let redimensionando = false;
    let _resizeStartX = 0;
    let _resizeStartAncho = 0;

    onMount(() => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            hoverCapaz = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            minimapAbierto = hoverCapaz
                ? false
                : window.matchMedia('(min-width: 1024px)').matches;
        }
        try {
            const guardado = localStorage.getItem('gravAccMinimapAncho');
            if (guardado) {
                const n = parseInt(guardado, 10);
                if (!isNaN(n))
                    minimapAncho = Math.min(MINIMAP_ANCHO_MAX, Math.max(MINIMAP_ANCHO_MIN, n));
            }
        } catch (_) {}
    });

    // Hover-to-open SOLO en PC (dispositivos con cursor): abrir al entrar el mouse al botón
    // flotante y cerrar al salir del panel. En touch no aplica (hoverCapaz queda false).
    function abrirMinimapHover() {
        if (hoverCapaz) minimapAbierto = true;
    }
    function cerrarMinimapHover() {
        // No cerrar mientras se arrastra el borde para redimensionar.
        if (hoverCapaz && !redimensionando) minimapAbierto = false;
    }

    // Redimensionar arrastrando el borde izquierdo (el panel está anclado a la derecha,
    // así que arrastrar hacia la IZQUIERDA lo agranda). El ancho se guarda al soltar.
    function iniciarResize(e) {
        redimensionando = true;
        _resizeStartX = e.clientX;
        _resizeStartAncho = minimapAncho;
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch (_) {}
        e.preventDefault();
    }
    function alRedimensionar(e) {
        if (!redimensionando) return;
        const delta = _resizeStartX - e.clientX;
        minimapAncho = Math.min(
            MINIMAP_ANCHO_MAX,
            Math.max(MINIMAP_ANCHO_MIN, _resizeStartAncho + delta)
        );
    }
    function terminarResize(e) {
        if (!redimensionando) return;
        redimensionando = false;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch (_) {}
        try {
            localStorage.setItem('gravAccMinimapAncho', String(minimapAncho));
        } catch (_) {}
    }
    // Accesibilidad: flechas ←/→ para ensanchar/angostar con foco en el borde.
    function ajustarAnchoTeclado(e) {
        const paso = 16;
        if (e.key === 'ArrowLeft') minimapAncho = Math.min(MINIMAP_ANCHO_MAX, minimapAncho + paso);
        else if (e.key === 'ArrowRight') minimapAncho = Math.max(MINIMAP_ANCHO_MIN, minimapAncho - paso);
        else return;
        e.preventDefault();
        try {
            localStorage.setItem('gravAccMinimapAncho', String(minimapAncho));
        } catch (_) {}
    }

    async function irAItem(item: AccordionItemI) {
        if (expandedIds.indexOf(item.id) === -1) {
            expandedIds = multiple ? [...expandedIds, item.id] : [item.id];
            onExpand(item);
            await tick();
        }
        const el = itemEls[item.id];
        if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
</script>

<div class="grav-acc">
    {#if showToolbar}
        <div class="grav-acc-toolbar">
            <div class="grav-acc-toolbar-buttons">
                <button type="button" class="grav-acc-toolbar-btn" on:click={expandAll}>
                    <svg class="grav-acc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4 4 4-4M8 15l4 4 4-4" transform="translate(0 -2)" />
                    </svg>
                    {labelExpandir}
                </button>
                <button type="button" class="grav-acc-toolbar-btn" on:click={collapseAll}>
                    <svg class="grav-acc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 13l4-4 4 4M8 19l4-4 4 4" transform="translate(0 -2)" />
                    </svg>
                    {labelColapsar}
                </button>
            </div>
            {#if showCheck}
                <span
                    class="grav-acc-summary {totalChecked === items.length && items.length > 0
                        ? 'grav-acc-summary--done'
                        : ''}"
                >
                    {totalChecked}/{items.length} {labelResumen}
                </span>
            {/if}
        </div>
    {/if}

    <div class="grav-acc-list">
        {#each items as item (item.id)}
            <div
                class="grav-acc-item {expandedIds.indexOf(item.id) !== -1 ? 'grav-acc-item--open' : ''}"
                bind:this={itemEls[item.id]}
            >
                <div
                    class="grav-acc-header"
                    role="button"
                    tabindex="0"
                    on:click={() => toggle(item)}
                    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(item)}
                >
                    <svg
                        class="grav-acc-chevron {expandedIds.indexOf(item.id) !== -1 ? 'grav-acc-chevron--open' : ''}"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <div class="grav-acc-header-text">
                        <span class="grav-acc-title">{item.title}</span>
                        {#if item.subtitle}
                            <span class="grav-acc-subtitle">{item.subtitle}</span>
                        {/if}
                    </div>
                    {#if item.badgeText}
                        <span class="grav-acc-badge grav-acc-badge--{item.badgeType || 'neutral'}">
                            {item.badgeText}
                        </span>
                    {/if}
                    {#if showCheck && item.checkable !== false}
                        <button
                            type="button"
                            class="grav-acc-check {item.checked ? 'grav-acc-check--on' : ''}"
                            title={item.checked ? tooltipCheckOn : tooltipCheckOff}
                            on:click={(e) => handleCheck(item, e)}
                        >
                            {#if item.checked}
                                <svg class="grav-acc-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            {:else}
                                <svg class="grav-acc-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                                </svg>
                            {/if}
                        </button>
                    {/if}
                </div>
                {#if expandedIds.indexOf(item.id) !== -1}
                    <div class="grav-acc-content" transition:slide={{ duration: 220 }}>
                        <slot {item} />
                    </div>
                {/if}
            </div>
        {/each}
    </div>

    {#if showMinimap && items.length > 0 && !minimapAbierto}
        <button
            type="button"
            class="grav-acc-minimap-fab"
            title={minimapTitle}
            on:click={() => (minimapAbierto = true)}
            on:mouseenter={abrirMinimapHover}
            transition:fly={{ x: 24, duration: 180 }}
        >
            <svg class="grav-acc-minimap-fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h10M4 18h14" />
            </svg>
        </button>
    {/if}

    {#if showMinimap && items.length > 0 && minimapAbierto}
        <nav
            class="grav-acc-minimap"
            aria-label={minimapTitle}
            style={hoverCapaz ? `width: ${minimapAncho}px` : ''}
            on:mouseleave={cerrarMinimapHover}
            transition:fly={{ x: 24, duration: 180 }}
        >
            {#if hoverCapaz}
                <div
                    class="grav-acc-minimap-resize"
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Redimensionar ancho"
                    title="Arrastrá para cambiar el ancho"
                    tabindex="0"
                    on:pointerdown={iniciarResize}
                    on:pointermove={alRedimensionar}
                    on:pointerup={terminarResize}
                    on:keydown={ajustarAnchoTeclado}
                />
            {/if}
            <div class="grav-acc-minimap-header">
                <span class="grav-acc-minimap-title">{minimapTitle}</span>
                <button
                    type="button"
                    class="grav-acc-minimap-close"
                    title="Ocultar minimapa"
                    on:click={() => (minimapAbierto = false)}
                >
                    <svg class="grav-acc-minimap-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div class="grav-acc-minimap-list">
                {#each items as item (item.id)}
                    <div
                        class="grav-acc-minimap-row {expandedIds.indexOf(item.id) !== -1
                            ? 'grav-acc-minimap-row--open'
                            : ''}"
                    >
                        <button
                            type="button"
                            class="grav-acc-minimap-link"
                            title={item.title}
                            on:click={() => irAItem(item)}
                        >
                            <span
                                class="grav-acc-minimap-dot {item.checked
                                    ? 'grav-acc-minimap-dot--done'
                                    : ''}"
                            />
                            <span class="grav-acc-minimap-text">{item.title}</span>
                        </button>
                        <button
                            type="button"
                            class="grav-acc-minimap-toggle"
                            title={expandedIds.indexOf(item.id) !== -1 ? 'Cerrar sección' : 'Abrir sección'}
                            on:click={() => toggle(item)}
                        >
                            <svg
                                class="grav-acc-minimap-chevron {expandedIds.indexOf(item.id) !== -1
                                    ? 'grav-acc-minimap-chevron--open'
                                    : ''}"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                {/each}
            </div>
        </nav>
    {/if}
</div>
