import { TestBed } from '@angular/core/testing';

import { CreateCharacterService } from './create-character.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateCharacterService', () => {
  let service: CreateCharacterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CreateCharacterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
