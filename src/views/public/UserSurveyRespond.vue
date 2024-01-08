<template>
    <div class="user-survey" v-if="errorMsg == undefined || errorMsg == ''">
        <template v-if="showSurvey">
            <div class="survey-header">
                <h5 class="survey-title">{{ surveyDetails.surveyTitle }}</h5>
            </div>
            <form @submit.prevent>
                <div class="survey-body">
                    <p>{{ surveyDetails.surveyDescription }}</p>
                    <ul class="survey-list">
                        <li class="survey-item" v-for="(question, questionIndex) in surveyDetails.surveyQuestions" :key="'question_' + question.id">
                            <span>{{ questionIndex + 1 }}</span>
                            <div class="survey-item-content">
                                <h6 class="survey-item-header">{{ question.question }}</h6>
                                <template v-if="question.answerType != 'TEXT'">
                                    <ul class="survey-item-body" v-if="question.singleAnswerFlag">
                                        <li v-for="(answer) in question.surveyQuestionAnswers" :key="'answer_' + answer.id">
                                            <input type="radio" :id="'radioAnswerItem_' + answer.id" :name="'answerName_' + question.id" @click="getAnswerValue(questionIndex+1, answer.id, question.id, question.singleAnswerFlag, question.answerType)">
                                            <label :for="'radioAnswerItem_' + answer.id">{{ answer.answer }}</label>
                                        </li>
                                    </ul>
                                    <ul class="survey-item-body" v-else-if="!question.singleAnswerFlag" :id="'answerGroup_' + question.id">
                                        <li v-for="(answer) in question.surveyQuestionAnswers" :key="'answer_' + answer.id">
                                            <input type="checkbox" :id="'checkBoxAnswerItem_' + answer.id" @change="getAnswerValue(questionIndex+1, answer.id, question.id, question.singleAnswerFlag, question.answerType)">
                                            <label :for="'checkBoxAnswerItem_' + answer.id">{{ answer.answer }}</label>
                                        </li>
                                    </ul>
                                </template>
                                <template v-else>
                                    <textarea class="survey-item-body" rows="5" @input="getAnswerValue(questionIndex+1, $event.target.value, question.id, question.singleAnswerFlag, question.answerType)"></textarea>
                                </template>
                            </div>
                        </li>
                    </ul>
                </div><!--//survey-body-->
                <div class="survey-footer">
                    <!-- <div class="survey-pagination">
                        <a href="#" class="">이전</a>
                        <a href="#" class="active">다음</a>
                    </div> -->
                    <button type="submit" class="survey-submit" id="submitBtn">제출</button><!--클릭 가능한 상태에만 active 클래스를 추가해 주세요.-->
                </div>
            </form>
        </template>
        <template v-else>
            <div align="center">
                <el-icon class="is-loading loading-size"><loading /></el-icon>
            </div>
        </template>
    </div><!--//user-survey-->
    <div class="user-survey" style="margin-top: 15%" v-else>
        <div class="survey-header">
            <h5 class="survey-title">{{ errorMsg }}</h5>
        </div>
    </div><!--//user-survey-->
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/runtime-core'
import '@/assets/css/user-survey.css';
import $ from 'jquery';
import { Loading } from "@element-plus/icons";
import SurveyService from '@/services/survey/SurveyService'; 
import { useRoute } from 'vue-router';
import router from "@/router";
import { ElMessage } from 'element-plus';

export default defineComponent({
    components: {
		loading: Loading,
	},
    setup() {
		const route = useRoute();
		console.log("route.query:", route.query);
		const token = route.query.token;

		console.log('token: ', token);
		
        let showSurvey = ref(false);

        let errorMsg = ref();

        let questionIndex = ref([] as any);

        let userAnswerList = ref([] as any);

        let surveyDetails = ref({
            surveyTitle: '',
            surveyDescription: '',
			surveyQuestions: [] as any,
			question: "",
			answerType: "",
			surveyAnswers: [] as any,
		});


        function getSurvey() {
			SurveyService.findByIdForPublic(token).then((res:any) => {
                console.log("res ", res);
                if(res.data != undefined) {
                    res.data.surveySections.forEach((section:any) => {
                        surveyDetails.value.surveyTitle = section.title;
                        surveyDetails.value.surveyDescription = section.description;
                        surveyDetails.value.surveyQuestions = section.surveyQuestions;
                        section.surveyQuestions.forEach((question:any, index:any) => {
                            questionIndex._value.push(index+1);
                            surveyDetails.value.surveyAnswers = question.surveyQuestionAnswers;
                        });
                    });
                }
                else {
                    errorMsg.value = res.message;
                }
                showSurvey.value = true;
			});
        }

        function getAnswerValue(index:any, response:any, questionId:any, singleAnswerFlag:any, answerType:any) {
            let isExists = false;
            let answer = {
                questionId: '',
                response: ''
            };
            answer.questionId = questionId;
            answer.response = response;
            
            if(answerType == 'CHOICE') {
                if(singleAnswerFlag) {
                    for(let i = 0; i < userAnswerList.value.length; i++) {
                        if(userAnswerList.value[i].questionId == answer.questionId) {
                            isExists = true;
                            userAnswerList.value[i].response = response;
                            validateSubmitBtn();
                            return;
                        }
                        else {
                            isExists = false;
                        }
                    }
                }
                else if(!singleAnswerFlag) {
                    for(let i = 0; i < userAnswerList.value.length; i++) {
                        if(userAnswerList.value[i].response == answer.response) {
                            userAnswerList.value = userAnswerList.value.filter((obj:any) => {
                                return obj.response != answer.response;
                            });
                            isExists = true;
                            // --- when unchecked all checkboxes ----
                            if($("#answerGroup_" + questionId + " [id^=checkBoxAnswerItem_]:checked").length <= 0) {
                                questionIndex._value.push(index);
                            }

                            validateSubmitBtn();
                            return;
                        }
                        else {
                            isExists = false;
                        }
                    }
                }
            }
            else if(answerType == 'TEXT') {
                if(response == '') {
                    questionIndex._value.push(index);
                    validateSubmitBtn();
                    return;
                }
                else {
                    for(let i = 0; i < userAnswerList.value.length; i++) {
                        if(userAnswerList.value[i].questionId == answer.questionId) { 
                            isExists = true;
                            userAnswerList.value[i].response = response;
                            const element = questionIndex._value.findIndex((v:any) => {
                                return v === index;
                            });

                            if(element > -1) {
                                questionIndex._value.splice(element, 1);
                            }
                            validateSubmitBtn();
                            return;
                        }
                        else {
                            isExists = false;
                        }
                    }
                }
            }
            

            if(!isExists) {
                userAnswerList.value.push(answer);
                const element = questionIndex._value.findIndex((v:any) => {
                    return v === index;
                });

                if(element > -1) {
                    questionIndex._value.splice(element, 1);
                }
            }
            validateSubmitBtn();
            
        }

        function validateSubmitBtn() {
            if(questionIndex._value.length <= 0) {
                $("#submitBtn").addClass("active");
                $("#submitBtn").off().on({
                    click: function() {
                        submitSurvey();
                    }
				})
            }
            else {
                $("#submitBtn").removeClass("active");
            }
        }

        function submitSurvey() {
            
            let responses = {
                surveyResponses: [] as any
            };
            responses.surveyResponses = userAnswerList._value;
            console.log("aaaaaa ", responses);
            SurveyService.submitSurveyResponds(token, responses).then(res => {
                if(res != undefined) {
                    router.push({ name: 'SurveyRespondComplete' });
                }
            });
        }

        onMounted(() => {
            getSurvey();
        })

        onUnmounted(() => {
            ElMessage.closeAll();
        })

        return {
            showSurvey,
            errorMsg,
            surveyDetails,
			token,
            getAnswerValue
        }
    },
})
</script>


