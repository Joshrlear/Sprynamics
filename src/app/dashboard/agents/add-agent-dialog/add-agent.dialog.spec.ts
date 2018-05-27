import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgentDialog } from './add-agent.dialog';

describe('AddAgentDialog', () => {
  let component: AddAgentDialog;
  let fixture: ComponentFixture<AddAgentDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAgentDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAgentDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
