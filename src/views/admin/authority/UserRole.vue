<template>
<div>
	<div class="layout-content">
		<div class="content-title">
			<span>시스템 관리</span>
			<h2>권한 관리</h2>
		</div>
		<form class="form-filter" @submit.prevent="false">
			<dl class="filter-item">
				<dt>권한 그룹</dt>
				<dd>
					<select v-model="search.roleId" >
						<option value="">전체</option>
                        <option v-for="(role, index) in roleGroup" :key="index + '_' + role.label" :value="role.label"> {{ role.value }} </option>
					</select>
				</dd>
			</dl>
			<dl class="filter-item">
				<dt>아이디</dt>
				<dd>
					<input type="text" placeholder="아이디 입력" v-model="search.userId" >
				</dd>
			</dl>
			<div class="filter-buttons">
				<button type="submit" class="btn-h40 btn-primary" @click="searchRole" >검색</button>
				<button type="button" class="btn-h40 btn-outline" @click="resetForm">초기화</button>
			</div>
		</form>
		<!--//form-filter-->
		<hr class="gutter-large">
		<form @submit.prevent="false">
			<table class="table caption-top table-borderless">
				<caption>
					<span>검색 결과 {{ tableData.recordsTotal }}건</span>
				</caption>
				<thead>
					<tr>
						<th scope="col" class="nowrap tc">번호</th>
						<th scope="col" class="tc">아이디</th>
						<th scope="col" class="tc">이름</th>
						<th scope="col" class="nowrap tc">권한 그룹</th>
					</tr>
				</thead>
				<tbody>
                    <tr v-if="!tableData.showTableData">
                        <th colspan="4" style="text-align: center">  
                            <el-icon class="is-loading loading-size"><loading /></el-icon>
                        </th>
                    </tr>
                    <tr v-else-if="tableData.data.length == 0">
                        <th colspan="4" style="text-align: center">  
                            데이터가 없습니다
                        </th>
                    </tr>
					<tr v-else v-for="(data, index) in tableData.data" :key="index">
						<th scope="row" class="nowrap tc">{{ data.rowNo }}</th>
						<th class="fw-bold tc">{{ data.userId }}</th>
						<td class="fw-bold">{{ data.userName }}</td>
						<td class="nowrap tc">
							<select v-model="data.selectedRole" style="margin-right: 7px;">
								<option value="" disabled hidden>선택</option>
                                <option option v-for="(role, index) in roleGroup" :key="index" :value="role.label">{{ role.value }}</option>
							</select>
							<button type="submit" class="btn-h40 btn-outline" @click="changeRole(data.userId, data.selectedRole)">적용</button>
						</td>
					</tr>
				</tbody>
			</table>
		</form>
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
	import { defineComponent, onMounted, onUnmounted, reactive, ref } from "@vue/runtime-core";
    import { Loading } from '@element-plus/icons';
	import AdminRoleService from '@/services/role/AdminRoleService';
import { ElMessage, ElMessageBox } from "element-plus";

	export default defineComponent({
		components: {
            "loading" : Loading,
        },
		setup() {
            let roleGroup = ref([]) as any;

            let search = reactive({
                pageNumber: 1,
                isPaging: true,
                roleId: "",
                userId: "",
            })

            let tableData = ref({
                data: [] as any,
                recordsTotal: 0,
                lastPage: 1,
				length: 10,
                showTableData: true,
            });

			async function getRoleGroup() {
				roleGroup.value = await AdminRoleService.findAllRoleSelectList();
			}

            function searchRole() {
				tableData.value.showTableData = false;
				AdminRoleService.findAllAdminUserRole(search).then(res => {
					res.data.forEach((element:any) => {
						element.selectedRole = element.roleId;
					});
					tableData.value.data = res.data;
					tableData.value.recordsTotal = res.recordsTotal;
					tableData.value.lastPage = Math.ceil(res.recordsTotal / tableData.value.length);
					tableData.value.showTableData = true;
				});
            }

            function resetForm() {
                search.pageNumber = 1;
                search.isPaging = true;
                search.roleId = "";
                search.userId = "";
				searchRole();
            }

            async function changeRole(userId:any, selectedRole:any) {
				tableData.value.showTableData = false;
				let params = {
					userId: userId,
					roleId: selectedRole
				}
				await AdminRoleService.createAdminUserRole(params);
				searchRole();
            }

            function handlePageChange(newPageNumber:number) {
                search.pageNumber = newPageNumber;
                tableData.value.showTableData = false;
                searchRole();
            }

			onMounted(() => {
				getRoleGroup();
				searchRole();
			});

			onUnmounted(() => {
				ElMessage.closeAll();
			});

			return {
                roleGroup,
                search,
                tableData,
                searchRole,
                resetForm,
                changeRole,
                handlePageChange,
            };
		},
	});
</script>