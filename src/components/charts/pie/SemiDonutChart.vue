<template>
    <div>
        <apexchart 
            :height="chartOptions.chart.height" 
            :width="chartOptions.chart.width" 
            :series="series" 
            :options="chartOptions" 
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive } from '@vue/runtime-core';

    export default defineComponent({
        props: ["semiDonutInfo"],
        setup(props) {
            let series = reactive(props.semiDonutInfo.series);
            let chartOptions = reactive(props.semiDonutInfo.chartOptions.chartOptions);

            return {
                series,
                chartOptions
            }
        }
    })
</script>

<style scoped>
    .vue-apexcharts {
        margin-bottom: -90px;
        margin-top: -25px;
    }
</style>