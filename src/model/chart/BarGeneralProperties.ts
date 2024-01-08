import GeneralProperties from "@/model/chart/GeneralProperties";

class BarGeneralProperties extends GeneralProperties {

    constructor() {
        super();
        this.chartOptions.chart = {
            type: "bar",
            stacked: false,
            stackType: "", //100%
            toolbar: this.chartOptions.chart.toolbar
        };
        this.chartOptions.plotOptions = {
            bar: {
                horizontal: false,
                barHeight: "45%",
                borderRadius: 0,
            },
        };
        this.chartOptions.xaxis = {
            categories: [],
            type: 'category',
            tickPlacement: 'between',
            title: {
                text: "",
            },
            labels: {
                show: true,
                rotateAlways: false,
                formatter: function(val:any, index:any) {
                    return Number(val).toLocaleString();
                },
                minHeight: undefined,
                style: {
                    fontSize: '9px',
                    fontFamily: 'Noto Sans KR, Montserrat'
                }
            },
            axisBorder: {
                show: true,
            },
            axisTicks: {
                show: true,
            }
        };
        this.chartOptions.yaxis = {
            title: {
                text: "",
            },
            labels: {
                formatter: function(val:any, index:any) {
                    if(!isNaN(+val)){
                        return Number(val).toLocaleString();
                    } else { 
                        return val;
                    }
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: true,
            },
        };
        this.chartOptions.stroke = { // add gap between multiple series column chart
            colors: ['transparent'],
            width: 4,    
        };
        this.chartOptions.legend = {
            show: this.chartOptions.legend.show,
            showForSingleSeries: this.chartOptions.legend.showForSingleSeries,
            position: this.chartOptions.legend.position,
            fontSize: '14px',
            fontFamily: 'Noto Sans KR, Montserrat',
            fontWeight: 400,
            markers: {
                width: 12,
                height: 12,
            }
        };
        this.chartOptions.grid = {
            show: true, 
            xaxis: {
                lines: {
                    show: false
                }
            },   
            yaxis: {
                lines: {
                    show: true
                }
            },  
        }
    }

    set stacked(theStacked:boolean) {
        if (theStacked != undefined) {
            this.chartOptions.chart.stacked = theStacked;
        }
    }

    set stackType(theStackType:string) {
        if (theStackType != undefined) {
            this.chartOptions.chart.stackType = theStackType;
        }
    }

    set barHorizontal(theHorizontal:boolean) {
        if (theHorizontal != undefined) {
            this.chartOptions.plotOptions.bar.horizontal = theHorizontal;
        }
    }

    set barHeight(barHeight: any) {
		if (barHeight != undefined) {
			this.chartOptions.plotOptions.bar.barHeight = barHeight;
		}
	}

    set borderRadius(borderRadius:any) {
		if (borderRadius != undefined) {
			this.chartOptions.plotOptions.bar.borderRadius = borderRadius;
		}
	}

    set tooltipShared(theTooltipShared:boolean) {
        if (theTooltipShared != undefined) {
            this.chartOptions.tooltip.shared = theTooltipShared;
        }
    }

    set xaxisCategories(theXaxisCategories:Array<any>) {
        if (theXaxisCategories != undefined) {
            this.chartOptions.xaxis.categories = theXaxisCategories;
        }
    }

    set xaxisType(theXaxisType:string) {
        if (theXaxisType != undefined) {
            this.chartOptions.xaxis.type = theXaxisType;
        }
    }

    set xaxisTickPlacement(theXaxisTickPlacement:string) {
        if (theXaxisTickPlacement != undefined) {
            this.chartOptions.xaxis.tickPlacement = theXaxisTickPlacement;
        }
    }

    set xaxisLabelsMinHeight(theXaxisLabelsMinHeight:string) {
        if (theXaxisLabelsMinHeight != undefined) {
            this.chartOptions.xaxis.labels.minHeight = theXaxisLabelsMinHeight;
        }
    }

    set xaxisBorderShow(isShow:boolean) {
        if (isShow != undefined) {
            this.chartOptions.xaxis.axisBorder.show = isShow;
        }
    }

    set xaxisTicksShow(isShow:boolean) {
        if (isShow != undefined) {
            this.chartOptions.xaxis.axisTicks.show = isShow;
        }
    }

    set xaxisRotate(isRotate:boolean) {
        if (isRotate != undefined) {
            this.chartOptions.xaxis.labels.rotateAlways = isRotate;
        }
    }

    set xaxisTitle(theXaxisTitle:string) {
        if (theXaxisTitle != undefined) {
            this.chartOptions.xaxis.title.text = theXaxisTitle;
        }
    }

    set yaxisTitle(theYaxisTitle:string) {
        if (theYaxisTitle != undefined) {
            this.chartOptions.yaxis.title.text = theYaxisTitle;
        }
    }

    set yaxisBorderShow(isShow:boolean) {
        if (isShow != undefined) {
            this.chartOptions.yaxis.axisBorder.show = isShow;
        }
    }

    set yaxisTicksShow(isShow:boolean) {
        if (isShow != undefined) {
            this.chartOptions.yaxis.axisTicks.show = isShow;
        }
    }

    set legendFontSize(theFontSize:any) {
        if (theFontSize != undefined) {
            this.chartOptions.legend.fontSize = theFontSize;
        }
    }

    set legendFontWeight(theFontWeight:any) {
        if (theFontWeight != undefined) {
            this.chartOptions.legend.fontWeight = theFontWeight;
        }
    }

    set legendMarkersWidth(theMarkerWidth:any) {
        if (theMarkerWidth != undefined) {
            this.chartOptions.legend.markers.width = theMarkerWidth;
        }
    }

    set legendMarkersHeight(theMarkerHeight:any) {
        if (theMarkerHeight != undefined) {
            this.chartOptions.legend.markers.height = theMarkerHeight;
        }
    }

    set gridShow(isShow:boolean) {
        if (isShow != undefined) {
            this.chartOptions.grid.show = isShow;
        }
    }

    set xaxisGridShow(isShow:boolean) {
        if (isShow != undefined) {
            this.chartOptions.grid.xaxis.lines.show = isShow;
        }
    }

    set yaxisGridShow(isShow:boolean) {
        if (isShow != undefined) {
            this.chartOptions.grid.yaxis.lines.show = isShow;
        }
    }
}

export default BarGeneralProperties;