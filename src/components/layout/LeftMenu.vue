<template>
	<div class="layout-sidebar">
		<div class="sidebar-content">
			<a href="/" class="sidebar-header">
				<img src="@/assets/images/logo.png" alt="탐나오">
				<h1><span>고객관계관리</span> 시스템</h1>
				<span>Customer Relationship Management System</span>
			</a>
			<ul class="sidebar-menu">
				<li v-for="(menu, index) in menuList" :key="index">  
					<router-link :to="menu.url" :class="{ 'active' : menu.url == currentPath }"  v-if="menu.subMenus.length == 0" @click="activeNav(menu.menuName)"> 
						<i class="material-icons-outlined">{{ menuIcon[index] }}</i>
						{{ menu.menuName }} 
					</router-link>

					<template v-else>
						<button :class="checkActiveNav(menu.menuName, 'button')" type="button" data-bs-toggle="collapse" :data-bs-target="'#' + removeWhitespace(menu.menuName)">
							<i class="material-icons-outlined">{{ menuIcon[index] }}</i>
							{{ menu.menuName }}
						</button>
						<ul :id="removeWhitespace(menu.menuName)" :class="checkActiveNav(menu.menuName, 'list')" v-for="(subMenu, i) in menu.subMenus" :key="i">
							<li>
								<router-link :to="subMenu.url" :class="{ 'active' : subMenu.url == currentPath }" @click="activeNav(menu.menuName)">{{ subMenu.menuName }}</router-link>
							</li>
						</ul>
					</template>
				</li>
			</ul>
		</div>
		<!--//sidebar-content-->
		<div class="sidebar-account">
			<a href="" v-if="user != null">
				<!--img src="@/assets/images/temp-profile.jpg" alt=""-->
				<div>
					<h6>{{ user.name }}</h6>
					<span>{{ user.roleName }}</span>
					<!--h6>{{ user.name }} </h6-->
					<!--span>리포트 관리자</span-->
				</div>
			</a>
			<button type="button" @click="logout"><i class="material-icons-outlined">logout</i></button>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, computed } from '@vue/runtime-core';
	import { useStore } from 'vuex';
	import { useRoute } from 'vue-router';
	import router from "@/router";
	import securityService from '@/services/security/SecurityService';
	import tokenUtils from '@/utils/TokenUtils';

	export default defineComponent({
		setup() {
			const route = useRoute();
			const store = useStore();
			
			const menuList = store.getters['MenuStoreModule/getMenu'];
			const menuIcon = ["dashboard", "groups", "assessment", "history_edu", "assessment", "settings", "history_edu", "history_edu", "settings"];
			const user = store.getters['UserStoreModule/getUser'];
			const currentPath = computed(() => {
				return route.path;
			})

			function logout () {
				securityService.logout().then(res => {
					clearUserInfo();
				})
				.catch(err => {
					clearUserInfo();
				});
				
			}

			function clearUserInfo() {
				store.commit('UserStoreModule/setUser', null);
				store.commit('UserStoreModule/setToken', null);
				store.commit('MenuStoreModule/setMenu', null);
				tokenUtils.clearToken();
				router.push({ name: 'Login' });
			}

			function removeWhitespace(menuName:string) {
				return menuName.replace(/\s+/g, '');
			}

			function activeNav(navId:string) {
				store.commit('MenuStoreModule/setActiveMenu', removeWhitespace(navId));
			}

			function checkActiveNav(navId:string, element:string) {
				let buttonClass = "";
				let listClass = "";
				if(removeWhitespace(navId) == store.getters['MenuStoreModule/getActiveMenu']) {
					buttonClass = "btn-collapse";
					listClass = "collapse show";
				} else {
					buttonClass = "btn-collapse collapsed";
					listClass = "collapse";
				}

				if(element == "button") {
					return buttonClass;
				} else {
					return listClass;
				}
			}

			return {
				menuList,
				menuIcon,
				currentPath,
				logout,
				removeWhitespace,
				user,
				activeNav,
				checkActiveNav
			}
		}
	})
</script>

<style scoped>
	.layout-sidebar {
		text-align: left;
	}
</style>