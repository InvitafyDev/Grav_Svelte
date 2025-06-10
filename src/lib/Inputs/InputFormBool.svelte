<script>
    export let valueVar = false;
    export let label;
    export let disabled = false;
</script>

<div class="input-container">
    {#if valueVar}
        <button
            aria-label="checkbox"
            {disabled}
            on:click={() => (valueVar = false)}
            class="checkbox-button checked"
        >
            <i class="fas fa-check checkwhite"></i>
        </button>
    {:else}
        <button
            {disabled}
            on:click={() => (valueVar = true)}
            class="checkbox-button"
        >
            -
        </button>
    {/if}
    <h1 class="label">{label}</h1>
</div>

<style>
    .input-container {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
    }

    .checkbox-button {
        margin-right: 0.5rem;
        height: 2rem;
        width: 2rem;
        border: 1px solid black;
        background: white;
        cursor: pointer;
    }

    .checkbox-button.checked {
        background: black;
    }

    .checkwhite {
        color: white;
    }

    .label {
        font-size: 1rem;
        margin: 0;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
