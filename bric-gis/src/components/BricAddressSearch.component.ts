import { Component, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AddressService } from '../services/Address.service';

@Component({
  selector: 'bric-address-search',
  template: `<input [(ngModel)]="dataSource" 
                [typeahead]="dataSource"
                (typeaheadLoading)="changeTypeaheadLoading($event)"
                (typeaheadNoResults)="changeTypeaheadNoResults($event)"
                (typeaheadOnSelect)="typeaheadOnSelect($event)"
                typeaheadOptionsLimit="7"
                typeaheadOptionField="name"
                placeholder="Locations loaded with timeout" class="form-control"
            />`,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  providers: [AddressService]
})
export class BricAddressSearchComponent {
    public asyncSelected: string;
    public typeaheadLoading: boolean;
    public typeaheadNoResults: boolean;
    public dataSource: Observable<any>;

    public constructor(private _addressService: AddressService) {
    this.dataSource = Observable
      .create((observer: any) => {
        // Runs on every search
        observer.next(this.asyncSelected);
      })
      .mergeMap((token: string) => this.getAddresses(token));
  }

  public getAddresses(token: string): Observable<any> {
    return this._addressService.getAddresses(token, 'fr');
    // Return the observable of the call to the service
  }

  public changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }
 
  public changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }
 
  public typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('Selected value: ', e);
  }

}

