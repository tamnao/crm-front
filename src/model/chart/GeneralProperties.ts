class GeneralProperties {
    chartOptions: any= {
        chart: {
            type: "",
            height: "300",
            width: 580,
            toolbar: {
                show: false,
                tools: {
                    download: false,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                }
            }
        },
        noData: {
            text: "No Data"
        },
        title: {
            text: "",
            align: "left",
            style: {
                fontSize: "14px",
                fontWeight: 'bold',
            }
        },
        colors: ["#ffcc41", "#d9db09", "#0dd683", "#54ccf9", "#3491f1", 
                "#424dda", "#7777ff", "#a83f75", "#424080", "#7c6c8f", 
                "#a26868", "#e8a13b", "#5984bb", "#1db7b9", "#f36767",
                "#8eaa38", "#d1d091"],
        tooltip: {
            enabled: true,
            shared: false, // if true, intersect must be false
            intersect: false,
            x: {
                show: true,
            },
            fixed: {
                enabled: false,
                position: 'topRight',
            }
        },
        legend: {
            show: true,
            showForSingleSeries: true,
            position: "bottom"
        },
        dataLabels: {
            enabled: false,
            style: {
                fontSize: '12px',
                colors: ["#000000"]
            },
        },
        // labels: ["Team A", "Team B", "Team C", "Team D", "Team E"]
        labels: [] //overwrite xaxis value
    }

    set chartType(chartType:string) {
        if(chartType != undefined) {
            this.chartOptions.chart.type = chartType;
        }
    }

    set chartHeight(chartHeight:string) {
        if(chartHeight != undefined) {
            this.chartOptions.chart.height = chartHeight;
        }
    }

    set chartWidth(chartWidth:string) {
        if(chartWidth != undefined) {
            this.chartOptions.chart.width = chartWidth;
        }
    }

    set toolbarShow(isShow:boolean) {
        if(isShow != undefined) {
            this.chartOptions.chart.toolbar.show = isShow;
        }
    }

    set noDataText(noDataText:string) {
        if(noDataText != undefined) {
            this.chartOptions.noData = noDataText;
        }
    }

    set chartTitle(chartTitle:string) {
        if(chartTitle != undefined) {
            this.chartOptions.title.text = chartTitle;
        }
    }

    set chartTitleAlignment(titleAlign:string) {
        if(titleAlign != undefined) {
            this.chartOptions.title.align = titleAlign;
        }
    }

    set chartColors(colors:Array<any>) {
        if(colors != undefined) {
            this.chartOptions.colors = colors;
        }
    }

    set tooltipShow(showTooltip:boolean) {
        if(showTooltip != undefined) {
            this.chartOptions.tooltip.enabled = showTooltip;
        }
    }

    set tooltipShared(isSharedTooltip:boolean) {
        if(isSharedTooltip != undefined) {
            this.chartOptions.tooltip.shared = isSharedTooltip;
        }
    }

    set tooltipIntersect(isIntersectTooltip:boolean) {
        if(isIntersectTooltip != undefined) {
            this.chartOptions.tooltip.intersect = isIntersectTooltip;
        }
    }

    set xaxisTooltipShow(isXaxisTooltipShow:boolean) {
        if(isXaxisTooltipShow != undefined) {
            this.chartOptions.tooltip.x.show = isXaxisTooltipShow;
        }
    }

    set tooltipFixed(isSharedFixed:boolean) {
        if(isSharedFixed != undefined) {
            this.chartOptions.tooltip.fixed.enabled = isSharedFixed;
        }
    }

    set tooltipFixedPosition(tooltipPosition:boolean) {
        if(tooltipPosition != undefined) {
            this.chartOptions.tooltip.fixed.position = tooltipPosition;
        }
    }

    set legendShow(showLegend:boolean) {
        if(showLegend != undefined) {
            this.chartOptions.legend.show = showLegend;
        }
    }

    set legendPosition(legendPosition:string) {
        if(legendPosition != undefined) {
            this.chartOptions.legend.position = legendPosition;
        }
    }

    set dataLabelsEnabled(isEnabled:boolean) {
        if(isEnabled != undefined) {
            this.chartOptions.dataLabels.enabled = isEnabled;
        }
    }

    set chartLabels(labels:Array<any>) {
        if(labels != undefined) {
            this.chartOptions.labels = labels;
        }
    }
}

export default GeneralProperties;