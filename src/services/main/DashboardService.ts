import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class DashboardService {

	totalSaleAmount() { 
		return http
			.get('/api/common/dashboard/total-sales-amount')
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '총 매출액을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	monthlySalesAmountChart() { 
		return http
			.get('/api/common/dashboard/monthly-sales-amount-chart')
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '월별 매출액을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	weeklySalesAmountCategory() { 
		return http
			.get('/api/common/dashboard/weekly-sales-amount-category')
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '주간 매출 비교를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			}); 
	}

	sidoSalesAmount() { 
		return http
			.get('/api/common/dashboard/sido-sales-amount')
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '매출 지역 분포를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			}); 
	}

	topStoreSalesAmount(param:any) { 
		return http
			.get('/api/common/dashboard/top-store-sales-amount', {
				params: {
					year: param.year,
					month: param.month,
					categories: param.categories + ''
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '매출 순위를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			}); 
	}

	userStatistic() { 
		return http
			.get('/api/common/dashboard/user-statistic')
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '총 회원수, 고객수를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			}); 
	}

	storeStatistic() { 
		return http
			.get('/api/common/dashboard/store-statistic')
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '총 업체 수, 승인 업체 수를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			}); 
	}

}

export default new DashboardService();


