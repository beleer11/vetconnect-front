import { TestBed } from '@angular/core/testing';

import { GenerateExcelService } from './generate-excel.service';

describe('GenerateExcelService', () => {
  let service: GenerateExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
