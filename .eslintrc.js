module.exports = {
  extends: [
    "standard",
    "plugin:react/recommended",
  ],
  plugins: [
  ],
  rules: {
    camelcase: ["off"],
    "comma-dangle": ["error", "always-multiline"],
    "space-before-function-paren": [
      "error",
      { "anonymous": "never", "named": "never", "asyncArrow": "always" }
    ]
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
        jsx: true,
        modules: true
    }
  },
  settings: {
    react: {
      version: "16.8.1"
    }
  },
  env: {
    browser: true,
  }
}
