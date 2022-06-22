import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { YEARS } from 'src/assets/constants';

@Component({
  selector: 'app-slope-chart',
  templateUrl: './slope-chart.component.html',
  styleUrls: ['./slope-chart.component.css']
})
export class SlopeChartComponent implements OnInit {

  constructor() { }
  ngOnInit() {
	const path = "/assets/stats/all_stats_players.csv"
	d3.csv(path).then(data =>{
		const X = data.map(d => {
			return d['year']
		})
		const Y = data.map(d => {
			return Number(d['points'])
		})
		const Z = data.map(d => {
			return d['player']
		})
	})
  }
}
