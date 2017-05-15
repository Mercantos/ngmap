import { Component, OnInit } from '@angular/core';
import { BricMapConfig, BricMapLayer, BricMapLayerType, BricMapLayerSource } from 'bric-gis';

@Component({
  selector: 'config-map',
  templateUrl: './config-map.component.html',
  styleUrls: ['./config-map.component.css']
})
export class ConfigMapComponent implements OnInit {

  layers = new Array();
	config = new BricMapConfig();
	
  componentCode: string = `
    import { BricMapConfig, BricMapLayer, BricMapLayerSource, BricMapLayerType } from 'bric-gis';
    [...]
    export class MyComponent implements OnInit {

    layers = new Array();
    config = new BricMapConfig();

    ngOnInit() {
      this.config.maxZoom = 15;
      this.config.minZoom = 11;
      this.config.zoom = 10;
      this.config.projection = "EPSG:31370";
      this.config.center = [151402.2,167155.7];
      this.config.scaleLine = true;
      this.config.overviewMap = 'urbis';

      let layerUrbis = new BricMapLayer();
      layerUrbis.id = 'urbis';
      layerUrbis.source = BricMapLayerSource.bric;
      layerUrbis.layerName = 'urbisFR';
      this.layers.push(layerUrbis);
    }
  `;

  constructor() { }

  ngOnInit() {

    this.config.maxZoom = 15;
    this.config.minZoom = 11;
		this.config.zoom = 10;
		this.config.projection = "EPSG:31370";
		this.config.center = [151402.2,167155.7];
		this.config.scaleLine = true;
    this.config.overviewMap = 'urbis';

    let layerUrbis = new BricMapLayer();
		layerUrbis.id = 'urbis';
		layerUrbis.source = BricMapLayerSource.bric;
		layerUrbis.layerName = 'urbisFR';
		this.layers.push(layerUrbis);
  }

}
