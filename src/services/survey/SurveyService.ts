import http from '@/utils/HttpClient';
import commonDialog from '@/services/dialog/CommonDialog';

class SurveyService {
	findAllSurvey(params:any) {
		return http.get('/api/admin/survey', {
			params: {
				title: params.title,
				startDate: params.startDate,
				endDate: params.endDate,
				isPaging: params.isPaging,
				length: 10,
				pageNumber: params.pageNumber
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '설문 목록을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	findSurveyById(surveyId:any) {
		return http.get('/api/admin/survey/' + surveyId)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '설문을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	createSurvey(params:any) {
		return http.post("/api/admin/survey/create", params)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '설문을 저장하는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	updateSurvey(params:any) {
		return http.post("/api/admin/survey/update/" + params.id, params)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '설문을 수정하는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	deleteSurvey(id:any) {
		return http.post("/api/admin/survey/delete/" + id)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '설문을 삭제하는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	getSurveyResultList(params:any) {
		return http.get('/api/admin/survey/result', {
			params: {
				title: params.title,
				startDate: params.startDate,
				endDate: params.endDate,
				isPaging: params.isPaging,
				length: 10,
				pageNumber: params.pageNumber
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '설문 결과 목록을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	getSurveyRespondentSex(surveyId:any) {
		return http.get('/api/admin/survey/respondent/sex/' + surveyId)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '설문 성별 응답 비율을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	getSurveyRespondentAge(surveyId:any) {
		return http.get('/api/admin/survey/respondent/age/' + surveyId)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '설문 연령별 응답 비율을 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	getSurveyResult(surveyId:any) {
		return http.get('/api/admin/survey/result/' + surveyId)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '설문 결과를 읽는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}

	createSurveyRespondent(surveyId:number, param: FormData) {
		console.log("SurveyService.registerSurveyRespondent()...", surveyId);
		return http
		.post('/api/admin/survey/respondent/' + surveyId, param)
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '설문 대상자를 등록하는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});

	}

	// ------- survey api for public -------

	findByIdForPublic(token:any) {
		return http.get('/api/public/survey', {
			headers: {
				"SURVEY_AUTHORITY": token
			}
		})
		.then((result) => {
			return result;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '잘못된 요청입니다.');
			return Promise.reject(err);
		});
	}

	submitSurveyResponds(token:any, responses:any) {
		return http.post("/api/public/survey/respond", responses, {
			headers: {
				"SURVEY_AUTHORITY": token
			}
		})
		.then((result) => {
			return result.data;
		}).catch((err) => {
			commonDialog.showErrorHtml(err, '설문 응답을 저장하는 중 에러가 발생했습니다.');
			return Promise.reject(err);
		});
	}
}

export default new SurveyService();