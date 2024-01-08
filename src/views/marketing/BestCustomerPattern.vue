<template>
<div>
	<div class="layout-content">
		<div class="content-title">
			<span>마케팅 관리</span>
			<h2>우수고객 구매 패턴 분석</h2>
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
				<dt>고객명</dt>
				<dd>
					<input type="text" placeholder="고객명 입력" v-model="search.userName">
				</dd>
			</dl>
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
					<th scope="col" rowspan="2" class="tc">고객 등급</th>
					<th scope="col" rowspan="2" class="tc">고객명</th>
					<th scope="col" rowspan="2" class="tc">추천 등록일</th>
					<th scope="col" rowspan="2" class="tc">상품 추천 구분</th>
					<th scope="col" colspan="2" class="tc">추천 카테고리</th>
					<th scope="col" rowspan="2" class="tc">상품명 &#40;상품 url&#41;</th>
					<th scope="col" colspan="3" class="tc">분석 이력</th>
				</tr>
				<tr>
					<th scope="col" class="tc">대분류</th>
					<th scope="col" class="tc">세부</th>
					<th scope="col" class="tc">이력 구분</th>
					<th scope="col" class="tc">구매 &#47; 등록일</th>
					<th scope="col" class="tc">상품명</th>
				</tr>
			</thead>
			<tbody>
				<tr v-if="!tableData.showTableData">
					<th colspan="10" style="text-align: center">  
						<el-icon class="is-loading loading-size"><loading /></el-icon>
					</th>
				</tr>
				<tr v-else-if="tableData.data.length == 0">
					<th colspan="10" style="text-align: center">  
						데이터가 없습니다
					</th>
				</tr>
				<tr v-else v-for="(data, index) in tableData.data" :key="index">
					<th scope="row" class="tc">{{ data.rating }}</th>
					<td class="fw-bold tc">{{ data.usrName }}</td>
					<td class="tc">{{ data.createAt }}</td>
					<td class="tc">{{ data.recommendTypeName }}</td>
					<td class="tc">{{ data.categoryName }}</td>
					<td class="tc">{{ data.subcategoryName }}</td>
					<td><a :href="data.url" target="_blank">{{ data.recommendPrdtNm }}</a></td>
					<td class="tc">{{ data.buyCartTypeName }}</td>
					<td class="tc">{{ data.reserveAt }}</td>
					<td>{{ data.prdtNm }}</td>
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
	import { defineComponent,onUnmounted,reactive, ref } from "@vue/runtime-core";
	import { Loading } from '@element-plus/icons';
	import Xlsx from 'xlsx';
	import codeService from '@/services/code/CodeServices';
	import bestCustomerService from '@/services/marketing/BestCustomerService';
import { ElMessage } from "element-plus";

	export default defineComponent({
		components: {
			"loading" : Loading,
		},
		setup() {
			let showLoadingDownload = ref(false);

			let category = ref([]) as any;

			let search = reactive({
				pageNumber: 1,
				isPaging: true,
				categories: [] as any,
				userName: "",
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

			function getPurchasePattern() {
				tableData.value.showTableData = false;
				bestCustomerService.getPurchasePattern(search).then(res => {
					tableData.value.data = res.data;
					tableData.value.recordsTotal = res.recordsTotal;
					tableData.value.lastPage = Math.ceil(res.recordsTotal/10);
					tableData.value.showTableData = true;
				})
			}

			function sendForm() {
				getPurchasePattern();
			}

			function resetForm() {
				search.pageNumber = 1;
				search.categories = [];
				search.userName = "";
			}

			function exportExcel() {
				let excelParam = {
					pageNumber: 1,
					isPaging: false,
					categories: search.categories,
					userName: search.userName,
				}
				showLoadingDownload.value = true;
				bestCustomerService.getPurchasePattern(excelParam).then(res => {

					const workBook = Xlsx.utils.book_new();
					const sheetName = "우수고객 구매 패턴 분석";
					let workSheet = Xlsx.utils.json_to_sheet(res.data);
					workSheet = Xlsx.utils.sheet_add_json(workBook.Sheets[sheetName], res.data, {origin: "A2"}); //rewrite data start at specific row
					Xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);

					// create 2 layers header
					Xlsx.utils.sheet_add_aoa(workBook.Sheets[sheetName], [
						["고객 등급", "고객명", "추천 등록일", "상품 추천 구분", "추천 카테고리", "", "상품명", "상품 url", "분석 이력", "", ""]
					],{origin: {r:0, c:0}});

					Xlsx.utils.sheet_add_aoa(workBook.Sheets[sheetName], [
						["대분류", "세부", "", "", "이력 구분", "구매 / 등록일", "상품명"]
					], {origin: {r:1, c:4}});

					// merge cells
					const merge = [
						{ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // rating
						{ s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // userName
						{ s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // createAt
						{ s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // recommendTypeName
						{ s: { r: 0, c: 4 }, e: { r: 0, c: 5 } }, // 1st row category
						{ s: { r: 0, c: 6 }, e: { r: 1, c: 6 } }, // recommendPrdtNm;
						{ s: { r: 0, c: 7 }, e: { r: 1, c: 7 } }, // url
						{ s: { r: 0, c: 8 }, e: { r: 0, c: 10 } }, // 1st row analysis history
					];
					workBook.Sheets[sheetName]['!merges'] = merge;
					workBook.Sheets[sheetName]['!cols'] = [
						{wch:10}, {wch:50}, {wch:12}, {wch:20}, {wch:20}, {wch:20}, {wch:50}, {wch:100}, {wch:20}, {wch:12}, {wch:50}
					]
					
					Xlsx.writeFile(workBook, "우수고객 구매 패턴 분석.xlsx");
					showLoadingDownload.value = false;
				})
			}

			function handlePageChange(newPageNumber:number) {
				search.pageNumber = newPageNumber;
				tableData.value.showTableData = false;
				getPurchasePattern();
			}

			getCategory();
			getPurchasePattern();

			onUnmounted(() => {
				ElMessage.closeAll();
			})

			return {
				showLoadingDownload,
				category,
				search,
				tableData,
				changeCategory,
				checkCategory,
				sendForm,
				resetForm,
				exportExcel,
				handlePageChange,
			};
		},
	});
</script>

<style scoped>
</style>

