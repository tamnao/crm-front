<template>
	<!-- <div class="container"> -->
		<div :id="'map_div_' + data.mapInfo.mapId"></div>
	<!-- </div> -->
</template>

<script>
    import TmapGeneralProperties from "@/model/chart/TmapGeneralProperties";
    const tmapSrc = "https://apis.openapi.sk.com/tmap/jsv2?version=1&format=javascript&appkey=";
    const apiKey = "l7xxff783dd140f849c68b4a9b3294aa496d"; // api key for develop
//    const apiKey = "l7xxf14c982426544d6686ad60b358c843ca"; // api key for production
	let tmapGeneralProperties = new TmapGeneralProperties();

export default {
    props: ["data"],
    // name: 'TmapHeatMap',
    data() {
        return {
            map: '',
            infoWindow: '',
            zoomLevel: 5,
        }
    },
    methods: {
        initTmap() {
            tmapGeneralProperties.latitude = this.data.mapInfo.latitude;
            tmapGeneralProperties.longitude = this.data.mapInfo.longitude;
            tmapGeneralProperties.width = this.data.mapInfo.width;
            tmapGeneralProperties.height = this.data.mapInfo.height;
            tmapGeneralProperties.heatMapRadius = this.data.mapInfo.heatMapRadius;
            tmapGeneralProperties.heatMapData = this.data.mapData;

            this.map = new window.Tmapv2.Map("map_div_"+this.data.mapInfo.mapId, { // 지도가 생성될 div
                center : new window.Tmapv2.LatLng(tmapGeneralProperties.getLatitude, tmapGeneralProperties.getLongitude), // 지도 초기 좌표
                width : tmapGeneralProperties.getWidth, // map의 width 설정
                height : tmapGeneralProperties.getHeight // map의 height 설정	
            });

            this.map.setZoom(this.data.mapInfo.zoomLevel);

            this.map.addListener("zoom_changed", this.onChanged);
            this.map.addListener("dragend", this.onDrag);
            this.map.addListener("click", this.getAddressUsingLonLat);

            this.addHeatmap();
        },

        onChanged(e) {
            let center = this.map.getCenter();
            this.$emit('zoom', {zoomLevel: e.zoom, center: center});
        },

        onDrag(e) {
            let center = this.map.getCenter();
            this.$emit('drag', center);
        },

        getAddressUsingLonLat(e) {
            let lantitude = e.latLng._lat;
            let longitude = e.latLng._lng;
            let tData = new window.Tmapv2.extension.TData();
            tData._appKey = apiKey;

            let optionObj = {
                coordType: "WGS84GEO",
                addressType: "A02"
            }

            let params = {
                onComplete: this.onAddressUsingLonLatComplete,
                onProgress: this.onAddressUsingLonLatProgress,
                onError: this.onAddressUsingLonLatError
            }
            
            tData.getAddressFromGeoJson(lantitude, longitude, optionObj, params);
            // let lantitude = e.latLng._lat;
            // let longitude = e.latLng._lng;
            // this.infoWindow = new window.Tmapv2.InfoWindow({
            //     position: new window.Tmapv2.LatLng(lantitude, longitude), //Popup 이 표출될 맵 좌표
            //     content: this.data.mapInfo.infoWindowContent, //Popup 표시될 text
            //     border :'0px solid #FF0000', //Popup의 테두리 border 설정.
            //     type: 2, //Popup의 type 설정.
            //     map: this.map //Popup이 표시될 맵 객체
            // });
        },

        onAddressUsingLonLatComplete(e) {
            // console.log("e ", e);
            if(e._responseData.addressInfo) {
                //console.log('sigungu ', e._responseData.addressInfo.gu_gun);
                //console.log('emd ', e._responseData.addressInfo.roadName);
                this.$emit('point', e._responseData.addressInfo);
            }

            // let result = '현재 지도의 중심 좌표주소 : ' + e._responseData.addressInfo.fullAddress;

            // let marker = new window.Tmapv2.Marker({
            //     position: new window.Tmapv2.LatLng(37.29062,127.051755),
            //     label: result
            // });

            // marker.setMap(this.map);
            // this.map.setCenter(new window.Tmapv2.LatLng(37.29062,127.051755));
        },

        onAddressUsingLonLatProgress() {
            //console.log("aaaaaaa");
        },

        onAddressUsingLonLatError() {
            //console.log("vvvvvv");
        },

        setZoomLevel(newCoordinate) {
            // this setZoom method has a limitation where it will zoom in and then shrinks when it reach the maximum zoom level (19)
            this.map.setZoom(newCoordinate.zoomLevel);
            this.map.setCenter(newCoordinate.center);
        },

        setNewCoordinate(newCoordinate) {
            this.map.setCenter(newCoordinate);
        },

        onClose(popup){
            this.infoWindow.setVisible(false);
        },

        addHeatmap() {
            let bounds = new window.Tmapv2.base.LatLngBounds();

            for (var i = 0; i < tmapGeneralProperties.getHeatMapData.length; i++) {
                bounds.extend(new window.Tmapv2.LatLng(tmapGeneralProperties.getHeatMapData[i].lat, tmapGeneralProperties.getHeatMapData[i].lng));
            }

            let heatmap = new window.Tmapv2.extension.HeatMap({
                map: this.map,
                radius: tmapGeneralProperties.getHeatMapRadius,
                data: {
                    data: this.data.mapData,
                    max: 10
                }
            });

            this.map.fitBounds(bounds);
        }
    },
    mounted() {
        if(window.Tmapv2) {
            this.initTmap();
        }
        else {
            const script = document.createElement("script");
            const externalScript = document.createElement("script");
            const jQueryScript = document.createElement("script");
            script.src = tmapSrc + apiKey;
            externalScript.src = 'https://topopentile1.tmap.co.kr/scriptSDKV2/tmapjs2.min.js?version=20211012';
            jQueryScript.src = '//code.jquery.com/jquery-3.2.1.min.js';
            jQueryScript.onload = () => {
                script.onload = () => {
                    externalScript.onload = () => {
                        this.initTmap();
                    }
                    document.head.appendChild(externalScript);
                }
                document.head.appendChild(script);
            }
            document.head.appendChild(jQueryScript);
            
        }
    }
}
</script>
