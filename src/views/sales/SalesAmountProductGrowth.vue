<template>
    <div>
        <div class="layout-content">
            <div class="content-title">
                <span>매출 분석</span>
                <h2>상품 매출 증감량 분석</h2>
            </div>
            <form class="form-filter" @submit.prevent="false">
                <dl class="filter-item">
                    <dt>카테고리</dt>
                    <dd>
                        <label class="checkbox-container" for="전체">전체
							<input type="checkbox" id="전체" value="" :checked="checkCategory('')" @change="changeCategory">	
							<span class="checkmark"></span>	
						</label>	
                        <label v-for="cat in category" :key="cat.value" class="checkbox-container" :for="cat.value">
                            {{ cat.label }}
							<input type="checkbox" :id="cat.value" :value="cat.value" :checked="checkCategory(cat.value)" @change="changeCategory">	
							<span class="checkmark"></span>	
						</label>	
                    </dd>
                </dl>
                <dl class="filter-item">
                    <dt>기간</dt>
                    <dd>
							<label
								v-for="period in periods"
								:key="period.id"
								class="radio-container"
								:for="period.id"
							>
								{{ period.name }}
								<input
									type="radio"
									:id="period.id"
									v-model="commonVariables.period"
									:value="period.value"
									name="period"
									@change="changePeriod(period.value)"
								/>
								<span class="checkmark"></span>
							</label>
                            <input type="date" v-model="search.startDate" v-show="commonVariables.showCustomDate">
                            <span v-show="commonVariables.showCustomDate">&dash;</span>
                            <input type="date" v-model="search.endDate" v-show="commonVariables.showCustomDate">		
						</dd>
                </dl>
                <div class="filter-row">
                    <dl class="filter-item">
                        <dt>업체명</dt>
                        <dd>
                            <input type="text" class="width-100" v-model="search.storeName">
                        </dd>
                    </dl>
                    <dl class="filter-item">
                        <dt>상품명</dt>
                        <dd>
                            <input type="text" class="width-100" v-model="search.productName">
                        </dd>
                    </dl>
                </div>
                <div class="filter-buttons">
                    <button type="submit" class="btn-h40 btn-primary" @click="getSalesProductAmount">검색</button>
                    <button type="button" class="btn-h40 btn-outline" @click="resetForm">초기화</button>
                </div>
            </form>
            <!--//form-filter-->
            <hr class="gutter-large">
            <div class="chart">
                <div class="chart-column-single chart-area">	
                    <loading-chart v-if="monthlySalesColumnData.chartInfo.showLoading" />
                    <basic-column-chart-wrapper v-else :data="monthlySalesColumnData" :key="monthlySalesColumnData.chartInfo.key"/>
                </div>
            </div><!--//chart-->
            <hr class="gutter-medium">
            <form>
                <table class="table caption-top table-borderless">
                    <caption>
                        <span>검색 결과 {{ tableData.recordsTotal }}건</span>
                        <button type="button" class="btn-h32 btn-outline" v-if="!commonVariables.showLoadingDownload" @click="exportExcel">Excel 다운로드 </button>
                        <button type="button" class="btn-h32 btn-outline" v-else disabled style="cursor: wait;">
                            <el-icon class="is-loading"><loading /></el-icon> Excel 다운로드 
                        </button>
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col" class="tc">번호</th>
                            <th scope="col" class="tc">카테고리</th>
                            <th scope="col" class="tc">업체명</th>
                            <th scope="col" class="tc">상품명</th>
                            <th scope="col" class="tc">선택 기간 매출</th>
                            <th scope="col" class="tc">전월 매출</th>
                            <th scope="col" class="tc">전년 동일 기간 매출</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!tableData.showTableData">
                            <th colspan="7" style="text-align: center">  
                                <el-icon class="is-loading loading-size"><loading /></el-icon>
                            </th>
                        </tr>
                        <tr v-else-if="tableData.data.length == 0">
                            <th colspan="7" style="text-align: center">  
                                데이터가 없습니다
                            </th>
                        </tr>
                        <tr v-else v-for="(data, index) in tableData.data" :key="index">
							<th scope="row" class="tc">{{ numberFormatter(data.rowNo) }}</th>	
							<td class="tc">{{ data.category }}</td>	
                            <td>{{ data.storeName }}</td>
							<td class="fw-bold">{{ data.productName }}</td>	
							<td class="tr fw-bold">{{ numberFormatter(data.salesAmount) }}</td>
                            <td class="tr">{{ numberFormatter(data.salesAmountLastMonth) }}</td>
                            <td class="tr">{{ numberFormatter(data.salesAmountLastYear) }}</td>
						</tr>
                    </tbody>
                </table>
            </form>
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
				</div>
				<!--//pagination-->	
        </div>
        <!--//layout-content-->
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, onUnmounted, reactive, ref } from '@vue/runtime-core'
    import { Loading } from '@element-plus/icons';
    import { numberFormatter } from '@/utils/CommonUtils';
    import moment from "moment";
	import Xlsx from "xlsx";
    import salesService from '@/services/sales/SalesService';
    import codeService from '@/services/code/CodeServices';
    import LoadingChart from "@/components/charts/loading/Loading.vue";
    import BasicColumnChartWrapper from "@/components/charts/column/BasicColumnChartWrapper.vue";
import { ElMessage } from 'element-plus';

    export default defineComponent({
        components: {
            "loading" : Loading,
            "basic-column-chart-wrapper" : BasicColumnChartWrapper,
            "loading-chart" : LoadingChart
        },
        setup() {
            let category = ref([]) as any;

            let periods = [
				{ id: "periodYesterday", value: "yesterday", name: "어제" },
				{ id: "periodWeek", value: "1week", name: "1주일" },
				{ id: "periodOne", value: 1, name: "1개월" },
				{ id: "periodThree", value: 3, name: "3개월" },
				{ id: "periodCustom", value: "custom", name: "사용자 설정" },
			];

            let commonVariables = ref({
				showModal: false,
                showCustomDate: false,
                period: "yesterday",
                showLoadingDownload: false,
			});

			let search = reactive({
                pageNumber: 1,
                isPaging: true,
                startDate: moment().subtract(1, "days").format("YYYY-MM-DD"),
                endDate: moment().format("YYYY-MM-DD"),
                categories: [] as any,
                storeName: "",
                productName: "",
            });

            let tableData = ref({
                data: [],
                recordsTotal: 0,
                showTableData: true,
            });

            let monthlySalesColumnData = ref({
				chartInfo: {
                    key: 1,
					height: "300",
                    width: "100%",
					chartType: "BAR",
					chartValueUnit: "",
					yaxisName: "",
					xaxisTitle: "",
					yaxisTitleList: [],
					xaxisType: "categories",
                    colors: ["#DF4F49", "#D2CECA", "#A59E96"],
                    showLegend: true,
					borderRadius: 5,
                    columnDistributed: false,
                    tooltipShared: true,
                    tooltipIntersect: false,
                    showLoading: false,
                    legendFontSize: '12px',
                    legendFontWeight: 700,
                    legendMarkersWidth: 6,
                    legendMarkersHeight: 6,
                },
				chartData: [],        
            });

            function getCategory() {
                codeService.selectListByParentCode("PCAT").then(res => {
                    category.value = res;
                })
            }

            function checkCategory(type:string) {
                if(search.categories.length == 0 && type == '') {
                    return true;
                } else if(search.categories.includes(type)) {
                    return true;
                } else {
                    return false;
                }
            }

            function changeCategory(value:any) {
                let type = value.target._value;
                if(type == "") {
                    search.categories = [];
                } else if(search.categories.includes(type)) {
                    let index = search.categories.indexOf(type);
                    search.categories.splice(index, 1);
                } else {
                    search.categories.push(value.target._value);
                }
            }

            function changePeriod(period: any) {
				if (period == "custom") {
                    commonVariables.value.showCustomDate = true;
                    search.endDate = moment().format("YYYY-MM-DD");
					search.startDate = moment().format("YYYY-MM-DD");
				} else if (period == "yesterday") {
                    commonVariables.value.showCustomDate = false;
					search.endDate = moment()
						.subtract(1, "day")
						.format("YYYY-MM-DD");
					search.startDate = moment()
						.subtract(1, "day")
						.format("YYYY-MM-DD");
				} else if (period == "1week") {
                    commonVariables.value.showCustomDate = false;
					search.endDate = moment().format("YYYY-MM-DD");
					search.startDate = moment(search.endDate)
						.subtract(1, "week")
						.format("YYYY-MM-DD");
				} else {
                    commonVariables.value.showCustomDate = false;
					search.endDate = moment().format("YYYY-MM-DD");
					search.startDate = moment(search.endDate)
						.subtract(period, "month")
						.format("YYYY-MM-DD");
				}
			}

            function resetForm() {
                search.categories = [];
                search.storeName = '';
                search.productName = '';
                search.startDate = moment().subtract(1, "days").format("YYYY-MM-DD");
                search.endDate = moment().format("YYYY-MM-DD");
                search.pageNumber = 1;
                commonVariables.value.showCustomDate = false;
                commonVariables.value.period = 'yesterday';
                getSalesProductAmount();
            }

            function getSalesProductAmount() {
                getSalesCategorySelectdLastMonthYear();
                tableData.value.showTableData = false;
                salesService.getSalesProductAmount(search).then(res => {
                    tableData.value.data = res.data;
                    tableData.value.recordsTotal = res.recordsTotal;
                    tableData.value.showTableData = true;
                });
            }

            function handlePageChange(newPageNumber:number) {
                search.pageNumber = newPageNumber;
                tableData.value.showTableData = false;
                getSalesProductAmount();
            }

            function exportExcel() {
                
                let excelParam = {
                    pageNumber: 1,
                    isPaging: false,
                    startDate: search.startDate,
                    endDate: search.endDate,
                    categories: search.categories,
                    storeName: search.storeName,
                    productName: search.productName,
                }
                commonVariables.value.showLoadingDownload = true;
                salesService.salesProductExcelExport(excelParam).then(res => {
                    const workBook = Xlsx.utils.book_new();
                    const workSheet = Xlsx.utils.json_to_sheet(res.data);
                    const sheetName = "목록";
                    Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
                    Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName],
                        [// rename header
                            {   rowNo: "번호", 
                                category: "카테고리", 
                                storeName: "업체명", 
                                productName: "상품명", 
                                salesAmount: "선택 기간 매출",
                                salesAmountLastMonth: "전월 매출",
                                salesAmountLastYear: "전년 동일 기간 매출"
                            },
                        ],
                        {// locate header
                            header:["rowNo", "category", "storeName", "productName", "salesAmount", "salesAmountLastMonth", "salesAmountLastYear"],
                            skipHeader: true,
                            origin: "A1",
                        }
                    );
                    
                    Xlsx.writeFile(workBook, "상품 매출 증감량 분석.xlsx");
                    commonVariables.value.showLoadingDownload = false;
                })
            }

            function getSalesCategorySelectdLastMonthYear() {
                let columnChart = {
                    pageNumber: 1,
                    isPaging: false,
                    startDate: search.startDate,
                    endDate: search.endDate,
                }
                monthlySalesColumnData.value.chartInfo.showLoading = true;
                salesService.getSalesCategorySelectdLastMonthYear(columnChart).then((res:any) => {
                    monthlySalesColumnData.value.chartData = res;
                    monthlySalesColumnData.value.chartInfo.key++;
                    monthlySalesColumnData.value.chartInfo.showLoading = false;
                })
            }

            onMounted(() => {
				getSalesProductAmount();
                getCategory();
				
			});

            onUnmounted(() => {
                ElMessage.closeAll();
            })

            return {
                numberFormatter,
                category,
                periods,
                commonVariables,
                search,
                tableData,
                checkCategory,
                changeCategory,
                changePeriod,
                getSalesProductAmount,
                resetForm,
                handlePageChange,
                exportExcel,
                monthlySalesColumnData
            }
        },
    })
</script>


<style scoped>
</style>

