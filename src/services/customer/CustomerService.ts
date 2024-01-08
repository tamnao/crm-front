import http from '@/utils/HttpClient';
import CustomerCategoryRatingSearchDto from '@/model/customer/CustomerCategoryRatingSearchDto';
import SocialContributePointSearchDto from '@/model/customer/SocialContributePointSearchDto';
import commonDialog from '@/services/dialog/CommonDialog';

class CustomerService {
	//-----start customer statistic API (General.vue) -------//
	searchCustomer(customerClassificationInfo: CustomerCategoryRatingSearchDto) {
		return http.get('/api/common/customer-common/customer-category-rating', {
			params: {
				customerTypes: customerClassificationInfo.params.categories + '',
				ratings: customerClassificationInfo.params.ratings + '',
				isPaging: customerClassificationInfo.params.isPaging,
				length: customerClassificationInfo.params.length,
				pageNumber: customerClassificationInfo.params.pageNumber
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '고객 목록을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	customerCountCategory() {
		return http.get('/api/common/customer-common/customer-count-category')
			.then((result) => {
				return result.data;
			}).catch((err) => {
				commonDialog.showErrorHtml(err, '고객 구분 데이터를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	customerCountRating() {
		return http.get('/api/common/customer-common/customer-count-rating')
			.then((result) => {
				return result.data;
			}).catch((err) => {
				commonDialog.showErrorHtml(err, '고객 등급 데이터를 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	getCustomerCategoryRatingListExcel(customerClassificationInfo: CustomerCategoryRatingSearchDto) {
		return http.get('/api/common/customer-common/customer-category-rating-excel', {
			params: {
				customerTypes: customerClassificationInfo.params.categories + '',
				ratings: customerClassificationInfo.params.ratings + '',
				isPaging: customerClassificationInfo.params.isPaging,
				length: customerClassificationInfo.params.length,
				pageNumber: customerClassificationInfo.params.pageNumber
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '고객 목록을  읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	findAllCurrentRatingCriteria() {
		return http.get('/api/common/customer-rating-criteria/current')
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '고객 등급 기준을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	createCustomerRatingCriteria(createDto:any) {
		return http.post('/api/common/customer-rating-criteria', createDto)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '고객 등급 기준을 저장하는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	//-----end customer statistic API (General.vue) -------//

	//-----start social contribute point API (SocialContributePoint.vue) -------//
	getSocialContributePoint(socialContributePointSearchDto: SocialContributePointSearchDto) {
		return http.get('/api/common/customer/social-contribute-point', socialContributePointSearchDto)
			.then((result) => {
				return result.data;
			}).catch((err) => {
				commonDialog.showErrorHtml(err, '사회공헌포인트 목록을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	getSocialContributePointListExcel(socialContributePointSearchDto: SocialContributePointSearchDto) {
		return http.get('/api/common/customer/social-contribute-point-excel', socialContributePointSearchDto)
			.then((result) => {
				return result.data;
			}).catch((err) => {
				commonDialog.showErrorHtml(err, '사회공헌 포인트 목록을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			})
	}

	getSocialContributePointStat(socialContributePointSearchDto: SocialContributePointSearchDto) {
		return http.get('/api/common/customer/social-contribute-point-stat', socialContributePointSearchDto)
			.then((result) => {
				return result.data;
			}).catch((err) => {
				commonDialog.showErrorHtml(err, '사회공헌포인트 유형별 적립현황을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	getSocialContributePointStatDaily(socialContributePointSearchDto: SocialContributePointSearchDto) {
		return http.get('/api/common/customer/social-contribute-point-stat-daily', socialContributePointSearchDto)
			.then((result) => {
				return result.data;
			}).catch((err) => {
				commonDialog.showErrorHtml(err, '사회공헌포인트 일일 적립현황 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}

	
	//-----start stop purchase API (StoppedPurchase.vue) -------//
	stopPurchaseStat(param:any) {
		return http
			.get('/api/common/customer/stop-purchase-stat', {
				params: {
					startDate: param.startDate,
					endDate: param.endDate,
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '구매전환 이탈고객 현황을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}
	
	stopPurchase(param:any) {
		return http
			.get('/api/common/customer/stop-purchase', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					startDate: param.startDate,
					endDate: param.endDate,
					categoryTypes: param.categoryTypes + ''
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '구매전환 이탈고객을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}
	
	stopPurchaseExcel(param:any) {
		return http
			.get('/api/common/customer/stop-purchase-excel', {
				params: {
					startDate: param.startDate,
					endDate: param.endDate,
					pageNumber: param.pageNumber,
					categoryTypes: param.categoryTypes + ''
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '구매전환 이탈고객을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}
	//-----end stop purchase API (StoppedPurchase.vue) -------//
	
	//-----start repurchase API (Repurchase.vue) -------//
	repurchaseStat(param:any) {
		return http
			.get('/api/common/customer/repurchase-stat', {
				params: {
					startDate: param.startDate,
					endDate: param.endDate,
					categoryTypes: param.categoryTypes + ''
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '재구매고객 현황을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}
	
	repurchase(param:any) {
		return http
			.get('/api/common/customer/repurchase', {
				params: {
					isPaging: param.isPaging,
					pageNumber: param.pageNumber,
					startDate: param.startDate,
					endDate: param.endDate,
					categoryTypes: param.categoryTypes + ''
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '재구매고객 목록을 읽는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}
	//-----end repurchase API (Repurchase.vue) -------//


}

export default new CustomerService();
