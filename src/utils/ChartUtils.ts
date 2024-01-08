import moment from "moment/moment";

export const checkProperty = (chartProperty:any, chartInfo:any, propertyName:string) => {
    if(propertyName == "height" && Object.prototype.hasOwnProperty.call(chartInfo, propertyName) ) {
        chartProperty.chartHeight = chartInfo.height;
    }

    if(propertyName == "width" && Object.prototype.hasOwnProperty.call(chartInfo, propertyName) ) {
        chartProperty.chartWidth = chartInfo.width;
    }

    if(propertyName == "hollowSize" && Object.prototype.hasOwnProperty.call(chartInfo, propertyName) ) {
        chartProperty.setHollowSize = chartInfo.hollowSize;
    }

    if(propertyName == "showTooltip" && Object.prototype.hasOwnProperty.call(chartInfo, propertyName) ) {
        chartProperty.tooltipShow = chartInfo.showTooltip;
    }

    if(propertyName == "showLegend" && Object.prototype.hasOwnProperty.call(chartInfo, propertyName) ) {
        chartProperty.legendShow = chartInfo.showLegend;
    }

    if(propertyName == "legendPosition" && Object.prototype.hasOwnProperty.call(chartInfo, propertyName) ) {
        chartProperty.legendPosition = chartInfo.legendPosition;
    }

    if(propertyName == "colors" && Object.prototype.hasOwnProperty.call(chartInfo, propertyName) ) {
        chartProperty.chartColors = chartInfo.colors;
    }
}

export const checkXaxisType = (chartProperty:any, xaxisType:string) => {
    chartProperty.setXaxisType = xaxisType;
    if(xaxisType == "numeric") {
        chartProperty.setXaxisLabelsFormatter = function(val:any, index:any) {
            return Number(val).toLocaleString();
        }
    } else if(xaxisType == "datetime") {
        chartProperty.setXaxisLabelsFormatter = function(val:any, timestamp:any) {
            return moment(timestamp).format("YYYY-MM-DD");
        };
    }
}

