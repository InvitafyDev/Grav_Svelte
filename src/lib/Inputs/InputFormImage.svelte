<script lang="ts">
	export let base64Preview: string = '';

	export let inputFile: HTMLInputElement;

	// Manejar carga desde archivo
	function onFileChange(): void {
		const file = inputFile.files?.[0];

		if (file) {
			processFile(file);
		} else {
			base64Preview = '';
		}
	}

	// Manejar imágenes pegadas
	function onPaste(event: ClipboardEvent): void {
		const items = event.clipboardData?.items;

		if (items) {
			for (let item of items) {
				if (item.type.startsWith('image/')) {
					const file = item.getAsFile();
					if (file) {
						updateInputFile(file);
						processFile(file);
					}
				}
			}
		}
	}

	// Manejar arrastrar y soltar
	function onDrop(event: DragEvent): void {
		event.preventDefault();
		const file = event.dataTransfer?.files[0];
		if (file && file.type.startsWith('image/')) {
			updateInputFile(file);
			processFile(file);
		}
	}

	// Prevenir comportamientos predeterminados para "dragover" y "drop"
	function preventDefaults(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
	}

	// Procesar archivo (generalizado para diferentes métodos)
	function processFile(file: File): void {
		const reader = new FileReader();
		reader.onload = () => {
			base64Preview = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	// Actualizar el input de archivo (simulado)
	function updateInputFile(file: File): void {
		// Crear un objeto DataTransfer para asignar el archivo al input
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);
		inputFile.files = dataTransfer.files;
	}

	// Resetear la vista previa y el input
	function reset(): void {
		base64Preview = '';
		inputFile.value = '';
	}
</script>

<div
	class="w-full p-4 border-2 border-gray-300 rounded-md bg-gray-50 focus:outline-none my-2"
	on:paste={onPaste}
	on:dragover={preventDefaults}
	on:dragenter={preventDefaults}
	on:drop={onDrop}
>
	<div>
		<!-- Input para cargar archivos -->
		<label class="block text-sm font-medium text-gray-700 mb-2 cursor-pointer" for="fileInput">
			Selecciona, arrastra o pega una imagen (Ctrl+V)
		</label>
		<input
			id="fileInput"
			bind:this={inputFile}
			type="file"
			accept="image/jpg, image/jpeg, image/png"
			on:change={onFileChange}
			class="hidden"
		/>
		<button
			type="button"
			on:click={() => inputFile.click()}
			class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100"
		>
			Cargar Imagen
		</button>
	</div>

	<!-- Vista previa de la imagen -->
	<div class="mt-4 flex flex-col items-center">
		{#if base64Preview}
			<img
				src={base64Preview}
				alt="Preview"
				class="w-full max-w-sm border border-gray-300 rounded-md"
			/>
			<button
				type="button"
				class="mt-2 px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
				on:click={reset}
			>
				Eliminar Imagen
			</button>
		{:else}
			<div
				class="w-full max-w-sm min-h-[150px] p-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-400"
				on:dragover={preventDefaults}
				on:dragenter={preventDefaults}
				on:drop={onDrop}
			>
				<h1 class=" text-center">Arrastra, pega o carga una imagen para previsualizar</h1>
			</div>
		{/if}
	</div>
</div>