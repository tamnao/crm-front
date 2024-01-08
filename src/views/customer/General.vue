<template>
	<div>
		<div>	
			<div class="layout-content">	
				<div class="content-title">	
					<span>고객 관리</span>	
					<h2>고객 구분 관리</h2>	
				</div>	
				<form class="form-filter" @submit.prevent="'return false'">	
					<dl class="filter-item">	
						<dt>고객 구분</dt>	
						<dd>	
							<label v-for="cat in category" :key="cat.id" class="checkbox-container" :for="cat.id">
								{{ cat.name }}	
								<input type="checkbox" :id="cat.id" :value="cat.type" :checked="checkCategory(cat.type)" @change="changeCategory">	
								<span class="checkmark"></span>	
							</label>
						</dd>	
					</dl>	
					<dl class="filter-item">	
						<dt>고객 등급</dt>	
						<dd>	
							<label v-for="rate in rating" :key="rate.id" class="checkbox-container" :for="rate.id">
								{{ rate.name }}	
								<input type="checkbox" :id="rate.id" :value="rate.type" :checked="checkRating(rate.type)" @change="changeRating">	
								<span class="checkmark"></span>	
							</label>	
						</dd>	
					</dl>	
					<div class="filter-buttons">	
						<button type="submit" class="btn-h40 btn-primary" @click="search">검색</button>	
						<button type="button" class="btn-h40 btn-outline" @click="initializeAll">초기화</button>	
					</div>	
				</form>	
				<!--//form-filter-->	
				<hr class="gutter-large">	
				<div class="chart-wrap">	
					<ul class="nav nav-tab-vertical">	
						<li class="tab-item">	
							<a data-bs-toggle="tab" href="#tabCategory" class="active">고객 구분</a>	
						</li>	
						<li class="tab-item">	
							<a data-bs-toggle="tab" href="#tabGrade">고객 등급</a>	
						</li>	
					</ul>	
					<div class="tab-content">	
						<div id="tabCategory" class="tab-pane active">
							<loading-chart v-if="semiDonutCategoryData.showLoading" />	
							<div class="chart-semiCircleGauge" v-if="semiDonutCategoryData.chartData.length != 0">	
								<div class="chart-area">	
									<semi-donut-wrapper :data="semiDonutCategoryData" />	
								</div>	
								<ul class="list-label">	
									<li class="chart-label color-customize" :style="'--customize-color:' + semiDonutCategoryData.chartInfo.colors[0] + ';'">	
										<h6>{{ semiDonutCategoryData.chartData[0].x }} &#58; {{ semiDonutCategoryData.highestPercentage }}&#37;</h6>	
										<span>{{ numberFormatter(semiDonutCategoryData.chartData[0].y) }}명</span>	
									</li>	
									<li class="chart-label color-customize" :style="'--customize-color:' + semiDonutCategoryData.chartInfo.colors[1] + ';'">	
										<h6>{{ semiDonutCategoryData.chartData[1].x }} &#58; {{ semiDonutCategoryData.mediumPercentage }}&#37;</h6>	
										<span>{{ numberFormatter(semiDonutCategoryData.chartData[1].y) }}명</span>	
									</li>	
									<li class="chart-label color-customize" :style="'--customize-color:' + semiDonutCategoryData.chartInfo.colors[2] + ';'">	
										<h6>{{ semiDonutCategoryData.chartData[2].x }} &#58; {{ semiDonutCategoryData.lowestPercentage }}&#37;</h6>	
										<span>{{ numberFormatter(semiDonutCategoryData.chartData[2].y) }}명</span>	
									</li>	
								</ul>	
							</div>	
						</div>	
						<div id="tabGrade" class="tab-pane">	
							<div class="chart-semiCircleGauge" v-if="semiDonutRatingData.chartData.length != 0">	
								<div class="chart-area">	
									<semi-donut-wrapper :data="semiDonutRatingData" />	
								</div>	
								<ul class="list-label" style="margin-left: 0">	
									<li class="chart-label color-gray-dark">	
										<h6>1등급 &#58; {{ semiDonutRatingData.rate_1 }}&#37;</h6>	
										<span>{{ numberFormatter(semiDonutRatingData.chartData[0].y) }}명</span>	
									</li>	
									<li class="chart-label color-red">	
										<h6>2등급 &#58; {{ semiDonutRatingData.rate_2 }}&#37;</h6>	
										<span>{{ numberFormatter(semiDonutRatingData.chartData[1].y) }}명</span>	
									</li>	
									<li class="chart-label color-brown-gray">	
										<h6>3등급 &#58; {{ semiDonutRatingData.rate_3 }}&#37;</h6>	
										<span>{{ numberFormatter(semiDonutRatingData.chartData[2].y) }}명</span>	
									</li>	
									<li class="chart-label color-red-light">	
										<h6>4등급 &#58; {{ semiDonutRatingData.rate_4 }}&#37;</h6>	
										<span>{{ numberFormatter(semiDonutRatingData.chartData[3].y) }}명</span>	
									</li>	
									<li class="chart-label color-beige">	
										<h6>5등급 &#58; {{ semiDonutRatingData.rate_5 }}&#37;</h6>	
										<span>{{ numberFormatter(semiDonutRatingData.chartData[4].y) }}명</span>	
									</li>	
								</ul>	
							</div>
							<div class="chart-semiCircleGauge" v-else >	
								<div class="chart-area" style="min-height: 79px"></div>
								<ul class="list-label">	
									<li class="chart-label color-gray-dark">
										<h6>1등급 &#58; 0 &#37;</h6>	
										<span>0명</span>	
									</li>
									<li class="chart-label color-red">
										<h6>2등급 &#58; 0 &#37;</h6>	
										<span>0명</span>	
									</li>
									<li class="chart-label color-brown-gray">
										<h6>3등급 &#58; 0 &#37;</h6>	
										<span>0명</span>	
									</li>
									<li class="chart-label color-red-light">
										<h6>4등급 &#58; 0 &#37;</h6>	
										<span>0명</span>	
									</li>
									<li class="chart-label color-beige">
										<h6>5등급 &#58; 0 &#37;</h6>	
										<span>0명</span>	
									</li>
								</ul>
							</div>	
						</div>	
					</div>	
					<!--//tab-content-->	
					<div class="button-wrap">	
						<a data-bs-toggle="modal" data-bs-target="#modalCustomerGrade" class="btn-h32 btn-outline" @click="getCurrentRating">고객 등급 관리</a>	
					</div>	
				</div>	
				<!--//chart-wrap-->	
				<hr class="gutter-medium">	
				<table class="table caption-top table-borderless">	
					<caption>	
						<span>검색 결과 {{ numberFormatter(data.totalRecords) }}건</span>	
						<button type="button" class="btn-h32 btn-outline" v-if="!data.showLoadingDownload" @click="exportExcel">Excel 다운로드</button>	
						<button type="button" class="btn-h32 btn-outline" v-else @click="exportExcel" disabled style="cursor: wait">
							<el-icon class="is-loading"><loading /></el-icon> Excel 다운로드 
						</button>	
					</caption>	
					<thead>	
						<tr>	
							<th scope="col" class="nowrap tc">번호</th>	
							<th scope="col" class="tc">아이디</th>	
							<th scope="col" class="tc">이름</th>	
							<th scope="col" class="nowrap tc">구분</th>	
							<th scope="col" class="nowrap tc">구매 등급</th>	
							<th scope="col" class="nowrap tc">사회공헌 포인트</th>	
							<th scope="col" class="nowrap tc">가입일</th>	
							<th scope="col" class="nowrap tc">최근 구매일</th>	
							<th scope="col" class="nowrap tc">최근 로그인</th>	
						</tr>	
					</thead>
					<tbody>	
						<tr v-if="!data.showTable">
							<th colspan="9" style="text-align: center">  
								<el-icon class="is-loading loading-size"><loading /></el-icon>
							</th>
						</tr>
						<tr v-else-if="Object.keys(data.data).length == 0">
							<th colspan="9" style="text-align: center">
								데이터가 없습니다
							</th>
						</tr>
						<tr v-else v-for="(item, index) in data.data" :key="index + '_' + item.userId">
							<th scope="row" class="tc">{{ numberFormatter(item.rowNo) }}</th>
							<td class="fw-bold tc">{{ item.userId }}</td>	
							<td class="fw-bold">{{ item.userNm }}</td>	
							<td class="nowrap tc">{{ item.customerType }}</td>	
							<td class="nowrap tc">{{ item.rating }}</td>		
							<td class="nowrap tr">{{ numberFormatter(item.socialContributePoint) }}</td>	
							<td class="nowrap text-999 tc">{{ item.frstRegDttm }}</td>	
							<td class="nowrap text-999 tc">{{ item.lastRsvDateTime }}</td>	
							<td class="nowrap text-999 tc">{{ item.lastLoginDttm }}</td>	
						</tr>
					</tbody>
				</table>
				<div class="pagination justify-content-center">	
					<li @click="handlePageChange(1)" v-if="customerSearchInfo.params.pageNumber > 1">
						<i class="arrow-page">first_page</i>
					</li>
					<li @click="handlePageChange(customerSearchInfo.params.pageNumber - 1)" v-if="customerSearchInfo.params.pageNumber > 1">
						<i class="arrow-page">chevron_left</i>
					</li>		
					<el-pagination
						layout="pager"
						:total="data.totalRecords"
						:current-page="customerSearchInfo.params.pageNumber"
						@current-change="handlePageChange"
					/>
					<li @click="handlePageChange(customerSearchInfo.params.pageNumber + 1)" v-if="customerSearchInfo.params.pageNumber < data.lastPage">
						<i class="arrow-page">chevron_right</i>
					</li>	
					<li @click="handlePageChange(data.lastPage)"  v-if="customerSearchInfo.params.pageNumber < data.lastPage">
						<i class="arrow-page">last_page</i>
					</li>
				</div>	
			</div>	
			<!--//layout-content-->	
			<!-- Modal -->	
			<div class="modal fade modal-customer-grade" id="modalCustomerGrade" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">	
				<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">	
					<div class="modal-content">	
						<div class="modal-header">	
							<h5 class="modal-title">고객 등급 관리</h5>	
							<button id="modalCustomerGradeClose" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="handleCloseModal">close</button>	
						</div>	
						<template  v-if="currentRatingDto.showModal">
							<div class="modal-body">	
								<form>	
									<div class="form-filter">	
										<dl class="filter-item">	
											<dt>기존 등급 변경일</dt>	
											<dd>
												<p>{{ currentRatingDto.createAt }}</p>
											</dd>	
										</dl>	
										<dl class="filter-item">	
											<dt>판매 기간</dt>	
											<dd>	
												<label v-for="duration in period" :key="duration.id" class="radio-container" :for="duration.id">
													{{ duration.name }}
													<input type="radio" name="period" :id="duration.id" v-model="currentRatingDto.calculateMonth" :value="duration.value" @change="changePeriod">	
													<span class="checkmark"></span>	
												</label>
												<input type="date" v-model="currentRatingDto.startDate" v-show="currentRatingDto.showCustomDate">
												<span v-show="currentRatingDto.showCustomDate">&dash;</span>
												<input type="date" v-model="currentRatingDto.endDate" v-show="currentRatingDto.showCustomDate">		
											</dd>	
										</dl>	
										<dl class="filter-item">	
											<dt>등급 유지 기간</dt>	
											<dd>	
												<select v-model="currentRatingDto.preserveMonth">	
													<option v-for="(month, index) in preserveMonths" :key="index + '_' + month" :value="month">{{ month }}개월</option>
												</select>	
											</dd>	
										</dl>	
									</div><!--//form-filter-->	
									<hr class="gutter-small">	
									<table class="table table-form table-borderless">	
										<thead>	
											<tr>	
												<th style="text-align: center" scope="col">등급</th>	
												<th style="text-align: center" scope="col">현재 금액</th>	
												<th style="text-align: center" scope="col">변경 금액</th>	
											</tr>	
										</thead>	
										<tbody>	
											<tr v-for="(old, index) in oldRate.list" :key="'detail_' + index">	
												<th scope="row" class="fw-bold" style="text-align: center">{{ old.rating }}등급</th>	
												<td style="text-align: right">{{ numberFormatter(old.amount) }}원</td>	
												<td class="tc">	
													<el-input-number
														:id="'newAmount_' + index"
														:min="0"
														:controls="false"
														v-model="currentRatingDto.detailList[index].amount"
													/> 원
												</td>
											</tr>
										</tbody>	
									</table>	
								</form>	
							</div><!--//modal-body-->	
							<div class="modal-footer">	
								<p class="text-red">&#8251; 고객 등급 변경은 <span>익월 1일</span>에 재계산되어 반영됩니다.</p>	
								<button type="submit" class="btn-h40 btn-primary" @click="createCustomerRatingCriteria">수정</button>	
							</div>	
						</template>
						<template v-else>
							<div align="center">
								<el-icon class="is-loading loading-size"><loading /></el-icon>
							</div>
						</template>
					</div>	
				</div>	
			</div>	
			<!--//modal-->	
		</div>	
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, onUnmounted, reactive, ref } from '@vue/runtime-core';
	import $ from 'jquery'
	import SemiDonutWrapper from '@/components/charts/pie/SemiDonutChartWrapper.vue'
	import customerService from '@/services/customer/CustomerService';
	import CustomerCategoryRatingSearchDto from '@/model/customer/CustomerCategoryRatingSearchDto';
	import { Loading } from '@element-plus/icons';
	import { ElMessage } from 'element-plus';
	import { numberFormatter } from '@/utils/CommonUtils';
	import Xlsx from "xlsx";
	import moment from "moment/moment";
	import LoadingChart from "@/components/charts/loading/Loading.vue";

	export default defineComponent({
		components: {
			"semi-donut-wrapper" : SemiDonutWrapper,
			"loading" : Loading,
			"loading-chart" : LoadingChart
		},
		setup() {
			let category = [
				{ id: "categoryAll", type: 0, name: "전체" },
				{ id: "category_Exist", type: '기존 고객', name: "기존 고객" },
				{ id: "category_New", type: '신규 고객', name: "신규 고객" }, 
				{ id: "category_Latent", type: '잠재 고객', name: "잠재 고객" },
			];

			let rating = [
				{ id: "gradeAll", type: 0, name: "전체" },
				{ id: "gradeOne", type: 1, name: "1등급" },
				{ id: "gradeTwo", type: 2, name: "2등급" }, 
				{ id: "gradeThree", type: 3, name: "3등급" },
				{ id: "gradeFour", type: 4, name: "4등급" },
				{ id: "gradeFive", type: 5, name: "5등급" },
			];

			let period = [
				{ id: "salesPeriodOne", value: 1, name: "1개월" },
				{ id: "salesPeriodThree", value: 3, name: "3개월" },
				{ id: "salesPeriodSix", value: 6, name: "6개월" }, 
				{ id: "salesPeriodTwelve", value: 12, name: "12개월" }, 	
				{ id: "salesPeriodCustom", value: 0, name: "사용자 설정"}, 	
			]

			let preserveMonths = [1, 3, 6, 12];


			const customerSearchInfo = reactive(new CustomerCategoryRatingSearchDto());
			let data = ref({
				data: [],
				totalRecords: 0,
				lastPage: 1,
				showTable: true,
				showLoadingDownload: false
			});

			let semiDonutCategoryData = ref({
				chartData: [],
				chartInfo: {
					chartType: "SEMI_DONUT",
					chartValueUnit: "%",
					height: "200",
					width: "200",
					showLegend: false,
					colors: ["#DF4F49", "#A59E96", "#EFEDEC"],
					showTooltip: true,
					showLabels: false
				},
				highestPercentage: 0,
				mediumPercentage: 0,
				lowestPercentage: 0,
				showLoading: false,
			});

			let semiDonutRatingData = ref({
				chartData: [],
				chartInfo: {
					chartType: "SEMI_DONUT",
					chartValueUnit: "%",
					height: "200",
					width: "200",
					showLegend: false,
					colors: ["#2E2F2E", "#DF4F49", "#A59E96", "#E4B9B9", "#EFEDEC"],
					showTooltip: true,
					showLabels: false
				},
				rate_1: 0,
				rate_2: 0,
				rate_3: 0,
				rate_4: 0,
				rate_5: 0
			});

			let currentRatingDto = reactive({
				calculateMonth: 1,
				preserveMonth: 1,
				createAt: moment().format("YYYY-MM-DD"),
				detailList: [
					{ rating: 1, amount:0 },
					{ rating: 2, amount:0 },
					{ rating: 3, amount:0 },
					{ rating: 4, amount:0 }
				] as any,
				showModal: false,
				startDate: moment().format("YYYY-MM-DD"),
				endDate: moment().format("YYYY-MM-DD"),
				showCustomDate: false,
			});

			let oldRate = reactive({ list: [
					{ rating: 1, amount:0 },
					{ rating: 2, amount:0 },
					{ rating: 3, amount:0 },
					{ rating: 4, amount:0 }
			]});

			let chartColors = [
				{ name: "기존 고객", color: "#DF4F49", colorName: "red"},
				{ name: "잠재 고객", color: "#EFEDEC", colorName: "beige" },
				{ name: "신규 고객", color: "#A59E96", colorName: "brown-gray" },
			]

			const search = async() => {
				data.value.showTable = false; 
				const result = await customerService.searchCustomer(customerSearchInfo);
				data.value.data = result.data;
				data.value.totalRecords = result.recordsTotal;
				data.value.lastPage = Math.ceil(result.recordsTotal / customerSearchInfo.params.length);
				data.value.showTable = true;
			}

			const handlePageChange = (pageNumber:number) => {
				customerSearchInfo.params.pageNumber = pageNumber;
				data.value.showTable = false;
				search();
			}

			const exportExcel = () => {
				customerSearchInfo.params.isPaging = false;
				data.value.showLoadingDownload = true;

				customerService.getCustomerCategoryRatingListExcel(customerSearchInfo).then((res:any) => {
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
								userId: "아이디",
								userNm: "고객명",
								customerType: "구분",
								rating: "구매 등급",
								socialContributePoint: "사회공헌 포인트",
								frstRegDttm: "가입일",
								lastRsvDateTime: "최근 구매일",
								lastLoginDttm: "최근 로그인"
							},
						],
						{
							header: [
								"rowNo",
								"userId",
								"userNm",
								"customerType",
								"rating",
								"socialContributePoint",
								"frstRegDttm",
								"lastRsvDateTime",
								"lastLoginDttm"
							],
							skipHeader: true,
							origin: "A1"
						}
					);

					Xlsx.writeFile(workBook, "고객 구분 관리.xlsx");
					data.value.showLoadingDownload = false;
				});
			}

			const customerCountCategory = async() => {
				semiDonutCategoryData.value.showLoading = true;
				const result = await customerService.customerCountCategory();
				const sortResult = result.sort((a:any, b:any) => { return b.y - a.y });
				
				let total = 0;
				let colors = [] as any;
				result.forEach((item:any) => {
					total = total + item.y;

					//check color for each series
					let donutColor:any = chartColors.filter((col:any) => col.name == item.x);
					if(donutColor.length > 0) {
						colors.push(donutColor[0].color);
					}
				});

				semiDonutCategoryData.value.chartData = sortResult;
				semiDonutCategoryData.value.chartInfo.colors = colors;
				semiDonutCategoryData.value.highestPercentage = Number(((result[0].y/total)*100).toFixed(2));
				semiDonutCategoryData.value.mediumPercentage = Number(((result[1].y/total)*100).toFixed(2));
				semiDonutCategoryData.value.lowestPercentage = Number(((result[2].y/total)*100).toFixed(2));
				semiDonutCategoryData.value.showLoading = false;
			}

			const customerCountRating = async() => {
				const result = await customerService.customerCountRating(); 
				let total = 0;
				result.forEach((item:any) => {
					total = total + item.y;
				});

				semiDonutRatingData.value.chartData = result;
				result[0].y > 0 ? semiDonutRatingData.value.rate_1 = Number(((result[0].y/total)*100).toFixed(2)) : semiDonutRatingData.value.rate_1 = 0;
				result[1].y > 0 ? semiDonutRatingData.value.rate_2 = Number(((result[1].y/total)*100).toFixed(2)) : semiDonutRatingData.value.rate_2 = 0;
				result[2].y > 0 ? semiDonutRatingData.value.rate_3 = Number(((result[2].y/total)*100).toFixed(2)) : semiDonutRatingData.value.rate_3 = 0;
				result[3].y > 0 ? semiDonutRatingData.value.rate_4 = Number(((result[3].y/total)*100).toFixed(2)) : semiDonutRatingData.value.rate_4 = 0;
				result[4].y > 0 ? semiDonutRatingData.value.rate_5 = Number(((result[4].y/total)*100).toFixed(2)) : semiDonutRatingData.value.rate_5 = 0;
			}

			const checkCategory = (type:any) => {
				if(customerSearchInfo.params.categories.length == 0 && type == 0) {
					return true;
				}
				else if(customerSearchInfo.params.categories.includes(type)) {
					return true;
				}
				else {
					return false;
				}
			}

			const changeCategory = (value:any) => {
				let type = value.target._value;
				if(type == 0) {
					customerSearchInfo.params.categories = [];
				}
				else if(customerSearchInfo.params.categories.includes(type)) {
					let index = customerSearchInfo.params.categories.indexOf(type);
					customerSearchInfo.params.categories.splice(index, 1);
				}
				else {
					customerSearchInfo.params.categories.push(value.target._value);
				}
			}

			const checkRating = (type:any) => {
				if(customerSearchInfo.params.ratings.length == 0 && type == 0) {
					return true;
				}
				else if(customerSearchInfo.params.ratings.includes(type)) {
					return true;
				}
				else {
					return false;
				}
			}

			const changeRating = (value:any) => {
				let type = value.target._value;
				if(type == 0) {
					customerSearchInfo.params.ratings = [];
				}
				else if(customerSearchInfo.params.ratings.includes(type)) {
					let index = customerSearchInfo.params.ratings.indexOf(type);
					customerSearchInfo.params.ratings.splice(index, 1);
				}
				else {
					customerSearchInfo.params.ratings.push(value.target._value);
				}
			}

			const initializeAll = () => {
				customerSearchInfo.params.categories = [];
				customerSearchInfo.params.ratings = [];
				$("#categoryAll").prop("checked", false);
				$("#gradeAll").prop("checked", false);

				$("[id^='category_']").each(function() {
					$(this).prop("checked", false);
				});

				$("[id^='grade_']").each(function() {
					$(this).prop("checked", false);
				});

				search();
			}

			const handleCloseModal = () => {
				document.getElementById("modalCustomerGradeClose")?.click();
				$("[id^='newAmount_'] :input").each(function() {
					$(this).val('');
				});
			}

			const getCurrentRating = async() => {
				const result = await customerService.findAllCurrentRatingCriteria();
				if (result.calculateMonth != null) {
					currentRatingDto.calculateMonth = result.calculateMonth;
					currentRatingDto.preserveMonth = result.preserveMonth;
					if(result.createAt != null && result.createAt != '') {
						currentRatingDto.createAt = result.createAt;
					}
					oldRate.list = result.detailList;                    
				} 
				currentRatingDto.showModal = true;
			}

			const createCustomerRatingCriteria = () => {
				// console.log(currentRatingDto);
				if(currentRatingDto.calculateMonth == 0) {
					let totalMonth = Math.round(moment(currentRatingDto.endDate).diff(moment(currentRatingDto.startDate), 'months', true));
					currentRatingDto.calculateMonth = totalMonth;
				}

				let isError = false;
				for(let i = 0; i < currentRatingDto.detailList.length && !isError; i++) {
					if (currentRatingDto.detailList[i].amount == 0) {
						isError = true;
						break;
					}
					for(let j = 0; j < i; j++) {
						if (currentRatingDto.detailList[j].amount < currentRatingDto.detailList[i].amount) {
							isError = true;
							break;
						}
					}
				}

				if (isError) {
					ElMessage.error("변경 금액은 1원 이상이고 높은 등급의 금액은 낮은 등급의 금액보다 커야 합니다.")
				} else { 
					customerService.createCustomerRatingCriteria(currentRatingDto).then(res => {
						document.getElementById("modalCustomerGradeClose")?.click();
						for(let i = 0; i < currentRatingDto.detailList.length; i++) {
							currentRatingDto.detailList[i].amount = 0;
						}
					});
				}
			}

			function changePeriod() {
				if(currentRatingDto.calculateMonth == 0) {
					currentRatingDto.showCustomDate = true;
				} else {
					currentRatingDto.showCustomDate = false;
					currentRatingDto.startDate = moment().format("YYYY-MM-DD");
					currentRatingDto.endDate = moment().format("YYYY-MM-DD");
				}
			}
			
			onMounted(() => {
				search();
				customerCountCategory();
				customerCountRating();
			});

			onUnmounted(() => {
				ElMessage.closeAll();
			});

			return {
				search,
				handlePageChange,
				exportExcel,
				checkCategory,
				initializeAll,
				numberFormatter,
				category,
				rating,
				period,
				preserveMonths,
				changeCategory,
				checkRating,
				changeRating,
				customerSearchInfo,
				data,
				semiDonutCategoryData,
				semiDonutRatingData,
				handleCloseModal,
				currentRatingDto,
				getCurrentRating,
				createCustomerRatingCriteria,
				changePeriod,
				oldRate,
			}
		}
	})
</script>

<style scoped>
	img, svg {
		vertical-align: unset !important;
	}

	.chart-label.color-customize:before {
		background-color: var(--customize-color);
	}
</style>
