import { TestBed } from '@angular/core/testing';

import { FighterResolverService } from './fighter-resolver.service';

describe('FighterResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FighterResolverService = TestBed.get(FighterResolverService);
    expect(service).toBeTruthy();
  });
});
