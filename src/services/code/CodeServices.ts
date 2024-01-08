import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class CodeService {
	selectListByParentCode(code:string) { 
		return http
			.get('/api/common/code/find-select-list-parent-code/' + code)
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '코드를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}
}

export default new CodeService();


