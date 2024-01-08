<template>
	<div>
		<GradientDonutChart class="donut" :donutInfo="donutInfo" />
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive } from "vue";
	import { checkProperty } from '@/utils/ChartUtils';
	import GradientDonutChart from "@/components/charts/pie/GradientDonutChart.vue";
	import DonutGeneralProperties from "@/model/chart/DonutGeneralProperties";

	export default defineComponent({
		props: ["data"],
		components: {
			GradientDonutChart,
		},
		setup(props) {
			let donutInfo = {
				series: [{}],
				chartOptions: {},
			};
			let donutGeneralProperties = reactive(new DonutGeneralProperties());
			let chartInfo = reactive(props.data.chartInfo);
			donutGeneralProperties.chartType = "donut";
			donutGeneralProperties.chartColors = chartInfo.colors;
			donutGeneralProperties.legendShow = chartInfo.showLegend;
			donutGeneralProperties.dataLabelsEnabled = chartInfo.showLabels;
			donutGeneralProperties.tooltipShow = chartInfo.showTooltip;
			
			checkProperty(donutGeneralProperties, chartInfo, "height");
            checkProperty(donutGeneralProperties, chartInfo, "width");

			function setData(data: any) {
				let labels:any = [];
				donutInfo.series = [];
				data[0].data.forEach((element: any) => {
					labels.push(element.x);
					donutInfo.series.push(element.y);
				});
				donutGeneralProperties.chartLabels = labels;
			}

			setData(props.data.chartData);
			donutInfo.chartOptions = donutGeneralProperties;

			return {
				donutInfo,
			};
		},
	});
</script>
