import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectDialog } from './image-select.dialog';

describe('ImageSelectDialog', () => {
  let component: ImageSelectDialog;
  let fixture: ComponentFixture<ImageSelectDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSelectDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
