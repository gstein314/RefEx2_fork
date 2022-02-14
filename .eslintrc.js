module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['plugin:nuxt/recommended', 'plugin:vue/recommended', 'prettier'],
  plugins: ['import', 'vue', 'prettier'],
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
  },
};
