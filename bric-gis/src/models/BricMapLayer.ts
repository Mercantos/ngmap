import { MapEventService } from '../MapEvent.service';
import { BricMapEvent } from './BricMapEvent';
import { BricMapLayerStyle } from './BricMapLayerStyle';
export enum BricMapLayerSource {bric, custom}
export enum BricMapLayerType {wms, wfs}

export class BricMapLayer {
	[key:string]: any;
	// Common properties
	id: string;
    source: BricMapLayerSource;
	location: string;
	layerName: string;
	alpha: number = 1;
	visible: boolean = true;
	projection: string = 'EPSG:31370';
	// Custom properties
	type: BricMapLayerType;
	params: Object;
	styles: BricMapLayerStyle;
	// Type wfs cluster properties
	cluster: boolean = false;
	clusterZoomLevel: number = 17;
	clusterDistance: number = 20;
	clusterColor: string = '#3399CC';
	selectable: boolean = false;
	// Communication service
	_mapEventService: MapEventService;
	

	private _openLayerObject: ol.layer.Tile | ol.layer.Vector | ol.layer.Group;
	private _openLayerVector: ol.layer.Vector;
	private _openLayerCluster: ol.layer.Vector;

	// Cluster management properties
	private _clusterInteraction: ol.interaction.Select = null;
	private _styleCache: any = {};

	// Selectable property
	private _featureSelectInteraction: ol.interaction.Select = null;

	// Link to the map
	private _map: ol.Map = null;

	/******************************
	 * ol layer
	 * ****************************/
	private initOpenLayerObject(currentZoom: number){
		let self = this;
		if (this.source === BricMapLayerSource.custom) {
			if (this.type === BricMapLayerType.wfs){
				let source = this.initCustomWfsSource();
				this._openLayerVector = new ol.layer.Vector({
					source: source,
					opacity: this.alpha,
					visible: this.visible
				});
				if (this.styles) {
					this._openLayerVector.setStyle(function (feature) {
						return self._getWfsStyle(feature)
					});
				}
				this.initFeaturesInteraction();
				
				let clusterSource = new ol.source.Cluster({
					distance: this.clusterDistance,
					source: source
				});
				let self = this;
				this._openLayerCluster = new ol.layer.Vector({
					source: clusterSource,
					style: function (feature: ol.Feature) {
						let size = feature.get('features').length;
						let radius = (size > 20) ? 20 : (size < 10) ? 10 : size;
						let lum = (100 - size) / 100;
						let color = self.colorLuminance(self.clusterColor, lum);
						let style = self._styleCache[size];
						if (!style) {
							style = new ol.style.Style({
								image: new ol.style.Circle({
									radius: radius,
									stroke: new ol.style.Stroke({
										color: '#fff'
									}),
									fill: new ol.style.Fill({
										color: color
									})
								}),
								text: new ol.style.Text({
									text: size.toString(),
									fill: new ol.style.Fill({
										color: '#fff'
									})
								})
							});
							self._styleCache[size] = style;
						}
						return style;
					}
				});
				// Set visibility
				let showClusters = false;
				if (currentZoom < this.clusterZoomLevel) {
					showClusters = this.cluster;
				}
				this._openLayerCluster.setVisible(showClusters);
				this._openLayerVector.setVisible(!showClusters);
				this._openLayerObject = new ol.layer.Group({
					layers: [this._openLayerCluster, this._openLayerVector]
				});
				this._openLayerObject.set('clusterOn', this.clusterZoomLevel);
				this.initClusterInteraction();
			} else {
				this._openLayerObject = new ol.layer.Tile({
                	source: this.initCustomWmsSource(),
					opacity: this.alpha,
					visible: this.visible
        		});
			}
		} else {
			this._openLayerObject = new ol.layer.Tile({
                source: this.initBricSource(),
				opacity: this.alpha,
				visible: this.visible
        	});
		}
		this._openLayerObject.set('bricGisId', this.id);
	}

	updateSource() {
		if (this._openLayerObject instanceof ol.layer.Group){
			let layer = this._openLayerObject.getLayers().item(1);
		}
		
		if (this.source === BricMapLayerSource.custom) {
			if (this.type === BricMapLayerType.wfs){
				if (this._openLayerObject instanceof ol.layer.Group){
					this._openLayerVector.setSource(this.initCustomWfsSource());
				} else {
					this._openLayerObject.setSource(this.initCustomWfsSource());
				}
			} else {
				if (this._openLayerObject instanceof ol.layer.Group){
					this._openLayerVector.setSource(this.initCustomWfsSource());
				} else {
					this._openLayerObject.setSource(this.initCustomWfsSource());
				}
			}
		} else {
			if (this._openLayerObject instanceof ol.layer.Group){
					this._openLayerVector.setSource(this.initBricSource());
				} else {
					this._openLayerObject.setSource(this.initBricSource());
				}
		}
	}

	private initBricSource() {
		let url = '';
		switch (this.location) {
			case 'others':
				url = 'https://geoservices-others.irisnet.be/geoserver/wms';
				break;
			default: 
				url = 'https://geoservices-urbis.irisnet.be/geoserver/wms';
		}
		let params = {};
		switch (this.layerName) {
			case 'municipality':
				params = {'LAYERS': 'Urbis:Mu'};
				break;
			case 'ortho':
			case 'ortho2015':
				params = {'LAYERS': 'Urbis:Ortho2015'};
				break;
			case 'regional-roads':
				params = {'LAYERS' : 'Urbis:Ss', 'STYLES': 'UrbisSsPolygon',
                	'FILTER': '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"> <ogc:PropertyIsEqualTo matchCase="true">' +
                  	'<ogc:PropertyName>ADMINISTRATOR</ogc:PropertyName>' +
                  	'<ogc:Literal>REG</ogc:Literal>' +
                	'</ogc:PropertyIsEqualTo>' +
              		'</ogc:Filter>'};
			  	break;
			default:
				params = {'LAYERS': this.layerName};
		}
		return new ol.source.TileWMS({
            url: url,
            params: params,
            projection: this.projection,
            serverType: 'geoserver'
        });
	}

	private initCustomWfsSource() {
		return new ol.source.Vector({
			url: this.location,
			format: new ol.format.GeoJSON()
		});
	}

	private _getWfsStyle(feature: ol.Feature | ol.render.Feature) {
		if (this.styles == null) {
			return null;
		}

		let value = feature.get(this.styles.property);
		let default_style = null;
		let current_style = null;
		for (let i in this.styles.values) {
			if (value == this.styles.values[i].value) {
				current_style = this.styles.values[i];
			}

			if (this.styles.values[i].default) {
				default_style = this.styles.values[i];
			}
		}
		let style = null;
		if(current_style) {
			style = current_style;
		} else {
			style = default_style;
		}

		switch (style.type) {
			case 'circle': 
				return new ol.style.Style({
					image: new ol.style.Circle(({
						radius: 5,
						fill: new ol.style.Fill({
                            color: style.fillColor
                        }),
                        stroke: new ol.style.Stroke({
                            color: style.strokeColor
                        })
					}))
        		});
			case 'image':
				return new ol.style.Style({
            		image: new ol.style.Icon(({
                		src: style.url
            		}))
        		});
		}

        return null;
	}

	private initCustomWmsSource() {
		return new ol.source.TileWMS({
			url: this.location,
			params: this.params,
			projection: this.projection,
			serverType: 'geoserver'
        });
	}

	/******************************
	 * CLUSTERS
	 * ****************************/
	private initClusterInteraction() {
		this._clusterInteraction =  new ol.interaction.Select({
			condition: ol.events.condition.singleClick,
            layers: [this._openLayerCluster]
        });
		this._clusterInteraction.set('BricMapId', this.id);
		this._clusterInteraction.setActive(this.cluster);
        this._clusterInteraction.on('select', function(e: any){
            if (e.selected.length > 0) {
                let clust = e.selected[0];
				let features = clust.get('features');
				let extent = features[0].getGeometry().getExtent().slice(0);
				features.forEach(function(feature: ol.Feature)	{
					ol.extent.extend(extent,feature.getGeometry().getExtent())
				});
                this.zoomToCluster(extent);
            }
        }, this);

		this._map.addInteraction(this._clusterInteraction);
	}

	private initFeaturesInteraction() {
		this._featureSelectInteraction =  new ol.interaction.Select({
			condition: ol.events.condition.singleClick,
            layers: [this._openLayerVector],
			multi: false,
			toggleCondition: ol.events.condition.never
        });
		this._featureSelectInteraction.setActive(this.selectable);
		this._featureSelectInteraction.on('select', function(e: any){
			if (e.deselected.length > 0) {
				this._mapEventService.emitEvent(new BricMapEvent(e.deselected[0], this.id, 'unselect'));
            }
			if (e.selected.length > 0) {
				this._mapEventService.emitEvent(new BricMapEvent(e.selected[0], this.id, 'select'));
            }
        }, this);

		this._map.addInteraction(this._featureSelectInteraction);
	}

	private zoomToCluster(extent: ol.Extent) {
		this._clusterInteraction.getFeatures().clear();
        this._map.getView().fit(extent, this._map.getSize());
	}

	private colorLuminance(hex: string, lum: number) {
        // validate hex string
        hex = hex.replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (!lum) {
            lum = 0;
        }

		if(lum > 0.6) {
			lum = 0.6;
		} else if (lum < -0.6) {
			lum = -0.6;
		}
        // convert to decimal and change luminosity
        let rgb = '#', c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ('00' + c).substr(c.length);
        }

        return rgb;
    }

	resetClusterStyles() {
		this._styleCache = {};
		this.refreshSource();
	}

	resetClusterDistance(distance: number) {
		let clusterSource = new ol.source.Cluster({
			distance: this.clusterDistance,
			source: this._openLayerVector.getSource()
		});
		this._openLayerCluster.setSource(clusterSource);
		this.refreshSource();
	}

	private refreshSource() {
		if(this._openLayerObject instanceof ol.layer.Group){
			this._openLayerVector.getSource().changed();
		} else {
			this._openLayerObject.getSource().changed();
		}
	}

	/******************************
	 * GETTERS
	 * ****************************/

	getOpenlayerObject(currentZoom: number = 0) {
		if (!this._openLayerObject) {
			this.initOpenLayerObject(currentZoom);
		}
		return this._openLayerObject;
	}

	getClusterInteraction() {
		return this._clusterInteraction;
	}

	getFeaturesInteraction() {
		return this._featureSelectInteraction;
	}

	/******************************
	 * SETTERS
	 * ****************************/
	setMap (map: ol.Map) {
		this._map = map;
	}

	setMapEventService(service : MapEventService) {
		this._mapEventService = service;
	}

}
