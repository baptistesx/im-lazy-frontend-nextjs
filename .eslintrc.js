module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ["next", "prettier", "eslint:recommended", "react-app"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["react", "@typescript-eslint", "unused-imports", "prettier"],
	rules: {
		"react/no-unescaped-entities": 0,
		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"error",
			{
				vars: "all",
				varsIgnorePattern: "^_",
				args: "after-used",
				argsIgnorePattern: "^_",
			},
		],
		"@typescript-eslint/explicit-function-return-type": "error",
		"@typescript-eslint/no-explicit-any": "error",
		"no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
	},
};
