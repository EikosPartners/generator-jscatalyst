import Vue from 'vue'
import App from './App.vue'
{{import_vuex}}
{{import_vuetify}}
{{import_themeing_plugin}}

import 'jscatalyst/dist/jscatalyst.min.css'

{{vue_use_vuex}}

{{create_store}}
{{vue_use_vuetify}}
{{vue_use_themeing_plugin}}
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  {{vue_config_store}}
}).$mount('#app')
