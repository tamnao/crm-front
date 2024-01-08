<template>
	<div align="center">
		<apexchart
			:width="chartOptions.chartOptions.chart.width"
			:options="chartOptions.chartOptions"
			:series="series"
		/>
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive } from "vue";

	export default defineComponent({
		props: ["donutInfo"],
		setup(props) {

			const series = reactive(props.donutInfo.series);
			const chartOptions = reactive(props.donutInfo.chartOptions);

			return {
				series,
				chartOptions,
			};
		},
	});
</script>
