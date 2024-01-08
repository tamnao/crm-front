<template>
    <div>
        <Stacked100ColumnChart :columnInfo="columnInfo" v-if="data.chartInfo.chartType == 'COLUMN_STACKED' "/>
        <BasicColumnChart v-else :columnInfo="columnInfo"/>
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive } from "vue";
    import BasicColumnChart from "@/components/charts/column/BasicColumnChart.vue";
    import ColumnGeneralProperties from "@/model/chart/ColumnGeneralProperties";
    import Stacked100ColumnChart from "@/components/charts/column/Stacked100ColumnChart.vue";

    export default defineComponent({
        props: ["data"],
        components: {
            BasicColumnChart,
            Stacked100ColumnChart,
        },
        setup(props) {
            let columnInfo = {
                series: [{}],
                chartOptions: {}
            }
            let columnGeneralProperties = reactive(new ColumnGeneralProperties());
            let chartInfo = reactive(props.data.chartInfo);

            columnGeneralProperties.tooltipShared = chartInfo.tooltipShared;
            columnGeneralProperties.tooltipIntersect = chartInfo.tooltipIntersect;
            columnGeneralProperties.stacked = chartInfo.isStacked;
            columnGeneralProperties.stackType = chartInfo.stackType;
            columnGeneralProperties.chartHeight = chartInfo.height;
            columnGeneralProperties.chartWidth = chartInfo.width;
            columnGeneralProperties.chartColors = chartInfo.colors;
            columnGeneralProperties.legendShow = chartInfo.showLegend;
            columnGeneralProperties.legendFontSize = chartInfo.legendFontSize;
            columnGeneralProperties.legendFontWeight = chartInfo.legendFontWeight;
            columnGeneralProperties.legendMarkersWidth = chartInfo.legendMarkersWidth;
            columnGeneralProperties.legendMarkersHeight = chartInfo.legendMarkersHeight;

			columnGeneralProperties.borderRadius = chartInfo.borderRadius;
			columnGeneralProperties.columnWidth = chartInfo.columnWidth;
			columnGeneralProperties.dataLabelsEnabled = chartInfo.dataLabelsEnabled;
            columnGeneralProperties.dataLabelsPosition = chartInfo.dataLabelsPosition;
            columnGeneralProperties.dataLabelsOffsetY = chartInfo.dataLabelsOffsetY;
            columnGeneralProperties.distributed = chartInfo.columnDistributed;
            columnGeneralProperties.gridShow = chartInfo.showGrid;
            columnGeneralProperties.xaxisTooltipShow = chartInfo.showXaxisTooltip;
            columnGeneralProperties.tooltipFixed = chartInfo.tooltipFixed;
            columnGeneralProperties.tooltipFixedPosition = chartInfo.tooltipPosition;

            if(chartInfo.showXaxis == false) {
                columnGeneralProperties.xaxisLabelsShow = false;
                columnGeneralProperties.xaxisBorderShow = false;
                columnGeneralProperties.xaxisTicksShow = false;
            } else {
                columnGeneralProperties.xaxisLabelsShow = chartInfo.showXaxisLabels;
                columnGeneralProperties.xaxisBorderShow = chartInfo.showXaxisBorder;
                columnGeneralProperties.xaxisTicksShow = chartInfo.showXaxisTicks;
            }

            if(chartInfo.showYaxis == false) {
                columnGeneralProperties.yaxisLabelsShow = false;
                columnGeneralProperties.yaxisBorderShow = false;
                columnGeneralProperties.yaxisTicksShow = false;
            } else {
                columnGeneralProperties.yaxisLabelsShow = chartInfo.showYaxisLabels;
                columnGeneralProperties.yaxisBorderShow = chartInfo.showYaxisBorder;
                columnGeneralProperties.yaxisTicksShow = chartInfo.showYaxisTicks;
            }

            function setData(data: any) {
                let xaxisValue = [] as any;
                chartInfo.yaxisValue = [];
                
                data.forEach((element: any, index: any) => {
                    
                    let yValue = {
                        name: [],
                        data: [{}]
                    };

                    if(Object.prototype.hasOwnProperty.call(chartInfo, "yaxisName") && chartInfo.yaxisTitleList.length > 0) {
                        yValue.name = chartInfo.yaxisTitleList[index];
                    }
                    else {
                        yValue.name = element.name;
                    }
                    yValue.data = [];
                    element.data.forEach((val:any) => {
                        yValue.data.push(val.y);

                        if(chartInfo.allowDuplicateXaxis) {
                            xaxisValue.push(val.x);
                        }
                        else {
                            if(xaxisValue.length == 0 || !xaxisValue.includes(val.x)) {
                                xaxisValue.push(val.x);
                            }
                        }
                    });

                    chartInfo.yaxisValue.push(yValue);
                });

                columnInfo.series = chartInfo.yaxisValue;
                columnGeneralProperties.xaxisTitle = chartInfo.xaxisTitle;
                columnGeneralProperties.xaxisCategories = xaxisValue;

                if(Object.prototype.hasOwnProperty.call(chartInfo, "yaxisName") && chartInfo.yaxisName.length > 0) {
                    columnGeneralProperties.yaxisTitle = chartInfo.yaxisName;
                    // columnGeneralProperties.distributed = false;
                    //columnGeneralProperties.columnWidth = "90%";
                }
                else if(Object.prototype.hasOwnProperty.call(chartInfo, "chartType") && chartInfo.chartType == 'COLUMN_STACKED') {
                    columnGeneralProperties.yaxisTitle = chartInfo.yaxisTitleList[0];
                    // columnGeneralProperties.distributed = false;
                }
                else {
                    columnGeneralProperties.yaxisTitle = chartInfo.yaxisTitleList[0];
                    // columnGeneralProperties.distributed = true;
                }
            }

            setData(props.data.chartData);
            columnInfo.chartOptions = columnGeneralProperties;

            return {
                columnInfo
            }
        }
    })
</script>