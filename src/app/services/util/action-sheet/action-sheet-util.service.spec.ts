import { TestBed } from '@angular/core/testing';

import { ActionSheetUtilService } from './action-sheet-util.service';

describe('ActionSheetUtilService', () => {
  let service: ActionSheetUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionSheetUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
