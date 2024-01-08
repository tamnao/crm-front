<template>
	<div align="center">
		<div id="mapData.chartInfo.mapId" class="mapStyle">
			<div class="text_info">데이터셋 선택 후 검색하세요.</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
	props: ["data"],
	setup(props) {
		const mapData = reactive(props.data);

		console.log(mapData);
	
		return {
			mapData,
		}
	},
})
</script>

<style scoped>
	.mapStyle {
		width: 100%;
		height: 100%;
		/* float: left; */
		padding: 0;
		position: relative;
		background-color: #9dbad1;
	}
</style>