import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePlanningComponent } from './leave-planning.component';

describe('LeavePlanningComponent', () => {
  let component: LeavePlanningComponent;
  let fixture: ComponentFixture<LeavePlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavePlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
