<template>
	<div>
		<div>	
			<div class="layout-content">	
				<div class="content-title">	
					<span>고객 관리</span>	
					<h2>구매전환 이탈 고객 관리</h2>	
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
                            <label v-for="duration in period" :key="duration.id" class="radio-container" :for="duration.id">
                                {{ duration.name }}
								<input type="radio" name="period" :id="duration.id" v-model="search.period" :value="duration.value" @change="changePeriod">	
								<span class="checkmark"></span>	
							</label>		
                            <input type="date" v-model="search.startDate" v-show="search.showCustomDate">
                            <span v-show="search.showCustomDate">&dash;</span>
                            <input type="date" v-model="search.endDate" v-show="search.showCustomDate">		
						</dd>	
					</dl>	
					<div class="filter-buttons">	
						<button type="submit" class="btn-h40 btn-primary" @click="searchData">검색</button>	
						<button type="button" class="btn-h40 btn-outline" @click="resetForm">초기화</button>	
					</div>	
				</form>	
				<!--//form-filter-->	
				<hr class="gutter-large">	
                <div class="section">    

                    <h3>카테고리별 구매전환 이탈 고객 현황</h3>	
                    <div class="chart-horizontal">
                        <loading-chart v-if="columnData.chartInfo.showLoading"  style="width: 100%"/>
                        <div class="chart-area flex-grow" v-else>
                            <basic-column-chart-wrapper :data="columnData" :key="columnData.columnKey"/>
                        </div>
                        <ul class="list-label" v-if="!columnData.chartInfo.showLoading">
                            <template v-for="(data, index) in columnData.chartData[0].data" :key="index">
                                <li class="chart-label color-customize" :style="'--customize-color:' + columnData.chartInfo.colors[index] + ';'">	
                                    <h6>{{ data.x }} &#58; {{ calPercentage(data.y) }}&#37;</h6>
                                    <span>{{ numberFormatter(data.y) }}명</span>
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
							<th scope="col" class="nowrap tc">번호</th>	
							<th scope="col" class="nowrap tc">카테고리</th>		
							<th scope="col" class="tc">사용자 아이디</th>	
							<th scope="col" class="tc">사용자 이름</th>
                            <th scope="col" class="nowrap tc">구매 전환 이탈일</th>
						</tr>	
					</thead>	
					<tbody>	
                        <tr v-if="!tableData.showTableData">
                            <th colspan="5" style="text-align: center">  
                                <el-icon class="is-loading loading-size"><loading /></el-icon>
                            </th>
                        </tr>
                        <tr v-else-if="tableData.data.length == 0">
                            <th colspan="5" style="text-align: center">  
                                데이터가 없습니다
                            </th>
                        </tr>
                        <tr v-else v-for="(data, index) in tableData.data" :key="index">
							<th scope="row" class="nowrap tc">{{ numberFormatter(data.rowNo) }}</th>	
							<th class="nowrap tc">{{ data.category }}</th>	
							<td class="fw-bold tc">{{ data.userId }}</td>	
							<td class="fw-bold">{{ data.userName }}</td>
                            <td class="nowrap text-999 tc">{{ data.baseDate }}</td>
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
				</div>
				<!--//pagination-->	
			</div>	
			<!--//layout-content-->	
		</div>	
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, reactive, onUnmounted } from '@vue/runtime-core';
    import { Loading } from '@element-plus/icons';
    import { numberFormatter, calculatePercentage } from '@/utils/CommonUtils';
    import codeService from '@/services/code/CodeServices';
    import customerService from '@/services/customer/CustomerService';
    import moment from 'moment/moment';
    import Xlsx from 'xlsx'
    import BasicColumnChartWrapper from "@/components/charts/column/BasicColumnChartWrapper.vue";
    import LoadingChart from "@/components/charts/loading/Loading.vue";
import { ElMessage } from 'element-plus';

	export default defineComponent({
		components: {
            "loading" : Loading,
            "basic-column-chart-wrapper" : BasicColumnChartWrapper,
            "loading-chart" : LoadingChart
        },
		setup() { 
            let showLoadingDownload = ref(false);
            let totalChartValue = 0;
            let category = ref([]) as any;

            let period = [
                { id: "periodOne", value: 1, name: "1개월" },
                { id: "periodThree", value: 3, name: "3개월" },
                { id: "periodSix", value: 6, name: "6개월" }, 
                { id: "periodTwelve", value: 12, name: "12개월" }, 	
                { id: "periodCustom", value: 0, name: "사용자 설정"}, 	
            ]

            let search = reactive({
                pageNumber: 1,
                isPaging: true,
                categoryTypes: [] as any,
                period: 1,
                showCustomDate: false,
                startDate: moment().subtract(1, "month").format("YYYY-MM-DD"),
                endDate: moment().format("YYYY-MM-DD"),
            });

            let columnData = ref({
                columnKey: 1,
				chartInfo: {
					height: "271px",
                    width: "100%",
                    columnWidth: "10%",
                    borderRadius: 8,
					chartType: "BAR",
					chartValueUnit: "%",
					yaxisName: "",
					xaxisTitle: "",
					yaxisTitleList: [""],
					xaxisType: "categories",
                    xaxisValue: [],
                    yaxisValue: [],
                    colors: ["#2E2F2E", "#CCD2E0", "#A59E96", "#B9958D", "#EECFB7", "#E4B9B9", "#DF4F49"],
                    showLegend: false,
                    columnDistributed: true,
                    showLoading: false,
                },
				chartData: [
					{
						name: "",
						type: "bar",
						data: [],
					}
				],         
            })

            let tableData = ref({
                data: [],
                recordsTotal: 0,
                lastPage: 1,
                showTableData: true,
            });

            function getCategory() {
                codeService.selectListByParentCode("PCAT").then(res => {
                    category.value = res;
                })
            }

            function searchData() {
                getStopPurchaseStat();
                getStopPurchase();
            }
            
            function getStopPurchaseStat() {
                columnData.value.chartInfo.showLoading = true;
                customerService.stopPurchaseStat(search).then(res => {
                    columnData.value.chartData[0].data = res;
                    columnData.value.columnKey++; 
                    totalChartValue = 0;
                    for(let data of res) {
                        totalChartValue = totalChartValue + data.y;
                    }
                    columnData.value.chartInfo.showLoading = false;
                });
            }

            function getStopPurchase() {
                tableData.value.showTableData = false;
                customerService.stopPurchase(search).then(res => {
                    tableData.value.data = res.data;
                    tableData.value.recordsTotal = res.recordsTotal;
                    tableData.value.lastPage = Math.ceil(res.recordsTotal/10);
                    tableData.value.showTableData = true;
                })
            }

            function exportExcel() {
                let excelParam = {
                    pageNumber: 1,
                    isPaging: false,
                    categoryTypes: search.categoryTypes,
                    startDate: search.startDate,
                    endDate: search.endDate,
                }
                showLoadingDownload.value = true;
                customerService.stopPurchaseExcel(excelParam).then(res => {
                    
                    // delete unnecessary properties to save in excel
                    const newRes = res.map((item:any)=>{
                        return item
                    })

                    const workBook = Xlsx.utils.book_new();
                    const workSheet = Xlsx.utils.json_to_sheet(newRes);
                    const sheetName = "목록";
                    Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
                    Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName],
                        [// rename header
                            {   rowNo: "번호", 
                                category: "카테고리", 
                                userId: "사용자 아이디", 
                                userName: "사용자 이름",                                
                                baseDate: "구매 전환 이탈일"
                            },
                        ],
                        {// locate header
                            header:["rowNo", "category", "userId", "userName", "baseDate"],
                            skipHeader: true,
                            origin: "A1",
                        }
                    );
                    
                    Xlsx.writeFile(workBook, "구매전환 이탈 고객 관리.xlsx");
                    showLoadingDownload.value = false;
                })
            }

            function calPercentage(yValue:any) {
                return calculatePercentage(yValue, totalChartValue);
            }

            function handlePageChange(newPageNumber:number) {
                search.pageNumber = newPageNumber;
                tableData.value.showTableData = false;
                getStopPurchase();
            }

            function checkCategory(label:string) {
                if(search.categoryTypes.length == 0 && label == 'All') {
                    return true;
                } else if(search.categoryTypes.includes(label)) {
                    return true;
                } else {
                    return false;
                }
            }

            function changeCategory(label:string) {
                if(label == 'All') {
                    search.categoryTypes = [];
                } else if(search.categoryTypes.includes(label)) {
                    let index = search.categoryTypes.indexOf(label);
                    search.categoryTypes.splice(index, 1);
                } else {
                    search.categoryTypes.push(label);
                }
            }

            function changePeriod() {
                if(search.period == 0) {
                    search.showCustomDate = true;
                    search.endDate = moment().format("YYYY-MM-DD");
                    search.startDate = moment().format("YYYY-MM-DD");
                } else {
                    search.showCustomDate = false;
                    search.endDate = moment().format("YYYY-MM-DD");
                    search.startDate = moment(search.endDate).subtract(search.period, "month").format("YYYY-MM-DD");
                }
            }

            function resetForm() {
                search.categoryTypes = [];
                search.period = 1;
                search.showCustomDate = false;
                search.startDate = moment().subtract(1, "month").format("YYYY-MM-DD");
                search.endDate = moment().format("YYYY-MM-DD");
                search.pageNumber = 1;
            }

            getCategory();
            searchData();

            onUnmounted(() => {
                ElMessage.closeAll();
            })

			return {
                showLoadingDownload,
                category,
                period,
                search,
                columnData,
                tableData,
                searchData,
                exportExcel,
                calPercentage,
                handlePageChange,
                checkCategory,
                changeCategory,
                changePeriod,
                resetForm,
                numberFormatter
            }
		}
	})
</script>

<style scoped>

    .chart-label.color-customize:before {
        background-color: var(--customize-color);
    }

</style>
