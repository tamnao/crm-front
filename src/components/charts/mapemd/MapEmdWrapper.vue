<template>
	<!--div>
		<MapEmd :data="mapData" />
	</div-->
	<div :id="mapData.info.mapId" class="mapStyle" :style="'height: ' + mapData.info.mapHeight + ';'">
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive, onMounted } from "vue";
	import * as echarts from "echarts";
	import jejuMap from "@/assets/jeju_emd.json";
	//import MapEmd from "@/components/charts/mapemd/MapEmd.vue";
	import MapEmdGeneralProperties from "@/model/chart/MapEmdGeneralProperties";

	export default defineComponent({
		props: ["data"],
		components: {
		//	MapEmd,
		},
		setup(props) {
			let mapData = reactive(props.data);
				
			function drawMap() {

				let colors: any = [];
				let mapEmdProperties = reactive(new MapEmdGeneralProperties());

				mapEmdProperties.seriesMap = mapData.info.location;
				mapEmdProperties.seriesType = mapData.info.mapType;
				mapEmdProperties.seriesData = mapData.data;

				let maxRange = 0;
				let minRange = 0;
				for(let i = 0; i < mapData.data.length; i++) {
					if (mapData.data[i].value > maxRange)
						maxRange = mapData.data[i].value;
					if (i == 0)
						minRange = mapData.data[i].value;
					else if (mapData.data[i].value < minRange)
						minRange = mapData.data[i].value;
				}
				mapEmdProperties.maxRange = maxRange;
				mapEmdProperties.minRange = minRange;
				mapEmdProperties.mapTitle = mapData.info.title;
				mapEmdProperties.tooltipFormatter = mapData.info.tooltipFormatter;
				mapEmdProperties.postfix = mapData.info.postfix;

				if (mapData.info.minValueColor != null) {
					colors.push(mapData.info.minValueColor);
				} else {
					colors.push("#ffbb70");
				}

				if (mapData.info.midValueColor != null) {
					colors.push(mapData.info.midValueColor);
				} else {
					colors.push("#ffa23d");
				}

				if (mapData.info.maxValueColor != null) {
					colors.push(mapData.info.maxValueColor);
				} else {
					colors.push("#ff8400");
				}

				mapEmdProperties.rangeColor = colors;

				let map = document.getElementById(mapData.info.mapId);
				if (map) {
					let myMap = echarts.init(map);
					
					// echarts.registerMap(mapData.info.location, jejuMap);
					
					echarts.registerMap(mapData.info.location, jejuMap, {
						"제주시 추자면": {
							left: 126.165,
							top: 33.5024,
							width: 0.08,
						},
					});
					

					myMap.setOption(mapEmdProperties.mapOptions);
					window.addEventListener("resize", function() {
						myMap.resize();
					})

					if(mapData.info.clickHandler != undefined) {
						myMap.on('click', mapData.info.clickHandler);		
					}				
				}
			}

            onMounted(() => {
				drawMap();
			});

			return {
				mapData,
			}
		},
	});
</script>

<style scoped >
	.mapStyle {
		width: 100%;
		height: var(--height);
		/* float: left; */
		padding: 0;
		position: relative;
		background-color: #9dbad1;
	}
</style>