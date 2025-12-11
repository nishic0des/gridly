import next from "@next/eslint-plugin-next";
import js from "@eslint/js";

export default [
	js.configs.recommended,
	{
		plugins: {
			"@next/next": next,
		},
		rules: {
			// Add any custom rules here
			...next.configs.recommended.rules,
		},
	},
];
