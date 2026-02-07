import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		host: '0.0.0.0', // Permite acceso desde la red local
		port: 5173, // Puerto por defecto de Vite
		strictPort: false // Permite usar otro puerto si 5173 está ocupado
	},
	optimizeDeps: {
		include: ['svelte-floating-ui'],
		exclude: ['sweetalert2', 'xlsx']
	},
	ssr: {
		noExternal: ['svelte-floating-ui']
	}
});
