<template>
	<div>
		<div>	
			<div class="layout-content">	
				<div class="content-title">	
					<span>고객 관리</span>	
					<h2>재구매 고객 관리</h2>	
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

                <div class="chart-wrap">	
					<loading-chart v-if="pieData.chartInfo.showLoading" />
                    <div class="chart-semiCircleGauge" v-else>	
						<div class="chart-area">	
                            <BasicPieChartWrapper :data="pieData" :key="pieData.pieKey" />
						</div>	
						<ul class="list-label"  style="margin-left: -20px" >
                            <template v-for="(data, index) in pieData.chartData[0].data" :key="index">	
                                <li class="chart-label color-red" v-if="data.x == '기존 고객' ">	
                                    <h6>기존 고객 &#58; {{ calPercentage(data.y) }}&#37;</h6>	
                                    <span>{{ numberFormatter(data.y) }}명</span>	
                                </li>	
                                <li class="chart-label color-yellow-gray" v-else-if="data.x == '신규 고객' ">	
                                    <h6>신규 고객 &#58; {{ calPercentage(data.y) }}&#37;</h6>	
                                    <span>{{ numberFormatter(data.y) }}명</span>	
                                </li>	
                                <li class="chart-label color-brown-gray" v-else-if="data.x == '잠재 고객' ">	
                                    <h6>잠재 고객 &#58; {{ calPercentage(data.y) }}&#37;</h6>	
                                    <span>{{ numberFormatter(data.y) }}명</span>	
                                </li>
                            </template>	
						</ul>	
					</div>	
				</div>	
				<!--//chart-wrap-->	

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
							<th scope="col" class="tc">아이디</th>	
							<th scope="col" class="tc">이름</th>	
							<th scope="col" class="nowrap tc">구분</th>	
							<th scope="col" class="nowrap tc">가입일</th>	
							<th scope="col" class="nowrap tc">최근 로그인</th>	
						</tr>	
					</thead>	
					<tbody>
                        <tr v-if="!tableData.showTableData">
                            <th colspan="6" style="text-align: center">  
                                <el-icon class="is-loading loading-size"><loading /></el-icon>
                            </th>
                        </tr>
                        <tr v-else-if="tableData.data.length == 0">
                            <th colspan="6" style="text-align: center">  
                                데이터가 없습니다
                            </th>
                        </tr>
                        <tr v-else v-for="(data, index) in tableData.data" :key="index">
							<th scope="row" class="nowrap tc">{{ numberFormatter(data.rowNo) }}</th>	
							<th class="fw-bold tc">{{ data.userId }}</th>	
                            <td class="fw-bold tc">{{ data.userNm }}</td>
                            <td class="tc">{{ data.customerType }}</td>	
							<td class="nowrap text-999 tc">{{ data.frstRegDttm }}</td>	
							<td class="nowrap text-999 tc">{{ data.lastLoginDttm }}</td>
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
	</div>
</template>

<script lang="ts">
	import { defineComponent, onUnmounted, reactive, ref } from '@vue/runtime-core';
    import { Loading } from '@element-plus/icons';
    import { numberFormatter, calculatePercentage } from '@/utils/CommonUtils';
    import moment from 'moment/moment';
    import Xlsx from 'xlsx';
    import codeService from '@/services/code/CodeServices';
    import customerService from '@/services/customer/CustomerService';
    import BasicPieChartWrapper from "@/components/charts/pie/BasicPieChartWrapper.vue";
    import LoadingChart from "@/components/charts/loading/Loading.vue";
import { ElMessage } from 'element-plus';

	export default defineComponent({
		components: {
            "loading" : Loading,
            BasicPieChartWrapper,
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

            let pieData = ref({
                pieKey: 1,
				chartInfo: {
                    height: "120",
                    width: "130",
					chartType: "PIE",
                    showLegend: false,
                    colors: ["#A59E96", "#DF4F49", "#EFEDEC"],
                    showLoading: false,
				},
				chartData: [
					{
						name: "",
						type: "pie",
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
                getRepurchaseStat();
                getRepurchase();
            }

            function getRepurchaseStat() {
                pieData.value.chartInfo.showLoading = true;
                customerService.repurchaseStat(search).then(res => { 
                    pieData.value.chartData[0].data = res;
                    pieData.value.pieKey++; 
                    totalChartValue = 0;
                    for(let data of res) {
                        totalChartValue = totalChartValue + data.y;
                    }
                    pieData.value.chartInfo.showLoading = false;
                });
            }

            function getRepurchase() {
                tableData.value.showTableData = false;
                customerService.repurchase(search).then(res => {
                    tableData.value.data = res.data;
                    tableData.value.recordsTotal = res.recordsTotal;
                    tableData.value.lastPage = Math.ceil(res.recordsTotal/10);
                    tableData.value.showTableData = true;
                })
            }

            function calPercentage(yValue:any) {
                return calculatePercentage(yValue, totalChartValue);
            }

            function handlePageChange(newPageNumber:number) {
                search.pageNumber = newPageNumber;
                tableData.value.showTableData = false;
                getRepurchase();
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

            function exportExcel() {
                let excelParam = {
                    pageNumber: 1,
                    isPaging: false,
                    categoryTypes: search.categoryTypes,
                    startDate: search.startDate,
                    endDate: search.endDate,
                }
                showLoadingDownload.value = true;
                customerService.repurchase(excelParam).then(res => {

                    const workBook = Xlsx.utils.book_new();
                    const workSheet = Xlsx.utils.json_to_sheet(res.data);
                    const sheetName = "목록";
                    Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
                    Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName],
                        [// rename header
                            {   rowNo: "번호", 
                                userId: "아이디", 
                                userName: "이름",
                                customerType: "구분", 
                                frstRegDttm: "가입일",
                                lastLoginDttm: "최근 로그인" 
                            },
                        ],
                        {// locate header
                            header:["rowNo", "userId", "userName", "customerType", "frstRegDttm", "lastLoginDttm"],
                            skipHeader: true,
                            origin: "A1",
                        }
                    );
                    
                    Xlsx.writeFile(workBook, "재구매 고객 관리.xlsx");
                    showLoadingDownload.value = false;
                })
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
                pieData,
                tableData,
                searchData,
                calPercentage,
                handlePageChange,
                checkCategory,
                changeCategory,
                changePeriod,
                resetForm,
                exportExcel,
                numberFormatter
                
            }
		}
	})
</script>
