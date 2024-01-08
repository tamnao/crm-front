<template>
	<div>
        <div class="page-login">	
            <div class="login">	
                <div class="login-header">	
                    <img src="@/assets/images/logo.png" alt="탐나오">	
                    <h1><span>고객관계관리</span> 시스템</h1>	
                    <span>Customer Relationship Management System</span>	
                </div>	
                <form class="login-form" @submit.prevent="false">	
                    <div class="form-item">	
                        <label for="login-id" class="form-label">아이디</label>	
                        <el-input id="login-id" v-model='loginInfo.loginId' />	
                    </div>	
                    <div class="form-item">	
                        <label for="login-password" class="form-label">비밀번호</label>	
                        <div>	
                            <el-input id="login-password" v-model='loginInfo.password' show-password />	
                            <p class="form-error active" v-show="showError">
                                <i class="material-icons-outlined">warning_amber</i>
                                가입하지 않은 아이디 또는 잘못된 비밀번호입니다.
                            </p>	
                        </div>	
                    </div>	
                    <button type="submit" class="btn-h48 btn-primary" @click="send">로그인</button>	
                </form>	
            </div>	
            <p class="copyright">&copy; 2021. Jeju Tourism Association</p>	
        </div>	
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';
import securityService from '@/services/security/SecurityService';
import LoginInfo from '@/model/security/LoginInfo';
import tokenUtils from '@/utils/TokenUtils';
import router from "@/router";

export default defineComponent({
	setup() {
		const loginInfo = reactive(new LoginInfo());
		const store = useStore();
        let showError = ref<boolean>(false);
		tokenUtils.clearToken();

		store.commit('UserStoreModule/setUser', null);
		store.commit('UserStoreModule/setToken', null);
		store.commit('MenuStoreModule/setMenu', null);
		tokenUtils.clearToken();
		
		const send = () => {
			securityService.login(loginInfo).then(res => {
				//console.log(res);
                if(res == undefined) {
                    showError.value = true;
                } else {
                    store.commit('UserStoreModule/setUser', res.user);
                    store.commit('UserStoreModule/setToken', res.userToken);
                    store.commit('MenuStoreModule/setMenu', res.userMenuList);
                    store.commit('MenuStoreModule/setActiveMenu', "대시보드");

                    tokenUtils.setToken(store.getters['UserStoreModule/getToken']);
                    router.push({ name: "Dashboard" });
                }
			})
            .catch(err => {
                showError.value = true;
            })

		}

		return {
			loginInfo,
            showError,
			send
		}
	}
})
</script>

<style scoped>

</style>
