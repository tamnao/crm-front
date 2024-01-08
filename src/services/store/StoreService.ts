import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class StoreService {

	storeStatistic(param:any) { 
		return http
			.get('/api/common/store/statistic', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					categoryList: param.categoryList + '',
					year: param.year,
					month: param.month,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '카테고리별 업체 현황을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	storeStatisticExcel(param:any) { 
		return http
			.get('/api/common/store/excel', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					categoryList: param.categoryList + ''
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '카테고리별 업체 현황을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	runStopStatistic(param:any) { 
		return http
			.get('/api/common/store/statistic/run-stop', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					categoryList: param.categoryList + '',
					year: param.year,
					month: param.month,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '승인/미승인 현황을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	memberStatistic(param:any) { 
		return http
			.get('/api/common/store/statistic/member', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					categoryList: param.categoryList + '',
					year: param.year,
					month: param.month,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '회원사/비회원사 현황을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	categoryStatistic(param:any) { 
		return http
			.get('/api/common/store/statistic/monthly', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					categoryList: param.categoryList + '',
					year: param.year,
					month: param.month,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '카테고리별 누적 업체 수를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	storeSales(param:any) { 
		return http
			.get('/api/common/store/sales', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					startDate: param.startDate,
					endDate: param.endDate,
					categories: param.categories + '',
					storeName: param.storeName,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '업체 매출 목록을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	storeSalesExcel(param:any) { 
		return http
			.get('/api/common/store/sales/excel', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					startDate: param.startDate,
					endDate: param.endDate,
					categories: param.categories + '',
					storeName: param.storeName,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '업체 매출 목록을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	storeCategorySalesAmountCount(param:any) { 
		return http
			.get('/api/common/store/sales/category-sales-amount-count', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					startDate: param.startDate,
					endDate: param.endDate,
					categories: param.categories + '',
					storeName: param.storeName,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '카테고리별 판매 현황을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	sexSalesCount(param:any) { 
		return http
			.get('/api/common/store/sales/sex/count', {
				params: {
					startDate: param.startDate,
					endDate: param.endDate,
					corpId: param.corpId,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '업체 성별 구매수를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	sexSalesAmount(param:any) { 
		return http
			.get('/api/common/store/sales/sex/amount', {
				params: {
					startDate: param.startDate,
					endDate: param.endDate,
					corpId: param.corpId,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '업체 성별 매출액을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	ageGroupSalesCount(param:any) { 
		return http
			.get('/api/common/store/sales/age-group/count', {
				params: {
					startDate: param.startDate,
					endDate: param.endDate,
					corpId: param.corpId,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '업체 연령별 구매수를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	ageGroupSalesAmount(param:any) { 
		return http
			.get('/api/common/store/sales/age-group/amount', {
				params: {
					startDate: param.startDate,
					endDate: param.endDate,
					corpId: param.corpId,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '업체 연령별 구매액을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	sidoSales(param:any) { 
		return http
			.get('/api/common/store/sales/sido', {
				params: {
					startDate: param.startDate,
					endDate: param.endDate,
					corpId: param.corpId,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '업체 지역별 구매수, 매출액을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	monthSales(param:any) { 
		return http
			.get('/api/common/store/sales/month', {
				params: {
					startDate: param.startDate,
					endDate: param.endDate,
					corpId: param.corpId,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '업체 월별 구매수, 매출액을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}
	
	getStoreSalesMapEmd(paramYear:number, paramMonth:number, paramCategory:any) {
		return http.get('/api/common/store/sales/map-emd', {
			params: {
				year: paramYear,
				month: paramMonth,
				categories: paramCategory == null ? '' : paramCategory,
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '탐나오 매출 지도 데이터를 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	getStoreSalesEupmyeondong(param:any) {
		return http.get('/api/common/store/sales/eupmyeondong', {
			params: {
				year: param.year,
				month: param.month,
				sigungu: param.sigungu,
				eupmyeondong: param.eupmyeondong
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '읍면동 업체 매출 현황을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	getTop10MonthlySalesAmount(paramYear: number, paramMonth: number) {
		return http.get('/api/common/store/sales/top-10-monthly-sales-amount', {
			params: {
				year: paramYear,
				month: paramMonth,
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '탐나오 맛집 Top 10을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}
	
	getSalesAmountSex(param:any) {
		return http.get('/api/common/store/sales/eupmyeondong-sex', {
			params: {
				year: param.year,
				month: param.month,
				sigungu: param.sigungu,
				eupmyeondong: param.roadName
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '탐나오 읍면동 성별 이용금액 현황을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	getStartEndYearMonth() {
		return http.get('/api/common/store/sales/start-end-year-month')
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '탐나오 판매 현황 시작/종료 년월을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	selectListByCategoryCode(categoryCode:any) { 
		return http
			.get('/api/common/store/find-select-list-category-code/' + categoryCode)
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '코드를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

}

export default new StoreService();