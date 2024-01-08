import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class ExternalDataService {
	// 유동인구
	getFloatPopulationMapEmd(paramYear: number, paramMonth: number) {
		return http.get('/api/common/external/float-population-emd/map-emd', {
			params: {
				year: paramYear,
				month: paramMonth,
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '유동인구 지도 데이터를 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}


	getFloatingPopulationStartEndYearMonth() {
		return http.get('/api/common/external/float-population-emd/start-end-year-month')
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '유동인구 시작/종료 년월을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}


	// 유동인구 + 매출
	getFloatPopulationChartEmdSales(paramYear: number, paramMonth: number, paramSalesYear: number, paramSalesMonth: number) {
		return http.get('/api/common/external/float-population-emd/chart-emd-sales', {
			params: {
				year: paramYear,
				month: paramMonth,
				salesYear: paramSalesYear,
				salesMonth: paramSalesMonth,
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '유동인구, 매출 차트 데이터를 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	// 카드 
	getFloatingPopulationCardMapEmd(paramYear:number, paramMonth: number, paramCategories:any) {
		return http.get('/api/common/external/float-population-card-emd/map-emd', {
			params: {
				year: paramYear,
				month: paramMonth,
				categories: paramCategories == null ? "" : paramCategories + '',
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '카드 사용 지도 데이터를 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	// 카드 + 매출
	getFloatPopulationCardChartEmdSales(paramYear: number, paramMonth: number, paramSalesYear: number, paramSalesMonth: number, paramCategories: string) {
		return http.get('/api/common/external/float-population-card-emd/chart-emd-sales', {
			params: {
				year: paramYear,
				month: paramMonth,
				salesYear: paramSalesYear,
				salesMonth: paramSalesMonth,
				categories: paramCategories
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '유동인구, 매출 차트 데이터를 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	getFloatingPopulationCardStartEndYearMonth() {
		return http.get('/api/common/external/float-population-card-emd/start-end-year-month')
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '카드 시작/종료 년월을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}


	getFloatingPopulationCardSex(param:any) {
		return http.get('/api/common/external/float-population-card-emd/sales-amount-sex', {
			params: param
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '카드 성별 사용 현황을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	getFloatingPopulationCardAge(param:any) {
		return http.get('/api/common/external/float-population-card-emd/sales-amount-age', {
			params: param
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '카드 연령대별 사용 현황을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}







	// 맛집
	getFloatingPopulationCardFoodMapEmd(paramYear: number, paramMonth: number) {
		return http.get('/api/common/external/float-population-card-emd/food/map-emd', {
			params: {
				year: paramYear,
				month: paramMonth,
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '맛집 지도 데이터를 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}
	


	getFloatingPopulationCardFoodMonthlyTop10(paramYear: number, paramMonth: number) {
		return http.get('/api/common/external/float-population-card-emd/food/monthly-top10', {
			params: {
				year: paramYear,
				month: paramMonth,
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '맛집 매출 TOP10을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	getFloatingPopulationCardFoodYearlyCategory(paramYear: number, paramMonth: number) {
		return http.get('/api/common/external/float-population-card-emd/food/yearly-category', {
			params: {
				year: paramYear,
				month: paramMonth,
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '맛집 업종별 매출 현황을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	getFloatingPopulationCardFoodMonthlyCategoryAge(paramYear: number, paramMonth: number) {
		return http.get('/api/common/external/float-population-card-emd/food/monthly-category-age', {
			params: {
				year: paramYear,
				month: paramMonth,
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '맛집 연령별 메뉴 선호도를 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}



	getFloatingPopulationCardFoodStartEndYearMonth() {
		return http.get('/api/common/external/float-population-card-emd/start-end-year-month')
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '맛집 데이터 시작/종료 년월을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

}

export default new ExternalDataService();