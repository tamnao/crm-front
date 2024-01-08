import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import tokenUtils from '@/utils/TokenUtils'

class HttpClient {
	protected readonly instance: AxiosInstance;
	
	public constructor() {
		this.instance =  axios.create({
			baseURL: process.env.VUE_APP_BASE_URL,
			headers: {
				'contentType': 'application/json;charset=UTF-8;'
			}
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
				tokenUtils.clearIsReissuing();

				return response;
			},
			error => {
				// console.log(error);
				const data = error.response.data;
				const originalRequest = error.config;
				// console.log(error.response);
				if (error.response.status === 401 && data.message.indexOf('expiredToken') > -1) {
					if (tokenUtils.getIsReissuing()) { // 토큰 재발행 중인 경우, 토큰 재발행을 다시 시도하지 않고 잠시 대기 후 정상적인 요청을 다시 시도한다.
						// console.log("--- with reissue ---");
						(async() => {
							await new Promise(f => setTimeout(f, 3000));
						});
						return Promise.resolve(this.instance(originalRequest));
					}
					tokenUtils.setIsReissuing("reissue");
					const config = { 
						headers: { 'Authorization': tokenUtils.getRefreshToken() } 
					}
					return axios.post(
						'/api/security/reissue-token', {}, config
					)
					.then(res => {
						//console.log("---------------------------------------------reissued------------------");
						tokenUtils.setToken(res.data);
						tokenUtils.clearIsReissuing();
					})
					.then(() => Promise.resolve(this.instance(originalRequest)))
					.catch(err => {
						//console.log('fail refreshToken', err.response);
						if (err.response.data.message.indexOf('fakeToken') > -1) {
							window.location.href = '/security/login';
						}
						tokenUtils.clearIsReissuing();
					})
				} else if (error.response.status === 500 && data.message && data.message.indexOf('fakeToken') > -1) { 
					//console.log("---- fake token ----");
					window.location.href = '/security/login';
//				} else if ((data.length < 1 && data.message.length > 0) || (data.length > 0 && data[0].message.length > 0)) { 
//					return data;
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
		return this.instance.get(url, config);
	}

	put(url: string, data?: any, config?:AxiosRequestConfig<any>) {
		return this.instance.put(url, data, config);
	}

	delete(url: string, config?:AxiosRequestConfig<any>) {
		return this.instance.delete(url, config);
	}

}

export default new HttpClient();



