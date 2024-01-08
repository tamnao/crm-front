import { RouteRecordRaw } from 'vue-router'
import MarketingBestCustomerPattern from '@/views/marketing/BestCustomerPattern.vue'
import MarketingBestCustomerRecommend from '@/views/marketing/BestCustomerRecommend.vue'
import MarketingBestCustomer from '@/views/marketing/BestCustomer.vue'

const routes: Array<RouteRecordRaw> = [
	{         
		path: '/marketing/best-customer',
		name: 'MarketingBestCustomer',
		component: MarketingBestCustomer,
	},
    {         
		path: '/marketing/best-customer-pattern',
		name: 'MarketingBestCustomerPattern',
		component: MarketingBestCustomerPattern,
	},
    {         
		path: '/marketing/best-customer-recommend',
		name: 'MarketingBestCustomerRecommend',
		component: MarketingBestCustomerRecommend,
	},
];

export default routes