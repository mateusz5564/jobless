import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Home from '@/views/Home'
import Register from '@/components/auth/Register'
import Login from '@/components/auth/Login'
import NewOffer from '@/views/NewOffer'
import { networkInterfaces } from 'os';

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
    },
    {
      path: '/dodaj_oferte',
      component: NewOffer,
      name: 'dodaj_oferte',
      beforeEnter: (to, from, next) => {
        let user = firebase.auth().currentUser
        if(user){
          user.getIdTokenResult().then((token) => {
            if(token.claims.employer){
              next()
            } else {
              console.log("You are not an employer")
              next(false)
            }
          })
        } else {
          console.log("You are not logged in")
          next(false)
        }
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
