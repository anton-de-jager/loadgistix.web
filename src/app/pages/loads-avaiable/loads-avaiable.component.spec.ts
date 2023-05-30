import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadsAvaiableComponent } from './loads-avaiable.component';

describe('LoadsAvaiableComponent', () => {
  let component: LoadsAvaiableComponent;
  let fixture: ComponentFixture<LoadsAvaiableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadsAvaiableComponent]
    });
    fixture = TestBed.createComponent(LoadsAvaiableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
