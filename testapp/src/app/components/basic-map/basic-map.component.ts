import { Component, OnInit } from '@angular/core';
import { BricMapConfig, BricMapLayer, BricMapLayerType, BricMapLayerSource } from 'bric-gis';

@Component({
  selector: 'basic-map',
  templateUrl: './basic-map.component.html',
  styleUrls: ['./basic-map.component.css']
})
export class BasicMapComponent implements OnInit {

  layers = new Array();
	config = new BricMapConfig();
	
  componentCode: string = `
    import { BricMapConfig, BricMapLayer, BricMapLayerSource, BricMapLayerType } from 'bric-gis';
    [...]
    export class MyComponent implements OnInit {

    layers = new Array();
    config = new BricMapConfig();

    ngOnInit() {
      let layerUrbis = new BricMapLayer();
      layerUrbis.id = 'urbis';
      layerUrbis.source = BricMapLayerSource.bric;
      layerUrbis.layerName = 'urbisFR';
      this.layers.push(layerUrbis);
      
      let layerOrtho = new BricMapLayer();
      layerOrtho.id = 'ortho';
      layerOrtho.source = BricMapLayerSource.bric;
      layerOrtho.layerName = 'ortho';
      layerOrtho.alpha = 0.5;
      this.layers.push(layerOrtho);

      let layerCustom = new BricMapLayer();
      layerCustom.id = 'customLayer';
      layerCustom.source = BricMapLayerSource.custom;
      layerCustom.location = 'https://geoservices-urbis.irisnet.be/geoserver/wms';
      layerCustom.layerName = 'Urbis:Mu';
      layerCustom.type = BricMapLayerType.wms;
      this.layers.push(layerCustom);
		
    }
  }
  `;
  constructor() { }

  ngOnInit() {
		let layerUrbis = new BricMapLayer();
		layerUrbis.id = 'urbis';
		layerUrbis.source = BricMapLayerSource.bric;
		layerUrbis.layerName = 'urbisFR';
		this.layers.push(layerUrbis);
		
		let layerOrtho = new BricMapLayer();
		layerOrtho.id = 'ortho';
		layerOrtho.source = BricMapLayerSource.bric;
		layerOrtho.layerName = 'ortho';
		layerOrtho.alpha = 0.5;
		this.layers.push(layerOrtho);
		
    let layerCustom = new BricMapLayer();
		layerCustom.id = 'customLayer';
		layerCustom.source = BricMapLayerSource.custom;
		layerCustom.location = 'https://geoservices-urbis.irisnet.be/geoserver/wms';
    layerCustom.layerName = 'Urbis:Mu';
    layerCustom.type = BricMapLayerType.wms;
		this.layers.push(layerCustom);
		
  }


}
