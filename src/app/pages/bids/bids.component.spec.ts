import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsComponent } from './bids.component';

describe('BidsComponent', () => {
  let component: BidsComponent;
  let fixture: ComponentFixture<BidsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BidsComponent]
    });
    fixture = TestBed.createComponent(BidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
