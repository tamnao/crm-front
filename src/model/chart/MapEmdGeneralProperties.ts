class MapEmdGeneralProperties {
	options = {
		postfix: "개"
	};
	mapOptions: any = {
		title: {
			text: ''
		},

		tooltip: {
			trigger: "item",
			showDelay: 0,
			transitionDuration: 0.2,
			formatter: (params:any) => {
				let value: any = (params.value + "").split(".");
                value = (isNaN(value[0]) ? "0" : value[0]).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,"$1,");

				return (
					params.name + ": " + value + this.options.postfix
				);
			},
		},
		visualMap: {
			right: 15,
			bottom: 20,
			min: 500000,
			max: 1000000,
			text: ["최고", "최저"],
			realtime: false,
			calculable: true,
			inRange: {
				color: [
					'#313695',
					'#4575b4',
					'#74add1',
					'#abd9e9',
					'#e0f3f8',
					'#ffffbf',
					'#fee090',
					'#fdae61',
					'#f46d43',
					'#d73027',
					'#a50026'
				]
			},
			formatter: function(value:any) {
				value = Math.round(value);
				return (isNaN(value) ? "0" : value + "").replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,"$1,");
			}
		},
		series: [
			{
				name: '',
				type: 'map',
				aspectScale: 0.9,
				roam: false,
				map: 'Jeju',
				data: [],
				emphasis: {
					label: {
						show: false
					}
				}
			}
		],
	}

	set postfix(postfix: string) {
		if (postfix != undefined) {
			this.options.postfix = postfix;
		}
	}
	set mapTitle(title:string) {
		if(title != undefined) {
			this.mapOptions.title.text = title;
		}
	}

	set tooltipFormatter(formatter:any) {
		if(formatter != undefined) {
			this.mapOptions.tooltip.formatter = formatter;
		}
	}

	set legendHorizontalPosition(legendHorizontalPosition:string) {
		if(legendHorizontalPosition != undefined) {
			this.mapOptions.visualMap.left = legendHorizontalPosition;
		}
	}

	set minRange(min:number) {
		if(min != undefined) {
			this.mapOptions.visualMap.min = min;
		}
	}

	set maxRange(max:number) {
		if(max != undefined) {
			this.mapOptions.visualMap.max = max;
		}
	}

	set legendText(legendText:string[any]) {
		if(legendText != undefined) {
			this.mapOptions.visualMap.text = legendText;
		}
	}

	set rangeColor(colors:any[]) {
		if(colors != undefined) {
			this.mapOptions.visualMap.inRange.color = colors;
		}
	}

	set legendVerticalPosition(legendVerticalPosition:string) {
		if(legendVerticalPosition != undefined) {
			this.mapOptions.visualMap.top = legendVerticalPosition;
		}
	}

	set seriesName(location:string) {
		if(location != undefined) {
			this.mapOptions.series[0].name = location;
		}
	}

	set seriesType(chartType:string) {
		if(chartType != undefined) {
			this.mapOptions.series[0].type = chartType;
		}
	}

	set seriesRoam(enableScrollZoom:boolean) {
		if(enableScrollZoom != undefined) {
			this.mapOptions.series[0].roam = enableScrollZoom;
		}
	}

	set seriesMap(location:string) {
		if(location != undefined) {
			this.mapOptions.series[0].map = location;
		}
	}

	set seriesData(data:any[]) {
		if(data != undefined) {
			this.mapOptions.series[0].data = data;
		}
	}

	
}

export default MapEmdGeneralProperties;