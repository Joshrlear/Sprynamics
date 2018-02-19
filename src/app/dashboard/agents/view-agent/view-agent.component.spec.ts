import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgentComponent } from './view-agent.component';

describe('ViewAgentComponent', () => {
  let component: ViewAgentComponent;
  let fixture: ComponentFixture<ViewAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
