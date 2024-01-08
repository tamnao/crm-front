<template>
<div class="page-marketing-recommend">
	<div class="layout-content">
		<div class="content-title">
			<span>마케팅 관리</span>
			<h2>상품 추천 &#40;문자&#47;이메일&#41;</h2>
		</div>
		<hr class="gutter-medium">
		<form class="form-write" @submit.prevent="false">
			<div class="form-write-section">
				<h5 class="form-write-title">1. 전송 방법 및 발송 대상자 선택</h5>
				<div class="form-wrap">
					<dl class="filter-item">
						<dt>전송 방식</dt>
						<dd>
							<label v-for="method in sendMethodList" :key="method.value" class="radio-container" :for="method.value">
								{{ method.label }}
								<input type="radio" name="period" :id="method.value" v-model="form.sendMethod" :value="method.value" @change="changeSendMethod">	
								<span class="checkmark"></span>	
							</label>
						</dd>
					</dl>
					<dl class="filter-item">
						<dt>발송 대상</dt>
						<dd>
							<div>
								<select @change="changeGroupCode($event)">
									<option value="">발송 대상을 선택하세요</option>
									<option v-for="code in groupCode" :key="code.value" :value="code.value" :selected="checkGroupCode(code.value)">
										{{ code.label }}
									</option>
								</select>
							</div>
							<el-tag
								v-for="tag in selectedGroupCode"
								:key="tag"
								type="danger"
								closable
								:disable-transitions="false"
								@close="closeTag(tag)"
								style="margin-right: 7px; margin-top: 3px;"
							>
								{{ checkLabelTag(tag) }}
							</el-tag>
						</dd>
					</dl>
				</div><!--//form-wrap-->
			</div><!--//form-write-section-->
			<hr class="gutter-large">
			<div class="form-write-section">
				<h5 class="form-write-title">2. 발송 내용 등록</h5>
				<div class="form-wrap">
					<dl class="filter-item">
						<dt>제목</dt>
						<dd>
							<input type="text" class="width-100" v-model="form.title">
						</dd>
					</dl>
					<dl class="filter-item">
						<dt>내용</dt>
						<dd>
							<textarea class="width-100" style="height:240px" v-model="form.content" v-if="form.sendMethod == 'SMS1' " />
							<html-editor ref="editor" height="240px" v-else-if="form.sendMethod == 'SMS2' " />
						</dd>
					</dl>
				</div><!--//form-wrap-->
			</div><!--//form-write-section-->
			<div class="form-footer">
				<button type="submit" class="btn-h40 btn-primary" @click="sendForm" >전송</button>
			</div>
		</form><!--//form-->
	</div>
	<!--//layout-content-->
</div>
</template>

<script lang="ts">
	import { defineComponent, onUnmounted, reactive, ref, watchEffect } from "@vue/runtime-core";
	import { h } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus';
	import HtmlEditor from '@/components/editor/HtmlEditor.vue';
	import recommendProductService from '@/services/marketing/RecommendProductService';

	export default defineComponent({
		components: {
			"html-editor" : HtmlEditor
		},
		setup() {

			let sendMethodList = ref([]) as any;

			let groupCode = ref([]) as any;

			let selectedGroupCode = reactive([]) as any;

			let form = reactive({
				sendMethod: "",
				smsEmailRecipientGroups: [] as any,
				title: "",
				content: "",
			})

			const editor = ref();
			let content = ref("");

			function getSendMethod() {
				recommendProductService.getSendMethod().then(res => {
					sendMethodList.value = res;
					form.sendMethod = res[0].value;
				})
			}

			function getGroupCode() {
				recommendProductService.getGroupCode().then(res => {
					groupCode.value = res;
				})
			}

			function checkMethod(method:any) {
				return (form.sendMethod == method) ? true : false;
			}

			function changeSendMethod(value:any) {
				form.sendMethod = value.target._value;
				form.content = "";
				content.value = "";
			}

			function checkGroupCode(value:string) {
				if(selectedGroupCode.length > 0 && selectedGroupCode[selectedGroupCode.length -1] == value) {
					return true;
				} else if(selectedGroupCode.length == 0 && value == undefined) {
					return true;
				} else {
					return false;
				}
			}

			function changeGroupCode(value:any) {
				if (value.target.value === "")
					return;

				let type = value.target.value;
				if(!selectedGroupCode.includes(type)) {
					selectedGroupCode.push(type);
				}
			}

			function closeTag(value:any) {
				let index = selectedGroupCode.indexOf(value);
				selectedGroupCode.splice(index, 1);
			}

			function checkLabelTag(value:any) {
				let label = groupCode.value.find((code:any) => code.value === value)?.label;
				return label;
			}

			function sendForm() {
				if(form.sendMethod == "SMS2") {
					form.content = content.value;
				}

				form.smsEmailRecipientGroups = [];
				if(selectedGroupCode.length > 0) {
					for(let code in selectedGroupCode) {
						form.smsEmailRecipientGroups.push({ groupCode :  selectedGroupCode[code] });
					}
				} /*else {
					ElMessage({
						message: h('p', {style: 'color: #F56C6C; font-size: 14px'}, ["발송대상을 선택하세요"]),
						type: "error"
					});
					return;
				}*/

				recommendProductService.sendRecommendProduct(form)
				.then((res:any) => {
					console.log("---- red----");
					console.log(res);
					if(res.length > 0 && res[0].code == 500) {
						let text = [] as any;
						for(let error of res) {
							text.push(h('p', null, error.message));
						}

						ElMessage({
							message: h('p', {style: 'color: #F56C6C; font-size: 14px'}, [text]),
							type: "error"
						})

					} else if(res.status == 201) {
						ElMessage({
							message: "문자 메시지(or 이메일) 발송을 등록하였습니다.",
							type: "success"
						});

						form.sendMethod = sendMethodList.value[0].value;
						form.smsEmailRecipientGroups = [];
						form.title = "";
						form.content = "";
						selectedGroupCode.splice(0, selectedGroupCode.length);
					}
				})
				.catch(err => {
					console.log("---- error in best vue ----")
				});
			}

			function checkValue() {
				if(editor.value) {
					content.value = editor.value.content;
				} else {
					content.value = "";
				}
			}

			watchEffect(() => {
				checkValue();
			});

			getSendMethod();
			getGroupCode();

			onUnmounted(() => {
				ElMessage.closeAll();
			});

			return {
				sendMethodList,
				groupCode,
				form,
				editor,
				content,
				checkValue,
				checkMethod,
				changeSendMethod,
				checkGroupCode,
				changeGroupCode,
				closeTag,
				checkLabelTag,
				sendForm,
				selectedGroupCode,
			};
		},
	});
</script>

<style scoped>
</style>

