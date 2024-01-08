<template>
	<div class="container">
		<!-- map-wrap -->
		<div id="map" class="map-wrap">

			<!-- Reset to default center coordinate -->
			<el-button
				circle
				size="medium"
				class="reset-btn radius-border"
				@click="resetToCenter()"
				icon="el-icon-location"
			/>
		</div>
		<!-- //map-wrap -->
	</div>
</template>


<script>
    import KakaoMapGeneralProperties from "@/model/chart/KakaoMapGeneralProperties";

	const kakaoSrc = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&libraries=services&appkey=";
	const apiKey = "09b7721c67514023d5e9a2b0f5234ebc&libraries=clusterer";

    let kakaoMapGeneralProperties = new KakaoMapGeneralProperties();


	export default {
		props: ["data"],
		methods: {
			createMap() {
                kakaoMapGeneralProperties.defaultZoom = this.data.chartInfo.defaultZoom;
				kakaoMapGeneralProperties.showInfoWindow = this.data.chartInfo.showInfoWindow;
                kakaoMapGeneralProperties.clustererMinLevel = this.data.chartInfo.clustererMinLevel;
                kakaoMapGeneralProperties.defaultMarkerLatitude = this.data.chartInfo.defaultMarkerLatitude;
                kakaoMapGeneralProperties.defaultMarkerLongitude = this.data.chartInfo.defaultMarkerLongitude;

                let kakao = window.kakao;

                kakaoMapGeneralProperties.markerData = this.data.markerData;

				let container = document.getElementById("map");
				let options = {
					center: this.getDefaultCoordinate(),
					level: kakaoMapGeneralProperties.getDefaultZoom
				}

				kakaoMapGeneralProperties.kakaoMap = new kakao.maps.Map(container, options);

                this.createMarkers();

                let clusterer = new kakao.maps.MarkerClusterer( {
                    map: kakaoMapGeneralProperties.getKakaoMap,
                    averageCenter: true,
                    minLevel: kakaoMapGeneralProperties.getClustererMinLevel,
                })
                    
                clusterer.addMarkers(kakaoMapGeneralProperties.getMarkers);
                
				this.resetBounds();
			},
			createMarkers() {
				let kakao = window.kakao;
                let markers = []; 
				for(let [index, data] of kakaoMapGeneralProperties.getMarkerData.entries()) {
					let marker = new kakao.maps.Marker({
						map: kakaoMapGeneralProperties.getKakaoMap,
						position: new kakao.maps.LatLng(data.latitude, data.longitude)
					})

					marker.setImage(this.getDefaultMarkerImage());
					marker.data = data;
					
					let that = this;
					kakao.maps.event.addListener(
						marker, 
						'mouseover',
						function () {
							that.markerMouseOver(marker);
						}						
					)

					kakao.maps.event.addListener(
						marker, 
						'mouseout',
						function() {
							that.markerMouseOut(marker)
						}
					)

					markers.push(marker);
				}
                kakaoMapGeneralProperties.markers = markers;
			},			
			getDefaultCoordinate() {
				return new window.kakao.maps.LatLng(kakaoMapGeneralProperties.getDefaultMarkerLatitude, kakaoMapGeneralProperties.getDefaultMarkerLongitude);
			},
			markerMouseOver(marker) {				
				marker.infoWindow = this.createInfoWindow(marker.data);
				marker.infoWindow.open(kakaoMapGeneralProperties.getKakaoMap, marker);
				marker.setImage(this.getMouseOverMarkerImage());
			},
			createInfoWindow(data) {
				const kakao = window.kakao;
				let iwContent =
					"<div class='infoWin' align='left'><ul style='width:100%;list-style-type: none'>";
				for (let i in data) {
					if (i != "latitude" && i != "longitude") {
						if (data[i] == "true") {
							iwContent += "<li>- " + i + ": O </li>";
						} else if (data[i] == "false") {
							iwContent += "<li>- " + i + ": X </li>";
						} else {
							iwContent +=
								"<li>- " + i + ": " + data[i] + " </li>";
						}
					}
				}
				iwContent += "</ul></div>";

				return new kakao.maps.InfoWindow({
					content: iwContent,
				});
			},
			markerMouseOut(marker) {
				marker.setImage(this.getDefaultMarkerImage());
				marker.infoWindow.close();
				delete marker.infoWindow;
			},
			getDefaultMarkerImage() {
				let kakao = window.kakao;
				let imageSrc = this.data.chartInfo.markerIcon;
				let imageSize = new kakao.maps.Size(24, 35);
				return new kakao.maps.MarkerImage(imageSrc, imageSize);
			},
			getMouseOverMarkerImage() {
				let kakao = window.kakao;
				let imageSrc = this.data.chartInfo.markerHoverIcon;
				let imageSize = new kakao.maps.Size(24, 35);
				return new kakao.maps.MarkerImage(imageSrc, imageSize);
			},
			resetToCenter() {
				kakaoMapGeneralProperties.getKakaoMap.setCenter(this.getDefaultCoordinate());
				kakaoMapGeneralProperties.getKakaoMap.setLevel(kakaoMapGeneralProperties.getDefaultZoom);
			},
			resetBounds() {
				const kakao = window.kakao;
				let bounds = new kakao.maps.LatLngBounds();

				for (let i = 0; i < kakaoMapGeneralProperties.getMarkers.length; i++) {
					bounds.extend(kakaoMapGeneralProperties.getMarkers[i].getPosition());
				}
				kakaoMapGeneralProperties.getKakaoMap.setBounds(bounds);
			}
		},
		mounted() {
			if (window.kakao && window.kakao.maps) { // true: auto-reloading when source is modified
				this.createMap();
			} else { // reload or accesss
				const script = document.createElement("script");
				script.src = kakaoSrc + apiKey;
				script.onload = () => {
					window.kakao.maps.load(this.createMap);	
				} 
				document.head.appendChild(script);
			}
		}
	}
</script>

<style scoped>
	.map-wrap {
		position: relative;
		width: 100%;
		height: 400px;
		z-index: 1;
	}
	.reset-btn {
		position: absolute;
		bottom: 10px;
		right: 10px;
		overflow: hidden;
		z-index: 2;
		background-color: #ffffff;
	}
	.reset-btn:focus {
		background-color: #ffffff;
	}
	.reset-btn:hover,
	.reset-btn:focus:hover {
		background: #f5f5f5;
		border: 1px solid #e4e4e4;
	}
	.reset-btn:focus,
	.reset-btn:active {
		background-color: #ffffff;
		color: #606266;
		border: 1px solid #e4e4e4;
	}
	.reset-btn:hover >>> i,
	.reset-btn:focus >>> i,
	.reset-btn:active >>> i {
		color: #606266 !important;
	}
</style>

