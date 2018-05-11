import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDesignerProgressDialogComponent } from './admin-designer-progress-dialog.component';

describe('AdminDesignerProgressDialogComponent', () => {
  let component: AdminDesignerProgressDialogComponent;
  let fixture: ComponentFixture<AdminDesignerProgressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDesignerProgressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDesignerProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
