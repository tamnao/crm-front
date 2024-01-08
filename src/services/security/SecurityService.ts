import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

import LoginInfo from '@/model/security/LoginInfo';

class SecurityService {
	login(loginInfo: LoginInfo) {
		return http.post('/api/security/login', loginInfo)
			.then(res => {
				return res.data;
			})
			.catch(err => {
				return Promise.reject(err);
			});
	}


	logout() {
		return http.post('/api/security/logout')
		.then(res => {
			return res.data;
		})
		.catch(err => {
			return Promise.reject(err);
		});
	}

}

export default new SecurityService();