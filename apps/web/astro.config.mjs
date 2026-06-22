// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
	site: 'http://localhost:4321',
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'vite/internal': new URL(
					'src/stubs/vite-internal.js',
					import.meta.url,
				).pathname,
			},
		},
		optimizeDeps: {
			exclude: [
				'@vitejs/plugin-react',
				'@tailwindcss/oxide',
				'@tailwindcss/oxide-linux-x64-gnu',
				'@tailwindcss/oxide-linux-x64-musl',
			],
		},
	},

	integrations: [react()],
})
