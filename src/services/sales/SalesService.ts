import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class SalesService {
	getSalesProductAmount(param:any) { 
		return http
			.get('/api/common/sales/product-amount', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					categories: param.categories + '',
					startDate: param.startDate,
					endDate: param.endDate,
					storeName: param.storeName,
					productName: param.productName
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '상품 매출 증감량 목록을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	salesProductExcelExport(param:any) { 
		return http
			.get('/api/common/sales/product-amount-excel', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					categories: param.categories + '',
					startDate: param.startDate,
					endDate: param.endDate,
					storeName: param.storeName,
					productName: param.productName
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '상품 매출 증감량 목록을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	getSalesCategorySelectdLastMonthYear(param:any) { 
		return http
			.get('/api/common/sales/category-selected-last-month-year', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					categories: param.categories + '',
					startDate: param.startDate,
					endDate: param.endDate,
					storeName: param.storeName,
					productName: param.productName
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '상품 매출 증감량 현황을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	getSalesProductTrend(param:any) { 
		return http
			.get('/api/common/sales/product-trend', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					categories: param.categories + '',
					year: param.year,
					month: param.month,
					storeName: param.storeName,
					productName: param.productName
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '상품별 추이 분석 데이터를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	getSalesSidoAmount(param:any) { 
		return http
			.get('/api/common/sales/category-sido', {
				params: {
					categories: param.categories + '',
					year: param.year,
					month: param.month,
					sidos: param.sidos + '',
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '거주지별 구매 분석 데이터를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	getSalesProductInquiry(param:any) { 
		return http
			.get('/api/common/sales/product-inquiry', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					categories: param.categories + '',
					year: param.year,
					month: param.month,
					storeName: param.storeName,
					productName: param.productName,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '상품별 문의 내역을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}
	
	getSalesCategoryAmount(param:any) { 
		return http
			.get('/api/common/sales/category-amount', {
				params: {
					categories: param.categories + '',
					year: param.year,
					month: param.month,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '카테고리별 매출 현황을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	getSalesCategorySelectedLastYear(param:any) { 
		return http
			.get('/api/common/sales/category-selected-last-year', {
				params: {
					categories: param.categories + '',
					year: param.year,
					month: param.month,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '카테고리별 매출 목록을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	getCustomStatistic(param:any) { 
		return http
			.get('/api/common/sales/custom-statistic', {
				params: {
					categories: param.categories + '',
					startDate: param.startDate,
					endDate: param.endDate,
					customType: param.customType + '',
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '사용자 정의 통계 데이터를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}
}

export default new SalesService();