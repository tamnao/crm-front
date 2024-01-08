import { RouteRecordRaw } from 'vue-router'
import AdjustStatistic from '@/views/adjust/Statistic.vue'

const routes: Array<RouteRecordRaw> = [
	{         
		path: '/adjust/statistic',
		name: 'AdjustStattistic',
		component: AdjustStatistic,
	},
];

export default routes