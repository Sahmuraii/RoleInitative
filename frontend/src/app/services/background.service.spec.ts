import { TestBed } from '@angular/core/testing';

import { BackgroundService } from './background.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BackgroundService', () => {
  let service: BackgroundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BackgroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
