<template>
    <div> 	
        <div class="layout-content">
            <div class="content-title">
                <span>제휴 업체 분석</span>
                <h2>업체별 매출 통계</h2>
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
                    <dt>업체명</dt>
                    <dd>
                        <input type="text" class="width-100" v-model="search.storeName">
                    </dd>
                </dl>
                <div class="filter-buttons">
                    <button type="submit" class="btn-h40 btn-primary" @click="sendForm">검색</button>
                    <button type="button" class="btn-h40 btn-outline" @click="resetForm">초기화</button>
                </div>
            </form>
            <!--//form-filter-->

            <hr class="gutter-large">

            <div class="section width-100">
                <div class="chart">
                    
                    <div class="chart-area">
                        <!--아래 이미지를 chart로 바꿔주세요.
                            1. 너비 : 가변 100%
                            2. 높이 : 231px
                        -->
                        <loading-chart v-if="categorySalesLineColumnData.chartInfo.showLoading" />
                        <line-column-chart-wrapper v-else :data="categorySalesLineColumnData" :key="categorySalesLineColumnData.chartInfo.key"/>
                    </div>
                </div>
            </div><!--//section-->

            <hr class="gutter-medium">

            <table class="table caption-top table-borderless">
                <caption>
                    <span>검색 결과 {{ tableData.recordsTotal }}건</span>
                    <button type="button" class="btn-h32 btn-outline" v-if="!showLoadingDownload" @click="exportExcel">Excel 다운로드 </button>
                    <button type="button" class="btn-h32 btn-outline" v-else disabled style="cursor: wait;">
                        <el-icon class="is-loading"><loading /></el-icon> Excel 다운로드 
                    </button>
                </caption>
                <thead>
                    <tr>
                        <th scope="col" class="tc">번호</th>
                        <th scope="col" class="tc">카테고리</th>
                        <th scope="col" class="tc">업체명</th>
                        <th scope="col" class="tc">판매 금액</th>
                        <th scope="col" class="tc">취소 금액</th>
                        <th scope="col" class="tc">판매 수</th>
                        <th scope="col" class="tc">취소 수</th>
						<th scope="col" class="tc">취소율</th>
                        <th scope="col" class="tc">취소 수수료</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!tableData.showTableData">
                        <th colspan="9" style="text-align: center">  
                            <el-icon class="is-loading loading-size"><loading /></el-icon>
                        </th>
                    </tr>
                    <tr v-else-if="tableData.data.length == 0">
                        <th colspan="9" style="text-align: center">  
                            데이터가 없습니다
                        </th>
                    </tr>
                    <tr v-else v-for="(data, index) in tableData.data" :key="index">
                        <th scope="row" class="tc">{{ numberFormatter(data.rowNo) }}</th>
                        <td class="tc">{{ data.categoryName }}</td>
                        <td class="fw-bold"><a data-bs-toggle="modal" data-bs-target="#modalPartnerSales001" @click="displayModal(data.corpId)" class="tu">{{ data.storeName }}</a></td>
                        <td class="tr">{{ numberFormatter(data.reserveAmount) }}</td>
                        <td class="tr">{{ numberFormatter(data.cancelAmount) }}</td>
                        <td class="tr">{{ numberFormatter(data.reserveCount) }}</td>
                        <td class="tr">{{ numberFormatter(data.cancelCount) }}</td>
                        <td class="tr">{{ numberFormatter(data.cancelRate) }}%</td>
                        <td class="tr">{{ numberFormatter(data.cancelCommission) }}</td>
                    </tr>
                    <tr class="border-double"><!--마지막 줄 tr에 border-double 클래스를 넣어주세요.-->
                        <th scope="row" colspan="3" class="tc fw-bold">합계</th>
                        <td class="tr">{{ numberFormatter(tableData.totalReserveAmount) }}</td>
                        <td class="tr">{{ numberFormatter(tableData.totalCancelAmount) }}</td>
                        <td class="tr">{{ numberFormatter(tableData.totalReserveCount) }}</td>
                        <td class="tr">{{ numberFormatter(tableData.totalCancelCount) }}</td>
						<td class="tr">&nbsp;</td>
                        <td class="tr">{{ numberFormatter(tableData.totalCancelCommission) }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="pagination justify-content-center">
                <li @click="handlePageChange(1)" v-if="search.pageNumber > 1">
                    <i class="arrow-page">first_page</i>
                </li>
                <li @click="handlePageChange(search.pageNumber - 1)" v-if="search.pageNumber > 1">
                    <i class="arrow-page">chevron_left</i>
                </li>		
                <el-pagination
                    class="elpagination"
                    layout="pager"
                    :total="tableData.recordsTotal"
                    :current-page="search.pageNumber"
                    @current-change="handlePageChange"
                />
                <li @click="handlePageChange(search.pageNumber + 1)" v-if="search.pageNumber < tableData.lastPage">
                    <i class="arrow-page">chevron_right</i>
                </li>	
                <li @click="handlePageChange(tableData.lastPage)"  v-if="search.pageNumber < tableData.lastPage">
                    <i class="arrow-page">last_page</i>
                </li>
            </div><!--//pagination-->

        </div>
        <!--//layout-content-->

        <!-- Modal -->
        <div class="modal fade" id="modalPartnerSales001" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">업체별 이용 고객</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">close</button>
                    </div>
                    <div class="modal-body">
                        <hr class="gutter-medium bt-dark">

                        <div class="chart-row-4">
                            <div class="section">
                                <h3>성별 구매수</h3>
                                <div class="chart-simpleDonut simpleDonut-small">
                                    
                                    <div class="chart-area align-left donut-chart">
                                        <!--아래 이미지를 chart로 바꿔주세요.
                                            1. 크기 : 가로/세로 120px 고정
                                        -->
                                        <loading-chart v-if="sexSalesCountDonutData.chartInfo.showLoading" />
                                        <gradient-donut-chart-wrapper v-else :data="sexSalesCountDonutData" :key="sexSalesCountDonutData.chartInfo.key"/>
                                    </div> 
                    
                                    <ul class="list-label label-column2">
                                        <template v-for="(data, index) in sexSalesCountDonutData.chartData[0].data" :key="index">
                                            <li class="chart-label color-red-light" v-if="data.x == '남'">
                                                <h6>남자 &#58; {{ calculatePercentage(data.y, sexSalesCountDonutData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}건</span>
                                            </li>
                                            <li class="chart-label color-red" v-else-if="data.x == '여'">
                                                <h6>여자 &#58; {{ calculatePercentage(data.y, sexSalesCountDonutData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}건</span>
                                            </li>
                                            <li class="chart-label color-red-brown-gray" v-else-if="data.x == '알 수 없음'">
                                                <h6>알 수 없음 &#58; {{ calculatePercentage(data.y, sexSalesCountDonutData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}건</span>
                                            </li>
                                        </template>
                                    </ul>
                                </div>
                            </div><!--//section-->
                            <div class="section">
                                <h3>성별 매출액</h3>
                                <div class="chart-simpleDonut simpleDonut-small">
                                    
                                    <div class="chart-area align-left donut-chart">
                                        <!--아래 이미지를 chart로 바꿔주세요.
                                            1. 크기 : 가로/세로 120px 고정
                                        -->
                                        <loading-chart v-if="sexSalesAmountDonutData.chartInfo.showLoading" />
                                        <gradient-donut-chart-wrapper v-else :data="sexSalesAmountDonutData" :key="sexSalesAmountDonutData.chartInfo.key"/>
                                    </div>
                    
                                    <ul class="list-label label-column2">
                                        <template v-for="(data, index) in sexSalesAmountDonutData.chartData[0].data" :key="index">
                                            <li class="chart-label color-red-light" v-if="data.x == '남'">
                                                <h6>남자 &#58; {{ calculatePercentage(data.y, sexSalesAmountDonutData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}원</span>
                                            </li>
                                            <li class="chart-label color-red" v-else-if="data.x == '여'">
                                                <h6>여자 &#58; {{ calculatePercentage(data.y, sexSalesAmountDonutData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}원</span>
                                            </li>
                                            <li class="chart-label color-red-brown-gray" v-else-if="data.x == '알 수 없음'">
                                                <h6>알 수 없음 &#58; {{ calculatePercentage(data.y, sexSalesAmountDonutData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}원</span>
                                            </li>
                                        </template>
                                    </ul>
                                </div>
                            </div><!--//section-->
                    
                            <div class="section">
                                <h3>연령별 구매수</h3>
                                <div class="chart">
                                    
                                    <div class="chart-area">
                                        <!--아래 이미지를 chart로 바꿔주세요.
                                            1. 크기 : 가로 216px / 세로 120px 고정
                                        -->
                                        <loading-chart v-if="ageGroupSalesCountColumnData.chartInfo.showLoading" />
                                        <basic-column-chart-wrapper v-else :data="ageGroupSalesCountColumnData" :key="ageGroupSalesCountColumnData.chartInfo.key"/>
                                    </div>
                    
                                    <ul class="list-label label-column2">
                                        <template v-for="(data, index) in ageGroupSalesCountColumnData.chartData[0].data" :key="index">
                                            <li class="chart-label color-gray-10" v-if="data.x == '10세 미만'">
                                                <h6>10대 미만 &#58; {{ calculatePercentage(data.y, ageGroupSalesCountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}건</span>
                                            </li>
                                            <li class="chart-label color-gray-25" v-else-if="data.x == '10대'">
                                                <h6>10대 &#58; {{ calculatePercentage(data.y, ageGroupSalesCountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}건</span>
                                            </li>
                                            <li class="chart-label color-gray-40" v-else-if="data.x == '20대'">
                                                <h6>20대 &#58; {{ calculatePercentage(data.y, ageGroupSalesCountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}건</span>
                                            </li>
                                            <li class="chart-label color-gray-55" v-else-if="data.x == '30대'">
                                                <h6>30대 &#58; {{ calculatePercentage(data.y, ageGroupSalesCountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}건</span>
                                            </li>
                                            <li class="chart-label color-gray-70" v-else-if="data.x == '40대'">
                                                <h6>40대 &#58; {{ calculatePercentage(data.y, ageGroupSalesCountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}건</span>
                                            </li>
                                            <li class="chart-label color-gray-85" v-else-if="data.x == '50대'">
                                                <h6>50대 &#58; {{ calculatePercentage(data.y, ageGroupSalesCountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}건</span>
                                            </li>
                                            <li class="chart-label color-gray-dark" v-else-if="data.x == '60대 이상'">
                                                <h6>60대 이상 &#58; {{ calculatePercentage(data.y, ageGroupSalesCountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}건</span>
                                            </li>
                                            <li class="chart-label color-brown-gray" v-else-if="data.x == '알 수 없음'">
                                                <h6>알 수 없음 &#58; {{ calculatePercentage(data.y, ageGroupSalesCountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}건</span>
                                            </li>
                                        </template>
                                    </ul>
                                </div>
                            </div><!--//section-->
                            <div class="section">
                                <h3>연령별 매출액</h3>
                                <div class="chart">
                                    
                                    <div class="chart-area">
                                        <!--아래 이미지를 chart로 바꿔주세요.
                                            1. 크기 : 가로 216px / 세로 120px 고정
                                        -->
                                        <loading-chart v-if="ageGroupSalesAmountColumnData.chartInfo.showLoading" />
                                        <basic-column-chart-wrapper v-else :data="ageGroupSalesAmountColumnData" :key="ageGroupSalesAmountColumnData.chartInfo.key"/>
                                    </div>
                    
                                    <ul class="list-label label-column2">
                                        <template v-for="(data, index) in ageGroupSalesAmountColumnData.chartData[0].data" :key="index">
                                            <li class="chart-label color-gray-10" v-if="data.x == '10세 미만'">
                                                <h6>10대 미만 &#58; {{ calculatePercentage(data.y, ageGroupSalesAmountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}원</span>
                                            </li>
                                            <li class="chart-label color-gray-25" v-else-if="data.x == '10대'">
                                                <h6>10대 &#58; {{ calculatePercentage(data.y, ageGroupSalesAmountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}원</span>
                                            </li>
                                            <li class="chart-label color-gray-40" v-else-if="data.x == '20대'">
                                                <h6>20대 &#58; {{ calculatePercentage(data.y, ageGroupSalesAmountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}원</span>
                                            </li>
                                            <li class="chart-label color-gray-55" v-else-if="data.x == '30대'">
                                                <h6>30대 &#58; {{ calculatePercentage(data.y, ageGroupSalesAmountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}원</span>
                                            </li>
                                            <li class="chart-label color-gray-70" v-else-if="data.x == '40대'">
                                                <h6>40대 &#58; {{ calculatePercentage(data.y, ageGroupSalesAmountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}원</span>
                                            </li>
                                            <li class="chart-label color-gray-85" v-else-if="data.x == '50대'">
                                                <h6>50대 &#58; {{ calculatePercentage(data.y, ageGroupSalesAmountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}원</span>
                                            </li>
                                            <li class="chart-label color-gray-dark" v-else-if="data.x == '60대 이상'">
                                                <h6>60대 이상 &#58; {{ calculatePercentage(data.y, ageGroupSalesAmountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}원</span>
                                            </li>
                                            <li class="chart-label color-brown-gray" v-else-if="data.x == '알 수 없음'">
                                                <h6>알 수 없음 &#58; {{ calculatePercentage(data.y, ageGroupSalesAmountColumnData.chartInfo.totalValue) }}&#37;</h6>
                                                <span>{{ numberFormatter(data.y) }}원</span>
                                            </li>
                                        </template> 
                                    </ul>
                                </div>
                            </div><!--//section-->
                        </div><!--//chart-row-4-->

                        <hr class="gutter-large">

                        <div class="section">
                            <h3>지역별 구매수 &#47; 매출액</h3>
                            <div class="chart">
                                <div class="chart-area">
                                    <!--아래 이미지를 chart로 바꿔주세요.
                                        1. 너비 : 가변 100%
                                        2. 높이 : 271px
                                    -->
                                    <loading-chart v-if="sidoLineColumnData.chartInfo.showLoading" />
                                    <line-column-chart-wrapper :data="sidoLineColumnData" :key="sidoLineColumnData.chartInfo.key" />
                                </div>
                            </div>
                        </div><!--//section-->

                        <hr class="gutter-large">

                        <div class="section">
                            <h3>월별 구매수 &#47; 매출액</h3>
                            <div class="chart">
                                
                                <div class="chart-area">
                                    <!--아래 이미지를 chart로 바꿔주세요.
                                        1. 너비 : 가변 100%
                                        2. 높이 : 271px
                                    -->
                                    <loading-chart v-if="monthLineColumnData.chartInfo.showLoading" />
                                    <line-column-chart-wrapper :data="monthLineColumnData" :key="monthLineColumnData.chartInfo.key" />
                                </div>
                            </div>
                        </div><!--//section-->

                    </div><!--//modal-body-->
                </div>
            </div>
        </div>
        <!--//modal-->
    </div>
</template>

<script lang="ts">
    import { defineComponent, onUnmounted, reactive, ref } from "@vue/runtime-core";
    import { Loading } from '@element-plus/icons';
    import { numberFormatter, calculatePercentage } from '@/utils/CommonUtils';
    import Xlsx from 'xlsx';
    import moment from "moment/moment";
    import codeService from '@/services/code/CodeServices';
    import storeService from '@/services/store/StoreService';
    import LoadingChart from "@/components/charts/loading/Loading.vue";
    import GradientDonutChartWrapper from "@/components/charts/pie/GradientDonutChartWrapper.vue";
    import BasicColumnChartWrapper from "@/components/charts/column/BasicColumnChartWrapper.vue";
    import LineColumnChartWrapper from "@/components/charts/mixed/LineColumnChartWrapper.vue"
import { ElMessage } from "element-plus";

    export default defineComponent({
		components: {
            "loading" : Loading,
            "loading-chart" : LoadingChart,
            "gradient-donut-chart-wrapper" : GradientDonutChartWrapper,
            "basic-column-chart-wrapper" : BasicColumnChartWrapper,
            "line-column-chart-wrapper" : LineColumnChartWrapper
        },
		setup() {
            let showLoadingDownload = ref(false);

            let category = ref([]) as any;

            let period = [
                { value: "periodYesterday", name: "어제" },
                { value: "periodWeek", name: "1주일" },
                { value: "periodOne", name: "1개월" },
                { value: "periodThree", name: "3개월" }, 
                { value: "periodCustom", name: "사용자 설정" }, 	
            ]

            let search = reactive({
                pageNumber: 1,
                isPaging: true,
                categories: [] as any,
                startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                storeName: "",
                period: "periodYesterday",
                showCustomDate: false,
                corpId: "",
            });

            let tableData = ref({
                data: [],
                recordsTotal: 0,
                lastPage: 1,
                showTableData: true,
                totalReserveCount: 0,
                totalReserveAmount: 0,
                totalCancelCount: 0,
                totalCancelAmount: 0,
                totalCancelCommission: 0,
            });

            let sexSalesCountDonutData = ref({
				chartInfo: {
                    key: 1,
					width: "200%",
					chartType: "DONUT",
                    showTooltip: true,
                    showLabels: false,
                    showLegend: false,
                    colors: ["#E4B9B9", "#DF4F49", "#B9958D"],
                    totalValue: 0,
                    showLoading: false,
				},
				chartData: [
					{
						name: "",
						type: "DONUT",
						data: [],
                    }
                ]
            });

            let sexSalesAmountDonutData = ref({
				chartInfo: {
                    key: 1,
					width: "200%",
					chartType: "DONUT",
                    showTooltip: true,
                    showLabels: false,
                    showLegend: false,
                    colors: ["#E4B9B9", "#DF4F49", "#B9958D"],
                    totalValue: 0,
                    showLoading: false,
				},
				chartData: [
					{
						name: "",
						type: "DONUT",
						data: [],
                    }
                ]
            });

            let ageGroupSalesCountColumnData = ref({
				chartInfo: {
                    key: 1,
					height: "216px",
                    width: "100%",
					chartType: "BAR",
					chartValueUnit: "",
					yaxisName: "",
					xaxisTitle: "",
					yaxisTitleList: [],
					xaxisType: "categories",
                    colors: ["rgba(46, 47, 46, 0.1)", "rgba(46, 47, 46, 0.25)", "rgba(46, 47, 46, 0.4)", "rgba(46, 47, 46, 0.55)", "rgba(46, 47, 46, 0.7)", "rgba(46, 47, 46, 0.85)", "#2E2F2E", "#A59E96"],
                    showLegend: false,
                    // showXaxisBorder: true,
                    // showXaxisLabels: false,
                    // showXaxisTicks: false,
                    // showYaxis: false,
                    // showGrid: false,
					// columnWidth: "25",
					borderRadius: 5,
                    columnDistributed: true,
                    totalValue: 0,
                    showLoading: false,
                },
				chartData: [
                    {
                        name: "",
                        type: "bar",
                        data: [] as any,
                    }
                ],        
            });

            let ageGroupSalesAmountColumnData = ref({
				chartInfo: {
                    key: 1,
					height: "216px",
                    width: "100%",
					chartType: "BAR",
					chartValueUnit: "",
					yaxisName: "",
					xaxisTitle: "",
					yaxisTitleList: [],
					xaxisType: "categories",
                    colors: ["rgba(46, 47, 46, 0.1)", "rgba(46, 47, 46, 0.25)", "rgba(46, 47, 46, 0.4)", "rgba(46, 47, 46, 0.55)", "rgba(46, 47, 46, 0.7)", "rgba(46, 47, 46, 0.85)", "#2E2F2E", "#A59E96"],
                    showLegend: false,
                    // showXaxisBorder: true,
                    // showXaxisLabels: false,
                    // showXaxisTicks: false,
                    // showYaxis: false,
                    // showGrid: false,
					// columnWidth: "25",
					borderRadius: 5,
                    columnDistributed: true,
                    totalValue: 0,
                    showLoading: false,
                },
				chartData: [
                    {
                        name: "",
                        type: "bar",
                        data: [] as any,
                    }
                ],        
            });

            let sidoLineColumnData = ref({
                chartData: [] as any,
                chartInfo: {
                    key: 1,
                    height: "271px",
                    width: "100%",
                    chartType: "LINE_COLUMN",
                    chartValueUnit: "",
                    yaxisTitleList: ["구매수", "매출액"],
                    xaxisTitle: "",
                    xaxisType: "categories", //categories, datetime, numeric
                    colors: ["#E4B9B9", "#DF4F49"],
                    showLoading: false,
                    legendFontSize: '12px',
                    legendFontWeight: 700,
                    legendMarkersWidth: 6,
                    legendMarkersHeight: 6,
                    // columnWidth: "25%",
                }
            })

            let monthLineColumnData = ref({
                chartData: [] as any,
                chartInfo: {
                    key: 1,
                    height: "271px",
                    width: "100%",
                    chartType: "LINE_COLUMN",
                    chartValueUnit: "",
                    yaxisTitleList: ["구매수", "매출액"],
                    xaxisTitle: "",
                    xaxisType: "categories", //categories, datetime, numeric
                    colors: ["#D2CECA", "#2E2F2E"],
                    showLoading: false,
                    legendFontSize: '12px',
                    legendFontWeight: 700,
                    legendMarkersWidth: 6,
                    legendMarkersHeight: 6,
                    columnWidth: "25%",
                }
            })

            let categorySalesLineColumnData = ref({
                chartData: [] as any,
                chartInfo: {
                    key: 1,
                    // height: "271px",
                    width: "100%",
                    chartType: "LINE_COLUMN",
                    chartValueUnit: "",
                    yaxisTitleList: ["판매금액&취소금액", "판매건수&취소건수"],
                    xaxisTitle: "",
                    xaxisType: "categories", //categories, datetime, numeric
                    colors: ["#FBEDEC", "#F7D3D1", "#F2B9B6", "#EE9E9B"],
                    showLoading: false,
                    legendFontSize: '12px',
                    legendFontWeight: 700,
                    legendMarkersWidth: 6,
                    legendMarkersHeight: 6,
					strokeWidth: [0, 0, 3, 3],
                }
            })

            function getCategory() {
                codeService.selectListByParentCode('COMP').then(res => {
                    category.value = res;
                });
            }

            function getStoreSales() {
                tableData.value.showTableData = false;
                tableData.value.totalReserveCount = 0;
                tableData.value.totalReserveAmount = 0;
                tableData.value.totalCancelCount = 0;
                tableData.value.totalCancelAmount = 0;
                tableData.value.totalCancelCommission = 0;
                storeService.storeSales(search).then(res => {
                    tableData.value.data = res.data;
                    tableData.value.recordsTotal = res.recordsTotal;
                    tableData.value.lastPage = Math.ceil(res.recordsTotal/10);
                    tableData.value.showTableData = true;

                    for(let data of res.data) {
                        tableData.value.totalReserveCount = tableData.value.totalReserveCount + data.reserveCount;
                        tableData.value.totalReserveAmount = tableData.value.totalReserveAmount + data.reserveAmount;
                        tableData.value.totalCancelCount = tableData.value.totalCancelCount + data.cancelCount;
                        tableData.value.totalCancelAmount = tableData.value.totalCancelAmount + data.cancelAmount;
                        tableData.value.totalCancelCommission = tableData.value.totalCancelCommission + data.cancelCommission;
                    }
                })
            }

            function getSexSalesCount() {
                sexSalesCountDonutData.value.chartInfo.showLoading = true;
                storeService.sexSalesCount(search).then(res => {
                    sexSalesCountDonutData.value.chartData[0].data = res;
                    sexSalesCountDonutData.value.chartInfo.key++;
                    sexSalesCountDonutData.value.chartInfo.totalValue = 0;
                    for(let data of res) {
                        sexSalesCountDonutData.value.chartInfo.totalValue = sexSalesCountDonutData.value.chartInfo.totalValue + data.y;
                    }
                    sexSalesCountDonutData.value.chartInfo.showLoading = false;
                })
                
            }

            function getSexSalesAmount() {
                sexSalesAmountDonutData.value.chartInfo.showLoading = true;
                storeService.sexSalesAmount(search).then(res => {
                    sexSalesAmountDonutData.value.chartData[0].data = res;
                    sexSalesAmountDonutData.value.chartInfo.key++;
                    sexSalesAmountDonutData.value.chartInfo.totalValue = 0;
                    for(let data of res) {
                        sexSalesAmountDonutData.value.chartInfo.totalValue = sexSalesAmountDonutData.value.chartInfo.totalValue + data.y;
                    }
                    sexSalesAmountDonutData.value.chartInfo.showLoading = false;
                })
            }

            function getAgeGroupSalesCount() {
                ageGroupSalesCountColumnData.value.chartInfo.showLoading = true;
                storeService.ageGroupSalesCount(search).then(res => {
                    ageGroupSalesCountColumnData.value.chartData[0].data = res;
                    ageGroupSalesCountColumnData.value.chartInfo.key++;
                    ageGroupSalesCountColumnData.value.chartInfo.totalValue = 0; 
                    for(let data of res) {
                        ageGroupSalesCountColumnData.value.chartInfo.totalValue = ageGroupSalesCountColumnData.value.chartInfo.totalValue + data.y;
                    }
                    ageGroupSalesCountColumnData.value.chartInfo.showLoading = false;
                })
            }

            function getAgeGroupSalesAmount() {
                ageGroupSalesAmountColumnData.value.chartInfo.showLoading = true;
                storeService.ageGroupSalesAmount(search).then(res => {
                    ageGroupSalesAmountColumnData.value.chartData[0].data = res;
                    ageGroupSalesAmountColumnData.value.chartInfo.key++;
                    ageGroupSalesAmountColumnData.value.chartInfo.totalValue = 0;
                    for(let data of res) {
                        ageGroupSalesAmountColumnData.value.chartInfo.totalValue = ageGroupSalesAmountColumnData.value.chartInfo.totalValue + data.y;
                    }
                    ageGroupSalesAmountColumnData.value.chartInfo.showLoading = false;
                })
            }

            function getSidoSales() {
                sidoLineColumnData.value.chartInfo.showLoading = true;
                storeService.sidoSales(search).then(res => {
                    sidoLineColumnData.value.chartInfo.key++;
                    sidoLineColumnData.value.chartInfo.showLoading = false;
                    sidoLineColumnData.value.chartData = res;
                })
            }

            function getMonthSales() {
                monthLineColumnData.value.chartInfo.showLoading = true;
                storeService.monthSales(search).then(res => {
                    monthLineColumnData.value.chartInfo.key++;
                    monthLineColumnData.value.chartInfo.showLoading = false;
                    monthLineColumnData.value.chartData = res;

                })
            }

            function getCategorySalesAmountCount() {
                categorySalesLineColumnData.value.chartInfo.showLoading = true;
                storeService.storeCategorySalesAmountCount(search).then(res => {
                    let half = Math.round(res.length / 2);
                    for(let index in res) {
                        if(Number(index) < half) {
                            res[index].type = "bar";
                        } else {
                            res[index].type = "line";
                        }
                    }
                    categorySalesLineColumnData.value.chartData = res;
                    categorySalesLineColumnData.value.chartInfo.key++;
                    categorySalesLineColumnData.value.chartInfo.showLoading = false;
                })
            }

            function getSearchData() {
                getStoreSales();
                getCategorySalesAmountCount();
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

            function handlePageChange(newPageNumber:number) {
                search.pageNumber = newPageNumber;
                tableData.value.showTableData = false;
                getSearchData();
            }

            function exportExcel() {
                let excelParam = {
                    pageNumber: 1,
                    isPaging: false,
                    categories: search.categories,
                    startDate: search.startDate,
                    endDate: search.endDate,
                    storeName: search.storeName,
                }

                showLoadingDownload.value = true;
                storeService.storeSalesExcel(excelParam).then(res => {

                    let totalReserveAmount = 0;
                    let totalCancelAmount = 0;
                    let totalReserveCount = 0;
                    let totalCancelCount = 0;
                    let totalCancelCommission = 0;

                    for(let data of res.data) {
                        totalReserveAmount = totalReserveAmount + data.reserveAmount;
                        totalCancelAmount = totalCancelAmount + data.cancelAmount;
                        totalReserveCount = totalReserveCount + data.reserveCount;
                        totalCancelCount = totalCancelCount + data.cancelCount;
                        totalCancelCommission = totalCancelCommission + data.cancelCommission;
                    }

                    const workBook = Xlsx.utils.book_new();
					let filtered = res.data.map(function(x: any) { delete x.corpId; return x; });
                    const workSheet = Xlsx.utils.json_to_sheet(filtered);
					const sheetName = "목록";
                    Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
                    Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName],
                        [// rename header
                            {   rowNo: "번호", 
                                categoryName: "카테고리", 
                                storeName: "업체명",
                                reserveAmount: "판매 금액",
                                cancelAmount: "취소 금액" ,
                                reserveCount: "판매수", 
                                cancelCount: "취소 수",
								cancelRate: "취소율 (%)",
                                cancelCommission: "취소 수수료"  
                            },
                        ],
                        {// locate header
                            header:["rowNo", "categoryName", "storeName", "reserveAmount", "cancelAmount", "reserveCount", "cancelCount", "cancelRate", "cancelCommission"],
                            skipHeader: true,
                            origin: "A1",
                        }
                    );

                    // add total calculation
                    Xlsx.utils.sheet_add_aoa(workBook.Sheets[sheetName], [
                    [   
                        "합계", 
                        totalReserveAmount, 
                        totalCancelAmount, 
                        totalReserveCount,
                        totalCancelCount,
                        "",
                        totalCancelCommission,
                    ]
                    ], {origin: {r:-1, c:2}});
                    
                    let range = Xlsx.utils.decode_range(workBook.Sheets[sheetName]['!ref'] || '');
                    let lastRow = range.e.r - range.s.r;

                    // merge cells
                    const merge = [{ s: { r: lastRow, c: 0 }, e: { r: lastRow, c: 2 } }];
                    workBook.Sheets[sheetName]['!merges'] = merge;
                    
                    Xlsx.writeFile(workBook, "업체별 매출 통계.xlsx");
                    showLoadingDownload.value = false;
                })
            }

            function displayModal(corpId:string) {
                search.corpId = corpId;

                getSexSalesCount();
                getSexSalesAmount();
                getAgeGroupSalesCount();
                getAgeGroupSalesAmount();
                getSidoSales();
                getMonthSales();
            }

            function sendForm() {
                getSearchData();
            }

            function resetForm() {
                search.pageNumber = 1;
                search.isPaging = true;
                search.categories = [];
                search.startDate = "";
                search.endDate = "";
                search.storeName ="";
            }

            getCategory();
            getSearchData();

            onUnmounted(() => {
                ElMessage.closeAll();
            })

            return {
                showLoadingDownload,
                category,
                period,
                search,
                tableData,
                sexSalesCountDonutData,
                sexSalesAmountDonutData,
                ageGroupSalesCountColumnData,
                ageGroupSalesAmountColumnData,
                sidoLineColumnData,
                monthLineColumnData,
                categorySalesLineColumnData,
                numberFormatter,
                calculatePercentage,
                checkCategory,
                changeCategory,
                changePeriod,
                handlePageChange,
                exportExcel,
                displayModal,
                sendForm,
                resetForm,
            }
        }
    })
</script>

<style>
    .modal-header {
        display: block !important;
        border-bottom: none !important;
    }

    .chart-simpleDonut .list-label { 
        margin-left: 0px !important; 
    }

    .chart-row-4 > .section {
        margin-left: 0% !important;
    }

    .donut-chart {
        height: 227px !important;
    }
	a.tu { text-decoration: underline !important;}
</style>