import { Component, OnInit } from '@angular/core';
import { BricMapConfig, BricMapLayer, BricMapLayerType, BricMapLayerSource } from 'bric-gis';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
	title = 'app works!';
	
	layers = new Array();
	config = new BricMapConfig();
	definedLayers = new Array();

	map: any;
	showOverviewMap = false;
	activeLayer = new Array();
	
	ngOnInit() {
		this.config.maxZoom = 20;
		this.config.zoom = 10;
		this.config.projection = "EPSG:31370";
		this.config.center = [151402.2,167155.7];
		this.config.scaleLine = true;

		let layerUrbis = new BricMapLayer();
		layerUrbis.id = 'urbis';
		layerUrbis.source = BricMapLayerSource.bric;
		layerUrbis.layerName = 'urbisFR';
		this.layers.push(layerUrbis);
		this.activeLayer.push(true);
		this.definedLayers.push(layerUrbis);
	
		let layerOrtho = new BricMapLayer();
		layerOrtho.id = 'ortho';
		layerOrtho.source = BricMapLayerSource.bric;
		layerOrtho.layerName = 'ortho';
		layerOrtho.alpha = 0.5;
		//this.layers.push(layerOrtho);
		this.activeLayer.push(false);
		this.definedLayers.push(layerOrtho);

		let layerPostcards = new BricMapLayer();
		layerPostcards.id = 'bruciel';
		layerPostcards.source = BricMapLayerSource.custom;
		layerPostcards.location = 'http://geoservices-others.irisnet.be/geoserver/Bruciel/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Bruciel:POSTCARDS_VW&outputFormat=application%2Fjson';
		layerPostcards.type = BricMapLayerType.wfs;
		layerPostcards.cluster = true;
		layerPostcards.clusterDistance = 20;
		layerPostcards.selectable = true;
		layerPostcards.styles = {
			property: 'PERIOD',
			values: [
				{
					fillColor: "#ff0000",
					strokeColor: "#ffff00",
					value: '1970',
					type: 'circle'
				},
				{
					fillColor: "#ff00ff",
					strokeColor: "#00ff00",
					type: 'circle',
					default: true
				}
			]
		};
		this.layers.push(layerPostcards);
		this.activeLayer.push(true);
		this.definedLayers.push(layerPostcards);
	}
	
	updateOverviewMap() {
		if (this.showOverviewMap) {
			this.config.overviewMap = 'urbis';
		} else {
			this.config.overviewMap = null;
		}
	}

	updateLayers() {
		let layers = new Array();
		for(let i in this.activeLayer) {
			if(this.activeLayer[i]) {
				layers.push(this.definedLayers[i]);
			}
		}
		this.layers = layers;
	}

	switchLang() {
		if (this.layers[0].layerName == 'urbisFR') {
			console.log('set NL');
			this.layers[0].layerName = 'urbisNL';
		} else {
			this.layers[0].layerName = 'urbisFR';
			console.log('set FR');
		}
	}

	mapEvent(event) {
		console.log('event received', event);
	}
}
