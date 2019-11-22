import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Home from '@/views/Home'
import Register from '@/components/auth/Register'
import Login from '@/components/auth/Login'

Vue.use(Router)

const router = new Router({

  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/rejestracja',
      component: Register,
      name: 'rejestracja',
      meta: {
        lockIfUserLogedIn: true
      }
    },
    {
      path: '/logowanie',
      component: Login,
      name: 'logowanie',
      meta: {
        lockIfUserLogedIn: true
      }
    }
  ]
})

//lock is user is logged in
router.beforeEach((to, from, next) => {
  if(to.matched.some(rec => rec.meta.lockIfUserLogedIn)){
    let user = firebase.auth().currentUser
    if(user){
      next(false)
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
