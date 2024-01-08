<template>
    <div align="center">
        <apexchart
			:width="chartOptions.chart.width"
            :height="chartOptions.chart.height"
			:options="chartOptions"
			:series="series"
		/>
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive } from "vue";
    export default defineComponent({
        props: ["columnInfo"],
        setup(props) {
            const series = reactive(props.columnInfo.series);
            const chartOptions = reactive(props.columnInfo.chartOptions.chartOptions);
            
            return {
                series,
                chartOptions
            }
        }
    })
</script>