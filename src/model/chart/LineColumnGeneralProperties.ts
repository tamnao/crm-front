import GeneralProperties from "@/model/chart/GeneralProperties";

class LineColumnGeneralProperties extends GeneralProperties {

    constructor() {
        super();
        this.chartOptions.stroke = {
            width: [0, 3],
            curve: "smooth",
        },
        this.chartOptions.plotOptions = {
            bar: {
                columnWidth: "50%",
                borderRadius: 0,
            },
        },
        this.chartOptions.xaxis = {
            type: "categories",
            tickAmount: undefined,
            title: {
                text: "",
            },
            labels: {
                hideOverlappingLabels: false,
                formatter: function(val:any, index:any) {
                    return val;
                },
            },
            forceNiceScale: true,
        };
        this.chartOptions.yaxis = [{
            title: {
                text: "",
            },
            labels: {
                formatter: function(val:any, index:any) {
                    return  Number(val).toLocaleString();
                }
            },
            forceNiceScale: true,
        }];
        this.chartOptions.dataLabels = {
            enabled: this.chartOptions.dataLabels.enabled,
            enabledOnSeries: [],
        };
        this.chartOptions.tooltip = {
            shared: this.chartOptions.tooltip.shared,
            intersect: this.chartOptions.tooltip.intersect,
            x: {
                format: "yyyy-MM-dd",
            }
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

	set strokeWidth(strokeWidth: any) {
		if (strokeWidth != undefined)
			this.chartOptions.stroke.width = strokeWidth;
	}

    set columnWidth(columnWidth:any) {
		if (columnWidth != undefined) {
			this.chartOptions.plotOptions.bar.columnWidth = columnWidth;
		}
	}

    set borderRadius(borderRadius:any) {
		if (borderRadius != undefined) {
			this.chartOptions.plotOptions.bar.borderRadius = borderRadius;
		}
	}

    set xaxisType(theXaxisType:string) {
        if (theXaxisType != undefined) {
            this.chartOptions.xaxis.type = theXaxisType;
        }
    }

    set xaxisTickAmount(theXaxisTickAmount:any) {
        if (theXaxisTickAmount != undefined) {
            this.chartOptions.xaxis.tickAmount = theXaxisTickAmount;
        }
    }

    set xaxisLabelsFormatter(theXaxisLabelsFormatter:any) {
        if (theXaxisLabelsFormatter != undefined) {
            this.chartOptions.xaxis.labels.formatter = theXaxisLabelsFormatter;
        }
    }

    set xaxisTitle(theXaxisTitle:string) {
        if (theXaxisTitle != undefined) {
            this.chartOptions.xaxis.title.text = theXaxisTitle;
        }
    }

    set yaxisTitle(theYaxisTitle:string) {
        if (theYaxisTitle != undefined) {
            this.chartOptions.yaxis[0].title.text = theYaxisTitle;
        }
    }

    get yaxis():any {
        return this.chartOptions.yaxis;
    }
    
    set yaxis(theYaxis:any) {
        if (theYaxis != undefined) {
            this.chartOptions.yaxis = theYaxis;
        }
    }

    set dataLabelsEnabledSeries(theSeries:Array<any>) {
        if (theSeries != undefined) {
            this.chartOptions.dataLabels.enabledOnSeries = theSeries;
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

export default LineColumnGeneralProperties;