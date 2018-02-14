import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingListDialogComponent } from './mailing-list-dialog.component';

describe('MailingListDialogComponent', () => {
  let component: MailingListDialogComponent;
  let fixture: ComponentFixture<MailingListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailingListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
