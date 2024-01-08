import { RouteRecordRaw } from 'vue-router'
import AdminAuthorityRole from '@/views/admin/authority/Role.vue'
import AdminAuthorityUserRole from '@/views/admin/authority/UserRole.vue'
import SystemSurvey from '@/views/admin/system/Survey.vue'
import SystemSurveyResult from '@/views/admin/system/SurveyResult.vue'

const routes: Array<RouteRecordRaw> = [
	{         
		path: '/admin/authority/user-role',
		name: 'AdminAuthorityUserRole',
		component: AdminAuthorityUserRole,
	},
    {         
		path: '/admin/authority/role',
		name: 'AdminAuthorityRole',
		component: AdminAuthorityRole,
	},
    {         
		path: '/admin/survey',
		name: 'SystemSurvey',
		component: SystemSurvey,
	},
    {         
		path: '/admin/survey/result',
		name: 'SystemSurveyResult',
		component: SystemSurveyResult,
	},
];

export default routes