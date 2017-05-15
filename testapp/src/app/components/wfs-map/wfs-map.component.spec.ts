/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WfsMapComponent } from './wfs-map.component';

describe('WmsMapComponent', () => {
  let component: WfsMapComponent;
  let fixture: ComponentFixture<WfsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
