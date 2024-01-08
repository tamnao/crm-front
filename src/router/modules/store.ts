import { RouteRecordRaw } from 'vue-router'
import SalesStatistic from '@/views/store/SalesStatistic.vue'
import Statistic from '@/views/store/Statistic.vue'

const routes: Array<RouteRecordRaw> = [
	{         
		path: '/store/statistic',
		name: 'Statistic',
		component: Statistic,
	},
    {         
		path: '/store/sales-statistic',
		name: 'StoreStatisticSales',
		component: SalesStatistic,
	},
];

export default routes