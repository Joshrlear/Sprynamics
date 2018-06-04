import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingWindowComponent } from './processing-window.component';

describe('ProcessingWindowComponent', () => {
  let component: ProcessingWindowComponent;
  let fixture: ComponentFixture<ProcessingWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
