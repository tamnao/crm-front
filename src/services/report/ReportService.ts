import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class ReportService {

	salesStatisticCategoryProduct(inquiryType:number, param:any) { 
		return http
			.get('/api/common/report/sales-statistic-category-product/' + inquiryType, {
				params: {
					categoryTypes: param.categoryTypes + '',
					productNumbers: param.productNumbers + '',
					year: param.year,
					month: param.month
				}
			})
			.then(res => {
				return res.data;
			})
			.catch(err => {
				switch(inquiryType) {
					case 1:
						commonDialog.showErrorHtml(err, '성별 구매 건수를 읽는 중 에러가 발생했습니다.');				
						break;
					case 2:
						commonDialog.showErrorHtml(err, '연령별 구매 건수를 읽는 중 에러가 발생했습니다.');				
						break;
					case 3:
						commonDialog.showErrorHtml(err, '지역별 구매 고객 매출액을 읽는 중 에러가 발생했습니다.');				
						break;
					default:
						commonDialog.showErrorHtml(err, '데이터를 읽는 중 에러가 발생했습니다.');
						break;
				}
				return Promise.reject(err);
			});
	}

	getLocalProductSales(param:any) {
		return http.get('/api/common/report/local-product-sales', {
			params: {
				isPaging: param.isPaging,
				pageNumber: param.pageNumber,
				year: param.year,
				month: param.month,
				categories: param.categories + '',
			}
		})
		.then(res => {
			return res.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '지역별 상품 판매 분포를 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

}

export default new ReportService();


