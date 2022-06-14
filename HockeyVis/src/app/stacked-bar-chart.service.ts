import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import * as d3 from 'd3';
import { environment } from 'src/environments/environment';
interface StackedChart{
	goals: number,
	shots: number,
	misses: number,
	blocked: number,
	year: number
}
@Injectable({
  providedIn: 'root'
})
export class StackedBarChartService {
	private w: number = 600;
	private h: number = 400;
	private margin = {top: 10, right: 50, bottom: 60, left: 100};
	private width = this.w - this.margin.left - this.margin.right;
	private height = this.h - this.margin.top - this.margin.bottom;


	private data: StackedChart[];
	

	constructor(private http: HttpClient){
		this.data = new Array<StackedChart>()
		this.loadData()
		this.createChart()
	}

	// ngOnInit() {
	// 	this.stack = d3.stack()
	// 		.keys(['goals','shots','misses','blocked'])

	// 	this.initScales();
	// 	this.initSvg();
	// 	// this.createStack(this.data);
	// 	// this.drawAxis();
	// }

	private loadData(){
		const fileDirectory = '/assets/shot_data.csv'
		this.http.get(environment.host + fileDirectory, {responseType: 'text'})
				.subscribe(data => this.parseData(data));
	}

	private parseData(data: string){
		const list = data.split('\n')
		for (const season of list.slice(1, list.length -1)){
			let bar : StackedChart = {
				goals: 0,
				shots: 0,
				misses: 0,
				blocked: 0,
				year: 0
			}
		  	const line = season.split(',')
			bar.year = Number(line[0])
			bar.shots = Number(line[1])
			bar.misses = Number(line[2])
			bar.blocked = Number(line[3])
			bar.goals = Number(line[4])
			this.data.push(bar)
		}
	}

	private createChart(){
		var svg = d3.select("#stackedBar")
			.append("svg")
			.attr('class', 'stacked-chart')
			.attr("width", this.width)
			.attr("height", this.height)
			.append("g")

		var xScale = d3.scaleLinear()
			.domain(this.data.map(function(d) { return d.year; }))
			.range([0, this.width]);
  
		let max = 0
		this.data.forEach(d => {
			if (d.goals + d.misses + d.shots + d.blocked > max) {
				max = d.goals + d.misses + d.shots + d.blocked
			}
		})
	 	var yScale = d3.scaleLinear()
			.domain([0, max])
			.range([this.height, 0]);

		var yAxis = d3.axisLeft(yScale)
  
	  	var xAxis = d3.axisBottom(xScale)
  
	  	svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
  
	 	svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + this.height + ")")
			.call(xAxis);
		svg.append('text')
			.attr('x', this.width/2)
			.attr('y', this.height + 30)
			.attr('text-anchor', 'middle')
			.style('font-family', 'Helvetica')
			.style('font-size', 12)
			.text('Year');
		svg.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'translate(-30,' + this.height/2 + ')rotate(-90)')
			.style('font-family', 'Helvetica')
			.style('font-size', 12)
			.text('Shots');

		var colors = ['#7FFFD4', '#D2691E', '#8B0000', '#808080'];
		// var groups = svg.selectAll("g.bars")
		// 	.data(this.data)
		// 	.enter().append("g")
		// 	.attr("class", "bars")
		// 	.style("fill", function(d, i) { return colors[i]; })
		// 	.style("stroke", "#000");
		// var rect = groups.selectAll("rect")
		// 	.data(function(d) { return d; })
		// 	.enter()
		// 	.append("rect")
		// 	.attr("x", function(d) { return xScale(d.x); })
		// 	.attr("y", function(d) { return yScale(d.y0 + d.y); })
		// 	.attr("height", function(d) { return yScale(d.y0) - yScale(d.y0 + d.y); })
	}

}
