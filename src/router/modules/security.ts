import { RouteRecordRaw } from 'vue-router'
import Login from '@/views/security/Login.vue'

const routes: Array<RouteRecordRaw> = [
    {         
		path: '/security/login',
		name: 'Login',
		component: Login,
	}
];

export default routes
