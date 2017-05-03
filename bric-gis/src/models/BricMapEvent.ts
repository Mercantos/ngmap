
export class BricMapEvent {
	[key:string]: any;
    feature: ol.Feature;
    layer: string;
    action: string

    constructor(feature: ol.Feature, layer: string, action: string) {
        this.feature = feature;
        this.layer = layer;
        this.action = action;
    }
}
