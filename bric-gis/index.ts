import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as ol from 'openlayers';
import * as proj4 from 'proj4';

import { BricMapComponent } from './src/components/bricMap.component';
import { BricAddressSearchComponent } from './src/components/bricAddressSearch.component';

import { MapEventService } from './src/services/MapEvent.service';
import { AddressService } from './src/services/Address.service';

import { TypeaheadModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';


export * from './src/models/BricMapConfig';
export * from './src/models/BricMapLayer';

@NgModule({
  imports: [
    CommonModule,
    TypeaheadModule.forRoot(),
    FormsModule
  ],
  declarations: [
    BricMapComponent,
    BricAddressSearchComponent
  ],
  exports: [
    BricMapComponent,
    BricAddressSearchComponent
  ],
  providers: [
    MapEventService,
    AddressService
  ]
})
export class BricGisModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BricGisModule,
      providers: []
    };
  }
}
