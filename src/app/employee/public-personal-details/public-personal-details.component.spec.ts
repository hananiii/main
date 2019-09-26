import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPersonalDetailsComponent } from './public-personal-details.component';

describe('PublicPersonalDetailsComponent', () => {
  let component: PublicPersonalDetailsComponent;
  let fixture: ComponentFixture<PublicPersonalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPersonalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
