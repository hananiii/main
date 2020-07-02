import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyLeaveConfirmationComponent } from './apply-leave-confirmation.component';

describe('ApplyLeaveConfirmationComponent', () => {
  let component: ApplyLeaveConfirmationComponent;
  let fixture: ComponentFixture<ApplyLeaveConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyLeaveConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyLeaveConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
