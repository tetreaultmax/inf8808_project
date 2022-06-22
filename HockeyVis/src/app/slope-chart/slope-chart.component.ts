import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-slope-chart',
  templateUrl: './slope-chart.component.html',
  styleUrls: ['./slope-chart.component.css']
})
export class SlopeChartComponent implements OnInit {

  constructor() { }
  ngOnInit() {
	const path = "/assets/stats/top_players_year.csv"
	d3.csv(path).then(data =>{
		const X = data.map(d => {
			return Number(d['year'])
		})
		let max = 0
		const Y = data.map(d => {
			if (Number(d['points']) > max){
				max = Number(d['points'])
			}
			return Number(d['points'])
		})
		const Z = data.map(d => {
			return String(d['player'])
		})
		// const marginTop = 20 // top margin, in pixels
		// const marginRight = 30 // right margin, in pixels
		// const marginBottom = 20 // bottom margin, in pixels
		// const marginLeft = 30 // left margin, in pixels
		// const width = 640 // outer width, in pixels
		// const height = 400
		// const xRange = [marginLeft, width - marginRight]
		// const xPadding = 0.5
		// const yRange = [height - marginBottom, marginTop]
		// var xDomain = X
		// var zDomain = Z
		// xDomain = Array.from(new d3.InternSet(xDomain))
		// zDomain = Array.from(new d3.InternSet(zDomain))
		// const xScale = d3.scalePoint(xDomain, xRange).padding(xPadding);
 		// const yScale = d3.scaleLinear([0, max], yRange);
  		// const xAxis = d3.axisTop(xScale).tickSizeOuter(0);
  		// const yFormat = yScale.tickFormat(100);
		// const line = d3.line().x((d,i) => xScale(X[i])).y((d,i) => yScale(Y[i]));
	})
  }
}
