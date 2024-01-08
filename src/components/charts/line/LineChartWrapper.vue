<template>
    <div>
        <basic-line-chart :lineInfo="lineInfo" v-if="data.chartInfo.chartType == 'LINE' " />
    </div>
</template>

<script lang="ts">
    import { defineComponent,reactive } from '@vue/runtime-core';
    import BasicLineChart from "@/components/charts/line/BasicLineChart.vue";
    import LineGeneralProperties from "@/model/chart/LineGeneralProperties";

    export default defineComponent({
        components: {
            "basic-line-chart" : BasicLineChart,
        },
        props: ["data"],
        setup(props) {
            let lineInfo = {
                series: [],
                chartOptions: {},
            };
            
            let lineGeneralProperties = reactive(new LineGeneralProperties);
            let chartData = reactive(props.data.chartData);
            let chartInfo = reactive(props.data.chartInfo);

            lineGeneralProperties.chartType = "line";
            lineGeneralProperties.xaxisTitle = chartInfo.xaxisTitle;
            lineGeneralProperties.yaxisTitle = chartInfo.yaxisTitleList[0];
            lineGeneralProperties.chartColors = chartInfo.colors;
            lineGeneralProperties.dataLabelsEnabled = chartInfo.showLabels;
            lineGeneralProperties.tooltipShared = chartInfo.shareTooltip;
            lineGeneralProperties.chartHeight = chartInfo.height;
            lineGeneralProperties.chartWidth = chartInfo.width;
            lineGeneralProperties.legendShow = chartInfo.showLegend;
            lineGeneralProperties.legendFontSize = chartInfo.legendFontSize;
            lineGeneralProperties.legendFontWeight = chartInfo.legendFontWeight;
            lineGeneralProperties.legendMarkersWidth = chartInfo.legendMarkersWidth;
            lineGeneralProperties.legendMarkersHeight = chartInfo.legendMarkersHeight;

            /** 
             * When there is more than 2 series and wanted to display 2 Y axis.
             * More information : https://apexcharts.com/docs/chart-types/multiple-yaxis-scales [3 series with 2 Scales]
             *  **/
            if(chartData.length > 2 && chartInfo.yaxisTitleList.length > 1) {
                let name = ["", ""] as any;
                let yaxisOptions = [] as any;
                for(let series of chartData) {
                    let seriesName = "";
                    let showAxis = false;
                    let opposite = false;
                    let axisTitle = "";

                    if(Object.prototype.hasOwnProperty.call(chartInfo, "seriesLeftYaxis") && chartInfo.seriesLeftYaxis.includes(series.name) && name[0].length < 1 ) {
                        seriesName = series.name;
                        showAxis = true;
                        opposite = false;
                        axisTitle = chartInfo.yaxisTitleList[0];
                        name[0] = series.name;
                    } else if(Object.prototype.hasOwnProperty.call(chartInfo, "seriesRightYaxis") && chartInfo.seriesRightYaxis.includes(series.name) && name[1].length < 1 ) {
                        seriesName = series.name;
                        showAxis = true;
                        opposite = true;
                        axisTitle = chartInfo.yaxisTitleList[1];
                        name[1] = series.name;
                    } else if(Object.prototype.hasOwnProperty.call(chartInfo, "seriesLeftYaxis") && chartInfo.seriesLeftYaxis.includes(series.name) && name[0].length > 1) {
                        seriesName = name[0];
                        showAxis = false;
                        opposite = false;
                        axisTitle = "";
                    } else if(Object.prototype.hasOwnProperty.call(chartInfo, "seriesRightYaxis") && chartInfo.seriesRightYaxis.includes(series.name) && name[1].length > 1) {
                        seriesName = name[1];
                        showAxis = false;
                        opposite = true;
                        axisTitle = "";
                    }

                    let options = {
                        seriesName: seriesName,
                        show: showAxis,
                        opposite: opposite,
                        title: {
                            text: axisTitle,
                        },
                        labels: {
                            formatter: function(val:any, index:any) {
                                return  Number(val).toLocaleString();
                            }
                        },
                        forceNiceScale: true,
                    } 
                    yaxisOptions.push(options);
                }
                lineGeneralProperties.yaxis = yaxisOptions;

            } 
            /** 
             * When there is 2 series and wanted to display 2 Y axis.
             *  **/
            else if(chartInfo.yaxisTitleList.length > 1) {
                let secondYaxis = {
                    opposite: true,
                    title: {
                        text: chartInfo.yaxisTitleList[1],
                    },
                    labels: {
                        formatter: function(val:any, index:any) {
                            return  Number(val).toLocaleString();
                        }
                    },
                    forceNiceScale: true,
                }
                lineGeneralProperties.yaxis.push(secondYaxis);
            }

            lineGeneralProperties.xaxisType = chartInfo.xaxisType;
            if(chartInfo.xaxisType == "numeric") {
                lineGeneralProperties.xaxisLabelsFormatter = {
                    formatter: function(val:any, index:any) {
                        return Number(val).toLocaleString();
                    }
                }
            }

            if(Object.prototype.hasOwnProperty.call(chartInfo, "lineCurve")) {
                lineGeneralProperties.strokeCurve = chartInfo.lineCurve;
            }

            lineInfo.chartOptions = lineGeneralProperties;
            lineInfo.series = chartData;

            return {
                lineInfo,
            }
        }
    })
</script>