import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TabsModule } from 'ngx-bootstrap';

import { BricGisModule } from 'bric-gis';
import { HomeComponent } from './components/home/home.component';
import { BasicMapComponent } from './components/basic-map/basic-map.component';
import { ConfigMapComponent } from './components/config-map/config-map.component';
import { WfsMapComponent } from './components/wfs-map/wfs-map.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BasicMapComponent,
    ConfigMapComponent,
    WfsMapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TabsModule.forRoot(),
    BricGisModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
