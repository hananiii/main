import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardCertificationComponent } from './award-certification.component';

describe('AwardCertificationComponent', () => {
  let component: AwardCertificationComponent;
  let fixture: ComponentFixture<AwardCertificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardCertificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
