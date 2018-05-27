import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingListDialog } from './mailing-list.dialog';

describe('MailingListDialog', () => {
  let component: MailingListDialog;
  let fixture: ComponentFixture<MailingListDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailingListDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingListDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
