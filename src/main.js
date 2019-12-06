import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'



//init Vue instance only once
let app = null
// wait for firebae auth
firebase.auth().onAuthStateChanged(user => {
// reinitialize Vue instance only at the beggining or on refresh the app

  if(!app){
    app = new Vue({
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})

