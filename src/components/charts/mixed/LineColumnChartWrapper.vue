<template>
    <div>
        <line-column-chart :lineColumnInfo="lineColumnInfo" v-if="data.chartInfo.chartType == 'LINE_COLUMN' " />
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive } from '@vue/runtime-core';
    import moment from "moment/moment";
    import LineColumnChart from "@/components/charts/mixed/LineColumnChart.vue"
    import LineColumnGeneralProperties from '@/model/chart/LineColumnGeneralProperties';
    
    export default defineComponent({
        components: {
            "line-column-chart" : LineColumnChart
        },
        props: ["data"],
        setup(props) {
            let lineColumnInfo = {
                series: [],
                chartOptions: {},
            };

            let lineColumnGeneralProperties = new LineColumnGeneralProperties;
            
            let chartData = reactive(props.data.chartData);
            let chartInfo = reactive(props.data.chartInfo);

            lineColumnGeneralProperties.tooltipShared = true;
            lineColumnGeneralProperties.xaxisTitle = chartInfo.xaxisTitle;
            lineColumnGeneralProperties.yaxisTitle = chartInfo.yaxisTitleList[0];
            lineColumnGeneralProperties.chartColors = chartInfo.colors;
            lineColumnGeneralProperties.chartHeight = chartInfo.height;
            lineColumnGeneralProperties.chartWidth = chartInfo.width;
            lineColumnGeneralProperties.columnWidth = chartInfo.columnWidth;
            lineColumnGeneralProperties.borderRadius = chartInfo.borderRadius;
            lineColumnGeneralProperties.legendShow = chartInfo.showLegend;
            lineColumnGeneralProperties.legendFontSize = chartInfo.legendFontSize;
            lineColumnGeneralProperties.legendFontWeight = chartInfo.legendFontWeight;
            lineColumnGeneralProperties.legendMarkersWidth = chartInfo.legendMarkersWidth;
            lineColumnGeneralProperties.legendMarkersHeight = chartInfo.legendMarkersHeight;
			lineColumnGeneralProperties.strokeWidth = chartInfo.strokeWidth;

            /** 
             * When there is more than 2 series and wanted to display 2 Y axis.
             * More information : https://apexcharts.com/docs/chart-types/multiple-yaxis-scales [3 series with 2 Scales]
             *  **/
            if(chartData.length > 2 && chartInfo.yaxisTitleList.length > 1) {
                let type = [] as any;
                let name = [] as any;
                let yaxisOptions = [] as any;
                for(let series of chartData) {
                    let seriesName = "";
                    let showAxis = false;
                    let opposite = false;
                    let axisTitle = "";

                    if(!name.includes(series.name) && !type.includes(series.type)  && series.type == "bar") {
                        seriesName = series.name;
                        showAxis = true;
                        opposite = false;
                        axisTitle = chartInfo.yaxisTitleList[0];
                        name.push(series.name);
                        type.push(series.type);
                    } else if(!name.includes(series.name) && !type.includes(series.type) && series.type == "line") {
                        seriesName = series.name;
                        showAxis = true;
                        opposite = true;
                        axisTitle = chartInfo.yaxisTitleList[1];
                        name.push(series.name);
                        type.push(series.type);
                    } else {
                        let index = type.indexOf(series.type);
                        seriesName = name[index];
                        showAxis = false;
                        opposite = false;
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
                lineColumnGeneralProperties.yaxis = yaxisOptions;

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
                lineColumnGeneralProperties.yaxis.push(secondYaxis);
            }



            lineColumnGeneralProperties.xaxisType = chartInfo.xaxisType;
            if(chartInfo.xaxisType == "numeric") {
                lineColumnGeneralProperties.xaxisLabelsFormatter = function(val:any, index:any) {
                    return Number(val).toLocaleString();
                }
            } else if(chartInfo.xaxisType == "datetime") {
                lineColumnGeneralProperties.xaxisLabelsFormatter = function(val:any, timestamp:any) {
                    return moment(timestamp).format("YYYY-MM-DD");
                };
                lineColumnGeneralProperties.xaxisTickAmount = chartData[0].data.length + 1;
            }

            let seriesIndex:number[] = [];
            for(let index in chartData) {
                if(chartData[index].type == "line") {
                    seriesIndex.push(Number(index));
                }
            }
            lineColumnGeneralProperties.dataLabelsEnabledSeries = seriesIndex;

            for(let index in chartData) { // by default the series type must bar then line. Not line then bar. 
                if(chartData[index].type == undefined) {
                    if(Number(index) % 2 == 0) {
                        chartData[index].type = "bar";
                    } else {
                        chartData[index].type = "line";
                    }
                }
            }
            
            lineColumnInfo.chartOptions = lineColumnGeneralProperties;
            lineColumnInfo.series = chartData;

            return {
                lineColumnInfo
            }

        }
    })

</script>