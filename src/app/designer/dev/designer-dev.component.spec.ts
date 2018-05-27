import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerdevComponent } from './designerdev.component';

describe('DesignerdevComponent', () => {
  let component: DesignerdevComponent;
  let fixture: ComponentFixture<DesignerdevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerdevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerdevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
