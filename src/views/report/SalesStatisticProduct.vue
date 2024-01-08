<template>
<div class="page-report-purchase">
	<div class="layout-content">
		<div class="content-title">
			<span>리포트</span>
			<h2>카테고리&#47;상품별 구매 분포</h2>
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
				<dt>상품</dt>
				<dd>
					<div>
						<select v-model="search.productCategory" @change="getCorporation" style="margin-right: 5px;">
                            <option disabled :value="''" >선택하세요</option>
                            <option v-for="cat in category" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
						</select>

                        <select v-model="search.productCorporation" @change="getProduct" style="margin-right: 5px;">
                            <option disabled :value="''" >선택하세요</option>
                            <option v-for="corp in corporation" :key="corp.label" :value="corp.label">{{ corp.value }}</option>
						</select>

                        <select v-if="product.length == 0" style="margin-right: 5px;">
                            <option disabled selected >등록된 상품이 없습니다</option>
						</select>
                        <select v-else v-model="search.product" style="margin-right: 5px;">
                            <option disabled :value="''" >선택하세요</option>
                            <option v-for="prod in product" :key="prod.label" :value="prod.label">{{ prod.value }}</option>
						</select>
						<button type="button" class="btn-h40 btn-outline" @click="addProduct">추가</button>
					</div>
                    <el-tag
                        v-for="(tag, index) in search.productNumbers"
                        :key="tag"
                        type="danger"
                        closable
                        :disable-transitions="false"
                        @close="closeProduct(tag)"
                        style="margin-right: 5px;"
                    >
                        {{ search.productNames[index] }}
                    </el-tag>
                </dd>
			</dl>
			<dl class="filter-item">
				<dt>연도 &#47; 월</dt>
				<dd>
                    <select v-model="search.year" style="margin-right: 7px;">
						<option v-for="(y, index) in year" :key="index" :value="y"> {{ y }}년 </option>
					</select> 

					<select v-model="search.month">
                        <option value="">전체</option>
                        <option v-for="(month, index) in 12" :key="index" :value="month"> {{ month }}월 </option>
					</select>
				</dd>
			</dl>
			<div class="filter-buttons">
				<button type="submit" class="btn-h40 btn-primary" @click="getSearchData">검색</button>
				<button type="button" class="btn-h40 btn-outline" @click="resetForm">초기화</button>
			</div>
		</form>
		<!--//form-filter-->
		<hr class="gutter-large">
		<div class="section section-gender" >
			<h3>성별 구매건수</h3>
			<div class="chart-simpleDonut">
				<div class="chart-area">
                    <loading-chart v-if="genderDonutData.chartInfo.showLoading" />
                    <gradient-donut-chart-wrapper v-else :data="genderDonutData" :key="genderDonutData.chartInfo.key" />
				</div>
				<ul class="list-label">
                    <template v-for="(data, index) in genderDonutData.chartData[0].data" :key="index">
                        <li class="chart-label color-customize" :style="'--customize-color:' + checkColors(index, genderDonutData.chartInfo.colors) + ';'">
                            <h6>{{ data.x }} &#58; {{ calPercentage(data.y, genderDonutData.chartInfo.totalValue) }}&#37;</h6>
                            <span>{{ numberFormatter(data.y) }}건</span>
                        </li>	
                    </template>
				</ul>
			</div>
		</div><!--//section-->
		<div class="section section-age">
			<h3>연령별 구매건수</h3>
			<div class="chart-simpleDonut">
				<div class="chart-area">
                    <loading-chart v-if="ageGroupDonutData.chartInfo.showLoading" />
                    <gradient-donut-chart-wrapper v-else :data="ageGroupDonutData" :key="ageGroupDonutData.chartInfo.key" />
				</div>
				<ul class="list-label">
                    <template v-for="(data, index) in ageGroupDonutData.chartData[0].data" :key="index">
                        <li class="chart-label color-customize" :style="'--customize-color:' + checkColors(index, ageGroupDonutData.chartInfo.colors) + ';'">
                            <h6>{{ data.x }} &#58; {{ calPercentage(data.y, ageGroupDonutData.chartInfo.totalValue) }}&#37;</h6>
                            <span>{{ numberFormatter(data.y) }}건</span>
                        </li>
                    </template>
				</ul>
			</div>
		</div><!--//section-->
		<div class="section section-linechart" >
			<h3>지역별 구매 고객 매출액</h3>
			<div class="chart-realtimeLine">
				<div class="chart-area">
                    <loading-chart v-if="regionLineData.chartInfo.showLoading" />
                    <line-chart-wrapper v-else :data="regionLineData" :key="regionLineData.chartInfo.key" />
				</div>
			</div>
		</div><!--//section-->
	</div>
	<!--//layout-content-->
</div>
</template>

<script lang="ts">
	import { defineComponent, onUnmounted, reactive, ref } from "@vue/runtime-core";
    import codeService from '@/services/code/CodeServices';
    import { numberFormatter, calculatePercentage } from '@/utils/CommonUtils';
    import { ElMessage } from 'element-plus';
    import moment from 'moment/moment';
    import storeService from '@/services/store/StoreService';
    import productService from '@/services/product/ProductService';
    import reportService from '@/services/report/ReportService';
    import GradientDonutChartWrapper from "@/components/charts/pie/GradientDonutChartWrapper.vue";
    import LineChartWrapper from "@/components/charts/line/LineChartWrapper.vue";
    import LoadingChart from "@/components/charts/loading/Loading.vue";

	export default defineComponent({
		components: {
            "gradient-donut-chart-wrapper" : GradientDonutChartWrapper,
            "line-chart-wrapper" : LineChartWrapper,
            "loading-chart" : LoadingChart
        },
		setup() {

            let category = ref([]) as any;

            let corporation = ref([]);

            let product = ref([]);

            let year = [moment().year().toString()];

            let search = reactive({
                productCategory: "",
                productCorporation: "",
                product: "",
                productNames: [] as any,
                productNumbers: [] as any,
                categoryTypes: [] as any,
                year: moment().year().toString(),
                month: "",
            });

            let genderDonutData = ref({
				chartInfo: {
                    key: 1,
					// height: "300px",
					width: "100%",
					chartType: "DONUT",
                    showTooltip: true,
                    showLabels: false,
                    showLegend: false,
                    colors: ["#E4B9B9", "#DF4F49", "#2E2F2E"],
                    totalValue: 0,
                    showLoading: false,
				},
				chartData: [
					{
						name: "",
						type: "DONUT",
						data: [] as any,
                    }
                ]
            });

            let ageGroupDonutData = ref({
				chartInfo: {
                    key: 1,
					// height: "300px",
					width: "100%",
					chartType: "DONUT",
                    showTooltip: true,
                    showLabels: false,
                    showLegend: false,
                    colors: ["rgba(46, 47, 46, 0.1)", "rgba(46, 47, 46, 0.25)", "rgba(46, 47, 46, 0.4)", "rgba(46, 47, 46, 0.55)", "rgba(46, 47, 46, 0.7)", "rgba(46, 47, 46, 0.85)", "#2E2F2E", "#A59E96"],
                    totalValue: 0,
                    showLoading: false,
				},
				chartData: [
					{
						name: "",
						type: "DONUT",
						data: [] as any,
                    }
                ]
            });

            const regionLineData = ref({
                chartData: [] as any,
                chartInfo: {
                    key: 1,
                    // height: "500",
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

            function getYear() {
                let startYear = "2019";
                while (year[year.length-1] != startYear) {
                    let newYear = moment().set('year', Number(year[year.length-1])).subtract(1, 'year').year().toString();
                    year.push(newYear);
                }
            }

            function getSearchData() {
                getGenderStatistic();
                getAgeGroupStatistic();
                getRegionStatistic();
            }

            function getCategory() {
                codeService.selectListByParentCode("PCAT").then(res => {
                    category.value = res;
                })
            }
            
            function getCorporation() {
                search.productCorporation = "";
                search.product = "";
                storeService.selectListByCategoryCode(search.productCategory).then( res => {
                    corporation.value = res;
                })
            }

            function getProduct() {
                search.product = "";
                productService.selectListByCategoryCorporation(search.productCategory, search.productCorporation).then(res => {
                    product.value = res;
                })
            }

            function getGenderStatistic() {
                genderDonutData.value.chartInfo.showLoading = true;
                reportService.salesStatisticCategoryProduct(1, search).then(res => {
                    genderDonutData.value.chartData[0].data = res[0].data;
                    genderDonutData.value.chartInfo.totalValue = 0;
                    for(let data of res[0].data) {
                        genderDonutData.value.chartInfo.totalValue = genderDonutData.value.chartInfo.totalValue + data.y;
                    }
                    genderDonutData.value.chartInfo.key++;
                    genderDonutData.value.chartInfo.showLoading = false;
                });
            }

            function getAgeGroupStatistic() {
                ageGroupDonutData.value.chartInfo.showLoading = true;
                reportService.salesStatisticCategoryProduct(2, search).then(res => {
                    ageGroupDonutData.value.chartData[0].data = res[0].data;
                    ageGroupDonutData.value.chartInfo.totalValue = 0;
                    for(let data of res[0].data) {
                        ageGroupDonutData.value.chartInfo.totalValue = ageGroupDonutData.value.chartInfo.totalValue + data.y;
                    }
                    ageGroupDonutData.value.chartInfo.key++;
                    ageGroupDonutData.value.chartInfo.showLoading = false;
                });
            }

            function getRegionStatistic() {
                regionLineData.value.chartInfo.showLoading = true;
                reportService.salesStatisticCategoryProduct(3, search).then(res => {
                    for(let r of res) {
                        regionLineData.value.chartInfo.yaxisTitleList.push(r.name);
                        delete r.type;
                    }
                    regionLineData.value.chartData = res;
                    regionLineData.value.chartInfo.key++;
                    regionLineData.value.chartInfo.showLoading = false;
                })
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

            function addProduct() {
                if(search.product.length == 0) {
                    ElMessage({
                        message: '상품을 선택하세요',
                        type: 'error',
                    })
                
                } else if(!search.productNumbers.includes(search.product)) {
                    search.productNumbers.push(search.product);
                    let name:any = product.value.find((p:any) => {
                        return p.label === search.product;
                    });
                    search.productNames.push(name.value);
                }
            }

            function closeProduct(prod:any) {
                
                let index = search.productNumbers.indexOf(prod);
                search.productNumbers.splice(index, 1);
                search.productNames.splice(index, 1);
            }

            function calPercentage(yValue:any, totalValue:any) {
                return calculatePercentage(yValue, totalValue);
            }

            function checkColors(index:number, colors:Array<string>) {
                return colors[index % colors.length];
            }

            function resetForm() {
                search.productCategory = "";
                search.productCorporation ="";
                search.product = "";
                search.productNames = [];
                search.productNumbers = [];
                search.categoryTypes = [];
                search.year = "2021";
                search.month = "0";
            }

            getYear();
            getCategory();
            getSearchData();

            onUnmounted(() => {
                ElMessage.closeAll();
            })

			return {
                category,
                corporation,
                product,
                year,
                search,
                genderDonutData,
                ageGroupDonutData,
                regionLineData,
                getCorporation,
                getProduct,
                closeProduct,
                checkCategory,
                changeCategory,
                addProduct,
                numberFormatter,
                calPercentage,
                checkColors,
                getSearchData,
                resetForm,
            };
		},
	});
</script>

<style scoped>
    .chart-label.color-customize:before {
        background-color: var(--customize-color);
    }

    .chart-simpleDonut .list-label { 
        margin-top: 50px;
        margin-left: 25px; 
    }
</style>

