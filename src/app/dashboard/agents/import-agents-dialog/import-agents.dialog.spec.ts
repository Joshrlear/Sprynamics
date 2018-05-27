import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAgentsDialog } from './import-agents.dialog';

describe('ImportAgentsDialog', () => {
  let component: ImportAgentsDialog;
  let fixture: ComponentFixture<ImportAgentsDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAgentsDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAgentsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
