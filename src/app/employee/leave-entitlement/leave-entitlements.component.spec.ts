import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveEntitlementsComponent } from './leave-entitlement.component';


describe('LeaveEntitlementsComponent', () => {
  let component: LeaveEntitlementsComponent;
  let fixture: ComponentFixture<LeaveEntitlementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveEntitlementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveEntitlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
