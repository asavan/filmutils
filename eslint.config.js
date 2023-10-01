import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        rules: {
            semi: ["error", "always"],
            "indent": [
                "error",
                4
            ],
            "linebreak-style": [
                "warn",
                "windows"
            ],
            "quotes": [
                "error",
                "double"
            ]
        }
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        ignores: ["old/*"]
    }
];
