import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BricMapComponent } from './src/bricMap.component';
import * as ol from 'openlayers';
import * as proj4 from 'proj4';
import { MapEventService } from './src/MapEvent.service';


export * from './src/bricMap.component';
export * from './src/models/BricMapConfig';
export * from './src/models/BricMapLayer';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BricMapComponent
  ],
  exports: [
    BricMapComponent
  ],
  providers: [MapEventService]
})
export class BricGisModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BricGisModule,
      providers: []
    };
  }
}
