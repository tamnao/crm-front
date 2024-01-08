<template>
	<div>
		<div class="layout-content">
			<div class="content-title">
				<span>외부 데이터 분석</span>
				<h2>유동인구와 상품 판매량</h2>
			</div>
			<form class="form-filter" @submit.prevent="false">
				<div>
					<dl class="filter-item">
						<dt> 검색년월 동기화</dt>
						<dd>
							<el-switch
								v-model="syncChecked"
								class="ml-2"
								active-color="#13ce66"
								inactive-color="#ff4949"
								@change="syncMap"
								style="margin:8px 0px;"
							/>
						</dd>
					</dl>
				</div>
			</form>
			<!--//form-filter-->
			<hr class="gutter-large" />
			<!--모달용 버튼
			- 'data-bs-target'과 모달의 id가 일치해야 합니다.
		-->
			<a style="display: none" id="modalTrigger" data-bs-toggle="modal" data-bs-target="#modalEupmyeondong">모달용 버튼 1</a>
			<div>
				<div class="map-area">
					<div id="sliderExt" style="margin:10px 0px;">
					</div>
					<div v-if="mapData.info.showLoading">
						<loading-chart />
					</div>
					<div v-if="!mapData.info.showLoading && mapData.data.length > 0">
						<MapEmdWrapper :data="mapData" />
					</div>
					<div v-if="!mapData.info.showLoading && mapData.data.length == 0" class="no-data">
						유동인구 데이터가 없습니다.
					</div>
				</div>
				<div class="map-area">
					<div id="sliderTamnao" style="margin:10px 0px;">
					</div>
					<div v-if="mapData2.info.showLoading">
						<loading-chart />
					</div>
					<div v-if="!mapData2.info.showLoading && mapData2.data.length > 0">
						<MapEmdWrapper :data="mapData2" />
					</div>
					<div v-if="!mapData2.info.showLoading && mapData2.data.length == 0" class="no-data">
						탐나오 매출 데이터가 없습니다.
					</div>
				</div>
			</div>
			<div style="clear:both;margin-top: 20px; ">
				<loading-chart v-if="floatSalesChartData.chartInfo.showLoading" />
				<LineChartWrapper v-else :data="floatSalesChartData" />
			</div>
		</div>
		
		<!--//layout-content-->
		<!-- Modal -->
		<div
			class="modal fade modal-table"
			id="modalEupmyeondong"
			tabindex="-1"
			aria-hidden="true"
		>
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">{{ searchDto.eupmyeondong }}</h5>
						<!--지도에서 클릭한 지역명 노출-->
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						>
							close
						</button>
					</div>
					<div class="modal-body">
						<table class="table">
							<thead>
								<tr>
									<th scope="col" class="nowrap tc">순위</th>
									<th scope="col" class="tc">카테고리</th>
									<th scope="col" class="tc">업체명</th>
									<th scope="col" class="nowrap tc">비율</th>
								</tr>
							</thead>
							<tbody v-if="emdInfo.length > 0">
								<template v-for="(item, index) in emdInfo" :key="item.storeName + '_' + index">
									<tr class="active" v-if="index == 0">
										<th scope="row" class="nowrap tc">{{ item.rowNo }}</th>
										<td class="nowrap tc">{{ item.category }}</td>
										<td class="fw-bold">{{ item.storeName }}</td>
										<td class="tr">{{ item.salesRatio }} &#37;</td>
									</tr>
									<tr v-else>
										<th scope="row" class="nowrap tc">{{ item.rowNo }}</th>
										<td class="nowrap tc">{{ item.category }}</td>
										<td class="fw-bold">{{ item.storeName }}</td>
										<td class="tr">{{ item.salesRatio }} &#37;</td>
									</tr>
								</template>
							</tbody>
							<tbody v-else>
								<tr>
									<th colspan="4" style="text-align: center" scope="row" class="nowrap tc">데이터가 없습니다</th>
								</tr>
							</tbody>
						</table>
					</div>
					<!--//modal-body-->
				</div>
			</div>
		</div>
		<!--//modal-->
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, onUnmounted, reactive, ref } from '@vue/runtime-core';
	import ExternalDataService from "@/services/external/ExternalDataService";
	import StoreService from "@/services/store/StoreService";
	import moment from "moment/moment";
	import LoadingChart from "@/components/charts/loading/Loading.vue";
	import { ElMessage } from 'element-plus';
	import MapEmdWrapper from "@/components/charts/mapemd/MapEmdWrapper.vue"
	import LineChartWrapper from "@/components/charts/line/LineChartWrapper.vue";
	import noUiSlider from "nouislider"
	import 'nouislider/dist/nouislider.css'
	

	export default defineComponent({
		components: {
			MapEmdWrapper,
			LineChartWrapper,
			"loading-chart" : LoadingChart
		},
		setup() {
			let yearMonthExt = {} as any;
			let yearMonthTamnao = {} as any;

			let year = ref([]) as any;

			let month = ref([]) as any;

			let emdInfo = ref([]) as any;

			let searchDto = reactive({
				year: moment().year(),
				month: moment().month(),
				sigungu: '',
				eupmyeondong: ''
			});

			let primaryHeatMap = ref();
			let secondaryHeatMap = ref();

			let syncChecked = ref(true);

			let sliderExt = null as any;
			let sliderTamnao = null as any;
			
			let currentYearMonth = {
				extYear: 0,
				extMonth: 0,
				tamnaoYear: 0,
				tamnaoMonth: 0,
			}

			let mapData = ref({
				info: {
					minValueColor: "#addccc",
					midValueColor: "#2bc3cd",
					maxValueColor: "#0b55d0",
					mapType: "map",
					location: "Jeju",
					title: "제주데이터허브 읍면동 유동인구",
					mapId: "map1",
					mapHeight: '600px',
					postfix: '명',
					showLoading: true,
					clickHandler: (params:any) => {
						getStoreSalesEupmyeondong(params.name);
					},
				},
				data: [] as any,
			});

			let mapData2 = ref({
				info: {
					minValueColor: "#addccc",
					midValueColor: "#2bc3cd",
					maxValueColor: "#0b55d0",
					mapType: "map",
					location: "Jeju",
					title: "탐나오 읍면동 매출현황",
					mapId: "map2",
					mapHeight: '600px',
					postfix: '원',
					showLoading: true,
					clickHandler: (params:any) => {
						getStoreSalesEupmyeondong(params.name);
					},
				},
				data: [] as any,
			});

			let floatSalesChartData = ref({
				chartInfo: {
					height: "295px",
					width: "100%",
					chartType: "LINE",
					chartValueUnit: "%",
					xaxisTitle: "",
					yaxisTitleList: ["유동인구", "탐나오 매출"] as any,
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
				},
				chartData: [] as any,
			});

			async function getYearMonth() {
				await ExternalDataService.getFloatingPopulationStartEndYearMonth().then(res => {
					yearMonthExt = res;
				});
				await StoreService.getStartEndYearMonth().then(res => {
					yearMonthTamnao = res;
				})
			}

			function searchTamnao(year:number, month:number) {
				if (year < yearMonthTamnao.startYear || (year == yearMonthTamnao.startYear && month < yearMonthTamnao.startMonth)) {
					year = yearMonthTamnao.startYear;
					month = yearMonthTamnao.startMonth;
				} else if (year > yearMonthTamnao.endYear || (year == yearMonthTamnao.endYear && month > yearMonthTamnao.endMonth)) {
					year = yearMonthTamnao.endYear;
					month = yearMonthTamnao.endMonth;
				}

				if (year == currentYearMonth.tamnaoYear && month == currentYearMonth.tamnaoMonth)
					return;
				mapData2.value.info.showLoading = true;
				
				currentYearMonth.tamnaoYear = year;
				currentYearMonth.tamnaoMonth = month;
				let extValue = getSliderValue(yearMonthTamnao.startYear, yearMonthTamnao.startMonth, year, month);
				
				try {
					sliderTamnao.noUiSlider.set(extValue);
				} catch(e) {
					// console.log(e);
				}
				
				StoreService.getStoreSalesMapEmd(year, month, null).then(res => {
					mapData2.value.data = res;
					mapData2.value.info.showLoading = false;
				});
				getFloatPopulationChartEmdSales(currentYearMonth.extYear, currentYearMonth.extMonth, currentYearMonth.tamnaoYear, currentYearMonth.tamnaoMonth);
			}

			function searchExt(year:number, month:number) {
				if (year < yearMonthExt.startYear || (year == yearMonthExt.startYear && month < yearMonthExt.startMonth)) {
					year = yearMonthExt.startYear;
					month = yearMonthExt.startMonth;
				} else if (year > yearMonthExt.endYear || (year == yearMonthExt.endYear && month > yearMonthExt.endMonth)) {
					year = yearMonthExt.endYear;
					month = yearMonthExt.endMonth;
				}
				// console.log(year, month, currentYearMonth.extYear, currentYearMonth.extMonth);
				if (year == currentYearMonth.extYear && month == currentYearMonth.extMonth)
					return;

				mapData.value.info.showLoading = true;
				currentYearMonth.extYear = year;
				currentYearMonth.extMonth = month;
				
				let extValue = getSliderValue(yearMonthExt.startYear, yearMonthExt.startMonth, year, month);
				
				try {
					sliderExt.noUiSlider.set(extValue);
				} catch (e) {
					// console.log(e);
				}
				
				ExternalDataService.getFloatPopulationMapEmd(year, month).then((res) => {
					mapData.value.data = res;
					mapData.value.info.showLoading = false;
				});

				getFloatPopulationChartEmdSales(currentYearMonth.extYear, currentYearMonth.extMonth, currentYearMonth.tamnaoYear, currentYearMonth.tamnaoMonth);
			}

			function getStoreSalesEupmyeondong(addressInfo:any) {				
				const addressPart = addressInfo.split(" ");
				searchDto.year = currentYearMonth.tamnaoYear;
				searchDto.month = currentYearMonth.tamnaoMonth;
				searchDto.sigungu = addressPart[0];
				searchDto.eupmyeondong = addressPart[1];
				StoreService.getStoreSalesEupmyeondong(searchDto).then(res => {
					emdInfo.value = res;
					document.getElementById("modalTrigger")?.click();
				});
			}

			function getFloatPopulationChartEmdSales(year:number, month:number, salesYear:number, salesMonth: number) {
				if (floatSalesChartData.value.chartInfo.showLoading)
					return;
				floatSalesChartData.value.chartInfo.showLoading = true;
				ExternalDataService.getFloatPopulationChartEmdSales(year, month, salesYear, salesMonth).then((res) => {
					for(let index in res) {
						if(Number(index)==0)
							floatSalesChartData.value.chartInfo.seriesLeftYaxis.push(res[index].name);
						else
							floatSalesChartData.value.chartInfo.seriesRightYaxis.push(res[index].name);
					}
					floatSalesChartData.value.chartData = res;
					floatSalesChartData.value.chartInfo.showLoading = false;
				});
			}

			onMounted(() => {
				(async() => {
					await getYearMonth();

					let dateExtEnd = new Date(yearMonthExt.endYear, yearMonthExt.endMonth);
					let dateTamaoEnd= new Date(yearMonthTamnao.endYear, yearMonthTamnao.endMonth);
				
					let searchYear = dateExtEnd > dateTamaoEnd ? yearMonthTamnao.endYear : yearMonthExt.endYear;
					let searchMonth = dateExtEnd > dateTamaoEnd ? yearMonthTamnao.endMonth : yearMonthExt.endMonth;

					let dateExtValue = getSliderValue(yearMonthExt.startYear, yearMonthExt.startMonth, searchYear, searchMonth);
					let dateTamnaoValue = getSliderValue(yearMonthTamnao.startYear, yearMonthTamnao.startMonth, searchYear, searchMonth);

					sliderExt = document.getElementById("sliderExt")!;
					noUiSlider.create(sliderExt, {
						start:[dateExtValue],
						range: {
							'min': [1],
							'max': [yearMonthExt.countMonth]
						},
						step: 1,
						tooltips: [ true ],
					});
					sliderTooltip(sliderExt, yearMonthExt.startYear, yearMonthExt.startMonth);

					sliderTamnao = document.getElementById("sliderTamnao")!;
					noUiSlider.create(sliderTamnao, {
						start:[dateTamnaoValue],
						range: {
							'min': [1],
							'max': [yearMonthTamnao.countMonth]
						},
						step: 1,
						tooltips: [ true ],
					});
					sliderTooltip(sliderTamnao, yearMonthTamnao.startYear, yearMonthTamnao.startMonth);

					getFloatPopulationChartEmdSales(searchYear, searchMonth, searchYear, searchMonth);
					searchExt(searchYear, searchMonth);
					searchTamnao(searchYear, searchMonth);
				})();
			})

			function getSliderValue(startYear: number, startMonth: number, endYear: number, endMonth: number) {
				let result = endMonth < startMonth ? (endYear - startYear - 1) * 12 : (endYear - startYear) * 12;

				if (endMonth < startMonth) {
					result += 12 - startMonth + endMonth;
				} else {
					result += endMonth - startMonth;

				}

				return result + 1;
			}

			function sliderTooltip(slider:any, startYear: number, startMonth: number) {
				slider.noUiSlider.on('update', function(values:any, handle:any, unencoded:any, tap:any, positions:any) {
					let tooltips = slider.noUiSlider.getTooltips();
					let value = parseInt(values[0]);

					tooltips[0].innerHTML = getYearMonthWithSliderValue(startYear, startMonth, value);
				});

				slider.noUiSlider.on("change", function(values:any, handle:any, unencoded:any, tap:any, positions:any) {
					let tooltips = slider.noUiSlider.getTooltips()[0].innerHTML;
					let yearMonth = tooltips.split('-');
					let searchYear = parseInt(yearMonth[0]);
					let searchMonth = parseInt(yearMonth[1]);
					if (slider.id == 'sliderExt') {
						searchExt(searchYear, searchMonth);
						if (syncChecked.value) {
							let tamnaoValue = getSliderValue(yearMonthTamnao.startYear, yearMonthTamnao.startMonth, searchYear, searchMonth);
							sliderTamnao.noUiSlider.set(tamnaoValue);
							searchTamnao(searchYear, searchMonth);

						}
					} else {
						searchTamnao(searchYear, searchMonth);
						if (syncChecked.value) {
							let extValue = getSliderValue(yearMonthExt.startYear, yearMonthExt.startMonth, searchYear, searchMonth);
							sliderExt.noUiSlider.set(extValue);
							searchExt(searchYear, searchMonth);
						}
					}
				});
			}


			function getYearMonthWithSliderValue(startYear: number, startMonth: number, value: number) {
				let tempValue = value - 1;
				let tooltipMonth = (tempValue + startMonth) % 12;
				if (tooltipMonth == 0)
					tooltipMonth = 12;

				let tooltipYear = startYear + Math.floor((tempValue + startMonth) / 12);
				if ((tempValue + startMonth) % 12 == 0)
					tooltipYear--;

				let tempTooltipMonth = (tooltipMonth + "").padStart(2, "0");
				return tooltipYear + "-" + tempTooltipMonth;
			}

			function syncMap() {
				if (!syncChecked.value)
					return;

				if (currentYearMonth.extYear == currentYearMonth.tamnaoYear && currentYearMonth.extMonth == currentYearMonth.tamnaoMonth)
					return;

				// 외부데이터 검색 년월 >= 탐나오 검색 년월 
				if (currentYearMonth.extYear > currentYearMonth.tamnaoYear ||
					(currentYearMonth.extYear == currentYearMonth.tamnaoYear && currentYearMonth.extMonth > currentYearMonth.tamnaoMonth)) {
					searchTamnao(currentYearMonth.extYear, currentYearMonth.extMonth);	
				} else {
					searchExt(currentYearMonth.tamnaoYear, currentYearMonth.tamnaoMonth);		
				}
			}

			onUnmounted(() => {
				ElMessage.closeAll();
			})

			return {
				searchDto,
				primaryHeatMap,
				secondaryHeatMap,
				mapData,
				mapData2,
				year,
				month,
				emdInfo,
				sliderTooltip,
				syncMap,
				syncChecked,
				floatSalesChartData,
			}
		}
	})
</script>

<!--style src="@vueform/slider/themes/default.css"></style-->
<style scoped>
	@media (min-width: 1385px) {
		.map-area:first-child { width: 49% !important; height:650px !important; float:left; }
		.map-area:nth-child(2) { width: 49% !important; height:650px !important; float:right; }		
	}
	@media (max-width: 1385px) {
		.map-area:first-child { width: 100%; height:650px !important; }
		.map-area:nth-child(2) { width: 100%; height:650px !important; }		
	}
	.no-data { font-size: 2em; text-align: center; }
</style>

