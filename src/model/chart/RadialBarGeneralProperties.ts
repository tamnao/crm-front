import GeneralProperties from "@/model/chart/GeneralProperties";

class RadialBarGeneralProperties extends GeneralProperties {
    constructor() {
        super();
        this.chartOptions.chart = {
            type: 'radialBar',
            height: this.chartOptions.chart.height,
            width: this.chartOptions.chart.width,
            toolbar: this.chartOptions.chart.toolbar,
            offsetY: -20,
            sparkline: {
                enabled: true
            }
        };
        this.chartOptions.plotOptions = {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                hollow: {
                    size: '50%',
                },
                track: {
                    background: "#e7e7e7",
                    strokeWidth: '97%',
                    margin: 5, // margin is in pixels
                    dropShadow: {
                        enabled: false,
                        top: 2,
                        left: 0,
                        color: '#999',
                        opacity: 1,
                        blur: 2
                    }
                },
                dataLabels: {
                    name: {
                        show:false,
                    },
                    value: {
                        show: false,
                        fontSize: '5em',
                        fontWeight: 500,
                        formatter: function (value:any) {
                            return value + '%'
                        }
                    }
                }
            }
        };
        this.chartOptions.fill = {
            type: 'solid',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.4,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 53, 91]
            },
        };
    }

    get getValueFormatter():any {
        return this.chartOptions.plotOptions.radialBar.dataLabels.value.formatter;
    }
    set setValueFormatter(theValueFormatter:any) {
        this.chartOptions.plotOptions.radialBar.dataLabels.value.formatter = theValueFormatter;
    }

    get getHollowSize():string {
        return this.chartOptions.plotOptions.radialBar.hollow.size;
    }
    set setHollowSize(theHollowSize:string) {
        this.chartOptions.plotOptions.radialBar.hollow.size = theHollowSize;
    }
}

export default RadialBarGeneralProperties;
