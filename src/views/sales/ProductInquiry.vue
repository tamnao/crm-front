<template>
    <div>
        <div class="layout-content">

            <div class="content-title">
                <span>매출 분석</span>
                <h2>상품별 문의 내역</h2>
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
						<select v-model="search.year" style="margin-right: 7px;">
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
                    <button type="submit" class="btn-h40 btn-primary" @click="sendForm">검색</button>
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
                        <th scope="col" class="tc">취소</th>
                        <th scope="col" class="tc">매출</th>
                        <th scope="col" class="tc">평점</th>
                        <th scope="col" class="tc">이용후기</th>
                        <th scope="col" class="tc">1&#58;1 문의</th>
                        <th scope="col" class="tc">SNS 공유</th>
                        <th scope="col" class="tc">조회</th>
                        <th scope="col" class="tc">재구매</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!tableData.showTableData">
                        <th colspan="13" style="text-align: center">  
                            <el-icon class="is-loading loading-size"><loading /></el-icon>
                        </th>
                    </tr>
                    <tr v-else-if="tableData.data.length == 0">
                        <th colspan="13" style="text-align: center">  
                            데이터가 없습니다
                        </th>
                    </tr>
                    <tr v-else v-for="(data, index) in tableData.data" :key="index">
                        <th scope="row" class="tc">{{ numberFormatter(data.rowNo) }}</th>
                        <td class="tc">{{ data.category }}</td>
                        <td>{{ data.storeName }}</td>
                        <td class="fw-bold">{{ data.productName }}</td>
                        <td class="tr">{{ numberFormatter(data.salesCount) }}</td> 
                        <td class="tr">{{ numberFormatter(data.cancelCount) }}</td>
                        <td class="tr">{{ numberFormatter(data.salesAmount) }}</td>
                        <td class="tr">{{ numberFormatter(data.ratingAverage) }}</td>
                        <td class="tr">{{ numberFormatter(data.reviewCount) }}</td>
                        <td class="tr">{{ numberFormatter(data.inquiryCount) }}</td>
                        <td class="tr">{{ numberFormatter(data.snsCount) }}</td>
                        <td class="tr">{{ numberFormatter(data.viewCount) }}</td>
                        <td class="tr">{{ numberFormatter(data.repurchaseCount) }}</td>
                    </tr>
                    <tr class="border-double"><!--마지막 줄 tr에 border-double 클래스를 넣어주세요.-->
                        <th scope="row" colspan="4" class="tc fw-bold">합계</th>
                        <td class="tr">{{ numberFormatter(tableData.totalSalesCount) }}</td> 
                        <td class="tr">{{ numberFormatter(tableData.totalCancelCount) }}</td>
                        <td class="tr">{{ numberFormatter(tableData.totalSalesAmount) }}</td>
                        <td class="tr">{{ numberFormatter(tableData.ratingAverage) }}</td>
                        <td class="tr">{{ numberFormatter(tableData.totalReviewCount) }}</td>
                        <td class="tr">{{ numberFormatter(tableData.totalInquiryCount) }}</td>
                        <td class="tr">{{ numberFormatter(tableData.totalSnsCount) }}</td>
                        <td class="tr">{{ numberFormatter(tableData.totalViewCount) }}</td>
                        <td class="tr">{{ numberFormatter(tableData.totalRepurchaseCount) }}</td>
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
    import { defineComponent, ref, reactive, onUnmounted } from "vue-demi";
    import { numberFormatter } from '@/utils/CommonUtils';
    import { Loading } from '@element-plus/icons';
    import moment from "moment/moment";
    import Xlsx from 'xlsx';
    import codeService from '@/services/code/CodeServices';
    import salesService from '@/services/sales/SalesService';
import { ElMessage } from "element-plus";

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
            })

            let tableData = ref({
                data: [],
                recordsTotal: 0,
                lastPage: 1,
                showTableData: true,
                totalSalesCount: 0,
                totalCancelCount: 0,
                totalSalesAmount: 0,
                totalRatingAverage: 0,
                ratingAverage: 0,
                totalReviewCount: 0,
                totalInquiryCount: 0,
                totalSnsCount: 0,
                totalViewCount: 0,
                totalRepurchaseCount: 0, 
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

            function getSalesProductInquiry() {
                tableData.value.showTableData = false;
                tableData.value.totalSalesCount = 0;
                tableData.value.totalCancelCount = 0;
                tableData.value.totalSalesAmount = 0;
                tableData.value.totalRatingAverage = 0;
                tableData.value.ratingAverage = 0;
                tableData.value.totalReviewCount = 0;
                tableData.value.totalInquiryCount = 0;
                tableData.value.totalSnsCount = 0;
                tableData.value.totalViewCount = 0;
                tableData.value.totalRepurchaseCount = 0; 
                salesService.getSalesProductInquiry(search).then(res => {
                    tableData.value.data = res.data;
                    tableData.value.recordsTotal = res.recordsTotal;
                    tableData.value.lastPage = Math.ceil(res.recordsTotal/10);
                    tableData.value.showTableData = true;

                    for(let data of res.data) {
                        tableData.value.totalSalesCount = tableData.value.totalSalesCount + data.salesCount;
                        tableData.value.totalCancelCount = tableData.value.totalCancelCount + data.cancelCount;
                        tableData.value.totalSalesAmount = tableData.value.totalSalesAmount + data.salesAmount;
                        tableData.value.totalRatingAverage = tableData.value.totalRatingAverage + data.ratingAverage;
                        tableData.value.totalReviewCount = tableData.value.totalReviewCount + data.reviewCount;
                        tableData.value.totalInquiryCount = tableData.value.totalInquiryCount + data.inquiryCount;
                        tableData.value.totalSnsCount = tableData.value.totalSnsCount + data.snsCount;
                        tableData.value.totalViewCount = tableData.value.totalViewCount + data.viewCount;
                        tableData.value.totalRepurchaseCount = tableData.value.totalRepurchaseCount + data.repurchaseCount; 
                    }
                    tableData.value.ratingAverage = res.data.length > 0 ? tableData.value.totalRatingAverage / res.data.length : 0;

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

            function sendForm() {
                getSalesProductInquiry();
            }

            function resetForm() {
                search.pageNumber = 1;
                search.isPaging = true;
                search.categories = [];
                search.year = moment().year().toString();
                search.month = "";
                search.storeName = "";
                search.productName = "";
            }

            function handlePageChange(newPageNumber:number) {
                search.pageNumber = newPageNumber;
                tableData.value.showTableData = false;
                getSalesProductInquiry();
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
                salesService.getSalesProductInquiry(excelParam).then(res => {

                    let totalSalesCount = 0;
                    let totalCancelCount = 0;
                    let totalSalesAmount = 0;
                    let totalRatingAverage = 0;
                    let ratingAverage = 0;
                    let totalReviewCount = 0;
                    let totalInquiryCount = 0;
                    let totalSnsCount = 0;
                    let totalViewCount = 0;
                    let totalRepurchaseCount = 0; 

                    for(let data of res.data) {
                        totalSalesCount = totalSalesCount + data.salesCount;
                        totalCancelCount = totalCancelCount + data.cancelCount;
                        totalSalesAmount = totalSalesAmount + data.salesAmount;
                        totalRatingAverage = totalRatingAverage + data.ratingAverage;
                        totalReviewCount = totalReviewCount + data.reviewCount;
                        totalInquiryCount = totalInquiryCount + data.inquiryCount;
                        totalSnsCount = totalSnsCount + data.snsCount;
                        totalViewCount = totalViewCount + data.viewCount;
                        totalRepurchaseCount = totalRepurchaseCount + data.repurchaseCount; 
                    }
                    ratingAverage = res.data.length > 0 ? totalRatingAverage / res.data.length : 0;

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
                                cancelCount: "취소",
                                salesAmount: "매출",
                                ratingAverage: "평점",
                                reviewCount: "이용후기",
                                inquiryCount: "1:1 문의",
                                snsCount: "SNS 공유",
                                viewCount: "조회",
                                repurchaseCount: "재구매",
                            },       
                        ],
                        {// locate header
                            header:["rowNo", "category", "storeName", "productName", "salesCount", "cancelCount", "salesAmount", "ratingAverage",
                                    "reviewCount", "inquiryCount", "snsCount", "viewCount", "repurchaseCount"],
                            skipHeader: true,
                            origin: "A1",
                        }
                    );

                    // add total calculation
                    Xlsx.utils.sheet_add_aoa(workBook.Sheets[sheetName], [
                    [   
                        "합계", 
                        totalSalesCount, 
                        totalCancelCount, 
                        totalSalesAmount,
                        ratingAverage,
                        totalReviewCount,
                        totalInquiryCount,
                        totalSnsCount,
                        totalViewCount,
                        totalRepurchaseCount,
                    ]
                    ], {origin: {r:-1, c:3}});
                    
                    let range = Xlsx.utils.decode_range(workBook.Sheets[sheetName]['!ref'] || '');
                    let lastRow = range.e.r - range.s.r;

                    // merge cells
                    const merge = [{ s: { r: lastRow, c: 0 }, e: { r: lastRow, c: 3 } }];
                    workBook.Sheets[sheetName]['!merges'] = merge;
                        
                    Xlsx.writeFile(workBook, "상품별 문의 내역.xlsx");
                    showLoadingDownload.value = false;
                })

            }
            
            getCategory();
            getYear();
            getSalesProductInquiry();

            onUnmounted(() => {
                ElMessage.closeAll();
            });

            return {
                showLoadingDownload,
                category,
                year,
                search,
                tableData,
                numberFormatter,
                checkCategory,
                changeCategory,
                sendForm,
                resetForm,
                handlePageChange,
                exportExcel,
            }
        }
    })
</script>