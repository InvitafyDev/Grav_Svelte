<script>
    import { createEventDispatcher } from "svelte";
    import "./PaginationCRUD.css";
    import "../typography.css";
    const dispatch = createEventDispatcher();

    export let perPage;
    export let totalRows;
    export let currentPage = 1;

    $: totalPages = Math.ceil(totalRows / perPage);
    $: start = (currentPage - 1) * perPage;
    $: end = Math.min(start + perPage - 1, totalRows - 1);

    // Helper function to determine if a page number should be visible
    function shouldShowPage(pageNum) {
        if (totalPages <= 7) return true;
        if (pageNum <= 2 || pageNum >= totalPages - 1) return true;
        return Math.abs(pageNum - currentPage) <= 2;
    }

    function handlePageChange(page) {
        currentPage = page;
        dispatch("pageChange", { page, pageSize: perPage });
    }
</script>

{#if totalRows && totalRows > perPage}
    <div class="pagination-container">
        <button
            on:click={() => handlePageChange(1)}
            disabled={currentPage === 1}
            class="pagination-button pagination-button-nav first"
            aria-label="Go to first page"
        >
            <i class="fas fa-chevron-left"></i>
            <i class="fas fa-chevron-left"></i>
        </button>

        <button
            on:click={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            class="pagination-button pagination-button-arrow"
            aria-label="Go to previous page"
        >
            <i class="fas fa-chevron-left"></i>
        </button>

        {#each Array(totalPages) as _, i}
            {@const pageNum = i + 1}
            {#if shouldShowPage(pageNum)}
                <button
                    on:click={() => handlePageChange(pageNum)}
                    class="pagination-button pagination-button-page {pageNum === currentPage ? 'active' : ''}"
                    aria-label="Go to page {pageNum}"
                    aria-current={pageNum === currentPage ? "page" : undefined}
                >
                    {pageNum}
                </button>
            {:else if shouldShowPage(i) && !shouldShowPage(i + 1)}
                <span class="pagination-ellipsis">...</span>
            {/if}
        {/each}

        <button
            on:click={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            class="pagination-button pagination-button-arrow"
            aria-label="Go to next page"
        >
            <i class="fas fa-chevron-right"></i>
        </button>

        <button
            on:click={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
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
        Mostrando: {start + 1} - {end + 1} de {totalRows} registros
    </p>
</div>

