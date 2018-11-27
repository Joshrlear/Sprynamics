import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadTemplateDialogComponent } from './load-template-dialog.component';

describe('LoadTemplateDialogComponent', () => {
  let component: LoadTemplateDialogComponent;
  let fixture: ComponentFixture<LoadTemplateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadTemplateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
