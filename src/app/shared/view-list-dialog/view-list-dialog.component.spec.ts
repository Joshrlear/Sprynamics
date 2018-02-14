import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListDialogComponent } from './view-list-dialog.component';

describe('ViewListDialogComponent', () => {
  let component: ViewListDialogComponent;
  let fixture: ComponentFixture<ViewListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
