/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StackedBarChartService } from './stacked-bar-chart.service';

describe('Service: StackedBarChart', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StackedBarChartService]
    });
  });

  it('should ...', inject([StackedBarChartService], (service: StackedBarChartService) => {
    expect(service).toBeTruthy();
  }));
});
