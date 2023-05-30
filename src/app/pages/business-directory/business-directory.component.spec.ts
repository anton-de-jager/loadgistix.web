import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDirectoryComponent } from './business-directory.component';

describe('BusinessDirectoryComponent', () => {
  let component: BusinessDirectoryComponent;
  let fixture: ComponentFixture<BusinessDirectoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessDirectoryComponent]
    });
    fixture = TestBed.createComponent(BusinessDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
