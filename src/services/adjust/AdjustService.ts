import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class AdjustService {

	adjustAmountMonthlyThisLastYear() { 
		return http
			.get('/api/common/adjust/monthly-stat-this-last-year')
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '전녀대비 월별 정산금액 추이을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	adjustMonthlyThisYear() { 
		return http
			.get('/api/common/adjust/monthly-stat-this-year')
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '월별 금액 변동 추이를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	adjustWeekly(param:any) { 
		return http
			.get('/api/common/adjust/weekly', {
				params: {
					year: param.year,
					month: param.month,
					startDate: param.startDate,
					endDate: param.endDate,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '주간 정산 목록을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	adjustMonthly(param:any) { 
		return http
			.get('/api/common/adjust/monthly', {
				params: {
					year: param.year,
					month: param.month,
					startDate: param.startDate,
					endDate: param.endDate,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '월 장산 목록을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

}

export default new AdjustService();


