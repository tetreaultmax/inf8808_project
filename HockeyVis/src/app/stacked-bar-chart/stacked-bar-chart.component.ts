import { Component, HostListener, OnInit } from '@angular/core';
import { StackedBarChartService } from '../stacked-bar-chart.service';

@Component({
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.css']
})
export class StackedBarChartComponent implements OnInit {

	constructor(private stackedBarService : StackedBarChartService) {
	}

  ngOnInit() {
  }

}
