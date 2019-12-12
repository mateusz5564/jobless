import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Home from '@/views/Home'
import Profile from '@/views/Profile'
import Register from '@/components/auth/Register'
import Login from '@/components/auth/Login'
import NewOffer from '@/views/employer/NewOffer'
import CV from '@/components/profile/CV'
import CVCreator from '@/components/profile/CVCreator'
import EmployerProfile from '@/views/employer/EmployerProfile'
import OfferPage from '@/views/OfferPage'
import UserProfile from '@/components/profile/UserProfile'
import UserPassword from '@/components/profile/UserPassword'
import UserEmail from '@/components/profile/UserEmail'
import UserApplications from '@/components/profile/UserApplications'
import EmployerOffers from '@/views/EmployerOffers'

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
      path: '/pracodawca/:employer_id',
      name: 'employer_profile',
      component: EmployerProfile,
      meta: {
        lockIfUserNotLogedIn: true
      }
    },
    {
      path: '/moje_oferty/:employer_id',
      name: 'moje_oferty',
      component: EmployerOffers,
      meta: {
        lockIfUserNotLogedIn: true
      }
    },
    {
      path: '/oferta_pracy/:offer_id',
      name: 'offer_page',
      component: OfferPage,
      meta: {
        lockIfUserNotLogedIn: true
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
    },
    {
      path: '/profil',
      component: Profile,
      name: 'profil',
      meta: {
        lockIfUserLogedIn: false,
        lockIfUserNotLogedIn: true
      },
      children: [
        {
          path: 'cv',
          component: CV,
          name: 'cv',
          props: true,
          meta: {
            lockIfUserLogedIn: false
          }
        },
        {
          path: 'cv-kreator',
          component: CVCreator,
          name: 'cv-kreator',
          props: true,
          meta: {
            lockIfUserLogedIn: false
          }
        },
        {
          path: 'applications',
          component: UserApplications,
          name: 'applications',
          props: true,
          meta: {
            lockIfUserLogedIn: false
          }
        },
        {
          path: 'user_profile/:user_id',
          component: UserProfile,
          name: 'user_profile'
        },
        {
          path: 'user_email',
          component: UserEmail,
          name: 'user_email'
        },
        {
          path: 'user_password',
          component: UserPassword,
          name: 'user_password'
        }
      ]
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

//lock is user IS NOT logged in
router.beforeEach((to, from, next) => {
  if(to.matched.some(rec => rec.meta.lockIfUserNotLogedIn)){
    let user = firebase.auth().currentUser
    if(!user){
      next(false)
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
