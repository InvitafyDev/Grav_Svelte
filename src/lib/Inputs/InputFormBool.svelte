<script>
	export let valueVar = false;
	export let label;
	export let disabled = false;
</script>

<div class="flex items-center mt-2">
	{#if valueVar}
		<button
			{disabled}
			on:click={() => (valueVar = false)}
			class=" mr-2 bg-black border h-8 w-8 border-black"
			>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
		</button>
	{:else}
		<button {disabled} on:click={() => (valueVar = true)} class=" mr-2 border h-8 w-8 border-black"
			>-
		</button>
	{/if}
	<h1>{label}</h1>
</div>
