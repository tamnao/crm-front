<template>
	<div id="app">
		<login v-if="$route.name == 'Login'"></login>
		<UserSurveyRespond v-else-if="$route.name == 'UserSurveyRespond'"></UserSurveyRespond>
		<SurveyRespondComplete v-else-if="$route.name == 'SurveyRespondComplete'"></SurveyRespondComplete>
		<default-layout v-else></default-layout>
	</div>
</template>

<script>
// @ is an alias to /src
import DefaultLayout from "@/views/layout/DefaultLayout";
import Login from "@/views/security/Login";
import UserSurveyRespond from '@/views/public/UserSurveyRespond.vue'
import SurveyRespondComplete from '@/views/public/SurveyRespondComplete.vue'

export default {
	name: "app",
	components: {
		DefaultLayout,
		Login,
		UserSurveyRespond,
		SurveyRespondComplete
	},
};
</script>

<style>
</style>
