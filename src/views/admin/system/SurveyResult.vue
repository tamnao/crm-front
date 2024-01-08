<template>
<div>
	<div class="layout-content">
		<div class="content-title">
			<span>시스템 관리</span>
			<h2>설문조사 결과 분석</h2>
		</div>
		<form class="form-filter" @submit.prevent="false">
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
							v-model="searchDto.period"
							:value="period.value"
							name="period"
							@change="changePeriod(period.value)"
						/>
						<span class="checkmark"></span>
					</label>
					<input type="date" v-model="searchDto.startDate" v-show="commonAttributes.showCustomDate">
					<span v-show="commonAttributes.showCustomDate">&dash;</span>
					<input type="date" v-model="searchDto.endDate" v-show="commonAttributes.showCustomDate">	
				</dd>
			</dl>
			<dl class="filter-item">
				<dt>설문명</dt>
				<dd>
					<input type="text" class="width-100">
				</dd>
			</dl>
			<div class="filter-buttons">
				<button type="submit" class="btn-h40 btn-primary" @click="searchSurveyResult">검색</button>
				<button type="button" class="btn-h40 btn-outline" @click="initialAll">초기화</button>
			</div>
		</form>
		<!--//form-filter-->
		<hr class="gutter-large">
		<table class="table table-hasButton">
			<caption>
				<span>검색 결과 {{ tableData.recordsTotal }}건</span>
			</caption>
			<thead>
				<tr>
					<th scope="col" class="tc">번호</th>
					<th scope="col" class="tc">설문명</th>
					<th scope="col" class="tc">응답수</th>
					<th scope="col" class="tc">등록일</th>
					<th scope="col" class="tc">설문 결과</th>
				</tr>
			</thead>
			<tbody>
				<tr v-if="!tableData.showTableData">
					<th colspan="5" style="text-align: center">  
						<el-icon class="is-loading loading-size"><loading /></el-icon>
					</th>
				</tr>
				<tr v-else-if="tableData.data.length == 0">
					<th colspan="6" style="text-align: center">  
						데이터가 없습니다
					</th>
				</tr>
				<tr v-else v-for="(item, index) in tableData.data" :key="item.title + '_' + index">
					<th scope="row" class="tc">{{ item.rowNo }}</th>
					<td class="fw-bold">{{ item.title }}</td>
					<td class="tr">{{ numberFormatter(item.respondentCount) }}명</td>
					<td class="tc">{{ item.createAt }}</td>
					<td class="tc">
						<button type="button" data-bs-toggle="modal" data-bs-target="#modalSurveyResult001" class="btn-h32 btn-outline" @click="selectSurvey(item.id)">결과 보기</button>
					</td>
				</tr>
			</tbody>
		</table>
		<div class="pagination justify-content-center">
			<li @click="handlePageChange(1)" v-if="searchDto.pageNumber > 1">
				<i class="arrow-page">first_page</i>
			</li>
			<li @click="handlePageChange(searchDto.pageNumber - 1)" v-if="searchDto.pageNumber > 1">
				<i class="arrow-page">chevron_left</i>
			</li>		
			<el-pagination
				layout="pager"
				:total="tableData.recordsTotal"
				:current-page="searchDto.pageNumber"
				@current-change="handlePageChange"
			/>
			<li @click="handlePageChange(searchDto.pageNumber + 1)" v-if="searchDto.pageNumber < tableData.lastPage">
				<i class="arrow-page">chevron_right</i>
			</li>	
			<li @click="handlePageChange(tableData.lastPage)"  v-if="searchDto.pageNumber < tableData.lastPage">
				<i class="arrow-page">last_page</i>
			</li>
		</div><!--//pagination-->
	</div>
	<!--//layout-content-->
	<!-- Modal -->
	<div class="modal fade modal-survey-result" id="modalSurveyResult001" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-xl">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">설문조사 결과</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">close</button>
				</div>
				<div class="modal-body">
					<div class="selectbox bt-dark">
						<select @change="selectSurvey(commonAttributes.selectedSurvey)" v-model="commonAttributes.selectedSurvey">
							<template v-for="(survey, index) in allSurveyResult" :key="survey.title + '_' + index">
								<option :value="survey.id">{{ survey.title }}</option>
							</template>
						</select>
						<button type="button" class="btn-h32 btn-secondary">결과 조회</button>
					</div>
					<hr class="gutter-medium">
					<div class="chart-row-2">
						<div class="section">
							<h3>성별 응답 비율</h3>
							<loading-chart v-if="donutChartData.chartInfo.showLoading" style="width: 100%"/>
							<div v-else class="chart-donut-horizontal" style="float: left">
								<donut-chart
									:data="donutChartData"
									:key="donutChartData.chartInfo.key"
								/>
							</div>
							<ul class="list-label" v-if="donutChartData.chartData[0].data.length != 0 && !donutChartData.chartInfo.showLoading">
								<template v-for="(data, index) in donutChartData.chartData[0].data" :key="index">
									<li class="chart-label color-customize" :style="'float: unset; --customize-color:' + checkColors(index, donutChartData.chartInfo.colors) + ';'">
										<h6>{{ data.x }} &#58; {{ calculatePercentage(data.y, donutChartData.chartInfo.totalChartValue) }}&#37;</h6>
										<span>{{ numberFormatter(data.y) }}건</span>
									</li>
								</template>
							</ul>
						</div><!--//section-->
						<div class="section" style="margin-left: 5%">
							<h3>연령별 응답 비율</h3>
							<div class="chart chart-horizontal">
								<div class="chart-area">
									<loading-chart v-if="responseByAgeColumnData.chartInfo.showLoading" />
									<basic-column-chart-wrapper v-else :data="responseByAgeColumnData" :key="responseByAgeColumnData.chartInfo.key"/>
								</div>
								<ul class="list-label label-column2">
									<template v-for="(data, index) in responseByAgeColumnData.chartData[0].data" :key="index">
										<li class="chart-label color-customize" :style="'--customize-color:' + checkColors(index, responseByAgeColumnData.chartInfo.colors) + ';'">
											<h6>{{ data.x }} &#58; {{ calculatePercentage(data.y, responseByAgeColumnData.chartInfo.totalChartValue) }}&#37;</h6>
											<span>{{ numberFormatter(data.y) }}건</span>
										</li>
									</template>
								</ul>
							</div>
						</div><!--//section-->
					</div><!--//chart-row-2-->
					<loading-chart v-if="showLoadingResponseList" />
					<ul v-else class="list-surveyresult">
						<template v-for="(chart, chartIndex) in surveyResponseList" :key="chartIndex">
							<li v-if="chart.shortAnswers == null" class="section">
								<h3>{{ chart.chartInfo.question }}</h3>
								<div class="chart-horizontal">
									<div class="chart-area">
											<basic-column-chart-wrapper :data="chart" />
									</div>
									<ul class="list-label label-column2">
										<template v-for="(data, index) in chart.chartData[0].data" :key="index">
											<template v-if="chart.chartInfo.chartIndex%2 == 1">
												<li v-if="index == 0" class="chart-label color-gray-dark">
													<h6>{{ data.x }} &#58; {{ calculatePercentage(data.y, chart.chartInfo.totalChartValue) }}&#37;</h6>
													<span>{{ numberFormatter(data.y) }}건</span>
												</li>
												<li v-else class="chart-label color-brown-gray-light">
													<h6>{{ data.x }} &#58; {{ calculatePercentage(data.y, chart.chartInfo.totalChartValue) }}&#37;</h6>
													<span>{{ numberFormatter(data.y) }}건</span>
												</li>
											</template>
											<template v-else>
												<li v-if="index == 0" class="chart-label color-red">
													<h6>{{ data.x }} &#58; {{ calculatePercentage(data.y, chart.chartInfo.totalChartValue) }}&#37;</h6>
													<span>{{ numberFormatter(data.y) }}건</span>
												</li>
												<li v-else class="chart-label color-red-light">
													<h6>{{ data.x }} &#58; {{ calculatePercentage(data.y, chart.chartInfo.totalChartValue) }}&#37;</h6>
													<span>{{ numberFormatter(data.y) }}건</span>
												</li>
											</template>
										</template>
									</ul>
								</div>
							</li><!--//section-->
							<li v-else class="section">
								<h3>{{ chart.question }}</h3>
								<table class="table">
									<thead>
										<tr>
											<th scope="col">답변</th>
										</tr>
									</thead>
									<tbody>
										<tr v-if="chart.shortAnswers.length == 0">
											<th colspan="6" style="text-align: center">  
												데이터가 없습니다
											</th>
										</tr>
										<tr v-else v-for="(response, index) in chart.shortAnswers" :key="response + '_' + index">
											<td>{{ response }}</td>
										</tr>
									</tbody>
								</table>
							</li>
						</template>
					</ul>
				</div><!--//modal-body-->
			</div>
		</div>
	</div>
	<!--//modal-->
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, onUnmounted } from '@vue/runtime-core'
import { numberFormatter, calculatePercentage } from "@/utils/CommonUtils";
import moment from "moment";
import SurveyService from "@/services/survey/SurveyService";
import { Loading } from '@element-plus/icons';
import GradientDonutChartWrapper from "@/components/charts/pie/GradientDonutChartWrapper.vue";
import BasicColumnChartWrapper from "@/components/charts/column/BasicColumnChartWrapper.vue";
import LoadingChart from "@/components/charts/loading/Loading.vue";
import { ElMessage } from 'element-plus';

export default defineComponent({
	components: {
		"loading" : Loading,
		"loading-chart" : LoadingChart,
		"donut-chart": GradientDonutChartWrapper,
		"basic-column-chart-wrapper" : BasicColumnChartWrapper,
	},
	setup() {
		let periods = [
			{ id: "periodYesterday", value: "yesterday", name: "어제" },
			{ id: "periodWeek", value: "1week", name: "1주일" },
			{ id: "periodOne", value: 1, name: "1개월" },
			{ id: "periodThree", value: 3, name: "3개월" },
			{ id: "periodCustom", value: "custom", name: "사용자 설정" },
		];

		let commonAttributes = ref({
			showCustomDate: false,
			selectedSurvey: '',
		});

		let searchDto = reactive({
			pageNumber: 1,
			isPaging: true,
			period: "yesterday",
			title: '',
			startDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
			endDate: moment().format("YYYY-MM-DD"),
		});

		let tableData = ref({
			data: [] as any,
			recordsTotal: 0,
			lastPage: 1,
			start: 0,
			length: 10,
			showTableData: true,
		});

		let allSurveyResult = ref([]);

		let donutChartData = ref({
			chartData: [
				{
					data: [],
				},
			],
			chartInfo: {
				key: 0,
				totalChartValue: 0,
				height: "250",
				width: "200",
				chartType: "DONUT",
				colors: ["#E4B9B9", "#DF4F49", "#D2CECA"],
				showLegend: false,
				showLabels: false,
				showTooltip: true,
				showLoading: false,
			},
		});

		let responseByAgeColumnData = ref({
			chartInfo: {
					key: 0,
					totalChartValue: 0,
					showLoading: false,
					height: "200",
					width: "100%",
					columnWidth: "50%",
					chartType: "BAR",
					chartValueUnit: "%",
					borderRadius: 5,
					showLegend: false,
					isStacked: false,
					columnDistributed: true,
					stackType: "100%",
					yaxisName: "",
					xaxisTitle: "",
					yaxisTitleList: [],
					xaxisType: "categories", 
					xaxisValue: [],
					yaxisValue: [],
					colors: ["rgba(46, 47, 46, 0.1)", 
							"rgba(46, 47, 46, 0.25)", 
							"rgba(46, 47, 46, 0.4)", 
							"rgba(46, 47, 46, 0.55)", 
							"rgba(46, 47, 46, 0.7)", 
							"rgba(46, 47, 46, 0.85)",
							"#2E2F2E",
							"#A59E96"]
				},
				chartData: [
					{
						name: "",
						type: "bar",
						data: [],
					},
				],   
		});

		let surveyResponseList = ref([] as any);

		let showLoadingResponseList = ref(false);

		function changePeriod(period: any) {
			if (period == "custom") {
				commonAttributes.value.showCustomDate = true;
				searchDto.endDate = moment().format("YYYY-MM-DD");
				searchDto.startDate = moment().format("YYYY-MM-DD");
			} else if (period == "yesterday") {
				commonAttributes.value.showCustomDate = false;
				searchDto.endDate = moment()
					.subtract(1, "day")
					.format("YYYY-MM-DD");
				searchDto.startDate = moment()
					.subtract(1, "day")
					.format("YYYY-MM-DD");
			} else if (period == "1week") {
				commonAttributes.value.showCustomDate = false;
				searchDto.endDate = moment().format("YYYY-MM-DD");
				searchDto.startDate = moment(searchDto.endDate)
					.subtract(1, "week")
					.format("YYYY-MM-DD");
			} else {
				commonAttributes.value.showCustomDate = false;
				searchDto.endDate = moment().format("YYYY-MM-DD");
				searchDto.startDate = moment(searchDto.endDate)
					.subtract(period, "month")
					.format("YYYY-MM-DD");
			}
		}

		function getAllSurveyResult() {
			let obj = {} as any;
			Object.assign(obj, searchDto);
			obj.isPaging = false;
			SurveyService.getSurveyResultList(obj).then(res => {
				allSurveyResult.value = res.data;
			});
		}

		function searchSurveyResult() {
			tableData.value.showTableData = false;
			SurveyService.getSurveyResultList(searchDto).then(res => {
				tableData.value.data = res.data;
				tableData.value.recordsTotal = res.recordsTotal;
				tableData.value.lastPage = Math.ceil(res.recordsTotal/10);
				tableData.value.showTableData = true;
			});
			getAllSurveyResult();
		}

		function initialAll() {
			searchDto.startDate = moment().subtract(1, "day").format("YYYY-MM-DD");
			searchDto.endDate = moment().format("YYYY-MM-DD");
			searchDto.title = '';
			searchDto.pageNumber = 1;
			searchDto.period = 'yesterday';
			searchSurveyResult();
		}

		function handlePageChange(pageNumber:number) {
			searchDto.pageNumber = pageNumber;
			tableData.value.showTableData = false;
			searchSurveyResult();
		}

		function selectSurvey(surveyId:any) {
			commonAttributes.value.selectedSurvey = surveyId;
			donutChartData.value.chartInfo.showLoading = true;
			responseByAgeColumnData.value.chartInfo.showLoading = true;
			showLoadingResponseList.value = true;
			
			(async() => {
				await new Promise(f => setTimeout(f, 1000));


				SurveyService.getSurveyRespondentSex(commonAttributes.value.selectedSurvey).then(res => {
					donutChartData.value.chartInfo.totalChartValue = 0;

					res.forEach((element: any) => {
						donutChartData.value.chartInfo.totalChartValue = element.y + donutChartData.value.chartInfo.totalChartValue;
					});

					donutChartData.value.chartData[0].data = res;
					donutChartData.value.chartInfo.key++;
					donutChartData.value.chartInfo.showLoading = false;
				});

				SurveyService.getSurveyRespondentAge(commonAttributes.value.selectedSurvey).then(res => {
					responseByAgeColumnData.value.chartInfo.totalChartValue = 0;

					res.forEach((element: any) => {
						responseByAgeColumnData.value.chartInfo.totalChartValue = element.y + responseByAgeColumnData.value.chartInfo.totalChartValue;
					});

					responseByAgeColumnData.value.chartData[0].data = res;
					responseByAgeColumnData.value.chartInfo.key++;
					responseByAgeColumnData.value.chartInfo.showLoading = false;
				});

				SurveyService.getSurveyResult(commonAttributes.value.selectedSurvey).then(res => {
					let surveyResponseColumnChart = [] as any;
					surveyResponseList.value = [];
					console.log("aaaaa ", res);
					res.responses.forEach((element:any) => {
						if(element.shortAnswers == null) {
							let obj = {
								chartInfo: {
									key: 0,
									chartIndex: 1,
									question: '',
									totalChartValue: 0,
									showLoading: false,
									height: "271",
									width: "100%",
									columnWidth: "20%",
									chartType: "BAR",
									chartValueUnit: "%",
									borderRadius: 5,
									showLegend: false,
									isStacked: false,
									columnDistributed: true,
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
								shortAnswers: null
							}
							obj.chartInfo.totalChartValue = 0;
							obj.chartInfo.question = element.question;

							element.choiceAnswers.forEach((answer:any) => {
								obj.chartInfo.totalChartValue = answer.y + obj.chartInfo.totalChartValue;
							});

							obj.chartData[0].data = element.choiceAnswers;
							obj.chartInfo.key++;
							surveyResponseColumnChart.push(obj);

							surveyResponseColumnChart.forEach((chart:any, index:number) => {
								chart.chartInfo.chartIndex++;
								if(index%2 == 1) {
									chart.chartInfo.colors = [
										function(value:any) {
											if(value.dataPointIndex == 0) {
												return "#2E2F2E";
											}
											else {
												return "#A59E96"
											}
										}
									]
								}
								else {
									chart.chartInfo.colors = [
										function(value:any) {
											if(value.dataPointIndex == 0) {
												return "#DF4F49";
											}
											else {
												return "#E4B9B9"
											}
										}
									]
								}
							});
							surveyResponseList.value.push(obj);
						}
						else {
							surveyResponseList.value.push(element);
						}
					});
					showLoadingResponseList.value = false;
					console.log("surveyResponseList ", surveyResponseList.value);
				});
			})();
		}

		function checkColors(index:number, colors:Array<string>) {
			return colors[index % colors.length];
		}

		onMounted(() => {
			searchSurveyResult();
		});

		onUnmounted(() => {
			ElMessage.closeAll();
		})
		
		return {
			numberFormatter,
			calculatePercentage,
			periods,
			commonAttributes,
			searchDto,
			tableData,
			allSurveyResult,
			donutChartData,
			responseByAgeColumnData,
			surveyResponseList,
			showLoadingResponseList,
			changePeriod,
			searchSurveyResult,
			initialAll,
			handlePageChange,
			selectSurvey,
			checkColors
		}
	},
})
</script>


<style scoped>
	.chart-label.color-customize:before {
		background-color: var(--customize-color);
	}

	.table>:not(:first-child) {
		border-top: 1px solid #e1e1e1; 
	}
</style>

