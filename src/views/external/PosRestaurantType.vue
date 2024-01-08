<template>
	<div class="page-data-type">
		<div class="layout-content">
			<div class="content-title">
				<span>외부 데이터 분석</span>
				<h2>POS&#47;음식점 유형별 분석</h2>
			</div>
			<form class="form-filter" @submit.prevent="false">
				<!--dl class="filter-item">
					<dt>연도 &#47; 월</dt>
					<dd>
						<select v-model="searchDto.year" @change="initializeMonth()">
							<option v-for="(y, index) in year" :key="index + '_' + y" :value="y">{{ y }}년</option>
						</select>
						<select v-model="searchDto.month">
							<option v-for="(m, index) in month" :key="index + '_' + m" :value="m">{{ m }}월</option>
						</select>
					</dd>
				</dl-->
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
				<!--div class="filter-buttons">
					<button type="submit" class="btn-h40 btn-primary" @click="searchData">
						검색
					</button>
					<button type="button" class="btn-h40 btn-outline" @click="initializeAll">
						초기화
					</button>
				</div-->
			</form>
			<!--//form-filter-->

			<hr class="gutter-large" />

			<div>
				<div class="map-area">
					<div id="sliderExt" style="margin-bottom:10px;">
					</div>	
					<div v-if="mapData.info.showLoading">
						<loading-chart />
					</div>
					<div v-if="!mapData.info.showLoading && mapData.data.length > 0">
						<MapEmdWrapper :data="mapData" />
					</div>
					<div v-if="!mapData.info.showLoading && mapData.data.length == 0" class="no-data">
						제주데이터허브 읍면동 유동인구 대비 맛집 데이터가 없습니다.
					</div>
				</div>
				<div class="map-area">
					<div id="sliderTamnao" style="margin-bottom:10px;">
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

			<!-- <hr class="gutter-large" > -->

			<div class="section section-half" style="margin-top: 5%">
				<h3>카드 맛집 매출 TOP 10</h3>
                <div class="chart">
					<div class="chart-area">
						<loading-chart v-if="top10CardRestaurantSalesBar.chartInfo.showLoading" />
						<BasicColumnChartWrapper 
						v-else-if="!top10CardRestaurantSalesBar.chartInfo.showLoading && top10CardRestaurantSalesBar.chartData[0].data.length > 0" 
						:data="top10CardRestaurantSalesBar" 
						:key="top10CardRestaurantSalesBar.chartInfo.key"/>
					</div>
				</div>
			</div>
			<!--//section-->

            <div class="section section-half" style="margin-top: 5%">
				<h3>탐나오 맛집 매출 TOP 10</h3>
                <div class="chart">
					<div class="chart-area">
						<loading-chart v-if="top10RestaurantBar.chartInfo.showLoading" />
						<BasicColumnChartWrapper 
						v-else-if="!top10RestaurantBar.chartInfo.showLoading && top10RestaurantBar.chartData[0].data.length > 0" 
						:data="top10RestaurantBar" 
						:key="top10RestaurantBar.chartInfo.key"/>
					</div>
				</div>
			</div>
			<!--//section-->

			<hr class="gutter-large" />

            <div class="section section-linechart">
				<h3>카드 음식 업종별 매출</h3>
                <div class="chart">
					<div class="chart-area">
						<loading-chart v-if="totalMonthlyFoodCategoryLine.chartInfo.showLoading" />
						<LineChartWrapper 
						v-else-if="!totalMonthlyFoodCategoryLine.chartInfo.showLoading && totalMonthlyFoodCategoryLine.chartData.length > 0" 
						:data="totalMonthlyFoodCategoryLine" 
						:key="totalMonthlyFoodCategoryLine.chartInfo.key" />
					</div>
				</div>
			</div>
			<!--//section-->

			<hr class="gutter-large" />

            <div class="section section-linechart">
				<h3>카드 연령별 메뉴 선호도</h3>
                <div class="chart">
					<div class="chart-area">
						<loading-chart v-if="menuPreferenceByAgeStackedBar.chartInfo.showLoading" />
						<BarChartWrapper 
						v-else-if="!menuPreferenceByAgeStackedBar.chartInfo.showLoading && menuPreferenceByAgeStackedBar.chartData.length > 0" 
						:data="menuPreferenceByAgeStackedBar" 
						:key="menuPreferenceByAgeStackedBar.chartInfo.key"/>
					</div>
				</div>
			</div>
			<!--//section-->
		</div>
		<!--//layout-content-->
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, onUnmounted, reactive, ref } from "@vue/runtime-core";
	import BasicColumnChartWrapper from "@/components/charts/column/BasicColumnChartWrapper.vue";
    import LineChartWrapper from "@/components/charts/line/LineChartWrapper.vue";
    import BarChartWrapper from '@/components/charts/bar/BarChartWrapper.vue';
    import moment from 'moment/moment';
	import MapEmdWrapper from "@/components/charts/mapemd/MapEmdWrapper.vue"
    import ExternalDataService from "@/services/external/ExternalDataService";
	import StoreService from "@/services/store/StoreService";
	import LoadingChart from "@/components/charts/loading/Loading.vue";
	import { ElMessage } from "element-plus";
	import noUiSlider from "nouislider"
	import 'nouislider/dist/nouislider.css'

	export default defineComponent({
		components: {
			MapEmdWrapper,
			BasicColumnChartWrapper,
			LineChartWrapper,
			BarChartWrapper,
			LoadingChart
		},
		setup() {
			let yearMonth = ref({}) as any;

			let yearMonthExt = {} as any;
			let yearMonthTamnao = {} as any;

            let year = ref([]) as any;

            let month = ref([]) as any;

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
					title: "제주데이터허브 읍면동 유동인구 대비 맛집",
					mapId: "map1",
					mapHeight: '600px',
					postfix: '명',
					showLoading: true,
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
                },
                data: [] as any,
            });

			let top10RestaurantBar = ref({
				chartInfo: {
					key: 0,
					showLoading: false,
					height: "430",
                    width: "100%",
					columnWidth: "20%",
					chartType: "BAR",
					chartValueUnit: "%",
					borderRadius: 5,
					showLegend: false,
					isStacked: false,
					stackType: "100%",
					yaxisName: "",
					xaxisTitle: "",
					yaxisTitleList: [],
					xaxisType: "categories", 
					xaxisValue: [],
					yaxisValue: [],
					colors: [
						function(value:any) {
							if(value.dataPointIndex == 0) {
								return "#DF4F49";
							}
							else {
								return "#E4B9B9"
							}
						}
					]
				},
				chartData: [
					{
						name: "",
						type: "bar",
						data: [],
					},
				],
			});

			let top10CardRestaurantSalesBar = ref({
				chartInfo: {
					key: 0,
					showLoading: false,
					allowDuplicateXaxis: true,
					height: "430",
                    width: "100%",
					columnWidth: "20%",
					chartType: "BAR",
					chartValueUnit: "%",
					borderRadius: 5,
					showLegend: false,
					isStacked: false,
					stackType: "100%",
					yaxisName: "",
					xaxisTitle: "",
					yaxisTitleList: [],
					xaxisType: "categories", 
					xaxisValue: [],
					yaxisValue: [],
					colors: [
						function(value:any) {
							if(value.dataPointIndex == 0) {
								return "#2E2F2E";
							}
							else {
								return "#A59E96"
							}
						}
					]
				},
				chartData: [
					{
						name: "",
						type: "bar",
						data: [],
					},
				],
			});

			let totalMonthlyFoodCategoryLine = ref({
                chartData: [],
                chartInfo: {
					key: 0,
					showLoading: false,
                    height: "244",
                    width: "100%",
                    chartType: "LINE",
                    chartValueUnit: "%",
                    xaxisTitle: "",
                    yaxisTitleList: [],
                    xaxisType: "categories", //datetime, categories, numeric
                    lineCurve: "smooth", // smooth, straight, stepline
					colors: ["#A59E96", "#DF4F49", "#E4B9B9", "#2E2F2E"],
					shareTooltip: true,
                }
            });

			let menuPreferenceByAgeStackedBar = ref({
                chartData: [],
                chartInfo: {
					key: 0,
					showLoading: false,
                    height: "295",
                    width: "100%",
					barHeight: "40%",
                    chartType: "BAR_STACKED",
                    chartValueUnit: "",
                    yaxisTitleList: [],
                    xaxisTitle: "",
					colors: ["#A59E96", "#DF4F49", "#E4B9B9", "#2E2F2E"],
                    barStacked: true,
                    stackType: "100%",
                    barHorizontal: true,
                    tooltipShared: true,
                },
            });

			let searchDto = reactive({
				year: moment().format('yyyy'),
				month: moment().format('M'),
			});

			async function getYearMonth() {
				await ExternalDataService.getFloatingPopulationCardFoodStartEndYearMonth().then(res => {
					yearMonthExt = res;

				});
				await StoreService.getStartEndYearMonth().then(res => {
					console.log(res);
					yearMonthTamnao = res;
				})	
			}












			function searchData() {
				/*
				getTop10MonthlySalesAmount();
				getTop10CardRestaurantMonthlySalesAmount();
				getMonthlyFoodCategoryTotal();
				getFoodCategoryTotalGroupByAge();
				*/
			}

			function initializeAll() {
                searchDto.year = yearMonth.endYear;
				searchDto.month = yearMonth.endMonth;
                //searchData();
            }

			function getHeatmapData() {
				mapData.value.info.showLoading = true;
				mapData2.value.info.showLoading = true;

				/*
                ExternalDataService.getFloatingPopulationCardFoodMapEmd(searchDto).then((res) => {
                    mapData.value.data = res;
					mapData.value.info.showLoading = false;
                });
				*/

				/*
                StoreService.getStoreSalesMapEmd(1, 2, 3).then(res => {
                    mapData2.value.data = res;
					mapData2.value.info.showLoading = false;
                });
				*/
            }

			function searchTamnao(year:number, month:number) {
				console.log("searchTamnao....");
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
				// showSliderTamnao();
				
				currentYearMonth.tamnaoYear = year;
				currentYearMonth.tamnaoMonth = month;
				let extValue = getSliderValue(yearMonthTamnao.startYear, yearMonthTamnao.startMonth, year, month);
				
				try {
					sliderTamnao.noUiSlider.set(extValue);
				} catch(e) {
					console.log(e);
				}



				StoreService.getStoreSalesMapEmd(year, month, null).then(res => {
					mapData2.value.data = res;
					mapData2.value.info.showLoading = false;
					
					//showSliderTamnao();
				})
				
				getTop10MonthlySalesAmount();

			}

			function searchExt(year:number, month:number) {
				console.log("searchExt...");
				if (year < yearMonthExt.startYear || (year == yearMonthExt.startYear && month < yearMonthExt.startMonth)) {
					year = yearMonthExt.startYear;
					month = yearMonthExt.startMonth;
				} else if (year > yearMonthExt.endYear || (year == yearMonthExt.endYear && month > yearMonthExt.endMonth)) {
					year = yearMonthExt.endYear;
					month = yearMonthExt.endMonth;
				}
				console.log(year, month, currentYearMonth.extYear, currentYearMonth.extMonth);
				if (year == currentYearMonth.extYear && month == currentYearMonth.extMonth)
					return;

				mapData.value.info.showLoading = true;
				currentYearMonth.extYear = year;
				currentYearMonth.extMonth = month;
				
				let extValue = getSliderValue(yearMonthExt.startYear, yearMonthExt.startMonth, year, month);				
				try {
					sliderExt.noUiSlider.set(extValue);
				} catch (e) {
					console.log(e);
				}
				
				ExternalDataService.getFloatingPopulationCardFoodMapEmd(year, month).then(res => {
					mapData.value.data = res;
					mapData.value.info.showLoading = false;
				})	
				

				getTop10CardRestaurantMonthlySalesAmount();
				getMonthlyFoodCategoryTotal();
				getFoodCategoryTotalGroupByAge();
			}


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
						//currentYearMonth.extYear = searchYear;
						//currentYearMonth.extMonth = searchMonth;
						if (syncChecked.value) {
							let tamnaoValue = getSliderValue(yearMonthTamnao.startYear, yearMonthTamnao.startMonth, searchYear, searchMonth);
							sliderTamnao.noUiSlider.set(tamnaoValue);
							searchTamnao(searchYear, searchMonth);
							//currentYearMonth.tamnaoYear = searchYear;
							//currentYearMonth.tamnaoMonth = searchMonth;

						}
					} else {
						searchTamnao(searchYear, searchMonth);
						//currentYearMonth.tamnaoYear = searchYear;
						//currentYearMonth.tamnaoMonth = searchMonth;

						console.log(syncChecked.value);
						if (syncChecked.value) {
							let extValue = getSliderValue(yearMonthExt.startYear, yearMonthExt.startMonth, searchYear, searchMonth);
							sliderExt.noUiSlider.set(extValue);
							searchExt(searchYear, searchMonth);
							//currentYearMonth.extYear = searchYear;
							//currentYearMonth.extMonth = searchMonth;
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
				console.log(syncChecked.value);
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




			function getTop10MonthlySalesAmount() {
				top10RestaurantBar.value.chartInfo.showLoading = true;

				StoreService.getTop10MonthlySalesAmount(currentYearMonth.tamnaoYear, currentYearMonth.tamnaoMonth).then(res => {
					top10RestaurantBar.value.chartInfo.key++;
					top10RestaurantBar.value.chartData[0].data = res;
					top10RestaurantBar.value.chartInfo.showLoading = false;
				});
			}

			function getTop10CardRestaurantMonthlySalesAmount() {
				console.log("----clallkl----")
				top10CardRestaurantSalesBar.value.chartInfo.showLoading = true;

				ExternalDataService.getFloatingPopulationCardFoodMonthlyTop10(currentYearMonth.extYear, currentYearMonth.extMonth).then(res => {
					top10CardRestaurantSalesBar.value.chartData[0].data = res;
					top10CardRestaurantSalesBar.value.chartInfo.key++;
					top10CardRestaurantSalesBar.value.chartInfo.showLoading = false;
				});
			}

			function getMonthlyFoodCategoryTotal() {
				totalMonthlyFoodCategoryLine.value.chartInfo.showLoading = true;

				ExternalDataService.getFloatingPopulationCardFoodYearlyCategory(currentYearMonth.extYear, currentYearMonth.extMonth).then(res => {
					totalMonthlyFoodCategoryLine.value.chartInfo.key++;
					totalMonthlyFoodCategoryLine.value.chartData = res;
					totalMonthlyFoodCategoryLine.value.chartInfo.showLoading = false;
				});
			}

			function getFoodCategoryTotalGroupByAge() {
				menuPreferenceByAgeStackedBar.value.chartInfo.showLoading = true;

				ExternalDataService.getFloatingPopulationCardFoodMonthlyCategoryAge(currentYearMonth.extYear, currentYearMonth.extMonth).then(res => {
					menuPreferenceByAgeStackedBar.value.chartInfo.key++;
					menuPreferenceByAgeStackedBar.value.chartData = res;
					menuPreferenceByAgeStackedBar.value.chartInfo.showLoading = false;
				})
			}








			function initializeMonth() {
				let start = 1;
				let end = 12;
				if(searchDto.year == yearMonth.endYear) {
					end = yearMonth.endMonth;
					if (parseInt(searchDto.month) > end)
						searchDto.month = end + "";
				} else if(searchDto.year == yearMonth.startYear) {
					start = yearMonth.startMonth;
					if (parseInt(searchDto.month) < start)
						searchDto.month = start + "";
				} 

				let months = [] as any;
				for(let i = start; i <= end; i++)
					months.push(i);

				month.value = months;
			}

			onMounted(() => {
				(async() => {
					await getYearMonth();

					console.log(yearMonthExt.endYear, yearMonthExt.endMonth, yearMonthTamnao.endYear, yearMonthTamnao.endMonth);

					let dateExtEnd = new Date(yearMonthExt.endYear, yearMonthExt.endMonth);
					let dateTamaoEnd= new Date(yearMonthTamnao.endYear, yearMonthTamnao.endMonth);

				
					let searchYear = dateExtEnd > dateTamaoEnd ? yearMonthTamnao.endYear : yearMonthExt.endYear;
					let searchMonth = dateExtEnd > dateTamaoEnd ? yearMonthTamnao.endMonth : yearMonthExt.endMonth;

					let dateExtValue = getSliderValue(yearMonthExt.startYear, yearMonthExt.startMonth, searchYear, searchMonth);
					let dateTamnaoValue = getSliderValue(yearMonthTamnao.startYear, yearMonthTamnao.startMonth, searchYear, searchMonth);

					// console.log(yearMonthExt.startYear, yearMonthExt.startMonth, yearMonthTamnao.startYear, yearMonthTamnao.startMonth, searchYear, searchMonth);
					// console.log(dateExtValue, dateTamnaoValue);

					searchExt(searchYear, searchMonth);
					searchTamnao(searchYear, searchMonth);

					currentYearMonth.extYear = currentYearMonth.tamnaoYear = searchYear;
					currentYearMonth.extMonth = currentYearMonth.tamnaoMonth = searchMonth;

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

					searchData();
				})();				
			});

			onUnmounted(() => {
				ElMessage.closeAll();
			});

			return {
				year,
				month,
				primaryHeatMap,
                secondaryHeatMap,
				mapData,
                mapData2,
				top10RestaurantBar,
				top10CardRestaurantSalesBar,
				totalMonthlyFoodCategoryLine,
				menuPreferenceByAgeStackedBar,
				searchDto,
				searchData,
				initializeAll,
				initializeMonth,
				syncMap,
				syncChecked,
			};
		},
	});
</script>

<style scoped>
	@media (min-width: 1300px) {
		.map-area:first-child { width: 49% !important; height:600px !important; float:left; }
		.map-area:nth-child(2) { width: 49% !important; height:600px !important; float:right; }		
	}

	.no-data { font-size: 2em; text-align: center; }
</style>

