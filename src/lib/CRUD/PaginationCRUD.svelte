<script>
    import { createEventDispatcher } from "svelte";
    import "./PaginationCRUD.css";
    import "../typography.css";
    const dispatch = createEventDispatcher();

    export let perPage;
    export let totalRows;
    export let currentPage = 1;
    export let labelMostrando = 'Showing:';
    export let labelDe = 'of';
    export let labelRegistros = 'records';

    $: totalPages = Math.max(1, Math.ceil(totalRows / perPage));
    // currentPage efectivo, SIEMPRE dentro de [1, totalPages]. Evita la "página
    // fantasma": si un filtro reduce el total por debajo de currentPage, el
    // render (rango, ventana de números, botones) se mantiene coherente aunque
    // el padre todavía no haya reseteado la página.
    $: safePage = Math.min(Math.max(currentPage, 1), totalPages);
    $: start = (safePage - 1) * perPage;
    $: end = Math.min(start + perPage - 1, totalRows - 1);

    // Lista de items a renderizar (páginas visibles + ellipsis), calculada en un
    // `$:` con totalPages y safePage EXPLÍCITOS en la expresión. En Svelte 3 una
    // condición `{#if fn(x)}` en el template NO rastrea las variables internas de
    // fn — la ventana quedaba congelada en el primer render al cambiar de página.
    $: pageItems = buildPageItems(totalPages, safePage);

    function buildPageItems(total, current) {
        const items = [];
        let prevVisible = false;
        for (let p = 1; p <= total; p++) {
            const visible =
                total <= 7 ||
                p <= 2 ||
                p >= total - 1 ||
                Math.abs(p - current) <= 2;
            if (visible) {
                items.push({ type: 'page', num: p });
                prevVisible = true;
            } else {
                if (prevVisible) items.push({ type: 'ellipsis', num: p });
                prevVisible = false;
            }
        }
        return items;
    }

    function handlePageChange(page) {
        // Clampar el destino para no navegar fuera de rango.
        const target = Math.min(Math.max(page, 1), totalPages);
        currentPage = target;
        dispatch("pageChange", { page: target, pageSize: perPage });
    }
</script>

{#if totalRows && totalRows > perPage}
    <div class="pagination-container">
        <button
            on:click={() => handlePageChange(1)}
            disabled={safePage <= 1}
            class="pagination-button pagination-button-nav first"
            aria-label="Go to first page"
        >
            <i class="fas fa-chevron-left"></i>
            <i class="fas fa-chevron-left"></i>
        </button>

        <button
            on:click={() => handlePageChange(safePage - 1)}
            disabled={safePage <= 1}
            class="pagination-button pagination-button-arrow"
            aria-label="Go to previous page"
        >
            <i class="fas fa-chevron-left"></i>
        </button>

        {#each pageItems as item (item.type + '-' + item.num)}
            {#if item.type === 'page'}
                <button
                    on:click={() => handlePageChange(item.num)}
                    class="pagination-button pagination-button-page {item.num === safePage ? 'active' : ''}"
                    aria-label="Go to page {item.num}"
                    aria-current={item.num === safePage ? "page" : undefined}
                >
                    {item.num}
                </button>
            {:else}
                <span class="pagination-ellipsis">...</span>
            {/if}
        {/each}

        <button
            on:click={() => handlePageChange(safePage + 1)}
            disabled={safePage >= totalPages}
            class="pagination-button pagination-button-arrow"
            aria-label="Go to next page"
        >
            <i class="fas fa-chevron-right"></i>
        </button>

        <button
            on:click={() => handlePageChange(totalPages)}
            disabled={safePage >= totalPages}
            class="pagination-button pagination-button-nav last"
            aria-label="Go to last page"
        >
            <i class="fas fa-chevron-right"></i>
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>
{/if}

<div class="pagination-info-container">
    <p class="pagination-info">
        {labelMostrando} {start + 1} - {end + 1} {labelDe} {totalRows} {labelRegistros}
    </p>
</div>

