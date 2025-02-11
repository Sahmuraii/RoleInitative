import { TestBed } from '@angular/core/testing';

import { CreateCharacterService } from './create-character.service';

describe('CreateCharacterService', () => {
  let service: CreateCharacterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCharacterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
