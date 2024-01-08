import { RouteRecordRaw } from 'vue-router'
import ReportPurchase from '@/views/report/SalesStatisticProduct.vue'
import ReportRegionsales from '@/views/report/SalesStatisticStoreRegion.vue'

const routes: Array<RouteRecordRaw> = [
	{         
		path: '/report/sales-statistic-store-region',
		name: 'ReportSalesStatisticStoreRegion',
		component: ReportRegionsales,
	},
    {         
		path: '/report/sales-statistic-product',
		name: 'ReportSalesStatisticProduct',
		component: ReportPurchase,
	},
];

export default routes