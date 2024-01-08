<template>
    <div>
        <multiple-radial-bar-chart :radialInfo="radialInfo" v-if="data.chartInfo.chartType == 'RADIAL_BAR' " />
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive } from '@vue/runtime-core';
    import { checkProperty } from '@/utils/ChartUtils';
    import RadialBarGeneralProperties from '@/model/chart/RadialBarGeneralProperties';
    import MultipleRadialBarChart from './MultipleRadialBarChart.vue';

    export default defineComponent({
        components: {
            "multiple-radial-bar-chart" : MultipleRadialBarChart
        },
        props: ["data"],
        setup(props) {
            let radialInfo = {
                series: [] as any,
                chartOptions: {},
            };

            let radialBarGeneralProperties = reactive(new RadialBarGeneralProperties);
            let chartInfo = reactive(props.data.chartInfo);
            let chartData = reactive(props.data.chartData);
            
            let newLabels:any = [];
            let newSeries = [];
            for(let s of chartData) {
                newLabels.push(s.x);
                newSeries.push(s.y);                
            }
            radialBarGeneralProperties.chartLabels = newLabels;
            radialBarGeneralProperties.legendShow = chartInfo.showLegend;
            radialBarGeneralProperties.chartColors = chartInfo.colors;

            checkProperty(radialBarGeneralProperties, chartInfo, "height");
            checkProperty(radialBarGeneralProperties, chartInfo, "width");
            checkProperty(radialBarGeneralProperties, chartInfo, "showTooltip");
            checkProperty(radialBarGeneralProperties, chartInfo, "hollowSize");

            if(Object.prototype.hasOwnProperty.call(chartInfo, "chartValueUnit") ) {
                radialBarGeneralProperties.setValueFormatter = function (value:any) {
                    return value + chartInfo.chartValueUnit;
                }
            }

            radialInfo.chartOptions = radialBarGeneralProperties;
            radialInfo.series = newSeries;

            return { 
                radialInfo
            }
        }
    })
</script>