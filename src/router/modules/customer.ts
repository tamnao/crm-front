import { RouteRecordRaw } from 'vue-router'
import CustomerGeneral from '@/views/customer/General.vue'
import CustomerStoppedPurchase from '@/views/customer/StoppedPurchase.vue'
import CustomerRepurchase from '@/views/customer/Repurchase.vue'
import CustomerSocialContributePoint from '@/views/customer/SocialContributePoint.vue'

const routes: Array<RouteRecordRaw> = [
	{         
		path: '/customer/general',
		name: 'CustomerGeneral',
		component: CustomerGeneral,
	},
	{         
		path: '/customer/stop-purchase',
		name: 'CustomerStoppedPurchase',
		component: CustomerStoppedPurchase,
	},
    {         
		path: '/customer/repurchase',
		name: 'CustomerRepurchase',
		component: CustomerRepurchase,
	},
    {         
		path: '/customer/social-contribute-point',
		name: 'CustomerSocialContributePoint',
		component: CustomerSocialContributePoint,
	},
];

export default routes