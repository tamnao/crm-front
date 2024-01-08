import UserToken from '@/model/security/UserToken';

class TokenUtils {
	
	getAccessToken = () => {
		let token = sessionStorage.getItem('accessToken');
		if (!token)
			token = '';
		return token;
	}

	getRefreshToken = () => {
		let token = sessionStorage.getItem('refreshToken');
		if (!token)
			token = '';
		return token;
	}

	setToken = (token: UserToken) => {
		sessionStorage.setItem('accessToken', token.accessToken);
		sessionStorage.setItem('refreshToken', token.refreshToken);
	}

	clearToken = () => {
		sessionStorage.removeItem('accessToken');
		sessionStorage.removeItem('refreshToken');
	}

	getIsReissuing = () => {
		const isReissuing = sessionStorage.getItem("isReissuing");
		if (!isReissuing)
			return false;
		
		return true;
	}

	setIsReissuing = (isReissuing: string) => {
		sessionStorage.setItem("isReissuing", isReissuing);
	}


	clearIsReissuing = () => {
		sessionStorage.removeItem("isReissuing");
	}
}

export default new TokenUtils();