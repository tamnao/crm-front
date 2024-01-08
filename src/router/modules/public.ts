import { RouteRecordRaw } from 'vue-router'
import UserSurveyRespond from '@/views/public/UserSurveyRespond.vue'
import SurveyRespondComplete from '@/views/public/SurveyRespondComplete.vue'

const routes: Array<RouteRecordRaw> = [
	{         
		path: '/public/survey/respond',
		name: 'UserSurveyRespond',
		component: UserSurveyRespond,
		props: true,
	},
	{         
		path: '/public/survey/respondComplete',
		name: 'SurveyRespondComplete',
		component: SurveyRespondComplete,
		props: true,
	},
];

export default routes