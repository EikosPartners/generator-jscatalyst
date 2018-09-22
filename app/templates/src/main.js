import Vue from 'vue'
import App from './App.vue'
{{ import_vuetify }}
{{ import_themeing_plugin }}
{{ import_store }} 

import 'jscatalyst/dist/jscatalyst.min.css'

{{ vue_use_vuetify }}
{{ vue_use_themeing_plugin }}
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
  {{ vue_config_store }}
}).$mount('#app')
