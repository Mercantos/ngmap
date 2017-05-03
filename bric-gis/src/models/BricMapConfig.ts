
export class BricMapConfig {
    minZoom: number = 8;
	maxZoom: number = 20;
	zoom: number = 14;
	projection: string = 'EPSG:31370';
	center: [number, number] = [149656, 169933.8];
	scaleLine: boolean = false;
	overviewMap: string = null;
}
