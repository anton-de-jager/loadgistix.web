import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuthenticateComponent } from './dialog-authenticate.component';

describe('DialogAuthenticateComponent', () => {
  let component: DialogAuthenticateComponent;
  let fixture: ComponentFixture<DialogAuthenticateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAuthenticateComponent]
    });
    fixture = TestBed.createComponent(DialogAuthenticateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
