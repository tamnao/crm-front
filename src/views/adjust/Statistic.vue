<template>
	<div>
		<div class="layout-content">
			<div class="content-title">
				<span>정산 관리</span>
				<h2>기간별 정산 관리</h2>
			</div>

			<form class="form-filter" @submit.prevent="false">
				<dl class="filter-item">
					<dt>구분</dt>
					<dd>
						<label class="radio-container" for="periodMonthly">월간
							<input type="radio" name="period" id="periodMonthly" value="periodMonthly" v-model="search.period" @change="changePeriod">
							<span class="checkmark"></span>
						</label>
						
						<select v-model="search.year" style="margin-right: 7px;">
							<option v-for="(y, index) in year" :key="index" :value="y"> {{ y }}년 </option>
						</select>
						<select v-model="search.month" >
							<option value="">전체</option>
							<option v-for="(month, index) in 12" :key="index" :value="month"> {{ month }}월 </option>
						</select>
						<label class="radio-container" for="periodCustom">사용자 설정
							<input type="radio" name="period" id="periodCustom" value="periodCustom" v-model="search.period" @change="changePeriod">
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

			<div class="section section-half">
				<h3>전년대비 월별 정산금액 추이</h3>
				<div class="chart">
					<div class="chart-area">
						<loading-chart v-if="thisLastYearLineData.chartInfo.showLoading" />
						<line-chart-wrapper v-else :data="thisLastYearLineData" :key="thisLastYearLineData.chartInfo.key" />
					</div>
				</div>
			</div><!--//section-->

			<div class="section section-half">
				<h3>월별 금액 변동 추이</h3>
				<div class="chart">
					<div class="chart-area">
						<loading-chart v-if="thisYearLineData.chartInfo.showLoading" />
						<line-chart-wrapper v-else :data="thisYearLineData" :key="thisYearLineData.chartInfo.key" />
					</div>
				</div>
			</div><!--//section-->

			<hr class="gutter-large">

			<table class="table caption-top table-borderless">
				<caption>
					<button type="button" class="btn-h32 btn-outline" v-if="!showLoadingDownload" @click="exportExcel">Excel 다운로드 </button>
					<button type="button" class="btn-h32 btn-outline" v-else disabled style="cursor: wait;">
						<el-icon class="is-loading"><loading /></el-icon> Excel 다운로드 
					</button>
				</caption>
				<thead>
					<tr>
						<th scope="col" class="tc">번호</th>
						<th scope="col" class="tc">정산 추출일</th>
						<th scope="col" class="tc">정산 지급일</th>
						<th scope="col" class="tc">판매 금액</th>
						<th scope="col" class="tc">취소 수수료</th>
						<th scope="col" class="tc">판매 수수료</th>
						<th scope="col" class="tc">총 할인 금액</th>
						<th scope="col" class="tc">지원 할인 금액</th>
						<th scope="col" class="tc">미지원 할인 금액</th>
						<th scope="col" class="tc">정산 대상 금액</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="!weeklyData.showTableData">
						<th colspan="10" style="text-align: center">  
							<el-icon class="is-loading loading-size"><loading /></el-icon>
						</th>
					</tr>
					<tr v-else-if="weeklyData.data.length == 0">
						<th colspan="10" style="text-align: center">  
							데이터가 없습니다
						</th>
					</tr>
					<tr v-else v-for="(data, index) in weeklyData.data" :key="index">
						<th scope="row" class="tc">{{ numberFormatter(index + 1) }}</th>	
						<td class="tc">{{ data.adjustDate }}</td>
						<td class="tc">{{ data.adjustItdDate }}</td>
						<td class="tr">{{ numberFormatter(data.salesAmount) }}</td>
						<td class="tr">{{ numberFormatter(data.commissionAmount) }}</td>
						<td class="tr">{{ numberFormatter(data.salesCommission) }}</td>
						<td class="tr">{{ numberFormatter(data.discountAmount) }}</td>
						<td class="tr">{{ numberFormatter(data.supportDiscountAmount) }}</td>
						<td class="tr">{{ numberFormatter(data.unsupportedDiscountAmount) }}</td>
						<td class="tr fw-bold">{{ numberFormatter(data.adjustAmount) }}</td>
					</tr>	
					<tr class="border-double">
						<!--마지막 줄 tr에 border-double 클래스를 넣어주세요.-->
						<th scope="row" colspan="3" class="tc fw-bold">합계</th>
						<td class="tr">{{ numberFormatter(weeklyData.totalSalesAmount) }}</td>
						<td class="tr">{{ numberFormatter(weeklyData.totalCommissionAmount) }}</td>
						<td class="tr">{{ numberFormatter(weeklyData.totalSalesCommission) }}</td>
						<td class="tr">{{ numberFormatter(weeklyData.totalDiscountAmount) }}</td>
						<td class="tr">{{ numberFormatter(weeklyData.totalSupportDiscountAmount) }}</td>
						<td class="tr">{{ numberFormatter(weeklyData.totalUnsupportedDiscountAmount) }}</td>
						<td class="tr fw-bold">{{ numberFormatter(weeklyData.totalAdjustAmount) }}</td>
					</tr>
				</tbody>
			</table>

			<hr class="gutter-medium"><!--표를 하나만 사용하는 경우, 이 코드는 삭제해 주세요.-->

			<table class="table caption-top table-borderless">
				<thead>
					<tr>
						<th scope="col" class="tc">번호</th>
						<th scope="col" class="tc">정산월</th>
						<th scope="col" class="tc">판매 금액</th>
						<th scope="col" class="tc">취소 수수료</th>
						<th scope="col" class="tc">판매 수수료</th>
						<th scope="col" class="tc">총 할인 금액</th>
						<th scope="col" class="tc">지원 할인 금액</th>
						<th scope="col" class="tc">미지원 할인 금액</th>
						<th scope="col" class="tc">정산 대상 금액</th>
						<th scope="col" class="tc">전월 비교</th>
						<th scope="col" class="tc">전년 동월 비교</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="!monthlyData.showTableData">
						<th colspan="11" style="text-align: center">  
							<el-icon class="is-loading loading-size"><loading /></el-icon>
						</th>
					</tr>
					<tr v-else-if="monthlyData.data.length == 0">
						<th colspan="11" style="text-align: center">  
							데이터가 없습니다
						</th>
					</tr>
					<tr v-else v-for="(data, index) in monthlyData.data" :key="index">
						<th scope="row" class="tc">{{ numberFormatter(index + 1) }}</th>
						<td class="tc">{{ data.baseYearMonth }}</td>
						<td class="tr">{{ numberFormatter(data.salesAmount) }}</td>
						<td class="tr">{{ numberFormatter(data.commissionAmount) }}</td>
						<td class="tr">{{ numberFormatter(data.salesCommission) }}</td>
						<td class="tr">{{ numberFormatter(data.discountAmount) }}</td>
						<td class="tr">{{ numberFormatter(data.supportDiscountAmount) }}</td>
						<td class="tr">{{ numberFormatter(data.unsupportedDiscountAmount) }}</td>
						<td class="tr fw-bold">{{ numberFormatter(data.adjustAmount) }}</td>
						<td :class="checkClassValue(data.adjustAmountLastMonth)">&nbsp; {{ checkValue(data.adjustAmountLastMonth) }}</td>
						<td :class="checkClassValue(data.adjustAmountLastYear)">&nbsp; {{ checkValue(data.adjustAmountLastYear) }}</td>
					</tr>	
					<tr class="border-double">
						<!--마지막 줄 tr에 border-double 클래스를 넣어주세요.-->
						<th scope="row" colspan="2" class="tc fw-bold">합계</th>
						<td class="tr">{{ numberFormatter(monthlyData.totalSalesAmount) }}</td>
						<td class="tr">{{ numberFormatter(monthlyData.totalCommissionAmount) }}</td>
						<td class="tr">{{ numberFormatter(monthlyData.totalSalesCommission) }}</td>
						<td class="tr">{{ numberFormatter(monthlyData.totalDiscountAmount) }}</td>
						<td class="tr">{{ numberFormatter(monthlyData.totalSupportDiscountAmount) }}</td>
						<td class="tr">{{ numberFormatter(monthlyData.totalUnsupportedDiscountAmount) }}</td>
						<td class="tr fw-bold">{{ numberFormatter(monthlyData.totalAdjustAmount) }}</td>
						<td class="tr">-</td>
						<td class="tr">-</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!--//layout-content-->
	</div>
</template>

<script lang="ts">
	import { defineComponent, onUnmounted, reactive, ref } from '@vue/runtime-core';
	import { Loading } from '@element-plus/icons';
	import { numberFormatter } from '@/utils/CommonUtils';
	import moment from 'moment/moment';
	import Xlsx from 'xlsx';
	import adjustService from '@/services/adjust/AdjustService';
	import LineChartWrapper from "@/components/charts/line/LineChartWrapper.vue";
	import LoadingChart from "@/components/charts/loading/Loading.vue";
import { ElMessage } from 'element-plus';

	export default defineComponent({
		components: {
			"loading" : Loading,
			"line-chart-wrapper" : LineChartWrapper,
			"loading-chart" : LoadingChart
		},
		setup() {
			let showLoadingDownload = ref(false);

			let year = [moment().year().toString()];

			let search = reactive({
				showCustomDate: false,
				period: "periodMonthly",
				year: moment().year().toString(),
				month: "",
				startDate: "",
				endDate: "",
			});

			const thisLastYearLineData = ref({
				chartData: [] as any,
				chartInfo: {
					key: 1,
					height: "295px",
					width: "100%",
					chartType: "LINE",
					chartValueUnit: "%",
					xaxisTitle: "",
					yaxisTitleList: [] as any,
					xaxisType: "categories", //datetime, categories, numeric
					lineCurve: "smooth", // smooth, straight, stepline
					colors: ["#DF4F49", "#2E2F2E"],
					showLegend: true,
					shareTooltip: true,
					legendFontSize: '12px',
					legendFontWeight: 700,
					legendMarkersWidth: 6,
					legendMarkersHeight: 6,
					showLoading: false,
				}
			});

			const thisYearLineData = ref({
				chartData: [] as any,
				chartInfo: {
					key: 1,
					height: "295px",
					width: "100%",
					chartType: "LINE",
					chartValueUnit: "%",
					xaxisTitle: "",
					yaxisTitleList: ["판매/정산 대상 금액", "판매수수료/할인금액"] as any,
					xaxisType: "categories", //datetime, categories, numeric
					lineCurve: "smooth", // smooth, straight, stepline
					colors: ["#E4B9B9", "#A59E96", "#DF4F49", "#2E2F2E"],
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

			let weeklyData = ref({
				data: [],
				showTableData: true,
				totalSalesAmount: 0,
				totalCommissionAmount: 0,
				totalSalesCommission: 0,
				totalDiscountAmount: 0,
				totalSupportDiscountAmount: 0,
				totalUnsupportedDiscountAmount: 0,
				totalAdjustAmount: 0,
			});

			let monthlyData = ref({
				data: [],
				showTableData: true,
				totalSalesAmount: 0,
				totalCommissionAmount: 0,
				totalSalesCommission: 0,
				totalDiscountAmount: 0,
				totalSupportDiscountAmount: 0,
				totalUnsupportedDiscountAmount: 0,
				totalAdjustAmount: 0,
				totalAdjustAmountLastMonth: 0,
				totalAdjustAmountLastYear: 0,
			})

			function getYear() {
				let startYear = "2015";
				while (year[year.length-1] != startYear) {
					let newYear = moment().set('year', Number(year[year.length-1])).subtract(1, 'year').year().toString();
					year.push(newYear);
				}
			}

			function getAdjustAmountMonthlyThisLastYear() {
				thisLastYearLineData.value.chartInfo.showLoading = true;
				adjustService.adjustAmountMonthlyThisLastYear().then(res => {
					for(let r of res) {
						r.name = r.name + "년";

						delete r.type;
					}
					thisLastYearLineData.value.chartData = res;
					thisLastYearLineData.value.chartInfo.key++;
					thisLastYearLineData.value.chartInfo.showLoading = false;
				})
			}

			function getAdjustMonthlyThisYear() {
				thisYearLineData.value.chartInfo.showLoading = true;
				adjustService.adjustMonthlyThisYear().then(res => {

					for(let index in res) { 

						// Divide which series to which yaxis (right or left)
						if(Number(index) == 0 || Number(index) == 3) {
							thisYearLineData.value.chartInfo.seriesLeftYaxis.push(res[index].name);
						} else if(Number(index) == 1 || Number(index) == 2) {
							thisYearLineData.value.chartInfo.seriesRightYaxis.push(res[index].name);
						}
					}

					thisYearLineData.value.chartData = res;
					thisYearLineData.value.chartInfo.key++;
					thisYearLineData.value.chartInfo.showLoading = false;
				})
			}

			function getAdjustWeekly() {
				weeklyData.value.showTableData = false;
				weeklyData.value.totalSalesAmount = 0;
				weeklyData.value.totalCommissionAmount = 0;
				weeklyData.value.totalSalesCommission = 0;
				weeklyData.value.totalDiscountAmount = 0;
				weeklyData.value.totalSupportDiscountAmount = 0;
				weeklyData.value.totalUnsupportedDiscountAmount = 0;
				weeklyData.value.totalAdjustAmount = 0;

				adjustService.adjustWeekly(search).then(res => {
					weeklyData.value.data = res;
					weeklyData.value.showTableData = true;

					for(let data of res) {
						weeklyData.value.totalSalesAmount = weeklyData.value.totalSalesAmount + data.salesAmount;
						weeklyData.value.totalCommissionAmount = weeklyData.value.totalCommissionAmount + data.commissionAmount;
						weeklyData.value.totalSalesCommission = weeklyData.value.totalSalesCommission + data.salesCommission;
						weeklyData.value.totalDiscountAmount = weeklyData.value.totalDiscountAmount + data.discountAmount;
						weeklyData.value.totalSupportDiscountAmount = weeklyData.value.totalSupportDiscountAmount + data.supportDiscountAmount;
						weeklyData.value.totalUnsupportedDiscountAmount = weeklyData.value.totalUnsupportedDiscountAmount + data.unsupportedDiscountAmount;
						weeklyData.value.totalAdjustAmount = weeklyData.value.totalAdjustAmount + data.adjustAmount;
					}
				})
			}

			function getAdjustMonthly() {
				monthlyData.value.showTableData = false;
				monthlyData.value.totalSalesAmount = 0;
				monthlyData.value.totalCommissionAmount = 0;
				monthlyData.value.totalSalesCommission = 0;
				monthlyData.value.totalDiscountAmount = 0;
				monthlyData.value.totalSupportDiscountAmount = 0;
				monthlyData.value.totalUnsupportedDiscountAmount = 0;
				monthlyData.value.totalAdjustAmount = 0;
				monthlyData.value.totalAdjustAmountLastMonth = 0;
				monthlyData.value.totalAdjustAmountLastYear = 0;

				adjustService.adjustMonthly(search).then(res => {
					monthlyData.value.data = res;
					monthlyData.value.showTableData = true;

					for(let data of res) {
						monthlyData.value.totalSalesAmount = monthlyData.value.totalSalesAmount + data.salesAmount;
						monthlyData.value.totalCommissionAmount = monthlyData.value.totalCommissionAmount + data.commissionAmount;
						monthlyData.value.totalSalesCommission = monthlyData.value.totalSalesCommission + data.salesCommission;
						monthlyData.value.totalDiscountAmount = monthlyData.value.totalDiscountAmount + data.discountAmount;
						monthlyData.value.totalSupportDiscountAmount = monthlyData.value.totalSupportDiscountAmount + data.supportDiscountAmount;
						monthlyData.value.totalUnsupportedDiscountAmount = monthlyData.value.totalUnsupportedDiscountAmount + data.unsupportedDiscountAmount;
						monthlyData.value.totalAdjustAmount = monthlyData.value.totalAdjustAmount + data.adjustAmount;
						monthlyData.value.totalAdjustAmountLastMonth = monthlyData.value.totalAdjustAmountLastMonth + data.adjustAmountLastMonth;
						monthlyData.value.totalAdjustAmountLastYear = monthlyData.value.totalAdjustAmountLastYear + data.adjustAmountLastYear;
					}
				})
			}

			function searchData() {
				getAdjustWeekly();
				getAdjustMonthly();
			}

			function changePeriod() {
				if(search.period == "periodCustom") {
					search.showCustomDate = true;
					search.startDate = moment().subtract(1, "month").format("YYYY-MM-DD");
					search.endDate = moment().format("YYYY-MM-DD");
				} else {
					search.showCustomDate = false;
					search.startDate = "";
					search.endDate = "";
				}
			}

			function resetForm() {
				search.showCustomDate = false;
				search.period = "periodMonthly";
				search.year = "2021";
				search.month = "";
				search.startDate = moment().subtract(1, "month").format("YYYY-MM-DD");
				search.endDate = moment().format("YYYY-MM-DD");
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


				const sheetName2 = "주간";
				const workSheet2 = Xlsx.utils.json_to_sheet(weeklyData.value.data);
				Xlsx.utils.book_append_sheet(workBook, workSheet2, sheetName2);
				Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName2],
					[// rename header
						{   
							// rowNo: "번호", 
							adjustDate: "정산 추출일",
							adjustItdDate: "정산 지급일",
							salesAmount: "판매 금액", 
							commissionAmount: "취소 수수료", 
							salesCommission: "판매 수수료", 
							discountAmount: "총 할인 금액",
							supportDiscountAmount: "지원 할인 금액",
							unsupportedDiscountAmount: "미지원 할인 금액", 
							adjustAmount: "정산 대상 금액"
						},
					],
					{// locate header
						header:["adjustDate", "adjustItdDate", "salesAmount", "commissionAmount", "salesCommission", 
							"discountAmount", "supportDiscountAmount", "unsupportedDiscountAmount", "adjustAmount", ],
						skipHeader: true,
						origin: "A1",
					}
				);

				Xlsx.utils.sheet_add_aoa(workBook.Sheets[sheetName2], [
				[   "합계",
					"",  
					weeklyData.value.totalSalesAmount, 
					weeklyData.value.totalCommissionAmount, 
					weeklyData.value.totalSalesCommission,
					weeklyData.value.totalDiscountAmount,
					weeklyData.value.totalSupportDiscountAmount,
					weeklyData.value.totalUnsupportedDiscountAmount,
					weeklyData.value.totalAdjustAmount,
				]
				], {origin: -1});
				let lastLineNo = weeklyData.value.data.length + 1;
				const merge2 = [ { s: {r: lastLineNo , c: 0 }, e: { r: lastLineNo, c: 1 }}]
				workBook.Sheets[sheetName2]['!merges'] = merge2;
				workBook.Sheets[sheetName2]['!cols'] = [
					{wch:13}, {wch:13}, {wch:15}, {wch:15}, {wch:15}, {wch:15}, {wch:15}, {wch:15}, {wch:15}
				]

				const workSheet = Xlsx.utils.json_to_sheet(monthlyData.value.data);
				const sheetName = "월간";
				Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
				Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName],
					[// rename header
						{   
							// rowNo: "번호", 
							baseYearMonth: "정산월",
							salesAmount: "판매 금액", 
							commissionAmount: "취소 수수료", 
							salesCommission: "판매 수수료", 
							discountAmount: "총 할인 금액",
							supportDiscountAmount: "지원 할인 금액",
							unsupportedDiscountAmount: "미지원 할인 금액", 
							adjustAmount: "정산 대상 금액", 
							adjustAmountLastMonth: "전월 비교", 
							adjustAmountLastYear: "전년 동월 비교"
						},
					],
					{// locate header
						header:["baseYearMonth", "salesAmount", "commissionAmount", "salesCommission", 
								"discountAmount", "supportDiscountAmount", "unsupportedDiscountAmount",
								"adjustAmount", "adjustAmountLastMonth", "adjustAmountLastYear"],
						skipHeader: true,
						origin: "A1",
					}
				);

				// add total calculation
				Xlsx.utils.sheet_add_aoa(workBook.Sheets[sheetName], [
				[   "합계", 
					monthlyData.value.totalSalesAmount, 
					monthlyData.value.totalCommissionAmount, 
					monthlyData.value.totalSalesCommission,
					monthlyData.value.totalDiscountAmount,
					monthlyData.value.totalSupportDiscountAmount,
					monthlyData.value.totalUnsupportedDiscountAmount,
					monthlyData.value.totalAdjustAmount,
					"",
					"",
				]
				], {origin: -1});

				workBook.Sheets[sheetName]['!cols'] = [
					{wch:15}, {wch:15}, {wch:15}, {wch:15}, {wch:15}, {wch:15}, {wch:15}, {wch:15}, {wch:15}, {wch:15}
				]

				Xlsx.writeFile(workBook, "기간별 정산 관리.xlsx");
				showLoadingDownload.value = false;
			}

			getYear();
			getAdjustAmountMonthlyThisLastYear();
			getAdjustMonthlyThisYear();
			searchData();

			onUnmounted(() => {
				ElMessage.closeAll();
			})

			return {
				showLoadingDownload,
				year,
				search,
				thisLastYearLineData,
				thisYearLineData,
				weeklyData,
				monthlyData,
				numberFormatter,
				changePeriod,
				searchData,
				resetForm,
				checkClassValue,
				checkValue,
				exportExcel,
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
