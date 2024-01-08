<template>
    <div>
        <div class="layout-content">

            <div class="content-title">
                <span>매출 분석</span>
                <h2>사용자 정의 통계</h2>
            </div>

            <form class="form-filter" @submit.prevent="false">
                <dl class="filter-item">
                    <dt>카테고리</dt>
                    <dd>
                        <label class="checkbox-container" for="categoryAll">전체
                            <input type="checkbox" id="categoryAll" :checked="checkCategory('All')" @change="changeCategory('All')">
                            <span class="checkmark"></span>
                        </label>
                        <label v-for="cat in category" :key="cat.value" :for="cat.value" class="checkbox-container">
                            {{ cat.label }}
                            <input type="checkbox" :id="cat.value" :value="cat.value" :checked="checkCategory(cat.value)" @change="changeCategory(cat.value)">
                            <span class="checkmark"></span>
                        </label>
                    </dd>
                </dl>
                <dl class="filter-item">
                    <dt>기간</dt>
                    <dd>
                        <label v-for="duration in period" :key="duration.value" class="radio-container" :for="duration.value">
                            {{ duration.name }}
                            <input type="radio" name="period" :id="duration.value" v-model="search.period" :value="duration.value" @change="changePeriod">	
                            <span class="checkmark"></span>	
                        </label>
                        <input type="date" v-model="search.startDate" v-show="search.showCustomDate">
                        <span v-show="search.showCustomDate">&dash;</span>
                        <input type="date" v-model="search.endDate" v-show="search.showCustomDate">		
                    </dd>
                </dl>
                <dl class="filter-item">
                    <dt>고객 &#47; 업체</dt>
                    <dd>
                        <label class="checkbox-container" for="user">고객 현황
                            <input type="checkbox" id="user" :checked="checkCustomType('user')" @change="changeCustomType('user')">
                            <span class="checkmark"></span>
                        </label>
                        <label class="checkbox-container" for="store">업체 현황
                            <input type="checkbox" id="store" :checked="checkCustomType('store')" @change="changeCustomType('store')" >
                            <span class="checkmark"></span>
                        </label>
                    </dd>
                </dl>
                <dl class="filter-item">
                    <dt>상품별 통계 정보</dt>
                    <dd>
                        <label class="checkbox-container" for="sales">매출 현황
                            <input type="checkbox" id="sales" :checked="checkCustomType('sales')" @change="changeCustomType('sales')">
                            <span class="checkmark"></span>
                        </label>
                        <label class="checkbox-container" for="salesCancel">매출 취소 현황
                            <input type="checkbox" id="salesCancel" :checked="checkCustomType('salesCancel')" @change="changeCustomType('salesCancel')">
                            <span class="checkmark"></span>
                        </label>
                    </dd>
                </dl>
                <div class="filter-buttons">
                    <button type="submit" class="btn-h40 btn-primary" @click="sendForm">검색</button>
                    <button type="button" class="btn-h40 btn-outline" @click="resetForm">초기화</button>
                </div>
            </form>
            <!--//form-filter-->

            <hr class="gutter-large">

            <div class="chart">
                
                <div class="chart-area">
                    <loading-chart v-if="lineData.chartInfo.showLoading" />
                    <line-chart-wrapper v-else-if="lineData.chartData.length > 0" :data="lineData" :key="lineData.chartInfo.key" />
                </div> 
            </div><!--//chart-->

        </div>
        <!--//layout-content-->
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, reactive, onUnmounted } from '@vue/runtime-core'; 
    import moment from 'moment/moment';
    import codeService from '@/services/code/CodeServices';
    import salesService from '@/services/sales/SalesService';
    import LineChartWrapper from "@/components/charts/line/LineChartWrapper.vue";
    import LoadingChart from "@/components/charts/loading/Loading.vue";
import { ElMessage } from 'element-plus';

    export default defineComponent({
        components: {
            "line-chart-wrapper" : LineChartWrapper,
            "loading-chart" : LoadingChart,
        },
        setup() {

            let category = ref([]) as any;

            let period = [
                { value: "periodYesterday", name: "어제" },
                { value: "periodWeek", name: "1주일" },
                { value: "periodOne", name: "1개월" },
                { value: "periodThree", name: "3개월" }, 
                { value: "periodCustom", name: "사용자 설정" }, 	
            ]

            let search = reactive({
                categories: [] as any,
                period: "periodYesterday",
                startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                showCustomDate: false,
                customType: [] as any,
            });

            let lineData = ref({
                chartData: [] as any,
                chartInfo: {
                    key: 1,
                    height: "295px",
                    width: "100%",
                    chartType: "LINE",
                    xaxisTitle: "",
                    yaxisTitleList: ["건수"],
                    xaxisType: "categories", //datetime, categories, numeric
                    lineCurve: "smooth", // smooth, straight, stepline
                    colors: [] as any,
                    showLegend: true,
                    shareTooltip: true,
                    legendFontSize: '12px',
                    legendFontWeight: 700,
                    legendMarkersWidth: 6,
                    legendMarkersHeight: 6,
                    showLoading: false,
                    seriesLeftYaxis: [] as any,
                    seriesRightYaxis: [] as any,
                }
            });

            let chartColors = [
                { name: "고객(신규)", color: "#EFEDEC", colorName: "beige"},
                { name: "고객(전체)", color: "#CCD2E0", colorName: "blue-gray" },
                { name: "입점업체(신규)", color: "#A59E96", colorName: "brown-gray" },
                { name: "입점업체(전체)", color: "#D2CECA", colorName: "brown-gray-light" },
                { name: "판매건수", color: "#897B6B", colorName: "brown-gray-dark" },
                { name: "판매금액", color: "#2E2F2E", colorName: "gray-dark" },
                { name: "취소건수", color: "#ABACAB", colorName: "green-gray" },
                { name: "취소금액", color: "#EECFB7", colorName: "orange-light" },
            ]

            function getCategory() {
                codeService.selectListByParentCode("COMP").then(res => {
                    category.value = res;
                })
            }

            function getCustomStatistic() {
                lineData.value.chartInfo.showLoading = true;
                salesService.getCustomStatistic(search).then(res => {
                    lineData.value.chartInfo.yaxisTitleList = ['건수'];
                    lineData.value.chartInfo.seriesRightYaxis = [];
                    lineData.value.chartInfo.seriesLeftYaxis = [];
                    let xaxisCategory = [] as any;
                    let colors = [] as any;
                    for(let customType of res) {
                        for(let data of customType.data) {
                            if(!xaxisCategory.includes(data.x)) {
                                xaxisCategory.push(data.x);
                            }
                        }

                        // Divide which series to which yaxis (right or left)
                        if(customType.name.includes("신규") || customType.name.includes("전체") || customType.name.includes("건수")) {
                            lineData.value.chartInfo.seriesLeftYaxis.push(customType.name);
                        } else if(customType.name.includes("금액")) {
                            lineData.value.chartInfo.seriesRightYaxis.push(customType.name);
                        }

                        //check color for each series
                        let lineColor:any = chartColors.filter((item:any) => item.name == customType.name);
                        if(lineColor.length > 0) {
                            colors.push(lineColor[0].color);
                        }
                    }
                    lineData.value.chartInfo.colors = colors;
                    
                    //sort category
                    xaxisCategory.sort((x:string, y:string) => +moment(x) - +moment(y));

                    //add missing values
                    for(let customType of res) {
                        let currentCategory = [] as any;

                        for(let data of customType.data) {
                            currentCategory.push(data.x);
                        }

                        let missingCategory = xaxisCategory.filter((item:any) => !currentCategory.includes(item));

                        if(missingCategory.length > 0) {
                            for(let cat of missingCategory) {
                                let newData = {x: cat, y: 0};
                                customType.data.push(newData);
                            }
                        }
                    }

                    if(lineData.value.chartInfo.seriesRightYaxis.length > 0) {
                        lineData.value.chartInfo.yaxisTitleList.push("금액");
                    }

                    lineData.value.chartData = res;
                    lineData.value.chartInfo.key++;
                    lineData.value.chartInfo.showLoading = false;
                })
            }

            function checkCategory(label:string) {
                if(search.categories.length == 0 && label == 'All') {
                    return true;
                } else if(search.categories.includes(label)) {
                    return true;
                } else {
                    return false;
                }
            }

            function changeCategory(label:string) {
                if(label == 'All') {
                    search.categories = [];
                } else if(search.categories.includes(label)) {
                    let index = search.categories.indexOf(label);
                    search.categories.splice(index, 1);
                } else {
                    search.categories.push(label);
                }
            }

            function checkCustomType(value:string) {
                if(search.customType.includes(value)) {
                    return true;
                } else {
                    return false;
                }
            }

            function changeCustomType(value:string) {
                if(search.customType.includes(value)) {
                    let index = search.customType.indexOf(value);
                    search.customType.splice(index, 1);
                } else {
                    search.customType.push(value);
                }
            }

            function changePeriod() {
                if(search.period == "periodYesterday") {
                    search.showCustomDate = false;
                    search.startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                    search.endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                } else if(search.period == "periodWeek"){
                    search.showCustomDate = false;
                    search.startDate = moment().subtract(8, 'days').format('YYYY-MM-DD');
                    search.endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                } else if(search.period == "periodOne"){
                    search.showCustomDate = false;
                    search.startDate = moment().subtract(1, 'months').format('YYYY-MM-DD');
                    search.endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                } else if(search.period == "periodThree"){
                    search.showCustomDate = false;
                    search.startDate = moment().subtract(3, 'months').format('YYYY-MM-DD');
                    search.endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                } else if(search.period == "periodCustom"){
                    search.showCustomDate = true;
                    search.startDate = moment().format("YYYY-MM-DD");
                    search.endDate = moment().format("YYYY-MM-DD");
                }
            }

            function sendForm() {
                getCustomStatistic();
            }

            function resetForm() {
                search.categories = [];
                search.period = "periodYesterday";
                search.startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                search.endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                search.showCustomDate = false;
                search.customType = [];
            }

            getCategory();
            getCustomStatistic();

            onUnmounted(() => {
                ElMessage.closeAll();
            })

            return {
                category,
                period,
                search,
                lineData,
                checkCategory,
                changeCategory,
                changePeriod,
                checkCustomType,
                changeCustomType,
                sendForm,
                resetForm,
            }
        }
    })
</script>