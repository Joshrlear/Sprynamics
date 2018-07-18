import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerDevComponent } from './designer-dev.component';

describe('DesignerdevComponent', () => {
  let component: DesignerDevComponent;
  let fixture: ComponentFixture<DesignerDevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerDevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
