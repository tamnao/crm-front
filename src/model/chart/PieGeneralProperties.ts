import GeneralProperties from "@/model/chart/GeneralProperties";

class PieGeneralProperties extends GeneralProperties{
    constructor() {
        super();
        this.chartOptions.fill = {
            type: "solid"
        }

        this.chartOptions.legend.width = 180;

        this.chartOptions.plotOptions = {
            pie: {
                expandOnClick: false,
                offsetX: -25
            }
        }

        this.chartOptions.dataLabels = {
            enabled: this.chartOptions.dataLabels.enabled,
            formatter : function (val:any) {
                if(val == 100) 
                    return val + "%";
                else 
                    return val.toFixed(1) + "%"
              },
        }
    }
}

export default PieGeneralProperties;