import GeneralProperties from "./GeneralProperties";

class DonutGeneralProperties extends GeneralProperties{
    constructor() {
        super();
        this.chartOptions.fill = {
            type: "gradient"
        }

        this.chartOptions.legend.width = 180;

        this.chartOptions.plotOptions = {
            pie: {
                expandOnClick: false,
                offsetX: -25,
                startAngle: -90,
                endAngle: 270
            }
        }

        this.chartOptions.fill = {
            type: 'solid'
        }

        this.chartOptions.tooltip = {
            enabled: true,
            shared: false,
            y: {
                formatter: function(val:any, index:any) {
                    return Number(val).toLocaleString();
                }
            }
        }
    }
    set plotOptionsPie(plotOptionsPie:any) {
        if(plotOptionsPie != undefined) {
            this.chartOptions.plotOptions.pie = plotOptionsPie;
        }
    }
}

export default DonutGeneralProperties;