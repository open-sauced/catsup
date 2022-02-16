module.exports = {
  plugins: [
    "jest"
  ],
  extends: [
    "airbnb-base/legacy",
    "airbnb-base/whitespace",
  ],
  env: {
    browser: true,
    serviceworker: true,
    es2021: true,
    "jest/globals": true
  },
  globals: {
    // secrets
    APP_ID: "readonly",
    APP_PK: "readonly",
    CLIENT_ID: "readonly",
    CLIENT_SECRET: "readonly",
    WEBHOOK_SECRET: "readonly",
    DISCORD_URL: "readonly",
  },
  parserOptions: {
    ecmaVersion: 13,
    ecmaFeatures: {
      impliedStrict: true
    },
    sourceType: "module",
    allowImportExportEverywhere: false
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'worker/',
  ],
  rules: {
    "no-console": 0,
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "no-restricted-syntax": 0,
    "no-restricted-globals": 0,
    camelcase: [2, {
      allow: [
        "avatar_url"
      ],
    }]
  }
};
