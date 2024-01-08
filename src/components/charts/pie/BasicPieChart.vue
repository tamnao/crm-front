<template>
	<div align="center">
		<apexchart
			class="pie"
            :height="chartOptions.chartOptions.chart.height"
			:width="chartOptions.chartOptions.chart.width"
			:options="chartOptions.chartOptions"
			:series="series"
		/>
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive } from "vue";

	export default defineComponent({
		props: ["pieInfo"],
		setup(props) {

			const series = reactive(props.pieInfo.series);
			const chartOptions = reactive(props.pieInfo.chartOptions);
			
			return {
				series,
				chartOptions,
			};
		},
	});
</script>

<style scoped>
	.pie >>> .apexcharts-legend-series {
		text-align: left;
	}
</style>
