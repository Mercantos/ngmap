import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { IterableDiffers, KeyValueDiffers } from '@angular/core';
import { DoCheck } from '@angular/core';
import * as ol from 'openlayers';
import * as proj4 from 'proj4';

import { BricMapConfig } from './models/BricMapConfig';
import { BricMapLayer } from './models/BricMapLayer';
import { MapEventService } from './MapEvent.service';

@Component({
  selector: 'bric-map',
  template: '<div id="map"></div>',
  styles: ['.bric-scale-line.ol-scale-line { position: relative; bottom: 30px; left: -20px; float:right; } #map{height: 400px;}'],
  encapsulation: ViewEncapsulation.None,
  providers: [MapEventService]
})
export class BricMapComponent implements OnInit, DoCheck {

    /******************************
	 * INPUTS
	 * ****************************/
	@Input() config: BricMapConfig;
	@Input() layers: BricMapLayer[];
	
    /******************************
	 * OUTPUTS
	 * ****************************/
	@Output() mapInitialized = new EventEmitter<ol.Map>();
    @Output() mapEvent = new EventEmitter<any>();

    /******************************
	 * CHANGE DETECTION
	 * ****************************/
    private _configDiffer: any;
    private _layersDiffer: any;
    private _layersItemDiffer: any = {};
    
    /******************************
	 * MAP PROPERTIES
	 * ****************************/
    private _scaleLine: ol.control.ScaleLine;
    private _overviewMap: ol.control.OverviewMap;
	private map: ol.Map;
	private view: ol.View;

    /******************************
	 * INITIALISATION
	 * ****************************/
	constructor(
        private _kVDiffers: KeyValueDiffers,
        private _iDiffers: IterableDiffers,
        private _mapEventService: MapEventService
    ) {
	}
  
	ngOnInit() {
		if (!this.map) {
            this.initMap();
        }
        // Changes detection variables
        this._configDiffer = this._kVDiffers.find(this.config).create(null);
        this._layersDiffer = this._iDiffers.find(this.layers).create(null);
        this._mapEventService.events.subscribe(
            (event) => {
                if(event) {
                    this.mapEvent.emit(event);
                }
            }
        );
	}

    private initMap() {
		proj4.defs(
            'EPSG:31370',
            '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013'
            +
            '+y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs'
        );
        ol.proj.setProj4(proj4);
        
        this.view = new ol.View({
            center: this.config.center,
            zoom: this.config.zoom,
            minZoom: this.config.minZoom,
            maxZoom: this.config.maxZoom,
            projection: this.config.projection,
        });

        this.map = new ol.Map({
            layers: [],
            target: 'map',
            logo: false,
            view: this.view
        });

        this._scaleLine = new ol.control.ScaleLine({units:'metric', className: 'bric-scale-line ol-scale-line'});
        if (this.config.scaleLine) {
            this.map.addControl(this._scaleLine);
        }
        this.addOverViewMap();
        this.mapInitialized.emit(this.map);
        this.map.on('moveend', this.checkClusters, this);
	}

    /******************************
	 * CHANGE DETECTION
	 * ****************************/
    ngDoCheck() {
        if (this._configDiffer) {
            const confChanges = this._configDiffer.diff(this.config);
            if (confChanges) {
                this.updateMapConfig(confChanges);
            }
        }

        if (this._layersDiffer) {
            const layersChange = this._layersDiffer.diff(this.layers);
            if (layersChange) {
                this.updateLayers(layersChange);
            }
        }

        // Check if layers have changed
        for (let i = 0; i < this.layers.length; i++) {
            const layerChange = this._layersItemDiffer[this.layers[i].id].diff(this.layers[i]);
            if (layerChange) {
                this.updateLayerParams(layerChange, i);
            }
        }
    }

    private updateMapConfig(changes:any) {
        changes.forEachChangedItem(
            (record: any) => {
                let currentZoom = this.map.getView().getZoom();
                switch(record.key) {
                    case 'projection':
                    case 'minZoom':
                    case 'minZoom':
                        this.map.getView().set(record.key, record.currentValue);
                        break;
                    case 'scaleLine':
                        if (record.currentValue) {
                            this.map.addControl(this._scaleLine);
                        } else {
                            this.map.removeControl(this._scaleLine);
                        }
                        break;
                    case 'overviewMap':
                        this.addOverViewMap();
                        break;
                }
            }
        );
    }

    private updateLayers(changes: any) {
        changes.forEachRemovedItem((r:any) => {
            // Remove the layers from the map
            let id = r.item.id;
            this.map.removeLayer(r.item.getOpenlayerObject());
            this.map.removeInteraction(r.item.getClusterInteraction());
            delete this._layersItemDiffer[id];
        });


        changes.forEachAddedItem((r:any) => {
            // Add the layers from the map
            let id = r.item.id;
            let index = this.getLayerIndex(id);
            this.layers[index].setMap(this.map);
            this.layers[index].setMapEventService(this._mapEventService);
            if (index != -1) {
                this.map.getLayers().insertAt(index, this.layers[index].getOpenlayerObject(this.map.getView().getZoom()));
                this._layersItemDiffer[id] = this._kVDiffers.find(this.layers[index]).create(null);
            }
        });
    }

    private updateLayerParams(changes: any, index: number) {
        let mustUpdateSource = false;
        changes.forEachChangedItem(
            (record: any) => {
                switch(record.key) {
                    case 'source':
                    case 'projection':
                    case 'type':
                        // We can't change the properties
                        this.layers[index][record.key] = record.previousValue
                        break;
                    case 'location':
                    case 'layerName':
                    case 'params':
                        // Url will change, get the new one
                        mustUpdateSource = true;
                        break;
                    case 'alpha':
                        // Change tranparency
                        this.layers[index].getOpenlayerObject().setOpacity(record.currentValue);
                        break;
                    case 'visible':
                        // Change visibility
                        this.layers[index].getOpenlayerObject().setVisible(record.currentValue);
                        break;
                    case 'cluster':
                        // Deal with interaction
                        this.layers[index].getClusterInteraction().setActive(record.currentValue);
                        
                        // Depending on zoom level, we might have to show/hide clusters
                        this.checkClusters();
                        break;
                    case 'clusterColor':
                        // Remove cached styles
                        this.layers[index].resetClusterStyles();
                        break;
                    case 'clusterDistance':
                        // Recalculate clusters
                        this.layers[index].resetClusterDistance(record.currentValue);
                        break;
                    case 'clusterZoom':
                        this.layers[index].getOpenlayerObject().set('clusterOn', record.currentValue);
                        break;
                    case 'selectable':
                        // Deal with interaction
                        this.layers[index].getFeaturesInteraction().setActive(record.currentValue);
                        
                }
            }
        );
        if (mustUpdateSource) {
            // Source update is done at the end so source, projection and type are reset
            this.layers[index].updateSource();
        }
    }

    private getLayerIndex(id: string) {
        let index = 0;
        for (let i in this.layers) {
            if (this.layers[i].id == id) {
                return index;
            }
            index++;
        }

        return -1;
    }

    private addOverViewMap() {
        if (!this._overviewMap){
            this._overviewMap = new ol.control.OverviewMap({
                collapsed: true,
                // tipLabel: A ajouter dans une future version,
                layers: [],
                view : new ol.View({
                    center: this.config.center,
                    maxZoom: this.config.maxZoom,
                    minZoom:this.config.minZoom,
                    projection: this.config.projection
                })
            });
        }
        if(this._overviewMap.getOverviewMap().getLayers().item(0)) {
            this._overviewMap.getOverviewMap().removeLayer(this._overviewMap.getOverviewMap().getLayers().item(0));
        }
        if(this.config.overviewMap) {
            let overviewLayer = this.layers.filter(item => item.id === this.config.overviewMap);
            if(overviewLayer.length > 0) {
                this._overviewMap.getOverviewMap().addLayer(overviewLayer[0].getOpenlayerObject());
                this.map.addControl(this._overviewMap);
            } else {
                this.map.removeControl(this._overviewMap);
            }
        } else {
            this.map.removeControl(this._overviewMap);
        }
    }

    /******************************
	 * CLUSTERS
	 * ****************************/
    checkClusters() {
        let currentZoom = this.map.getView().getZoom();
        for(let i = 0; i < this.layers.length; i++) {
            let showCluster = false;
            let layer = this.layers[i].getOpenlayerObject();
            if(layer instanceof ol.layer.Group){
                let zoomLevel = layer.get('clusterOn');
                if(currentZoom < zoomLevel) {
                    showCluster = this.layers[i].cluster;
                }
                layer.getLayers().item(0).setVisible(showCluster);
                layer.getLayers().item(1).setVisible(!showCluster);
                this.layers[i].getClusterInteraction().setActive(showCluster);
                this.layers[i].getFeaturesInteraction().setActive(!showCluster);
            }
        }
    }
}
