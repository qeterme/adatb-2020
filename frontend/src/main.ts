
import './../node_modules/bulma/css/bulma.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueProgressBar from "vue-progressbar"
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFileExcel, faPencilAlt, faPlus, faPrint, faSignOutAlt, faTrashAlt, faUserAstronaut } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VeeValidate from 'vee-validate'
import http from './http-common'
import AuthService from '@/services/AuthService'
import moment from 'moment'

library.add(faPlus, faTrashAlt, faUserAstronaut, faSignOutAlt, faFileExcel, faPencilAlt, faPrint)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueProgressBar, {
  color: "#40b883",
  failedColor: "red",
  thickness: "3px"
})

Vue.config.productionTip = false

Vue.prototype.$http = http;
http.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.log(error.response.status);
  if (error.response.status == 401) {
    AuthService.logout();
    router.push({ name: 'Bejelentkezés' })
  } else if (error.response.status == 403) {
    router.push({ name: '403' });
  }
});

Vue.use(VeeValidate, {
  events: 'change'
})

Vue.filter('formatDate', function(value:any) {
  if (value) {
    moment.locale('hu');
    return moment(String(value)).format('LLLL:s');
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
