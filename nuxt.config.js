import species from './static/species.json';
import { exponentialDelay } from 'axios-retry';

export default {
  mode: 'spa',
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Refex',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ src: 'https://use.typekit.net/duq8dbh.js' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['normalize.css'],

  styleResources: {
    sass: ['~/assets/css/mixin.sass'],
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/vue-tags-input', ssr: false },
    { src: '@/plugins/plugin', mode: 'client' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: ['@nuxtjs/eslint-module'],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/style-resources',
    'nuxt-fontawesome',
    '@nuxtjs/axios',
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          //import 2 icons from set
          // please note this is PRO set in this example,
          // you must have it in your node_modules to actually import
          {
            set: '@fortawesome/pro-regular-svg-icons',
            icons: ['faSort', 'faSortUp', 'faSortDown', 'faSearch'],
          },
        ],
      },
    ],
  ],

  axios: {
    baseURL: 'http://refex2-api.bhx.jp/',
    retry: {
      retries: 3,
      retryDelay: exponentialDelay,
    },
  },
  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas'],
      },
      {
        set: '@fortawesome/pro-duotone-svg-icons',
        icons: ['faTimesCircle'],
      },
    ],
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    vendor: ['@johmun/vue-tags-input'],
  },

  generate: {
    dir: 'refex',
    routes() {
      let routes = [];
      species.species.map(specie => {
        specie.projects.forEach(project => {
          routes.push(`${specie.name}/${project}`);
        });
      });
      return routes;
      // return client.getEntries({
      //   'content_type': 'category'
      // }).then((categories) => {
      //   return [...categories.items.map(category => `/news/category/${category.sys.id}`)]
      // })
    },
  },

  router: {
    base: process.env.NODE_ENV === 'dev' ? '/' : '/dbcls/refex/',
  },
};
