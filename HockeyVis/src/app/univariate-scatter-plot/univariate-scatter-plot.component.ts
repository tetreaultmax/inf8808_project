import { Component, OnInit } from '@angular/core';
import { UnivatiateScatterPlotService } from '../univatiate-scatter-plot.service';

@Component({
  selector: 'app-univariate-scatter-plot',
  templateUrl: './univariate-scatter-plot.component.html',
  styleUrls: ['./univariate-scatter-plot.component.css'],
  providers: [UnivatiateScatterPlotService]
})
export class UnivariateScatterPlotComponent implements OnInit {

  constructor(private univatiateScatterPlotService : UnivatiateScatterPlotService) { }

  ngOnInit(): void {
  }

}
