<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let perPage;
    export let totalRows;
    export let currentPage = 1;
    export let theme = "black";

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
    <div class="flex items-center justify-center p-3 pb-0">
        <button
            on:click={() => handlePageChange(1)}
            disabled={currentPage === 1}
            class="mr-auto p-2 text-xs hover:bg-black hover:text-white bg-white  text-black border border-black tracking-wider rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go to first page"
        >
            <i class="fas fa-chevron-left" />
            <i class="fas fa-chevron-left" />
        </button>

        <button
            on:click={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            class="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go to previous page"
        >
            <i class="fas fa-chevron-left" />
        </button>

        {#each Array(totalPages) as _, i}
            {@const pageNum = i + 1}
            {#if shouldShowPage(pageNum)}
                <button
                    on:click={() => handlePageChange(pageNum)}
                    class="p-1 w-8 text-center border-b-2 hover:bg-gray-200 cursor-pointer mr-1 {pageNum ===
                    currentPage
                        ? 'border-black'
                        : ''}"
                    aria-label="Go to page {pageNum}"
                    aria-current={pageNum === currentPage ? "page" : undefined}
                >
                    {pageNum}
                </button>
            {:else if shouldShowPage(i) && !shouldShowPage(i + 1)}
                <span class="px-2">...</span>
            {/if}
        {/each}

        <button
            on:click={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            class="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go to next page"
        >
            <i class="fas fa-chevron-right" />
        </button>

        <button
            on:click={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            class="ml-auto p-2 text-xs hover:bg-black hover:text-white bg-white  text-black border border-black tracking-wider rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go to last page"
        >
            <i class="fas fa-chevron-right" />
            <i class="fas fa-chevron-right" />
        </button>
    </div>
{/if}

<div
    class="flex items-center justify-center my-2 {theme === 'black'
        ? 'text-black'
        : 'text-white'}"
>
    <p class="text-sm">
        Mostrando: {start + 1} - {end + 1} de {totalRows} registros
    </p>
</div>
