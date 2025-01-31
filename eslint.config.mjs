import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
// import prettier from "eslint-plugin-prettier";
import _import from "eslint-plugin-import";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import parser from "markdown-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["certs/**/*"],
}, ...fixupConfigRules(compat.extends(
    // "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
)), {
    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        // prettier,
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.mocha,
            ...globals.commonjs,
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 12,
        sourceType: "module",
    },

    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },

        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: "./tsconfig.json",
            },
        },
    },

    rules: {
        // "prettier/prettier": "error",

        "import/no-unresolved": ["error", {
            commonjs: true,
            ignore: ["^#"],
        }],

        "import/order": ["error", {
            pathGroups: [{
                pattern: "#*/**",
                group: "external",
            }, {
                pattern: "#*",
                group: "external",
            }],

            alphabetize: {
                order: "asc",
            },
        }],

        "no-empty": "warn",
        "no-ex-assign": "off",
        "no-else-return": "error",
        "no-shadow": "off",
        "no-console": "error",
        "prefer-destructuring": "error",
        "prefer-const": "error",
        "object-shorthand": "error",
        "consistent-return": "error",
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-empty-function": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            args: "none",
            argsIgnorePattern: "^(_|log)",
            varsIgnorePattern: "^(_|log)",
            destructuredArrayIgnorePattern: "^(_|log)",
        }],
    },
}, {
    files: ["**/*.md"],

    languageOptions: {
        parser: parser,
    },

    rules: {
        // "prettier/prettier": ["error", {
        //     parser: "markdown",
        // }],
    },
    
},
{
    ignores: ["node_modules/**/*", "dist/**/*", "eslint.config.mjs"]
}];