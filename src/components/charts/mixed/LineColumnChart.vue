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
        props: ["lineColumnInfo"],
        setup(props) {
            let series = reactive(props.lineColumnInfo.series);
            let chartOptions = reactive(props.lineColumnInfo.chartOptions.chartOptions);

            return {
                series,
                chartOptions
            }
        }
    })
</script>

