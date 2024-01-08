import { RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Dashboard from '@/views/main/Dashboard.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: Dashboard
	},
	{
		path: '/index.html',
		name: 'Index',
		component: Dashboard
	},
    {
		path: '/dashboard',
		name: 'Dashboard',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import('@/views/main/Dashboard.vue')
	},
]

export default routes