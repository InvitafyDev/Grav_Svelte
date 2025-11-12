<script>
  import "../typography.css";
  import { onMount } from "svelte";
  import InputFormSelect from "./InputFormSelect.svelte";

  export let levels = []; // [{ label, fetchFn, default, field, showPlusIcon?, onPlusClick? }]
  // Cargar datos iniciales para el primer nivel
  let varS = false;
  let fetchFnCloned = [];
  export let selectedValues = {};

  onMount(async () => {
    varS = false;

    // Clonar las funciones fetch
    levels.forEach((item) => {
      fetchFnCloned.push({ fetchFn: item.fetchFn });
    });

    // Si hay valores iniciales, cargar y establecer los objetos Select completos
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      const initialValue = selectedValues[level.field];

      if (initialValue) {
        // Cargar las opciones para este nivel
        let options = [];
        if (i === 0) {
          options = await fetchFnCloned[i].fetchFn();
        } else {
          // Para niveles subsecuentes, necesitamos el valor del nivel anterior
          const parentValue = selectedValues[levels[i - 1].field];
          if (parentValue) {
            options = await fetchFnCloned[i].fetchFn(parentValue);
          }
        }

        // Buscar el objeto Select que coincida con el valor inicial
        const selectedOption = options.find((opt) => opt.value == initialValue);
        if (selectedOption) {
          levels[i].default = selectedOption;
          cacheResults[i] = options; // Cachear los resultados
        }
      } else {
        selectedValues[level.field] = level.default?.value;
      }
    }

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
        <p class="loading-message">Cargando {level.label}...</p>
      {:then res}
        <InputFormSelect
          value={level?.default}
          label={level.label}
          {res}
          changeFunction={(e) => handleChange(0, e.detail, level.field)}
          onClear={() => handleChange(0, null, level.field)}
          showPlusIcon={level.showPlusIcon ?? false}
          onPlusClick={level.onPlusClick ?? (() => {})}
        />
      {/await}
    {/if}

    {#if i > 0}
      {#if levels[i - 1]?.default?.value}
        {#await ultimoIndexActualizado >= i ? cacheResults[i] : fetchFnCloned[i].fetchFn(levels[i - 1]?.default?.value)}
          <p class="loading-message">Cargando {level.label}...</p>
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
            showPlusIcon={level.showPlusIcon ?? false}
            onPlusClick={level.onPlusClick ?? (() => {})}
          />
        {/await}
      {:else}
        <p class="select-message">Selecciona {level.label}</p>
      {/if}
    {/if}
  {/each}
{/if}

<style>
  .loading-message,
  .select-message {
    color: var(--grav-crud-color-neutral);
    font-size: 0.875rem;
    margin: 0.5rem 0;
  }
</style>
