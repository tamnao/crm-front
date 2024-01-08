<template>
	<div>
		<BasicPieChart :pieInfo="pieInfo" />
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive } from "vue";
    import { checkProperty } from '@/utils/ChartUtils';
	import BasicPieChart from "@/components/charts/pie/BasicPieChart.vue";
    import PieGeneralProperties from "@/model/chart/PieGeneralProperties";

	export default defineComponent({
		props: ["data", /*"commonAttributes"*/],
		components: {
			BasicPieChart,
		},
		setup(props) {
			let pieInfo = {
				series: [{}],
				chartOptions: {},
			};

            let pieGeneralProperties = reactive(new PieGeneralProperties());
            pieGeneralProperties.chartType = "pie";
            pieGeneralProperties.legendPosition = "right";

            checkProperty(pieGeneralProperties, props.data.chartInfo, "height");
            checkProperty(pieGeneralProperties, props.data.chartInfo, "width");
            checkProperty(pieGeneralProperties, props.data.chartInfo, "colors");
            checkProperty(pieGeneralProperties, props.data.chartInfo, "showLegend");

            function setData(data: any) {
                let labels = [] as any;
                let series = [] as any;
				data[0].data.forEach((element: any) => {
                    labels.push(element.x);
                    series.push(element.y);
				});
                pieGeneralProperties.chartLabels = labels;
                pieInfo.series = series;
			}

            setData(props.data.chartData);
            pieInfo.chartOptions = pieGeneralProperties;

			return {
				pieInfo,
			};
		},
	});
</script>
