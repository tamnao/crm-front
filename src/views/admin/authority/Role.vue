<template>
<div>
	<div class="layout-content">
		<div class="content-title">
			<span>시스템 관리</span>
			<h2>권한 그룹 관리</h2>
		</div>
		<form class="form-filter" @submit.prevent="false ">
			<dl class="filter-item">
				<dt>권한 그룹명</dt>
				<dd>
					<select v-model="search.roleName">
						<option value="">전체</option>
						<option v-for="(group, index) in roleGroup" :key="index + '_' + group.label" :value="group.value">{{ group.value }}</option>
					</select>
				</dd>
			</dl>
			<div class="filter-buttons">
				<button type="submit" class="btn-h40 btn-primary" @click="searchData">검색</button>
				<button type="button" class="btn-h40 btn-outline" @click="initializeAll">초기화</button>
			</div>
		</form>
		<!--//form-filter-->
		<hr class="gutter-large">
		<form>
			<table class="table caption-top table-borderless">
				<caption>
					<span>검색 결과 {{ tableData.recordsTotal }}건</span>
				</caption>
				<thead>
					<tr>
						<th scope="col" class="nowrap tc">번호</th>
						<th scope="col" class="nowrap tc">권한 그룹명</th>
						<th scope="col" class="tc">권한 그룹 아이디</th>
						<th scope="col" class="tc">설명</th>
						<th scope="col" class="tc">관리</th>
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
					<tr v-else v-for="(data, index) in tableData.data" :key="index + '_' + data.id">
						<th scope="row" class="nowrap tc">{{ index+1 }}</th>
						<td class="nowrap">{{ data.name }}</td>
						<td class="fw-bold">{{ data.id }}</td>
						<td>{{ data.description }}</td>
						<td class="tc">
							<button type="button" data-bs-toggle="modal" data-bs-target="#modalAdminGroup" class="btn-h40 btn-outline" @click="getRoleDetails(data.id, data.name, data.description)">수정</button>
							<!-- <button type="submit" class="btn-h40 btn-outline-red">삭제</button> -->
						</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td colspan="5">
							<a data-bs-toggle="modal" data-bs-target="#modalAdminGroup" class="btn-h40 btn-secondary" @click="getAllRoleMenus">등록</a>
						</td>
					</tr>
				</tfoot>
			</table>
		</form>
	</div>
	<!--//layout-content-->
	<!-- Modal -->
	<div class="modal fade modal-admin-group" id="modalAdminGroup" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
		<div class="modal-dialog modal-xl">
			<div class="modal-content">
				<div class="modal-header">
					<h5 v-if="commonVariables.isCreate" class="modal-title">권한 그룹 등록</h5>
					<h5 v-else class="modal-title">권한 그룹 수정</h5>
					<button id="modalAdminGroupClose" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="handleCloseModal">close</button>
				</div>
				<template v-if="commonVariables.showModal">
					<div class="modal-body">
						<form>
							<div class="form-filter">
								<dl class="filter-item">
									<dt>권한 그룹명</dt>
									<dd>
										<input type="text" class="width-100" v-model="roleDto.name">
									</dd>
								</dl>
								<dl class="filter-item">
									<dt>권한 그룹 아이디</dt>
									<dd>
										<input type="text" placeholder="영문만 입력해 주세요. 예 : admtamnao" class="width-100" v-model="roleDto.id" :disabled="commonVariables.disabledInput">
									</dd>
								</dl>
								<dl class="filter-item">
									<dt>설명</dt>
									<dd>
										<input type="text" class="width-100" v-model="roleDto.description">
									</dd>
								</dl>
								<dl class="filter-item">
									<dt>메뉴별 권한 설정</dt>
									<dd>
										<ul class="list-menu">
											<li v-for="(parent, index) in allMenu" :key="index + '_' + parent.menuName">
												<label v-if="index == 0" class="checkbox-container" :for="index + '_' + parent.menuName">{{ parent.menuName }} &#40;필수&#41;
													<input type="checkbox" :id="index + '_' + parent.menuName" checked disabled>
													<span class="checkmark"></span>
												</label>
												<label v-else class="checkbox-container" :for="removeWhitespace(parent.menuName) + '_' + parent.subMenuList.length">{{ parent.menuName }}
													<input type="checkbox" :checked="parent.isChecked == parent.subMenuList.length" :id="removeWhitespace(parent.menuName) + '_' + parent.subMenuList.length" :value="parent.id" @change="checkAll(removeWhitespace(parent.menuName) + '_' + parent.subMenuList.length)">
													<span class="checkmark"></span>
												</label>
												<button v-if="parent.subMenuList.length > 0" class="btn-collapse collapsed" :id="'toggleIcon_' + index" @click="subMenuToggleHandler(index)" type="button"></button>
												<div v-if="parent.subMenuList.length > 0" :id="'subMenu_' + index">
													<label v-for="(subMenu) in parent.subMenuList" :key="parent.menuName + '_' + subMenu.menuName" class="checkbox-container" :for="removeWhitespace(parent.menuName) + '-' + subMenu.menuName">
														{{ subMenu.menuName }}
														<input v-if="subMenu.roleId != null" type="checkbox" :id="removeWhitespace(parent.menuName) + '-' + subMenu.menuName" checked="checked" :value="subMenu.id" @change="selectMenu">
														<input v-else type="checkbox" :id="removeWhitespace(parent.menuName) + '-' + subMenu.menuName" :value="subMenu.id" @change="selectMenu">
														<span class="checkmark"></span>
													</label>
												</div>
											</li>
										</ul>									
									</dd>
								</dl>
							</div><!--//form-filter-->
						</form>
					</div><!--//modal-body-->
					<div class="modal-footer">
						<button v-if="commonVariables.isCreate" type="submit" class="btn-h40 btn-primary" @click="createNewRole">저장</button>
						<button v-else type="submit" class="btn-h40 btn-primary" @click="updateRole">저장</button>
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
</template>

<script lang="ts">
	import { defineComponent, onMounted, onUnmounted, reactive, ref } from "@vue/runtime-core";
	import { Loading } from '@element-plus/icons';
	import $ from 'jquery';
	import AdminRoleService from '@/services/role/AdminRoleService';
import { ElMessage } from "element-plus";

	export default defineComponent({
		components: {
			"loading" : Loading,
		},
		setup() {
			let roleGroup = ref([]) as any;

			let allMenu = ref([]) as any;

			let commonVariables = ref({
				showModal: false,
				disabledInput: false,
				isCreate: true,
			});

			let search = reactive({
                pageNumber: 1,
                isPaging: true,
                roleName: "",
            });

            let tableData = ref({
                data: [],
                recordsTotal: 0,
                showTableData: true,
            });

			let roleDto = reactive({
				id: "",
				name: "",
				description: "",
				menuIdList: [1] as any,
			});

			const removeWhitespace = (name:string) => {
                return name.replace(/ /g,'');
            }

			const getRoleGroup = async() => {
				roleGroup.value = await AdminRoleService.findAllRoleSelectList();
			}

			const handlePageChange = (newPageNumber:number) => {
                search.pageNumber = newPageNumber;
                tableData.value.showTableData = false;
                searchData();
            }

			const searchData = () => {
				tableData.value.showTableData = false;
				AdminRoleService.findAllRole(search).then(res => {
					tableData.value.data = res;
					tableData.value.recordsTotal = res.length;
					tableData.value.showTableData = true;
				})
			}

			const initializeAll = () => {
                search.roleName = "";
                searchData();
            }

			const getAllRoleMenus = () => {
				commonVariables.value.isCreate = true;
				commonVariables.value.disabledInput = false;
				commonVariables.value.showModal = false;
				Object.assign(roleDto, {
					id: "",
					name: "",
					description: "",
					menuIdList: [1] as any,
				});
				
				AdminRoleService.findAllMenus().then(res => {
					allMenu.value = res;
					commonVariables.value.showModal = true;
				});
			}

			const getRoleDetails = (roleId:string, roleName:string, description:string) => {
				commonVariables.value.isCreate = false;
				commonVariables.value.disabledInput = true;
				commonVariables.value.showModal = false;
				Object.assign(roleDto, {
					id: roleId,
					name: roleName,
					description: description,
					menuIdList: [1] as any,
				});

				AdminRoleService.findAllMenusByRoleId(roleId).then(res => {
					allMenu.value = res;
					res.forEach((parents:any) => {
						parents.isChecked = 0;
						if(parents.subMenuList.length > 0) {
							parents.subMenuList.forEach((child:any) => {
								if(child.roleId != null) {
									if (!roleDto.menuIdList.includes(parents.id))
										roleDto.menuIdList.push(parents.id);
									parents.isChecked++;
									roleDto.menuIdList.push(child.id);
								}
							});
						}
					});
					commonVariables.value.showModal = true;
				});
			}

			const handleCloseModal = () => {
                document.getElementById("modalAdminGroupClose")?.click();
                Object.assign(roleDto, {
					id: "",
					name: "",
					description: "",
					menuIdList: [1] as any,
				});
            }

			const subMenuToggleHandler = (index:number) => {
				$("#subMenu_" + index).slideToggle();

				if($("#toggleIcon_" + index).hasClass('collapsed')) {
					$("#toggleIcon_" + index).removeClass("collapsed");
				}
				else {
					$("#toggleIcon_" + index).addClass("collapsed");
				}
			}

			const checkAll = (parentId:any) => {
				let parentMenu = parentId.split('_')[0];
				if($("#" + parentId).is(':checked')) {
					if(!roleDto.menuIdList.includes(Number($("#" + parentId).val()))) {
						roleDto.menuIdList.push(Number($("#" + parentId).val()));
					}
					$("input[id^="+ parentMenu +"-]").each(function() {
						$(this).prop("checked", true);
						if(!roleDto.menuIdList.includes(Number($(this).val()))) {
							roleDto.menuIdList.push(Number($(this).val()));
						}
					});
				}
				else {
					if(roleDto.menuIdList.includes(Number($("#" + parentId).val()))) {
						let index = roleDto.menuIdList.indexOf(Number($("#" + parentId).val()));
						roleDto.menuIdList.splice(index, 1);
					}
					$("input[id^="+ parentMenu +"-]").each(function() {
						$(this).prop("checked", false);
						let index = roleDto.menuIdList.indexOf(Number($(this).val()));
						roleDto.menuIdList.splice(index, 1);
					});
				}
			}
			
			const selectMenu = (element:any) => {
				let parentId = element.target.id.split("-")[0];
				let isChecked = 0;
				let parentElement = "" as any;

				$("input[id^=" + parentId +"_]").each(function() {
					parentElement = $(this);
					if($(this).is(':checked')) {
						$(this).prop("checked", false);
					}
				});

				$("input[id^="+ parentId +"-]").each(function() {
					if($(this).is(":checked")) {
						isChecked++;
					}
				});

				if(roleDto.menuIdList.includes(element.target._value)) {
					let index = roleDto.menuIdList.indexOf(element.target._value);
					roleDto.menuIdList.splice(index, 1);
				}
				else {
					roleDto.menuIdList.push(element.target._value);
				}

				let totalLength = parentElement.attr("id").split("_")[1];
				if(isChecked == totalLength) {
					parentElement.prop("checked", true);
				}

				if(isChecked <= 0) {
					let parentIndex = roleDto.menuIdList.indexOf((Number(parentElement.val())));
					roleDto.menuIdList.splice(parentIndex, 1);
				}
				else {
					if(!roleDto.menuIdList.includes(Number(parentElement.val()))) {
						roleDto.menuIdList.push(Number(parentElement.val()));
					}
				}
				
			}

			const createNewRole = () => {
				AdminRoleService.createRole(roleDto).then(res => {
					document.getElementById("modalAdminGroupClose")?.click();
					searchData();
				});
			}

			const updateRole = () => {
				AdminRoleService.updateRole(roleDto).then(res => {
					document.getElementById("modalAdminGroupClose")?.click();
					searchData();
				});
			}

			onMounted(() => {
				getRoleGroup();
				searchData();
				
			});

			onUnmounted(() => {
				ElMessage.closeAll();
			});
			
			return {
				roleGroup,
				commonVariables,
				allMenu,
				removeWhitespace,
				search,
				tableData,
				getAllRoleMenus,
				getRoleDetails,
				roleDto,
				searchData,
				initializeAll,
				handlePageChange,
				handleCloseModal,
				checkAll,
				selectMenu,
				createNewRole,
				updateRole,
				subMenuToggleHandler,
			};
		},
	});
</script>

<style scoped>
	img, svg {
        vertical-align: unset !important;
    }

	.btn-secondary {
		border: 1px solid #2E2F2E;
		background-color: #2E2F2E;
		font-weight: 700;
		color: #fff;
	}

	.btn-collapse.collapsed:after {
		font-family: 'Material Icons Outlined';
		content: 'expand_more';
		position: absolute;
		right: 0;
		margin-top: -20px;
		font-size: 2rem;
		color: #999;
	}

	.btn-collapse:not(.collapsed):after {
		font-family: 'Material Icons Outlined';
		content: 'expand_less';
		position: absolute;
		top: 50%;
		right: 0;
		margin-top: -20px;
		font-size: 2rem;
		color: #2E2F2E;
	}
</style>

