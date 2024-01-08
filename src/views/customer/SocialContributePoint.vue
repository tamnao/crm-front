<template>
	<div>
		<div class="page-customer-point">
			<div class="layout-content">
				<div class="content-title">
					<span>고객 관리</span>
					<h2>사회공헌포인트 현황</h2>
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
									v-model="commonAttributes.period"
									:value="period.value"
									name="period"
									@change="changePeriod(period.value)"
								/>
								<span class="checkmark"></span>
							</label>
                            <input type="date" v-model="searchDto.params.startDate" v-show="commonAttributes.showCustomDate">
                            <span v-show="commonAttributes.showCustomDate">&dash;</span>
                            <input type="date" v-model="searchDto.params.endDate" v-show="commonAttributes.showCustomDate">	
						</dd>
					</dl>
					<div class="filter-buttons">
						<button
							type="submit"
							class="btn-h40 btn-primary"
							@click="search"
						>
							검색
						</button>
						<button
							type="button"
							class="btn-h40 btn-outline"
							@click="initializeAll"
						>
							초기화
						</button>
					</div>
				</form>
				<!--//form-filter-->
				<hr class="gutter-large" />
                
				<div class="section section-simpleDonut">
					<h3>유형별 적립 현황</h3>
						<loading-chart v-if="donutChartData.chartInfo.showLoading" style="width: 100%;"/>
                        <div class="chart-area" v-else>
							<donut-chart
								:data="donutChartData"
								:key="commonAttributes.donutChartKey"
							/>
						</div>
						<ul class="list-label" v-if="donutChartData.chartData[0].data.length != 0 && !donutChartData.chartInfo.showLoading">
							<li class="chart-label color-gray-dark">
								<h6>
									{{ donutChartData.chartData[0].data[0].x }}
									:
									{{ calPercentage(donutChartData.chartData[0].data[0].y) }}&#37;
								</h6>
								<span>{{ numberFormatter(donutChartData.chartData[0].data[0].y) }}</span>
							</li>
							<li class="chart-label color-brown-gray">
								<h6>
									{{ donutChartData.chartData[0].data[1].x }}
									:
									{{ calPercentage(donutChartData.chartData[0].data[1].y) }}&#37;
								</h6>
								<span>{{ numberFormatter(donutChartData.chartData[0].data[1].y) }}</span>
							</li>
							<li class="chart-label color-brown-gray-light">
								<h6>
									{{ donutChartData.chartData[0].data[2].x }}
									:
									{{ calPercentage(donutChartData.chartData[0].data[2].y) }}&#37;
								</h6>
								<span>{{ numberFormatter(donutChartData.chartData[0].data[2].y) }}</span>
							</li>
							<li class="chart-label color-red">
								<h6>
									{{ donutChartData.chartData[0].data[3].x }}
									:
									{{ calPercentage(donutChartData.chartData[0].data[3].y)}}&#37;
								</h6>
								<span>{{ numberFormatter(donutChartData.chartData[0].data[3].y) }}</span>
							</li>
						</ul>
					<!-- </div> -->
				</div>
				<!--//section-->
				<div class="section section-linechart">
					<h3>일별 적립 현황</h3>
					<div class="chart-realtimeLine">
						<div class="chart-area">
                            <loading-chart v-if="lineChartData.chartInfo.showLoading" />
							<line-chart-wrapper
                                v-else
								:data="lineChartData"
								:key="commonAttributes.lineChartKey"
							/>
						</div>
					</div>
				</div>
				<!--//section-->
				<hr class="gutter-medium" />
				<table class="table caption-top table-borderless">
					<caption>
						<span
							>검색 결과
							{{
								numberFormatter(commonAttributes.totalRecords)
							}}건</span
						>
						<button
							type="button"
							class="btn-h32 btn-outline"
							v-if="!commonAttributes.showLoadingDownload"
							@click="exportExcel"
						>
							Excel 다운로드
						</button>
						<button
							type="button"
							class="btn-h32 btn-outline"
							v-else
							disabled
							style="cursor: wait"
						>
							<el-icon class="is-loading"><loading /></el-icon>
							Excel 다운로드
						</button>
					</caption>
					<thead>
						<tr>
							<th scope="col" class="nowrap tc">번호</th>
							<th scope="col" class="nowrap tc">변동 일시</th>
							<th scope="col" class="nowrap tc">아이디</th>
							<th scope="col" class="nowrap tc">고객멍</th>
							<th scope="col" class="nowrap tc">구분</th>
							<th scope="col" class="nowrap tc">변동 포인트</th>
							<th scope="col" class="nowrap tc">누적 포인트</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="!commonAttributes.showTable">
							<th colspan="7" style="text-align: center">
								<el-icon class="is-loading loading-size"
									><loading
								/></el-icon>
							</th>
						</tr>
						<tr v-else-if="Object.keys(commonAttributes.data).length == 0">
							<th colspan="7" style="text-align: center">
								데이터가 없습니다
							</th>
						</tr>
						<tr
							v-else
							v-for="(item, index) in commonAttributes.data"
							:key="index + '_' + item.userId"
						>
							<th scope="row" class="nowrap tc">{{ numberFormatter(item.rowNo) }}</th>
							<th class="nowrap text-999 tc">{{ item.baseDate }}</th>
							<td class="fw-bold tc">{{ item.userId }}</td>
							<td class="fw-bold tc">{{ item.userNm }}</td>
							<td class="nowrap tc">{{ item.pointType }}</td>
							<td class="nowrap tr">{{ numberFormatter(item.point) }}</td>
							<td class="nowrap tr">{{ numberFormatter(item.balancePoint) }}</td>
						</tr>
					</tbody>
				</table>
				<div class="pagination justify-content-center">
					<li
						@click="handlePageChange(1)"
						v-if="searchDto.params.pageNumber > 1"
					>
						<i class="arrow-page">first_page</i>
					</li>
					<li
						@click="
							handlePageChange(searchDto.params.pageNumber - 1)
						"
						v-if="searchDto.params.pageNumber > 1"
					>
						<i class="arrow-page">chevron_left</i>
					</li>
					<el-pagination
						layout="pager"
						:total="commonAttributes.totalRecords"
						:current-page="searchDto.params.pageNumber"
						@current-change="handlePageChange"
					/>
					<li
						@click="
							handlePageChange(searchDto.params.pageNumber + 1)
						"
						v-if="
							searchDto.params.pageNumber <
							commonAttributes.lastPage
						"
					>
						<i class="arrow-page">chevron_right</i>
					</li>
					<li
						@click="handlePageChange(commonAttributes.lastPage)"
						v-if="
							searchDto.params.pageNumber <
							commonAttributes.lastPage
						"
					>
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
	import { defineComponent, reactive, ref, onMounted, onUnmounted } from "@vue/runtime-core";
	import SocialContributePointSearchDto from "@/model/customer/SocialContributePointSearchDto";
	import GradientDonutChartWrapper from "@/components/charts/pie/GradientDonutChartWrapper.vue";
	import LineChartWrapper from "@/components/charts/line/LineChartWrapper.vue";
	import CustomerService from "@/services/customer/CustomerService";
	import moment from "moment";
	import Xlsx from "xlsx";
	import { numberFormatter, calculatePercentage } from "@/utils/CommonUtils";
	import { Loading } from "@element-plus/icons";
    import LoadingChart from "@/components/charts/loading/Loading.vue";
import { ElMessage } from "element-plus";

	export default defineComponent({
		components: {
			loading: Loading,
			"donut-chart": GradientDonutChartWrapper,
			"line-chart-wrapper": LineChartWrapper,
            "loading-chart" : LoadingChart
		},
		setup() {
			const searchDto = reactive(new SocialContributePointSearchDto());

			let periods = [
				{ id: "periodYesterday", value: "yesterday", name: "어제" },
				{ id: "periodWeek", value: "1week", name: "1주일" },
				{ id: "periodOne", value: 1, name: "1개월" },
				{ id: "periodThree", value: 3, name: "3개월" },
				{ id: "periodCustom", value: "custom", name: "사용자 설정" },
			];

			let pointTypes = [
				{ id: "typeSaved", value: 1, name: "적립" },
				{ id: "typeUsed", value: 2, name: "사용" },
				{ id: "typeTotal", value: 3, name: "누적" },
			];

			let commonAttributes = ref({
				data: [],
				totalRecords: 0,
				lastPage: 1,
				showTable: true,
                showCustomDate: false,
				period: "yesterday",
				showLoadingDownload: false,
				donutChartKey: 1,
				lineChartKey: 1,
				columnChartKey: 1,
			});

			let donutChartData = ref({
				chartData: [
					{
						data: [],
					},
				],
				chartInfo: {
					height: "250",
					width: "250",
					chartType: "DONUT",
					colors: ["#2E2F2E", "#A59E96", "#D2CECA", "#DF4F49"],
					showLegend: false,
					showLabels: false,
					showTooltip: true,
                    showLoading: false,
				},
			});

			let lineChartData = ref({
				chartData: [],
				chartInfo: {
					height: "300",
					width: "100%",
					chartType: "LINE",
					chartValueUnit: "",
					xaxisTitle: "",
					yaxisTitleList: [],
					colors: ["#2E2F2E", "#A59E96", "#D2CECA", "#DF4F49"],
					xaxisType: "categories", //datetime, categories, numeric
					lineCurve: "smooth", // smooth, straight, stepline
					showLabels: false,
					shareTooltip: true,
                    showLoading: false,
                    legendFontSize: '12px',
                    legendFontWeight: 700,
                    legendMarkersWidth: 6,
                    legendMarkersHeight: 6,
				},
			});

			let totalChartValue = 0;

			const changePeriod = (period: any) => {
				if (period == "custom") {
                    commonAttributes.value.showCustomDate = true;
                    searchDto.params.endDate = moment().format("YYYY-MM-DD");
					searchDto.params.startDate = moment().format("YYYY-MM-DD");
				} else if (period == "yesterday") {
                    commonAttributes.value.showCustomDate = false;
					searchDto.params.endDate = moment()
						.subtract(1, "day")
						.format("YYYY-MM-DD");
					searchDto.params.startDate = moment()
						.subtract(1, "day")
						.format("YYYY-MM-DD");
				} else if (period == "1week") {
                    commonAttributes.value.showCustomDate = false;
					searchDto.params.endDate = moment().format("YYYY-MM-DD");
					searchDto.params.startDate = moment(searchDto.params.endDate)
						.subtract(1, "week")
						.format("YYYY-MM-DD");
				} else {
                    commonAttributes.value.showCustomDate = false;
					searchDto.params.endDate = moment().format("YYYY-MM-DD");
					searchDto.params.startDate = moment(searchDto.params.endDate)
						.subtract(period, "month")
						.format("YYYY-MM-DD");
				}
			};

			const search = async () => {
                donutChartData.value.chartInfo.showLoading = true;
                lineChartData.value.chartInfo.showLoading = true;
				searchDto.params.isPaging = true;
				commonAttributes.value.showTable = false;
				const result = await CustomerService.getSocialContributePoint(
					searchDto
				);
				commonAttributes.value.data = result.data;
				commonAttributes.value.totalRecords = result.recordsTotal;
				commonAttributes.value.lastPage = Math.ceil(
					result.recordsTotal / searchDto.params.length
				);
				commonAttributes.value.showTable = true;

				earnPointByType();
				getEarnPointDaily();
			};

			const initializeAll = () => {
				searchDto.params.startDate = moment()
					.subtract(1, "day")
					.format("YYYY-MM-DD");
				searchDto.params.endDate = moment().format("YYYY-MM-DD");
				searchDto.params.pointType = 1;
				searchDto.params.point = "";
				searchDto.params.userId = "";
				commonAttributes.value.period = "yesterday";
                commonAttributes.value.showCustomDate = false;
				search();
			};

			const handlePageChange = (pageNumber: number) => {
				searchDto.params.pageNumber = pageNumber;
				commonAttributes.value.showTable = false;
				search();
			};

			const exportExcel = () => {
				searchDto.params.isPaging = false;
				commonAttributes.value.showLoadingDownload = true;

				CustomerService.getSocialContributePointListExcel(searchDto).then(
					(res) => {
						const workBook = Xlsx.utils.book_new();
						const workSheet = Xlsx.utils.json_to_sheet(res);
						const sheetName = "목록";
						Xlsx.utils.book_append_sheet(
							workBook,
							workSheet,
							sheetName
						);
						Xlsx.utils.sheet_add_json(
							workBook.Sheets[sheetName],
							[
								{
									rowNo: "번호",
									baseDate: "변동 일시",
									userId: "아이디",
									userNm: "고객멍",
									pointType: "구분",
									point: "변동 포인트",
									balancePoint: "누적 포인트",
								},
							],
							{
								header: [
									"rowNo",
									"baseDate",
									"userId",
									"userNm",
									"pointType",
									"point",
									"balancePoint",
								],
								skipHeader: true,
								origin: "A1",
							}
						);

                        Xlsx.writeFile(workBook, "사회공헌포인트 현황.xlsx");
                        commonAttributes.value.showLoadingDownload = false;
					});
			};

			const earnPointByType = async () => {
                
				searchDto.params.isPaging = false;
				const result = await CustomerService.getSocialContributePointStat(
					searchDto
				);

                totalChartValue = 0;
				result.forEach((element: any) => {
					totalChartValue = element.y + totalChartValue;
				});
				donutChartData.value.chartData[0].data = result;
                donutChartData.value.chartInfo.showLoading = false;
				commonAttributes.value.donutChartKey++;
			};

			const calPercentage = (value:any) => {
				return calculatePercentage(value, totalChartValue);
			}

			const getEarnPointDaily = async () => {
                
				searchDto.params.isPaging = false;
				const result =
					await CustomerService.getSocialContributePointStatDaily(
						searchDto
					);
				const newRes = result.map((item: any) => {
					delete item.type;
					return item;
				});
				lineChartData.value.chartData = newRes;
                lineChartData.value.chartInfo.showLoading = false;
				commonAttributes.value.lineChartKey++;
			};

			onMounted(() => {
				search();
			});

			onUnmounted(() => {
				ElMessage.closeAll();
			});
			
			return {
				searchDto,
				periods,
				pointTypes,
				commonAttributes,
				donutChartData,
				lineChartData,
                totalChartValue,
				changePeriod,
				search,
				initializeAll,
				handlePageChange,
				numberFormatter,
				exportExcel,
				earnPointByType,
				calPercentage,
			};
		},
	});
</script>

<style>
    .page-customer-point .section-simpleDonut .chart-label {
        width: 44%;
        margin-top: 4px;
        margin-bottom: 4px;
    }

    .page-customer-point .section-simpleDonut .chart-label:nth-child(2n) {
        margin-left: 12%
    }
</style>