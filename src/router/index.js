import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Register from '@/components/auth/Register.vue'
// import Navbar from '@/components/Navbar.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/rejestracja',
    component: Register,
    name: 'rejestracja'
    // children: [
    //   { path: 'rejestracja', component: Register, name: 'rejestracja'}
    // ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
