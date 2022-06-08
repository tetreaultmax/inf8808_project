import { TestBed } from '@angular/core/testing';

import { BackToBackService } from './back-to-back.service';

describe('BackToBackService', () => {
  let service: BackToBackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackToBackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
