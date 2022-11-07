import Vue from 'vue';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { fat } from '@fortawesome/pro-thin-svg-icons';
import { fad } from '@fortawesome/pro-duotone-svg-icons';

config.autoAddCss = false;

library.add(fas, far, fal, fat, fad);

Vue.component('FontAwesomeIcon', FontAwesomeIcon);
