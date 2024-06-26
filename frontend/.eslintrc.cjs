module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["plugin:react/recommended", "airbnb"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        "import/prefer-default-export": "off",
        semi: ["error", "never"],
        quotes: ["error", "double"],
        curly: ["error", "all"],
        "lines-between-class-members": [
            "error",
            "always",
            { exceptAfterSingleLine: true },
        ],
        indent: ["warn", 4],
        "import/extensions": 0,
        "react/function-component-definition": 0,
        "react/jsx-filename-extension": [2, { extensions: [".jsx", ".tsx"] }],
        "import/no-unresolved": 0,
        "react/react-in-jsx-scope": 0,
        "react/jsx-indent": [2, 4],
        "react/jsx-indent-props": [2, 4],
        "react/require-default-props": 0,
        "react/prop-types": 0,
        "max-len": ["warn", 180],
        "linebreak-style": 0,
        camelcase: 0,
        "no-unused-vars": "warn",
        "no-unused-expressions": "warn",
        "react/jsx-props-no-spreading": "off",
        "no-console": process.env.NODE_ENV === "production"
            ? "warn"
            : "off",
    },
    overrides: [
        {
            files: ["*.ts?(x)"],
            rules: {
                "jsx-a11y/label-has-associated-control": [
                    "error",
                    {
                        required: {
                            some: ["nesting", "id"],
                        },
                    },
                ],
                "jsx-a11y/label-has-for": [
                    "error",
                    {
                        required: {
                            some: ["nesting", "id"],
                        },
                    },
                ],
                "no-unused-vars": "off",
                "no-use-before-define": "off",
                "@typescript-eslint/no-use-before-define": "error",
                "no-undef": "off",
                "no-shadow": "off",
                "@typescript-eslint/no-shadow": "error",
                semi: ["error", "never"],
                "@typescript-eslint/no-unused-vars": "warn",
            },
        },
        {
            files: "src/setupTests.ts",
            rules: {
                "import/no-extraneous-dependencies": 0,
            },
        },
    ],
}
