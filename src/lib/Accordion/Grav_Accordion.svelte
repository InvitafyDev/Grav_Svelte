<script lang="ts">
    import './Grav_Accordion.css';
    import { slide } from 'svelte/transition';
    import { tick } from 'svelte';
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

    {#if showMinimap && items.length > 0}
        <nav class="grav-acc-minimap" aria-label={minimapTitle}>
            <div class="grav-acc-minimap-title">{minimapTitle}</div>
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
