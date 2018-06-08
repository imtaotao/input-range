import Vue from 'vue';
const Slide = require('../lib/vue/index.vue');

export function v_init () {
  new Vue({
    el: '#app',
    template: '<Slide/>',
    components: { Slide },
  })
}
