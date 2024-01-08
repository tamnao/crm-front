<template>
    <div>
        <stacked-100-bar-chart :barInfo="barInfo" v-if="data.chartInfo.chartType == 'BAR_STACKED' " />
        <grouped-bar-chart :barInfo="barInfo" v-if="data.chartInfo.chartType == 'BAR_GROUPED' "/>
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive } from '@vue/runtime-core';
    import Stacked100BarChart from "@/components/charts/bar/Stacked100BarChart.vue";
    import GroupedBarChart from "@/components/charts/bar/GroupedBarChart.vue";
    import BarGeneralProperties from '@/model/chart/BarGeneralProperties';

    export default defineComponent({
        components: {
            "stacked-100-bar-chart" : Stacked100BarChart,
            "grouped-bar-chart" : GroupedBarChart
        },
        props: ["data"],
        setup(props) {
            let barInfo = {
                series: [],
                chartOptions: {} as any,
            };

            let barGeneralProperties = reactive(new BarGeneralProperties);

            let chartInfo = reactive(props.data.chartInfo);
            barGeneralProperties.xaxisTitle = chartInfo.xaxisTitle;
            barGeneralProperties.yaxisTitle = chartInfo.yaxisTitleList[0];
            barGeneralProperties.chartHeight = chartInfo.height;
            barGeneralProperties.chartWidth = chartInfo.width;
            barGeneralProperties.barHeight = chartInfo.barHeight;
            barGeneralProperties.chartColors = chartInfo.colors;
            barGeneralProperties.barHorizontal = chartInfo.barHorizontal;
            barGeneralProperties.tooltipShared = chartInfo.tooltipShared;
            barGeneralProperties.borderRadius = chartInfo.borderRadius;
            barGeneralProperties.legendShow = chartInfo.showLegend;
            barGeneralProperties.legendFontSize = chartInfo.legendFontSize;
            barGeneralProperties.legendFontWeight = chartInfo.legendFontWeight;
            barGeneralProperties.legendMarkersWidth = chartInfo.legendMarkersWidth;
            barGeneralProperties.legendMarkersHeight = chartInfo.legendMarkersHeight;
            barGeneralProperties.gridShow = chartInfo.showGrid;
            barGeneralProperties.xaxisGridShow = chartInfo.showXaxisGrid;
            barGeneralProperties.yaxisGridShow = chartInfo.showYaxisGrid;
            barGeneralProperties.xaxisRotate = chartInfo.xaxisRotate;
            barGeneralProperties.xaxisType = chartInfo.xaxisType;
            barGeneralProperties.xaxisTickPlacement = chartInfo.xaxisTickPlacement;
            barGeneralProperties.xaxisLabelsMinHeight = chartInfo.xaxisLabelsMinHeight;

            if(chartInfo.showXaxis == false) {
                barGeneralProperties.xaxisBorderShow = false;
                barGeneralProperties.xaxisTicksShow = false;
            } else {
                barGeneralProperties.xaxisBorderShow = chartInfo.showXaxisBorder;
                barGeneralProperties.xaxisTicksShow = chartInfo.showXaxisTicks;
            }

            if(chartInfo.showYaxis == false) {
                barGeneralProperties.yaxisBorderShow = false;
                barGeneralProperties.yaxisTicksShow = false;
            } else {
                barGeneralProperties.yaxisBorderShow = chartInfo.showYaxisBorder;
                barGeneralProperties.yaxisTicksShow = chartInfo.showYaxisTicks;
            }
            
            if(chartInfo.barStacked) {
                barGeneralProperties.stacked = chartInfo.barStacked;
                barGeneralProperties.stackType = chartInfo.stackType;
                
                let categories = [] as any;
                for(let data of props.data.chartData[0].data) {
                    categories.push(data.x);
                }
                barGeneralProperties.xaxisCategories = categories;
            }

            barInfo.chartOptions = barGeneralProperties;
            barInfo.series = reactive(props.data.chartData);

            return {
                barInfo
            }
        }
    })
</script>