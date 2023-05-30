import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoriesComponent } from './directories.component';

describe('DirectoriesComponent', () => {
  let component: DirectoriesComponent;
  let fixture: ComponentFixture<DirectoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectoriesComponent]
    });
    fixture = TestBed.createComponent(DirectoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
