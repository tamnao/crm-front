import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import tokenUtils from '@/utils/TokenUtils'

class HttpFileClient {
	protected readonly instance: AxiosInstance;
	
	public constructor() {
		this.instance =  axios.create({
			baseURL: process.env.VUE_APP_BASE_URL,
			headers: {
				'contentType': 'application/json;charset=UTF-8;'
			},
			responseType: 'blob'
		});


		this.instance.interceptors.request.use(
			request => {
				if (request.headers) {
					request.headers['Authorization'] = tokenUtils.getAccessToken();
				}
				return request;
			},
			error => {
				return Promise.reject(error);
			}
		);

		const interceptor = this.instance.interceptors.response.use(
			response => {
				return response;
			},
			error => {
				const data = error.response.data;
				const originalRequest = error.config;
				if (error.response.status === 401 && data.message.indexOf('expiredToken') > -1) {
					const config = { 
						headers: { 'Authorization': tokenUtils.getRefreshToken() } 
					}
					return axios.post(
						'/api/security/reissue-token', {}, config
					).then(res => {
						tokenUtils.setToken(res.data);
					})
					.then(() => Promise.resolve(this.instance(originalRequest)))
					.catch(err => {
						console.log('fail refreshToken', err);
						
					})
				} else if (error.response.status === 500 && data.message.indoexOf('invalidToken') > -1) {
					window.location.href = '/security/login';
				} else if (data.message.length > 0) {
					return data;
				} else {
					return Promise.reject(error);
				}
			}
		)
	}

	post(url: string, data?: any, config?:AxiosRequestConfig<any>) {
		return this.instance.post(url, data, config);
	}

	get(url: string, config?:AxiosRequestConfig<any>) {
		//console.log("---- httpfileclient.get")
		return this.instance.get(url, config);
	}

}

export default new HttpFileClient();



