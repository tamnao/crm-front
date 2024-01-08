<template>
	<div>
		<div class="page-home">	
			<div class="layout-content">	
				<div class="content-title">	
					<span>Home</span>	
					<h2>대시보드</h2>	
				</div>	
				<hr class="gutter-medium">	
				<div class="section-total">	
					<i class="material-icons-outlined">functions</i>	
					<h2>총 매출액</h2>	
					<div>	
						<dl class="label-percentage">	
							<dd :class="checkGrowth(totalSales.growth)"> {{ totalSales.growth }}&#37;</dd>	
							<dt>작년 동일 기간</dt>	
						</dl>	
						<p class="text-price">	
							<span class="fw-bold">{{ numberFormatter(totalSales.thisYearSalesAmount) }}</span> 원	
						</p>	
					</div>	
				</div>	
				<hr class="gutter-large">	
				<div class="section section-monthly">	
					<h3>월별 매출액</h3>	
					<div class="chart-column-single chart-area">	
						<loading-chart v-if="monthlySalesColumnData.chartInfo.showLoading" />
						<basic-column-chart-wrapper v-else :data="monthlySalesColumnData" :key="monthlySalesColumnData.chartInfo.key"/>
					</div>	
				</div><!--//section-->	
				<div class="section section-ranking">	
					<h3>매출 순위
						<div class="section-filter">
							<select v-model="salesRankSearch.year" style="margin-right: 3px;" @change="getSalesRank">
								<option v-for="(y, index) in year" :key="index" :value="y"> {{ y }}년 </option>
							</select>
							<select v-model="salesRankSearch.month" style="margin-right: 3px;" @change="getSalesRank">
								<option v-for="(month, index) in 12" :key="index" :value="month"> {{ month }}월 </option>
							</select>
							<select v-model="salesRankSearch.categories" style="margin-right: 3px;" @change="getSalesRank">
								<option value="">전체</option>
								<option v-for="(cat, index) in category" :key="index" :value="cat.value"> {{ cat.label }} </option>
							</select>
						</div>    
					</h3>	
					<table class="table table-borderless">	
						<thead>	
							<tr>	
								<th scope="col" class="nowrap tc">순위</th>	
								<th scope="col" class="nowrap tc">구분</th>	
								<th scope="col" class="nowrap tc">업체명</th>	
								<th scope="col" class="nowrap tr tc">매출액</th>	
							</tr>	
						</thead>	
						<tbody>
							<tr v-if="!salesRankTableData.showTableData">
								<th colspan="4" style="text-align: center">  
									<el-icon class="is-loading loading-size"><loading /></el-icon>
								</th>
							</tr>	
							<tr v-else-if="salesRankTableData.data.length == 0">
								<th colspan="4" style="text-align: center">  
									데이터가 없습니다
								</th>
							</tr>
							<tr v-else v-for="(data, index) in salesRankTableData.data" :key="index" :class="checkRow(data.rowNo)">	
								<th scope="row" class="nowrap tc">{{ data.rowNo }}</th>	
								<th class="nowrap tc">{{ data.category }}</th>	
								<td class="text-ellipsis">
									<el-tooltip
										effect="light"
										placement="bottom-start"
										:content="data.storeName"
									>
										<span>{{ data.storeName }}</span>
									</el-tooltip>
								</td>	
								<td class="nowrap tr">{{ numberFormatter(data.salesAmount) }}원</td>	
							</tr>	
						</tbody>	
					</table>	
				</div><!--//section-->	
				<hr class="gutter-large">	
				<div class="section section-weekly">	
					<h3>주간 매출 비교</h3>	
					<div class="chart-column chart-area">	
						<loading-chart v-if="weeklySalesColumnData.chartInfo.showLoading" />
						<basic-column-chart-wrapper v-else :data="weeklySalesColumnData" :key="weeklySalesColumnData.chartInfo.key"/>
					</div>	
				</div><!--//section-->	
				<div class="section section-location">	
					<h3>매출 지역 분포</h3>	
					<div class="chart-simpleDonut">	
						<div class="chart-area">	
							<loading-chart v-if="sidoSalesDonutData.chartInfo.showLoading" />
							<gradient-donut-chart-wrapper v-else :data="sidoSalesDonutData" :key="sidoSalesDonutData.chartInfo.key"/>
						</div>	
						<ul class="list-label">	
							<template v-for="(data, index) in top6Data(sidoSalesDonutData.chartData[0].data)" :key="index">	
								<li class="chart-label color-customize" :style="'--customize-color:' + checkColors(index) + ';'" >	
									<h6>{{ data.x }} : {{ calPercentage(data.y) }}&#37;</h6>	
									<span>{{ numberFormatter(data.y) }}원</span>	
								</li>
							</template>	
						</ul>	
					</div>	
				</div><!--//section-->	
				<hr class="gutter-large">	
				<div class="section-status">	
					<div>	
						<h5>	
							<span>총 회원 수</span><br>{{ today }}	
							<i class="material-icons-outlined">account_circle</i>	
						</h5>	
						<p class="text-price">	
							<span class="fw-bold">{{ numberFormatter(userStatistic.userCountToday) }}</span> 명	
						</p>	
						<dl class="label-percentage">	
							<dd :class="checkGrowth(userStatistic.userGrowth)"> {{ userStatistic.userGrowth }}&#37;</dd>	
							<dt>전일 대비</dt>	
						</dl>	
					</div>	
					<div>	
						<h5>	
							<span>총 고객 수</span><br>{{ today }}	
							<i class="material-icons-outlined">groups</i>	
						</h5>	
						<p class="text-price">	
							<span class="fw-bold">{{ numberFormatter(userStatistic.customerCountToday) }}</span> 명	
						</p>	
						<dl class="label-percentage">	
							<dd :class="checkGrowth(userStatistic.customerGrowth)"> {{ userStatistic.customerGrowth }}&#37;</dd>	
							<dt>전일 대비</dt>	
						</dl>	
					</div>	
					<div>	
						<h5>	
							<span>총 업체 수</span><br>{{ today }}	
							<i class="material-icons-outlined">business</i>	
						</h5>	
						<p class="text-price">	
							<span class="fw-bold">{{ numberFormatter(storeStatistic.storeCountToday) }}</span> 	
						</p>	
						<dl class="label-percentage">	
							<dd :class="checkGrowth(storeStatistic.storeGrowth)"> {{ storeStatistic.storeGrowth }}&#37;</dd>		
							<dt>전일 대비</dt>	
						</dl>	
					</div>	
					<div>	
						<h5>	
							<span>총 승인 업체 수</span><br>{{ today }}	
							<i class="material-icons-outlined">verified</i>	
						</h5>	
						<p class="text-price">	
							<span class="fw-bold">{{ numberFormatter(storeStatistic.storeConfirmToday) }}</span> 	
						</p>	
						<dl class="label-percentage">	
							<dd :class="checkGrowth(storeStatistic.storeConfirmGrowth)"> {{ storeStatistic.storeConfirmGrowth }}&#37;</dd>		
							<dt>전일 대비</dt>	
						</dl>	
					</div>	
				</div><!--//section-->	
			</div><!--//layout-content-->	
		</div>	
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, reactive, onUnmounted } from '@vue/runtime-core'; 
	import { numberFormatter, calculatePercentage } from '@/utils/CommonUtils';
	import { Loading } from '@element-plus/icons';
	import moment from "moment/moment";
	import codeService from '@/services/code/CodeServices';
	import DashboardService from '@/services/main/DashboardService'; 
	import BasicColumnChartWrapper from "@/components/charts/column/BasicColumnChartWrapper.vue";
	import GradientDonutChartWrapper from "@/components/charts/pie/GradientDonutChartWrapper.vue";
	import LoadingChart from "@/components/charts/loading/Loading.vue";
import { ElMessage } from 'element-plus';

	export default defineComponent({
		components: {
			"loading" : Loading,
			"basic-column-chart-wrapper" : BasicColumnChartWrapper,
			"gradient-donut-chart-wrapper" : GradientDonutChartWrapper,
			"loading-chart" : LoadingChart
		},

		setup() {
			const today = moment().format("YYYY-MM-DD HH:mm")
			const colors = ["#2E2F2E", "#CCD2E0", "#A59E96", "#B9958D", "#EECFB7", "#E4B9B9", "#DF4F49"];
			
			let year = [moment().year().toString()];

			let category = ref([]) as any;

			let salesRankSearch = reactive({
				year: moment().year().toString(), 
				month: moment().month() + 1,
				categories: "",
			})
			
			let salesRankTableData = ref({
				data: [],
				showTableData: true,
			});

			let totalSidoDonutValue = 0;

			let totalSales = ref({
				thisYearSalesAmount: 0,
				lastYearSalesAmount: 0,
				growth: 0
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
					colors: ["#33CCFF", "#0066FF"],
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

			let weeklySalesColumnData = ref({
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
					colors: ["#33CCFF", "#0066FF"],
					showLegend: true,
					columnWidth: "25",
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

			let sidoSalesDonutData = ref({
				chartInfo: {
					key: 1,
					width: "150%",
					chartType: "DONUT",
					showTooltip: true,
					showLabels: false,
					showLegend: false,
					colors: colors,
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

			let userStatistic = ref({
				userCountToday: 0,
				userCountYesterday: 0,
				userGrowth: 0,
				customerCountToday: 0,
				customerCountYesterday: 0,
				customerGrowth: 0
			});

			let storeStatistic = ref({
				storeCountToday: 0,
				storeCountYesterday: 0,
				storeGrowth: 0,
				storeConfirmToday: 0,
				storeConfirmYesterDay: 0,
				storeConfirmGrowth: 0
			});

			function getAllData() {
				getTotalSaleAmount();
				getMonthlySalesAmountChart();
				getWeeklySalesAmountChart();
				getRegionSalesDistribution();
				getSalesRank();
				getUserStatistic();
				getStoreStatistic();
			}

			function getTotalSaleAmount() {
				DashboardService.totalSaleAmount().then((res:any) => {
					totalSales.value = res;
				})
			}

			function getMonthlySalesAmountChart() {
				monthlySalesColumnData.value.chartInfo.showLoading = true;
				DashboardService.monthlySalesAmountChart().then((res:any) => {
					monthlySalesColumnData.value.chartData = res;
					monthlySalesColumnData.value.chartInfo.key++;
					monthlySalesColumnData.value.chartInfo.showLoading = false;
				})
				.catch(err => {
					monthlySalesColumnData.value.chartInfo.showLoading = false;
				});
			}

			function getWeeklySalesAmountChart() {
				weeklySalesColumnData.value.chartInfo.showLoading = true;
				DashboardService.weeklySalesAmountCategory().then((res: any) => {
					weeklySalesColumnData.value.chartData = res;
					weeklySalesColumnData.value.chartInfo.key++;
					weeklySalesColumnData.value.chartInfo.showLoading = false;
				})
				.catch(err => {
					weeklySalesColumnData.value.chartInfo.showLoading = false;
				});
			}

			function getRegionSalesDistribution() {
				sidoSalesDonutData.value.chartInfo.showLoading = true;
				DashboardService.sidoSalesAmount().then((res: any) => {
					sidoSalesDonutData.value.chartData[0].data = res;
					sidoSalesDonutData.value.chartInfo.key++;
					for(let data of res) {
						totalSidoDonutValue = totalSidoDonutValue + data.y;
					}
					sidoSalesDonutData.value.chartInfo.showLoading = false;
				})
				.catch(err => {
					sidoSalesDonutData.value.chartInfo.showLoading = false;
				});
			}

			function getSalesRank() {
				salesRankTableData.value.showTableData = false;
				DashboardService.topStoreSalesAmount(salesRankSearch).then((res: any) => {
					salesRankTableData.value.data = res;
					salesRankTableData.value.showTableData = true;
				})
				.catch(err => {
					salesRankTableData.value.showTableData = true;
				});
			}

			function getUserStatistic() {
				DashboardService.userStatistic().then((res:any) => {
					userStatistic.value = res[0];
				})
			}

			function getStoreStatistic() {
				DashboardService.storeStatistic().then((res:any) => {
					storeStatistic.value = res[0];
				})
			}
			
			function calPercentage(yValue:any) {
				return calculatePercentage(yValue, totalSidoDonutValue);
			}

			function checkRow(rowNo:number) {
				if(rowNo == 1) {
					return 'active'
				} 
			}

			function checkColors(index:number) {
				return colors[index%colors.length];
			}

			function checkGrowth(growth:number) {
				if(growth > 0) {
					return "label-green"
				} else if(growth < 0) {
					return "label-red"
				} else if(growth == 0) {
					return "label-gray"
				}
			}

			function top6Data(data:any) {
				let top6Values = [...data].sort((a, b) => b.x - a.x).slice(0, 6);
				return top6Values;
			}

			function getYear() {
				let startYear = "2015";
				while (year[year.length-1] != startYear) {
					let newYear = moment().set('year', Number(year[year.length-1])).subtract(1, 'year').year().toString();
					year.push(newYear);
				}
			}

			function getCategory() {
				codeService.selectListByParentCode("PCAT").then(res => {
					category.value = res;
				})
			}

			getYear();
			getCategory();
			getAllData();

			onUnmounted(() => {
				ElMessage.closeAll();
			})

			return {
				today,
				year, 
				category,
				salesRankSearch,
				totalSales,
				monthlySalesColumnData,
				weeklySalesColumnData,
				sidoSalesDonutData,
				salesRankTableData,
				userStatistic,
				storeStatistic,
				numberFormatter,
				calPercentage,
				getSalesRank,
				checkRow,
				checkColors,
				checkGrowth,
				top6Data,
			}
		}
	})
</script>

<style scoped>
	.chart-label.color-customize:before {
		background-color: var(--customize-color);
	}

	.label-green:before {
		content: "\2191 ";
	}

	.label-red:before {
		content: "\2193 ";
	}

	h5 {
		font-size: inherit;
		font-weight: normal;
	}

	.chart-label { margin-right: 20px;}
</style>
