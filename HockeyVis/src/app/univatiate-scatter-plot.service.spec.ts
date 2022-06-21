import { TestBed } from '@angular/core/testing';

import { UnivatiateScatterPlotService } from './univatiate-scatter-plot.service';

describe('UnivatiateScatterPlotService', () => {
  let service: UnivatiateScatterPlotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnivatiateScatterPlotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
