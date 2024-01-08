<template>
    <div>
        <semi-donut-chart :semiDonutInfo="semiDonutInfo" v-if="data.chartInfo.chartType == 'SEMI_DONUT' " />
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive } from '@vue/runtime-core';
    import { checkProperty } from '@/utils/ChartUtils';
    import SemiDonutChart from '@/components/charts/pie/SemiDonutChart.vue'
    // import RadialBarGeneralProperties from '@/model/chart/RadialBarGeneralProperties';
    import DonutGeneralProperties from "@/model/chart/DonutGeneralProperties";

    export default defineComponent({
        components: {
            "semi-donut-chart" : SemiDonutChart
        },
        props: ["data"],
        setup(props) {
            let semiDonutInfo = {
                series: [] as any,
                chartOptions: {},
            };

            const donutGeneralProperties = reactive(new DonutGeneralProperties());
            donutGeneralProperties.chartType = "donut";

            donutGeneralProperties.plotOptionsPie = {
                startAngle: -90,
                endAngle: 90,
                offsetY: 10
            }



            // let radialBarGeneralProperties = reactive(new RadialBarGeneralProperties);
            let chartInfo = reactive(props.data.chartInfo);
            let chartData = reactive(props.data.chartData);

            let newLabels:any = [];
            let newSeries:any = [];
            for(let s of chartData) {
                newLabels.push(s.x);
                newSeries.push(s.y);                
            }
            donutGeneralProperties.chartLabels = newLabels;
            donutGeneralProperties.legendShow = chartInfo.showLegend;
            donutGeneralProperties.dataLabelsEnabled = chartInfo.showLabels;
            donutGeneralProperties.chartColors = chartInfo.colors;
            donutGeneralProperties.chartHeight = chartInfo.height;
            donutGeneralProperties.chartWidth = chartInfo.width;
            donutGeneralProperties.tooltipShow = chartInfo.showTooltip;
            donutGeneralProperties.legendPosition = chartInfo.legendPosition;

            // if(Object.prototype.hasOwnProperty.call(chartInfo, "chartValueUnit") ) {
            //     radialBarGeneralProperties.setValueFormatter = function (value:any) {
            //         return value + chartInfo.chartValueUnit;
            //     }
            // }

            semiDonutInfo.chartOptions = donutGeneralProperties;
            semiDonutInfo.series = newSeries;

            return { 
                semiDonutInfo
            }
        }
    })
</script>