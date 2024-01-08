import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import ko from 'element-plus/es/locale/lang/ko'

import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import i18n from './i18n'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import '@/assets/css/style.css';

import VueApexCharts from "vue3-apexcharts";

const app = createApp(App).use(i18n).use(VueApexCharts)
app.use(ElementPlus, { locale: ko }).use(store).use(router).use(i18n).mount('#app')