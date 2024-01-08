import GeneralProperties from "@/model/chart/GeneralProperties";

class LineGeneralProperties extends GeneralProperties {

    constructor() {
        super();
        this.chartOptions.stroke = {
            curve: 'smooth'
        };
        this.chartOptions.xaxis = {
            type: "categories",
            labels: {
                formatter: undefined,
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'yyyy_mm',
                    day: 'yyyy-MM-dd',
                    hour: 'HH:mm'
                },
                style: {
                    fontSize: '11px',
                    fontFamily: 'Noto Sans KR, Montserrat'
                }
            },
            title: {
                text: " ",
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
                    // return val.toFixed(2);
                }
            },
            forceNiceScale: true,
        }];
        this.chartOptions.annotations = {
            position: "front",
            xaxis: [],
            yaxis: [],
            points: [],
        };
        this.chartOptions.tooltip = {
            shared: this.chartOptions.tooltip.shared,
            intersect: this.chartOptions.tooltip.intersect,
            x: {
                format: "yyyy-MM-dd"
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

    set strokeCurve(theStrokeCurve:string) {
        if (theStrokeCurve != undefined) {
            this.chartOptions.stroke.curve = theStrokeCurve;
        }
    }

    set xaxisType(theXaxisType:string) {
        if (theXaxisType != undefined) {
            this.chartOptions.xaxis.type = theXaxisType;
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

    set annotationsXaxis(theAnnotationsXaxis:any) {
        if (theAnnotationsXaxis != undefined) {
            this.chartOptions.annotations.xaxis = theAnnotationsXaxis;
        }
    }

    set annotationsYaxis(theAnnotationsYaxis:any) {
        if (theAnnotationsYaxis != undefined) {
            this.chartOptions.annotations.yaxis = theAnnotationsYaxis;
        }
    }

    set annotationsPoints(theAnnotationsPoints:any) {
        if (theAnnotationsPoints != undefined) {
            this.chartOptions.annotations.points = theAnnotationsPoints;
        }
    }

    set tooltipXaxis(theXaxisFormat:any) {
        if (theXaxisFormat != undefined) {
            this.chartOptions.tooltip.x = theXaxisFormat;
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

export default LineGeneralProperties;