import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplicationConfirmationComponent } from './leave-application-confirmation.component';

describe('LeaveApplicationConfirmationComponent', () => {
  let component: LeaveApplicationConfirmationComponent;
  let fixture: ComponentFixture<LeaveApplicationConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveApplicationConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveApplicationConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
