import { RouteRecordRaw } from 'vue-router'
import SalesAmountProductGrowth from '@/views/sales/SalesAmountProductGrowth.vue'
import SalesCustomStatistic from '@/views/sales/CustomStatistic.vue'
import SalesAmountSido from '@/views/sales/SalesAmountSido.vue'
import TrendAnalysisProduct from '@/views/sales/TrendAnalysisProduct.vue'
import ProductInquiry from '@/views/sales/ProductInquiry.vue'
import SalesAmountCategory from '@/views/sales/SalesAmountCategory.vue'

const routes: Array<RouteRecordRaw> = [
	{         
		path: '/sales/sales-amount-product-growth',
		name: 'SalesAmountProductGrowth',
		component: SalesAmountProductGrowth,
	},
    {         
		path: '/sales/sales-amount-category',
		name: 'SalesAmountCategory',
		component: SalesAmountCategory,
	},
    {         
		path: '/sales/sales-amount-sido',
		name: 'SalesAmountSido',
		component: SalesAmountSido,
	},
    {         
		path: '/sales/trend-analysis-product',
		name: 'TrendAnalysisProduct',
		component: TrendAnalysisProduct,
	},
    {         
		path: '/sales/product-inquiry',
		name: 'ProductInquiry',
		component: ProductInquiry,
	},
    {         
		path: '/sales/custom-statistic',
		name: 'SalesCustomStatistic',
		component: SalesCustomStatistic,
	},

];

export default routes