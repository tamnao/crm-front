<template>
	<div>
		<div class="layout-content">
			<div class="content-title">
				<span>마케팅 관리</span>
				<h2>우수고객 조회</h2>
			</div>
			<form class="form-filter" @submit.prevent="false">
				<dl class="filter-item">
					<dt>선정 연도 &#47; 월</dt>
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
					<button type="submit" class="btn-h40 btn-primary" @click="searchData">
						검색
					</button>
					<button type="button" class="btn-h40 btn-outline" @click="resetForm">
						초기화
					</button>
				</div>
			</form>
			<!--//form-filter-->
			<hr class="gutter-large" />
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
						<th scope="col" class="nowrap tc">순위</th>
						<th scope="col" class="nowrap tc">카테고리</th>
						<th scope="col" class="tc">고객명</th>
						<th scope="col" class="nowrap tc">구매 횟수</th>
						<th scope="col" class="nowrap tc">구매 금액</th>
						<th scope="col" :class="checkColumnCondition()">선정 여부</th>
						<th scope="col" :class="checkColumnCondition()">선정 관리</th>
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
						<th scope="row" class="nowrap tc">{{ numberFormatter(data.rowNo) }}</th>
						<td class="nowrap tc">{{ data.category }}</td>
						<td class="fw-bold tc">{{ data.userName }}</td>
						<td class="nowrap tc">{{ data.reserveCount }}</td>
						<td class="nowrap tc">{{ numberFormatter(data.reserveAmount) }}원</td>
						<td :class="checkColumnCondition()" v-if="data.bestFlag == 'Y' ">선정</td>
						<td :class="checkColumnCondition()" v-else></td>
						<td :class="checkColumnCondition('button')">
							<button type="button" v-if="data.bestFlag == 'N'" class="btn-h40 btn-secondary btn-best-cust" :disabled="data.isButtonDisabled" @click="changeBestCustomer(data, data.id, data.userId, 'Y')">
								선정
							</button>
							<button type="button" v-if="data.bestFlag == 'Y'" class="btn-h40 btn-outline btn-best-cust" :disabled="data.isButtonDisabled" @click="changeBestCustomer(data, data.id, data.userId), 'N'">
								선정 취소
							</button>
						</td>
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
</template>

<script lang="ts">
	import { defineComponent, onUnmounted, reactive, ref } from "@vue/runtime-core";
	import { Loading } from '@element-plus/icons';
	import { numberFormatter } from '@/utils/CommonUtils';
	import bestCustomerService from '@/services/marketing/BestCustomerService';
	import Xlsx from 'xlsx';
	import moment from 'moment/moment';
import { ElMessage } from "element-plus";

	export default defineComponent({
		components: {
			"loading" : Loading,
		},
		setup() {
			let today = moment();
			let currentMonth = moment(today).month() + 1;
			let currentYear = moment(today).year();

			let selectedMonth = "";
			let selectedYear = "2022";

			let showLoadingDownload = ref(false);

			let year = [moment().year().toString()];

			let search = reactive({
				pageNumber: 1,
				isPaging: true,
				year: moment().year().toString(),
				month: ""
			});

			let tableData = ref({
				data: [],
				recordsTotal: 0,
				lastPage: 1,
				showTableData: true,
			});

			function getYear() {
				let startYear = "2022";
				while (year[year.length-1] != startYear) {
					let newYear = moment().set('year', Number(year[year.length-1])).subtract(1, 'year').year().toString();
					year.push(newYear);
				}
			}

			function searchData() {
				tableData.value.showTableData = false;
				selectedMonth = search.month;
				selectedYear = search.year;
				getBestCustomer();
				
			}
			function getBestCustomer() {
				bestCustomerService.bestCustomer(search).then(res => {
					for(let data of res.data) {
						data.isButtonDisabled = false;
					}
					tableData.value.data = res.data;
					tableData.value.recordsTotal = res.recordsTotal;
					tableData.value.lastPage = Math.ceil(res.recordsTotal/10);
					tableData.value.showTableData = true;
				})
			}

			function resetForm() {
				search.pageNumber = 1;
				search.year = "2021";
				search.month = "";
			}

			function exportExcel() {
				let excelParam = {
					pageNumber: 1,
					isPaging: false,
					year: search.year,
					month: search.month,
				}
				showLoadingDownload.value = true;
				bestCustomerService.excelBestCustomer(excelParam).then(res => {

					// delete unnecessary properties to save in excel
					const newRes = res.data.map((item:any)=>{
						if(item.bestFlag == "Y") {
							item.bestFlagText = "선정";
						} else {
							item.bestFlagText = "";
						}

						delete item.bestFlag;
						delete item.id;
						delete item.userId;
						delete item.isButtonDisabled;
						
						return item
					})

					const workBook = Xlsx.utils.book_new();
					const workSheet = Xlsx.utils.json_to_sheet(newRes,                     
						{// Arrange column according to the desired header order using Object.keys
							header:["rowNo", "category", "userName", "reserveCount", "reserveAmount", "bestFlagText"],
						},
					);
					const sheetName = "목록";
					Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
					
					//Overwrite header name
					Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName],
						[// rename header
							{   rowNo: "순위", 
								category: "카테고리", 
								userName: "고객명", 
								reserveCount: "구매 횟수", 
								reserveAmount: "구매 금액",
								bestFlagText: "선정 여부",
							},
						],
						{// locate header
							header:["rowNo", "category", "userName", "reserveCount", "reserveAmount", "bestFlagText"],
							skipHeader: true,
							origin: "A1",
						},
					);
					
					Xlsx.writeFile(workBook, "우수고객 조회.xlsx");
					showLoadingDownload.value = false;
				})
			}

			function handlePageChange(newPageNumber:number) {
				search.pageNumber = newPageNumber;
				tableData.value.showTableData = false;
				searchData();
			}

			function changeBestCustomer(data:any, id:number, userId:string, state:string) {
				data.isButtonDisabled = true;
				if(state == "Y") {
					bestCustomerService.createBestCustomer(id, userId).then(res => {
						getBestCustomer();
					})
				} else {
					bestCustomerService.expireBestCustomer(id, userId).then(res => {
						getBestCustomer();
					})
				}
			}

			function checkColumnCondition(element:string|any) {
				if(selectedMonth == currentMonth.toString() && selectedYear == currentYear.toString()) {
					if(element != undefined && element == 'button') {
						return "tc";
					} else {
						return "nowrap tc";
					}
				} else {
					return "d-none";
				}
			}

			getYear();
			searchData();

			onUnmounted(() => {
				ElMessage.closeAll();
			})

			return {
				showLoadingDownload,
				year,
				search,
				tableData,
				numberFormatter,
				searchData,
				resetForm,
				exportExcel,
				handlePageChange,
				changeBestCustomer,
				checkColumnCondition,
			};
		},
	});
</script>

<style scoped>
	.btn-secondary {
		border: 1px solid #2e2f2e;
		background-color: #2e2f2e;
		font-weight: 700;
		color: #fff;
	}

	.btn-best-cust:disabled {
		opacity: 0.6;
		cursor: none;
	}

	.hide {
		display: none;
	}

</style>

