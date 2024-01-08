import http from '@/utils/HttpClient';
import commonDialog from '../dialog/CommonDialog';

class RecommendProductService {
	getSendMethod() { 
		return http
			.get('/api/common/recommend-product/sms-email/send-method')
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '전송 방식을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	getGroupCode() { 
		return http
			.get('/api/common/recommend-product/sms-email/group-code')
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '발송대상 목록을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	sendRecommendProduct(form:any) {
		return http
		.post('/api/common/recommend-product/sms-email', form)
		.then(res => {
			return res;
		})
		.catch(err => {
			commonDialog.showErrorHtml(err, '상품추천(문자/이메일)을 전송하는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}
	
}

export default new RecommendProductService();