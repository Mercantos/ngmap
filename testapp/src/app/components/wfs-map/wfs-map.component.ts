import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BricMapConfig, BricMapLayer, BricMapLayerType, BricMapLayerSource } from 'bric-gis';

@Component({
  selector: 'wfs-map',
  templateUrl: './wfs-map.component.html',
  styleUrls: ['./wfs-map.component.css']
})
export class WfsMapComponent implements OnInit {

  @Output()
  changePage = new EventEmitter();

  layers = new Array();
	config = new BricMapConfig();
  lastEvents = [];
	event = null;

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
      
      let layerPostcards = new BricMapLayer();
      layerPostcards.id = 'bruciel';
      layerPostcards.source = BricMapLayerSource.custom;
      layerPostcards.location = 'http://geoservices-others.irisnet.be/geoserver/Bruciel/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Bruciel:POSTCARDS_VW&outputFormat=application%2Fjson';
      layerPostcards.type = BricMapLayerType.wfs;
      layerPostcards.selectable = true;
      this.layers.push(layerPostcards);
      
    }
  `;

  constructor() { }

  ngOnInit() {
    let layerUrbis = new BricMapLayer();
		layerUrbis.id = 'urbis';
		layerUrbis.source = BricMapLayerSource.bric;
		layerUrbis.layerName = 'urbisFR';
		this.layers.push(layerUrbis);
		
    let layerPostcards = new BricMapLayer();
		layerPostcards.id = 'bruciel';
		layerPostcards.source = BricMapLayerSource.custom;
		layerPostcards.location = 'http://geoservices-others.irisnet.be/geoserver/Bruciel/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Bruciel:POSTCARDS_VW&outputFormat=application%2Fjson';
		layerPostcards.type = BricMapLayerType.wfs;
		layerPostcards.selectable = true;
		this.layers.push(layerPostcards);
		
  }

  setEvent(event) {
    event.feature = '[ol.Feature Object id:' + event.feature.getId() + ']';
    this.lastEvents.push(JSON.stringify(event));
    if (this.lastEvents.length > 10) {
      this.lastEvents = this.lastEvents.slice(this.lastEvents.length - 10);
    }
    this.event = this.lastEvents.join("\n");
  }

}
