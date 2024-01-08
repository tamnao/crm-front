class KakaoMapGeneralProperties {
	mapOptions: any = {
		map: null,
		mapInfo: {
			defaultZoom: 10,
			showInfoWindow: true,
			clustererMinLevel: 10,
		},
		defaultMarkerData: {
			title: "백록담 ",
			address: "제주특별자치도 서귀포시",
			latitude: 33.362203443372394,
			longitude: 126.533415195577,
		},
		markerData: [],
		markers: [],
	};

	get getKakaoMap():any {
		return this.mapOptions.map;
	}

	set kakaoMap(map:any) {
		if(map != undefined) {
			this.mapOptions.map = map;
		}
	}

	get getDefaultZoom():number {
		return this.mapOptions.mapInfo.defaultZoom;
	}

	set defaultZoom(zoom:number) {
		if(zoom != undefined) {
			this.mapOptions.mapInfo.defaultZoom = zoom;
		}
	}

	set showInfoWindow(isShow:boolean) {
		if(isShow != undefined) {
			this.mapOptions.mapInfo.showInfoWindow = isShow;
		}
	}

	get getClustererMinLevel():number {
		return this.mapOptions.mapInfo.clustererMinLevel;
	}

	set clustererMinLevel(level:number) {
		if(level != undefined) {
			this.mapOptions.mapInfo.clustererMinLevel = level;
		}
	}

	get getDefaultMarkerLatitude():number {
		return this.mapOptions.defaultMarkerData.latitude;
	}

	set defaultMarkerLatitude(latitude:number) {
		if(latitude != undefined) {
			this.mapOptions.defaultMarkerData.latitude = latitude;
		}
	}

	get getDefaultMarkerLongitude():number {
		return this.mapOptions.defaultMarkerData.longitude;
	}

	set defaultMarkerLongitude(longitude:number) {
		if(longitude != undefined) {
			this.mapOptions.defaultMarkerData.longitude = longitude;
		}
	}

	get getMarkerData():Array<any> {
        return this.mapOptions.markerData;
    }

	set markerData(data:Array<any>) {
		if(data != undefined) {
			this.mapOptions.markerData = data;
		}
	}

	get getMarkers():Array<any> {
        return this.mapOptions.markers;
    }

	set markers(markers:Array<any>) {
        if(markers != undefined) {
			this.mapOptions.markers = markers;
		}
    }
}

export default KakaoMapGeneralProperties;
