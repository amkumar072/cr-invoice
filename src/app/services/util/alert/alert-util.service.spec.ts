import { TestBed } from '@angular/core/testing';

import { AlertUtilService } from './alert-util.service';

describe('AlertUtilService', () => {
  let service: AlertUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
