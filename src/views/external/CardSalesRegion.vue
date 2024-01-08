<template>
	<div>
		<div class="layout-content map-fill">
			<div class="content-title">
				<span>외부 데이터 분석</span>
				<h2>지역별 카드&#47;매출 분석</h2>
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
			</form>
			<!--//form-filter-->
			<hr class="gutter-large" />

			<a data-bs-toggle="modal" data-bs-target="#modalRegionsalesOne" id="modalTrigger" style="display:none">모달용 버튼 1</a>

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
						제주데이터허브 읍면동 유동인구 대비 카드 데이터가 없습니다.
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
			<div style="clear:both;margin-top: 20px; ">
				<loading-chart v-if="cardSalesChartData.chartInfo.showLoading" />
				<LineChartWrapper v-else :data="cardSalesChartData" />
			</div>
		</div>
		<!--//layout-content-->
		<!-- Modal -->
		<div
			class="modal fade modal-regionsales"
			id="modalRegionsalesOne"
			tabindex="-1"
			aria-hidden="false" 
		>
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">{{ search.roadName }} 매출 상세 분석</h5>
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
						<div class="section section-gender">
							<h3>카드와 탐나오 성별 이용 금액</h3>
							<div>
								<div class="chart-column-single">
									<h5>카드</h5>
									<div class="chart-area" style="width: 140px; margin-top: -10%">
										<loading-chart v-if="cardGenderStackedColumnData.chartInfo.showLoading" />
										<BasicColumnChartWrapper v-else :data="cardGenderStackedColumnData" :key="cardGenderStackedColumnData.chartInfo.key" />
									</div>
									<ul class="list-label" v-if="cardGenderStackedColumnData.chartData.length > 0" style="margin-top: -10%">
										<template v-for="(data, index) in cardGenderStackedColumnData.chartData" :key="index">
											<li class="chart-label color-gray-medium" v-if="data.name == '남자' ">
												<h6>남자 : {{ calculatePercentage(data.data[0].y, cardGenderStackedColumnData.chartInfo.totalValue) }}&#37;</h6>
											</li>
											<li class="chart-label color-gray-dark" v-else-if="data.name == '여자' ">
												<h6>여자 : {{ calculatePercentage(data.data[0].y, cardGenderStackedColumnData.chartInfo.totalValue) }}&#37;</h6>
											</li>
											<li class="chart-label color-brown-gray" v-else-if="data.name == '알 수 없음' ">
												<h6>알 수 없음 : {{ calculatePercentage(data.data[0].y, cardGenderStackedColumnData.chartInfo.totalValue) }}&#37;</h6>
											</li>
										</template>
									</ul>
								</div>
								<!--//chart-column-single-->
								<div class="chart-column-single">
									<h5>탐나오</h5>
									<div class="chart-area" style="width: 140px; margin-top: -10%">
										<loading-chart v-if="tamnaoGenderStackedColumnData.chartInfo.showLoading" />
										<BasicColumnChartWrapper v-else :data="tamnaoGenderStackedColumnData" :key="tamnaoGenderStackedColumnData.chartInfo.key" />
									</div>
									<ul class="list-label" v-if="tamnaoGenderStackedColumnData.chartData.length > 0" style="margin-top: -10%">
										<template v-for="(data, index) in tamnaoGenderStackedColumnData.chartData" :key="index">	
											<li class="chart-label color-red-light" v-if="data.name == '남자' ">
												<h6>남자 : {{ calculatePercentage(data.data[0].y, tamnaoGenderStackedColumnData.chartInfo.totalValue) }}&#37;</h6>
											</li>
											<li class="chart-label color-red" v-if="data.name == '여자' ">
												<h6>여자 : {{ calculatePercentage(data.data[0].y, tamnaoGenderStackedColumnData.chartInfo.totalValue) }}&#37;</h6>
											</li>
											<li class="chart-label color-red-brown-gray" v-if="data.name == '알 수 없음' ">
												<h6>알 수 없음 : {{ calculatePercentage(data.data[0].y, tamnaoGenderStackedColumnData.chartInfo.totalValue) }}&#37;</h6>
											</li>
										</template>
									</ul>
								</div>
								<!--//chart-column-single-->
							</div>
						</div>
						<!--//section-->
						<div class="section section-age">
							<h3>카드와 탐나오 연령별 이용 금액</h3>
							<div class="chart-column-horizontal">
								<div class="chart-area">
									<loading-chart v-if="ageGroupedBarData.chartInfo.showLoading" />
									<bar-chart-wrapper v-else :data="ageGroupedBarData" :key="ageGroupedBarData.chartInfo.key" />
								</div>
								<ul class="list-label" v-if="ageGroupedBarData.chartData.length > 0">
									<li class="chart-label color-gray-dark">
										<h6>카드</h6>
									</li>
									<li class="chart-label color-red">
										<h6>탐나오</h6>
									</li>
								</ul>
							</div>
						</div>
						<!--//section-->
					</div>
					<!--//modal-body-->
				</div>
			</div>
		</div>
		<!--//modal-->
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, onUnmounted, reactive, ref } from "@vue/runtime-core";
	import { calculatePercentage } from '@/utils/CommonUtils';
	import externalDataService from "@/services/external/ExternalDataService";
	import codeService from '@/services/code/CodeServices';
	import storeService from '@/services/store/StoreService';
	import LoadingChart from "@/components/charts/loading/Loading.vue";
	import BasicColumnChartWrapper from "@/components/charts/column/BasicColumnChartWrapper.vue";
	import BarChartWrapper from '@/components/charts/bar/BarChartWrapper.vue';
	import MapEmdWrapper from "@/components/charts/mapemd/MapEmdWrapper.vue"
	import LineChartWrapper from "@/components/charts/line/LineChartWrapper.vue";
	import { ElMessage } from "element-plus";
	import noUiSlider from "nouislider"
	import 'nouislider/dist/nouislider.css'


	export default defineComponent({
		components: {
			MapEmdWrapper,
			BasicColumnChartWrapper,
			LineChartWrapper,
			"loading-chart" : LoadingChart,
			"bar-chart-wrapper" : BarChartWrapper
		},
		setup() {
			let category = ref([]) as any;
			let categoryUse = [
				{ category: "", salesCategory: ["PCA1", "PCA1", "PCA4", "PCA6", "CADO", "CSPU", "CSPL", "CSPE", "CSPB", "CSPF", "CSVM", "CSVS"] },
				{ category : "PCA1", salesCategory: ["PCA1", "CADO"] },
				{ category : "PCA3", salesCategory: ["PCA3", "CSPU", "CSPL", "CSPE", "CSPB"] },
				{ category : "PCA4", salesCategory: ["PCA4", "CSPF"] },
				{ category : "PCA6", salesCategory: ["PCA6", "CSVM, CSVS"] },
			];

			let yearMonth = ref({}) as any;

			let yearMonthExt = {} as any;
			let yearMonthTamnao = {} as any;

			let year = ref([]) as any;

			let month = ref([]) as any;

			let search = reactive({
				categories: [] as any,
				year: "",
				month: "",
				sigungu: "",
				eupmyeondong: "",
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
					title: "제주데이터허브 읍면동 유동인구 대비 카드매출",
					mapId: "map1",
					mapHeight: '600px',
					postfix: '원',
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

			let cardSalesChartData = ref({
				chartInfo: {
					height: "295px",
					width: "100%",
					chartType: "LINE",
					chartValueUnit: "%",
					xaxisTitle: "",
					yaxisTitleList: ["카드 매출", "탐나오 매출"] as any,
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
			
			let cardGenderStackedColumnData = ref({
				chartData: [] as any,
				chartInfo: {
					key: 1,
					totalValue: 0,
					height: "250px",
					width: "100%",
					chartType: "COLUMN_STACKED",
					chartValueUnit: "",
					yaxisTitleList: [],
					xaxisTitle: "",
					isStacked: true,
					stackType: "100%",
					tooltipIntersect: true,
					showXaxis: false,
					showYaxis: false,
					showGrid: false,
					showLegend: false,
					columnWidth: "50%",
					tooltipFixed: true,
					tooltipPosition: "topLeft",
					showXaxisTooltip: false,
					showLoading: false,
					colors: ["#4b4b4b", "#2E2F2E", "#A59E96"],
				},
			});

			let tamnaoGenderStackedColumnData = ref({
				chartData: [] as any,
				chartInfo: {
					key: 1,
					totalValue: 0,
					height: "250px",
					width: "100%",
					chartType: "COLUMN_STACKED",
					chartValueUnit: "",
					yaxisTitleList: [],
					xaxisTitle: "",
					isStacked: true,
					stackType: "100%",
					tooltipIntersect: true,
					showXaxis: false,
					showYaxis: false,
					showGrid: false,
					showLegend: false,
					columnWidth: "50%",
					tooltipFixed: true,
					tooltipPosition: "topRight",
					showXaxisTooltip: false,
					showLoading: false,
					colors: ["#E4B9B9", "#DF4F49", "#B9958D"],
				},
			});

			let ageGroupedBarData = ref({
				chartData: [] as any,
				chartInfo: {
					key: 1,
					height: "250px",
					width: "100%",
					chartType: "BAR_GROUPED",
					chartValueUnit: "",
					yaxisTitleList: [],
					xaxisTitle: "",
					colors: ["#2E2F2E", "#DF4F49"],
					barHorizontal: true,
					tooltipShared: true,
					borderRadius: 5,
					showLegend: false,
					showXaxisGrid: true,
					showYaxisGrid: false,
					showXaxis: false,
					showYaxisBorder: false,
					showYaxisTicks: false,
					xaxisRotate: true,
					barHeight: "100%",
					xaxisType: "numeric",
					xaxisTickPlacement: "on",
					xaxisLabelsMinHeight: "50",
					showLoading: false,
				},
			});

			function getCategory() {
				codeService.selectListByParentCode("PCAT").then(res => {
					let selectedCat:string[] = [];
					for(let cat of res) {
						for(let use of categoryUse) {
							if(use.category == cat.value) {
								selectedCat.push(cat);
							}
						}
					}
					category.value = selectedCat; 
				})
			}

			async function getYearMonth() {
				await externalDataService.getFloatingPopulationCardStartEndYearMonth().then(res => {
					yearMonthExt = res;
				});
				await storeService.getStartEndYearMonth().then(res => {
					yearMonthTamnao = res;
				})				
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
					console.log(e);
				}

				let salesCategories = [] as any;
				if(search.categories.length > 0) {
					for(let searchCat of search.categories) {
						let selectedCat = categoryUse.find((cat) => cat.category === searchCat)?.salesCategory;
						salesCategories = salesCategories.concat(selectedCat);
					}
				} else {
					salesCategories = categoryUse.find((cat) => cat.category === "")?.salesCategory;
				}

				storeService.getStoreSalesMapEmd(year, month, salesCategories + "").then(res => {
					mapData2.value.data = res;
					mapData2.value.info.showLoading = false;
					
				})

			}

			function searchExt(year:number, month:number) {
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
				
				let salesCategories = [] as any;
				if(search.categories.length > 0) {
					for(let searchCat of search.categories) {
						let selectedCat = categoryUse.find((cat) => cat.category === searchCat)?.salesCategory;
						salesCategories = salesCategories.concat(selectedCat);
					}
				} else {
					salesCategories = categoryUse.find((cat) => cat.category === "")?.salesCategory;
				}
				externalDataService.getFloatingPopulationCardMapEmd(year, month, salesCategories + "").then(res => {
					mapData.value.data = res;
					mapData.value.info.showLoading = false;
				})				
			}

			function getFloatPopulationCardChartEmdSales(year:number, month:number, salesYear:number, salesMonth: number) {
				if (cardSalesChartData.value.chartInfo.showLoading)
					return;
				cardSalesChartData.value.chartInfo.showLoading = true;

				let salesCategories = [] as any;
				if(search.categories.length > 0) {
					for(let searchCat of search.categories) {
						let selectedCat = categoryUse.find((cat) => cat.category === searchCat)?.salesCategory;
						salesCategories = salesCategories.concat(selectedCat);
					}
				} else {
					salesCategories = categoryUse.find((cat) => cat.category === "")?.salesCategory;
				}
				externalDataService.getFloatPopulationCardChartEmdSales(year, month, salesYear, salesMonth, salesCategories + "").then((res) => {
					for(let index in res) {
						if(Number(index)==0)
							cardSalesChartData.value.chartInfo.seriesLeftYaxis.push(res[index].name);
						else
							cardSalesChartData.value.chartInfo.seriesRightYaxis.push(res[index].name);
					}
					cardSalesChartData.value.chartData = res;
					cardSalesChartData.value.chartInfo.showLoading = false;
				});
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

			function getStoreSalesEupmyeondong(addressInfo:any) {				
                let element: HTMLElement = document.getElementById('modalTrigger') as HTMLElement;
                (async() => { 
                    element.click()

                    await new Promise(f => setTimeout(f, 150));
					const addressPart = addressInfo.split(" ");
					
					search.sigungu = addressPart[0];
					search.eupmyeondong = addressPart[1];

                    getSalesAmountSex();
                    getSalesAmountAge();
                    getTamnaoSalesAmountGroupBySex();    
                })() ;
            }

			function getSalesAmountSex() {
				let params = {
					year: currentYearMonth.extYear,
					month: currentYearMonth.extMonth,
					sigungu: search.sigungu,
					eupmyeondong: search.eupmyeondong
				}
				cardGenderStackedColumnData.value.chartInfo.showLoading = true;
				externalDataService.getFloatingPopulationCardSex(params).then(res => {
					cardGenderStackedColumnData.value.chartInfo.totalValue = 0;
					for(let data of res) {
						cardGenderStackedColumnData.value.chartInfo.totalValue = cardGenderStackedColumnData.value.chartInfo.totalValue + data.data[0].y;
					}
					cardGenderStackedColumnData.value.chartData = res;
					cardGenderStackedColumnData.value.chartInfo.key++;
					cardGenderStackedColumnData.value.chartInfo.showLoading = false;
				})
			}

			function getSalesAmountAge() {
				let params = {
					year: currentYearMonth.extYear,
					month: currentYearMonth.extMonth,
					sigungu: search.sigungu,
					eupmyeondong: search.eupmyeondong
				}
				ageGroupedBarData.value.chartInfo.showLoading = true;
				externalDataService.getFloatingPopulationCardAge(params).then(res => {
					ageGroupedBarData.value.chartData = res;
					ageGroupedBarData.value.chartInfo.key++;
					ageGroupedBarData.value.chartInfo.showLoading = false;
				})
			}

			function getTamnaoSalesAmountGroupBySex() {
				let params = {
					year: currentYearMonth.extYear,
					month: currentYearMonth.extMonth,
					sigungu: search.sigungu,
					eupmyeondong: search.eupmyeondong,
				}
				tamnaoGenderStackedColumnData.value.chartInfo.showLoading = true;
				storeService.getSalesAmountSex(params).then(res => {
					tamnaoGenderStackedColumnData.value.chartInfo.totalValue = 0;
					for(let data of res) {
						tamnaoGenderStackedColumnData.value.chartInfo.totalValue = tamnaoGenderStackedColumnData.value.chartInfo.totalValue + data.data[0].y;
					}
					tamnaoGenderStackedColumnData.value.chartData = res;
					tamnaoGenderStackedColumnData.value.chartInfo.key++;
					tamnaoGenderStackedColumnData.value.chartInfo.showLoading = false;
				})
			}

			onMounted(() => {				
				getCategory();				
				(async() => {
					await getYearMonth();

					console.log(yearMonthExt.endYear, yearMonthExt.endMonth, yearMonthTamnao.endYear, yearMonthTamnao.endMonth);

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

					getFloatPopulationCardChartEmdSales(searchYear, searchMonth, searchYear, searchMonth);
					searchExt(searchYear, searchMonth);
					searchTamnao(searchYear, searchMonth);

				})();				
			})

			onUnmounted(() => {
				ElMessage.closeAll();
			});

			return {
				category,
				year,
				month,
				search,
				primaryHeatMap,
				secondaryHeatMap,
				mapData,
				mapData2,
				cardGenderStackedColumnData,
				tamnaoGenderStackedColumnData,
				ageGroupedBarData,
				calculatePercentage,
				checkCategory,
				changeCategory,
				syncMap,
				syncChecked,
				cardSalesChartData,
			};
		},
	});
</script>

<style scoped>
	.map-fill {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		flex-direction: column;
		min-height: 100vh;
	}

	.chart-column-single .list-label {
		width: 120px;
	}

	@media (min-width: 1300px) {
		.map-area:first-child { width: 49% !important; height:600px !important; float:left; }
		.map-area:nth-child(2) { width: 49% !important; height:600px !important; float:right; }		
	}

	.no-data { font-size: 2em; text-align: center; }
</style>

