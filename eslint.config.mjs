import js from "@eslint/js";
import globals from "globals";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
			},
		},
		rules: {
			"no-undef": "error",
			"no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
		},
	},
	{
		files: ["**/*.js", "**/*.jsx"],
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	},
	{
		files: ["**/*.js", "**/*.jsx"],
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			"no-unused-vars": [
				"error",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
					ignoreRestSiblings: true,
					caughtErrors: "none",
				},
			],
			"react/jsx-uses-vars": "error",
			"react/jsx-uses-react": "error",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
];
