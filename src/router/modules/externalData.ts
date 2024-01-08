import { RouteRecordRaw } from 'vue-router'
import DataRegionsales from '@/views/external/CardSalesRegion.vue'
import DataRelation from '@/views/external/SalesFloatingPopulation.vue';
import DataType from '@/views/external/PosRestaurantType.vue';

const routes: Array<RouteRecordRaw> = [
	{         
		path: '/external-data/sales-floating-population',
		name: 'ExternalDataSalesFloatingPopulation',
		component: DataRelation,
	},
    {         
		path: '/external-data/card-sales-region',
		name: 'ExternalDataCardSalesRegion',
		component: DataRegionsales,
	},
    {         
		path: '/external-data/pos-restaurant-type',
		name: 'ExternalDataPosRestaurantType',
		component: DataType,
	},
];

export default routes