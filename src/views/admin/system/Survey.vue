<template>
	<div>
		<div class="layout-content">
			<div class="content-title">
				<span>시스템 관리</span>
				<h2>설문조사 관리</h2>
			</div>
			<form class="form-filter" @submit.prevent="false">
				<dl class="filter-item">
					<dt>기간</dt>
					<dd>
						<label
							v-for="period in periods"
							:key="period.id"
							class="radio-container"
							:for="period.id"
						>
							{{ period.name }}
							<input
								type="radio"
								:id="period.id"
								v-model="commonVariables.period"
								:value="period.value"
								name="period"
								@change="changePeriod(period.value)"
							/>
							<span class="checkmark"></span>
						</label>
						<div class="form-fromto">
							<input
								type="date"
								v-model="search.startDate"
								:disabled="commonVariables.disabledDate"
								pattern="\d{4}-\d{2}-\d{2}"
							/>
							<span>&dash;</span>
							<input
								type="date"
								v-model="search.endDate"
								:disabled="commonVariables.disabledDate"
							/>
						</div>
					</dd>
				</dl>
				<dl class="filter-item">
					<dt>설문명</dt>
					<dd>
						<input
							type="text"
							class="width-100"
							v-model="search.title"
						/>
					</dd>
				</dl>
				<div class="filter-buttons">
					<button
						type="submit"
						class="btn-h40 btn-primary"
						@click="searchSurvey"
					>
						검색
					</button>
					<button
						type="button"
						class="btn-h40 btn-outline"
						@click="resetForm"
					>
						초기화
					</button>
				</div>
			</form>
			<!--//form-filter-->
			<hr class="gutter-large" />
			<form>
				<table class="table caption-top table-borderless">
					<caption>
						<span>검색 결과 {{ tableData.recordsTotal }}건</span>
					</caption>
					<thead>
						<tr>
							<th scope="col" class="tc">번호</th>
							<th scope="col" class="tc">설문명</th>
							<th scope="col" class="tc">등록 참여자 수</th>
							<th scope="col" class="tc">등록일</th>
							<th scope="col" class="tc">등록자</th>
							<th scope="col" class="tc">관리</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="!tableData.showTableData">
							<th colspan="5" style="text-align: center">
								<el-icon class="is-loading loading-size"
									><loading
								/></el-icon>
							</th>
						</tr>
						<tr v-else-if="tableData.data.length == 0">
							<th colspan="5" style="text-align: center">
								데이터가 없습니다
							</th>
						</tr>
						<tr
							v-else
							v-for="(data, index) in tableData.data"
							:key="index"
						>
							<th scope="row" class="tc">
								{{ index + tableData.start + 1 }}
							</th>
							<td class="fw-bold">{{ data.title }}</td>
							<td class="tc">{{data.respondentCount}}</td>
							<td class="tc">{{ data.createAt }}</td>
							<td class="tc">{{ data.createBy }}</td>
							<td class="tc">
								<button
									type="button"
									data-bs-toggle="modal"
									data-bs-target="#modalSurvey"
									class="btn-h32 btn-outline"
									style="margin-right: 3%"
									@click="getSurveyById(data.id, 'loadModal'); commonVariables.isCreate = false"
								>
									수정
								</button>
								<button
									type="button"
									data-bs-toggle="modal"
									data-bs-target="#modalSurveyRespondent"
									class="btn-h32 btn-outline"
									style="margin-right: 3%"
									@click="showSurveyRespondent(data.id);"
								>
									참여자 등록
								</button>
								<button
									type="button"
									class="btn-h32 btn-outline-red"
									style="margin-right: 3%;"
									@click="deleteSurvey(data.id, data.title)"
								>
									삭제
								</button>

							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td colspan="6">
								<a
									data-bs-toggle="modal"
									data-bs-target="#modalSurvey"
									class="btn-h40 btn-secondary"
									@click="commonVariables.showModal = true; commonVariables.isCreate = true"
									>등록</a
								>
							</td>
						</tr>
					</tfoot>
				</table>
			</form>
			<div class="pagination justify-content-center">
				<li @click="handlePageChange(1)" v-if="search.pageNumber > 1">
					<i class="arrow-page">first_page</i>
				</li>
				<li
					@click="handlePageChange(search.pageNumber - 1)"
					v-if="search.pageNumber > 1"
				>
					<i class="arrow-page">chevron_left</i>
				</li>
				<el-pagination
					class="elpagination"
					layout="pager"
					:total="tableData.recordsTotal"
					:current-page="search.pageNumber"
					@current-change="handlePageChange"
				/>
				<li
					@click="handlePageChange(search.pageNumber + 1)"
					v-if="search.pageNumber < tableData.lastPage"
				>
					<i class="arrow-page">chevron_right</i>
				</li>
				<li
					@click="handlePageChange(tableData.lastPage)"
					v-if="search.pageNumber < tableData.lastPage"
				>
					<i class="arrow-page">last_page</i>
				</li>
			</div>
			<!--//pagination-->
		</div>
		<!--//layout-content-->
		<!-- Modal -->
		<div
			class="modal fade modal-survey"
			id="modalSurvey"
			tabindex="-1"
			aria-hidden="true"
			data-bs-backdrop="static" data-bs-keyboard="false"
		>
			<div class="modal-dialog modal-xl">
				<div class="modal-content">
					<div class="modal-header">
						<h5 v-if="commonVariables.isCreate" class="modal-title">설문조사 등록</h5>
						<h5 v-else class="modal-title">설문조사 수정</h5>
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
							id="modalSurveyClose"
							@click="handleCloseModal"
						>
							close
						</button>
					</div>
					<template v-if="commonVariables.showModal">
						<div class="modal-body">
							<form>
								<div class="form-filter">
									<dl class="filter-item">
										<dt>설문 제목</dt>
										<dd>
											<input type="text" class="width-100" id="survey_title" v-model="commonVariables.surveyTitle" />
										</dd>
									</dl>
									<dl class="filter-item">
										<dt>기간</dt>
										<dd>
											<input
												type="date"
												id="survey_startDate"
												v-model="commonVariables.surveyStartDate"
											/>
											<span>&dash;</span>
											<input
												type="date"
												id="survey_endDate"
												v-model="commonVariables.surveyEndDate"
											/>
										</dd>
									</dl>
									<dl class="filter-item">
										<dt>설문 내용</dt>
										<dd>
											<textarea
												class="width-100"
												style="height: 120px"
												id="survey_description"
												v-model="commonVariables.surveyDescription"
											></textarea>
										</dd>
									</dl>
									<template v-if="commonVariables.isCreate">
										<dl class="filter-item">
											<dt>질문 불러오기</dt>
											<dd>
												<select @change="selectedSurvey" v-model="commonVariables.surveyId">
													<option disabled selected value="">
														선택
													</option>
													<option v-for="survey in allSurvey.data" :key="'survey_' + survey.id" :value="survey.id">
														{{ survey.title }}
													</option>
												</select>
											</dd>
										</dl>
									</template>
									<dl class="filter-item">
										<dt>질문</dt>
										<dd>
											<div class="btn-group">
												<button type="button" class="btn-h32 btn-primary" style="margin-right: 1%" @click="addQuestion('객관식 질문')">
													<i class="material-icons-outlined">add</i>객관식 질문
												</button>
												<button type="button" class="btn-h32 btn-secondary" @click="addQuestion('주관식 질문')">
													<i class="material-icons-outlined">add</i>주관식 질문
												</button>
											</div>
											<template v-if="commonVariables.surveyId != '' && commonVariables.showSurveys">
												<div class="form-survey">
													<div style="margin-top: 2%" class="wrap" :id="'questionWrap_' + questionIndex" v-for="(question, questionIndex) in surveyDetails.surveyQuestions" :key="question.question + '_' + questionIndex">
														<!--객관식 질문-->
														<div class="form-item">
															<div class="question-item" :id="'questionDiv_' +  questionIndex">
																<button type="button" class="material-icons-outlined text-red " :id="'removeQuestion_' + questionIndex" @click="removeQuestion(questionIndex)">close</button>
															</div>
															<template v-if="question.surveyQuestionAnswers.length > 0">
																<select :id="'singleAnswerFlag_' + questionIndex" :value="question.singleAnswerFlag">
																	<option value="false">중복 답변</option>
																	<option value="true">단일 답변</option>
																</select>
																<input type="text" placeholder="질문 입력" :value="question.question" :id="'question_' + questionIndex"/>
																<div class="form-answer">
																	<div :id="'questionAnswer_' + questionIndex">
																		<template v-for="(answer, answerIndex) in question.surveyQuestionAnswers" :key="answer + '_' + answerIndex">				
																			<div class="answer-item" style="margin-top: 1%" :id="'answerDiv_' + answer.id">
																				<div :id="'answer_' + questionIndex + '_' + answer.id">
																					<input type="text" placeholder="답변 입력" :value="answer.answer" :id="'answer_' + answer.id"/>
																				</div>
																				<button type="button" class="material-icons-outlined text-red " :id="'remove_' + answer.id" @click="removeAnswer(answer.id, questionIndex)">close</button>
																			</div> 
																		</template>
																	</div>
																	<button type="button" class="btn-h32 btn-outline" @click="addAnswer(questionIndex)">
																		<i class="material-icons-outlined">add</i>답변
																	</button>
																</div>
															</template>
															<template v-else>
																<input type="text" style="width: 97%" placeholder="질문 입력" :value="question.question" :id="'question_' + questionIndex"/>
															</template>
														</div>
													</div>
													<!--//wrap-->
												</div>
											</template>
											<template v-else-if="commonVariables.surveyId != '' && !commonVariables.showSurveys">
												<div align="center">
													<el-icon class="is-loading loading-size"><loading /></el-icon>
												</div>
											</template>
											<template v-else>
												<div class="form-survey">
													<div class="wrap" id="questionWrap_0">
														<!--객관식 질문-->
														<div class="form-item">
															<div class="question-item" hidden id="questionDiv_0">
																<button type="button" class="material-icons-outlined text-red " id="removeQuestion_0">close</button>
															</div>
															<select id="singleAnswerFlag_0">
																<option value="false">중복 답변</option>
																<option value="true">단일 답변</option>
															</select>
															<input type="text" placeholder="질문 입력" id="question_0"/>
															<div class="form-answer">
																<div id="questionAnswer_0">
																	<div class="answer-item" id="answerDiv_0">
																		<input type="text" placeholder="답변 입력" id="answer_0_0"/>
																		<button type="button" hidden class="material-icons-outlined text-red " id="remove_0" @click="removeAnswer(0,0)">close</button>
																	</div>
																</div>
																<button type="button" class="btn-h32 btn-outline" @click="addAnswer(0)">
																	<i class="material-icons-outlined">add</i>답변
																</button>
															</div>
														</div>
													</div>
												</div>
											</template>
											<!--//form-survey-->
										</dd>
									</dl>
								</div>
								<!--//form-filter-->
							</form>
						</div>
					</template>
					<template v-else>
						<div align="center">
							<el-icon class="is-loading loading-size"><loading /></el-icon>
						</div>
					</template>
					<!--//modal-body-->
					<div class="modal-footer">
						<button
							v-if="commonVariables.isCreate"
							type="submit"
							class="btn-h40 btn-primary"
							@click="createSurvey"
						>
							등록
						</button>
						<button
							v-else
							type="submit"
							class="btn-h40 btn-primary"
							@click="updateSurvey"
						>
							등록
						</button>
					</div>
				</div>
			</div>
		</div>
		<!--//modal-->
		<!-- Modal for inputting survey respondent using excel file -->
		<div
			class="modal fade modal-survey"
			id="modalSurveyRespondent"
			tabindex="-1"
			aria-hidden="true"
			data-bs-backdrop="static" data-bs-keyboard="false"
		>
			<div class="modal-dialog modal-xl">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">설문조사 참여자 등록</h5>
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
							id="modalSurveyRespondentClose"
							@click="hideSurveyRespondent"
						>
							close
						</button>
					</div>
					<div class="modal-body">
						<form ref="surveyRespondentForm">
							<div class="form-filter">
								<dl class="filter-item">
									<dt>참여자 설문 파일</dt>
									<dd>
										<input type="file" ref="surveyRespondentFile" style="margin-right:10px;" accept=".xls,.xlsx" />
										<button type="button" 
											class="btn-h36 btn-primary"
											style="border-radius: 4px;"
											@click="createSurveyRespondent">
											등록
										</button>
									</dd>
								</dl>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<!--// modal for inputting survey respondent using excel file -->
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, onUnmounted, reactive, ref } from "@vue/runtime-core";
	import { Loading } from "@element-plus/icons";
	import { ElMessageBox, ElMessage } from 'element-plus'
	import $ from 'jquery';
	import moment from "moment";
	import SurveyService from "@/services/survey/SurveyService";

	export default defineComponent({
		components: {
			loading: Loading,
		},
		setup() {
			let periods = [
				{ id: "periodYesterday", value: "yesterday", name: "어제" },
				{ id: "periodWeek", value: "1week", name: "1주일" },
				{ id: "periodOne", value: 1, name: "1개월" },
				{ id: "periodThree", value: 3, name: "3개월" },
				{ id: "periodCustom", value: "custom", name: "사용자 설정" },
			];

			let commonVariables = ref({
				isCreate: true,
				showModal: false,
				showSurveys: false,
				disabledDate: true,
				period: "yesterday",
				surveyId: "",
				surveyTitle: '',
				surveyStartDate: moment().day(8).format('YYYY-MM-DD'),
				surveyEndDate: moment().day(8).add(1, 'months').format('YYYY-MM-DD'),
				surveyDescription: '',
				answerType: ["CHOICE"] as any,
			});

			let search = reactive({
				pageNumber: 1,
				isPaging: true,
				title: "",
				startDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
				endDate: moment().format("YYYY-MM-DD"),
			});

			let tableData = ref({
				data: [] as any,
				recordsTotal: 0,
				lastPage: 1,
				start: 0,
				length: 10,
				showTableData: true,
			});

			let allSurvey = ref({
				pageNumber: 1,
				isPaging: false,
				data: [] as any,
				title: "",
				startDate: null,
				endDate: null,
			});

			let surveyDetails = ref({
				surveyQuestions: [] as any,
				question: "",
				answerType: "",
				surveyAnswers: [] as any,
			});

			let questionCount = 0;
			let answerCount = 0;

			let surveyRespondent = reactive({
				surveyId: -1
			});

			const surveyRespondentFile = ref();
			const surveyRespondentForm = ref();

			function changePeriod(period: any) {
				if (period == "custom") {
					commonVariables.value.disabledDate = false;
				} else if (period == "yesterday") {
					commonVariables.value.disabledDate = true;
					search.endDate = moment()
						.subtract(1, "day")
						.format("YYYY-MM-DD");
					search.startDate = moment()
						.subtract(1, "day")
						.format("YYYY-MM-DD");
				} else if (period == "1week") {
					commonVariables.value.disabledDate = true;
					search.endDate = moment().format("YYYY-MM-DD");
					search.startDate = moment(search.endDate)
						.subtract(1, "week")
						.format("YYYY-MM-DD");
				} else {
					commonVariables.value.disabledDate = true;
					search.endDate = moment().format("YYYY-MM-DD");
					search.startDate = moment(search.endDate)
						.subtract(period, "month")
						.format("YYYY-MM-DD");
				}
				console.log(search.startDate);
			}

			function searchSurvey() {
				tableData.value.showTableData = false;
				SurveyService.findAllSurvey(search).then((res) => {
					tableData.value.data = res.data;
					tableData.value.start = (search.pageNumber - 1) * tableData.value.length;
					tableData.value.recordsTotal = res.recordsTotal;
					tableData.value.lastPage = Math.ceil(res.recordsTotal / tableData.value.length);
					tableData.value.showTableData = true;
				});
			}

			function handlePageChange(newPageNumber: number) {
				search.pageNumber = newPageNumber;
				tableData.value.showTableData = false;
				searchSurvey();
			}

			function resetForm() {
				search.pageNumber = 1;
				search.isPaging = true;
				search.title = "";
				search.startDate = moment().subtract(1, "day").format("YYYY-MM-DD");
				search.endDate = moment().format("YYYY-MM-DD");
				commonVariables.value.period = "yesterday";
				searchSurvey();
			}

			function getAllSurvey() {
				SurveyService.findAllSurvey(allSurvey).then((res) => {
					allSurvey.value.data = res.data;
				});
			}

			function getSurveyById(surveyId:any, from:string) {
				commonVariables.value.answerType = [];
				commonVariables.value.surveyId = surveyId;
				if(from == 'loadModal') {
					commonVariables.value.showModal = false;
				}
				else if(from == 'loadSurvey') {
					commonVariables.value.showSurveys = false;
				}
				
				
				SurveyService.findSurveyById(surveyId).then(res => {
						commonVariables.value.surveyStartDate = moment(res.startAt.trim()).format("YYYY-MM-DD");
						commonVariables.value.surveyEndDate = moment(res.endAt.trim()).format("YYYY-MM-DD");

						res.surveySections.forEach((section:any) => {
							commonVariables.value.surveyTitle = section.title;
							commonVariables.value.surveyDescription = section.description;
							surveyDetails.value.surveyQuestions = section.surveyQuestions;
							section.surveyQuestions.forEach((question:any) => {
								questionCount++;
								commonVariables.value.answerType.push(question.answerType);
								surveyDetails.value.question = question.question;
								surveyDetails.value.answerType = question.answerType;
								surveyDetails.value.surveyAnswers = question.surveyQuestionAnswers;
								surveyDetails.value.surveyAnswers.forEach(() => {
									answerCount++;
								});
							});
					});
					commonVariables.value.showModal = true;
					commonVariables.value.showSurveys = true;
				})
			}

			function selectedSurvey() {
				ElMessageBox.confirm(
					'현재 입력된 질문을 삭제한 후 기존 설문의 질문을 읽어 옵니다. 계속하시겠습니까?',
					'Warning',
					{
						confirmButtonText: 'OK',
						cancelButtonText: 'Cancel',
						type: 'warning',
					}
				)
				.then(() => {
					getSurveyById(commonVariables.value.surveyId, 'loadSurvey');
				})
				.catch(() => {
					commonVariables.value.surveyId = '';
				}) 
			}

			function addQuestion(questionType:string) {
				
				questionCount++;
				answerCount++;
				let htmlStr = '';
				htmlStr += '<div class="wrap" id="questionWrap_' + questionCount + '" style="margin-top: 2%">';
				htmlStr += '<div class="form-item">';
				htmlStr += '<div class="question-item" id="questionDiv_' + questionCount + '">';
				htmlStr += '<button type="button" class="material-icons-outlined text-red " id="removeQuestion_' + questionCount + '">close</button>';
				htmlStr += '</div>'
				if(questionType == '객관식 질문') {
					commonVariables.value.answerType.push("CHOICE");
					htmlStr += '<select id="singleAnswerFlag_' + questionCount + '">';
					htmlStr += '<option value="false">중복 답변</option><option value="true">단일 답변</option>';
					htmlStr += '</select>';
					htmlStr += '<input type="text" placeholder="질문 입력" id="question_' + questionCount + '"/>';
					htmlStr += '<div class="form-answer">';
					htmlStr += '<div id="questionAnswer_' + questionCount + '">';
					htmlStr += '<div class="answer-item" style="margin-top: 1%" id="answerDiv_' + answerCount + '">';
					htmlStr += '<input type="text" placeholder="답변 입력" id="answer_' + answerCount + '"/>';
					htmlStr += '<button type="button" hidden class="material-icons-outlined text-red " id="remove_'+ answerCount +'">close</button>';
					htmlStr += '</div>';
					htmlStr += '</div>';
					htmlStr += '<button type="button" class="btn-h32 btn-outline" id="add_'+ questionCount +'_' + answerCount + '">';
					htmlStr += '<i class="material-icons-outlined">add</i>답변';
					htmlStr += '</button>';
					htmlStr += '</div>';
				}
				else {
					commonVariables.value.answerType.push("TEXT");
					htmlStr += '<input style="width: 97%" type="text" placeholder="질문 입력" id="question_' + questionCount + '"/>';
				}

				htmlStr += '</div>';

				$(".form-survey").append(htmlStr);

				if($(".form-survey div[id^=questionWrap_]").length > 1) {
					$(".form-survey div[id^=questionDiv_]").first().removeAttr("hidden");
				}
				
				$("button[id^=add_]").each(function() {
					let currQuestionCount = $(this).attr("id")?.split('_')[1];
					$(this).off().on({
						click: function() {
							addAnswer(Number(currQuestionCount));
						}
					});
				});

				$("button[id^=removeQuestion_]").each(function() {
					let currentId = $(this).attr("id")?.split('_')[1];
					$(this).off().on({
						click: function() {
							removeQuestion(currentId);
						}
					})
				});
			}

			function removeQuestion(currentQuestion:any) {
				ElMessageBox.confirm(
					'질문을 삭제하시겠습니까?',
					'Warning',
					{
						confirmButtonText: 'OK',
						cancelButtonText: 'Cancel',
						type: 'warning',
					}
				)
				.then(() => {
					$("#questionWrap_" +currentQuestion).remove();
					if($(".form-survey div[id^=questionWrap_]").length < 2) {
						$(".form-survey div[id^=questionDiv_]").first().attr("hidden", "hidden");
					}
				});
			}

			function addAnswer(currQuestionCount:number) {
				answerCount++;
				let htmlStr = '';
				htmlStr += '<div class="answer-item" style="margin-top: 1%" id="answerDiv_' + answerCount + '">';
				htmlStr += '<input type="text" placeholder="답변 입력" id="answer_' + answerCount + '"/>';
				htmlStr += '<button type="button" class="material-icons-outlined text-red " id="remove_' + answerCount +'">close</button>';
				htmlStr += '</div>';
				$("#questionAnswer_" + currQuestionCount).append(htmlStr);

				if($("#questionAnswer_" + currQuestionCount + " input[id^=answer_]").length > 1) {
					$("#questionAnswer_" + currQuestionCount + " button[id^=remove_]").first().removeAttr("hidden");
				}

				$("button[id^=remove_]").each(function() {
					let currentId = $(this).attr("id")?.split('_')[1];
					$(this).off().on({
						click: function() {
							removeAnswer(currentId, currQuestionCount);
						}
					})
				});
			}

			function removeAnswer(currentId:any, currQuestionCount:any) {
				ElMessageBox.confirm(
					'답변을 삭제하시겠습니까?',
					'Warning',
					{
						confirmButtonText: 'OK',
						cancelButtonText: 'Cancel',
						type: 'warning',
					}
				)
				.then(() => {
					$("#answerDiv_" +currentId).remove();
					if($("#questionAnswer_" + currQuestionCount + " input[id^=answer_]").length < 2) {
						$("#questionAnswer_" + currQuestionCount + " button[id^=remove_]").first().attr("hidden", "hidden");
					}
				});
			}

			function createSurvey() {
				if(commonVariables.value.surveyEndDate < commonVariables.value.surveyStartDate) {
					ElMessageBox.alert(
						'End date must be same as start date or after',
						'Warning',
						{
							confirmButtonText: 'OK',
						}
					);
				}
				else {
					let createDto = {
						startAt:  commonVariables.value.surveyStartDate,
						endAt: commonVariables.value.surveyEndDate,
						surveySections: [ 
							{
								title: commonVariables.value.surveyTitle,
								description: commonVariables.value.surveyDescription,
								file: null,
								surveyQuestions: [] as any
							}
						]
					}

					$("[id^=question_]").each(function(questionIndex) {
						
						let currQuestionCount = $(this).attr("id")?.split("_")[1];
						let surveyQuestions = {
							question: $(this).val(),
							answerType: commonVariables.value.answerType[questionIndex],
							singleAnswerFlag: $("#singleAnswerFlag_"+currQuestionCount).val(),
							surveyQuestionAnswers: [] as any
						}
						$("#questionAnswer_" + currQuestionCount + " input[id^=answer_]").each(function(answerIndex) {
							let surveyQuestionAnswers = {
								answer: $(this).val(),
								displayOrder: answerIndex+1,
							}
							surveyQuestions.surveyQuestionAnswers.push(surveyQuestionAnswers);
						});

						createDto.surveySections[0].surveyQuestions.push(surveyQuestions);
					});

					SurveyService.createSurvey(createDto).then(res=> {
						if(res == '') {
							ElMessage({
								message: '저장하였습니다.',
								type: 'success',
							});
							handleCloseModal();
							searchSurvey();
							getAllSurvey();
						}
					})
				}
			}

			function updateSurvey() {
				if(commonVariables.value.surveyEndDate < commonVariables.value.surveyStartDate) {
					ElMessageBox.alert(
						'종료일은 시작일 이후 이어야 합니다.',
						'확인',
						{
							confirmButtonText: 'OK',
						}
					);
				}
				else {
					let updateDto = {
						id: commonVariables.value.surveyId,
						startAt:  commonVariables.value.surveyStartDate,
						endAt: commonVariables.value.surveyEndDate,
						surveySections: [ 
							{
								title: commonVariables.value.surveyTitle,
								description: commonVariables.value.surveyDescription,
								file: null,
								surveyQuestions: [] as any
							}
						]
					}

					$("[id^=question_]").each(function(questionIndex) {
						
						let currQuestionCount = $(this).attr("id")?.split("_")[1];
						let surveyQuestions = {
							question: $(this).val(),
							answerType: commonVariables.value.answerType[questionIndex],
							singleAnswerFlag: $("#singleAnswerFlag_"+currQuestionCount).val(),
							surveyQuestionAnswers: [] as any
						}
						$("#questionAnswer_" + currQuestionCount + " input[id^=answer_]").each(function(answerIndex) {
							let surveyQuestionAnswers = {
								answer: $(this).val(),
								displayOrder: answerIndex+1,
							}
							surveyQuestions.surveyQuestionAnswers.push(surveyQuestionAnswers);
						});

						updateDto.surveySections[0].surveyQuestions.push(surveyQuestions);
					});

					SurveyService.updateSurvey(updateDto).then(res=> {
						if(res == '') {
							ElMessage({
								message: '저장하였습니다.',
								type: 'success',
							});
							handleCloseModal();
							searchSurvey();
							getAllSurvey();
						}
					})
				}
			}

			function deleteSurvey(id:number, title:string) {
				ElMessageBox.confirm(
					'정말로 삭제하시겠습니까? (' + title + ')',
					'확인',
					{
						confirmButtonText: 'OK',
						cancelButtonText: 'Cancel',
						type: 'warning',
					}
				)
				.then(() => {
					tableData.value.showTableData = false;
					SurveyService.deleteSurvey(id).then(res => {
						if(res == '') {
							ElMessage({
								message: '삭제하였습니다.',
								type: 'success',
							});
							searchSurvey();
							getAllSurvey();
						}
					});
				})
				.catch(() => {
					// commonVariables.value.surveyId = '';
				}) 
			}

			function handleCloseModal() {
				let htmlStr = '';
                document.getElementById("modalSurveyClose")?.click();

				commonVariables.value.surveyId = "";
				commonVariables.value.surveyTitle = '';
				commonVariables.value.surveyStartDate = moment().day(8).format('YYYY-MM-DD');
				commonVariables.value.surveyEndDate = moment().day(8).add(1, 'months').format('YYYY-MM-DD');
				commonVariables.value.surveyDescription = '';

                $(".form-survey").empty();

				htmlStr += '<div class="wrap" id="questionWrap_0">';
				htmlStr += '<div class="form-item">';
				htmlStr += '<div class="question-item" id="questionDiv_0" hidden>';
				htmlStr += '<button type="button" class="material-icons-outlined text-red " id="removeQuestion_0" @click="removeQuestion(0)">close</button>';
				htmlStr += '</div>'
				htmlStr += '<select id="singleAnswerFlag_0">';
				htmlStr += '<option value="false">중복 답변</option><option value="true">단일 답변</option>';
				htmlStr += '</select>';
				htmlStr += '<input type="text" placeholder="질문 입력" id="question_0"/>';
				htmlStr += '<div class="form-answer">';
				htmlStr += '<div id="questionAnswer_0">';
				htmlStr += '<div class="answer-item" style="margin-top: 1%" id="answerDiv_0">';
				htmlStr += '<input type="text" placeholder="답변 입력" id="answer_0_0"/>';
				htmlStr += '<button type="button" hidden class="material-icons-outlined text-red " id="remove_0" @click="removeAnswer(0,0)">close</button>';
				htmlStr += '</div>';
				htmlStr += '</div>';
				htmlStr += '<button type="button" class="btn-h32 btn-outline" id="addBtn_0" @click="addAnswer(0)">';
				htmlStr += '<i class="material-icons-outlined">add</i>답변';
				htmlStr += '</button>';
				htmlStr += '</div>';
				htmlStr += '</div>';
				htmlStr += '</div>';

				$(".form-survey").append(htmlStr);

				$("#addBtn_0").on({
					click: function() {
						addAnswer(0);
					}
				});
            }

			function showSurveyRespondent(surveyId:number) {
				surveyRespondent.surveyId = surveyId;

			}
			function hideSurveyRespondent() {
				surveyRespondentForm.value.reset();
				surveyRespondent.surveyId = -1;
				console.log("closing survey respondent----");
			}

			function createSurveyRespondent() {
				if (surveyRespondent.surveyId < 1)
					return;

				if (surveyRespondentFile.value.files.length < 1) {
					ElMessage.error("파일을 선택하세요");
					return;
				}
				
				const formData = new FormData();
				formData.append("surveyRespondentFile", surveyRespondentFile.value.files[0]);
				
				ElMessageBox.confirm(
					'기존 사용자 정보를 삭제한 후 입력합니다. 계속 하시겠습니까?',
					'확인',
					{
						confirmButtonText: 'OK',
						cancelButtonText: 'Cancel',
						type: 'warning',
					}
				)
				.then(() => {
					SurveyService.createSurveyRespondent(surveyRespondent.surveyId, formData)
					.then((response)=> {
						ElMessage({
							showClose: true,
							duration: 10000,
							dangerouslyUseHTMLString: true,
							message: `총 사용자수 : ${response.totalCount}`
							+ `<br /><br />생성 건수: ${response.createCount}`
							+ (response.skipUserIds === '' ? '' : `<br /><br />취소 아이디: ${response.skipUserIds } `),
							type: 'success'
						});
						document.getElementById("modalSurveyRespondentClose")?.click();
						searchSurvey();					
					});
				});
			}


			onMounted(() => {
				searchSurvey();
				getAllSurvey();
			});

			onUnmounted(() => {
				ElMessage.closeAll();
			});

			return {
				moment,
				commonVariables,
				periods,
				search,
				tableData,
				allSurvey,
				surveyDetails,
				changePeriod,
				searchSurvey,
				handlePageChange,
				resetForm,
				getSurveyById,
				selectedSurvey,
				addAnswer,
				removeAnswer,
				addQuestion,
				removeQuestion,
				createSurvey,
				updateSurvey,
				deleteSurvey,
				handleCloseModal,
				surveyRespondent,
				surveyRespondentForm,
				surveyRespondentFile,
				showSurveyRespondent,
				hideSurveyRespondent,
				createSurveyRespondent
			};
		},
	});
</script>


<style scoped>
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1055;
		display: none;
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		text-align: center;
		outline: 0;
	}

	.modal-dialog {
		display: inline-block;
		position: relative;
		width: auto;
		max-width: 100%;
		margin: 0.5rem;
		pointer-events: none;
	}

	.modal-content {
		position: relative;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		flex-direction: column;
		width: 100%;
		padding: 40px 40px 52px;
		pointer-events: auto;
		background-color: #fff;
		background-clip: padding-box;
		border: 1px solid none;
		outline: 0;
	}

	
</style>

