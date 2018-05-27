import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListDialog } from './view-list.dialog';

describe('ViewListDialog', () => {
  let component: ViewListDialog;
  let fixture: ComponentFixture<ViewListDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewListDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewListDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
