import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class AdminRoleService {
	findAllRoleSelectList() {
		return http.get('/api/admin/user/role/select-list')
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '권한 목록을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	findAllAdminUserRole(params:any) {
		return http.get('/api/admin/user/admin-user-role', {
			params: {
				roleId: params.roleId,
				userId: params.userId,
				isPaging: params.isPaging,
				length: params.length,
				pageNumber: params.pageNumber
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '관리자 목록을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	createAdminUserRole(params:any) {
		return http.post('/api/admin/user/admin-user-role', params)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '권한 그룹을 생성하는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	findAllRole(params:any) {
		return http.get('/api/admin/user/role', {
			params: {
				name: params.roleName,
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '권한 그룹 목록을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	findAllMenus() {
		return http.get('/api/admin/user/role/menu/')
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '메뉴 목록을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	findAllMenusByRoleId(roleId:any) {
		return http.get('/api/admin/user/role/menu/' + roleId)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '권한 그룹의 메뉴 목록을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	createRole(params:any) {
		return http.post('/api/admin/user/role', params)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '권한 그룹을 생성하는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	updateRole(params:any) {
		return http.post('/api/admin/user/role/' + params.id, params)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '권한 그룹을 수정하는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}
}

export default new AdminRoleService();