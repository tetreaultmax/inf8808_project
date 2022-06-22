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
			return String(d['year'])
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
		var margin = 50;
		var marginTop = 50
		var marginSide = 100
		var width = 0.9 * window.innerWidth;
		var height = 0.8* window.innerHeight;
		var widthChart = 0.7 * width
		var heightChart = 0.9 * height
		var svg = d3.select("#lineChart")
			.append("svg")
			.attr('class', '.lineChart')
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("width", widthChart)
			.attr("height",heightChart)
			.attr("transform", 'translate(' + 1.2*marginSide + ',' + marginTop + ')')

		const yScale = d3.scaleLinear().domain([0, max]).range([heightChart - margin, 0])
		const xDomain = d3.sort(Array.from(new d3.InternSet(X)))
		const xScale = d3.scaleBand().domain(xDomain).range([0, widthChart])
		const xAxis = d3.axisBottom(xScale)
		const yAxis = d3.axisLeft(yScale)
		svg.append("g")
			.attr("class", "y axis")
			.style('font-family', 'Helvetica')
			.style('font-size', 20)
			.call(yAxis);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(" + -40 + "," + (heightChart - margin) + ")")
			.style('font-family', 'Helvetica')
			.style('font-size', 20)
			.call(xAxis);
		svg.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'translate(' + widthChart/2 + ',' + (heightChart) + ')')
			.style('font-family', 'Helvetica')
			.style('font-size', 20)
			.text('Nombres de points');
		svg.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'translate(' + -2 * marginTop + ',' + (heightChart - margin)/2 + ')rotate(-90)')
			.style('font-family', 'Helvetica')
			.style('font-size', 20)
			.text('Saisons');
		const lineGroup = svg.append('g').append('path').attr('id', 'line').style('fill', 'none').style('stroke', 'red').style('stroke-width', '2px')
		const line = d3.line().x(d => d[0]).y(d => d[1])
		const points: [number, number][] = data.map(d => [
			Number(xScale(String(d['year']))),
			yScale(Number(d['points'])),
		])
		lineGroup.attr('d', line(points))
	})
  }
}
