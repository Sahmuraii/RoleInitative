import { TestBed } from '@angular/core/testing';

import { UserProfileApiService } from './user-profile-api.service';

describe('UserProfileApiService', () => {
  let service: UserProfileApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfileApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
