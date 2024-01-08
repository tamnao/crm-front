import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class BestCustomerService {
		//-----start marketing - best customer API (BestCustomer.vue) -------//

		bestCustomer(param:any) { 
			return http
				.get('/api/common/best-customer', {
					params: {
						isPaging: param.isPaging,
						pageNumber: param.pageNumber,
						year: param.year,
						month: param.month,
					}
				})
				.then(res => {
					return res.data;
				})
				.catch(err => {
					commonDialog.showErrorHtml(err, '우수 고객을 읽는 중 에러가 발생했습니다.');
					return Promise.reject(err);
				});
		}
	
	
		excelBestCustomer(param:any) { 
			return http
				.get('/api/common/best-customer/excel', {
					params: {
						year: param.year,
						month: param.month,
					}
				})
				.then(res => {
					return res.data;
				})
				.catch(err => {
					commonDialog.showErrorHtml(err, '우수 고객을 읽는 중 에러가 발생했습니다.');
					return Promise.reject(err);
				});
		}
	
		createBestCustomer(candidateId:number, userId:string) { 
			return http
				.post('/api/common/best-customer/' + candidateId + "/" + userId)
				.then(res => {
					return res.data;
				})
				.catch(err => {
					commonDialog.showErrorHtml(err, '우수 고객을 등록하는 중 에러가 발생했습니다.');
					return Promise.reject(err);
				});
		}
	
		expireBestCustomer(id:number, userId:string) { 
			return http
				.post('/api/common/best-customer/expire/' + id + "/" + userId)
				.then(res => {
					return res.data;
				})
				.catch(err => {
					commonDialog.showErrorHtml(err, '우수 고객을 해지하는 중 에러가 발생했습니다.');
					return Promise.reject(err);
				});
		}
	
		//-----end marketing - best customer API (BestCustomer.vue) -------//
	
		//-----start marketing - best customer pattern API (BestCustomerPattern.vue) -------//
	
		getPurchasePattern(param:any) { 
			return http
				.get('/api/common/best-customer/purchase-pattern', {
					params: {
						isPaging: param.isPaging,
						pageNumber: param.pageNumber,
						categories: param.categories + '',
						userName: param.userName,
					}
				})
				.then(res => {
					return res.data;
				})
				.catch(err => {
					commonDialog.showErrorHtml(err, '우수 고객 구매 패턴을 읽는 중 에러가 발생했습니다.');
					return Promise.reject(err);
				});
		}
	
		//-----end marketing - best customer pattern API (BestCustomerPattern.vue) -------//
}


export default new BestCustomerService();
