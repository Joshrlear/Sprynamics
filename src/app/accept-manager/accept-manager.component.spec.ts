import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptManagerComponent } from './accept-manager.component';

describe('AcceptManagerComponent', () => {
  let component: AcceptManagerComponent;
  let fixture: ComponentFixture<AcceptManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
