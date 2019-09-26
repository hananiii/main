import { TestBed } from '@angular/core/testing';

import { UpdatePasswordApiService } from './update-password-api.service';

describe('UpdatePasswordApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdatePasswordApiService = TestBed.get(UpdatePasswordApiService);
    expect(service).toBeTruthy();
  });
});
