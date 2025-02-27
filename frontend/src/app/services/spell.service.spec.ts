import { TestBed } from '@angular/core/testing';

import { SpellService } from './spell.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SpellService', () => {
  let service: SpellService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SpellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
