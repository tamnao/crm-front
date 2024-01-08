import { createRouter, createWebHistory } from 'vue-router'
import main from './modules/main'
import security from './modules/security'
import customer from './modules/customer'
import adjust from './modules/adjust'
import sales from './modules/sales'
import externalData from './modules/externalData'
import store from './modules/store'
import report from './modules/report'
import marketing from './modules/marketing'
import admin from './modules/admin'
import publics from './modules/public'
import TokenUtils from '@/utils/TokenUtils'

const routes = main.concat(security, customer, adjust, sales, externalData, store, report, marketing, admin, publics)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
	TokenUtils.clearIsReissuing();
    if(TokenUtils.getAccessToken().length != 0 || to.fullPath === '/security/login' || to.fullPath.startsWith('/public/survey/respond')) {
        next();
    } else {
		next({ name: 'Login' });
        
    }
})

export default router
