module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    'cypress/globals': true,
  },
  extends: [
    'plugin:nuxt/recommended',
    'plugin:vue/recommended',
    'prettier',
    'plugin:cypress/recommended',
  ],
  plugins: ['import', 'vue', 'prettier', 'cypress'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': [
      'warn',
      {
        bracketSpacing: true,
        semi: true,
        singleQuote: true,
        arrowParens: 'avoid',
        vueIndentScriptAndStyle: true,
      },
    ],
    'cypress/no-assigning-return-values': 'error',
    'cypress/no-unnecessary-waiting': 'error',
    'cypress/assertion-before-screenshot': 'warn',
    'cypress/no-force': 'warn',
    'cypress/no-async-tests': 'error',
    'cypress/no-pause': 'error',
  },
};
