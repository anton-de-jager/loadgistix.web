import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLeafletComponent } from './map-leaflet.component';

describe('MapLeafletComponent', () => {
  let component: MapLeafletComponent;
  let fixture: ComponentFixture<MapLeafletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapLeafletComponent]
    });
    fixture = TestBed.createComponent(MapLeafletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
