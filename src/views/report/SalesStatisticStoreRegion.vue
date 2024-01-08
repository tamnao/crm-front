<template>
	<div>
		<div class="layout-content">
			<div class="content-title">
				<span>리포트</span>
				<h2>지역별 상품 판매 분포</h2>
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
                            <span v-html="cat.label" />
                            <input type="checkbox" :id="cat.value" :value="cat.value" :checked="checkCategory(cat.value)" @change="changeCategory(cat.value)">
                            <span class="checkmark"></span>
                        </label>
					</dd>
				</dl>
				<dl class="filter-item">
					<dt>연도 &#47; 월</dt>
					<dd>
						<select v-model="search.year" style="margin-right: 7px;">
                            <option v-for="(y, index) in year" :key="index" :value="y"> {{ y }}년 </option>
						</select>
						<select v-model="search.month" >
                            <option v-for="(m, index) in generateMonth()" :key="index" :value="m"> {{ m }}월 </option>
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
			<!--지도 영역
			1. iframe 자리에 지도 추가
			2. 지도 높이 : 아래 style 태그에서 수정 가능 
		-->
			<div class="map" >
				<!-- <div class="map-wrap"> -->
                    <loading-chart v-if="mapData.info.showLoading" />
					<div v-if="!mapData.info.showLoading && mapData.data.length > 0">
						<MapEmdWrapper :data="mapData" />
					</div>
                    <div v-else style="text-align: center; font-size: 1.4rem">
                        <span>데이터가 없습니다</span>
                    </div>
                <!-- </div> -->
            </div>
			<hr class="gutter-medium" />
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
						<th scope="col" rowspan="2" class="nowrap tc">번호</th>
						<th scope="col" colspan="2" class="nowrap tc">지역</th>
						<th scope="col" rowspan="2" class="nowrap tc">카테고리</th>
						<th scope="col" rowspan="2" class="tc">업체명</th>
						<th scope="col" rowspan="2" class="nowrap tc">판매수</th>
						<th scope="col" rowspan="2" class="nowrap tc">판매 금액</th>
					</tr>
					<tr>
						<th scope="col" class="nowrap tc">시군구</th>
						<th scope="col" class="nowrap tc">읍면동</th>
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
						<td class="nowrap tc" 
                            :rowspan="calculateRowSpan('sigungu', data.sigungu)" 
                            v-if="index == 0 || (index > 0 && tableData.data[index-1] && data.sigungu != tableData.data[index-1].sigungu)"
                        >{{ data.sigungu }}</td>
						<td class="nowrap" 
                            :rowspan="calculateRowSpan('eupmyeondong', data.eupmyeondong)" 
                            v-if="index == 0 || (index > 0 && tableData.data[index-1] && data.eupmyeondong != tableData.data[index-1].eupmyeondong)"
                        >{{ data.eupmyeondong }}</td>
						<td class="nowrap">{{ data.category }}</td>
						<td>{{ data.storeName }}</td>
						<td class="nowrap tc">{{ numberFormatter(data.salesCount) }}</td>
						<td class="nowrap tr">{{ numberFormatter(data.salesAmount) }}원</td>
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
    import Xlsx from 'xlsx';
    import moment from 'moment/moment';
    import codeService from '@/services/code/CodeServices';
    import storeService from "@/services/store/StoreService";
    import reportService from "@/services/report/ReportService";
    import LoadingChart from "@/components/charts/loading/Loading.vue";
	import MapEmdWrapper from "@/components/charts/mapemd/MapEmdWrapper.vue";
    import { ElMessage } from "element-plus";

	export default defineComponent({
		components: {
			MapEmdWrapper,
            "loading" : Loading,
            "loading-chart" : LoadingChart,
        },
		setup() {
            let showLoadingDownload = ref(false);

            let category = ref([]) as any;

            let yearMonth = ref({}) as any;

            let year = ref([]) as any;

            // let month = ref([]) as any;

            let search = reactive({
                pageNumber: 1,
                isPaging: true,
                categories: [] as any,
                year: "",
                month: "",
            });

            let mapData = ref({
                info: {
					minValueColor: "#addccc",
					midValueColor: "#2bc3cd",
					maxValueColor: "#0b55d0",
					mapType: "map",
					location: "Jeju",
					title: "탐나오 읍면동 매출현황",
					mapId: "map1",
					mapHeight: '600px',
					postfix: '명',
					showLoading: true,
                },
                data: [] as any
            });

            let tableData = ref({
                data: [],
                recordsTotal: 0,
                lastPage: 1,
                showTableData: true,
            });

            function getCategory() {
                codeService.selectListByParentCode('COMP').then(res => {
                    category.value = res;
                })
            }
            
            function getYearMonth() {
                storeService.getStartEndYearMonth().then(res => {
                    yearMonth = res;
                    search.year = res.endYear;
                    search.month = res.endMonth;

                    //generate year
                    let startYear = res.startYear;
                    let years = [res.endYear.toString()];
                    while (years[years.length-1] != startYear) {
                        let newYear = moment().set('year', Number(years[years.length-1])).subtract(1, 'year').year().toString();
                        years.push(newYear);
                    }
                    year.value = years;
                    searchData();
                })
            }

            function generateMonth() {
                let months = [] as any;
                if(search.year == yearMonth.endYear) {
                    months = [1];
                    while(months[months.length-1] < yearMonth.endMonth) {
                        months.push(months[months.length-1] + 1);
                    }
                } else if(search.year == yearMonth.startYear) {
                    months = [yearMonth.startMonth];
                    while(months[months.length-1] < 12) {
                        months.push(months[months.length-1] + 1);
                    }
                } else {
                    months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                }
                return months;
            }

            function getTableData() {
                tableData.value.showTableData = false;
                reportService.getLocalProductSales(search).then(res => {
                    tableData.value.data = res.data;
                    tableData.value.recordsTotal = res.recordsTotal;
                    tableData.value.lastPage = Math.ceil(res.recordsTotal/10);
                    tableData.value.showTableData = true;
                })
            }

            function getMapData() {
                mapData.value.info.showLoading = true;
                
                storeService.getStoreSalesMapEmd(parseInt(search.year), parseInt(search.month), search.categories + "").then(res => {
                    mapData.value.data = res;
                    mapData.value.info.showLoading = false;
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

            
            function handlePageChange(newPageNumber:number) {
                search.pageNumber = newPageNumber;
                tableData.value.showTableData = false;
                getTableData();
            }

            function exportExcel() {
                let excelParam = {
                    pageNumber: 1,
                    isPaging: false,
                    categories: search.categories,
                    year: search.year,
                    month: search.month,
                }

                showLoadingDownload.value = true;
                reportService.getLocalProductSales(excelParam).then((res:any) => {
                    
                    const workBook = Xlsx.utils.book_new();
                    const sheetName = "지역별 상품 판매 분포";
                    let workSheet = Xlsx.utils.json_to_sheet(res.data); //create a worksheet
                    workSheet = Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName], res.data, {origin: "A2"}); //rewrite data start at specific row
                    Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);

                    Xlsx.utils.sheet_add_aoa(workBook.Sheets[sheetName], [
                        ["번호", "지역", "", "카테고리", "업체명", "판매수", "판매 금액"]
                    ], {origin: {r:0, c:0}});

                    Xlsx.utils.sheet_add_aoa(workBook.Sheets[sheetName], [
                        ["시군구", "읍면동"]
                    ], {origin: {r:1, c:1}});

                    // merge cells
                    const merge = [
                        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // rowNo
                        { s: { r: 0, c: 1 }, e: { r: 0, c: 2 } }, // area
                        { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // category
                        { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } }, // store name
                        { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }, // sales count
                        { s: { r: 0, c: 6 }, e: { r: 1, c: 6 } }, // sales amount
                    ];
                    workBook.Sheets[sheetName]['!cols'] = [ {wch:7}, {wch:10}, {wch:10}, {wch:20}, {wch:30}, {wch:10}, {wch:20} ];
                    workBook.Sheets[sheetName]['!merges'] = merge;
                    
                    Xlsx.writeFile(workBook, "지역별 상품 판매 분포.xlsx");
                    showLoadingDownload.value = false;
                })
            }

            function searchData() {
                getTableData();
                getMapData();
            }

            function resetForm() {
                search.pageNumber = 1;
                search.categories = [];
                search.year = "2021";
                search.month = "1";
            }

            function calculateRowSpan(objectKey:any, placeName:string) {
                let count = 0;
                tableData.value.data.forEach((data:any) => {
                    if(data[objectKey] == placeName) {
                        count = count + 1;
                    }
                });
                return count;
            }

            getYearMonth();
            getCategory();

            onUnmounted(() => {
                ElMessage.closeAll();
            })
            
			return {
                showLoadingDownload,
                category,
                year,
                search,
                mapData,
                tableData,
                numberFormatter,
                generateMonth,
                checkCategory,
                changeCategory,
                handlePageChange,
                exportExcel,
                searchData,
                resetForm,
                calculateRowSpan, 
            };
		},
	});
</script>

<style scoped>
	.table thead {
		border-width: 1px;
        border-top: 1px solid #e1e1e1;
	}

	.table th,
	td {
		vertical-align: middle;
	}

</style>

