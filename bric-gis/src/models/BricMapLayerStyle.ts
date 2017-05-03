
export class BricMapLayerStyle {
	[key:string]: any;
    property: string;
    values: BricMapLayerStyleElement[]
}


export class BricMapLayerStyleElement {
	[key:string]: any;
    type: string;
    value?: any;
    fillColor?: string;
    strokeColor?: string = '';
    url?: string;
    default?: boolean = false;
}
