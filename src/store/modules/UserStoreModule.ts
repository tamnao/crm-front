import { Module, GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';

import User from '@/model/security/User';
import UserToken from '@/model/security/UserToken';

export class UserInfo {
	public user: User = new User ();
	public token: UserToken = new UserToken();
}

const getters: GetterTree<UserInfo, any> = {
	getUser(state: UserInfo): User {
		return state.user;
	},
	getToken(state: UserInfo): UserToken {
		return state.token;
	}
}

const mutations: MutationTree<UserInfo> = {
	setUser(state: UserInfo, user: User) {
		// console.log(user);
		state.user = user;
	},
	setToken(state: UserInfo, token: UserToken) {
		// console.log(token);
		state.token = token;
	}
}

const actions: ActionTree<UserInfo, any> = {
	setUser({ commit}: ActionContext<UserInfo, any>, user: User) {
		commit('setUser', user);
	},
	setToken({ commit}: ActionContext<UserInfo, any>, token:UserToken) {
		commit('setToken', token);
	},
}

const UserStoreModule: Module<UserInfo, any> = {
	namespaced: true,
	state: new UserInfo(),
	getters,
	mutations,
	actions,
};

export default UserStoreModule;