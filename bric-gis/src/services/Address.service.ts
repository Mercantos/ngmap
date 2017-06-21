import {Injectable, Inject} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from 'util';

@Injectable()
export class AddressService {

  SRS = '31370';
  GET_ADDRESS_SERVICE_URL: string = 'https://geoservices.irisnet.be/localization/Rest/localize/getaddresses';
  GET_ADDRESS_FROM_X_Y_SERVICE_URL: string = 'https://geoservices-urbis.irisnet.be/geoserver/wfs';

  constructor(
      private http: Http
  ) {
  }
  getAddresses(address: string, lang: string): Observable <any> {
    return this.http.get(this.GET_ADDRESS_SERVICE_URL + '?language=' + lang + '&address=' + address
      + '&spatialReference=' + this.SRS);
  }

  getAdressFromXY(point: any, lang: string): Observable <any> {
    let json = {
      'language': lang,
      'point': {
        'x': point.x,
        'y': point.y,
      },
      'SRS_In': this.SRS
    };

    return this.http.get(this.GET_ADDRESS_FROM_X_Y_SERVICE_URL + 'from-xy?json=' + encodeURIComponent(JSON.stringify(json))).map(res => res.json().result);
  }

  /*
  areCoordinatesInBruxellesArea(point: Coordinates) {
    return this.http.get(this.gisProxyUrl + 'wfs' + Constants.verifyAddressInBruxellesFirst + point.x + ',' + point.y + Constants.verifyAddressInBruxellesSecond);
  }

  getStreetCoordinates(adncs: string) {
      let url = this.gisProxyUrl + 'ows' + Constants.streetCoordinatesUrl.replace('[[ADNCS]]', adncs);
      return this.http.get(url).map(res => res.json());
  }
  */
}
