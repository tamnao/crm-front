import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class ProductService {

	selectListByCategoryCorporation(categoryCode:string, corporationId:string) { 
		return http
			.get('/api/common/product/find-select-list-category-corporation/' + categoryCode + '/' + corporationId)
			.then(res => {
				return res.data;
			})
			.catch(err => {
				commonDialog.showErrorHtml(err, '상품 목록을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
			});
	}

}

export default new ProductService();


