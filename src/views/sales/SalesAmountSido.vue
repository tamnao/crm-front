<template>
    <div>
        <div class="layout-content">

            <div class="content-title">
                <span>매출 분석</span>
                <h2>거주지별 구매 분석</h2>
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
                    <dt>거주 지역</dt>
                    <dd>
                        <label class="checkbox-container" for="residenceAll">전체
                            <input type="checkbox" id="residenceAll" :checked="checkSido('All')" @change="changeSido('All')">
                            <span class="checkmark"></span>
                        </label>
                        <label v-for="sid in sido" :key="sid.value" :for="sid.value" class="checkbox-container">
                            {{ sid.label }}
                            <input type="checkbox" :id="sid.value" :value="sid.value" :checked="checkSido(sid.value)" @change="changeSido(sid.value)">
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
                        <th scope="col" class="tc">거주 지역</th>
                        <th scope="col" class="tc">매출</th>
                        <th scope="col" class="tc">전년 동일 기간 매출</th>
                        <th scope="col" class="tc">증감량</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!tableData.showTableData">
                        <th colspan="5" style="text-align: center">  
                            <el-icon class="is-loading loading-size"><loading /></el-icon>
                        </th>
                    </tr>
                    <tr v-else-if="tableData.data.length == 0">
                        <th colspan="5" style="text-align: center">  
                            데이터가 없습니다
                        </th>
                    </tr>
                    <tr v-else v-for="(data, index) in tableData.data" :key="index">
                        <th scope="row" class="tc">{{ data.rowNo }}</th>
                        <td class="fw-bold tc" >{{ data.sido }}</td>
                        <td class="tr">{{ numberFormatter(data.salesAmount) }}</td>
                        <td class="tr">{{ numberFormatter(data.salesAmountLastYear) }}</td>
                        <td :class="checkClassValue(data.growth)">&nbsp; {{ checkValue(data.growth) }}</td>
                    </tr>
                    <!-- <tr>
                        <th scope="row" class="tc">28</th>
                        <td class="fw-bold">숙박</td>
                        <td class="tr">40,000,000</td>
                        <td class="tr">40,000,000</td>
                        <td class="tr text-red">&#9660; 35,650,000</td>
                    </tr> -->
                </tbody>
            </table>
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
    import saleService from '@/services/sales/SalesService';
import { ElMessage } from "element-plus";

    export default defineComponent({
        components: {
            "loading" : Loading,
        },
        setup() {

            let showLoadingDownload = ref(false);

            let category = ref([]) as any;

            let sido = ref([]) as any;
            
            let year = [moment().year().toString()];

            let search = reactive({
                categories: [] as any,
                sidos: [] as any,
                year: moment().year().toString(),
                month: "",
            })

            let tableData = ref({
                data: [],
                recordsTotal: 0,
                showTableData: true,
            });

            function getSido() {
                codeService.selectListByParentCode("SIDO").then(res => {
                    sido.value = res;
                })
            }

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
                saleService.getSalesSidoAmount(search).then(res => {
                    tableData.value.data = res;
                    tableData.value.recordsTotal = res.length;
                    tableData.value.showTableData = true;
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

            function checkSido(label:string) {
                if(search.sidos.length == 0 && label == 'All') {
                    return true;
                } else if(search.sidos.includes(label)) {
                    return true;
                } else {
                    return false;
                }
            }

            function changeSido(label:string) {
                if(label == 'All') {
                    search.sidos = [];
                } else if(search.sidos.includes(label)) {
                    let index = search.sidos.indexOf(label);
                    search.sidos.splice(index, 1);
                } else {
                    search.sidos.push(label);
                }
            }

            function resetForm() {
                search.categories = [];
                search.sidos = [];
                search.year = moment().year().toString();
                search.month = "";
            }

            function checkClassValue(value:number) {
                if(value > 0) {
                    return "tr text-green";
                } else if(value < 0) {
                    return "tr text-red";
                } else if(value == 0) {
                    return "tr";
                }
            }

            function checkValue(value:number) {
                return numberFormatter(Math.abs(value));
            }

            function exportExcel() {
                showLoadingDownload.value = true;

                const workBook = Xlsx.utils.book_new();
                const workSheet = Xlsx.utils.json_to_sheet(tableData.value.data);
                const sheetName = "목록";

                Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
                Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName],
                    [// rename header
                        {          
                            rowNo: "번호", 
                            sido: "거주 지역",
                            salesAmount: "매출", 
                            salesAmountLastYear: "전년 동일 기간 매출", 
                            growth: "증감량", 
                        },
                    ],
                    {// locate header
                        header:["rowNo", "sido", "salesAmount", "salesAmountLastYear", "growth"],
                        skipHeader: true,
                        origin: "A1",
                    }
                );

                Xlsx.writeFile(workBook, "거주지별 구매 분석.xlsx");
                showLoadingDownload.value = false;
            }

            getCategory();
            getSido();
            getYear();
            getSearchData();

            onUnmounted(() => {
                ElMessage.closeAll();
            })

            return {
                showLoadingDownload,
                category,
                sido,
                year,
                search,
                tableData,
                numberFormatter,
                getSearchData,
                checkCategory,
                changeCategory,
                checkSido,
                changeSido,
                resetForm,
                checkClassValue,
                checkValue,
                exportExcel,
            }
        }
    })
</script>

<style scoped>
    .text-green:before {
        content: "\25B2";
    }

    .text-red:before {
        content: "\25BC"
    }

</style>