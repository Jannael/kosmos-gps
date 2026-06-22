import js from '@eslint/js'
import typescriptEslint from 'typescript-eslint'
import eslintPluginAstro from 'eslint-plugin-astro'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

/** @type {import('eslint').Linter.Config[]} */
const tsConfigs = typescriptEslint.configs.recommended.map((config) => ({
	...config,
	files: ['**/*.ts', '**/*.tsx'],
}))

export default [
	{ ignores: ['**/dist/**', '**/node_modules/**', '**/build/**', '**/.astro/**'] },
	js.configs.recommended,
	...tsConfigs,
	...eslintPluginAstro.configs.recommended,
	{
		files: ['**/*.astro'],
		languageOptions: {
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	},
	{
		files: ['**/*.tsx', '**/*.jsx'],
		plugins: { react, 'react-hooks': reactHooks },
		languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		settings: { react: { version: '19.0' } },
	},
]
