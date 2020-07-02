import { TestBed } from '@angular/core/testing';

import { LeavePlanningAPIService } from './leave-planning-api.service';

describe('LeavePlanningApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeavePlanningAPIService = TestBed.get(LeavePlanningAPIService);
    expect(service).toBeTruthy();
  });
});
