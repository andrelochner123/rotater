import Vue from 'vue'
import App from './App.vue'
import Rotator from './../../Rotator.js';

Vue.config.productionTip = false
Vue.prototype.$Rotator = Rotator;

new Vue({
    render: function (h) { return h(App) },
}).$mount('#app')
