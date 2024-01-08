class TmapGeneralProperties {
    mapOptions: any = {
        latitude: 37.566481622437934,
        longitude: 126.98502302169841,
        width: '100%',
        height: '400px',
        heatMapRadius: 10,
        heatMapData: []
    }

    get getLatitude():any {
        return this.mapOptions.latitude;
    }

    set latitude(newLatitude:any) {
        if(newLatitude != undefined) {
            this.mapOptions.latitude = newLatitude;
        }
    }

    get getLongitude():any {
        return this.mapOptions.longitude;
    }

    set longitude(newLongitude:any) {
        if(newLongitude != undefined) {
            this.mapOptions.longitude = newLongitude;
        }
    }

    get getWidth():any {
        return this.mapOptions.width;
    }

    set width(newWidth:any) {
        if(newWidth != undefined) {
            this.mapOptions.width = newWidth;
        }
    }

    get getHeight():any {
        return this.mapOptions.height;
    }

    set height(newHeight:any) {
        if(newHeight != undefined) {
            this.mapOptions.height = newHeight;
        }
    }

    get getHeatMapRadius():number {
        return this.mapOptions.heatMapRadius;
    }

    set heatMapRadius(newRadius:number) {
        if(newRadius != undefined) {
            this.mapOptions.heatMapRadius = newRadius;
        }
    }

    get getHeatMapData():Array<any> {
        return this.mapOptions.heatMapData;
    }

    set heatMapData(newData:Array<any>) {
        if(newData != undefined) {
            this.mapOptions.heatMapData = newData;
        }
    }
}

export default TmapGeneralProperties;