import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnivariateScatterPlotComponent } from './univariate-scatter-plot.component';

describe('UnivariateScatterPlotComponent', () => {
  let component: UnivariateScatterPlotComponent;
  let fixture: ComponentFixture<UnivariateScatterPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnivariateScatterPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnivariateScatterPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
