import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropDialog } from './crop.dialog';

describe('CropDialog', () => {
  let component: CropDialog;
  let fixture: ComponentFixture<CropDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
