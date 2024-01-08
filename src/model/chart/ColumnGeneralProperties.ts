import GeneralProperties from "./GeneralProperties";

class ColumnGeneralProperties extends GeneralProperties {
    constructor() {
        super();
        this.chartOptions.chart = {
            type: "bar",
            toolbar: this.chartOptions.chart.toolbar,
            stacked: false,
            stackType: ''
        };
        this.chartOptions.plotOptions = {
            bar: {
                columnWidth: "45%",
                distributed: false,
				borderRadius: 0,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        };
        this.chartOptions.xaxis = {
            categories: [],
            title: {
                text: "",
                offsetY: -10,
            },
            labels: {
                show: true,
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'yyyy_mm',
                    day: 'yyyy-MM-dd',
                    hour: 'HH:mm'
                },
                style: {
                    colors: ['#666'],
                    fontSize: '10px',
                    fontWeight: '700',
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
                show: true,
                formatter: function(val:any, index:any) {
                    return Number(val).toLocaleString();
                },
                style: {
                    colors: ['#666'],
                    fontSize: '10px',
                    fontWeight: '700',
                    fontFamily: 'Noto Sans KR, Montserrat'
                }
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: true,
            },
            forceNiceScale: true,
        };
        this.chartOptions.dataLabels = {
            enabled: this.chartOptions.dataLabels.enabled,
            style: {
                fontSize: '11px',
                colors: ["#666"], 
            },
            offsetY: 0,
            formatter: function (val:any, opts:any) {
                return Number(val).toLocaleString();
            },
        };
        this.chartOptions.stroke = { // add gap between multiple series column chart
            colors: ['transparent'],
            width: 4,    
        };
        this.chartOptions.grid = {
            show: true, 
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
        }
    }

    set stacked(stacked:boolean) {
        if (stacked != undefined) {
            this.chartOptions.chart.stacked = stacked;
        }
    }

    set stackType(type:string) {
        if (type != undefined) {
            this.chartOptions.chart.stackType = type;
        }
    }

    set distributed(distributed:boolean) {
        if (distributed != undefined) {
            this.chartOptions.plotOptions.bar.distributed = distributed;
        }
    }

    set xaxisCategories(xaxisCategories:Array<any>) {
        if (xaxisCategories != undefined) {
            this.chartOptions.xaxis.categories = xaxisCategories;
        }
    }

    set xaxisLabelsShow(isShow:boolean) {
        if (isShow != undefined) {
            this.chartOptions.xaxis.labels.show = isShow;
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

    set xaxisTitle(xaxisTitle:string) {
        if (xaxisTitle != undefined) {
            this.chartOptions.xaxis.title.text = xaxisTitle;
        }
    }

    set yaxisTitle(yaxisTitle:string) {
        if (yaxisTitle != undefined) {
            this.chartOptions.yaxis.title.text = yaxisTitle;
        }
    }

    set yaxisLabelsShow(isShow:boolean) {
        if (isShow != undefined) {
            this.chartOptions.yaxis.labels.show = isShow;
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

	set borderRadius(borderRadius:any) {
		if (borderRadius != undefined) {
			this.chartOptions.plotOptions.bar.borderRadius = borderRadius;
		}
	}

	set columnWidth(columnWidth: any) {
		if (columnWidth != undefined) {
			this.chartOptions.plotOptions.bar.columnWidth = columnWidth;
		}
	}

    set dataLabelsOffsetY(offsetY:number) {
        if(offsetY != undefined) {
            this.chartOptions.dataLabels.offsetY = offsetY;
        }
    }

    set dataLabelsPosition(position:string) {
        if(position != undefined) {
            this.chartOptions.plotOptions.bar.dataLabels.position = position;
        }
    }

    set gridShow(isShow:boolean) {
        if (isShow != undefined) {
            this.chartOptions.grid.show = isShow;
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
}

export default ColumnGeneralProperties;