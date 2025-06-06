<script lang="ts">
	export let valueVar: string | null = null;
	export let label: string;
	export let disabled = false;
	export let obligatory = false;
</script>

<div class="relative z-0 mt-6">
	<input
		{disabled}
		name={valueVar}
		id={valueVar}
		type="datetime-local"
		bind:value={valueVar}
		class="block px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
	/>
	<label
		for={valueVar}
		class="absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-2.5 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
	>
		{label} {#if obligatory}
			<span class="text-red-600"> *</span>
		{/if}
	</label>
</div>
