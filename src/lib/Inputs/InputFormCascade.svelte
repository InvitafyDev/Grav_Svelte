<script>
	import { onMount } from 'svelte';
    import InputFormSelect from './InputFormSelect.svelte';

	export let levels = []; // [{ label, fetchFn, default, field }]
	// Cargar datos iniciales para el primer nivel
	let varS = false;
	let fetchFnCloned = [];
	export let selectedValues = {};
	onMount(() => {
		varS = false;
		levels.forEach((item) => {
			fetchFnCloned.push({ fetchFn: item.fetchFn });
			selectedValues[item.field] = item.default?.value;
		});
		varS = true;
	});

	let cacheResults = {};
	// Función para actualizar valores y cargar el siguiente nivel
	let ultimoIndexActualizado = 0;
	function handleChange(index, value, field) {
		levels[index].default = value;
		for (let i = index + 1; i < levels.length; i++) {
			levels[i].default = null;
			selectedValues[levels[i].field] = null;
		}
		selectedValues[field] = value?.value;
		ultimoIndexActualizado = index;

		console.log(cacheResults);
	}
</script>

{#if varS}
	{#each levels as level, i}
		{#if i == 0}
			{#await fetchFnCloned[0].fetchFn()}
				cargando {level.label}...
			{:then res}
				<InputFormSelect
					value={level?.default}
					label={level.label}
					{res}
					changeFunction={(e) => handleChange(0, e.detail, level.field)}
					onClear={() => handleChange(0, null, level.field)}
				/>
			{/await}
		{/if}

		{#if i > 0}
			{#if levels[i - 1]?.default?.value}
				{#await ultimoIndexActualizado >= i ? cacheResults[i] : fetchFnCloned[i].fetchFn(levels[i - 1]?.default?.value)}
					cargando {level.label}...
				{:then res}
					<div class=" hidden">
						{(cacheResults[i] = res)}
					</div>
					<InputFormSelect
						value={level?.default}
						label={level.label}
						{res}
						changeFunction={(e) => handleChange(i, e.detail, level.field)}
						onClear={() => handleChange(i, null, level.field)}
					/>
				{/await}
			{:else}
				<h1>Selecciona {level.label}</h1>
			{/if}
		{/if}
	{/each}
{/if}
