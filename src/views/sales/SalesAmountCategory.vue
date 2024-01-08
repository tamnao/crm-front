<template>
    <div>
        <div class="layout-content">

            <div class="content-title">
                <span>매출 분석</span>
                <h2>카테고리별 매출 비교</h2>
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
                    <button type="button" class="btn-h40 btn-outline" @click="resetForm">초기화</button>
                </div>
            </form>
            <!--//form-filter-->

            <hr class="gutter-large">

            <div class="chart">
                <div class="chart-area">
                    <!--아래 이미지를 chart로 바꿔주세요.
                        1. 너비 : 가변 100%
                        2. 높이 : 271px
                        3. 차트 두께 : 
                            - 라인 : 2px
                            - 막대 : 20px
                        4. 색상
                            - 삘강 : #DF4F49
                            - 밝은 회색 : #EFEDEC
                    -->
                    <loading-chart v-if="categoryLineColumnData.chartInfo.showLoading" />
                    <line-column-chart-wrapper v-else :data="categoryLineColumnData" :key="categoryLineColumnData.chartInfo.key" />
                </div>
            </div><!--//chart-->

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
                        <!-- <th scope="col" class="tc">번호</th> -->
                        <th scope="col" class="tc">카테고리</th>
                        <th scope="col" class="tc">매출</th>
                        <th scope="col" class="tc">전년 동일 기간 매출</th>
                        <th scope="col" class="tc">증감량</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!tableData.showTableData">
                        <th colspan="4" style="text-align: center">  
                            <el-icon class="is-loading loading-size"><loading /></el-icon>
                        </th>
                    </tr>
                    <tr v-else-if="tableData.data.length == 0">
                        <th colspan="4" style="text-align: center">  
                            데이터가 없습니다
                        </th>
                    </tr>
                    <tr v-else v-for="(data, index) in tableData.data" :key="index">
                        <!-- <th scope="row" class="tc">{{ data.rowNo }}</th> -->
                        <td class="fw-bold tc">{{ data.category}}</td>
                        <td class="tr">{{ numberFormatter(data.salesAmount) }}</td>
                        <td class="tr">{{ numberFormatter(data.salesAmountLastYear) }}</td>
                        <td :class="checkClassValue(data.growth)">&nbsp; {{ checkValue(data.growth) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--//layout-content-->
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, reactive, onUnmounted } from "vue-demi";
    import { numberFormatter } from '@/utils/CommonUtils';
    import { Loading } from '@element-plus/icons';
    import moment from "moment/moment";
    import Xlsx from 'xlsx';
    import codeService from '@/services/code/CodeServices';
    import saleService from '@/services/sales/SalesService';
    import LoadingChart from "@/components/charts/loading/Loading.vue";
    import LineColumnChartWrapper from "@/components/charts/mixed/LineColumnChartWrapper.vue"
import { ElMessage } from "element-plus";

    export default defineComponent({
        components: {
            "loading" : Loading,
            "loading-chart" : LoadingChart,
            "line-column-chart-wrapper" : LineColumnChartWrapper,
        },
        setup() {

            let showLoadingDownload = ref(false);

            let category = ref([]) as any;

            let year = [moment().year().toString()];

            let search = reactive({
                categories: [] as any,
                year: moment().year().toString(),
                month: "",
            })

            let categoryLineColumnData = ref({
                chartData: [] as any,
                chartInfo: {
                    key: 1,
                    height: "271px",
                    width: "100%",
                    chartType: "LINE_COLUMN",
                    chartValueUnit: "",
                    yaxisTitleList: [],
                    xaxisTitle: "",
                    xaxisType: "categories", //categories, datetime, numeric
                    colors: ["#DF4F49", "#EFEDEC"],
                    showLoading: false,
                    legendFontSize: '12px',
                    legendFontWeight: 700,
                    legendMarkersWidth: 6,
                    legendMarkersHeight: 6,
					strokeWidth: [3, 0],
                    // columnWidth: "25%",
                }
            })

            let tableData = ref({
                data: [],
                recordsTotal: 0,
                showTableData: true,
            });

            function getCategory() {
                codeService.selectListByParentCode("PCAT").then(res => {
                    category.value = res;
                })
            }

            function getYear() {
                let startYear = "2015";
                while (year[year.length-1] != startYear) {
                    let newYear = moment().set('year', Number(year[year.length-1])).subtract(1, 'year').year().toString();
                    year.push(newYear);
                }
            }

            function getSalesCategoryAmount() {
                tableData.value.showTableData = false;
                saleService.getSalesCategoryAmount(search).then(res => {
                    tableData.value.data = res;
                    tableData.value.recordsTotal = res.length;
                    tableData.value.showTableData = true;
                 })
            }

            function getSalesCategorySelectedLastYear() {
                categoryLineColumnData.value.chartInfo.showLoading = true;
                saleService.getSalesCategorySelectedLastYear(search).then(res => {
					res[0].type='line';
					res[1].type='bar';
					categoryLineColumnData.value.chartData = res;
                    categoryLineColumnData.value.chartInfo.key++;
                    categoryLineColumnData.value.chartInfo.showLoading = false;
                })
            }

            function getSearchData() {
                getSalesCategoryAmount();
                getSalesCategorySelectedLastYear();
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

            function resetForm() {
                search.categories = [];
                search.year = moment().year().toString();
                search.month = "";
            }

            function checkClassValue(value:number) {
                if(value > 0) {
                    return "tr text-green";
                } else if(value < 0) {
                    return "tr text-red";
                } else if(value == 0) {
                    return "tr";
                }
            }

            function checkValue(value:number) {
                return numberFormatter(Math.abs(value));
            }

            function exportExcel() {
                showLoadingDownload.value = true;

                const workBook = Xlsx.utils.book_new();
                const workSheet = Xlsx.utils.json_to_sheet(tableData.value.data);
                const sheetName = "목록";

                Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
                Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName],
                    [// rename header
                        {          
                            category: "카테고리",
                            salesAmount: "매출", 
                            salesAmountLastYear: "전년 동일 기간 매출", 
                            growth: "증감량", 
                        },
                    ],
                    {// locate header
                        header:["category", "salesAmount", "salesAmountLastYear", "growth"],
                        skipHeader: true,
                        origin: "A1",
                    }
                );

                Xlsx.writeFile(workBook, "카테고리별 매출 비교.xlsx");
                showLoadingDownload.value = false;
            }

            getCategory();
            getYear();
            getSearchData();

            onUnmounted(() => {
                ElMessage.closeAll();
            })

            return {
                showLoadingDownload,
                category,
                year,
                search,
                categoryLineColumnData,
                tableData,
                numberFormatter,
                getSearchData,
                checkCategory,
                changeCategory,
                resetForm,
                checkClassValue,
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

</style>