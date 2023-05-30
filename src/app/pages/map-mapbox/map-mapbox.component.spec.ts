import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMapboxComponent } from './map-mapbox.component';

describe('MapMapboxComponent', () => {
  let component: MapMapboxComponent;
  let fixture: ComponentFixture<MapMapboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapMapboxComponent]
    });
    fixture = TestBed.createComponent(MapMapboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
