const { defineConfig } = require('cypress');

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'nuxt',
      bundler: 'webpack',
    },
  },

  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        // `args` is an array of all the arguments that will
        // be passed to browsers when it launches
        launchOptions.args.push('--window-size=1920,1080');

        if (browser.family === 'chromium' && browser.name !== 'electron') {
          // auto open devtools
          launchOptions.args.push('--auto-open-devtools-for-tabs');
        }

        if (browser.family === 'firefox') {
          // auto open devtools
          launchOptions.args.push('-devtools');
        }

        // whatever you return here becomes the launchOptions
        return launchOptions;
      });
    },
  },
});
