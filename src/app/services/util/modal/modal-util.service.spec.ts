import { TestBed } from '@angular/core/testing';

import { ModalUtilService } from './modal-util.service';

describe('ModalUtilService', () => {
  let service: ModalUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
