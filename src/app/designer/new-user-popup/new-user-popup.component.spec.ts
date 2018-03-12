import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserPopupComponent } from './new-user-popup.component';

describe('NewUserPopupComponent', () => {
  let component: NewUserPopupComponent;
  let fixture: ComponentFixture<NewUserPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
