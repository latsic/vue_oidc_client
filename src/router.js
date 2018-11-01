import Vue from 'vue';
import Router from 'vue-router';
import Credentials from './views/Credentials';
import Register from './views/Register';
import RegisterSuccessfull from './views/RegisterSuccessfull';
import IdApi1 from './views/IdApi1';
import LoginRegisterInfo from '@/views/LoginRegisterInfo';
import { UserManager } from '@/backend/idserver/UserManager';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/index.html', redirect: { name: 'info' }
    },
    {
      path: '/', redirect: { name: 'info'}
    },
    {
      path: '/info',
      name: 'info',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "info" */ './views/Info.vue')
    },
    {
      path: '/credentials',
      name: 'credentials',
      component: Credentials,
      props: true
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/registersuccessfull',
      name: 'registersuccessfull',
      component: RegisterSuccessfull,
      props: true,
    },
    {
      path: '/idapi1',
      name: 'idapi1',
      component: IdApi1,
    },
    {
      path: '/loginregisterinfo',
      name: 'loginregisterinfo',
      component: LoginRegisterInfo
    }
  ]
});


router.beforeEach((to, from, next) => {
  if(to.name == 'credentials' || to.name == 'idapi1') {
    UserManager.instance.isUserSignedInAsync()
    .then(isSignedIn => {
      if(!isSignedIn) {
        return next({ name: 'loginregisterinfo'})
      }
      return next(isSignedIn);
    });
  }
  else {
    next();
  }
})

export default router;
