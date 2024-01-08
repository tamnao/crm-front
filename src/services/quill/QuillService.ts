import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class QuillService {
	uploadImage(param:any) {
		return http
			.post('/api/common/quill/images', param)
			.then((result) => {
				return result.data;
			}).catch((err) => {
				commonDialog.showErrorHtml(err, '이미지를 전송하는 중 에러가 발생했습니다.');
				return Promise.reject(err);
			});
	}
}

export default new QuillService();