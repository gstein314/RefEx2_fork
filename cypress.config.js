const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "nuxt",
      bundler: "webpack",
    },
  },

  e2e: {
    baseUrl: 'http://localhost:8484',
  },
});
