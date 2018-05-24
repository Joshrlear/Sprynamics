import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAgentsDialogComponent } from './import-agents-dialog.component';

describe('ImportAgentsDialogComponent', () => {
  let component: ImportAgentsDialogComponent;
  let fixture: ComponentFixture<ImportAgentsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAgentsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAgentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
