<template>
    <div>
        <QuillEditor 
            theme="snow" 
            ref="myQuillEditor"
            contentType="html"
            v-model:content="content"
            :options="options" 
            :style="'height:' + height"
			@ready="init(quill)"
        />
    </div>
</template>

<script lang="ts">
    import { toRaw } from 'vue';
    import { defineComponent, reactive, ref } from '@vue/runtime-core';
    import { ElMessage } from 'element-plus'
    import quillService from '@/services/quill/QuillService';

    import { QuillEditor, Quill } from '@vueup/vue-quill';
    import '@vueup/vue-quill/dist/vue-quill.snow.css';
    import ImageUploader from 'quill-image-uploader';
    import BlotFormatter from 'quill-blot-formatter';
    Quill.register('modules/imageUploader', ImageUploader);
    Quill.register('modules/blotFormatter', BlotFormatter);

    export default defineComponent({
        components: {
            QuillEditor,
        },
        props: ['height'],
        setup() {
            let toolbarList = [
                ["bold", "italic", "underline", "strike"],
                ["blockquote", "code-block"],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ "list": "ordered"}, { "list": "bullet" }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ "indent": "-1"}, { "indent": "+1" }],
                [{ 'direction': 'rtl' }],
                [{ "size": ["small", false, "large", "huge"] }],        
                [{ "header": [1, 2, 3, 4, 5, 6, false] }],  
                [{ "color": [] }, { "background": [] }], 
                [{ "font": [] }],
                [{ "align": [] }],
                [ 'link', 'image'],
 //               ["clean"] 
            ]

            let content = ref("");
            let myQuillEditor = ref();

            const options = reactive({
                modules: {
                    toolbar: {
                        container: toolbarList,
                    },
                    imageUploader: {
                        upload: (file: Blob) => {
                            let fileSize = file.size / 1024 / 1024;
                            return new Promise((resolve, reject) => {
                                if((file.type.includes("jpeg") || file.type.includes("jpg") || file.type.includes("png") || file.type.includes("gif")) && fileSize < 1) {
                                    
                                    const formData = new FormData();
                                    formData.append("image", file);

                                    quillService.uploadImage(formData)
                                    .then(imageUrl => {
										resolve(imageUrl);
                                    })
                                    .catch(error => {
                                        reject("Upload failed");
                                    });
                                } else if(!file.type.includes("jpeg") && !file.type.includes("jpg") && !file.type.includes("png") && !file.type.includes("gif")) {
                                    reject("Upload failed");
                                    ElMessage({
                                        message: 'jpeg 또는 jpg 또는 png 또는 gif 파일 만 허용',
                                        type: 'error',
                                    });
                                } else if(fileSize > 1) {
                                    reject("Upload failed");
                                    ElMessage({
                                        message: '업로드 가능한 용량은 최대 1MB 입니다',
                                        type: 'error',
                                    });
                                }
                            });
                        }
                    },
                    blotFormatter: {}
                },
            });

			let init = (quill: Quill) => {
				document.querySelector(".ql-bold")?.setAttribute("title", "굵게");
				document.querySelector(".ql-italic")?.setAttribute("title", "이탤릭체");
				document.querySelector(".ql-underline")?.setAttribute("title", "밑줄");
				document.querySelector(".ql-strike")?.setAttribute("title", "취소선");
				document.querySelector(".ql-header[value='1']")?.setAttribute("title", "Heading 1");
				document.querySelector(".ql-header[value='2']")?.setAttribute("title", "Heading 2");
				document.querySelector(".ql-list[value='ordered']")?.setAttribute("title", "번호매기기");
				document.querySelector(".ql-list[value='bullet']")?.setAttribute("title", "글머리표");
				document.querySelector(".ql-script[value='sub']")?.setAttribute("title", "아래첨자");
				document.querySelector(".ql-script[value='super']")?.setAttribute("title", "위첨자");
				document.querySelector(".ql-indent[value='-1']")?.setAttribute("title", "내어쓰기");
				document.querySelector(".ql-indent[value='+1']")?.setAttribute("title", "들여쓰기");
				document.querySelector(".ql-direction")?.setAttribute("title", "방향");
				document.querySelector(".ql-size")?.setAttribute("title", "글자 크기");
				document.querySelector(".ql-header.ql-picker")?.setAttribute("title", "Heading");
				document.querySelector(".ql-color")?.setAttribute("title", "글자색");
				document.querySelector(".ql-background")?.setAttribute("title", "배경색");
				
				document.querySelector(".ql-font")?.setAttribute("title", "글꼴");
				document.querySelector(".ql-align")?.setAttribute("title", "정렬");
				document.querySelector(".ql-link")?.setAttribute("title", "링크 삽입");
				document.querySelector(".ql-image")?.setAttribute("title", "그림 삽입");
			}
				
            return {
                content,
                options,
                myQuillEditor,
				init,
            }
        }
    })

	
</script>

<style>
    
</style>