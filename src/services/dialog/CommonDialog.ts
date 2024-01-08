import { ElMessage } from 'element-plus';

class CommonDialog {

	getErrorMessge = (error: any, defaultMessage: string | void):string => {
		const data = error.response.data;

		let errorMessage = '';
		if (data.message) {
			errorMessage = data.message;
		} else if (data.messages && data.messages.length > 0) {
			for(let i = 0; i < data.messages.length; i++) {
				errorMessage += '<div style="margin-bottom: 5px;">' + data.messages[i] + '</div>';
			}
		}
		return errorMessage != '' ? errorMessage : defaultMessage ? defaultMessage : '실행 중 에러가 발생했습니다.';
	}

	showErrorHtml = (error: any, defaultMessage: string | void):void => {
		ElMessage({
			message: this.getErrorMessge(error, defaultMessage),
			type: 'error',
			dangerouslyUseHTMLString: true,
			showClose: true,
			duration: 3000
		});
	}
}

export default new CommonDialog();