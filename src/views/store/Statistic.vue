<template>
    <div>
        Store statistic 

        <div class="layout-content">

            <div class="content-title">
                <span>제휴 업체 분석</span>
                <h2>입점 업체 현황</h2>
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
                    <dt>연도 &#47; 월</dt>
                    <dd>
						<select v-model="search.year" style="margin-right: 7px;">
                            <option v-for="(y, index) in year" :key="index" :value="y"> {{ y }}년 </option>
						</select>
						<select v-model="search.month" >
                            <option value="">전체</option>
                            <option v-for="(month, index) in 12" :key="index" :value="month"> {{ month }}월 </option>
						</select>
                    </dd>
                </dl>
                <div class="filter-buttons">
                    <button type="submit" class="btn-h40 btn-primary" @click="getSearchData">검색</button>
                    <button type="button" class="btn-h40 btn-outline">초기화</button>
                </div>
            </form>
            <!--//form-filter-->

            <hr class="gutter-large">

            <div class="chart-wrap">
                <div class="chart-semiCircleGauge">
                    <div class="chart-area">
                        <loading-chart v-if="runStopSemiDonutData.chartInfo.showLoading" />
                        <semi-donut-wrapper v-else :data="runStopSemiDonutData" :key="runStopSemiDonutData.chartInfo.key"/>
                    </div>
                    <ul class="list-label">
                        <template v-for="(data, index) in runStopSemiDonutData.chartData" :key="index">
                            <li class="chart-label color-red" v-if="data.x == '승인'">
                                <h6>승인 &#58; {{ calculatePercentage(data.y, runStopSemiDonutData.chartInfo.totalValue) }}&#37;</h6>
                                <span>{{ numberFormatter(data.y) }}개</span>
                            </li>
                            <li class="chart-label color-red-light" v-if="data.x == '미승인'">
                                <h6>미승인 &#58; {{ calculatePercentage(data.y, runStopSemiDonutData.chartInfo.totalValue) }}&#37;</h6>
                                <span>{{ numberFormatter(data.y) }}개</span>
                            </li>
                        </template>
                    </ul>
                </div><!--//chart-semiCircleGauge-->
                <div class="chart-semiCircleGauge">
                    <div class="chart-area">
                        <loading-chart v-if="memberSemiDonutData.chartInfo.showLoading" />
                        <semi-donut-wrapper v-else :data="memberSemiDonutData" :key="memberSemiDonutData.chartInfo.key"/>
                    </div>
                    <ul class="list-label">
                        <template v-for="(data, index) in memberSemiDonutData.chartData" :key="index">
                            <li class="chart-label color-gray-dark" v-if="data.x == '회원사'">
                                <h6>회원사 &#58; {{ calculatePercentage(data.y, memberSemiDonutData.chartInfo.totalValue) }}&#37;</h6>
                                <span>{{ numberFormatter(data.y) }}개</span>
                            </li>
                            <li class="chart-label color-brown-gray" v-else-if="data.x == '비회원사'">
                                <h6>비회원사 &#58; {{ calculatePercentage(data.y, memberSemiDonutData.chartInfo.totalValue) }}&#37;</h6>
                                <span>{{ numberFormatter(data.y) }}개</span>
                            </li>
                        </template>
                    </ul>
                </div><!--//chart-semiCircleGauge-->
            </div>
            <!--//chart-wrap-->

            <hr class="gutter-large">

            <div class="section width-100">
                <h3>카테고리별 누적 업체 수</h3>
                <div class="chart chart-horizontal">
                    <div class="chart-area">
                        <loading-chart v-if="categoryLineData.chartInfo.showLoading" />
                        <line-chart-wrapper v-else :data="categoryLineData" :key="categoryLineData.chartInfo.key" />
                    </div>

                    <ul class="list-label" v-if="!categoryLineData.chartInfo.showLoading">
                        <template v-for="(data, index) in categoryLineData.chartData" :key="index">
                            <li class="chart-label-line color-customize" :style="'--customize-color:' + categoryLineData.chartInfo.colors[index] + ';'">	
                                <h6>{{ data.name }}</h6>
                            </li>		
                        </template>	
                    </ul>
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
                        <th scope="col" class="tc">기준월</th>
                        <th scope="col" class="tc">카테고리</th>
                        <th scope="col" class="tc">신규 업체수</th>
                        <th scope="col" class="tc">승인 업체수</th>
                        <th scope="col" class="tc">판매/거래 중지 업체수</th>
                        <th scope="col" class="tc">누적 업체수</th>
                        <th scope="col" class="tc">승인 업체 증감량</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!tableData.showTableData">
                        <th colspan="8" style="text-align: center">  
                            <el-icon class="is-loading loading-size"><loading /></el-icon>
                        </th>
                    </tr>
                    <tr v-else-if="tableData.data.length == 0">
                        <th colspan="8" style="text-align: center">  
                            데이터가 없습니다
                        </th>
                    </tr>
                    <tr v-else v-for="(data, index) in tableData.data" :key="index">
                        <th scope="row" class="tc">{{ numberFormatter(data.rowNo) }}</th>
                        <td class="fw-bold tc">{{ data.baseYearMonth }}</td>
                        <td>{{ data.categoryName }}</td>
                        <td class="tr">{{ numberFormatter(data.newCount) }}</td>
                        <td class="tr">{{ numberFormatter(data.storeRunCount) }}</td>
                        <td class="tr">{{ numberFormatter(data.storeStopCount) }}</td>
                        <td class="tr">{{ numberFormatter(data.storeCount) }}</td>
                        <td :class="checkGrowth(data.storeGrowth)">&nbsp; {{ checkValue(data.storeGrowth) }}</td>
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
    </div>
</template>

<script lang="ts">
    import { defineComponent, onUnmounted, reactive, ref } from "@vue/runtime-core";
    import { numberFormatter, calculatePercentage } from '@/utils/CommonUtils';
    import { Loading } from '@element-plus/icons';
    import moment from 'moment/moment';
    import Xlsx from 'xlsx';
    import codeService from '@/services/code/CodeServices';
    import storeService from '@/services/store/StoreService';
    import SemiDonutWrapper from '@/components/charts/pie/SemiDonutChartWrapper.vue';
    import LineChartWrapper from "@/components/charts/line/LineChartWrapper.vue";
    import LoadingChart from "@/components/charts/loading/Loading.vue";
import { ElMessage } from "element-plus";

    export default defineComponent({
		components: {
            "loading" : Loading,
            "semi-donut-wrapper" : SemiDonutWrapper,
            "line-chart-wrapper" : LineChartWrapper,
            "loading-chart" : LoadingChart
        },
		setup() {

            let showLoadingDownload = ref(false);

            let category = ref([]) as any;

            let year = [moment().year().toString()];

            let search = reactive({
                pageNumber: 1,
                isPaging: true,
                categoryList: [] as any,
                year: moment().year().toString(),
                month: "",
            });

            let runStopSemiDonutData = ref({
                chartData: [],
                chartInfo: {
                    key: 1,
                    chartType: "SEMI_DONUT",
                    chartValueUnit: "%",
                    height: "200",
                    width: "200",
                    showLegend: false,
                    colors: ["#DF4F49", "#E4B9B9"],
                    showTooltip: true,
                    showLabels: false,
                    totalValue: 0,
                    showLoading: false,
                },
            });

            let memberSemiDonutData = ref({
                chartData: [],
                chartInfo: {
                    key: 1,
                    chartType: "SEMI_DONUT",
                    chartValueUnit: "%",
                    height: "200",
                    width: "200",
                    showLegend: false,
                    colors: ["#2E2F2E", "#A59E96"],
                    showTooltip: true,
                    showLabels: false,
                    totalValue: 0,
                    showLoading: false,
                },
            });

            let categoryLineData = ref({
                chartData: [] as any,
                chartInfo: {
                    key: 1,
                    // height: "500",
                    width: "100%",
                    chartType: "LINE",
                    chartValueUnit: "%",
                    xaxisTitle: "",
                    yaxisTitleList: [] as any,
                    xaxisType: "categories", //datetime, categories, numeric
                    lineCurve: "smooth", // smooth, straight, stepline
                    colors: ["#EFEDEC", "#CCD2E0", "#A59E96", "#D2CECA", "#897B6B", "#2E2F2E", "#ABACAB", "#EECFB7", "#DF4F49", "#E4B9B9", "#B9958D"],
                    showLegend: false,
                    shareTooltip: true,
                    legendFontSize: '12px',
                    legendFontWeight: 700,
                    legendMarkersWidth: 6,
                    legendMarkersHeight: 6,
                    showLoading: false,
                }
            });

            let tableData = ref({
                data: [],
                recordsTotal: 0,
                lastPage: 1,
                showTableData: true,
            });
            
            function getYear() {
                let startYear = "2015";
                while (year[year.length-1] != startYear) {
                    let newYear = moment().set('year', Number(year[year.length-1])).subtract(1, 'year').year().toString();
                    year.push(newYear);
                }
            }

            function getCategory() {
                codeService.selectListByParentCode('COMP').then(res => {
                    category.value = res;
                })
            }

            function getSearchData() {
                getRunStopStatistic();
                getMemberStatistic();
                getCategoryStatistic();
                getStoreStatistic();
            }

            function getRunStopStatistic() {
                runStopSemiDonutData.value.chartInfo.showLoading = true;
                storeService.runStopStatistic(search).then(res => {
                    runStopSemiDonutData.value.chartInfo.totalValue = 0;
                    for(let data of res) {
                        runStopSemiDonutData.value.chartInfo.totalValue = runStopSemiDonutData.value.chartInfo.totalValue + data.y;
                    }
                    runStopSemiDonutData.value.chartData = res;
                    runStopSemiDonutData.value.chartInfo.key++;
                    runStopSemiDonutData.value.chartInfo.showLoading = false;
                })
            }

            function getMemberStatistic() {
                memberSemiDonutData.value.chartInfo.showLoading = true;
                storeService.memberStatistic(search).then(res => {
                    memberSemiDonutData.value.chartInfo.totalValue = 0;
                    for(let data of res) {
                        memberSemiDonutData.value.chartInfo.totalValue = memberSemiDonutData.value.chartInfo.totalValue + data.y;
                    }
                    memberSemiDonutData.value.chartData = res;
                    memberSemiDonutData.value.chartInfo.key++;
                    memberSemiDonutData.value.chartInfo.showLoading = false;
                })
            }
            
            function getCategoryStatistic() {
                categoryLineData.value.chartInfo.showLoading = true;
                storeService.categoryStatistic(search).then(res => {
                    for(let r of res) {
                        delete r.type;
                    }
                    categoryLineData.value.chartData = res;
                    categoryLineData.value.chartInfo.key++;
                    categoryLineData.value.chartInfo.showLoading = false;
                })
            }

            function getStoreStatistic() {
                tableData.value.showTableData = false;
                storeService.storeStatistic(search).then(res => {
                    tableData.value.data = res.data;
                    tableData.value.recordsTotal = res.recordsTotal;
                    tableData.value.lastPage = Math.ceil(res.recordsTotal/10);
                    tableData.value.showTableData = true;
                })
            }

            function handlePageChange(newPageNumber:number) {
                search.pageNumber = newPageNumber;
                tableData.value.showTableData = false;
                getSearchData();
            }

            function checkCategory(label:string) {
                if(search.categoryList.length == 0 && label == 'All') {
                    return true;
                } else if(search.categoryList.includes(label)) {
                    return true;
                } else {
                    return false;
                }
            }

            function changeCategory(label:string) {
                if(label == 'All') {
                    search.categoryList = [];
                } else if(search.categoryList.includes(label)) {
                    let index = search.categoryList.indexOf(label);
                    search.categoryList.splice(index, 1);
                } else {
                    search.categoryList.push(label);
                }
            }

            function checkGrowth(growth:number) {
                if(growth > 0) {
                    return "tr text-green"
                } else if(growth < 0) {
                    return "tr text-red"
                } else if(growth == 0) {
                    return "tr"
                }
            }

            function checkValue(value:number) {
                return numberFormatter(Math.abs(value));
            }

            function exportExcel() {
                let excelParam = {
                    pageNumber: 1,
                    isPaging: false,
                    categoryList: search.categoryList,
                    year: search.year,
                    month: search.month,
                }
                showLoadingDownload.value = true;
                storeService.storeStatisticExcel(excelParam).then(res => {
					const workBook = Xlsx.utils.book_new();
					let filtered = res.map(function(x: any) { delete x.rowNo; return x; });
                    const workSheet = Xlsx.utils.json_to_sheet(filtered);
                    const sheetName = "목록";
                    Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
                    Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName],
                        [// rename header
                            {   
                                corpId: "업체아이디", 
                                corpNm: "업체명",
                                corpCdNm: "업체분류", 
                                tradeStatusCdNm: "거래상태",
                                coRegNum: "사업자등록번호",
                                ceoTelNum: "대표전화" ,
                                rsvTelNum: "예약전화",
								faxNum: "팩스번호",
								corpEmail: "이메일",
								hmpgAddr: "홈페이지",
								ceoNm: "대표자명",
								hijejuMappingNum: "하이제주연개번호",
								asctMemYn: "회원사여부",
								branchNm: "분과명",
								roadNmAddr: "주소",
								dtlAddr: "상세주소",
								frstRegDttm: "등록 일시",
								bankNm: "은행명",
								accNum: "계좌번호",
								depositor: "예금주",
								admNm: "관리자명",
								admMobile: "관리자휴대폰",
								admTelnum: "관리자전화",
								admEmail: "관리자이메일",
								visitMappingYn: "비짓제주매핑여부",
								tamnacardMngYn: "탐나는전 가맹점여부"  
                            },
                        ],
                        {// locate header
                            header:[
								"corpId", "corpNm", "corpCdNm", "tradeStatusCdNm", "coRegNum", "ceoTelNum", "rsvTelNum", "faxNum",
								"corpEmail", "hmpgAddr", "ceoNm", "hijejuMappingNum", "asctMemYn", "branchNm", "roadNmAddr", "dtlAddr", "frstRegDttm",
								"bankNm", "accNum", "depositor", "admNm", "admMobile", "admTelnum", "admEmail", "visitMappingYn", "tamnacardMngYn"
							],
                            skipHeader: true,
                            origin: "A1",
                        }
                    );
					workBook.Sheets[sheetName]['!cols'] = [
						{wch:10}, {wch:30}, {wch:15}, {wch:10}, {wch:15}, {wch:15}, {wch:15}, {wch:15},
						{wch:30}, {wch:50}, {wch:10}, {wch:10}, {wch:20}, {wch:20}, {wch:50}, {wch:30}, {wch:20},
						{wch:15}, {wch:50}, {wch:25}, {wch:20}, {wch:20}, {wch:20}, {wch:25}, {wch:18}, {wch:18}
					]
                    
                    Xlsx.writeFile(workBook, "입점 업체 현황.xlsx");
                    showLoadingDownload.value = false;
                })
            }

            getYear();
            getCategory();
            getSearchData();

            onUnmounted(() => {
                ElMessage.closeAll();
            })

            return {
                showLoadingDownload,
                category,
                year,
                search,
                runStopSemiDonutData,
                memberSemiDonutData,
                categoryLineData,
                tableData,
                numberFormatter,
                calculatePercentage,
                getSearchData,
                handlePageChange,
                checkCategory,
                changeCategory,
                checkGrowth,
                checkValue,
                exportExcel
            }
        }
    })
</script>

<style scoped>
    .text-green:before {
        content: "\25B2";
    }

    .text-red:before {
        content: "\25BC"
    }

    .chart-label-line.color-customize:before {
        content: ""; 
        display: block; 
        position: absolute; 
        top: 50%; 
        left: 0; 
        width: 20px; 
        height: 2px; 
        margin-top: -1px; 
        background-color: var(--customize-color);
    }

    .chart-horizontal .list-label { 
        min-width: 150px; 
    }


</style>