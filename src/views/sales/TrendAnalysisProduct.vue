<template>
    <div>
        <div class="layout-content">
            <div class="content-title">
                <span>매출 분석</span>
                <h2>상품별 추이 분석</h2>
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
                    <dt>연도 &#47; 월</dt>
                    <dd>
                        <select v-model="search.year">
                            <option v-for="(y, index) in year" :key="index" :value="y"> {{ y }}년 </option>
						</select>
						<select v-model="search.month" >
                            <option value="">전체</option>
                            <option v-for="(month, index) in 12" :key="index" :value="month"> {{ month }}월 </option>
						</select>
                    </dd>
                </dl>
                <div class="filter-row">
                    <dl class="filter-item">
                        <dt>업체명</dt>
                        <dd>
                            <input type="text" class="width-100" v-model="search.storeName">
                        </dd>
                    </dl>
                    <dl class="filter-item">
                        <dt>상품명</dt>
                        <dd>
                            <input type="text" class="width-100" v-model="search.productName">
                        </dd>
                    </dl>
                </div>
                <div class="filter-buttons">
                    <button type="submit" class="btn-h40 btn-primary" @click="getSearchData">검색</button>
                    <button type="button" class="btn-h40 btn-outline" @click="resetForm">초기화</button>
                </div>
            </form>
            <!--//form-filter-->

            <hr class="gutter-large">

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
                        <th scope="col" class="tc">번호</th> 
                        <th scope="col" class="tc">카테고리</th>
                        <th scope="col" class="tc">업체명</th>
                        <th scope="col" class="tc">상품명</th>
                        <th scope="col" class="tc">예약 &#40;판매수&#41;</th>
                        <th scope="col" class="tc">매출</th>
                        <th scope="col" class="tc">재구매 &#47; 비율</th>
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
                        <th scope="row" class="tc">{{ numberFormatter(data.rowNo) }}</th>
                        <td class="tc">{{ data.category }}</td>
                        <td>{{ data.storeName }}</td>
                        <td class="fw-bold">{{ data.productName }}</td>
                        <td class="tr">{{ numberFormatter(data.salesCount) }}</td>
                        <td class="tr">{{ numberFormatter(data.salesAmount) }}</td>
                        <td class="tr">{{ data.repurchaseInfo }}</td>
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
            </div><!--//pagination-->

        </div>
        <!--//layout-content-->
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, reactive, onUnmounted } from '@vue/runtime-core'; 
    import { numberFormatter, calculatePercentage } from '@/utils/CommonUtils';
    import { Loading } from '@element-plus/icons';
    import moment from 'moment/moment';
    import Xlsx from 'xlsx';
    import codeService from '@/services/code/CodeServices';
    import saleService from '@/services/sales/SalesService';
import { ElMessage } from 'element-plus';

    export default defineComponent({
        components: {
            "loading" : Loading,
        },
        setup() {
            let showLoadingDownload = ref(false);

            let category = ref([]) as any;

            let year = [moment().year().toString()];

            let search = reactive({
                pageNumber: 1,
                isPaging: true,
                categories: [] as any,
                year: moment().year().toString(),
                month: "",
                storeName: "",
                productName: "",
            });

            let tableData = ref({
                data: [],
                recordsTotal: 0,
                lastPage: 1,
                showTableData: true,
            });

            function getCategory() {
                codeService.selectListByParentCode("PCAT").then(res => {
                    category.value = res;
                })
            }

            function getYear() {
                let startYear = "2015";
                while (year[year.length-1] != startYear) {
                    let newYear = moment().set('year', Number(year[year.length-1])).subtract(1, 'year').year().toString();
                    year.push(newYear);
                }
            }

            function getSearchData() {
                tableData.value.showTableData = false;
                saleService.getSalesProductTrend(search).then(res => {
                    tableData.value.data = res.data;
                    tableData.value.recordsTotal = res.recordsTotal;
                    tableData.value.lastPage = Math.ceil(res.recordsTotal/10);
                    tableData.value.showTableData = true;
                })
            }

            function exportExcel() {
                let excelParam = {
                    pageNumber: 1,
                    isPaging: false,
                    categories: search.categories,
                    year: search.year,
                    month: search.month,
                    storeName: search.storeName,
                    productName: search.productName,
                }
                showLoadingDownload.value = true;
                saleService.getSalesProductTrend(excelParam).then(res => {

                    const workBook = Xlsx.utils.book_new();
                    const workSheet = Xlsx.utils.json_to_sheet(res.data);
                    const sheetName = "목록";
                    Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
                    Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName],
                        [// rename header
                            {   rowNo: "번호", 
                                category: "카테고리", 
                                storeName: "업체명",
                                productName: "상품명", 
                                salesCount: "예약 (판매수)",
                                salesAmount: "매출",
                                repurchaseInfo: "재구매 / 비율" ,
                            },       
                        ],
                        {// locate header
                            header:["rowNo", "category", "storeName", "productName", "salesCount", "salesAmount", "repurchaseInfo"],
                            skipHeader: true,
                            origin: "A1",
                        }
                    );
                    
                    Xlsx.writeFile(workBook, "상품별추이분석.xlsx");
                    showLoadingDownload.value = false;
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
                getSearchData();
            }

            function resetForm() {
                search.categories = [];
                search.year = moment().year().toString();
                search.month = "";
                search.storeName = "";
                search.productName = "";
            }

            getCategory();
            getYear();
            getSearchData();

            onUnmounted(()=> {
                ElMessage.closeAll();
            })

            return {
                showLoadingDownload,
                category,
                year,
                search,
                tableData,
                numberFormatter,
                getSearchData,
                exportExcel,
                checkCategory,
                changeCategory,
                handlePageChange,
                resetForm,
            }
        },
    })
</script>
